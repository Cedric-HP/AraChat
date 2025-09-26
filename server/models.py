from typing import List, Optional  # type: ignore
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime  # type: ignore

# --- Modèles des données ---

# Table de liaison entre Profil et Channel


class ChannelUserLink(SQLModel, table=True):
    profil_id: Optional[int] = Field(
        default=None, foreign_key="profil.id", primary_key=True
    )
    channel_id: Optional[int] = Field(
        default=None, foreign_key="channel.id", primary_key=True
    )


# --- Modèles Profil ---


class ProfilBase(SQLModel):
    name: str = Field(index=True, unique=True)
    birthdate: str
    sexe: str


class Profil(ProfilBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    channels: List["Channel"] = Relationship(
        back_populates="members", link_model=ChannelUserLink
    )
    messages: List["Message"] = Relationship(back_populates="author")


class ProfilCreate(ProfilBase):
    password: str


class ProfilPublic(ProfilBase):
    id: int


# --- Modèle Token ---


# class Token(SQLModel):
#     access_token: str
#     token_type: str


# --- Modèles Base Message


class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

    # Relation > channel
    channel_id: Optional[int] = Field(default=None, foreign_key="channel.id")
    channel: Optional["Channel"] = Relationship(back_populates="messagelogs")

    # Relation > profil
    author_id: Optional[int] = Field(default=None, foreign_key="profil.id")
    author: Optional[Profil] = Relationship(back_populates="messages")


# Modèles Base Channel


class Channel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    desc: Optional[str] = Field(default=None)
    owner_id: Optional[int] = Field(default=None, foreign_key="profil.id")
    messagelogs: List["Message"] = Relationship(back_populates="channel")
    members: List[Profil] = Relationship(
        back_populates="channels", link_model=ChannelUserLink
    )

# Modèles Channel/Message

class ChannelCreate(SQLModel):
    name: str
    desc: Optional[str] = None

# Modèles pour la creation d'un msg
class MessageCreate(SQLModel):
    message: str

class ChannelPublic(SQLModel):
    id: int
    name: str
    desc: Optional[str] = None
    owner_id: Optional[int]

class MessagePublic(SQLModel):
    id: int
    message: str
    created_at: datetime
    author_id: int

class ChannelPublicWithMessages(ChannelPublic):
    messagelogs: List[MessagePublic] = []

# Rajout d'un model pour afficher les details d'un channel + les membres

class ChannelPublicWitchDetails(ChannelPublicWithMessages):
    members: List[ProfilPublic] = []

# Modèle simple pour avoir l'ID d'un profil à ajouter à un channel
class MemberAdd(SQLModel):
    profil_id: int
