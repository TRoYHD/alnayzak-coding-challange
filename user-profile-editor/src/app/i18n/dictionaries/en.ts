import { Dictionary } from '../config';

const dictionary: Dictionary = {
  page: {
    title: 'User Profile',
    subtitle: 'Update your personal information',
  },
  form: {
    name: {
      label: 'Name',
      placeholder: 'Your name',
    },
    email: {
      label: 'Email',
      placeholder: 'your.email@example.com',
    },
    bio: {
      label: 'Bio',
      placeholder: 'Tell us about yourself...',
      description: 'Max 200 characters',
    },
    profilePicture: {
      label: 'Profile Picture',
      description: 'Upload a profile picture',
    },
    submit: 'Save Profile',
    submitting: 'Saving...',
  },
  validation: {
    name: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters long',
      maxLength: 'Name cannot exceed 50 characters',
    },
    email: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address',
    },
    bio: {
      maxLength: 'Bio cannot exceed 200 characters',
    },
    server: {
      error: 'Error submitting form',
    },
  },
  notifications: {
    success: 'Profile updated successfully!',
    error: 'Failed to update profile',
  },
};

export default dictionary;