export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Doctor' | 'Nurse';
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}