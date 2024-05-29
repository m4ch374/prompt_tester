from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from groq import Groq
from backend.models.auth import IdTokenJwtPayload
from backend.models.chat import GenerateChatRequest
from backend.utils.dependency import verify_token
from backend.utils.helpers import get_dotenv

chat_router = APIRouter(prefix="/chat")

def stream_chat(mychat):
    for chunk in mychat:
        content = chunk.choices[0].delta.content
        yield content or "\n"

# to prevent cache
@chat_router.post("")
def generate_chat(body: GenerateChatRequest, _: IdTokenJwtPayload = Depends(verify_token)):
    # new client instance per request...... I think thats ok
    env_var = get_dotenv()
    client = Groq(api_key=env_var["GROQ_KEY"])

    print(body.model_dump())

    mychat = client.chat.completions.create(**body.model_dump())

    return StreamingResponse(stream_chat(mychat), media_type="text/event-stream")
