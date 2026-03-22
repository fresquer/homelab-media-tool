import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'media-tool.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  fs.mkdirSync(DATA_DIR, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(
    path.join(process.cwd(), 'db', 'schema.sql'),
    'utf-8'
  );
  _db.exec(schema);

  return _db;
}

export type Setting = { key: string; value: string };
export type Category = { id: number; name: string; path: string; type: 'movie' | 'series' | 'anime'; icon: string };
export type HistoryEntry = {
  id: number;
  original_name: string;
  original_path: string;
  dest_path: string;
  category_id: number | null;
  operated_at: string;
};
