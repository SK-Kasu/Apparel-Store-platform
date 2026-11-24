# AGENTS.md

Repo package is `seamwork`, but the working storefront is branded **Radiant Regalia Collection — All under one roof**. The Next.js/Prisma stack works; the Express/Mongoose `server/` workspace is an unfinished scaffold. Root npm scripts are stale — use package-local commands.

## Boundaries
- `frontend/` — Next.js 15 App Router, React 19, Tailwind 4, own `package.json`/lockfile, port 3000. Not an npm workspace.
- `database/` — Prisma 6 + PostgreSQL schema, seed, scrypt password helpers; own `package.json`/lockfile, not a workspace. `schema.prisma` generates two clients: default for `database/`, plus `frontendClient` into `frontend/node_modules/.prisma/client`. Regenerate after schema changes or frontend auth uses a stale client.
- `frontend/src/app/api/auth/route.ts` imports `database/password` across the package boundary; `frontend/next.config.ts` sets the Turbopack root to the repo root for that. Preserve both when moving files/config.
- `server/` has Mongoose models, middleware, utils and tests, but no `src/index.ts`, seed, routes, controllers, or services; no API is wired. `client/` is listed as a workspace but has no `package.json`, so root `dev`/`build`/`typecheck` fail. `backend/`, `components/`, `config/`, `infrastructure/` are empty.
- `ARCHITECTURE.md` describes an intended `backend/` + tenant-isolation design, not current code. Trust scripts/code over prose.

## Setup / env
- Install separately in `frontend/` and `database/` (independent lockfiles; no root lockfile). Install at root only for `server/` deps. Node >=20.
- Root `.env.example` is the Postgres surface (`DATABASE_URL`, `AUTH_SECRET` >=32 chars, `ADMIN_PASSWORD` >=12 chars). Seed reads `database/.env` then root `.env`; Next reads `frontend/.env`, not root `.env`. `SUPABASE_*` are unused in tracked code.
- `docker compose up -d mongo` provides MongoDB 7 only; there is no Postgres service — supply `DATABASE_URL` externally.
- `server/.env.example` is a separate Mongo/JWT/Stripe surface (port 4000, `sw_token`, Vite `CLIENT_URL`). Server config is Zod-validated in `server/src/config/env.ts` and exits on invalid values; dotenv loads relative to cwd, so run server scripts from `server/`.
- Admin auth: `POST`/`DELETE` `/api/auth`, httpOnly cookie `radiant_admin_session` (8h, AES-256-GCM from `AUTH_SECRET`); seeded admin is `admin@radiantregalia.co.ke`. Seed upserts catalog data and prints a generated password if `ADMIN_PASSWORD` is unset.

## Working commands
From `database/`:
```
npm run db:generate
npm run db:push
npm run db:seed
npm run typecheck
```
`npm run db:seed` also works from the repo root.

From `frontend/`:
```
npm run dev          # Next dev on http://localhost:3000
npx tsc --noEmit     # no typecheck script
npm run lint
npm run build
```
Frontend catalog/recommendations and admin overview are static data (`lib/store-data.ts`, `app/admin/page.tsx`); only admin login is Prisma-backed. Root `npm test` targets a missing `src/utils/order.test.ts` and lacks server deps here.

## Server conventions (when extending the scaffold)
- Money is integer minor units: use `calculateTotals`/`formatMoney` (`utils/pricing.ts`); `formatMoney` divides by 100.
- Errors: throw `ApiError`, wrap async routes with `asyncHandler`; `validate({ body, query, params })` writes parsed values to `req.validated`, not `req.body`.
- Auth: `sw_token` cookie or `Authorization: Bearer`; use `requireAuth`/`requireAdmin`. Responses go through `serializeUser`/`serializeProduct`/`serializeOrder` (`{ admin: true }` reveals Stripe IDs). Order transitions use `canTransition` in `utils/order.ts`.
- Tests are `node:test` + `tsx`; single suite from `server/`: `npx tsx --test src/utils/pricing.test.ts`. Build excludes `*.test.ts`.
