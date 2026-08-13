ALTER TABLE client_applications ADD COLUMN client_uid TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_client_applications_uid_created ON client_applications(client_uid, created_at DESC);

CREATE TABLE IF NOT EXISTS client_profiles (
  firebase_uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', photo_url TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS client_projects (
  id TEXT PRIMARY KEY, client_uid TEXT NOT NULL, title TEXT NOT NULL, service TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new', progress INTEGER NOT NULL DEFAULT 0, current_stage TEXT NOT NULL DEFAULT '', deadline TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_projects_uid_updated ON client_projects(client_uid, updated_at DESC);
CREATE TABLE IF NOT EXISTS client_requests (
  id TEXT PRIMARY KEY, client_uid TEXT NOT NULL, project_id TEXT NOT NULL DEFAULT '', title TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'change',
  details TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'normal', status TEXT NOT NULL DEFAULT 'new', employee_note TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_requests_uid_status ON client_requests(client_uid, status, updated_at DESC);
CREATE TABLE IF NOT EXISTS client_deliveries (
  id TEXT PRIMARY KEY, client_uid TEXT NOT NULL, project_id TEXT NOT NULL DEFAULT '', title TEXT NOT NULL, message TEXT NOT NULL DEFAULT '',
  object_key TEXT NOT NULL UNIQUE, original_name TEXT NOT NULL, content_type TEXT NOT NULL, size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered', created_by TEXT NOT NULL, approved_at INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_deliveries_uid_created ON client_deliveries(client_uid, created_at DESC);
CREATE TABLE IF NOT EXISTS client_progress (
  client_uid TEXT PRIMARY KEY, visited_sections TEXT NOT NULL DEFAULT '[]', score INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL
);
