// app/lib/schemas.ts
import { z } from "zod";
import { getDictionary } from "../../i18n/utils";
import { Locale } from "../../i18n/config";

// Create schemas with dynamic error messages based on locale
export function createSchemas(locale: Locale) {
  const dictionary = getDictionary(locale);
  
  const userProfileSchema = z.object({
    id: z.string(),
    name: z.string().min(2, {
      message: dictionary.validation.name.minLength,
    }).max(50, {
      message: dictionary.validation.name.maxLength,
    }),
    email: z.string().email({
      message: dictionary.validation.email.invalid,
    }),
    bio: z.string().max(200, {
      message: dictionary.validation.bio.maxLength,
    }).optional(),
    avatar: z.string().optional(),
  });
  
  const userProfileFormSchema = userProfileSchema.omit({ id: true, avatar: true });
  
  // Client-side validation schema
  const clientValidationSchema = z.object({
    name: z.string()
      .min(1, { message: dictionary.validation.name.required })
      .min(2, { message: dictionary.validation.name.minLength })
      .max(50, { message: dictionary.validation.name.maxLength }),
    email: z.string()
      .min(1, { message: dictionary.validation.email.required })
      .email({ message: dictionary.validation.email.invalid }),
    bio: z.string()
      .max(200, { message: dictionary.validation.bio.maxLength })
      .optional(),
  });
  
  return {
    userProfileSchema,
    userProfileFormSchema,
    clientValidationSchema,
  };
}

// Default schemas with English locale (for type inference)
export const { 
  userProfileSchema,
  userProfileFormSchema,
  clientValidationSchema,
} = createSchemas('en');

export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>;
export type ClientFormValues = z.infer<typeof clientValidationSchema>;