export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface FormState {
  errors?: {
      name?: string[];
      email?: string[];
      bio?: string[];
      server?: string[];
      [key: string]: string[] | undefined; 
  };
  success?: boolean;
  message?: string;
}