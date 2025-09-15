export interface Employee {
  id: number;
  code: string;
  name: string;
  birthday: string;
  gender: "Nam" | "Nữ";
  work_phone: string;
  work_email: string;
  department_id: number;
  department_name: string;
  job_id: number;
  job_name: string;
  status: "active" | "inactive" | string;
  id_number: string;
  id_issued_place: string;
  id_issued_date: string;
  permanent_address: string;
  temporary_address: string;
  tax_id: string;
  insurance_id: string;
  bank_account: string;
  contract: Contract[];
}

export interface Contract {
  id: number;
  name: string;
  contract_type: string; // "fixed_term" | "permanent" | ...
  contract_term: string;
  date_start: string;
  date_end: string;
  wage: number;
  bonus: number;
}

export interface EmployeeResponse {
  data: Employee[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  error?: string;
}

export interface EmployeeDetailResponse {
  data: {
    profile: Omit<Employee, "contract"> & {
      id_number?: string;
      id_issued_place?: string;
      id_issued_date?: string;
      created_at: string;
      updated_at: string;
    };
    contracts: Contract[];
  };
  error?: string;
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
  gender?: "Nam" | "Nữ";
  page?: number;
  limit?: number;
}

export interface EmployeeCreateResponse {
  message?: string;
  error?: string;
}

export type ContractType =
  | "Hợp đồng lao động xác định thời hạn"
  | "Hợp đồng lao động không xác định thời hạn";

export interface EmployeeRequest {
  name?: string;
  code?: string;
  birthday?: string;
  gender?: "Nam" | "Nữ";
  work_phone?: string;
  work_email?: string;
  department_id?: number;
  job_id?: number;
  id_number?: string;
  id_issued_place?: string;
  id_issued_date?: string;
  permanent_address?: string;
  temporary_address?: string;
  tax_id?: string;
  insurance_id?: string;
  bank_account?: string;
  contract?: Contract[];
}

export interface EmployeeUpdateResponse {
  success?: boolean;
  updated_fields?: Partial<Employee>;
  ignored_fields?: Record<string, any>;
  unchanged_fields?: {
    [key: string]: {
      reason: string;
      old_value: any;
      new_value: any;
    };
  };
  error?: string;
}
