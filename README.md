# Primed — Frontend

React frontend for the Primed PM interview coach. Pairs with [primed-api](https://github.com/Dhairya10/primed-api).

---

## What It Does

- **Onboarding** — name + domain selection (minimal friction)
- **Home** — personalised drill recommendation with reasoning
- **Drill library** — browse and filter 20–30 curated PM drills
- **Voice session** — real-time voice interview via LiveKit + Gemini Live API
- **Feedback screen** — causal breakdown by PM skill
- **Skill map** — visual Red/Yellow/Green zones across 11 PM skills
- **Dashboard** — session history and progress tracking

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Voice | LiveKit client |
| Hosting | Firebase |

## Quick Start

### Prerequisites

- Node.js 18+

### Setup

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_LIVEKIT_URL=your_livekit_url
```

### Run

```bash
npm run dev      # development server → http://localhost:3000
npm run build    # production build
npm run preview  # preview production build
```

## Scripts

```bash
npm run lint        # ESLint
npm run format      # Prettier
npm run type-check  # TypeScript check
```
