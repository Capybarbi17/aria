# ExchangeHub — Build Tasks (Organization MVP)

> **Scope:** Organizations only. Students apply via public link (no registration).  
> **Demo goal:** Org posts programme → share link → student submits form → org sees folder → opens candidate → AI green/red flag + score.

---

## Phase 0 — Foundation

### Supabase & environment
- [x] Create Supabase project
- [x] Add `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_API_KEY`
- [x] Create `organizations` table (linked to `auth.users`)
- [x] Create `programmes` table (each post = one “folder”)
- [x] Create `applications` table (anonymous student submissions)
- [x] Add unique index on `programmes.slug` for public URLs
- [x] Create Storage bucket `cvs` (PDF uploads only)
- [x] Set up Row Level Security (RLS) policies
  - [x] Org can CRUD own programmes
  - [x] Org can read applications for own programmes only
  - [x] Anonymous can insert applications for valid programme
  - [x] Anonymous can upload CV to scoped storage path
- [x] Create `src/lib/supabase.js` client

### App shell
- [x] Set up React Router routes structure
- [x] Create protected route wrapper (org must be logged in)
- [x] Create shared layout (header, nav, logout)

---

## Phase 1 — Organization register & login

- [x] Build `/register` page (email, password, org name, optional phone)
- [x] On signup: create `auth.users` + row in `organizations`
- [x] Build `/login` page (email + password)
- [x] Redirect to `/dashboard` after successful login
- [x] Redirect unauthenticated users away from protected routes
- [x] Add logout button in header
- [ ] **Demo prep:** Pre-create one org test account for live demo

---

## Phase 2 — Post a programme + shareable link

- [x] Add “Post” button on dashboard → `/programmes/new`
- [x] Build programme form:
  - [x] Title (e.g. “Berlin – Computer Science”)
  - [x] Location (e.g. Berlin / Paris)
  - [x] Description
  - [x] Requirements (textarea — used by AI later)
  - [x] Optional deadline
- [x] On submit: generate unique `slug` (URL-safe)
- [x] On submit: insert row into `programmes` with `org_id` from session
- [x] Show success screen with public apply URL: `/apply/{slug}`
- [x] **Share panel (demo):**
  - [x] Copy link to clipboard button
  - [x] WhatsApp share link (`wa.me` with pre-filled URL)
  - [x] Email share (`mailto:` with subject + body)
  - [x] (Optional) Facebook sharer URL or “API post-MVP” placeholder
- [x] Redirect back to dashboard after post (or stay on success with link)

---

## Phase 3 — Public student application form (no login)

- [x] Build public route `/apply/:slug`
- [x] Load programme by `slug`; show 404 if invalid
- [x] Display programme title, description, and requirements at top
- [x] Build application form fields:
  - [x] Full name
  - [x] Email
  - [x] Phone number
  - [x] GPA (numeric)
  - [x] Language level (optional dropdown A1–C2)
  - [x] Motivational letter (textarea)
  - [x] CV upload (PDF only)
- [x] Upload CV to Supabase Storage → save `cv_url`
- [x] On submit: insert row into `applications` for that `programme_id`
- [x] Show confirmation message after submit
- [x] (Optional) Block duplicate: same email + same programme

---

## Phase 4 — Dashboard “folders” & applicant list

- [x] Build `/dashboard` — list all programmes for logged-in org
- [x] Each programme card/row shows: title, location, applicant count
- [x] Click programme → `/programmes/:id` (the “folder” view)
- [x] Folder view: table/list of applicants (name, email, GPA, date submitted)
- [x] Show total candidate count on folder page
- [x] Click applicant → `/programmes/:id/applications/:appId` (detail page)
- [x] (Optional) Show AI badge on list if already analyzed

---

## Phase 5 — Candidate detail + AI assistant (wow moment)

- [x] Build candidate detail page with:
  - [x] Name, email, phone, GPA, language level
  - [x] Full motivational letter
  - [x] CV: PDF viewer or download link
- [x] Add AI assistant panel on detail page
- [x] Implement Anthropic API call (per candidate vs programme `requirements`)
- [x] Parse JSON response: `score` (0–100), `verdict` (green/red), `reason` (one sentence)
- [x] Show loading state: “AI is reviewing this candidate…”
- [x] Display green flag (good match) or red flag (poor match) + score
- [x] Display one-sentence AI reason
- [x] Save `ai_score`, `ai_verdict`, `ai_reason` to `applications` in Supabase
- [x] Re-show cached AI result if already analyzed (no re-call unless refresh)
- [x] Decide: auto-run AI on page open **or** “Analyze with AI” button → **button** (Re-analyze available)
- [x] Set green threshold (e.g. score ≥ 70 = green, else red)

---

## Phase 6 — Seed data, polish & deploy

### Seed data
- [x] Seed org demo account (or use real signup) — via **Start interactive demo**
- [x] Seed programme 1: Berlin — Computer Science
- [x] Seed programme 2: Paris — Art & Architecture
- [x] Seed 5–8 fake applications across both programmes (varied quality for AI demo)

### UI & UX polish
- [ ] Basic responsive layout (mobile-friendly apply form)
- [ ] Empty states (no programmes yet, no applicants yet)
- [ ] Error handling (invalid slug, upload fail, API fail)

### Deploy & demo prep
- [ ] Deploy frontend to Vercel
- [ ] Verify public apply link works on deployed URL
- [ ] Test full flow on demo machine (incognito for student apply)
- [ ] Pre-login org account before pitch
- [ ] Rehearse 2-minute demo script:
  1. [ ] Org logs in → sees folders with counts
  2. [ ] Click Post → create programme → copy share link
  3. [ ] Open link (incognito) → student submits form
  4. [ ] Back to org → open Berlin folder → see new applicant
  5. [ ] Open strong candidate → green flag + score
  6. [ ] Open weak candidate → red flag + score

---

## Out of scope for this MVP (do not build unless added later)

- [ ] ~~Student registration / login~~
- [ ] ~~Coordinator role~~
- [ ] ~~Kanban review board~~
- [ ] ~~Batch “rank all applicants” button~~
- [ ] ~~Real Facebook Graph API auto-post~~
- [ ] ~~Payments / paid listings~~

---

## Quick reference — routes

| Route | Who | Purpose |
|-------|-----|---------|
| `/register` | Org | Sign up |
| `/login` | Org | Sign in |
| `/dashboard` | Org | Programme folders + counts |
| `/programmes/new` | Org | Post new programme |
| `/programmes/:id` | Org | Applicants in one folder |
| `/programmes/:id/applications/:appId` | Org | Candidate detail + AI |
| `/apply/:slug` | Public | Student application form |

---

## Quick reference — database tables

| Table | Purpose |
|-------|---------|
| `organizations` | Org profile (linked to auth) |
| `programmes` | Each post / folder (has `slug` for public link) |
| `applications` | Student submissions (no auth) |
| Storage `cvs` | PDF files |

---

## Decisions to confirm (check when decided)

- [ ] AI runs automatically on candidate open vs manual “Analyze” button
- [ ] Green flag threshold (e.g. score ≥ 70)
- [ ] Share channels for demo: copy link + WhatsApp enough?
- [ ] Motivation min length (words/chars) or no minimum for hackathon
