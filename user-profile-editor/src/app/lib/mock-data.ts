// app/lib/mock-data.ts
import { UserProfile } from "../types";

export const mockUser: UserProfile = {
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  bio: "Frontend developer passionate about creating seamless user experiences. I enjoy working with React and TypeScript to build modern web applications.",
  avatar: "/placeholder.jpg",
};

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));