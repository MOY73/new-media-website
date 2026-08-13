CREATE TABLE IF NOT EXISTS client_support_tickets (
  id TEXT PRIMARY KEY,
  client_uid TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','waiting_client','resolved','closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  resolved_at INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_client_updated ON client_support_tickets(client_uid, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status_updated ON client_support_tickets(status, updated_at DESC);
CREATE TABLE IF NOT EXISTS client_support_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK(sender_type IN ('client','employee','system')),
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 2500),
  created_at INTEGER NOT NULL,
  FOREIGN KEY(ticket_id) REFERENCES client_support_tickets(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_created ON client_support_messages(ticket_id, created_at ASC);
