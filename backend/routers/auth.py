import requests
from fastapi import APIRouter
from backend.utils.helpers import get_dotenv
from backend.models.auth import OAuthResponseBody
from backend.utils.exceptions import BadRequestException

auth_router = APIRouter(prefix="/auth")

@auth_router.get("/")
def read_item(access_code: str) -> OAuthResponseBody:
    env_var = get_dotenv()
    resp = requests.post(
        url="https://oauth2.googleapis.com/token",
        data={
            "client_id": env_var["GOOGLE_CLIENT_ID"],
            "client_secret": env_var["GOOGLE_CLIENT_SECRET"],
            "code": access_code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:3000",
        },
        timeout=5
    )

    data = resp.json()
    print(data)

    if "error" in data:
        raise BadRequestException("Please login with Google account again.")

    return { "access_token": data["access_token"] }
