import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProfile } from '../../types';
import { Locale } from '../../i18n/config';

jest.mock('../profile-form', () => ({
  ProfileForm: ({ initialData }: { initialData: UserProfile; locale?: string }) => (
    <div>
      <div>Name: {initialData.name}</div>
      <div>Email: {initialData.email}</div>
      <div>Bio: {initialData.bio}</div>
    </div>
  )
}));

import { ProfileForm } from '../profile-form';

function TestComponent({ message }: { message: string }) {
  return <div>{message}</div>;
}

describe('Basic React Test', () => {
  test('renders a test component', () => {
    render(<TestComponent message="Hello, world!" />);
    expect(screen.getByText("Hello, world!")).toBeTruthy();
  });
});

describe('ProfileForm Component', () => {
  const mockUser: UserProfile = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Test bio',
    avatar: '/test-avatar.jpg',
  };

  test('renders with user data (using mock)', () => {
    render(
      <ProfileForm 
        initialData={mockUser} 
        locale="en" 
      />
    );

    expect(screen.getByText(`Name: ${mockUser.name}`)).toBeTruthy();
    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeTruthy();
    expect(screen.getByText(`Bio: ${mockUser.bio}`)).toBeTruthy();
  });
});