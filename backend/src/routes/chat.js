const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { generateResponse } = require('../services/openai');
const { getDatabase } = require('../database/database');

const router = express.Router();

// Validation middleware
const validateChatMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('persona')
    .isIn(['legal', 'sales', 'support', 'personal'])
    .withMessage('Invalid persona type'),
  body('mode')
    .optional()
    .isIn(['expert', 'free'])
    .withMessage('Invalid mode type'),
  body('conversationId')
    .optional()
    .isUUID()
    .withMessage('Invalid conversation ID format'),
];

// Generate conversation title from first message
const generateConversationTitle = (message) => {
  const words = message.split(' ').slice(0, 6).join(' ');
  return words.length > 50 ? words.substring(0, 47) + '...' : words;
};

// POST /api/chat
router.post('/', validateChatMessage, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { message, persona, mode = 'expert', conversationId } = req.body;
    const db = getDatabase();

    let finalConversationId = conversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      finalConversationId = uuidv4();
      const title = generateConversationTitle(message);
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO conversations (id, title, persona) VALUES (?, ?, ?)',
          [finalConversationId, title, persona],
          function(err) {
            if (err) reject(err);
            else resolve(this);
          }
        );
      });
    }

    // Get conversation history for context
    const conversationHistory = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
        [finalConversationId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    // Save user message
    const userMessageId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (id, conversation_id, text, is_bot) VALUES (?, ?, ?, ?)',
        [userMessageId, finalConversationId, message, false],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    // Generate AI response
    console.log('🚀 CHAMANDO generateResponse...');
    console.log('📝 Message:', message);
    console.log('👤 Persona:', persona);
    console.log('⚙️ Mode:', mode);
    const aiResponse = await generateResponse(message, persona, mode, conversationHistory);
    console.log('✅ Resposta gerada:', aiResponse.substring(0, 50) + '...');

    // Save AI message
    const aiMessageId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (id, conversation_id, text, is_bot) VALUES (?, ?, ?, ?)',
        [aiMessageId, finalConversationId, aiResponse, true],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    // Update conversation updated_at
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [finalConversationId],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    res.status(200).json({
      response: aiResponse,
      conversationId: finalConversationId,
      messageId: aiMessageId,
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Send appropriate error response
    if (error.message.includes('OpenAI')) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process chat message',
      });
    }
  }
});

module.exports = router;