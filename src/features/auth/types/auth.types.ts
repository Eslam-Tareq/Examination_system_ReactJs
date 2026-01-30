export type UserRole = "student" | "instructor";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
