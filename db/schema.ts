export type ClientStatus = 'lead' | 'discovery' | 'proposal' | 'won' | 'active';
export type TaskStatus = 'open' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

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
