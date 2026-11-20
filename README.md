# khata-core

[![CI](https://github.com/hamid26126/khata-core/actions/workflows/ci.yml/badge.svg)](https://github.com/hamid26126/khata-core/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An offline-first digital ledger (khata) for small shopkeepers.

## Why

Small shops in Pakistan run on credit. A shopkeeper gives udhaar to customers, takes payments later, buys stock from suppliers and pays expenses, and today most of that lives in a paper notebook. Paper is fragile, hard to total up and impossible to share. Mobile apps help, but shop connectivity is unreliable, so a ledger that only works online fails exactly when it is needed.

khata-core aims to be a ledger that stays correct and keeps working with no internet:

- **Correct**: double-entry accounting. Every transaction balances to exactly zero, enforced in the domain code and in the database.
- **Immutable**: posted entries are never edited or deleted. Mistakes are fixed with reversal entries, so the audit trail is complete.
- **Exact money**: integer paisa, never floating point.
- **Multi-tenant**: every shop's data is isolated with PostgreSQL Row-Level Security.
- **Offline-first**: devices record entries locally and sync safely when a connection is available.

## Status

Early development. So far there is the repository scaffold (workspaces, strict TypeScript, linting, formatting, tests), CI on GitHub Actions and a local Postgres 16 via Docker Compose. See [ROADMAP.md](ROADMAP.md) for the plan and [PROGRESS.md](PROGRESS.md) for what has been done.

## Stack

TypeScript (strict) on Node 22, PostgreSQL 16, Fastify, Kysely, React with IndexedDB for the web client, Vitest and fast-check for tests. The full list is in [CONVENTIONS.md](CONVENTIONS.md).

## Quick start

Requires Node 22 or newer. Docker is only needed for the local database.

```bash
npm install
npm run check   # lint, format check, typecheck, tests
cp .env.example .env
npm run dev:db  # Postgres on localhost:5432 (user, password and database: khata)
```

Useful scripts:

| Command              | What it does                     |
| -------------------- | -------------------------------- |
| `npm run lint`       | ESLint with type-aware rules     |
| `npm run format`     | Format everything with Prettier  |
| `npm run typecheck`  | TypeScript across all workspaces |
| `npm test`           | Run all tests once with Vitest   |
| `npm run test:watch` | Run tests in watch mode          |

## Repository layout

```
apps/        Applications (API and web client, added in later sessions)
packages/
  ledger/    Pure domain logic, no I/O
```

More packages and the database migrations appear as the roadmap progresses.

## License

[MIT](LICENSE)
