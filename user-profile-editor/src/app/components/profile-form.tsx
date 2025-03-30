'use client';

import { useState, useRef } from "react";
import { Input } from "./ui/input";
import { TextArea } from "./ui/textarea";
import { Button } from "./ui/button";
import { UserProfile, FormState } from "../types";
import { Locale, defaultLocale } from "../i18n/config";
import { getDictionary } from "../i18n/utils";
import { submitProfileForm } from "../lib/actions";
import { useToast } from "./toast-provider";
import { createSchemas } from "../lib/schemas";
import { useRTL } from '../context/rtl-context';

interface ProfileFormProps {
  initialData: UserProfile;
  locale?: Locale;
}

export function ProfileForm({ initialData, locale = defaultLocale }: ProfileFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);
  const lastValidatedFormData = useRef<any>(null);
  const { isRTL } = useRTL();

  // Get the dictionary only once during component initialization
  const dictionaryRef = useRef(getDictionary(locale)); 
  const dictionary = dictionaryRef.current;
  
  const [formData, setFormData] = useState<Omit<UserProfile, "id">>({
    name: initialData.name,
    email: initialData.email,
    bio: initialData.bio || "",
    avatar: initialData.avatar,
  });
  
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [previewImage, setPreviewImage] = useState<string | null>(initialData.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formState, setFormState] = useState<FormState>({});
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();
  
  
  const handleFormStateChange = (newState: FormState) => {
    const wasFirstRender = isFirstRender.current;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    
    setFormState(newState);
    
    // Skip toast only for the initial render state set, not for form submissions
    if (wasFirstRender && !newState.success && !newState.message) {
      return;
    }
    
    if (newState.success) {
      showToast(newState.message || dictionary.notifications.success, "success");
    } else if (newState.message && newState.errors && Object.keys(newState.errors).length > 0) {
      showToast(newState.message || dictionary.notifications.error, "error");
    }
  };
  
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  
  // Update form data
  const updatedFormData = { ...formData, [name]: value };
  setFormData(updatedFormData);
  
  // Mark as touched
  setTouched(prev => ({ ...prev, [name]: true }));
  
  // Get the validation schema
  const { clientValidationSchema } = createSchemas(locale);
  
  try {
    // Explicit validation based on field name
    if (name === 'name') {
      // Validate just the name field
      const result = clientValidationSchema.shape.name.safeParse(value);
      
      if (!result.success) {
        setClientErrors(prev => ({
          ...prev,
          name: result.error.errors.map(err => err.message)
        }));
      } else {
        // Clear errors for this field
        setClientErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.name;
          return newErrors;
        });
      }
    } 
    else if (name === 'email') {
      // Validate just the email field
      const result = clientValidationSchema.shape.email.safeParse(value);
      
      if (!result.success) {
        setClientErrors(prev => ({
          ...prev,
          email: result.error.errors.map(err => err.message)
        }));
      } else {
        // Clear errors for this field
        setClientErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
    else if (name === 'bio') {
      // Validate just the bio field
      const result = clientValidationSchema.shape.bio.safeParse(value);
      
      if (!result.success) {
        setClientErrors(prev => ({
          ...prev,
          bio: result.error.errors.map(err => err.message)
        }));
      } else {
        // Clear errors for this field
        setClientErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.bio;
          return newErrors;
        });
      }
    }
  } catch (error) {
    console.error("Validation error:", error);
  }
};
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => {
      // Only mark as touched if not already touched
      if (prev[name]) return prev;
      
      const newTouched = { ...prev, [name]: true };
      return newTouched;
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    if (Object.keys(clientErrors).length > 0) {
      return;
    }
    
    if (!formRef.current) return;
    
    setIsPending(true);
    
    try {
      const formDataToSubmit = new FormData(formRef.current);
      if (selectedFile) {
        formDataToSubmit.append('avatar', selectedFile);
      }
      
      const result = await submitProfileForm(formState, formDataToSubmit, locale);
      handleFormStateChange(result);
    } catch (error) {
      console.error("Error submitting form:", error);
      handleFormStateChange({
        success: false,
        errors: { server: ["An unexpected error occurred"] },
        message: "Failed to update profile"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const getFieldError = (fieldName: string) => {
    // Always show client errors if they exist, regardless of touched state
    if (clientErrors[fieldName]) {
      return clientErrors[fieldName];
    }
    return formState.errors?.[fieldName];
  };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6">
        <Input
          label={dictionary.form.name.label}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={dictionary.form.name.placeholder}
          required
          error={getFieldError('name')}
          disabled={isPending}
        />
        
        <Input
          label={dictionary.form.email.label}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={dictionary.form.email.placeholder}
          required
          error={getFieldError('email')}
          disabled={isPending}
        />
        
        <TextArea
          label={dictionary.form.bio.label}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={dictionary.form.bio.placeholder}
          maxLength={200}
          showCharCount
          error={getFieldError('bio')}
          disabled={isPending}
          description={dictionary.form.bio.description}
        />
      </div>
      
      {/* Improved Profile Picture Section */}
      <div className="pt-6 pb-6 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          {dictionary.form.profilePicture.label}
        </label>
        
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
          {/* Profile Picture Preview */}
          <div className="relative group">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50 shadow-sm">
              {previewImage ? (
                <img 
                  src={previewImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                  <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Overlay edit icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded-full h-full w-full flex items-center justify-center">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Upload Controls */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col space-y-2">
              <div className={`flex ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <label 
                  htmlFor="avatar-upload" 
                  className="inline-flex cursor-pointer items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm border border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {dictionary.form.profilePicture.chooseImage || "Choose Image"}
                </label>
                
                {selectedFile && (
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm border border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewImage(initialData.avatar || null);
                    }}
                  >
                    {dictionary.form.profilePicture.remove || "Remove"}
                  </button>
                )}
              </div>
              
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isPending}
              />
              
              <p className="text-sm text-gray-500">
                {selectedFile 
                  ? selectedFile.name 
                  : dictionary.form.profilePicture.description}
              </p>
            </div>
            
            <p className="text-xs text-gray-400">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>
      
      {/* Display server errors */}
      {formState.errors?.server && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <h3 className="text-sm font-medium text-red-800">
                {dictionary.validation.server.error}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className={`list-disc ${isRTL ? 'pr-5' : 'pl-5'} space-y-1`}>
                  {formState.errors.server.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Submit Button with better alignment and styling */}
      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button
          type="submit"
          isLoading={isPending}
          className="px-6"
          disabled={isPending || Object.keys(clientErrors).length > 0}
        >
          {isPending ? dictionary.form.submitting : dictionary.form.submit}
        </Button>
      </div>
    </form>
  );
}