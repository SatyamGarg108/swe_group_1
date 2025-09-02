# LibraryCatalog

A full‑stack library catalog and borrowing system built with Next.js, tRPC, Drizzle ORM (MySQL), Clerk authentication, and Tailwind CSS. Users can browse a catalog, search with filters, view book details, add to cart, borrow, renew, return, and see notifications. A simple UI chatbot is included.

## Tech Stack

- Next.js 15 (pages router), React 18, TypeScript
- tRPC v11 (React Query, SuperJSON)
- Drizzle ORM + MySQL (`mysql2` driver)
- Clerk for authentication (middleware enabled)
- Tailwind CSS, Geist font, Font Awesome

## Features

- Browse the catalog with covers and quick details
- Book details: series, ISBN, year, description, authors, categories, availability, reviews, suggestions
- Search with filters: available only, new arrivals, fiction, non‑fiction (passed to server, see TODOs)
- Cart: add/remove books, one‑click borrow
- Borrowing: reserves an available copy, sets due date (14 days)
- My Books: view current checkouts, renew (up to a limit), return
- Notifications: highlights due/overdue items (client‑side computed)
- Chatbot: lightweight bot with conditional replies using database

## Project Structure

- `src/pages` — pages router (home, search, cart, my‑books, notifications, book/[id])
- `src/server` — tRPC routers and Drizzle schema/DB
- `drizzle/` — generated metadata and relational helpers
- `public/` — static assets; book covers `/<id>.jpg`, sample PDFs in `public/Book_Files/<id>.pdf`

Key server routers:

- `book` — `getAll`, `getById`, `search`
- `cart` — `getAll`, `add`, `remove`
- `borrow` — `getAll`, `borrowBook`, `returnBook`, `renewBook`

## Getting Started (Local Dev)

Prereqs:

- Node.js 18+ and npm 10+
- Docker Desktop (for local MySQL) or any reachable MySQL instance
- On Windows, WSL is recommended if using the provided shell script

1. Install dependencies

```powershell
npm install
```

1. Configure environment

Create a `.env` file in the project root:

```env
# MySQL connection (example for local Docker MySQL)
DATABASE_URL=mysql://root:password@localhost:3306/swe_group_1

# Standard Node env
NODE_ENV=development

# Clerk (required for auth in production; optional for local UI testing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

1. Start a local database

- Option A (WSL/macOS/Linux):

```bash
./start-database.sh
```

- Option B (PowerShell, Docker Desktop):

```powershell
# Use the same password and port as in DATABASE_URL
$DB_PASSWORD = "password"
$DB_PORT = 3306
$CONTAINER = "swe_group_1-mysql"
docker run -d --name $CONTAINER -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD -e MYSQL_DATABASE=swe_group_1 -p $DB_PORT:3306 mysql:latest
```

1. Run migrations with Drizzle

```powershell
# Generate (if you changed schema)
npm run db:generate
# Apply migrations to the DB
npm run db:migrate
# Optional: explore schema
npm run db:studio
```

1. Start the app

```powershell
npm run dev
# visit http://localhost:3000
```

## App Guide

- `/` — Catalog grid (random selection)
- `/search?q=term` — Search results with filter panel
- `/book/{id}` — Details page with availability, reviews, suggestions
- `/cart` — Items added for borrowing; borrow action invokes server mutation
- `/my-books` — Active checkouts with due dates; renew and return buttons
- `/notifications` — Due/overdue reminders based on client time
- Chatbot overlay — appears on all pages from the top bar layout

Images use `public/<id>.jpg`. Sample PDFs are in `public/Book_Files/<id>.pdf` for future reading features.

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run format:check` / `npm run format:write` — Prettier
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — Drizzle

## Configuration Notes

- tRPC endpoint is served from `src/pages/api/trpc/[trpc].ts`
- Drizzle schema lives in `src/server/db/schema.ts`; connection is pooled via `mysql2`
- Auth is handled by Clerk middleware in `src/middleware.ts`; ensure Clerk env vars in production
- i18n packages are present but not yet wired into the app; the site runs in `en`

## Known Issues / TODOs

- Read page missing: `My Books` links to `/read/{id}` but no page exists. Planned to render PDFs from `public/Book_Files/{id}.pdf`.
- Renew limit mismatch: UI shows renewable while backend disallows after 2 renewals. Align `renewable` calculation with server rule.
- Search filters: `ebooks` flag is accepted by the API but not applied in the SQL filter yet.
- Reviews: viewing supported; adding/editing reviews not implemented.
- Notifications table exists in schema but the UI currently computes reminders on the client only.

## Deployment

- Provide a production MySQL instance and set `DATABASE_URL`
- Provide Clerk keys and configure allowed origins in Clerk dashboard
- Deploy to Vercel/Netlify/Node server as a standard Next.js app

No license specified.
