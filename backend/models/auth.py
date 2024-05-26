# Request and response models used by endpoint /auth

from pydantic import BaseModel

class OAuthResponseBody(BaseModel):
    access_token: str
