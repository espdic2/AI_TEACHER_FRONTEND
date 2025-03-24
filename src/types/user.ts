export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
  createdAt: string;
} 