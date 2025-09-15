const Groq = require('groq-sdk');

console.log('🔄 CARREGANDO SERVIÇO GROQ...');
console.log('🔑 API Key existe:', !!process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const createSystemPrompt = (area, especialidades, exemplos) => `
Você é um assistente especializado em ${area} altamente qualificado e experiente.

PAPEL E RESPONSABILIDADES:
- FOCO PRINCIPAL: ${area}
- ESPECIALIDADES: ${especialidades}
- Forneça informações precisas, detalhadas e práticas
- Base suas respostas em conhecimento técnico sólido
- Seja específico e evite respostas genéricas
- Sempre inclua exemplos práticos quando relevante

DIRETRIZES DE RESPOSTA:
- Para perguntas da sua área: forneça respostas completas e técnicas
- Para perguntas básicas (cumprimentos): responda educadamente e ofereça ajuda na sua especialidade
- Para assuntos fora do escopo: explique sua especialização e redirecione educadamente
- Para emergências: sugira contato direto com profissionais adequados

FORMATAÇÃO DAS RESPOSTAS:
- Use **negrito** para destacar informações importantes
- Use quebras de linha para organizar o texto
- Organize respostas em seções claras quando apropriado
- Use listas numeradas para passos ou processos

EXEMPLOS DE ABORDAGEM:
${exemplos}

QUALIDADE DAS RESPOSTAS:
- Seja preciso e técnico
- Inclua passos práticos quando aplicável
- Cite referências ou fundamentos quando necessário
- Mantenha tom profissional e confiável
- Forneça valor real ao usuário
`;

const personas = {
  legal: {
    name: 'Assistente Jurídico',
    systemPrompt: createSystemPrompt(
      'JURÍDICO',
      'Orientações legais, análise de contratos, elaboração de petições, pesquisa jurídica, interpretação de leis',
      `Usuário: "Qual o clima hoje?"
Resposta: "Não tenho acesso a dados meteorológicos. Como posso ajudar com questões jurídicas?"

Usuário: "Como fazer um bolo?"
Resposta: "Não sou especialista em culinária. Posso ajudar com contratos, petições ou outras questões legais?"

Usuário: "Preciso de ajuda com um contrato"
Resposta: "Perfeito! Que tipo de contrato você precisa analisar? Posso ajudar com revisão, elaboração ou orientações sobre cláusulas específicas."`
    ),
  },
  sales: {
    name: 'Assistente de Vendas',
    systemPrompt: createSystemPrompt(
      'VENDAS',
      'Qualificação de leads, scripts de vendas, estratégias comerciais, tratamento de objeções, fechamento de negócios',
      `Usuário: "Qual o clima hoje?"
Resposta: "Não tenho acesso a dados meteorológicos. Como posso ajudar a aumentar suas vendas?"

Usuário: "Como cozinhar arroz?"
Resposta: "Não sou especialista em culinária. Posso ajudar com estratégias de vendas, qualificação de leads ou fechamento de negócios?"

Usuário: "Como qualificar melhor meus leads?"
Resposta: "Ótima pergunta! Vamos trabalhar juntos. Qual seu produto/serviço e qual sua maior dificuldade na prospecção atual?"`
    ),
  },
  support: {
    name: 'Assistente de Suporte',
    systemPrompt: createSystemPrompt(
      'SUPORTE TÉCNICO',
      'Resolução de problemas, atendimento ao cliente, gestão de tickets, troubleshooting, base de conhecimento',
      `Usuário: "Qual o clima hoje?"
Resposta: "Não tenho acesso a dados meteorológicos. Como posso ajudar a resolver algum problema técnico?"

Usuário: "Receita de pizza?"
Resposta: "Não sou especialista em culinária. Posso ajudar com problemas técnicos ou questões de suporte?"

Usuário: "O sistema está lento"
Resposta: "Vamos resolver isso! Me conte mais detalhes: quando começou a lentidão? Afeta alguma funcionalidade específica?"`
    ),
  },
  personal: {
    name: 'Assistente Pessoal',
    systemPrompt: createSystemPrompt(
      'PRODUTIVIDADE E ORGANIZAÇÃO',
      'Gestão de tempo, organização pessoal, planejamento, automação de tarefas, produtividade',
      `Usuário: "Qual o clima hoje?"
Resposta: "Não tenho acesso a dados meteorológicos. Como posso ajudar com sua organização ou produtividade?"

Usuário: "Como fazer investimentos?"
Resposta: "Não sou especialista financeiro. Posso ajudar com organização pessoal, planejamento de tarefas ou produtividade?"

Usuário: "Como organizar minha agenda?"
Resposta: "Ótimo! Vou te ajudar a organizar sua agenda. Quais são suas principais atividades e qual sua maior dificuldade atual?"`
    ),
  },
};

const generateResponse = async (message, persona = 'personal', mode = 'expert', conversationHistory = []) => {
  try {
    const selectedPersona = personas[persona] || personas.personal;
    
    // Function to handle quick start messages
    const handleQuickStartMessage = (message, persona) => {
      const lowerMessage = message.toLowerCase();
      
      // Legal assistant responses
      if (persona === 'legal') {
        if (lowerMessage.includes('petição')) {
          return 'Perfeito! Para ajudar com petições, preciso de algumas informações:\n\n1. Qual tipo de petição você precisa? (inicial, recurso, contestação, etc.)\n2. Qual a área do direito? (civil, trabalhista, criminal, etc.)\n3. Você já tem algum modelo ou referência?\n\nMe conte mais detalhes para eu orientá-lo melhor.';
        }
        if (lowerMessage.includes('contrato')) {
          return 'Ótimo! Para análise de contratos, vou precisar saber:\n\n1. Que tipo de contrato é? (prestação de serviços, compra e venda, locação, etc.)\n2. Você quer revisar um contrato existente ou criar um novo?\n3. Quais são as principais cláusulas que te preocupam?\n\nCompartilhe os detalhes para uma orientação mais específica.';
        }
        if (lowerMessage.includes('consultoria')) {
          return 'Excelente! Estou aqui para orientações jurídicas. Para te ajudar melhor:\n\n1. Qual área do direito envolve sua questão?\n2. É uma situação pessoal ou empresarial?\n3. Você já consultou algum advogado sobre isso?\n\nLembre-se: minhas orientações são básicas e não substituem consulta com advogado especializado.';
        }
        if (lowerMessage.includes('pesquisa')) {
          return 'Perfeito para pesquisa jurídica! Me informe:\n\n1. Qual lei ou tema você precisa pesquisar?\n2. É para um caso específico ou estudo geral?\n3. Precisa de jurisprudência de algum tribunal específico?\n\nVou te ajudar a encontrar as informações mais relevantes.';
        }
      }

      // Sales assistant responses
      if (persona === 'sales') {
        if (lowerMessage.includes('qualificação')) {
          return 'Ótima escolha! Para qualificação eficaz de leads:\n\n1. Qual seu produto/serviço atual?\n2. Quem é seu cliente ideal?\n3. Qual sua maior dificuldade na prospecção?\n\nVou criar uma estratégia personalizada de qualificação para você!';
        }
        if (lowerMessage.includes('script')) {
          return 'Excelente! Para criar scripts de vendas eficazes:\n\n1. É para vendas por telefone, presencial ou online?\n2. Qual o valor médio do seu produto/serviço?\n3. Quais objeções você mais escuta?\n\nVamos criar um roteiro que converte mais!';
        }
        if (lowerMessage.includes('objeções')) {
          return 'Perfeito! Vamos trabalhar no tratamento de objeções:\n\n1. Quais as 3 objeções mais comuns que você recebe?\n2. Como você responde atualmente?\n3. Qual sua taxa de fechamento atual?\n\nVou te ensinar técnicas poderosas para superar resistências!';
        }
        if (lowerMessage.includes('estratégia')) {
          return 'Ótimo! Para desenvolver uma estratégia de vendas vencedora:\n\n1. Qual seu segmento de mercado?\n2. Quantos contatos você faz por dia?\n3. Qual seu maior desafio nas vendas?\n\nVamos criar um plano estruturado para multiplicar seus resultados!';
        }
      }

      // Support assistant responses
      if (persona === 'support') {
        if (lowerMessage.includes('problemas')) {
          return 'Perfeito! Para resolução eficaz de problemas:\n\n1. Que tipo de problemas você mais atende?\n2. Qual o volume de solicitações por dia?\n3. Qual sua maior dificuldade no atendimento?\n\nVou te ajudar a criar processos mais eficientes!';
        }
        if (lowerMessage.includes('atendimento')) {
          return 'Excelente escolha! Para melhorar o atendimento:\n\n1. Qual canal você mais utiliza? (telefone, chat, email)\n2. Como você mede satisfação do cliente?\n3. Qual o tempo médio de resolução?\n\nVamos otimizar sua experiência de atendimento!';
        }
        if (lowerMessage.includes('tickets')) {
          return 'Ótimo! Para gestão eficiente de tickets:\n\n1. Você usa alguma ferramenta específica?\n2. Como categoriza as solicitações?\n3. Qual o volume médio de tickets?\n\nVou te ajudar a organizar e priorizar melhor!';
        }
        if (lowerMessage.includes('conhecimento')) {
          return 'Perfeita escolha! Para criar uma base de conhecimento:\n\n1. Que tipo de informações precisa documentar?\n2. Quem será o público-alvo?\n3. Já tem algum conteúdo organizado?\n\nVamos estruturar um sistema de informações eficiente!';
        }
      }

      // Personal assistant responses
      if (persona === 'personal') {
        if (lowerMessage.includes('produtividade')) {
          return 'Ótima escolha! Para aumentar sua produtividade:\n\n1. Quais suas principais atividades diárias?\n2. Onde você perde mais tempo?\n3. Usa alguma técnica de gestão de tempo?\n\nVou te ajudar a otimizar sua rotina e ser mais eficiente!';
        }
        if (lowerMessage.includes('organização')) {
          return 'Perfeito! Para melhor organização:\n\n1. O que você mais precisa organizar? (tarefas, arquivos, agenda)\n2. Prefere métodos digitais ou físicos?\n3. Qual sua maior dificuldade para se manter organizado?\n\nVamos criar um sistema que funcione para você!';
        }
        if (lowerMessage.includes('planejamento')) {
          return 'Excelente! Para planejamento eficaz:\n\n1. É planejamento pessoal ou profissional?\n2. Qual o prazo? (diário, semanal, mensal, anual)\n3. Quais são seus principais objetivos?\n\nVou te ajudar a criar um plano estruturado e realizável!';
        }
        if (lowerMessage.includes('geral')) {
          return 'Ótimo! Estou aqui para ajuda geral:\n\n1. Qual área você precisa de suporte?\n2. É algo específico ou uma dúvida geral?\n3. Tem urgência ou posso explicar com detalhes?\n\nMe conte o que precisa e vamos resolver juntos!';
        }
      }

      // Fallback for quick start messages
      return 'Entendi que você selecionou uma opção específica! Me conte mais detalhes sobre o que precisa para eu poder ajudá-lo melhor.';
    };

    // Function to generate appropriate mock responses based on message content
    const generateMockResponse = (message, persona) => {
      const lowerMessage = message.toLowerCase().trim();
      
      // Simple greetings
      if (lowerMessage.match(/^(oi|olá|ola|hello|hi|hey)$/)) {
        const greetings = {
          legal: 'Olá! Sou seu assistente jurídico. Em que posso ajudá-lo hoje?',
          sales: 'Oi! Sou seu assistente de vendas. Como posso te ajudar a fechar mais negócios?',
          support: 'Olá! Sou seu assistente de suporte. Qual problema posso ajudá-lo a resolver?',
          personal: 'Oi! Sou seu assistente pessoal. Em que posso ser útil hoje?'
        };
        return greetings[persona] || greetings.personal;
      }
      
      // Well-being questions
      if (lowerMessage.includes('como vai') || lowerMessage.includes('tudo bem') || 
          lowerMessage.includes('está bem') || lowerMessage.includes('você está bem') ||
          lowerMessage.includes('como está') || lowerMessage.includes('como vc está')) {
        return 'Estou bem, obrigado por perguntar! Como posso ajudá-lo?';
      }
      
      // Thanks
      if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu') || 
          lowerMessage.includes('muito obrigado') || lowerMessage.includes('obrigada')) {
        return 'De nada! Precisando de mais alguma coisa, é só falar.';
      }
      
      // Common conversational phrases
      if (lowerMessage.includes('qual seu nome') || lowerMessage.includes('quem é você') ||
          lowerMessage.includes('quem você é')) {
        const introductions = {
          legal: 'Sou seu Assistente Jurídico, especializado em orientações legais.',
          sales: 'Sou seu Assistente de Vendas, aqui para ajudar com estratégias comerciais.',
          support: 'Sou seu Assistente de Suporte, pronto para resolver seus problemas.',
          personal: 'Sou seu Assistente Pessoal, aqui para ajudar com suas tarefas.'
        };
        return introductions[persona] || introductions.personal;
      }
      
      // Help requests
      if (lowerMessage.includes('pode me ajudar') || lowerMessage.includes('preciso de ajuda') ||
          lowerMessage.includes('me ajuda') || lowerMessage.includes('ajude-me')) {
        const helpResponses = {
          legal: 'Claro! Posso ajudar com questões jurídicas. O que você precisa?',
          sales: 'Certamente! Vou ajudar você com vendas. Qual é sua dúvida?',
          support: 'É claro! Estou aqui para resolver problemas. Me conte o que aconteceu.',
          personal: 'Com certeza! Posso ajudar com várias tarefas. O que você precisa?'
        };
        return helpResponses[persona] || helpResponses.personal;
      }

      // Quick start options detection
      if (lowerMessage.includes('gostaria de ajuda com:')) {
        return handleQuickStartMessage(message, persona);
      }
      
      // Default responses for unmatched messages - more natural
      const defaultResponses = {
        legal: 'Posso ajudar com questões jurídicas. O que você gostaria de saber?',
        sales: 'Como posso ajudar você a melhorar suas vendas?',
        support: 'Estou aqui para ajudar. Me conte qual é o problema.',
        personal: 'Como posso ser útil para você hoje?'
      };
      
      return defaultResponses[persona] || defaultResponses.personal;
    };

    // Try Groq API first
    console.log('🔍 Tentando Groq API...');
    console.log('🔑 API Key:', process.env.GROQ_API_KEY ? 'CONFIGURADA' : 'NÃO ENCONTRADA');
    console.log('🤖 Modelo:', process.env.GROQ_MODEL);
    try {
      // Select system prompt based on mode
      const systemPrompt = mode === 'free' 
        ? `Você é um assistente de IA versátil e útil. Responda a qualquer pergunta de forma natural, educada e informativa. Seja prestativo e aborde qualquer tópico que o usuário perguntar.

FORMATAÇÃO DAS RESPOSTAS:
- Use **negrito** para destacar informações importantes
- Use quebras de linha para organizar o texto
- Organize respostas em seções claras quando apropriado`
        : selectedPersona.systemPrompt;

      // Build conversation history for context
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // Add conversation history (last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.is_bot ? 'assistant' : 'user',
          content: msg.text,
        });
      });

      // Add current user message
      messages.push({
        role: 'user',
        content: message,
      });

      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
        messages: messages,
        max_tokens: parseInt(process.env.MAX_TOKENS || '500'),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return completion.choices[0].message.content.trim();
    } catch (apiError) {
      console.log('Groq API failed, using mock response:', apiError.message);
      
      // Use intelligent mock response as fallback based on mode
      if (mode === 'free') {
        return 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente em alguns instantes.';
      } else {
        return generateMockResponse(message, persona);
      }
    }
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

const validateApiKey = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }
  return true;
};

module.exports = {
  generateResponse,
  validateApiKey,
  personas,
};