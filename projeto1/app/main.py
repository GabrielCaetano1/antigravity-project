from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app import models, schemas, crud, auth
from app.database import engine, get_db

# ==========================================
# Inicialização das Tabelas no PostgreSQL
# ==========================================
try:
    # Tenta criar as tabelas no PostgreSQL automaticamente se não existirem
    models.Base.metadata.create_all(bind=engine)
    print("Sucesso: Tabelas do banco de dados verificadas/criadas com sucesso.")
except Exception as e:
    print("\n" + "="*80)
    print("AVISO IMPORTANTE DE BANCO DE DADOS:")
    print("Não foi possível conectar ao servidor PostgreSQL para criar as tabelas automaticamente.")
    print("Certifique-se de que:")
    print("  1. Seu servidor PostgreSQL está ativo e rodando.")
    print("  2. O banco de dados configurado em .env (projeto1_db) existe.")
    print("  3. As credenciais de usuário/senha no arquivo .env estão corretas.")
    print(f"Erro original: {e}")
    print("="*80 + "\n")

# ==========================================
# Configuração do FastAPI
# ==========================================
app = FastAPI(
    title="API de Login Backend",
    description="API RESTful educacional de autenticação utilizando FastAPI, PostgreSQL, UV e Uvicorn.",
    version="1.0.0"
)

# Configuração do Middleware CORS
# Permite que qualquer frontend (ex: rodando em localhost:3000 ou arquivo local) consuma esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia o esquema HTTPBearer para obter e validar o token Bearer JWT nas rotas protegidas
security_scheme = HTTPBearer(auto_error=True)


# ==========================================
# Dependência de Autenticação (Obter Usuário Atual)
# ==========================================
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme), 
    db: Session = Depends(get_db)
) -> models.User:
    """
    Dependência que intercepta a requisição, extrai o token JWT do cabeçalho
    'Authorization: Bearer <token>', valida-o e retorna o usuário correspondente.
    """
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido, expirado ou ausente",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decodifica e valida a expiração/assinatura do token JWT
    payload = auth.decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    username: str = payload.get("username")
    user_id: int = payload.get("id")
    
    if username is None or user_id is None:
        raise credentials_exception
        
    # Busca o usuário no banco de dados
    user = crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
        
    return user


# ==========================================
# Rotas / Endpoints REST
# ==========================================

@app.get("/")
def read_root():
    """
    Endpoint inicial informativo para guiar o estudante/desenvolvedor.
    """
    return {
        "message": "Bem-vindo à API RESTful de Autenticação Backend!",
        "status": "Online",
        "documentacao_interativa": "/docs",
        "tecnologias": ["FastAPI", "PostgreSQL", "UV", "Uvicorn", "JWT", "Bcrypt"]
    }


@app.post("/api/auth/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registra um novo usuário no sistema. 
    Verifica se o e-mail ou o nome de usuário já foram cadastrados previamente.
    """
    # 1. Verifica se o username já existe no banco
    db_user_by_username = crud.get_user_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este nome de usuário já está cadastrado."
        )
        
    # 2. Verifica se o email já existe no banco
    db_user_by_email = crud.get_user_by_email(db, email=user.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já está cadastrado."
        )
        
    # 3. Cria e salva o usuário no banco
    return crud.create_user(db=db, user=user)


@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Autentica um usuário usando nome de usuário OR e-mail e senha.
    Gera e retorna um token de acesso JWT válido em caso de sucesso.
    """
    user = None
    
    # 1. Identifica se a entrada é um e-mail ou um nome de usuário
    if "@" in credentials.username_or_email:
        user = crud.get_user_by_email(db, email=credentials.username_or_email)
    
    if not user:
        user = crud.get_user_by_username(db, username=credentials.username_or_email)
        
    # 2. Valida o usuário e verifica a senha (compara a digitada com o hash no banco)
    if not user or not auth.verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome de usuário/e-mail ou senha incorretos."
        )
        
    # 3. Cria o token JWT contendo ID e Username
    access_token = auth.create_access_token(
        data={"id": user.id, "username": user.username}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }


@app.get("/api/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Endpoint protegido. Retorna os dados do usuário atualmente autenticado
    com base no Token JWT fornecido no cabeçalho Authorization.
    """
    return current_user
