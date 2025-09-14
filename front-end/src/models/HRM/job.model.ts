export interface Job {
  id: number;
  name: string;
  code: string | null;
  priority_level: number | null;
  note: string | null;
}

export interface JobResponse {
  data: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface JobCreateRequest {
  name: string;
  code?: string | null;
  priority_level?: number | null;
  note?: string | null;
}

export interface JobCreateResponse {
  message?: string;
  data?: Job;
  error?: string;
}

export interface JobUpdateRequest {
  name?: string;
  code?: string | null;
  priority_level?: number | null;
  note?: string | null;
}

export interface JobUpdateResponse {
  message?: string;
  data?: Job;
  error?: string;
}

export interface JobDeleteResponse {
  message?: string;
  error?: string;
}
