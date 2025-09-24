from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Vérifie si un mo de passe en clair correspond à un mdp hashé."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Retourne le hash d'un mdp."""
    return pwd_context.hash(password)