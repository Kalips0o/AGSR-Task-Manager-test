export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  email?: string;
  error?: string;
  details?: unknown;
}
