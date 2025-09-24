import os
from datetime import datetime, timedelta, timezone # type: ignore
from typing import Optional # type: ignore
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from dotenv import load_dotenv

from models import Profil
from database import get_session

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGO = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10))

oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGO)
    return encoded_jwt


def get_profil_by_name(session: Session, name):
    statement = select(Profil).where(Profil.name == name)
    return session.exec(statement).first()


def get_current_profil(
    token: str = Depends(oauth_scheme), session: Session = Depends(get_session)
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
    except JWTError:
        raise credential_exception
    
    profil = get_profil_by_name(session, name=username)
    if profil is None:
        raise credential_exception
    return profil
