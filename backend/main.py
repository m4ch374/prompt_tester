from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, profile, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://prompt.henrywan.dev",
        "https://prompt-tester-lovat.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def global_exception_handler(request: Request, nxt):
    try:
        print("Request origin:", request.headers.get("origin"))  # Add this line
        res = await nxt(request)
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Exception occured at {request.url.path}")
        print(e)
        return JSONResponse(
            status_code=500, content={"reason": "Error occured in server"}
        )
    return res


app.include_router(auth.auth_router)
app.include_router(profile.profile_router)
app.include_router(chat.chat_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
