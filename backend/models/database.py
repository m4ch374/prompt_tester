from typing import List, Literal
from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Messages(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    role: Mapped[Literal["system", "assistant", "user"]] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id"))
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")

class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(primary_key=True)
    messages: Mapped[List["Messages"]] = relationship()
    model: Mapped[
        Literal["gemma-7b-it", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"]
    ] = mapped_column(Text, default="llama3-8b-8192")
    temperature: Mapped[float] = mapped_column(default=1)
    max_tokens: Mapped[int] = mapped_column(default=1024)
    top_p: Mapped[float] = mapped_column(default=1)
    seed: Mapped[int | None] = mapped_column(default=None, nullable=True)
    stream: Mapped[bool] = mapped_column(default=True)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.email"))
    user: Mapped["User"] = relationship(back_populates="conversations")

class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(Text, nullable=False, primary_key=True, unique=True)

    conversations: Mapped[List["Conversation"]] = relationship()

    def __repr__(self) -> str:
        return f"email: {self.email}"
