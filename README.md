# Azure Smart Photos (Google Photos-style)

Production-oriented starter for an AI-native media app on Azure.

## Features Implemented
- Natural-language semantic media search using AI tags/captions
- AI metadata pipeline on upload (Computer Vision + Face API)
- Dynamic auto-albums (event/trip heuristics)
- Face-based people grouping and naming endpoint
- Video metadata for adaptive playback support hooks
- Memories endpoint (same day in previous years)
- Next.js frontend with timeline, albums, people, search pages
- Dark-mode responsive masonry layout and lazy-loaded media cards

## Folder Structure

```txt
.
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ types/
│  │  ├─ app.ts
│  │  └─ server.ts
│  └─ .env.example
├─ frontend/
│  ├─ app/
│  │  ├─ albums/
│  │  ├─ people/
│  │  ├─ search/
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  ├─ lib/
│  └─ styles/
├─ docs/
│  ├─ api.md
│  ├─ architecture.md
│  └─ deployment.md
└─ package.json
```

## Local Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Start both services:
   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Azure Setup
Follow:
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/api.md`

## Notes for Production
- Replace `x-user-id` with Azure AD JWT auth middleware.
- Move AI enrichment to async worker pipeline (queue + retries).
- Use HLS/DASH generation job for full adaptive video streaming.
