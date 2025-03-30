export const defaultLocale = 'en';
export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];

export interface Dictionary {
  page: {
    title: string;
    subtitle: string;
  };
  form: {
    name: {
      label: string;
      placeholder: string;
    };
    email: {
      label: string;
      placeholder: string;
    };
    bio: {
      label: string;
      placeholder: string;
      description: string;
    };
    profilePicture: {
      label: string;
      description: string;
      chooseImage?: string;
      remove?: string;
    };
    submit: string;
    submitting: string;
  };
  validation: {
    name: {
      required: string;
      minLength: string;
      maxLength: string;
    };
    email: {
      required: string;
      invalid: string;
    };
    bio: {
      maxLength: string;
    };
    server: {
      error: string;
    };
  };
  notifications: {
    success: string;
    error: string;
  };
}