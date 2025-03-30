User Profile Editor
A modern, internationalized user profile form built with Next.js, featuring real-time validation, server actions, and progressive enhancement.
Features

✅ Server-side rendered form with Next.js App Router
✅ Real-time form validation with Zod
✅ Internationalization (i18n) with English and Arabic support
✅ RTL layout support
✅ Profile picture upload with preview
✅ Toast notifications for form actions
✅ Responsive design with Tailwind CSS
✅ Type-safe with TypeScript

Live Demo
View Demo
Getting Started

Prerequisites

Node.js 18.x or later
npm or yarn package manager

Installation

Clone the repository

bashCopygit clone https://github.com/yourusername/user-profile-editor.git
cd user-profile-editor

Install dependencies

bashCopynpm install
# or
yarn install

Start the development server

bashCopynpm run dev
# or
yarn dev

Open http://localhost:3000 in your browser

Core Technologies

Next.js 14: App Router with Server Components
TypeScript: For type safety across the codebase
Zod: Schema validation for forms
Tailwind CSS: Utility-first CSS framework
React Server Actions: For form handling

Architecture
The application is built using a modern React architecture with Next.js App Router:

Server Components: Used for initial rendering and data fetching
Server Actions: Handle form submissions and API interactions
Client Components: Handle interactive UI elements and real-time validation
Internationalization: Built-in i18n support with dictionary-based translations
Validation: Hybrid approach using Zod schemas on both client and server

Project Structure
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

 User authentication
 Additional profile fields
 More language options
 Dark mode support
 Image cropping for profile pictures

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Next.js team for the excellent documentation
Tailwind CSS for the utility-first approach
Zod for the powerful validation capabilities