CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  path  TEXT NOT NULL,
  type  TEXT NOT NULL CHECK(type IN ('movie', 'series', 'anime')),
  icon  TEXT NOT NULL DEFAULT 'folder'
);

CREATE TABLE IF NOT EXISTS history (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name  TEXT NOT NULL,
  original_path  TEXT NOT NULL,
  dest_path      TEXT NOT NULL,
  category_id    INTEGER REFERENCES categories(id),
  operated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Las rutas se configuran desde la app en Ajustes > Rutas
-- Dentro del contenedor, el filesystem del host está montado en /host
-- Ejemplo: /host/mnt/storage/downloads
INSERT OR IGNORE INTO settings (key, value) VALUES ('downloads_path', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('media_base_path', '');
