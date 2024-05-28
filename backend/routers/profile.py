from fastapi import APIRouter, Depends
from backend.utils.dependency import verify_token
from backend.models.auth import IdTokenJwtPayload
from backend.models.profile import GetProfileResponse

profile_router = APIRouter(prefix="/profile")

# A very cheesy db less way of doing it
@profile_router.get("")
def profile(token_payload: IdTokenJwtPayload = Depends(verify_token)) -> GetProfileResponse:
    return {
        "first_name": token_payload.given_name,
        "last_name": token_payload.family_name,
        "profile_link": token_payload.picture
    }
