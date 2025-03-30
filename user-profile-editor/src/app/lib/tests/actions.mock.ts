'use server'

import { createSchemas } from "../schemas";
import {  FormState } from "../../types";
import { getDictionary } from "../../i18n/utils";
import { mockUser, delay } from "../mock-data"
import { revalidatePath } from 'next/cache';
import { Locale } from '../../i18n/config';


export async function getUser() {
  return mockUser;
}

export async function submitProfileForm(
  prevState: FormState,
  formData: FormData,
  locale: Locale = 'en'
): Promise<FormState> {
  const dictionary = getDictionary(locale);
  const { userProfileFormSchema } = createSchemas(locale);
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  
  const validatedFields = userProfileFormSchema.safeParse({
    name,
    email,
    bio: bio || undefined, 
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: dictionary.notifications.error,
    };
  }
  
  revalidatePath(`/${locale}`);
  
  return {
    success: true,
    message: dictionary.notifications.success,
  };
}