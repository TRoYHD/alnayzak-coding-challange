// app/lib/actions.ts
'use server'

import { createSchemas } from "../schemas";
import {  FormState } from "../../types";
import { getDictionary } from "../../i18n/utils";
import { mockUser, delay } from "../mock-data"
import { revalidatePath } from 'next/cache';
import { Locale } from '../../i18n/config';


// No try/catch, no error throwing - just return mock data
export async function getUser() {
  // Simply return the mock user without any chance of error
  return mockUser;
}

// No fetch calls for form submission either
export async function submitProfileForm(
  prevState: FormState,
  formData: FormData,
  locale: Locale = 'en'
): Promise<FormState> {
  const dictionary = getDictionary(locale);
  const { userProfileFormSchema } = createSchemas(locale);
  
  // Extract form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  
  // Validate with Zod
  const validatedFields = userProfileFormSchema.safeParse({
    name,
    email,
    bio: bio || undefined, // Handle optional bio
  });
  
  // Return validation errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: dictionary.notifications.error,
    };
  }
  
  // Always return success for valid data
  revalidatePath(`/${locale}`);
  
  return {
    success: true,
    message: dictionary.notifications.success,
  };
}