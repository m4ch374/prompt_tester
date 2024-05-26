# Commonly use exceptions

from typing import Dict
from fastapi import HTTPException

class BadRequestException(HTTPException):
    def __init__(self, reason: str, headers: Dict[str, str] | None = None) -> None:
        super().__init__(400, { "reason": reason }, headers)
