# AGENTS.md

## Project

Infomaniak kPaste — secure encrypted paste app. Encryption/decryption happens client-side (AES-256-GCM) via the Web Crypto API. React 18 + TypeScript + Vite (SWC). MUI for UI, i18next for i18n, react-router-dom v6.

## Setup

Requires Node >=20 (not 19 as README says — trust `package.json` `engines`).

Three env vars must be set before `npm start` or `npm run build`:

```bash
export VITE_WEB_COMPONENT_ENDPOINT="https://web-components.storage.infomaniak.com/next/init.js"
export VITE_WEB_COMPONENT_API_ENDPOINT="https://welcome.infomaniak.com"
export VITE_SHOP_ENDPOINT="https://shop.infomaniak.com"
```

All Vite env vars must be prefixed with `VITE_`.

## Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Dev server with `--host` |
| `npm run build` | `tsc && vite build` → outputs `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, zero warnings tolerated (`--max-warnings 0`) |
| `npm run test` | Vitest in run mode (non-watch) |
| `npm run test:watch` | Vitest interactive |
| `npm run test:all` | typecheck → lint → unit tests → e2e Chrome |
| `npm run test-chrome` | E2e: builds nothing — serves `dist/` on :3002 then runs Cypress |

## Architecture

- `src/App.tsx` — root component, sets up KSuiteBridge, background fetch, routing
- `src/lib/Crypto/` — AES-256-GCM encrypt/decrypt (core domain logic)
- `src/components/` — UI components (Home, Header, Footer, etc.)
- `src/pages/` — route pages (`NewPaste`, `ShowPaste`)
- `src/types/` — shared TypeScript types
- `cypress/e2e/` — 3 e2e spec files (5 tests total)

## TypeScript

Strict mode is on but not maxed out. Missing: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.

Three tsconfig files:
- `tsconfig.json` — app code (`src/`), uses `noEmit` + bundler resolution
- `tsconfig.node.json` — `vite.config.ts` only
- `tsconfig.cypress.json` — `cypress/` only

`tsc --noEmit` checks only `src/`. To check cypress or node configs, reference them explicitly.

## Testing

- **Unit tests**: Vitest with `happy-dom`, globals enabled. Setup file `setupTest.js` globally mocks `fetch` — do not remove it or CI unit tests will fail with `ECONNREFUSED` (App.tsx fetches a background promotion on mount).
- **E2E tests**: Cypress. Requires `dist/` to exist (`npm run build` first). `npm run test-chrome` serves `dist/` on port 3002 via `http-server` then runs Cypress. Cypress `baseUrl` is `http://localhost:5173` for `cy:open` but `CYPRESS_BASE_URL` override is used for CI.
- **Running a single test file**: `npx vitest run src/lib/Crypto/Crypto.test.ts`
- **Running a single Cypress spec**: `npx cypress run --spec cypress/e2e/homepage.cy.ts`

## CI (GitLab)

Pipeline stages: `test` → `build_front` → `cypress` → `build_docker_image` → `docker_test`.

- `test` stage runs `lint`, `typecheck`, `unit_test` in parallel — these gate the build.
- `build_front` produces `dist/` artifact needed by `cypress_chrome`.
- E2e only runs on MRs and `-rc` tags.
- Docker image build only runs on tags (not MRs).
- Primary remote is GitLab (`origin` → `gitlab.infomaniak.ch:infomaniak/paste.git`). GitHub (`paste` remote) is a mirror.
- Pre-commit hook (husky) runs `npm run lint`.

## Gotchas

- `App.tsx` has two separate `useEffect` hooks: one for background fetch (runs once on mount), one for KSuiteBridge setup (guarded by `bridge` state). Don't merge them — adding `bridge` to the background fetch deps causes a double fetch.
- `skipLibCheck: true` is set in all tsconfigs — type errors in `.d.ts` files are silently ignored.
- ESLint enforces `react-hooks/exhaustive-deps` and `react-refresh/only-export-components`.
