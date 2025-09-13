import React from 'react';
import { PersonaType } from '../types';

interface PersonaOption {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaType;
  onOptionSelect: (option: PersonaOption) => void;
}

const personaOptions: Record<PersonaType, PersonaOption[]> = {
  legal: [
    {
      id: 'petition',
      title: 'Ajuda para Petição',
      description: 'Orientações para redigir petições e documentos jurídicos',
      emoji: '📋'
    },
    {
      id: 'contract',
      title: 'Análise de Contrato',
      description: 'Revisão e orientações sobre contratos',
      emoji: '📄'
    },
    {
      id: 'legal_advice',
      title: 'Consultoria Jurídica',
      description: 'Orientações legais gerais e dúvidas sobre direitos',
      emoji: '⚖️'
    },
    {
      id: 'law_research',
      title: 'Pesquisa Jurídica',
      description: 'Pesquisa de leis, jurisprudências e doutrinas',
      emoji: '🔍'
    }
  ],
  sales: [
    {
      id: 'lead_qualification',
      title: 'Qualificação de Leads',
      description: 'Estratégias para identificar e qualificar prospects',
      emoji: '🎯'
    },
    {
      id: 'sales_script',
      title: 'Scripts de Vendas',
      description: 'Criação de roteiros eficazes para abordagem',
      emoji: '📞'
    },
    {
      id: 'objection_handling',
      title: 'Tratamento de Objeções',
      description: 'Como superar resistências e fechar negócios',
      emoji: '💪'
    },
    {
      id: 'sales_strategy',
      title: 'Estratégia de Vendas',
      description: 'Planejamento e técnicas avançadas de vendas',
      emoji: '📈'
    }
  ],
  support: [
    {
      id: 'troubleshooting',
      title: 'Resolução de Problemas',
      description: 'Diagnóstico e soluções para problemas técnicos',
      emoji: '🔧'
    },
    {
      id: 'customer_service',
      title: 'Atendimento ao Cliente',
      description: 'Melhorar a experiência e satisfação do cliente',
      emoji: '😊'
    },
    {
      id: 'ticket_management',
      title: 'Gestão de Tickets',
      description: 'Organização e priorização de solicitações',
      emoji: '📋'
    },
    {
      id: 'knowledge_base',
      title: 'Base de Conhecimento',
      description: 'Criação de documentação e FAQs',
      emoji: '📚'
    }
  ],
  personal: [
    {
      id: 'productivity',
      title: 'Produtividade',
      description: 'Técnicas para otimizar tempo e tarefas',
      emoji: '⚡'
    },
    {
      id: 'organization',
      title: 'Organização',
      description: 'Métodos para organizar projetos e atividades',
      emoji: '📅'
    },
    {
      id: 'planning',
      title: 'Planejamento',
      description: 'Criação de planos e estratégias pessoais',
      emoji: '🗓️'
    },
    {
      id: 'general_help',
      title: 'Ajuda Geral',
      description: 'Assistência diversa e pesquisas gerais',
      emoji: '🤝'
    }
  ]
};

const personaNames: Record<PersonaType, string> = {
  legal: 'Assistente Jurídico',
  sales: 'Assistente de Vendas',
  support: 'Assistente de Suporte',
  personal: 'Assistente Pessoal'
};

const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  persona,
  onOptionSelect,
}) => {
  if (!isOpen) return null;

  const options = personaOptions[persona] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              🤖 {personaNames[persona]}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Escolha uma opção para começar uma conversa específica:
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => {
                  onOptionSelect(option);
                  onClose();
                }}
                className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-800">
                        {option.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Ou digite sua pergunta diretamente no chat
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;