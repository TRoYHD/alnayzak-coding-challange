// src/app/lib/tests/actions.test.ts
import { submitProfileForm, getUser } from '../actions';
import { FormState } from '../../types';
import { createSchemas } from '../schemas';
import { revalidatePath } from 'next/cache';
import { Locale } from '../../i18n/config';

// Mock Next.js
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Important: Mock i18n with proper dictionary structure
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
    success: 'Success message',
    error: 'Error message'
  }
};

// Fix the getDictionary mock to return the entire dictionary
jest.mock('../../i18n/utils', () => ({
  getDictionary: jest.fn(() => mockDictionary)
}));

// Mock schemas
jest.mock('../schemas', () => ({
  createSchemas: jest.fn().mockReturnValue({
    userProfileFormSchema: {
      safeParse: jest.fn()
    }
  })
}));

// Create a mock FormData type
interface MockFormData {
  get: (key: string) => string | null;
}

describe('User API actions', () => {
  let mockFormData: MockFormData;
  let prevState: FormState;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock FormData
    mockFormData = {
      get: jest.fn()
    };
    (mockFormData.get as jest.Mock).mockImplementation(key => {
      if (key === 'name') return 'John Doe';
      if (key === 'email') return 'john@example.com';
      if (key === 'bio') return 'Test bio';
      return null;
    });
    
    // Setup initial state
    prevState = {
      errors: {},
      success: false,
      message: ''
    };
    
    // Mock fetch
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
  });
  
  describe('getUser', () => {
    test('fetches user data successfully', async () => {
      const mockUserData = { user: { id: 'user-123', name: 'John Doe', email: 'john@example.com', bio: 'Bio text' } };
      
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserData)
        })
      );
      
      const result = await getUser();
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/user/),
        expect.objectContaining({ cache: 'no-store' })
      );
      expect(result).toEqual(mockUserData.user);
    });
    
    test('throws error on failed fetch', async () => {
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({})
        })
      );
      
      await expect(getUser()).rejects.toThrow('Failed to fetch user data');
    });
    
    test('throws error on network failure', async () => {
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.reject(new Error('Network error'))
      );
      
      await expect(getUser()).rejects.toThrow();
    });
  });
  
  describe('submitProfileForm', () => {
    test('returns validation errors when validation fails', async () => {
      const mockValidationError = {
        success: false,
        error: {
          flatten: () => ({
            fieldErrors: {
              name: ['Name is required']
            }
          })
        }
      };
      
      // Set mock return value for validation
      const mockSafeParse = jest.fn().mockReturnValue(mockValidationError);
      (createSchemas as jest.Mock).mockReturnValue({
        userProfileFormSchema: {
          safeParse: mockSafeParse
        }
      });
      
      const result = await submitProfileForm(prevState, mockFormData as unknown as FormData, 'en' as Locale);
      
      expect(result.success).toBe(false);
      expect(result.errors).toEqual(mockValidationError.error.flatten().fieldErrors);
      expect(result.message).toBe(mockDictionary.notifications.error);
    });
    
    test('returns success when validation and API call succeed', async () => {
      // Mock successful validation
      const mockValidationSuccess = {
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Test bio'
        }
      };
      
      const mockSafeParse = jest.fn().mockReturnValue(mockValidationSuccess);
      (createSchemas as jest.Mock).mockReturnValue({
        userProfileFormSchema: {
          safeParse: mockSafeParse
        }
      });
      
      // Mock successful API response
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            message: 'Profile updated successfully' 
          })
        })
      );
      
      const result = await submitProfileForm(prevState, mockFormData as unknown as FormData, 'en' as Locale);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe(mockDictionary.notifications.success);
      expect(revalidatePath).toHaveBeenCalledWith('/en');
    });
    
    test('returns error when API call fails', async () => {
      // Mock successful validation but failed API call
      const mockValidationSuccess = {
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Test bio'
        }
      };
      
      const mockSafeParse = jest.fn().mockReturnValue(mockValidationSuccess);
      (createSchemas as jest.Mock).mockReturnValue({
        userProfileFormSchema: {
          safeParse: mockSafeParse
        }
      });
      
      // Mock failed API response
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ 
            success: false, 
            message: 'Failed to update profile',
            errors: { server: ['Server error occurred'] }
          })
        })
      );
      
      const result = await submitProfileForm(prevState, mockFormData as unknown as FormData, 'en' as Locale);
      
      expect(result.success).toBe(false);
      expect(result.errors).toEqual({ server: ['Server error occurred'] });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
    
    test('handles network errors gracefully', async () => {
      // Mock successful validation
      const mockValidationSuccess = {
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Test bio'
        }
      };
      
      const mockSafeParse = jest.fn().mockReturnValue(mockValidationSuccess);
      (createSchemas as jest.Mock).mockReturnValue({
        userProfileFormSchema: {
          safeParse: mockSafeParse
        }
      });
      
      // Mock network error
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.reject(new Error('Network error'))
      );
      
      const result = await submitProfileForm(prevState, mockFormData as unknown as FormData, 'en' as Locale);
      
      expect(result.success).toBe(false);
      expect(result.errors).toEqual({ server: ["An unexpected error occurred. Please try again later."] });
      expect(result.message).toBe(mockDictionary.notifications.error);
    });
  });
});