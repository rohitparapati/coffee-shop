const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// DB file will live here:
// coffee-shop/server/data/coffee.db
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "coffee.db");

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Faster + safer defaults for local dev
  await dbInstance.exec("PRAGMA foreign_keys = ON;");
  await dbInstance.exec("PRAGMA journal_mode = WAL;");

  await initSchema(dbInstance);
  return dbInstance;
}

async function initSchema(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      valid_from TEXT NOT NULL,  -- YYYY-MM-DD
      valid_to TEXT NOT NULL,    -- YYYY-MM-DD
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      date TEXT NOT NULL,        -- YYYY-MM-DD
      start_time TEXT NOT NULL,  -- HH:MM
      end_time TEXT NOT NULL,    -- HH:MM
      table_id TEXT NOT NULL,    -- e.g. T2-01 or T4-03 etc
      party_size INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      resolved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { getDb };
