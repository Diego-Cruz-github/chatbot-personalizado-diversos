import React, { useState, useEffect, useRef } from 'react';
import { Message, PersonaType, Conversation, ChatMode } from './types';
import { personas } from './config/personas';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import PersonaSelector from './components/PersonaSelector';
import ModeSelector from './components/ModeSelector';
import RightPanel from './components/RightPanel';
import TypingIndicator from './components/TypingIndicator';
import { apiService } from './services/api';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('personal');
  const [selectedMode, setSelectedMode] = useState<ChatMode>('expert');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await apiService.getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      text,
      isBot: false,
      timestamp: new Date(),
      conversationId: currentConversationId || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await apiService.sendMessage({
        message: text,
        persona: selectedPersona,
        mode: selectedMode,
        conversationId: currentConversationId || undefined,
      });

      setCurrentConversationId(response.conversationId);

      const botMessage: Message = {
        id: generateId(),
        text: response.response,
        isBot: true,
        timestamp: new Date(),
        conversationId: response.conversationId,
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      const errorMessage: Message = {
        id: generateId(),
        text: `Desculpe, ocorreu um erro. Tente novamente. (${error.message})`,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handlePersonaChange = (persona: PersonaType) => {
    setSelectedPersona(persona);
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleModeChange = (mode: ChatMode) => {
    setSelectedMode(mode);
    setMessages([]);
    setCurrentConversationId(null);
  };

  const handleQuickStart = (persona: PersonaType, option: any) => {
    // Switch to the persona if different
    if (selectedPersona !== persona) {
      setSelectedPersona(persona);
      setMessages([]);
      setCurrentConversationId(null);
    }

    // Generate initial message based on selected option
    const initialMessage = `Gostaria de ajuda com: ${option.title}. ${option.description}`;
    
    // Send the message automatically
    handleSendMessage(initialMessage);
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const currentPersona = personas.find(p => p.id === selectedPersona);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Chatbot Personalizado</h1>
              <a 
                href="https://www.diegofontedev.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-3 text-lg text-blue-600 font-bold hover:text-blue-700 transition-colors cursor-pointer"
              >
                made by Diego Fonte
              </a>
              <div className="flex items-center ml-4 space-x-2">
                {currentPersona && (
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${currentPersona.color}`}>
                    {currentPersona.name}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                  selectedMode === 'expert' 
                    ? 'bg-blue-500' 
                    : 'bg-green-500'
                }`}>
                  {selectedMode === 'expert' ? '🎯 Especialista' : '💬 Livre'}
                </span>
              </div>
            </div>
            <button
              onClick={startNewConversation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Nova Conversa
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-4 p-4">
          
          {/* Left Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm flex flex-col" style={{height: 'calc(100vh - 120px)'}}>
              <ModeSelector
                selectedMode={selectedMode}
                onModeChange={handleModeChange}
              />
              <div className="flex-1 overflow-y-auto p-4">
                <PersonaSelector
                  selectedPersona={selectedPersona}
                  onPersonaChange={handlePersonaChange}
                  onQuickStart={handleQuickStart}
                />
              </div>
            </div>
          </div>

          {/* Center Chat */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow-sm flex flex-col" style={{height: 'calc(100vh - 120px)'}}>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <h3 className="text-lg font-medium">Olá! 👋</h3>
                    <p className="mt-2">
                      {selectedMode === 'expert' 
                        ? 'Modo Especialista ativo - foco em sua área específica.'
                        : 'Modo Livre ativo - posso conversar sobre qualquer assunto.'
                      }
                    </p>
                    <p className="text-sm mt-2">
                      Assistente: <strong>{currentPersona?.name}</strong> | 
                      Modo: <strong>{selectedMode === 'expert' ? 'Especialista' : 'Livre'}</strong>
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
              
              <ChatInput 
                onSendMessage={handleSendMessage}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm" style={{height: 'calc(100vh - 120px)'}}>
              <RightPanel
                selectedPersona={selectedPersona}
                selectedMode={selectedMode}
                onSuggestionClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;