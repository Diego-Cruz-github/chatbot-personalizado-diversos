import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

// Função para processar formatação de texto
const formatText = (text: string): React.ReactNode => {
  // Quebra o texto em linhas
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Processa negrito (**texto**)
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    const formattedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove os asteriscos e aplica negrito
        const boldText = part.slice(2, -2);
        return <strong key={`${lineIndex}-${partIndex}`}>{boldText}</strong>;
      }
      return part;
    });
    
    // Retorna a linha formatada com quebra de linha (exceto a última)
    return (
      <span key={lineIndex}>
        {formattedLine}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.isBot
            ? 'bg-gray-200 text-gray-800'
            : 'bg-blue-500 text-white'
        }`}
      >
        <div className="text-sm" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", "Roboto", "Ubuntu", "Cantarell", sans-serif' }}>
          {formatText(message.text)}
        </div>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;