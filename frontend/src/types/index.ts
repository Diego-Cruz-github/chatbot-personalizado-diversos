export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  conversationId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  persona: PersonaType;
}

export type PersonaType = 'legal' | 'sales' | 'support' | 'personal';

export type ChatMode = 'expert' | 'free';

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
  icon: string;
}

export interface ChatState {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  selectedPersona: PersonaType;
  isLoading: boolean;
  isTyping: boolean;
}