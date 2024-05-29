from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, profile, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.auth_router)
app.include_router(profile.profile_router)
app.include_router(chat.chat_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
