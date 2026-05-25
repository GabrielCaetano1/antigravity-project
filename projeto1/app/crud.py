from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import get_password_hash

def get_user_by_id(db: Session, user_id: int) -> models.User | None:
    """
    Busca um usuário no banco de dados pelo seu ID único.
    """
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> models.User | None:
    """
    Busca um usuário no banco de dados pelo seu endereço de e-mail.
    """
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str) -> models.User | None:
    """
    Busca um usuário no banco de dados pelo seu nome de usuário.
    """
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """
    Cria um novo usuário no banco de dados, aplicando o hash seguro de senha antes de salvar.
    """
    # 1. Aplica hash seguro na senha pura enviada pelo usuário
    hashed_password = get_password_hash(user.password)
    
    # 2. Cria uma instância do modelo ORM do SQLAlchemy
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    
    # 3. Adiciona na sessão do banco, faz o commit e atualiza os dados locais (como o ID gerado)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user
