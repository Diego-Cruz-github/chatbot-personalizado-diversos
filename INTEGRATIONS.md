# 🤖 Integrações de Bots - WhatsApp & Telegram

Este documento explica como configurar e usar as integrações com WhatsApp e Telegram.

## 📱 WhatsApp Integration

### Pré-requisitos
- Número de telefone para WhatsApp
- Chrome/Chromium instalado para Puppeteer

### Instalação
```bash
# Instalar dependências do WhatsApp
npm install whatsapp-web.js qrcode-terminal

# Configurar no .env
ENABLE_WHATSAPP=true
```

### Como Funcionar
1. O bot criará um QR code no console
2. Escaneie o QR code com seu WhatsApp
3. O bot ficará ativo e responderá mensagens automaticamente

### Recursos WhatsApp
- ✅ Resposta automática a mensagens privadas
- ✅ Integração com todas as personas
- ✅ Ignore mensagens de grupos
- ✅ Session persistente (LocalAuth)

## 🤖 Telegram Integration  

### Pré-requisitos
- Conta no Telegram
- Bot Token do @BotFather

### Configuração
1. Converse com [@BotFather](https://t.me/botfather) no Telegram
2. Crie um novo bot com `/newbot`
3. Copie o token gerado
4. Configure no .env:

```bash
ENABLE_TELEGRAM=true
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Comandos Disponíveis
- `/start` - Mensagem de boas-vindas
- `/help` - Lista de comandos
- `/legal` - Mudar para persona jurídica  
- `/sales` - Mudar para persona de vendas
- `/support` - Mudar para persona de suporte
- `/personal` - Mudar para persona pessoal

### Recursos Telegram
- ✅ Comandos interativos
- ✅ Teclado inline para personas
- ✅ Suporte a Markdown
- ✅ Callback queries
- ✅ Polling mode

## 🚀 Ativação das Integrações

### Docker
```bash
# Adicione as variáveis no .env
ENABLE_WHATSAPP=true
ENABLE_TELEGRAM=true
TELEGRAM_BOT_TOKEN=your_token_here

# Restart containers
docker-compose restart
```

### Local
```bash
# Instalar dependências opcionais
npm install whatsapp-web.js node-telegram-bot-api qrcode-terminal

# Configurar .env e reiniciar servidor
npm run dev
```

## 📊 Status das Integrações

O sistema possui um endpoint para verificar status:

```bash
GET /api/integrations/status

Response:
{
  "whatsapp": {
    "enabled": true,
    "active": true,
    "ready": true
  },
  "telegram": {
    "enabled": true, 
    "active": true,
    "ready": true
  }
}
```

## 🔧 Personalização

### Alterar Persona Padrão
```javascript
// Em whatsappBot.js ou telegramBot.js
const aiResponse = await generateResponse(
  userMessage,
  'legal', // Altere aqui: legal, sales, support, personal
  'expert', // Ou 'free' para modo livre
  []
);
```

### Adicionar Comandos Telegram
```javascript
// Em telegramBot.js
case '/meucomando':
  await this.sendMessage(chatId, 'Resposta personalizada');
  break;
```

## 🛡️ Segurança

- Bots usam a mesma API de IA do sistema web
- Rate limiting aplicado por usuário
- Logs de todas as interações
- Validação de entrada de mensagens

## 📝 Limitações Atuais

- Sem histórico persistente de conversas por usuário
- Persona por sessão (não salva preferências)
- WhatsApp requer sessão ativa do navegador
- Telegram polling mode (considere webhook para produção)

## 🔄 Roadmap

- [ ] Histórico de conversas por usuário
- [ ] Preferências persistentes de persona
- [ ] Webhook mode para Telegram
- [ ] Business API do WhatsApp
- [ ] Analytics de uso dos bots
- [ ] Rate limiting específico por bot
- [ ] Multi-instância WhatsApp
- [ ] Integração com Discord

## 🆘 Troubleshooting

### WhatsApp não conecta
- Verifique se Chrome está instalado
- Tente limpar a pasta `.wwebjs_auth`
- Verifique logs do container Docker

### Telegram não responde
- Confirme o token do bot
- Teste o bot diretamente no Telegram
- Verifique se polling está ativo

### Bots não inicializam
- Confirme variáveis `ENABLE_*` no .env
- Instale dependências opcionais
- Verifique logs do servidor