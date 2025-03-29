// app/components/profile-form.tsx
"use client";

import { useState, useEffect, useTransition, ChangeEvent } from "react";
// @ts-ignore - Using experimental API
import { useFormState } from "react-dom";
import { submitProfileForm } from "../../lib/actions";
import { Input } from "../ui/input";
import { TextArea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "../toast-provider";
import { UserProfile, FormState } from "../../types";
import { createSchemas, ClientFormValues } from "../../lib/schemas";
import { Locale, defaultLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/utils";
import Image from "next/image";

const initialState: FormState = {};

interface ProfileFormProps {
  initialData: UserProfile;
  locale?: Locale;
}

export function ProfileForm({ initialData, locale = defaultLocale }: ProfileFormProps) {
  const dictionary = getDictionary(locale);
  const { clientValidationSchema } = createSchemas(locale);
  
  // Form state
  const [formData, setFormData] = useState<Omit<UserProfile, "id">>({
    name: initialData.name,
    email: initialData.email,
    bio: initialData.bio || "",
    avatar: initialData.avatar,
  });
  
  // Client-side validation state
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Profile picture preview
  const [previewImage, setPreviewImage] = useState<string | null>(initialData.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Server state - fixed the type signature to match useFormState requirements
  const submitWithLocale = (state: FormState, formData: FormData) => 
    submitProfileForm(state, formData, locale);
  
  const [state, formAction] = useFormState(submitWithLocale, initialState);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  
  // Validate client-side on form data change
  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    
    const validationResult = clientValidationSchema.safeParse(formData);
    
    if (!validationResult.success) {
      setClientErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setClientErrors({});
    }
  }, [formData, clientValidationSchema]);
  
  // Show success/error toast when form submission completes
  useEffect(() => {
    if (state.success) {
      showToast(state.message || dictionary.notifications.success, "success");
      
      // Reset form state after successful submission
      setTimeout(() => {
        // Create empty form data without arguments
        const emptyFormData = new FormData();
        formAction(emptyFormData);
      }, 5000);
    } else if (state.message && (state.errors && Object.keys(state.errors).length > 0)) {
      showToast(state.message || dictionary.notifications.error, "error");
    }
  }, [state, showToast, dictionary, formAction]);
  
  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  
  // Handle form field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  
  // Handle profile picture upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    setSelectedFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Form submission handler with client-side validation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    // Client-side validation
    const validationResult = clientValidationSchema.safeParse(formData);
    if (!validationResult.success) {
      setClientErrors(validationResult.error.flatten().fieldErrors);
      return;
    }
    
    const formDataToSubmit = new FormData(e.currentTarget);
    
    // Add the profile picture if selected
    if (selectedFile) {
      formDataToSubmit.append('avatar', selectedFile);
    }
    
    // Start the transition for the form submission
    startTransition(() => {
      formAction(formDataToSubmit);
    });
  };
  
  // Determine if a field has an error (client or server)
  const getFieldError = (fieldName: keyof ClientFormValues) => {
    if (clientErrors[fieldName] && touched[fieldName]) {
      return clientErrors[fieldName];
    }
    return state.errors?.[fieldName];
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      
      {/* Enhanced Profile Picture Upload with Preview */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {dictionary.form.profilePicture.label}
        </label>
        
        <div className="flex items-start space-x-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
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
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-col space-y-1">
              <label 
                htmlFor="avatar-upload" 
                className="inline-flex cursor-pointer items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm border border-blue-300 hover:bg-blue-50"
              >
                Choose Image
              </label>
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isPending}
              />
              <p className="text-xs text-gray-500">{selectedFile ? selectedFile.name : dictionary.form.profilePicture.description}</p>
            </div>
            
            {selectedFile && (
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-800"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewImage(initialData.avatar || null);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Display server errors */}
      {state.errors?.server && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {dictionary.validation.server.error}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {state.errors.server.map((error:any, index:any) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || Object.keys(clientErrors).length > 0}
        >
          {isPending ? dictionary.form.submitting : dictionary.form.submit}
        </Button>
      </div>
    </form>
  );
}