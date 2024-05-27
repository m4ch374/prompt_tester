# Request and response models used by endpoint /auth

from pydantic import BaseModel

class AuthRequest(BaseModel):
    access_code: str

class AuthResponse(BaseModel):
    access_token: str

class IdTokenJwtPayload(BaseModel):
    iss: str
    azp: str
    aud: str
    sub: str
    email: str
    email_verified: bool
    at_hash: str
    name: str
    picture: str
    given_name: str
    family_name: str
    iat: int
    exp: int

class OAuthResponseBody(BaseModel):
    access_token: str
    expires_in: int
    scope: str
    token_type: str
    id_token: str
