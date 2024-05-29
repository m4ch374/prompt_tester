from typing import Annotated
import time
import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from backend.models.auth import JWTWrapper, IdTokenJwtPayload
from backend.models.database import Base
from .exceptions import UnauthorizedException
from .helpers import get_dotenv

# hmm... probably not the best place to put it
engine = create_engine(get_dotenv()["DB_URL"])
SessionLocal = sessionmaker(bind=engine)

def get_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
