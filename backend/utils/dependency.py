from typing import Annotated
import time
import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from backend.models.auth import JWTWrapper, IdTokenJwtPayload
from .exceptions import UnauthorizedException
from .helpers import get_dotenv

def verify_token(cred: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())]):
    token = cred.credentials

    env_var = get_dotenv()

    # blame everything as jwt issue
    try:
        content = JWTWrapper(**jwt.decode(token, env_var["JWT_TOKEN_STR"], ["HS256"]))
        id_token = IdTokenJwtPayload(
            # basically welcoming hackers doing injection attacts
            **jwt.decode(content.token, options={ "verify_signature": False })
        )
        if int(time.time()) > id_token.exp:
            raise UnauthorizedException("error") # propergate downwards
    except Exception as e:
        raise UnauthorizedException("Session Expired: Please login again") from e

    return id_token
