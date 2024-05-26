import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/auth")
def read_item(access_code: str):
    env_var = dotenv_values(".env")
    resp = requests.post(
        url="https://oauth2.googleapis.com/token",
        data={
            "client_id": env_var["GOOGLE_CLIENT_ID"],
            "client_secret": env_var["GOOGLE_CLIENT_SECRET"],
            "code": access_code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:3000",
        },
        timeout=1
    )

    data = resp.json()
    print(data)

    return {"access_code": access_code}
