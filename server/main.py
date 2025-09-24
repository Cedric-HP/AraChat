from datetime import timedelta  # type: ignore
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

import security
import auth
import crud

from models import (
    ProfilCreate,
    ProfilPublic,
    Token,
    Profil,
    ChannelCreate,
    ChannelPublic,
    ChannelPublicWithMessages,
)
from database import get_session, create_db_and_tables

# --- Init de l'app FastAPI ---


app = FastAPI(title="Ara Chat", version="0.0.5", on_startup=[create_db_and_tables])

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS ---


@app.get("/")
async def read_root():
    return {"Server is running..."}


@app.post("/register", response_model=ProfilPublic)
async def register_profil(
    profil_to_create: ProfilCreate, session: Session = Depends(get_session)
):
    existing_profil = auth.get_profil_by_name(session, name=profil_to_create.name)
    if existing_profil:
        raise HTTPException(
            status_code=400, detail="Ce nom d'utilisateur est déjà pris."
        )

    hashed_password = security.get_password_hash(profil_to_create.password)

    db_profil = Profil(
        name=profil_to_create.name,
        birthdate=profil_to_create.birthdate,
        sexe=profil_to_create.sexe,
        hashed_password=hashed_password,
    )
    session.add(db_profil)
    session.commit()
    session.refresh(db_profil)
    return db_profil


@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    profil = auth.get_profil_by_name(session, name=form_data.username)
    if not profil or not security.verify_password(
        form_data.password, profil.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": profil.name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/profils/me", response_model=ProfilPublic)
async def read_profil_me(current_profil: Profil = Depends(auth.get_current_profil)):
    return current_profil


# NEW: Endpoint pour crée un nouveau channel
@app.post("/channel/", response_model=ChannelPublic)
async def create_new_channel(
    channel_data: ChannelCreate,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    return crud.create_channel(
        session=session, channel=channel_data, owner_id=current_profil.id
    )


# NEW: Endpoint pour get la liste des channels
@app.get("/channels/", response_model=list[ChannelPublic])
async def get_channels_list(
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    channels = crud.get_all_channel(session=session)
    return channels

# NEW: Endpoint pour get les details d'un channel
@app.get("/channels/{channel_id}", response_model=ChannelPublicWithMessages)
async def get_channel_details(
    channel_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if db_channel is None:
        raise HTTPException(status_code=404, detail="Channel non trouvé")
    return db_channel