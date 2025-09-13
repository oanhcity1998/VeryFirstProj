export interface Employee {
  id: number;
  name: string;
  birthday: string;
  gender: boolean;
  work_phone: string;
  work_email: string;
  department_id: number;
  department: string;
  job_id: number;
  job_name: string;
  status: string;
  cccd: string;
  issued_date_cccd: string;
  issued_place_cccd: string;
  permanent_address: string;
  temporary_address: string;
  tax_id: string;
  insurance_id: string;
  bank_account: string;
  contract: Contract[];
}

export interface Contract {
  id: number;
  x_contract_type: string;
  x_contract_term: boolean;
  date_start: string;
  date_end: string;
  wage: number;
  x_bonus: number;
}

export interface EmployeeResponse {
  data: Employee[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface EmployeeState {
  employees: Employee[];
  meta: {
    page: number;
    limit: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface EmployeeQueryParams {
  q?: string;
  department_id?: number;
  job_id?: number;
  status?: string;
  page?: number;
  limit?: number;
}
