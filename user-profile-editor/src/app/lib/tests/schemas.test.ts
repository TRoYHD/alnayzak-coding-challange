
const mockDictionary = {
  validation: {
    name: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 50 characters'
    },
    email: {
      required: 'Email is required',
      invalid: 'Invalid email format'
    },
    bio: {
      maxLength: 'Bio cannot exceed 200 characters'
    },
    server: {
      error: 'Server error'
    }
  },
  notifications: {
    success: 'Success',
    error: 'Error'
  }
};

jest.mock('../../i18n/utils', () => ({
  getDictionary: jest.fn().mockReturnValue(mockDictionary)
}));

import { createSchemas } from '../schemas';

describe('Schema validation', () => {
  describe('userProfileSchema', () => {
    test('validates a complete user profile', () => {
      const { userProfileSchema } = createSchemas('en');
      
      const validProfile = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'This is a valid bio',
        avatar: '/images/avatar.jpg'
      };
      
      const result = userProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });
    
    test('accepts profile without optional fields', () => {
      const { userProfileSchema } = createSchemas('en');
      
      const validProfile = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const result = userProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });
    
    test('rejects profile with invalid id', () => {
      const { userProfileSchema } = createSchemas('en');
      
      const invalidProfile = {
        id: 123, 
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });
  
  describe('userProfileFormSchema', () => {
    test('validates form data without id and avatar', () => {
      const { userProfileFormSchema } = createSchemas('en');
      
      const validFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'This is a valid bio'
      };
      
      const result = userProfileFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });
    
    test('rejects form data with id field', () => {
      const { userProfileFormSchema } = createSchemas('en');
      
      const invalidFormData = {
        id: 'user-123', 
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const result = userProfileFormSchema.safeParse(invalidFormData);
      expect(result.success).toBe(true); 
    });
  });
  
  describe('clientValidationSchema', () => {
    test('validates name field correctly', () => {
      const { clientValidationSchema } = createSchemas('en');
      
      expect(clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com'
      }).success).toBe(true);
      
      const shortNameResult = clientValidationSchema.safeParse({
        name: 'J',
        email: 'john@example.com'
      });
      expect(shortNameResult.success).toBe(false);
      
      const longNameResult = clientValidationSchema.safeParse({
        name: 'J'.repeat(51),
        email: 'john@example.com'
      });
      expect(longNameResult.success).toBe(false);
      
      const emptyNameResult = clientValidationSchema.safeParse({
        name: '',
        email: 'john@example.com'
      });
      expect(emptyNameResult.success).toBe(false);
    });
    
    test('validates email field correctly', () => {
      const { clientValidationSchema } = createSchemas('en');
      
      expect(clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com'
      }).success).toBe(true);
      
      const invalidEmailResult = clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email'
      });
      expect(invalidEmailResult.success).toBe(false);
      
      const emptyEmailResult = clientValidationSchema.safeParse({
        name: 'John Doe',
        email: ''
      });
      expect(emptyEmailResult.success).toBe(false);
    });
    
    test('validates bio field correctly', () => {
      const { clientValidationSchema } = createSchemas('en');
      
      expect(clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'This is a valid bio'
      }).success).toBe(true);
      
      expect(clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com'
      }).success).toBe(true);
      
      const longBio = 'a'.repeat(201);
      const longBioResult = clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        bio: longBio
      });
      expect(longBioResult.success).toBe(false);
    });
    
    test('combines validation rules correctly', () => {
      const { clientValidationSchema } = createSchemas('en');
      
      const result = clientValidationSchema.safeParse({
        name: '',
        email: 'invalid',
        bio: 'a'.repeat(201)
      });
      
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.name).toBeDefined();
        expect(errors.email).toBeDefined();
        expect(errors.bio).toBeDefined();
      }
    });
  });
  
  describe('Localization', () => {
    test('uses correct error messages from dictionary', () => {
      const { clientValidationSchema } = createSchemas('en');
      
      const nameResult = clientValidationSchema.safeParse({
        name: 'J',
        email: 'john@example.com'
      });
      
      expect(nameResult.success).toBe(false);
      if (!nameResult.success) {
        const errors = nameResult.error.flatten().fieldErrors;
        expect(errors.name?.[0]).toBe(mockDictionary.validation.name.minLength);
      }
      
      const emailResult = clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'invalid'
      });
      
      expect(emailResult.success).toBe(false);
      if (!emailResult.success) {
        const errors = emailResult.error.flatten().fieldErrors;
        expect(errors.email?.[0]).toBe(mockDictionary.validation.email.invalid);
      }
      
      const bioResult = clientValidationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'a'.repeat(201)
      });
      
      expect(bioResult.success).toBe(false);
      if (!bioResult.success) {
        const errors = bioResult.error.flatten().fieldErrors;
        expect(errors.bio?.[0]).toBe(mockDictionary.validation.bio.maxLength);
      }
    });
  });
});