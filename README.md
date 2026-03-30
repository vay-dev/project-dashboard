# VAY Admin Dashboard

Admin dashboard for managing portfolio projects, media uploads, visibility state, and AI-assisted project descriptions.

## Overview

This app is a Vite + React + TypeScript admin panel for the portfolio backend. It provides:

- admin login with JWT-based access
- protected dashboard routes
- project listing for admin-only management
- create and edit flows for portfolio entries
- screenshot upload and auto-screenshot generation
- AI-assisted project description generation

## Routes

The main routes in the dashboard are:

- `/login` for admin authentication
- `/` for the dashboard home
- `/projects` for the project list
- `/projects/new` for creating a project
- `/projects/:id/edit` for editing an existing project

Because the app uses `BrowserRouter`, a [`vercel.json`](c:\projects\vay-admin-dashboard\vercel.json) rewrite is included so direct refreshes on nested routes work correctly on Vercel.

## Environment

This frontend reads its backend URL from `VITE_API_URL`.

Create a local `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

A starter version is included in [`.env.example`](c:\projects\vay-admin-dashboard\.env.example).

The app uses a shared API helper in [`src/lib/api.ts`](c:\projects\vay-admin-dashboard\src\lib\api.ts), so all frontend API requests resolve through the same env-based base URL.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Set `VITE_API_URL` in `.env`.

3. Start the dev server:

```bash
npm run dev
```

4. Make sure the backend is running and reachable at the URL in `VITE_API_URL`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Vercel Deployment

For Vercel, add this environment variable in the project settings:

```env
VITE_API_URL=https://your-backend-domain.com
```

Notes:

- `VITE_API_URL` must point to your deployed backend, not the frontend domain.
- the SPA rewrite in [`vercel.json`](c:\projects\vay-admin-dashboard\vercel.json) prevents refresh-related 404s on routes like `/projects`
- after changing env vars in Vercel, redeploy the project

## Build

To verify the production build locally:

```bash
npm run build
```

The current build is passing.
