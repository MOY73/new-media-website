CREATE TABLE IF NOT EXISTS employee_messages (
  id TEXT PRIMARY KEY,
  author_username TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 1000),
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employee_messages_created_at
ON employee_messages(created_at);

CREATE TABLE IF NOT EXISTS employee_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  value REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'lead' CHECK(status IN ('lead','discovery','proposal','won','active')),
  next_step TEXT NOT NULL DEFAULT '',
  owner TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employee_clients_status_updated
ON employee_clients(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS employee_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  assignee TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','done')),
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employee_tasks_status_due
ON employee_tasks(status, due_date);

CREATE TABLE IF NOT EXISTS employee_login_attempts (
  attempt_key TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employee_login_attempts_updated
ON employee_login_attempts(updated_at);

PRAGMA optimize;
