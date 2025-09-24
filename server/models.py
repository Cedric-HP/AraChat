from typing import List, Optional # type: ignore
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime # type: ignore

# --- Modèles des données ---


class ProfilBase(SQLModel):
    name: str = Field(index=True, unique=True)
    birthdate: str
    sexe: str


class Profil(ProfilBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class ProfilCreate(ProfilBase):
    password: str

class ProfilPublic(ProfilBase):
    id: int


class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    channel_id: Optional[int] = Field(default=None, foreign_key="channel.id")
    userid: int
    created_at: datetime = Field(default_factory=datetime.now)
    message: str
    channel: Optional["Channel"] = Relationship(back_populates="messagelogs")


class Channel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    desc: Optional[str] = Field(default=None)
    owner: int
    userlist: int
    messagelogs: List["Message"] = Relationship(back_populates="channel")

class Token(SQLModel):
    access_token: str
    token_type: str