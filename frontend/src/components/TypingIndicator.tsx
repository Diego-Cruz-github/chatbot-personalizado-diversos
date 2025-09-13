import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
        <div className="flex items-center space-x-1">
          <div className="text-sm">Digitando</div>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-600 rounded-full typing-indicator"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full typing-indicator" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full typing-indicator" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;