import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente a partir do arquivo .env
load_dotenv()

# Configurações do Banco de Dados
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "sua_senha")
DB_NAME = os.getenv("DB_NAME", "projeto1_db")

# String de conexão SQLAlchemy para PostgreSQL usando o driver Psycopg2
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Configurações de Segurança do JWT
JWT_SECRET = os.getenv("JWT_SECRET", "8e847c2fb27ba3f86e4e58ad0c78e1c6680327f1c990b793ef1ef84f3ab6ecbf")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
