# SwiftStay Frontend

Frontend application for SwiftStay, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- React Hook Form
- React Toastify

## Features

- Authentication flow (login, signup, session check via token)
- Rooms listing with pagination
- Room details view (`/rooms/[id]`)
- Booking dashboard with filters, search, pagination, and cancellation
- Central API URL resolver for local vs production backend

## Project Structure

```text
app/                  # Routes and page entry points
components/           # UI + feature components (rooms, bookings, auth, shared)
hooks/                # Custom hooks (e.g., auth/session checks)
lib/                  # Shared utilities (API URL builder)
public/               # Static assets
```

## Prerequisites

- Node.js 20+
- npm 10+
- SwiftStay backend running locally (default: `http://localhost:4000`)

## Environment Variables

Create `Client/swiftstay_frontend/.env` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:4000
NEXT_PUBLIC_API_URL_PRODUCTION=https://swiftstay-backend-henna.vercel.app/
```

How API base URL is selected:

- On localhost in browser: `NEXT_PUBLIC_API_URL_LOCAL` (or `NEXT_PUBLIC_API_URL`)
- On non-localhost in browser: `NEXT_PUBLIC_API_URL_PRODUCTION`
- On server/runtime: local in non-production, production in production mode

## Getting Started

```bash
cd Client/swiftstay_frontend
npm install
npm run dev
```

The app runs on `http://localhost:4001`.

## Available Scripts

- `npm run dev` - Start dev server on port 4001
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Route Map

- `/` -> redirects to `/login`
- `/login` -> login page
- `/signup` -> signup page
- `/rooms` -> rooms listing
- `/rooms/[id]` -> room details page
- `/bookings` -> user booking dashboard

## Backend Endpoints Used

- `POST /login`
- `POST /signup`
- `GET /auth/me`
- `GET /room/getRooms`
- `GET /room/:id`
- `GET /booking/getBooking`
- `POST /booking/deleteBooking`
