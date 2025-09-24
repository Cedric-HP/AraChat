import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine, select

from models import Channel

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE not found.")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        statement = select(Channel).where(Channel.name == "Général")
        existing_channel = session.exec(statement).first()

        if not existing_channel:
            print("INFO: Création des channels par défaut.")

            channel_general = Channel(
                name="Général",
                desc="General discussions and welcoming new members.",
                owner_id=None
            )
            channel_ia = Channel(
                name="IA",
                desc="Come talk to Uncle GPT about your depression.",
                owner_id=None
            )
            channel_milf = Channel(
                name="MILF",
                desc="No Pregnancy, Only Breed With Milf",
                owner_id=None
            )

            session.add(channel_general)
            session.add(channel_ia)
            session.add(channel_milf)
            session.commit()
            print("INFO: Channels par défaut créé avec succès.")

def get_session():
    with Session(engine) as session:
        yield session