# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router pages and API routes (e.g., `src/app/api/.../route.ts`).
- `src/components/`: Reusable UI components (PascalCase files like `HeroSection.tsx`).
- `src/lib/`: Shared utilities (auth, Prisma helpers, file upload helpers).
- `src/providers/` and `src/types/`: React providers and shared TypeScript types.
- `src/i18n/` and `messages/`: Localization configuration and message content.
- `public/`: Static assets served by Next.js.
- `prisma/`: Database schema (`schema.prisma`) and migrations.
- `scripts/`: Admin/seed utilities (run with Node).
- `test-*.js`: Ad-hoc auth/API checks (not a formal test suite).

## Build, Test, and Development Commands
- `npm run dev`: Start local Next.js dev server.
- `npm run build`: Generate Prisma client and build the app.
- `npm run start`: Run the production server from `.next`.
- `npm run lint`: Lint with ESLint (Next.js + TypeScript rules).
- `npm run db:migrate`: Apply Prisma migrations to the configured database.
- `npm run db:seed`: Seed the database with initial content.
- `npm run db:reset-admin` / `npm run db:ensure-admin`: Reset or ensure admin accounts.
- Ad-hoc checks: `node test-auth.js` (requires the dev server running).

## Coding Style & Naming Conventions
- TypeScript-first with strict mode (`tsconfig.json`).
- Follow Next.js App Router conventions: `page.tsx` for routes, `route.ts` for API.
- Use the `@/*` alias for imports (maps to `src/*`).
- Match existing formatting; verify with `npm run lint` before pushing.

## Testing Guidelines
- No automated test framework is configured in `package.json`.
- Use the root `test-*.js` scripts for manual auth/API validation.
- If you add automated tests, include a clear `npm run test` script.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative sentence-case messages (e.g., “Add …”, “Update …”).
- PRs should include: a concise summary, testing notes, and screenshots for UI changes.
- Call out schema changes (new Prisma migration) and any required env vars.

## Security & Configuration Tips
- Required env vars for production: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
- Optional integrations include Twilio and SMTP (see `DEPLOYMENT.md`).
- File uploads on Vercel are limited; prefer external storage for persistent files.

## Agent Notes
- Review `CLAUDE.md` and design specs (e.g., `CARD_DESIGN_SPEC.md`) before large UI refactors.
