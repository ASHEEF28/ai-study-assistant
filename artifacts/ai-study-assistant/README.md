# AI Study Assistant

A small classroom-demo app where students sign in, ask Gemini study questions, and revisit their own saved answers.

## Environment variables

Add these values in Replit Secrets, or copy `.env.example` to `.env.local` for local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY`

The Gemini key is used only by the server-side `/study/ask` route. Never prefix it with `NEXT_PUBLIC_`.

## Run locally

From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/ai-study-assistant run dev
```

## Supabase database setup

The app cannot create tables in a Supabase project using a publishable key. Run [`supabase/setup.sql`](./supabase/setup.sql) once in the Supabase SQL Editor. It creates the `questions` table, enables row-level security, and restricts reads and writes to the signed-in owner.

For email/password authentication, enable Email in Supabase Auth. If email confirmation is enabled, sign-up asks the student to confirm their email before signing in.

## Architecture

- **Next.js App Router** — pages, protected dashboard, Supabase session refresh, and the server-only Gemini route at `/study/ask` (kept outside the workspace's shared `/api` prefix).
- **Supabase** — cookie-based authentication and PostgreSQL question history protected by row-level security.
- **Google Gemini** — `@google/genai`, called only on the server.

The app has not been connected to GitHub or Vercel. For a future Vercel deployment, use `artifacts/ai-study-assistant` as the project root and add the same three environment variables there.
