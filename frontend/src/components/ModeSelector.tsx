import React from 'react';
import { ChatMode } from '../types';

interface ModeSelectorProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'expert' as ChatMode,
      icon: '🎯',
      title: 'Modo Especialista',
      description: 'Foco na área específica do assistente selecionado',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
    },
    {
      id: 'free' as ChatMode,
      icon: '💬',
      title: 'Modo Livre',
      description: 'Conversa geral sobre qualquer assunto',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
    },
  ];

  return (
    <div className="p-3 border-b border-gray-200 bg-gray-50">
      <h4 className="text-xs font-semibold text-gray-700 mb-2 text-center">
        Modo de Conversa
      </h4>
      <div className="flex gap-1.5">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 p-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedMode === mode.id
                ? `bg-gradient-to-r ${mode.color} text-white shadow-md transform scale-[1.02]`
                : `bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300`
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-base">{mode.icon}</span>
              <span className="font-semibold text-xs leading-tight">{mode.title}</span>
              <span className={`text-xs leading-tight ${
                selectedMode === mode.id ? 'text-white opacity-90' : 'text-gray-500'
              }`}>
                {mode.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;