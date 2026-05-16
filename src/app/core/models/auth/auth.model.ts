
export type RoleType = 'admin' | 'viewer'

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  token: string;
}
