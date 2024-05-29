from typing import Literal, Optional
from pydantic import BaseModel, Field

class MessageStruct(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str

class GenerateChatRequest(BaseModel):
    conversation_id: int
    system_message: MessageStruct
    user_message: MessageStruct
    model: Optional[
        Literal["gemma-7b-it", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"]
    ] = Field(default="llama3-8b-8192")
    temperature: Optional[float] = Field(default=1, ge=0, le=1)
    max_tokens: Optional[int] = Field(default=1024)
    top_p: Optional[float] = Field(default=1, ge=0, le=1)
    seed: int | None = None
    stream: bool
