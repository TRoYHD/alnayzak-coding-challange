// src/app/lib/mock-data.ts
import { UserProfile } from "../types";
import { Locale } from "../i18n/config";

// Localized bio content
const localizedBio = {
  en: "Frontend developer passionate about creating seamless user experiences. I enjoy working with React and TypeScript to build modern web applications.",
  ar: "مطور واجهة أمامية متحمس لإنشاء تجارب مستخدم سلسة. أستمتع بالعمل مع React و TypeScript لبناء تطبيقات ويب حديثة."
};

// Keep the original mockUser for backward compatibility
export const mockUser: UserProfile = {
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  bio: localizedBio.en,
  avatar: "/images/placeholder.jpg",
};

// Function to get localized bio
export function getLocalizedBio(locale: Locale = 'en'): string {
  return localizedBio[locale] || localizedBio.en;
}

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));