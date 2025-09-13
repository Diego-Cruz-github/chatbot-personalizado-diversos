import React from 'react';
import { PersonaType, ChatMode } from '../types';

interface RightPanelProps {
  selectedPersona: PersonaType;
  selectedMode: ChatMode;
  onSuggestionClick: (suggestion: string) => void;
}

const personaSuggestions: Record<PersonaType, string[]> = {
  legal: [
    "Como elaborar uma petição inicial?",
    "Quais documentos preciso para um contrato?",
    "Como funciona o processo trabalhista?",
    "Quais são meus direitos como consumidor?"
  ],
  sales: [
    "Como qualificar melhor meus leads?",
    "Técnicas para superar objeções",
    "Como criar um script de vendas eficaz?",
    "Estratégias para follow-up de clientes"
  ],
  support: [
    "Como reduzir tempo de resolução?",
    "Melhorar satisfação do cliente",
    "Organizar tickets por prioridade",
    "Criar base de conhecimento eficaz"
  ],
  personal: [
    "Técnicas de produtividade pessoal",
    "Como organizar minha agenda?",
    "Métodos para focar nas tarefas",
    "Planejamento de metas mensais"
  ]
};

const personaNames: Record<PersonaType, string> = {
  legal: 'Jurídico',
  sales: 'Vendas', 
  support: 'Suporte',
  personal: 'Pessoal'
};

const RightPanel: React.FC<RightPanelProps> = ({
  selectedPersona,
  selectedMode,
  onSuggestionClick,
}) => {
  const suggestions = personaSuggestions[selectedPersona] || [];
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          💡 Sugestões
        </h3>
        <p className="text-xs text-gray-600 text-center mt-1">
          {personaNames[selectedPersona]} • {selectedMode === 'expert' ? 'Especialista' : 'Livre'}
        </p>
      </div>

      {/* Suggestions */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              🎯 Perguntas Frequentes
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  <span className="text-blue-600 font-medium">Q:</span>
                  <span className="ml-2 text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              ⚡ Ações Rápidas
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onSuggestionClick("Me conte sobre suas principais funcionalidades")}
                className="w-full p-2.5 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm text-sm font-medium"
              >
                🔍 Explorar Funcionalidades
              </button>
              
              <button
                onClick={() => onSuggestionClick("Como você pode me ajudar especificamente?")}
                className="w-full p-2.5 text-left bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm text-sm font-medium"
              >
                🤖 Como Posso Ajudar?
              </button>

              <button
                onClick={() => onSuggestionClick("Quais são as melhores práticas na sua área?")}
                className="w-full p-2.5 text-left bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm text-sm font-medium"
              >
                📚 Melhores Práticas
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              💡 Dica
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              {selectedMode === 'expert' 
                ? `No modo especialista, foco apenas em questões de ${personaNames[selectedPersona].toLowerCase()}. Para assuntos gerais, use o modo livre.`
                : 'No modo livre, posso conversar sobre qualquer assunto. Sinta-se à vontade para perguntar o que quiser!'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Clique em qualquer sugestão para iniciar
        </p>
      </div>
    </div>
  );
};

export default RightPanel;