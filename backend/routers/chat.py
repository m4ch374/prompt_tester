from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from groq import Groq
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.models.auth import IdTokenJwtPayload
from backend.models.chat import GenerateChatRequest
from backend.models.database import User, Conversation, Messages
from backend.utils.dependency import verify_token, get_db
from backend.utils.helpers import get_dotenv
from backend.utils.exceptions import ServerErrorException

chat_router = APIRouter(prefix="/chat")

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
        if body.conversation_id != -1:
            raise ServerErrorException("no")

        # new client instance per request...... I think thats ok
        client = Groq(api_key=env_var["GROQ_KEY"])

        new_messages = [body.system_message, body.user_message]

        mychat = client.chat.completions.create(
            messages=new_messages,
            model=body.model,
            stream=True,
        )

        response = [c.choices[0].delta.content or "\n" for c in mychat] # pylint: disable=not-an-iterable

        msg_item = [Messages(role=m.role, content=m.content) for m in new_messages]
        msg_item.append(Messages(role="assistant", content="".join(response)))

        res = Conversation(messages=msg_item, user_id=token.email)
        db.add(res)
        db.commit()
        return StreamingResponse(
            stream_chat([str(res.id)] + response),
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
        stmt = select(User).where(User.email == token_body.email)
        res = db.execute(stmt).scalar()

        print("Conversations:")
        print(res.conversations)
    except Exception as e:
        print(e)
        raise ServerErrorException("Error with database") from e
    finally:
        db.close()

    return { "Hello": "world" }
