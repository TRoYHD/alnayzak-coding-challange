# User Profile Editor

A modern, internationalized user profile form built with Next.js, featuring real-time validation, server actions, and progressive enhancement.

![Diagram]([https://github.com/TRoYHD/SyncMe-Coding-Challenge-ServerlessAPIforWooCommerce/blob/main/public/A%20high%20Level%20Architecture%20Diagram.png](https://github.com/TRoYHD/alnayzak-coding-challange/blob/main/user-profile-editor/public/images/photo1.png))

## Features

- Server-side rendered form with Next.js App Router
- Real-time form validation with Zod
- Internationalization (i18n) with English and Arabic support
- RTL layout support for Arabic language
- Profile picture upload with preview
- Toast notifications for form actions
- Responsive design with Tailwind CSS
- Type-safe implementation with TypeScript

## Live Demo

[View Demo]([https://user-profile-editor.vercel.app](https://alnayzak-coding-challange.vercel.app/en))

## Architecture Overview

The application is built using a modern React architecture with Next.js App Router:

The User Profile Editor is built using a modern architecture with:

- Server Components: Initial rendering and data fetching
- Server Actions: Form submissions and API interactions
- Client Components: Interactive UI elements and real-time validation
- Zod Validation: Shared schemas for both client and server-side validation
- Context Providers: Toast notifications and RTL support

## Getting Started

##Core Technologies


Next.js 14: App Router with Server Components
TypeScript: For type safety across the codebase
Zod: Schema validation for forms
Tailwind CSS: Utility-first CSS framework
React Server Actions: For form handling

###Project Structure
Copysrc/app/
├── [locale]/                 # Language-specific routes
├── api/                      # Mock API endpoints
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components
│   └── ...                   # Form components
├── context/                  # React context providers
├── i18n/                     # Internationalization
│   ├── dictionaries/         # Translation files
│   └── ...                   # i18n config
├── lib/                      # Core logic
│   ├── actions.ts            # Server actions
│   ├── schemas.ts            # Zod validation schemas
│   └── ...                   # Utility functions
└── ...                       # App config files

Running Tests
bashCopynpm test
# or
yarn test
Building for Production
bashCopynpm run build
npm start
# or
yarn build
yarn start
Future Enhancements

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/user-profile-editor.git
cd user-profile-editor

Install dependencies

npm install

Start the development server

npm run dev

Open http://localhost:3000 in your browser


License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

