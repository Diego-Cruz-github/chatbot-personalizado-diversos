# 🤖 ChatBot Personalizado

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-orange.svg)](https://openai.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-lightblue.svg)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Um chatbot inteligente e personalizado com múltiplas personas especializadas, construído com React, Node.js e integração com OpenAI API.

## 🌟 Características

### 🎭 Personas Especializadas
- **👨‍⚖️ Assistente Jurídico**: Orientações legais básicas e geração de minutas
- **📈 Assistente de Vendas**: Qualificação de leads e estratégias comerciais
- **🎧 Assistente de Suporte**: Atendimento ao cliente e resolução de problemas
- **👤 Assistente Pessoal**: Produtividade e tarefas diversas

### 🚀 Funcionalidades Principais
- ⚡ Interface de chat em tempo real
- 🎨 Interface moderna e responsiva
- 💾 Histórico completo de conversas
- 🔒 Autenticação e segurança
- ⏱️ Rate limiting inteligente
- 📱 Design responsivo para mobile
- 🛡️ Validação robusta de inputs
- 📊 Sistema de templates de respostas

### 🛠️ Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **IA**: OpenAI GPT-3.5-turbo/GPT-4
- **Segurança**: Helmet, CORS, Rate Limiting
- **Validação**: Express Validator
- **Deploy**: Vercel (Frontend) + Railway/Render (Backend)

## 📸 Screenshots

### Interface Principal
![Chat Interface](docs/images/chat-interface.png)

### Seleção de Personas
![Persona Selection](docs/images/persona-selection.png)

### Histórico de Conversas
![Conversation History](docs/images/conversation-history.png)

## 🔧 Instalação Local

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Chave da API OpenAI

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/chatbot-personalizado.git
cd chatbot-personalizado
```

### 2. Configuração do Backend
```bash
cd backend
npm install

# Copie o arquivo de ambiente
cp .env.example .env

# Configure suas variáveis de ambiente no .env:
# OPENAI_API_KEY=sua_chave_openai_aqui
# NODE_ENV=development
# PORT=3001
# FRONTEND_URL=http://localhost:3000
```

### 3. Configuração do Frontend
```bash
cd ../frontend
npm install

# Crie um arquivo .env para o frontend (opcional)
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
```

### 4. Executar em Desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📚 Documentação da API

### Endpoints Principais

#### POST /api/chat
Envia uma mensagem para o chatbot.

**Request:**
```json
{
  "message": "Olá, preciso de ajuda com um contrato",
  "persona": "legal",
  "conversationId": "uuid-opcional"
}
```

**Response:**
```json
{
  "response": "Olá! Sou seu assistente jurídico...",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "messageId": "550e8400-e29b-41d4-a716-446655440001"
}
```

#### GET /api/conversations
Lista todas as conversas.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Consulta sobre contrato",
    "persona": "legal",
    "created_at": "2025-01-15T10:30:00Z",
    "message_count": 8
  }
]
```

#### GET /api/conversations/:id
Obtém uma conversa específica com todas as mensagens.

#### DELETE /api/conversations/:id
Remove uma conversa e todas suas mensagens.

### Rate Limits
- **Geral**: 100 requests por 15 minutos
- **Chat**: 10 mensagens por minuto por IP

## 🌐 Deploy

### Frontend (Vercel)
```bash
# No diretório frontend
npm run build

# Deploy automático conectando o repositório GitHub ao Vercel
# Ou usando Vercel CLI:
npx vercel --prod
```

### Backend (Railway/Render)
```bash
# Configure as variáveis de ambiente:
# OPENAI_API_KEY
# NODE_ENV=production
# PORT (automático no Railway/Render)
# FRONTEND_URL=https://seu-frontend.vercel.app

# O deploy é automático via GitHub
```

### Variáveis de Ambiente para Produção
```env
# Backend
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-3.5-turbo
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.vercel.app
JWT_SECRET=seu_jwt_secret_super_seguro
```

## 🔐 Segurança

### Medidas Implementadas
- ✅ Rate limiting por IP
- ✅ Validação de entrada
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Sanitização de dados
- ✅ Logs de segurança

### Recomendações Adicionais
- Use HTTPS em produção
- Configure firewall adequadamente
- Monitore logs de acesso
- Mantenha dependências atualizadas

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Monitoramento e Logs

O sistema inclui logging detalhado:
- Requests HTTP (Morgan)
- Erros de aplicação
- Interações com OpenAI
- Rate limiting

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Autenticação completa com JWT
- [ ] Sistema de usuários
- [ ] Chat em tempo real com WebSockets
- [ ] Exportação de conversas (PDF/JSON)
- [ ] Analytics e métricas
- [ ] Integração com mais provedores de IA
- [ ] Sistema de plugins
- [ ] API webhooks

## ❓ FAQ

**Q: Como obter uma chave da OpenAI?**
A: Acesse https://platform.openai.com/api-keys e crie uma nova chave API.

**Q: Posso usar outros modelos além do GPT-3.5?**
A: Sim! Configure a variável OPENAI_MODEL no .env com gpt-4 ou outros modelos disponíveis.

**Q: Como personalizar as personas?**
A: Edite o arquivo `frontend/src/config/personas.ts` e `backend/src/services/openai.js`.

## 📞 Suporte

- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/chatbot-personalizado/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/chatbot-personalizado/discussions)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

---

### 🎯 Projeto Profissional

🚀 **Ready for Production** | 🎭 **Multi-Persona AI** | 🛡️ **Enterprise Security**