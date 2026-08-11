ALTER TABLE employee_messages ADD COLUMN group_id TEXT NOT NULL DEFAULT 'general';
--> statement-breakpoint
ALTER TABLE employee_messages ADD COLUMN attachment_key TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE employee_messages ADD COLUMN attachment_name TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE employee_messages ADD COLUMN attachment_type TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE employee_messages ADD COLUMN attachment_size INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_employee_messages_group_created ON employee_messages(group_id, created_at);
--> statement-breakpoint
DELETE FROM employee_activity_log
WHERE id NOT IN (
  SELECT id FROM employee_activity_log ORDER BY created_at DESC LIMIT 100
);
