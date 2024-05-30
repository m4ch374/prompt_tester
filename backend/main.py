from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .utils.exceptions import ServerErrorException
from .routers import auth, profile, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def global_exception_handler(request: Request, nxt):
    try:
        res = await nxt(request)
    except Exception as e:
        print(f"Exception occured at {request.url.path}")
        print(e)
        raise ServerErrorException("Error occurred in server") from e
    return res

app.include_router(auth.auth_router)
app.include_router(profile.profile_router)
app.include_router(chat.chat_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
