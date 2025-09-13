const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/chatbot.db');
let db;

const initializeDatabase = () => {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('📄 Connected to SQLite database');
  });

  // Create tables
  db.serialize(() => {
    // Conversations table
    db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        persona TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        text TEXT NOT NULL,
        is_bot BOOLEAN NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
      )
    `);

    // Users table (for future authentication)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Templates table
    db.run(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        persona TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  return db;
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Gracefully shutting down database...');
  closeDatabase();
  process.exit(0);
});

module.exports = { 
  initializeDatabase,
  getDatabase,
  closeDatabase,
};