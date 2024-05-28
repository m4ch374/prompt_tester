from pydantic import BaseModel

class GetProfileResponse(BaseModel):
    first_name: str
    last_name: str
    profile_link: str
