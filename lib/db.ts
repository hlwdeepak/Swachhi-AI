import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'swachhai.db');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch {}
}

let db: any;

function createMockDb() {
  const dummyStmt = {
    all: () => [],
    get: () => ({ c: 0, count: 0 }),
    run: () => ({ changes: 0, lastInsertRowid: 0 }),
  };
  return {
    pragma: () => {},
    exec: () => {},
    prepare: () => dummyStmt,
  };
}

export function getDb(): any {
  if (db) return db;

  if (process.env.GITHUB_ACTIONS === 'true') {
    db = createMockDb();
    return db;
  }

  try {
    const Database = require('better-sqlite3');
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  } catch (err) {
    console.warn('SQLite failed to initialize, using mock database:', err);
    db = createMockDb();
  }

  return db;
}

function initSchema(db: any) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'citizen',
        language TEXT NOT NULL DEFAULT 'en',
        ward TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS wards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL DEFAULT 'Ahmedabad',
        population INTEGER DEFAULT 0,
        complaint_count INTEGER DEFAULT 0,
        resolved_count INTEGER DEFAULT 0,
        segregation_rate REAL DEFAULT 0.0,
        collection_efficiency REAL DEFAULT 0.0,
        latitude REAL,
        longitude REAL
      );

      CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        phone TEXT,
        ward TEXT,
        current_lat REAL,
        current_lng REAL,
        availability TEXT NOT NULL DEFAULT 'available',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        ticket_id TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        description TEXT NOT NULL,
        original_language TEXT NOT NULL DEFAULT 'en',
        translated_description TEXT,
        latitude REAL,
        longitude REAL,
        address TEXT,
        ward TEXT,
        priority TEXT NOT NULL DEFAULT 'medium',
        priority_reason TEXT,
        status TEXT NOT NULL DEFAULT 'submitted',
        assigned_team TEXT,
        assigned_worker_id TEXT,
        ai_classification TEXT,
        ai_routing_explanation TEXT,
        image_url TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        resolved_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS complaint_timeline (
        id TEXT PRIMARY KEY,
        complaint_id TEXT NOT NULL,
        status TEXT NOT NULL,
        note TEXT,
        actor_id TEXT,
        actor_role TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (complaint_id) REFERENCES complaints(id)
      );

      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        worker_id TEXT,
        team TEXT,
        date TEXT NOT NULL,
        stops TEXT NOT NULL,
        total_distance REAL,
        estimated_time INTEGER,
        actual_time INTEGER,
        status TEXT NOT NULL DEFAULT 'planned',
        optimized INTEGER NOT NULL DEFAULT 0,
        improvement_pct REAL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );

      CREATE TABLE IF NOT EXISTS waste_reports (
        id TEXT PRIMARY KEY,
        complaint_id TEXT,
        image_url TEXT,
        classification TEXT,
        confidence REAL,
        recommendation TEXT,
        segregation_tips TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (complaint_id) REFERENCES complaints(id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        read INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward);
      CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
      CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON complaint_timeline(complaint_id);
    `);
  } catch (err) {
    console.warn('initSchema failed (safe in static export):', err);
  }
}
