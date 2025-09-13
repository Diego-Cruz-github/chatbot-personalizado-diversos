# 🚀 Setup Guide

## Configuração Rápida

### 1. Instalação das Dependências
```bash
# Instalar todas as dependências (frontend e backend)
npm run install:all
```

### 2. Configuração do Backend
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
OPENAI_API_KEY=sk-proj-sua_chave_aqui
OPENAI_MODEL=gpt-3.5-turbo
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Executar em Desenvolvimento
```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### 4. Teste das Funcionalidades

#### Testar Backend
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá, teste",
    "persona": "personal"
  }'
```

#### Testar Frontend
1. Acesse http://localhost:3000
2. Selecione uma persona
3. Envie uma mensagem de teste

## Troubleshooting

### Erro: "OPENAI_API_KEY not found"
- Verifique se o arquivo `.env` existe no diretório `backend/`
- Confirme se a chave OpenAI está correta

### Erro: "Port 3000 already in use"
```bash
# Encontrar processo usando a porta
lsof -ti:3000
# Matar processo
kill -9 <PID>
```

### Erro de CORS
- Verifique se `FRONTEND_URL` no `.env` corresponde ao URL do frontend
- Para desenvolvimento local: `http://localhost:3000`

### Database Locked Error
```bash
# Remover database (perderá dados)
rm backend/src/data/chatbot.db
```

## Deploy

### Vercel (Recomendado)
1. Fork o repositório
2. Conecte ao Vercel
3. Configure variáveis de ambiente
4. Deploy automático

### Docker
```bash
docker-compose up --build
```