# khata-core: Roadmap

44 working sessions, planned as roughly 5 per week over 8 to 9 weeks. A "session" is one run of "continue the project". Sessions are done in order; skipping days only delays the calendar, not the order. Tick each box when the session is finished and pushed.

Legend: each session lists the outcome. Tests are part of every session, not a separate step.

---

## Week 1: Foundations

- [x] **S1. Repo scaffold and tooling.** npm workspaces, strict TypeScript, ESLint, Prettier, Vitest, `.editorconfig`, `.gitignore`, `.env.example`, LICENSE (MIT), minimal README with project vision.
- [x] **S2. CI and local dev environment.** GitHub Actions (lint, typecheck, test), `docker-compose.yml` with Postgres 16, `npm run dev:db`, status badges in README.
- [ ] **S3. Architecture and domain model docs.** `docs/architecture.md` (components, tenancy, double-entry model), ADR 0001 (monorepo and stack), ADR 0002 (money as integer minor units), ER diagram in Mermaid.
- [ ] **S4. Database schema v1.** Migration runner, migrations for `shops`, `users`, `accounts`, `parties`, `transactions`, `postings`, with constraints, indexes and UUIDv7 IDs. Integration test harness with Testcontainers.
- [ ] **S5. Money and core value types.** `packages/ledger`: `Money` (integer minor units, currency-safe add/sub/compare, formatting for PKR), `AccountId`/`TransactionId` types, exhaustive unit tests and property tests.

## Week 2: Ledger core

- [ ] **S6. Transaction and posting domain model.** Build and validate transactions in the pure domain layer: at least two postings, zero-sum, single currency, positive/negative sign convention.
- [ ] **S7. Database-level balance enforcement.** Deferred constraint trigger guaranteeing zero-sum per transaction, plus immutability triggers (no UPDATE/DELETE on posted rows). Tests that try to violate each rule directly in SQL.
- [ ] **S8. Ledger repository.** Kysely-based repository: post a transaction atomically, fetch by id, list by account with cursor pagination. Integration tests.
- [ ] **S9. Reversals and corrections.** Reversal transactions that reference the original, prevent double reversal, preserve audit trail. ADR 0003 on immutability and corrections.
- [ ] **S10. Balances and trial balance.** Account balance queries, running balance per party, trial balance (all accounts sum to zero). Property test: random transaction sequences always keep the trial balance at zero.

## Week 3: API foundation, auth, tenancy

- [ ] **S11. Fastify app skeleton.** App factory, config loading with Zod, pino logging, request IDs, health and readiness endpoints, graceful shutdown.
- [ ] **S12. Error model and validation.** Typed domain errors, central error handler, consistent error envelope, Zod request validation, OpenAPI generation.
- [ ] **S13. Authentication.** Registration (creates a shop and owner), login, argon2 hashing, JWT access tokens, rotating refresh tokens with reuse detection. Tests for the token lifecycle.
- [ ] **S14. Multi-tenancy with Row-Level Security.** RLS policies on every tenant table, per-request tenant context, tests proving one shop can never read or write another shop's data (including via crafted IDs).
- [ ] **S15. Roles and authorization.** Owner and staff roles, permission checks (staff cannot reverse transactions or manage users), user invitation endpoint. ADR 0004 on tenancy and authorization.

## Week 4: Core API features

- [ ] **S16. Parties API.** CRUD for customers and suppliers (name, phone, notes), soft archive, search, cursor pagination.
- [ ] **S17. Transactions API.** `POST /transactions` for credit given, payment received, purchase and expense using typed templates that expand into balanced postings. Integration tests through HTTP.
- [ ] **S18. Idempotency.** `Idempotency-Key` handling with stored request fingerprints and responses, correct behaviour under concurrent duplicate requests, expiry job. ADR 0005.
- [ ] **S19. Balance and history endpoints.** Party ledger with running balance, shop-level summary (total receivable, payable, cash), date range filters.
- [ ] **S20. Audit log and API polish.** Append-only audit log of security-relevant actions, request metadata, published OpenAPI spec, Postman or `.http` examples in `docs/`.

## Week 5: Offline sync design and server

- [ ] **S21. Sync design doc.** `docs/sync.md` and ADR 0006: operation log model, device IDs, hybrid logical clocks, per-entity merge rules, why ledger entries are append-only and conflict-free while party edits use field-level last-writer-wins.
- [ ] **S22. Hybrid logical clock and operation types.** `packages/sync-protocol`: HLC implementation, operation envelope types, serialization, validation. Heavy unit and property tests (clock drift, ordering, tie-breaks).
- [ ] **S23. Server operation log and push endpoint.** Migration for the operation log with server-assigned sequence numbers, `POST /sync/push` that validates, applies and records a batch atomically and idempotently.
- [ ] **S24. Pull endpoint and cursors.** `GET /sync/pull?since=` with cursor semantics, pagination, per-shop filtering, tombstones for archived parties.
- [ ] **S25. Conflict resolution on the server.** Field-level merge for party edits, rejection and surfacing of invalid ledger operations, deterministic outcomes regardless of arrival order. Tests with shuffled operation arrival.

## Week 6: Sync client and offline-first behaviour

- [ ] **S26. Sync client core.** `packages/sync-client`: local operation queue, push and pull loop, retry with backoff, storage-agnostic interface, in-memory adapter.
- [ ] **S27. Convergence simulation tests.** Deterministic simulator with several virtual devices, random offline periods and reorderings; assert all devices converge to the same state and the trial balance stays zero. This is a showcase test.
- [ ] **S28. Web client scaffold.** `apps/web` with React and Vite, routing, login screen, API client with token refresh, basic layout and design tokens.
- [ ] **S29. Offline storage in the browser.** IndexedDB adapter (Dexie) for the sync client, local-first reads and writes, optimistic UI updates, sync status indicator.
- [ ] **S30. Offline UX flows.** Add customer and record udhaar or payment with no connection, queue visibly, sync on reconnect, handle rejected operations with a clear fix-it screen.

## Week 7: Reports and product features

- [ ] **S31. Customer statements.** Statement generation (opening balance, entries, closing balance) for a date range, server-side, with tests on edge cases (zero activity, reversals).
- [ ] **S32. PDF statements.** Printable PDF generation for statements, with a clean layout and Urdu-friendly font support where practical.
- [ ] **S33. Reminders and sharing.** Overdue (aging) buckets report, generate a prefilled WhatsApp or SMS reminder text with a share link, per-party reminder history.
- [ ] **S34. Dashboard and reports in the web client.** Shop summary, top debtors, aging view, daily cashbook, date filters.
- [ ] **S35. Data export and backup.** CSV export (parties, transactions), full-shop JSON export, import validation with dry-run mode.
- [ ] **S36. Web client polish.** Responsive mobile layout, empty states, loading and error states, basic accessibility pass, PWA manifest and service worker for installability.

## Week 8: Hardening, performance, release

- [ ] **S37. Observability.** Prometheus-style metrics endpoint (request latency, DB pool, sync lag), structured log correlation, sync lag and error counters, docs on what to watch.
- [ ] **S38. Rate limiting and security review.** Rate limits on auth and sync, input size limits, security headers, dependency audit in CI, threat-model notes in `docs/security.md`.
- [ ] **S39. Performance and load testing.** k6 scripts for posting transactions and sync pull, index review using `EXPLAIN ANALYZE`, documented results and any fixes made.
- [ ] **S40. Deployment.** Production Dockerfile (multi-stage, non-root), compose file for self-hosting, config for a free-tier host, migration-on-deploy strategy, deployment guide.
- [ ] **S41. Documentation pass.** README rewrite with an architecture diagram, feature tour, quick start, design highlights and tradeoffs, test strategy, screenshots; tidy `docs/`.
- [ ] **S42. Release v1.0.** CHANGELOG, version tags, GitHub release notes, CONTRIBUTING and issue templates, final dependency and lint cleanup.

## Buffer and stretch (use as needed)

- [ ] **S43. Buffer.** Catch up on anything that overran, fix bugs found while using the app, or address Hamid's feedback.
- [ ] **S44. Stretch.** Pick one: multi-currency support, recurring entries, role-based activity feed, Urdu localisation, or a WhatsApp bot stub. Decide with Hamid.

---

## Pacing notes

- 5 sessions per week matches the "weekday" rhythm. If sessions are done on weekends too, the project finishes sooner; if days are skipped, it finishes later. Nothing breaks.
- If a session proves too big, split it and renumber the roadmap in the repo, noting the change in `PROGRESS.md`.
- Sessions S27 (convergence simulation), S14 (RLS isolation tests) and S7 (database balance enforcement) are the strongest interview talking points. Give them extra care.
