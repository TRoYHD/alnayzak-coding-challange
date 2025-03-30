"use client";

import { useState, useEffect, useRef, useTransition, ChangeEvent } from "react";
import { submitProfileForm } from "../lib/actions";
import { Input } from "./ui/input";
import { TextArea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useToast } from "./toast-provider";
import { UserProfile, FormState } from "../types";
import { createSchemas, ClientFormValues } from "../lib/schemas";
import { Locale, defaultLocale } from "../i18n/config";
import { getDictionary } from "../i18n/utils";
import Image from "next/image";

const initialState: FormState = {};

interface ProfileFormProps {
  initialData: UserProfile;
  locale?: Locale;
}

export function ProfileForm({ initialData, locale = defaultLocale }: ProfileFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);
  const lastValidatedFormData = useRef<any>(null);
  
  // Get the dictionary only once during component initialization
  const dictionaryRef = useRef(getDictionary(locale)); 
  const dictionary = dictionaryRef.current;
  
  // Similar approach for the validation schema
  const schemaRef = useRef(createSchemas(locale).clientValidationSchema);
  const clientValidationSchema = schemaRef.current;
  
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
  
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  
  // Validate only when touched fields really change, and compare against previous validation
  const validateForm = () => {
    if (Object.keys(touched).length === 0) return;
    
    // Check if we're validating the same data as before
    if (
      lastValidatedFormData.current && 
      JSON.stringify(lastValidatedFormData.current) === JSON.stringify(formData)
    ) {
      return; // Skip validation if data hasn't changed
    }
    
    // Store current formData for future comparison
    lastValidatedFormData.current = { ...formData };
    
    const validationResult = clientValidationSchema.safeParse(formData);
    if (!validationResult.success) {
      setClientErrors(validationResult.error.flatten().fieldErrors);
    } else {
      setClientErrors({});
    }
  };
  
  // Manual validation when touched changes
  useEffect(() => {
    validateForm();
  }, [touched]); // Only depend on touched, not formData
  
  // Handle toast notifications for form state changes, but only after the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (formState.success) {
      showToast(formState.message || dictionary.notifications.success, "success");
    } else if (formState.message && formState.errors && Object.keys(formState.errors).length > 0) {
      showToast(formState.message || dictionary.notifications.error, "error");
    }
  }, [formState, showToast]); // Removed dictionary from dependencies
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
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
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    
    // Manually validate one more time before submission
    const validationResult = clientValidationSchema.safeParse(formData);
    if (!validationResult.success) {
      setClientErrors(validationResult.error.flatten().fieldErrors);
      return;
    }
    
    const formDataToSubmit = new FormData(e.currentTarget);
    if (selectedFile) {
      formDataToSubmit.append('avatar', selectedFile);
    }
    
    startTransition(async () => {
      try {
        const result = await submitProfileForm(formState, formDataToSubmit, locale);
        setFormState(result);
      } catch (error) {
        console.error("Form submission error:", error);
        setFormState({
          success: false,
          errors: { server: ["An unexpected error occurred"] },
          message: "Failed to update profile"
        });
      }
    });
  };
  
  const getFieldError = (fieldName: keyof ClientFormValues) => {
    if (clientErrors[fieldName] && touched[fieldName]) {
      return clientErrors[fieldName];
    }
    return formState.errors?.[fieldName];
  };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
      
      {/* Profile Picture Upload with Preview */}
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
      {formState.errors?.server && (
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
                  {formState.errors.server.map((error, index) => (
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