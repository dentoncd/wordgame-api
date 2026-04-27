const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'gamerequests.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// create the db if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS game_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        game TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

module.exports = db;