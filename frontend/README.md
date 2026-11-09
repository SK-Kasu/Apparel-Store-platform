# Radiant Regalia Collection - All under one roof

Storefront and administrative workspace for **Radiant Regalia Collection**.

## Stack

- Next.js 15 App Router with React 19
- Tailwind CSS v4 with the Radiant Regalia Collection dark theme tokens
- Prisma-backed administrative authentication
- AES-256-GCM encrypted stateless session cookies
- Native View Transitions for category and cart interactions

## Getting Started

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000).

## Routes

- `/` - Radiant Regalia Collection storefront and hero workspace
- `/admin/login` - administrator credentials portal
- `/admin` - protected administrative workspace
- `/api/auth` - stateless login and logout endpoint

## Branding

- Official brand name: `Radiant Regalia Collection`
- Official motto: `All under one roof`
- SEO title: `Radiant Regalia Collection - All under one roof`

Root metadata, navigation headers, hero typography, footer copy, and administrative surfaces all use the official brand assets.

## Scripts

```bash
npm run dev      # start the Next.js development server
npm run build    # create an optimized production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

## Environment

The administrative portal expects:

- `DATABASE_URL` for Prisma
- `AUTH_SECRET` with at least 32 characters
- `ADMIN_PASSWORD` for the seeded administrator account

See the repository-level `.env.example` for the complete configuration surface.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```
