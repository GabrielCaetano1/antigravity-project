from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config import DATABASE_URL

# Criação do motor (Engine) do SQLAlchemy.
# pool_pre_ping=True testa a conexão antes de usá-la, ideal para conexões de longa duração.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# SessionLocal é a classe que usaremos para instanciar conexões individuais com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Nova forma padrão do SQLAlchemy 2.0 para definir a classe base declarativa
class Base(DeclarativeBase):
    pass

# Dependência que fornece a sessão de banco de dados para os endpoints e garante o fechamento ao final da requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
