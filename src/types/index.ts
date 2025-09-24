// Re-export centralized content types
export * from './content';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}