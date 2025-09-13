const express = require('express');
const { param, validationResult } = require('express-validator');
const { getDatabase } = require('../database/database');

const router = express.Router();

// GET /api/conversations - Get all conversations
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    
    const conversations = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        GROUP BY c.id
        ORDER BY c.updated_at DESC
        LIMIT 50
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversations',
      message: error.message,
    });
  }
});

// GET /api/conversations/:id - Get specific conversation with messages
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid conversation ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const db = getDatabase();

    // Get conversation details
    const conversation = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM conversations WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    // Get messages for this conversation
    const messages = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    res.status(200).json({
      ...conversation,
      messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation',
      message: error.message,
    });
  }
});

// DELETE /api/conversations/:id - Delete conversation and all its messages
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid conversation ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const db = getDatabase();

    // Check if conversation exists
    const conversation = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM conversations WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    // Delete messages first (due to foreign key constraint)
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM messages WHERE conversation_id = ?',
        [id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    // Delete conversation
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM conversations WHERE id = ?',
        [id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    res.status(200).json({
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      error: 'Failed to delete conversation',
      message: error.message,
    });
  }
});

// PUT /api/conversations/:id/title - Update conversation title
router.put('/:id/title', [
  param('id').isUUID().withMessage('Invalid conversation ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    const db = getDatabase();

    const result = await new Promise((resolve, reject) => {
      db.run(
        'UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title.trim(), id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    res.status(200).json({
      message: 'Conversation title updated successfully',
    });
  } catch (error) {
    console.error('Update conversation title error:', error);
    res.status(500).json({
      error: 'Failed to update conversation title',
      message: error.message,
    });
  }
});

module.exports = router;