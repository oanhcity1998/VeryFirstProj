export interface AuthState {
  uid: number | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export interface LoginRequest {
  jsonrpc: string;
  method: string;
  params: {
    username: string;
    password: string;
  };
}

export interface LoginResponseData {
  uid: number;
  message: string;
}

export interface LoginResponse {
  jsonrpc: string;
  id: null;
  result: {
    result: LoginResponseData;
  };
}
