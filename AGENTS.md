# AGENTS.md

Seamwork: fullstack apparel storefront/ops platform. npm workspaces monorepo with `server` (Express + Mongoose) and `client` (React/Vite intended).

## Current state (verify before assuming)

- Only `server/src` has code. `client/` contains empty directories and no `package.json`.
- `server/src/index.ts`, `server/src/seed.ts`, `server/src/routes/`, and `server/src/controllers/` do not exist yet. No API entrypoint or endpoints are wired.
- Root `dev`, `build`, and `typecheck` invoke the empty client workspace and fail. Use `-w server` variants for now.
- `npm test` lists `src/utils/order.test.ts`, which does not exist. The existing `pricing.test.ts` also covers order helpers.

## Setup

```bash
npm install                              # from repo root
cp server/.env.example server/.env
docker compose up -d mongo               # Mongo 7 on 127.0.0.1:27017
```

- Node >= 20. No lint or formatter config exists; do not invent a lint command.
- Stripe is optional: blank `STRIPE_SECRET_KEY` means mock checkout. Production requires a >=32-char `JWT_SECRET`.
- API defaults to port 4000; client origin defaults to `http://localhost:5173` via `CLIENT_URL` (comma-separated allowed).

## Commands

```bash
npm run dev -w server                    # tsx watch src/index.ts (entrypoint missing today)
npm run build -w server                  # tsc to server/dist
npm run start -w server                  # node dist/index.js
npm run typecheck -w server
npm run seed -w server                   # src/seed.ts (missing today)
npm test -w server                       # currently fails on missing order.test.ts
```

Run a single suite from `server/`: `npx tsx --test src/utils/pricing.test.ts`. Tests use `node:test` + `tsx`, not Jest/Vitest.

## Conventions

- Read config only through `server/src/config/env.ts` (Zod-validated, exits on invalid). `dotenv/config` loads `server/.env` relative to the process cwd, so run server scripts from `server/` or use the workspace scripts.
- Money is always integer minor units (cents). Use `calculateTotals`/`formatMoney` in `utils/pricing.ts`; keep model integer validators. `formatMoney` divides by 100.
- API errors: throw `ApiError`, wrap async routes with `asyncHandler` (`utils/http.ts`). The central handler also maps Zod, Mongoose, duplicate-key, and Stripe errors.
- Request validation: `validate({ body, query, params })` stores parsed values in `req.validated`, not `req.body`.
- Auth accepts the `sw_token` cookie or `Authorization: Bearer`; use `requireAuth`/`requireAdmin`. `req.user` and `req.validated` are typed in `types/express.d.ts`.
- Responses go through `serializeUser`/`serializeProduct`/`serializeOrder` in `utils/serialize.ts`; pass `{ admin: true }` to include Stripe IDs.
- Order status transitions are defined in `utils/order.ts` (`canTransition`); do not bypass them.
- TypeScript is strict CommonJS (`server/tsconfig.json`); the build excludes `*.test.ts`.

## Client

When adding the client, make it a workspace with `dev`/`build`/`typecheck` scripts matching the root script names. API CORS/cookies expect Vite on port 5173 and credentials (httpOnly cookie), with `CLIENT_URL` configurable.
