from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from app.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# ==========================================
# 1. Hashing e Validação de Senha (bcrypt)
# ==========================================

def get_password_hash(password: str) -> str:
    """
    Gera um hash seguro a partir de uma senha em texto puro usando bcrypt.
    """
    # Converte a senha para bytes, gera o salt e faz o hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Retorna o hash decodificado como string para salvar no banco
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se a senha digitada corresponde ao hash seguro salvo no banco.
    """
    pwd_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hash_bytes)


# ==========================================
# 2. Criação e Validação de Tokens JWT
# ==========================================

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Gera um token JWT com data de expiração e dados payload embutidos.
    """
    to_encode = data.copy()
    
    # Define a data/hora de expiração do token (com fuso horário UTC)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    
    # Codifica e assina o token com a nossa chave secreta e algoritmo
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict | None:
    """
    Decodifica e valida a assinatura e expiração de um token JWT.
    Retorna o payload se válido ou None se inválido/expirado.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        # Se expirar, assinatura for inválida, etc., cai aqui
        return None
