CREATE TABLE IF NOT EXISTS business_leads (
  id TEXT PRIMARY KEY,
  neighborhood TEXT NOT NULL,
  name TEXT NOT NULL,
  activity TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  maps_url TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK(priority IN (1,2,3)),
  score INTEGER NOT NULL DEFAULT 0,
  recommended_service TEXT NOT NULL DEFAULT '',
  contact_status TEXT NOT NULL DEFAULT 'new' CHECK(contact_status IN ('new','working','contacted','interested','follow_up','not_interested','converted')),
  owner TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT 'not_contacted' CHECK(outcome IN ('not_contacted','no_answer','follow_up','interested','not_interested','converted')),
  last_contact_at INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'Google Maps',
  researched_at TEXT NOT NULL,
  converted_client_id TEXT NOT NULL DEFAULT '',
  converted_task_id TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_leads_neighborhood_priority
  ON business_leads(neighborhood, priority, score DESC);
CREATE INDEX IF NOT EXISTS idx_business_leads_status_updated
  ON business_leads(contact_status, updated_at DESC);

PRAGMA optimize;
