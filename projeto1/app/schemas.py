from pydantic import BaseModel, Field

# ==========================================
# Schemas Base e de Entrada (Request)
# ==========================================

class UserBase(BaseModel):
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=50, 
        description="Nome de usuário único",
        examples=["gabriel_silva"]
    )
    email: str = Field(
        ..., 
        description="Endereço de e-mail válido",
        examples=["gabriel@email.com"]
    )

class UserCreate(UserBase):
    password: str = Field(
        ..., 
        min_length=6, 
        description="Senha de acesso (mínimo de 6 caracteres)",
        examples=["senha12345"]
    )

class UserLogin(BaseModel):
    # Permite ao usuário logar tanto por username quanto por e-mail para maior flexibilidade
    username_or_email: str = Field(
        ..., 
        description="Nome de usuário ou e-mail cadastrado",
        examples=["gabriel_silva"]
    )
    password: str = Field(
        ..., 
        description="Senha cadastrada",
        examples=["senha12345"]
    )


# ==========================================
# Schemas de Saída (Response)
# ==========================================

class UserOut(UserBase):
    id: int

    # Configuração Pydantic v2 para permitir ler dados ORM do SQLAlchemy
    model_config = {
        "from_attributes": True
    }


# ==========================================
# Schemas de Token JWT
# ==========================================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int | None = None
    username: str | None = None
