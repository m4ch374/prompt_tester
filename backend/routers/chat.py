from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from groq import Groq
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from backend.models.auth import IdTokenJwtPayload
from backend.models.chat import GenerateChatRequest, DeleteConversationRequest
from backend.models.database import Conversation, Messages
from backend.utils.dependency import verify_token, get_db
from backend.utils.helpers import get_dotenv
from backend.utils.exceptions import ServerErrorException

chat_router = APIRouter(prefix="/chat")

def stream_chat(mychat):
    yield from mychat

# to prevent cache
# probably async would be better, but im not aware of the pitfalls
@chat_router.post("")
def generate_chat( # pylint: disable=too-many-locals
    body: GenerateChatRequest,
    token: IdTokenJwtPayload = Depends(verify_token),
    db: Session = Depends(get_db),
):
    env_var = get_dotenv()

    try:
        original_messages = []
        if body.conversation_id != -1:
            msg_query = (select(Messages)
                         .where(Messages.conversation_id == body.conversation_id)
                         .order_by(Messages.id))
            original_messages = db.execute(msg_query).scalars().all()

        original_sys_msg = [m for m in original_messages if m.role == "system"]
        use_provided_sys_msg = (
            len(original_sys_msg) and
            body.system_message.content !=
            original_sys_msg[-1].content
        )
        new_messages = [body.system_message] if use_provided_sys_msg else []
        new_messages.append(body.user_message)

        print(body.model_dump())
        # new client instance per request...... I think thats ok
        client = Groq(api_key=env_var["GROQ_KEY"])
        mychat = client.chat.completions.create(
            messages=[m.to_json() for m in original_messages] + new_messages,
            model=body.model,
            seed=body.seed,
            stream=body.stream,
        )

        response = [c.choices[0].delta.content or "\n" for c in mychat] # pylint: disable=not-an-iterable

        msg_item = [Messages(role=m.role, content=m.content) for m in new_messages]
        msg_item.append(Messages(role="assistant", content="".join(response)))

        if body.conversation_id == -1:
            res = Conversation(user_id=token.email)
            res.messages = msg_item
            db.add(res)
            db.flush()

            response = [str(res.id)] + response
        else:
            for m in msg_item:
                m.conversation_id = body.conversation_id
            db.add_all(msg_item)

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
