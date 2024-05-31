from typing import Literal
from pydantic import BaseModel, Field

class MessageStruct(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str

class GenerateChatRequest(BaseModel):
    conversation_id: int
    system_message: MessageStruct
    user_message: MessageStruct
    model: Literal["gemma-7b-it", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"]
    temperature: float = Field(ge=0, le=2)
    max_tokens: int = Field(ge=0, le=8192)
    top_p: float = Field(ge=0, le=1)
    seed: int | None = Field(default=None)

class DeleteConversationRequest(BaseModel):
    conversation_id: int

# same as above, typed out for future expansion
class GetChatSettingsRequest(BaseModel):
    conversation_id: int

# copy and pasted.., using subclass is too overkill
class GetChatSettingsResponse(BaseModel):
    model: Literal["gemma-7b-it", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"]
    temperature: float = Field(ge=0, le=2)
    max_tokens: int = Field(ge=0, le=8192)
    top_p: float = Field(ge=0, le=1)
    seed: int | None = Field(default=None)
