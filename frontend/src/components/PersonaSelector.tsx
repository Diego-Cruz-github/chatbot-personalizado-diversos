import React, { useState } from 'react';
import { PersonaType } from '../types';
import { personas } from '../config/personas';
import PersonaModal from './PersonaModal';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  onQuickStart?: (persona: PersonaType, option: any) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onPersonaChange,
  onQuickStart,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPersona, setModalPersona] = useState<PersonaType>('personal');

  const handleQuickStartClick = (persona: PersonaType) => {
    setModalPersona(persona);
    setModalOpen(true);
  };

  const handleOptionSelect = (option: any) => {
    if (onQuickStart) {
      onQuickStart(modalPersona, option);
    }
  };
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 text-center">
          🤖 Assistentes
        </h3>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          {personas.map((persona) => (
            <div key={persona.id} className="space-y-2">
              <button
                onClick={() => onPersonaChange(persona.id)}
                className={`persona-button ${
                  selectedPersona === persona.id ? `selected ${persona.id}` : ''
                }`}
              >
                <div className="font-medium text-sm">{persona.name}</div>
                <div className="text-xs opacity-80 mt-1 leading-tight">
                  {persona.description}
                </div>
              </button>
              
              {selectedPersona === persona.id && (
                <button
                  onClick={() => handleQuickStartClick(persona.id)}
                  className="w-full p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-xs font-medium"
                >
                  ⚡ Início Rápido
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <PersonaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        persona={modalPersona}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
};

export default PersonaSelector;