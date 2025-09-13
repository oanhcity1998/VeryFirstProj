export interface AuthState {
  session_id: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  session_id: string;
  uid: number;
}
