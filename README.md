# ExchangeHub

Organization portal for exchange programmes: post listings, share apply links, review applicants, AI fit scoring.

## Run locally

```bash
npm install
cp .env.example .env   # add Supabase + OpenAI keys
npm run dev
```

Open http://localhost:5173

## Interactive demo

Click **Start interactive demo** on the home page, login page, or dashboard header.

The demo will:

1. Log in as `demo@exchangehub.app` (creates account + seed data on first run)
2. Walk through 8 steps with a guided panel (post → link → student form → folders → AI)
3. Pre-load **Berlin CS** (3 applicants) and **Paris Art** (2 applicants) with sample AI scores

**Supabase:** Disable email confirmation under Authentication → Providers → Email for demo auto-login.

**Demo credentials (manual login):** `demo@exchangehub.app` / `DemoExchange2026!`

**Berlin apply link:** `/apply/demo-berlin-computer-science`

## Stack

React · Vite · Tailwind · Supabase · OpenAI API
