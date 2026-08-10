export type ClientStatus = 'lead' | 'discovery' | 'proposal' | 'won' | 'active';
export type TaskStatus = 'open' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';
export type BusinessLeadStatus = 'new' | 'working' | 'contacted' | 'interested' | 'follow_up' | 'not_interested' | 'converted';
export type BusinessLeadOutcome = 'not_contacted' | 'no_answer' | 'follow_up' | 'interested' | 'not_interested' | 'converted';

// The executable D1 migration lives in drizzle/0000_employee_portal.sql.
// These types document the shared employee-portal records used by the Worker.
export interface EmployeeMessage {
  id: string;
  author_username: string;
  author_name: string;
  body: string;
  created_at: number;
}

export interface EmployeeClient {
  id: string;
  name: string;
  contact: string;
  service: string;
  value: number;
  status: ClientStatus;
  next_step: string;
  owner: string;
  created_by: string;
  created_at: number;
  updated_at: number;
}

export interface EmployeeTask {
  id: string;
  title: string;
  client_name: string;
  assignee: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_by: string;
  created_at: number;
  updated_at: number;
}

export type ApplicationStatus = 'new' | 'reviewing' | 'contacted' | 'qualified' | 'closed';

export interface ClientApplication {
  id: string;
  reference: string;
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  services: string;
  budget_range: string;
  project_summary: string;
  payload_json: string;
  status: ApplicationStatus;
  attachment_count: number;
  email_status: string;
  created_at: number;
  updated_at: number;
}

export interface BusinessLead {
  id: string;
  neighborhood: string;
  name: string;
  activity: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  maps_url: string;
  priority: 1 | 2 | 3;
  score: number;
  recommended_service: string;
  contact_status: BusinessLeadStatus;
  owner: string;
  outcome: BusinessLeadOutcome;
  last_contact_at: number;
  notes: string;
  source: string;
  researched_at: string;
  converted_client_id: string;
  converted_task_id: string;
  updated_by: string;
  created_at: number;
  updated_at: number;
}
