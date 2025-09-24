from sqlmodel import Session, select
import models


# Function pour crée un nouveau channel
def create_channel(session: Session, channel: models.ChannelCreate, owner_id: int):
    db_channel = models.Channel(name=channel.name, desc=channel.desc, owner_id=owner_id)
    session.add(db_channel)
    session.commit()
    session.refresh(db_channel)
    return db_channel


# Function pour get un channel par son id
def get_channel_by_id(session: Session, channel_id: int):
    return session.get(models.Channel, channel_id)


# Function pour get tout les channel
def get_all_channel(session: Session, skip: int = 0, limit: int = 100):
    statement = select(models.Channel).offset(skip).limit(limit)
    return session.exec(statement).all()

# NEW: Funciton pour récupérer un profil par son ID

def get_profil_by_id(session: Session, profil_id: int):
    return session.get(models.Profil, profil_id)

# NEW: Function pour ajouter un membre à un channel

def add_member_to_channel(session: Session, channel: models.Channel, profil: models.Profil):
    channel.members.append(profil)
    session.add(channel)
    session.commit()
    session.refresh(channel)
    return channel

# TODO: Function pour crée les message directement dans le channel