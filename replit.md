# Workspace

## NorthPath AI — Main Artifact

Frontend-only React + Vite web app at `artifacts/student-path-ai`. Helps high school students discover university majors and career paths through a 9-step questionnaire and rule-based scoring.

**Stack:** React 18, Vite, Wouter (routing), Framer Motion, shadcn/ui, TailwindCSS, lucide-react. No backend — all data in localStorage.

**Key files:**
- `src/lib/store.ts` — All types (QuestionnaireAnswers, MatchResult, HiddenMatch, WhyNotEntry, ProfileType, AlternativeRoute) and localStorage helpers.
- `src/lib/matching.ts` — Full matching engine: dual scoring (keyword + 7-dimensional), confidence levels, pathways, 12-month plans, hidden match, why-not logic, budget-tiered universities, alternativeRoute + miniProject per major.
- `src/lib/i18n.ts` — Full EN/TR/DE translations. `t(lang, path)` traverses nested dot-notation keys. Includes all questionnaire steps, consent, options, results sections, about page content.
- `src/contexts/LanguageContext.tsx` — `LanguageProvider` with `t(path)` and `tOpt(value)` hooks. Persists language to localStorage key `student_path_lang`.
- `src/contexts/ThemeContext.tsx` — `ThemeProvider` toggles `.dark` class on `<html>`. Persists to `student_path_theme`.
- `src/pages/Questionnaire.tsx` — 9-step quiz with consent/decline/processing screens. Steps: subjects, interests, strengths, workStyle, careerEnv, learningApproach, workOrientation, futureGoals, budgetLevel. All text wired through i18n.
- `src/pages/Results.tsx` — Tab-based guidance dashboard: My Matches (with pathway explorer, Alternative Route, Try This Project), Compare Options (side-by-side table), 12-Month Plan, Explore More (hidden match + why not). Share Results button encodes answers as `btoa(encodeURIComponent(JSON.stringify(answers)))` in `?share=` URL param; on load decodes and recalculates if present.
- `src/pages/About.tsx` — App info + 4 developers (Cem Kutay Aktaş, Doruk Uzer, Devin Tolun, Can Dalkıran). All text wired through i18n.
- `src/pages/Home.tsx` — Landing page. All text wired through i18n.

**Important string conventions:** questionnaire uses "Art / Design" and "Literature / Languages" (with spaces around slash) — matching.ts uses exact same strings.

**Budget levels** map to tiers 1/2/3 in `universitiesByBudget` per major. Tier 1 = affordable/public European, Tier 3 = premium/Ivy League.

**Completed features:** brand renamed to "NorthPath AI" everywhere (index.html, Navbar, Auth, About, pdf.ts, i18n.ts), multilanguage EN/TR/DE (all pages fully wired including Auth.tsx and Account.tsx), dark/light mode (all dark: variants applied to bg-white/bg-sky-50/bg-green-50/bg-gray-100/bg-blue-50 in Results.tsx), alternative career route per major, beginner mini-project suggestions per major, shareable results URL, Can Dalkıran added as 4th developer, PDF export (jsPDF structured report), account system (localStorage-based register/login/save), country-specific university explorer (5 universities per major per country). Results.tsx fully wired to i18n: RANK_CONFIG uses labelKey, ConfBadge translates confidence levels, all CompareTab/TwelveMonthTab/ExploreTab/ProfileBanner/MajorCard section labels translated.

**Account system:** `src/lib/accounts.ts` + `src/contexts/AccountContext.tsx`. Store accounts in `student_path_accounts` localStorage key. Current user ID in `student_path_current_account`. Pages: `/auth` (Auth.tsx — sign in/register), `/account` (Account.tsx — goals, countries, saved results).

**PDF Export:** `src/lib/pdf.ts` uses jsPDF to programmatically build a structured multi-page PDF report. Triggered by "Download PDF Report" button on the results page. No screenshots — all drawn programmatically with headers, color blocks, and text sections.

**Country Explorer:** `src/lib/universities.ts` has `UNIVERSITIES_BY_COUNTRY` — a record of major → country → 5 universities. Displayed inside each MajorCard expanded area as an interactive country picker.

**Developers:** Cem Kutay Aktaş, Doruk Uzer, Devin Tolun, Can Dalkıran.

---

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
