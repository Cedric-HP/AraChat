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


# Funciton pour récupérer un profil par son ID
def get_profil_by_id(session: Session, profil_id: int):
    return session.get(models.Profil, profil_id)


# Function pour supprimer un profil par son ID
def del_profil_by_id(session: Session, profil_id: int):
    profil_to_del = session.get(models.Profil, profil_id)
    if profil_to_del:
        session.delete(profil_to_del)
        session.commit()
    return profil_to_del


# Function pour ajouter un membre à un channel
def add_member_to_channel(
    session: Session, channel: models.Channel, profil: models.Profil
):
    channel.members.append(profil)
    session.add(channel)
    session.commit()
    session.refresh(channel)
    return channel


# Function pour crée les message directement dans le channel
def create_message_in_channel(
    session: Session,
    message_data: models.MessageCreate,
    channel_id: int,
    author_id: int,
):
    db_message = models.Message(
        message=message_data.message, channel_id=channel_id, author_id=author_id
    )
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


# Function pour supprimer un channel par son ID
def del_channel_by_id(session: Session, channel_id: int):
    channel_to_del = session.get(models.Channel, channel_id)
    if channel_to_del:
        session.delete(channel_to_del)
        session.commit()
    return channel_to_del


# Function pour supprimer un membre d'un channel
def del_member_in_channel(
    session: Session, channel: models.Channel, profil: models.Profil
):
    try:
        channel.members.remove(profil)
    except ValueError:
        pass
    # MENTION SPÉCIAL DEBILUS: Pour avoir indenté les session dans except...
    session.add(channel)
    session.commit()
    session.refresh(channel)

    return channel


# NEW: Function pour get un message via son ID
def get_message_by_id(session: Session, message_id: int):
    return session.get(models.Message, message_id)


# NEW: Function pour supp un message via ID
def del_message_by_id(session: Session, message_id: int):
    message_to_delete = session.get(models.Message, message_id)
    if message_to_delete:
        session.delete(message_to_delete)
        session.commit()
    return message_to_delete
