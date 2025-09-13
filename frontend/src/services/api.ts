import axios from 'axios';
import { PersonaType, ChatMode, Message, Conversation } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export interface SendMessageRequest {
  message: string;
  persona: PersonaType;
  mode?: ChatMode;
  conversationId?: string;
}

export interface SendMessageResponse {
  response: string;
  conversationId: string;
}

export const apiService = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post('/chat', data);
    return response.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;