'use server'

import { createSchemas } from "./schemas";
import { FormState } from "../types";
import { revalidatePath } from "next/cache";
import { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/utils";

export async function getUser() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/user`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
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
  
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      return {
        errors: responseData.errors || { server: [dictionary.validation.server.error] },
        success: false,
        message: responseData.message || dictionary.notifications.error,
      };
    }
    
    revalidatePath(`/${locale}`);
    
    return {
      success: true,
      message: dictionary.notifications.success,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      errors: { server: ["An unexpected error occurred. Please try again later."] },
      success: false,
      message: dictionary.notifications.error,
    };
  }
}