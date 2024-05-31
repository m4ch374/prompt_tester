from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from groq import Groq
from sqlalchemy import select, delete, Sequence
from sqlalchemy.orm import Session
from backend.models.auth import IdTokenJwtPayload
from backend.models.chat import (GenerateChatRequest,
                                 DeleteConversationRequest,
                                 GetChatSettingsRequest,
                                 GetChatSettingsResponse)
from backend.models.database import Conversation, Messages
from backend.utils.dependency import verify_token, get_db
from backend.utils.helpers import get_dotenv
from backend.utils.exceptions import ServerErrorException, BadRequestException

chat_router = APIRouter(prefix="/chat")

def get_original_messages(body: GenerateChatRequest, db: Session):
    original_messages = []
    if body.conversation_id != -1:
        msg_query = (select(Messages)
                        .where(Messages.conversation_id == body.conversation_id)
                        .order_by(Messages.id))
        original_messages = db.execute(msg_query).scalars().all()
    return original_messages

def get_new_messages(original_sys_msg: Sequence[Messages], body: GenerateChatRequest):
    use_provided_sys_msg = (
        len(original_sys_msg) and
        body.system_message.content !=
        original_sys_msg[-1].content
    )
    new_messages = [body.system_message] if use_provided_sys_msg else []
    new_messages.append(body.user_message)
    return new_messages

def stream_chat(mychat):
    yield from mychat

# to prevent cache
# probably async would be better, but im not aware of the pitfalls
@chat_router.post("")
def generate_chat(
    body: GenerateChatRequest,
    token: IdTokenJwtPayload = Depends(verify_token),
    db: Session = Depends(get_db),
):
    env_var = get_dotenv()

    try:
        original_messages = get_original_messages(body, db)
        original_sys_msg = [m for m in original_messages if m.role == "system"]
        new_messages = get_new_messages(original_sys_msg, body)

        # new client instance per request...... I think thats ok
        client = Groq(api_key=env_var["GROQ_KEY"])
        mychat = client.chat.completions.create(
            messages=[m.to_json() for m in original_messages] + new_messages,
            model=body.model,
            seed=body.seed,
            stream=True,
            max_tokens=body.max_tokens,
            temperature=body.temperature,
            top_p=body.top_p
        )

        response = [c.choices[0].delta.content or "\n" for c in mychat] # pylint: disable=not-an-iterable

        db_msg_item = [Messages(role=m.role, content=m.content) for m in new_messages]
        db_msg_item.append(Messages(role="assistant", content="".join(response)))

        if body.conversation_id == -1:
            res = Conversation(
                user_id=token.email,
                model=body.model,
                seed=body.seed,
                temperature=body.temperature,
                max_tokens=body.max_tokens,
                top_p=body.top_p,
            )
            res.messages = db_msg_item
            db.add(res)
            db.flush()

            response = [str(res.id)] + response
        else:
            for m in db_msg_item:
                m.conversation_id = body.conversation_id
            db.add_all(db_msg_item)
            (db.query(Conversation)
             .filter(Conversation.id == body.conversation_id)
             .update({
                "model":body.model,
                "seed": body.seed,
                "temperature": body.temperature,
                "max_tokens": body.max_tokens,
                "top_p": body.top_p,
             }))

        db.commit()
        return StreamingResponse(
            stream_chat(response),
            media_type="text/event-stream",
        )
    except Exception as e:
        print(e)
        raise ServerErrorException("Server Error") from e # lol
    finally:
        db.close()

@chat_router.get("")
def get_all_chats(
    token_body: IdTokenJwtPayload = Depends(verify_token),
    db: Session = Depends(get_db),
):
    try:
        stmt = (select(Conversation)
                .where(Conversation.user_id == token_body.email)
                .order_by(Conversation.id))
        res = db.execute(stmt).scalars().all()

        conversations = []
        for r in res:
            conversations.append({
                "id": r.id,
                "messages": [{ "role": m.role, "content": m.content } for m in r.messages]
            })

        return { "conversations": conversations }
    except Exception as e:
        print(e)
        raise ServerErrorException("Error with database") from e
    finally:
        db.close()

@chat_router.delete("")
def delete_conversation(
    body: DeleteConversationRequest,
    db: Session = Depends(get_db),
    _: IdTokenJwtPayload = Depends(verify_token),
):
    try:
        # forgot cascade delete exists
        del_msg = delete(Messages).where(Messages.conversation_id == body.conversation_id)
        del_convo = delete(Conversation).where(Conversation.id == body.conversation_id)
        db.execute(del_msg)
        db.execute(del_convo)
        db.commit()
        return {}
    except Exception as e:
        print(e)
        raise ServerErrorException("Error with database") from e
    finally:
        db.close()

@chat_router.get("/settings")
def get_chat_settings(
    body: GetChatSettingsRequest,
    db: Session = Depends(get_db),
    _: IdTokenJwtPayload = Depends(verify_token)
) -> GetChatSettingsResponse:
    try:
        # forgot cascade delete exists
        convo = select(Conversation).where(Conversation.id == body.conversation_id)
        convo_res = db.execute(convo).scalar()
        if not convo_res:
            raise BadRequestException("Invalid Conversation")
        return {
            "model": convo_res.model,
            "temperature": convo_res.temperature,
            "max_tokens": convo_res.max_tokens,
            "top_p": convo_res.top_p,
            "seed": convo_res.seed,
        }
    except Exception as e:
        print(e)
        raise ServerErrorException("Error with database") from e
    finally:
        db.close()
