import requests
import jwt
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.utils.helpers import get_dotenv
from backend.utils.dependency import get_db
from backend.models.auth import OAuthResponseBody, AuthResponse, IdTokenJwtPayload, AuthRequest
from backend.utils.exceptions import BadRequestException, ServerErrorException
from backend.models.database import User

auth_router = APIRouter(prefix="/auth")

@auth_router.post("")
# If i read it correctly fastapi is still concurrent under the hood so i guess this is fine
def auth(body: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
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

    if "error" in data:
        raise BadRequestException("Please login with Google account again.")

    try:
        # not verifying bc dont know the secret (probably google's public key)
        decoded = IdTokenJwtPayload(
            **jwt.decode(data.id_token, options={ "verify_signature": False })
        )
    except Exception as e:
        raise BadRequestException("Please login with Google account again.") from e # blame the user

    try:
        print("Users:")
        print(db.query(User).all())

        stmt = select(User).where(User.email == decoded.email)
        if not db.execute(stmt).scalar_one_or_none():
            db.add(User(email=decoded.email))
            db.commit()
    except Exception as e:
        print(e)
        raise ServerErrorException("Erros in database") from e
    finally:
        print(db.query(User).all())
        db.close()

    # this is cheesy
    jwt_token = jwt.encode({ "token": data.id_token }, env_var["JWT_TOKEN_STR"])

    return { "access_token": jwt_token }
