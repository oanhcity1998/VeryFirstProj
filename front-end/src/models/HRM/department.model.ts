export interface Department {
  id: number;
  name: string;
  code: string | null;
  manager_id: number | null;
  manager_name: string | null;
  note: string | null;
  employee_count?: number;
}

export interface DepartmentResponse {
  data: Department[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  code?: string | null;
  manager_id?: number | null;
  note?: string | null;
}

export interface DepartmentCreateResponse {
  message?: string;
  data?: Department;
  error?: string;
}

export interface DepartmentUpdateRequest {
  name?: string;
  code?: string | null;
  manager_id?: number | null;
  note?: string | null;
}

export interface DepartmentUpdateResponse {
  message?: string;
  data?: Department;
  error?: string;
}

export interface DepartmentDeleteResponse {
  message?: string;
  error?: string;
}
