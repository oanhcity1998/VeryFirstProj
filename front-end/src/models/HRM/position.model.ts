export interface Position {
  id: number;
  name: string;
  code: string | null;
  priority_level: number | null;
  note: string | null;
}

export interface PositionResponse {
  data: Position[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface PositionCreateRequest {
  name: string;
  code?: string | null;
  priority_level?: number | null;
  note?: string | null;
}

export interface PositionCreateResponse {
  message?: string;
  data?: Position;
  error?: string;
}

export interface PositionUpdateRequest {
  name?: string;
  code?: string | null;
  priority_level?: number | null;
  note?: string | null;
}

export interface PositionUpdateResponse {
  message?: string;
  data?: Position;
  error?: string;
}

export interface PositionDeleteResponse {
  message?: string;
  error?: string;
}
