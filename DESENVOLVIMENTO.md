# 🚀 Guia de Desenvolvimento - Chatbot Personalizado

## ⚠️ Como Evitar Problemas de CORS e Portas

### 🎯 Problemas Comuns e Soluções

#### 1. **Network Error / Erro de CORS**
```bash
# ❌ Erro comum
Access-Control-Allow-Origin: http://localhost:3000
# Frontend rodando na porta 3002

# ✅ Solução implementada
CORS flexível que aceita múltiplas portas (3000-3003)
```

#### 2. **Conflito de Portas**
```bash
# Verificar quais portas estão em uso
netstat -ano | findstr :300

# Encerrar processo específico (Windows)
powershell "Stop-Process -Id [PID] -Force"
```

#### 3. **Chaves API Compartilhadas**
```bash
# ❌ Problema: Usar mesma chave Groq em múltiplos projetos
# ✅ Solução: Usar chaves separadas ou limitar requisições
```

### 🔧 Configurações Implementadas

#### **Backend - CORS Flexível**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:3003',
  process.env.FRONTEND_URL
];
```

#### **Variáveis de Ambiente**
```env
# Backend
PORT=3001
FRONTEND_URL=http://localhost:3002
GROQ_API_KEY=sua_chave_aqui

# Frontend
PORT=3002  # ou 3003
REACT_APP_API_URL=http://localhost:3001
```

### 📋 Checklist de Desenvolvimento

#### **Antes de Iniciar o Projeto:**
- [ ] Verificar portas disponíveis
- [ ] Configurar variáveis de ambiente
- [ ] Verificar se outras instâncias estão rodando

#### **Ao Encontrar Errors:**
- [ ] Verificar logs do console (F12)
- [ ] Verificar configuração CORS
- [ ] Testar API diretamente (curl/Postman)
- [ ] Verificar se portas coincidem

#### **Para Múltiplos Projetos:**
- [ ] Usar portas diferentes para cada projeto
- [ ] Usar chaves API separadas quando possível
- [ ] Documentar portas usadas

### 🛠️ Comandos Úteis

```bash
# Verificar processos nas portas
netstat -ano | findstr :3001

# Iniciar projeto completo
npm run install:all
npm run dev

# Testar API
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"teste","persona":"personal"}'

# Limpar cache do Node
npm start -- --reset-cache
```

### 🎯 Estrutura de Portas Recomendada

```
Projeto                    | Frontend | Backend | Database
========================== | ======== | ======= | ========
Chatbot Personalizado     | 3002     | 3001    | SQLite
Gerador de Orçamentos     | 3000     | 5000    | SQLite  
Outros Projetos           | 3004+    | 3005+   | Variado
```

### 🆘 Solução Rápida para Emergências

```bash
# 1. Parar tudo
taskkill /f /im node.exe

# 2. Limpar portas (se necessário)
netstat -ano | findstr :300

# 3. Reiniciar
cd backend && npm run dev
cd frontend && npm start
```

### 📝 Logs Importantes para Debug

```javascript
// Backend - logs úteis implementados
console.log('🔧 CORS Origins permitidas:', allowedOrigins);
console.log('🔑 API Key existe:', !!process.env.GROQ_API_KEY);
console.log('🚀 Server running on port', PORT);
```

---

**💡 Dica:** Sempre verificar os logs do backend quando houver "Network Error" no frontend!