# 🚀 API REST de Autenticação Backend (FastAPI + PostgreSQL)

Este projeto consiste em uma **API RESTful de Login e Registro** de usuários com fins puramente **educacionais**. O objetivo principal é ensinar conceitos fundamentais de desenvolvimento backend moderno, estruturação de banco de dados, segurança de senhas e autenticação de rotas.

---

## 🛠️ Tecnologias Utilizadas

*   **[FastAPI](https://fastapi.tiangolo.com/pt/)**: Framework web moderno de alto desempenho para Python, rápido para programar e com validação automática de dados.
*   **[PostgreSQL](https://www.postgresql.org/)**: Sistema de Gerenciamento de Banco de Dados Relacional de alto desempenho para persistência dos dados dos usuários.
*   **[UV Package Manager](https://github.com/astral-sh/uv)**: Gerenciador de pacotes e ambientes Python extremamente rápido, criado pela Astral.
*   **[Uvicorn](https://www.uvicorn.org/)**: Servidor de arquivos ASGI ultrarrápido para servir a nossa aplicação FastAPI.
*   **[SQLAlchemy 2.0](https://www.sqlalchemy.org/)**: ORM (Object-Relational Mapping) para mapear classes Python para tabelas de banco de dados PostgreSQL de forma moderna.
*   **[Bcrypt](https://en.wikipedia.org/wiki/Bcrypt)**: Algoritmo de criptografia forte com adição de sal (*salt*) para salvar senhas de forma segura.
*   **[PyJWT](https://pyjwt.readthedocs.io/)**: Biblioteca para geração e validação de tokens JWT (JSON Web Tokens) na autenticação.

---

## 📁 Estrutura Modular do Projeto

O projeto adota uma estrutura profissional e de fácil compreensão:

```text
projeto1/
├── .env                   # Variáveis de ambiente locais (Banco de dados, Segredos)
├── .env.example           # Modelo para criação do arquivo .env
├── pyproject.toml         # Gerenciamento de dependências pelo UV
└── app/
    ├── __init__.py
    ├── main.py            # Inicializador da API, Middleware CORS e rotas/endpoints
    ├── config.py          # Carrega e valida as configurações a partir do arquivo .env
    ├── database.py        # Configura o motor SQLAlchemy e provê sessões de banco
    ├── models.py          # Define a tabela 'users' no PostgreSQL (Modelos ORM)
    ├── schemas.py         # Modelos Pydantic para validar entradas e saídas de dados
    ├── auth.py            # Contém a criptografia das senhas (bcrypt) e criação/validação do JWT
    └── crud.py            # Contém as interações direta com o banco (Create, Read, Update)
```

---

## ⚙️ Configuração do Ambiente

Siga as etapas abaixo para configurar e rodar o projeto em sua máquina:

### 1. Requisitos Prévios
*   **Python 3.13+** instalado.
*   **PostgreSQL Server** rodando em sua máquina local ou em um servidor acessível.

### 2. Configurar o Banco de Dados PostgreSQL
Conecte-se ao seu PostgreSQL (via DBeaver, pgAdmin, prompt de comando, etc.) e crie um banco de dados vazio:
```sql
CREATE DATABASE projeto1_db;
```
> [!NOTE]
> Você não precisa criar a tabela `users` manualmente! O SQLAlchemy irá detectar que a tabela não existe ao iniciar a aplicação e a criará automaticamente para você com as colunas certas (`id`, `username`, `email`, `password`).

### 3. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
*   No terminal (Windows PowerShell):
    ```powershell
    Copy-Item .env.example .env
    ```
*   Ou simplesmente duplique o arquivo `.env.example` e mude o nome para `.env`.

Abra o arquivo `.env` e ajuste as credenciais do seu banco de dados PostgreSQL se necessário:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario_postgres (geralmente postgres)
DB_PASSWORD=sua_senha_postgres
DB_NAME=projeto1_db
```

### 4. Rodar o Servidor Localmente
Graças ao **UV**, você não precisa ativar o ambiente virtual manualmente. Basta rodar o comando abaixo para instalar as dependências e subir o servidor automaticamente:
```bash
uv run uvicorn app.main:app --reload
```
O console mostrará que o servidor está rodando em `http://127.0.0.1:8000`.

---

## 📖 Como Funciona a Segurança desta API?

### 1. Armazenamento Seguro de Senhas (Bcrypt)
Salvar senhas em texto puro é um erro grave de segurança. Nesta API, quando o usuário se registra:
*   A senha é convertida em bytes.
*   O **Bcrypt** gera um *salt* aleatório (uma string randômica única) e aplica a criptografia de via única.
*   O hash resultante é armazenado no PostgreSQL.
*   No login, comparamos o hash armazenado no banco com a senha digitada usando a função segura `bcrypt.checkpw()`.

### 2. Autenticação sem Estado (JWT - JSON Web Tokens)
Em vez de mantermos sessões salvas no servidor, usamos **JWT**. Quando o usuário se autentica com sucesso:
*   O servidor gera um token criptográfico assinado com a nossa chave `JWT_SECRET`.
*   O token contém dados básicos chamados de *Claims* (como `id` e `username` do usuário) e um tempo de expiração.
*   O frontend recebe esse token e o armazena (no `localStorage` ou `sessionStorage`).
*   Para acessar rotas privadas, o frontend envia o token no cabeçalho HTTP:
    `Authorization: Bearer <TOKEN_AQUI>`.
*   O servidor decodifica o token, valida a expiração e a assinatura. Se for válido, identifica quem é o usuário solicitante.

---

## 📡 Guia de Endpoints (RESTful)

### 📊 Painel Interativo Swagger UI
FastAPI gera automaticamente uma documentação em página web fantástica e interativa.
Com o servidor rodando, abra no seu navegador: **`http://127.0.0.1:8000/docs`**
Lá você pode testar cada endpoint diretamente pelo navegador de forma visual!

### 📥 1. Registro de Usuário (Criar Conta)
Cria uma nova conta de usuário. Não permite usernames ou e-mails repetidos.

*   **URL:** `/api/auth/register`
*   **Método HTTP:** `POST`
*   **Cabeçalho da Requisição:** `Content-Type: application/json`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "username": "gabriel_silva",
      "email": "gabriel@email.com",
      "password": "minha_senha_segura"
    }
    ```
*   **Código de Resposta de Sucesso:** `201 Created`
*   **Corpo da Resposta (JSON):**
    ```json
    {
      "username": "gabriel_silva",
      "email": "gabriel@email.com",
      "id": 1
    }
    ```

---

### 🔑 2. Login de Usuário (Obter Token)
Valida as credenciais de login e retorna o Token JWT para autenticação subsequente. Permite logar usando tanto o **username** quanto o **e-mail** no mesmo campo.

*   **URL:** `/api/auth/login`
*   **Método HTTP:** `POST`
*   **Cabeçalho da Requisição:** `Content-Type: application/json`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "username_or_email": "gabriel@email.com",
      "password": "minha_senha_segura"
    }
    ```
    *(ou usando o username)*
    ```json
    {
      "username_or_email": "gabriel_silva",
      "password": "minha_senha_segura"
    }
    ```
*   **Código de Resposta de Sucesso:** `200 OK`
*   **Corpo da Resposta (JSON):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSw...",
      "token_type": "bearer"
    }
    ```

---

### 🛡️ 3. Perfil do Usuário (Rota Protegida)
Retorna os dados do usuário autenticado no momento. Requer que o Token JWT obtido no login seja enviado.

*   **URL:** `/api/users/me`
*   **Método HTTP:** `GET`
*   **Cabeçalhos da Requisição:**
    *   `Authorization: Bearer <SEU_TOKEN_AQUI>`
*   **Código de Resposta de Sucesso:** `200 OK`
*   **Corpo da Resposta (JSON):**
    ```json
    {
      "username": "gabriel_silva",
      "email": "gabriel@email.com",
      "id": 1
    }
    ```
*   **Erro de Token Inválido/Expirado:** `401 Unauthorized`

---

## 💻 Como Consumir esta API no Frontend (Exemplo Prático)

Aqui está um exemplo simples em Javascript nativo (`fetch`) mostrando como você pode integrar seu frontend HTML/JS com esta API:

### 1. Realizando o Login e Salvando o Token
```javascript
async function fazerLogin(usernameOrEmail, password) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username_or_email: usernameOrEmail,
        password: password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro de login");
    }

    const data = await response.json();
    
    // Salva o token JWT de acesso localmente no navegador do usuário
    localStorage.setItem("authToken", data.access_token);
    console.log("Login feito com sucesso! Token armazenado.");
    
  } catch (error) {
    console.error("Falha ao autenticar:", error.message);
  }
}
```

### 2. Acessando a Rota Protegida (Perfil do Usuário)
```javascript
async function carregarPerfil() {
  // Busca o token salvo anteriormente no localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("Usuário não está autenticado!");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/me", {
      method: "GET",
      headers: {
        // Envia o Token no padrão padrão Bearer no cabeçalho Authorization
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirou ou é inválido, limpa o token local
        localStorage.removeItem("authToken");
      }
      throw new Error("Token inválido ou sessão expirada");
    }

    const usuario = await response.json();
    console.log("Dados do usuário logado:", usuario);
    alert(`Olá, ${usuario.username}! Seu e-mail cadastrado é: ${usuario.email}`);
    
  } catch (error) {
    console.error("Erro ao carregar perfil:", error.message);
  }
}
```
