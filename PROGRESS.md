# khata-core: Progress

This file is updated at the end of every working session. It is how the next session picks up where the last one stopped.

## Status

- Current session: **S3** (not started)
- Sessions completed: 2 of 44
- Last updated: 2026-11-20

## Session log

Newest entries go at the top. Format for each entry:

```
### S<N>: <title> (<date>)
- Done: what was built
- Decisions: key choices and why
- Follow-ups: anything left over for later (or "none")
- Commits: short hashes and messages
```

### S2: CI and local dev environment (2026-11-20)

- Done: GitHub Actions workflow (`.github/workflows/ci.yml`) with a check job (lint, format check, typecheck, tests on Node from `.nvmrc`) and an audit job. `docker-compose.yml` with Postgres 16 and a healthcheck. Scripts `dev:db`, `dev:db:stop`, `dev:db:reset`. CI and licence badges and a database quick start in the README. `DATABASE_URL` enabled in `.env.example`.
- Decisions: the audit job uses `npm audit --omit=dev --audit-level=high`, because the only open advisory (`picomatch` ReDoS) is in dev tooling and has no patched release; auditing dev dependencies would keep CI red for something that never ships. Workflow permissions are read-only and runs are cancelled when superseded. The database integration job is deferred to S4, when there are tests that need Postgres.
- Follow-ups: the Docker daemon is unavailable in the build workspace, so `npm run dev:db` was not run end to end here; the compose file passes `docker compose config`. Hamid should run it once locally. Confirm the first CI run is green on GitHub. Revisit full-tree audit in S38.
- Commits: `6993528` ci: add GitHub Actions workflow and local Postgres via Docker Compose; plus a docs commit with the README and tracker updates.

### S1: Repo scaffold and tooling (2026-11-18)

- Done: npm workspaces monorepo (`apps/*`, `packages/*`), strict TypeScript base config, ESLint with the strict type-checked rules plus Prettier, Vitest with one root config, `.editorconfig`, `.gitignore`, `.nvmrc`, `.env.example`, MIT LICENSE, README with project vision. `packages/ledger` exists with the default currency constants and tests so the whole toolchain runs end to end. `npm run check` runs lint, format check, typecheck and tests.
- Decisions: pinned TypeScript 5 and ESLint 9 because typescript-eslint does not yet support TypeScript 7. Enabled `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` up front, since money and ledger code benefits from the extra strictness and retrofitting it later is painful. Tracker docs (`ROADMAP.md`, `PROGRESS.md`, `CONVENTIONS.md`) are in `.prettierignore` so they stay as written. Only `packages/ledger` was created; other workspaces are added by the sessions that need them rather than as empty folders.
- Follow-ups: `npm audit` reports a high-severity ReDoS in `picomatch` (dev tooling only, pulled in by Vitest and typescript-eslint) with no patched release available yet; revisit in S2 when CI adds the dependency audit, and again in S38. Revisit the TypeScript and ESLint pins when typescript-eslint supports newer majors.
- Commits: `71ce932` docs: add roadmap, progress tracker and conventions; `36df183` chore: scaffold npm workspaces with strict TypeScript, ESLint, Prettier and Vitest; plus a final docs commit with the README and tracker updates.

## Open questions and blockers

_None._

## Roadmap changes

_None. Record any session that was split, merged, reordered or dropped, with the reason._
