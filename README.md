# Primed App

An interview preparation tool with AI-powered voice interviews and detailed feedback.

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS with mobile-first approach
- **Lucide React** - Beautiful, consistent icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navigation, Footer)
│   └── ui/              # UI components (sections, features)
├── pages/               # Page components
├── lib/                 # Utilities and configurations
├── styles/              # Global styles
└── main.tsx            # App entry point
```

## Mobile-First Design

This project follows a mobile-first approach. All components are designed for mobile screens first, then enhanced for larger displays using Tailwind's responsive breakpoints.

## Code Standards

- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Functions/Hooks**: camelCase (e.g., `useAuth`, `formatDate`)
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with semicolons and single quotes
- **Linting**: ESLint with React and TypeScript rules

