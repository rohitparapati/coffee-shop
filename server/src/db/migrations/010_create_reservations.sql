CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,          -- YYYY-MM-DD
  time TEXT NOT NULL,          -- HH:MM
  table_id TEXT NOT NULL,      -- e.g., T2-01
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',  -- active | cancelled
  created_at TEXT NOT NULL
);
