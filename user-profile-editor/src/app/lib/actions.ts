'use server'

import { createSchemas } from "./schemas";
import { FormState } from "../types";
import { revalidatePath } from "next/cache";
import { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/utils";

export async function getUser() {
  try {
    // For demo/task purposes, use a mock response instead of real API call
    // to avoid errors in production
    return {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      bio: "Frontend developer passionate about creating seamless user experiences. I enjoy working with React and TypeScript to build modern web applications.",
      avatar: "/images/placeholder.jpg",
    };
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
    // Instead of making a real API request, simulate a successful update
    // Add a delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the data that would be saved in a real application
    console.log("Saving profile data:", {
      ...validatedFields.data,
      locale
    });
    
    // Revalidate the path to refresh the UI
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