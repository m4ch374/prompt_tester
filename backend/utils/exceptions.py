# Commonly use exceptions

from typing import Dict
from fastapi import HTTPException

# Error 400
class BadRequestException(HTTPException):
    def __init__(self, reason: str, headers: Dict[str, str] | None = None) -> None:
        super().__init__(400, { "reason": reason }, headers)

# Error 403
class UnauthorizedException(HTTPException):
    def __init__(self, reason: str, headers: Dict[str, str] | None = None) -> None:
        super().__init__(403, { "reason": reason }, headers)
