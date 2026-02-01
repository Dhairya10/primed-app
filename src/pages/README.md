# Home Screen Implementation

## Overview

The Home screen is the main entry point for authenticated users, providing two distinct modes:
- **Preparation Mode**: Browse and filter practice problems
- **Interview Mode**: Simulate real interview with random problems

## Components Architecture

### Pages
- `Home.tsx` - Main container with mode toggle and session management

### Home Components
- `ModeToggle.tsx` - Toggle between Preparation and Interview modes
- `PreparationMode.tsx` - Problem grid with search/filter and infinite scroll
- `InterviewMode.tsx` - Hero section for random interview start
- `SearchAndFilter.tsx` - Search bar and filter dropdowns
- `ProblemCard.tsx` - Individual problem display card
- `ProblemCardSkeleton.tsx` - Loading skeleton for problem cards

### UI Components (Reusable)
- `Button.tsx` - Primary, secondary, and ghost button variants
- `Card.tsx` - Container with optional hover effects
- `Input.tsx` - Text input with label, icon, and error support
- `Select.tsx` - Dropdown select with custom styling
- `Badge.tsx` - Tags for domain and problem type
- `Skeleton.tsx` - Loading skeleton with shimmer effect

## State Management

### Server State (TanStack Query)
- `useProblems` - Infinite query for paginated problems with filters
- `useProblemsMetadata` - Cached metadata for filter options

### Client State (Zustand)
- `mode` - Current mode (preparation/interview)
- `searchQuery` - Search input value
- `selectedDomain` - Active domain filter
- `selectedProblemType` - Active problem type filter

## Features Implemented

✅ Mode toggle (Preparation ↔ Interview)
✅ Search problems by title (debounced 300ms)
✅ Filter by domain and problem type
✅ Infinite scroll pagination
✅ Problem cards with domain/type badges
✅ Skeleton loading states
✅ Mobile-first responsive design
✅ Touch-friendly interactions (44px min targets)
✅ Error handling with retry
✅ Monochromatic design system

## Current Implementation Status

✅ **Dummy Data Mode**: Using local mock data (API disabled by default)
✅ **API Toggle**: `IS_API_ENABLED` flag in `lib/constants.ts`
✅ **12 Mock Problems**: Covering all domains and problem types
✅ **Filter Alignment**: Fixed search bar and filter dropdowns alignment

## TODO / Not Implemented

⚠️ Authentication integration (currently using mock user ID)
⚠️ Navigation to interview screen (session creation works)
⚠️ URL-based routing (using simple state toggle for now)
⚠️ PostHog analytics tracking
⚠️ Toast notifications (using alerts for now)

## API Endpoints Used

- `GET /api/v1/problems` - Fetch filtered/searched problems
- `GET /api/v1/problems/metadata` - Get available domains and problem types
- `POST /api/v1/interview-sessions` - Create interview session
- `GET /api/v1/interview-mode/next` - Get random problem (TODO)

## Environment Variables

```env
VITE_API_URL=http://localhost:8000  # Backend API base URL (only used when IS_API_ENABLED=true)
```

## Switching Between Dummy Data and Real API

The app uses dummy data by default. To enable real API calls:

1. **Open** `src/lib/constants.ts`
2. **Change** `IS_API_ENABLED` from `false` to `true`
3. **Ensure** your backend is running at `VITE_API_URL`

```typescript
// src/lib/constants.ts
export const IS_API_ENABLED = true; // Set to true when backend is ready
```

## Dummy Data

Located in `src/lib/dummy-data.ts`:
- **12 mock problems** covering all domains and problem types
- **Realistic data** matching API schema
- **Simulated delays** (200-500ms) for realistic feel
- **Filter support** (search, domain, problem_type)
- **Pagination support** (limit, offset)

## Usage

Navigate to the Home page to see:
1. Mode toggle at the top
2. Preparation Mode: Search bar, filters, and problem grid
3. Interview Mode: Hero section with "Start Interview" button
4. Click "Start Interview" on any problem card to create a session

## Design Decisions

1. **Monochromatic Design**: Black background, white text, gray accents
2. **Mobile-First**: All components responsive from 320px+
3. **Touch-Friendly**: Minimum 44x44px tap targets
4. **Debounced Search**: 300ms delay to reduce API calls
5. **Infinite Scroll**: Loads next page at 80% scroll
6. **Skeleton Loading**: Immediate visual feedback
7. **Filter Persistence**: Filters preserved within Preparation Mode session
