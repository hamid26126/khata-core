# khata-core: Conventions

## What we are building

An offline-first digital ledger (khata) for small shopkeepers. A shop records credit given (udhaar), payments received, purchases and expenses against customers and suppliers. The data must stay correct (double-entry accounting), work with no internet, and sync safely across devices.

## Stack

| Area | Choice |
|---|---|
| Language | TypeScript (strict), Node 22 LTS |
| Package layout | npm workspaces monorepo |
| API framework | Fastify + Zod (via fastify-type-provider-zod) |
| Database | PostgreSQL 16 |
| DB access | Kysely + plain SQL migrations (node-pg-migrate) |
| Auth | Email + password (argon2), short-lived JWT access tokens, rotating refresh tokens |
| Tests | Vitest, fast-check (property tests), Testcontainers for Postgres integration tests |
| Lint/format | ESLint + Prettier |
| Logging | pino |
| Web client | React + Vite, IndexedDB (via Dexie) for offline storage |
| CI | GitHub Actions (lint, typecheck, unit, integration) |
| Packaging | Docker, docker-compose for local dev |
| Load testing | k6 |

## Repository layout

```
khata-core/
  apps/
    api/            Fastify HTTP API
    web/            React offline-first client
  packages/
    ledger/         Pure domain logic: Money, postings, validation (no I/O)
    sync-protocol/  Shared types and logic: operations, clocks, merge rules
    sync-client/    Client-side sync engine (storage-agnostic)
  db/
    migrations/     SQL migrations
  docs/
    adr/            Architecture Decision Records
    architecture.md
  ROADMAP.md
  PROGRESS.md
  CONVENTIONS.md
  README.md
```

## Domain rules (non-negotiable)

- **Money** is an integer number of minor units (paisa) with a currency code (default PKR). No floats anywhere.
- **Double-entry**: every transaction has two or more postings; the sum of signed postings per transaction is exactly zero. Enforced in the domain layer AND in the database (deferred constraint trigger).
- **Immutability**: posted transactions are never updated or deleted. Corrections are reversal transactions that reference the original.
- **Tenancy**: every row belongs to a shop (`shop_id`). Postgres Row-Level Security enforces isolation; the app sets the tenant per request.
- **Idempotency**: every write endpoint accepts an `Idempotency-Key`; replays return the original result.
- **IDs**: UUIDv7 generated client-side where offline creation is needed.

## Git and commits

- Branch: `main` is always green and deployable.
- Commit messages follow Conventional Commits: `type(scope): imperative summary`, then a body explaining the why when it is not obvious.
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`.
  - Scopes: `ledger`, `api`, `db`, `sync`, `web`, `auth`, `ci`, `docs`.
  - Good: `feat(ledger): reject postings that do not sum to zero`
  - Bad: `update code`, `fix stuff`
- 1 to 3 commits per working session. Each commit builds and passes tests.
- No `Co-Authored-By` trailers or other attribution lines in commit messages or PR descriptions. The message describes the work only.
- Never commit secrets. `.env.example` documents configuration; real `.env` is git-ignored.

## Code quality bar

- TypeScript `strict` on, no `any` without a comment explaining why.
- Every new module ships with tests in the same commit. Domain logic gets unit and property tests; SQL and API behaviour gets integration tests.
- Public functions have short doc comments stating invariants, not restating the name.
- Errors are typed and mapped to consistent API error responses (`{ error: { code, message, details? } }`).
- No dead code, no commented-out code, no TODOs without a roadmap entry.

## Documentation bar

- `README.md`: what it is, why it exists, quick start, architecture overview, current status. Always accurate to the present state.
- `docs/architecture.md`: components, data flow, sync design, tenancy model.
- `docs/adr/NNNN-title.md`: one decision per file (context, decision, consequences). Short.
