export interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'Patient' | 'Doctor' | null;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    name?: string;
    role: 'Patient' | 'Doctor' | null;
  };
}
