<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project
Festeja: Next.js 16 App Router marketplace connecting event clients to service providers in Manaus. Node 24+, npm. Path alias `@/*` -> `src/*`.

## Commands
- Setup: `npm install`, then `Copy-Item .env.example .env.local`
- Dev: `npm run dev` (http://localhost:3000)
- Prod build/start: `npm run build`; `npm run start` (runs `scripts/server.ps1 start`, port 3000, auto-builds if `.next/BUILD_ID` missing)
- Verify: `npm run typecheck`, `npm run lint`, `npm run check` (typecheck then lint)
- Tests: `npm test` (all verify scripts in a temp DB/uploads dir); single suite via `npm run test:db|test:search|test:profile|test:auth|test:security` or `npx tsx scripts/run-tests.ts scripts/verify-<name>.ts`
- Data migration: `npm run migrate:sqlite`, `npm run migrate:uploads`

## Architecture
- Routes/layouts in `src/app`; server actions in `src/actions/*`; all data access through `src/lib/db.ts` (do not write raw SQL in components/actions beyond it). DB driver abstraction: `src/lib/db/driver.ts`.
- Database: PGlite locally (`data/pglite`, or `FESTEJA_DB_PATH` + `.pglite`); PostgreSQL when `DATABASE_URL`/`POSTGRES_URL` is set. Schema + migrations apply automatically on first use; seed runs only outside production, gated by `FESTEJA_SEED`.
- On Vercel, `DATABASE_URL` is required; PGlite is blocked unless `FESTEJA_ALLOW_PGLITE` is set.
- Uploads: local filesystem under `FESTEJA_UPLOADS_DIR` unless Vercel/Blob env is present; validated by magic bytes. Code limit is 5MB (`MAX_UPLOAD_SIZE`); README's "4MB" is stale.

## Testing gotchas
- `scripts/verify-*.ts` throw when `FESTEJA_DB_PATH` is unset. Use `run-tests.ts` (sets temp paths + `FESTEJA_SEED=1`) or set the env vars manually.
- The harness deletes its temp directory after the run; do not point tests at the local `data/` DB.
- Migrations are tracked in `schema_migrations`; seed is version-gated via `app_meta.seed_version`.

## Conventions
- TypeScript strict; ESLint uses `eslint-config-next` (core-web-vitals + typescript).
- shadcn/ui (new-york) in `src/components/ui`; Tailwind v4 via the Turbopack CSS loader rule in `next.config.ts`.
- Next 16 has `cacheComponents` and `partialPrefetching` enabled; check `node_modules/next/dist/docs/` before framework-level changes.
- Images remote pattern is only `*.public.blob.vercel-storage.com/uploads/**`.  

## Ops
- Production server managed by `scripts/server.ps1` (port 3000); logs in `logs/`. Helpers: `npm run server:status|server:stop|server:restart|server:restart:build`.
- No CI workflow exists in the repo.