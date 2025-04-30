export interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'Patient' | 'Doctor' | null;
  token?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
    role: 'Patient' | 'Doctor' | null;
  };
}
