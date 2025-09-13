# Docker Setup - Chatbot Personalizado

## Pré-requisitos

1. **Docker Desktop**: Instale o Docker Desktop para Windows
   - Download: https://www.docker.com/products/docker-desktop/
   - Inicie o Docker Desktop antes de executar os comandos

## Execução com Docker

### 1. Configurar arquivo .env
Crie o arquivo `backend/.env` com suas credenciais:
```bash
GROQ_API_KEY=sua_api_key_aqui
GROQ_MODEL=llama-3.1-8b-instant
MAX_TOKENS=800
TEMPERATURE=0.7
PORT=3001
FRONTEND_URL=http://localhost:3002
DB_PATH=./src/data/chatbot.db
JWT_SECRET=your_super_secret_jwt_key_here
BCRYPT_ROUNDS=12
```

### 2. Build e executar os containers
```bash
# Build das imagens
docker-compose build

# Executar em background
docker-compose up -d

# Executar com logs visíveis
docker-compose up
```

### 3. Acessar a aplicação
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001

### 4. Comandos úteis
```bash
# Parar os containers
docker-compose down

# Rebuild completo
docker-compose down && docker-compose build --no-cache && docker-compose up

# Ver logs
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Entrar no container
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Estrutura Docker

- **Backend**: Node.js + Express rodando na porta 3001
- **Frontend**: React dev server rodando na porta 3002
- **Volumes**: Código fonte montado para desenvolvimento
- **Auto-restart**: Containers reiniciam automaticamente

## Troubleshooting

1. **Erro "docker daemon not running"**: Inicie o Docker Desktop
2. **Porta em uso**: Pare outros serviços nas portas 3001/3002
3. **Build falha**: Execute `docker-compose build --no-cache`
4. **Banco não persiste**: Verifique se o volume `src/data` está montado