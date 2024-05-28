import requests
import jwt
from fastapi import APIRouter
from backend.utils.helpers import get_dotenv
from backend.models.auth import OAuthResponseBody, AuthResponse, IdTokenJwtPayload, AuthRequest
from backend.utils.exceptions import BadRequestException

auth_router = APIRouter(prefix="/auth")

@auth_router.post("")
def read_item(body: AuthRequest) -> AuthResponse:
    env_var = get_dotenv()
    resp = requests.post(
        url="https://oauth2.googleapis.com/token",
        data={
            "client_id": env_var["GOOGLE_CLIENT_ID"],
            "client_secret": env_var["GOOGLE_CLIENT_SECRET"],
            "code": body.access_code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:3000/auth/callback",
        },
        timeout=5
    )

    data = OAuthResponseBody(**resp.json())
    print(data.model_dump())

    if "error" in data:
        raise BadRequestException("Please login with Google account again.")

    try:
        # not verifying bc dont know the secret (probably google's public key)
        decoded = IdTokenJwtPayload(
            **jwt.decode(data.id_token, options={ "verify_signature": False })
        )
    except Exception as e:
        raise BadRequestException("Please login with Google account again.") from e # blame the user

    # printing it out for now
    print(decoded.model_dump())

    # this is cheesy
    jwt_token = jwt.encode({ "token": data.id_token }, env_var["JWT_TOKEN_STR"])

    return { "access_token": jwt_token }
