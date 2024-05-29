from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from groq import Groq
from backend.models.auth import IdTokenJwtPayload
from backend.utils.dependency import verify_token
from backend.utils.helpers import get_dotenv

chat_router = APIRouter(prefix="/chat")

def stream_chat(mychat):
    for chunk in mychat:
        content = chunk.choices[0].delta.content
        yield content or "\n"

# to prevent cache
@chat_router.post("")
def generate_chat(_: IdTokenJwtPayload = Depends(verify_token)):
    # new client instance per request...... I think thats ok
    env_var = get_dotenv()
    client = Groq(api_key=env_var["GROQ_KEY"])

    mychat = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "you are a professor speak lenghily",
            },
            {
                "role": "user",
                "content": "hi"
            },
        ],
        model="llama3-8b-8192",
        temperature=1,
        max_tokens=1024,
        top_p=1,
        seed=1,
        stream=True
    )

    return StreamingResponse(stream_chat(mychat), media_type="text/event-stream")
