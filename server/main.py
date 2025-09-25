from datetime import timedelta  # type: ignore
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    status,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
import json
import security
import auth
import crud
from connection_manager import manager
from models import (
    ProfilCreate,
    ProfilPublic,
    Token,
    Profil,
    ChannelCreate,
    ChannelPublic,
    ChannelPublicWitchDetails,
    MemberAdd,
    MessageCreate,
    MessagePublic,
)
from database import get_session, create_db_and_tables

# --- Init de l'app FastAPI ---


app = FastAPI(title="Ara Chat", version="0.0.7", on_startup=[create_db_and_tables])

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


# TODO: Modifier le systeme d'auth pour y intégrer des cookie qui pourront être utiliser pour le websocket
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


# Endpoint qui return les info d'un profil connecter
@app.get("/profils/me", response_model=ProfilPublic)
async def read_profil_me(current_profil: Profil = Depends(auth.get_current_profil)):
    return current_profil


# Endpoint pour return les info d'un profil via son ID
@app.get("/profil/{profil_id}", response_model=ProfilPublic)
async def get_profil_by_id(
    profil_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_profil = crud.get_profil_by_id(session=session, profil_id=profil_id)
    if db_profil is None:
        raise HTTPException(status_code=404, detail="Profil non trouvé")

    return db_profil


# Endpoint pour supprimer un profil via son ID
@app.delete("/profil/{profil_id}/delete", response_model=MessageCreate)
async def del_profil_by_id(
    profil_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    # Seul l'utilisateur lui même pourra supprimer son profil
    if current_profil.id != profil_id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    db_profil_to_del = crud.del_profil_by_id(session=session, profil_id=profil_id)
    if db_profil_to_del is None:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    return {
        "message": f"Le profil '{db_profil_to_del.name}' a été supprimer avec succès."
    }


# Endpoint pour crée un nouveau channel
@app.post("/channel/", response_model=ChannelPublic)
async def create_new_channel(
    channel_data: ChannelCreate,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    return crud.create_channel(
        session=session, channel=channel_data, owner_id=current_profil.id
    )


# Endpoint pour get la liste des channels
@app.get("/channels/", response_model=list[ChannelPublic])
async def get_channels_list(
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    channels = crud.get_all_channel(session=session)
    return channels


# Endpoint pour get les details d'un channel
@app.get("/channels/{channel_id}", response_model=ChannelPublicWitchDetails)
async def get_channel_details(
    channel_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if db_channel is None:
        raise HTTPException(status_code=404, detail="Channel non trouvé")

    is_public = db_channel.owner_id is None
    is_member = current_profil in db_channel.members
    is_owner = db_channel.owner_id == current_profil.id

    if not (is_public or is_member or is_owner):
        raise HTTPException(status_code=403, detail="Accès à ce channel non autorisé")

    return db_channel


# Endpoint pour supprimer un channel via son ID
@app.delete("/channels/{channel_id}/delete", response_model=MessageCreate)
async def del_channel_by_id(
    channel_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    # Seul un owner peut supprimer son channel
    if db_channel.owner_id != current_profil.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    db_channel_to_del = crud.del_channel_by_id(session=session, channel_id=channel_id)
    if db_channel_to_del is None:
        raise HTTPException(status_code=404, detail="Channel non trouvé")
    return {
        "message": f"Le profil '{db_channel_to_del.name}' a été supprimer avec succès."
    }


# Endpoint pour ajouter un membre à un channel
@app.post("/channels/{channel_id}/members", response_model=ChannelPublicWitchDetails)
async def add_member_to_a_channel(
    channel_id: int,
    member_to_add: MemberAdd,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if db_channel is None:
        raise HTTPException(status_code=404, detail="Channel non Trouvé")

    if db_channel.owner_id != current_profil.id:
        raise HTTPException(
            status_code=403, detail="Seul le propriétaire peux ajouter des membres"
        )

    profil_to_add = crud.get_profil_by_id(
        session=session, profil_id=member_to_add.profil_id
    )
    if not profil_to_add:
        raise HTTPException(status_code=404, detail="Utilisateur à ajouter non trouvé.")

    if profil_to_add in db_channel.members:
        raise HTTPException(
            status_code=400, detail="Cet utilisateur est déjà membres du channel"
        )

    updated_channel = crud.add_member_to_channel(
        session=session, channel=db_channel, profil=profil_to_add
    )
    return updated_channel


# Endpoint pour supprimer un membre d'un channel
@app.delete(
    "/channels/{channel_id}/member/delete", response_model=ChannelPublicWitchDetails
)
async def del_member_in_channel(
    channel_id: int,
    member_to_del: MemberAdd,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if not db_channel:
        raise HTTPException(status_code=404, detail="Channel non trouvé.")
    if db_channel.owner_id != current_profil.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé.")

    profil_to_remove = crud.get_profil_by_id(
        session=session, profil_id=member_to_del.profil_id
    )
    if not profil_to_remove:
        raise HTTPException(status_code=404, detail="Membre à supprimer non trouver.")
    if db_channel.owner_id == profil_to_remove.id:
        raise HTTPException(
            status_code=400,
            detail="Le propriétaire ne peux pas être retiré du channel.",
        )
    if profil_to_remove not in db_channel.members:
        raise HTTPException(
            status_code=400, detail="Cet utilisateur n'est pas membre du channel."
        )
    updated_channel = crud.del_member_in_channel(
        session=session, channel=db_channel, profil=profil_to_remove
    )
    return updated_channel


# Endpoint pour poster un msg dans un channel
@app.post("/channels/{channel_id}/messages", response_model=MessagePublic)
async def create_new_message_in_channel(
    channel_id: int,
    message_data: MessageCreate,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if db_channel is None:
        raise HTTPException(status_code=404, detail="Channel non trouvé.")

    is_public = db_channel.owner_id is None
    is_member = current_profil in db_channel.members
    is_owner = db_channel.owner_id == current_profil.id
    if not (is_public or is_member or is_owner):
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas l'autorisation de poster dans ce channel",
        )

    new_message = crud.create_message_in_channel(
        session=session,
        message_data=message_data,
        channel_id=channel_id,
        author_id=current_profil.id,
    )

    return new_message


# NEW: Endpoint pour supprimer un message d'un channel
@app.delete(
    "/channels/{channel_id}/message/{message_id}/delete",
    response_model=MessageCreate,
)
async def del_message_in_channel(
    channel_id: int,
    message_id: int,
    session: Session = Depends(get_session),
    current_profil: Profil = Depends(auth.get_current_profil),
):
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if not db_channel:
        raise HTTPException(status_code=404, detail="Channel non trouvé.")
    db_message = crud.get_message_by_id(session=session, message_id=message_id)
    if not db_message:
        raise HTTPException(status_code=404, detail="Message non trouvé.")
    if db_message.channel_id != channel_id:
        raise HTTPException(
            status_code=403,
            detail="Accès non autorisé: le message n'appartient pas à ce channel.",
        )

    is_author = db_message.author_id == current_profil.id
    is_channel_owner = db_channel.owner_id == current_profil.id
    is_admin = current_profil.id == 1

    if not (is_author or is_channel_owner or is_admin):
        raise HTTPException(
            status_code=403,
            detail="Accès non autorisé: vous n'êtes ni auteur du message ni propriétaire du channel",
        )

    deleted_message = crud.del_message_by_id(session=session, message_id=message_id)
    if not deleted_message:
        raise HTTPException(
            status_code=404, detail="Le message supprimer n'a pas été trouvé."
        )

    return {"message": "Message supprimé."}


# TODO: Faire en sorte qu'un utilisateur ne puisse voir que les channel dont il a accès (Possible nouvel endpoint channel list OU pas)


# TODO: Mofifier websocket pour qu'il fonctionne via cookies et non token (les cookies c'est bon après tout :3)
# Ajout d'un nouvel endpoint pour le websocket ("L'url à notez sera ws:// et non http://")
# /!\ Non testé, aucune idée de si cela fonctionne correctement. /!\
# PS: Aucune idée de comment cela fonctionne coté front :3
@app.websocket("/ws/{channel_id}/{token}")
async def websocket_endpoint(
    websocket: WebSocket,
    channel_id: int,
    token: str,
    session: Session = Depends(get_session),
):
    # Première étape: Auth l'user via le token
    try:
        current_profil = auth.get_current_profil(token=token, session=session)
    except HTTPException:
        # Token invalide > Ont refuse alors la connexion
        await websocket.close(code=1008)
        return

    # Deuxième étape: Ont vérifie que l'user à bien accès au channel
    db_channel = crud.get_channel_by_id(session=session, channel_id=channel_id)
    if not db_channel:
        await websocket.close(code=1007)
        return

    is_public = db_channel.owner_id is None
    is_member = current_profil in db_channel.members
    is_owner = db_channel.owner_id == current_profil.id
    if not (is_public or is_member or is_owner):
        await websocket.close(code=1008)
        return

    # Troisième étape: Ont accèpte et ont gère la connexion si tout est bon
    await manager.connect(websocket, channel_id)
    try:
        # Petite boucle infinie pour listen les msg du client
        while True:
            data = await websocket.receive_text()
            msg_data = json.loads(data)
            # Ici ont sauvegarde les msg en DATABASE
            new_msg = crud.create_message_in_channel(
                session=session,
                message_data=MessageCreate(message=msg_data["message"]),
                channel_id=channel_id,
                author_id=current_profil.id,
            )
            # On formate un msg en JSON à renvoyer à tous les users connectés
            response_message = {
                "id": new_msg.id,
                "message": new_msg.message,
                "author_name": current_profil.name,
                "author_id": current_profil.id,
                "created_at": new_msg.created_at.isoformat(),
            }
            # On diffuse le msg
            await manager.broadcast(json.dumps(response_message), channel_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel_id)
    except Exception as e:
        print(f"Erreur WebSocket: {e}")
        manager.disconnect(websocket, channel_id)

# BUG: A reproduire, il semble que si un channel est supprimer, ses message subsiste, ce qui cause un problème 