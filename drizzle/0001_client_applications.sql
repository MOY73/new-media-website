CREATE TABLE IF NOT EXISTS client_applications (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  services TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_summary TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','contacted','qualified','closed')),
  attachment_count INTEGER NOT NULL DEFAULT 0,
  email_status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_client_applications_reference
ON client_applications(reference);

CREATE INDEX IF NOT EXISTS idx_client_applications_status_created
ON client_applications(status, created_at DESC);

CREATE TABLE IF NOT EXISTS client_application_files (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(application_id) REFERENCES client_applications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_client_application_files_application
ON client_application_files(application_id);

CREATE TABLE IF NOT EXISTS website_application_limits (
  attempt_key TEXT PRIMARY KEY,
  last_created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

PRAGMA optimize;
