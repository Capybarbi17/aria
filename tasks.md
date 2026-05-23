# ExchangeHub — Build Tasks (Organization MVP)

> **Scope:** Organizations only. Students apply via public link (no registration).  
> **Demo goal:** Org posts programme → share link → student submits form → org sees folder → opens candidate → AI green/red flag + score.

---

## Phase 0 — Foundation

### Supabase & environment
- [ ] Create Supabase project
- [ ] Add `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_API_KEY`
- [ ] Create `organizations` table (linked to `auth.users`)
- [ ] Create `programmes` table (each post = one “folder”)
- [ ] Create `applications` table (anonymous student submissions)
- [ ] Add unique index on `programmes.slug` for public URLs
- [ ] Create Storage bucket `cvs` (PDF uploads only)
- [ ] Set up Row Level Security (RLS) policies
  - [ ] Org can CRUD own programmes
  - [ ] Org can read applications for own programmes only
  - [ ] Anonymous can insert applications for valid programme
  - [ ] Anonymous can upload CV to scoped storage path
- [ ] Create `src/lib/supabase.js` client

### App shell
- [ ] Set up React Router routes structure
- [ ] Create protected route wrapper (org must be logged in)
- [ ] Create shared layout (header, nav, logout)

---

## Phase 1 — Organization register & login

- [ ] Build `/register` page (email, password, org name, optional phone)
- [ ] On signup: create `auth.users` + row in `organizations`
- [ ] Build `/login` page (email + password)
- [ ] Redirect to `/dashboard` after successful login
- [ ] Redirect unauthenticated users away from protected routes
- [ ] Add logout button in header
- [ ] **Demo prep:** Pre-create one org test account for live demo

---

## Phase 2 — Post a programme + shareable link

- [ ] Add “Post” button on dashboard → `/programmes/new`
- [ ] Build programme form:
  - [ ] Title (e.g. “Berlin – Computer Science”)
  - [ ] Location (e.g. Berlin / Paris)
  - [ ] Description
  - [ ] Requirements (textarea — used by AI later)
  - [ ] Optional deadline
- [ ] On submit: generate unique `slug` (URL-safe)
- [ ] On submit: insert row into `programmes` with `org_id` from session
- [ ] Show success screen with public apply URL: `/apply/{slug}`
- [ ] **Share panel (demo):**
  - [ ] Copy link to clipboard button
  - [ ] WhatsApp share link (`wa.me` with pre-filled URL)
  - [ ] Email share (`mailto:` with subject + body)
  - [ ] (Optional) Facebook sharer URL or “API post-MVP” placeholder
- [ ] Redirect back to dashboard after post (or stay on success with link)

---

## Phase 3 — Public student application form (no login)

- [ ] Build public route `/apply/:slug`
- [ ] Load programme by `slug`; show 404 if invalid
- [ ] Display programme title, description, and requirements at top
- [ ] Build application form fields:
  - [ ] Full name
  - [ ] Email
  - [ ] Phone number
  - [ ] GPA (numeric)
  - [ ] Language level (optional dropdown A1–C2)
  - [ ] Motivational letter (textarea)
  - [ ] CV upload (PDF only)
- [ ] Upload CV to Supabase Storage → save `cv_url`
- [ ] On submit: insert row into `applications` for that `programme_id`
- [ ] Show confirmation message after submit
- [ ] (Optional) Block duplicate: same email + same programme

---

## Phase 4 — Dashboard “folders” & applicant list

- [ ] Build `/dashboard` — list all programmes for logged-in org
- [ ] Each programme card/row shows: title, location, applicant count
- [ ] Click programme → `/programmes/:id` (the “folder” view)
- [ ] Folder view: table/list of applicants (name, email, GPA, date submitted)
- [ ] Show total candidate count on folder page
- [ ] Click applicant → `/programmes/:id/applications/:appId` (detail page)
- [ ] (Optional) Show AI badge on list if already analyzed

---

## Phase 5 — Candidate detail + AI assistant (wow moment)

- [ ] Build candidate detail page with:
  - [ ] Name, email, phone, GPA, language level
  - [ ] Full motivational letter
  - [ ] CV: PDF viewer or download link
- [ ] Add AI assistant panel on detail page
- [ ] Implement Anthropic API call (per candidate vs programme `requirements`)
- [ ] Parse JSON response: `score` (0–100), `verdict` (green/red), `reason` (one sentence)
- [ ] Show loading state: “AI is reviewing this candidate…”
- [ ] Display green flag (good match) or red flag (poor match) + score
- [ ] Display one-sentence AI reason
- [ ] Save `ai_score`, `ai_verdict`, `ai_reason` to `applications` in Supabase
- [ ] Re-show cached AI result if already analyzed (no re-call unless refresh)
- [ ] Decide: auto-run AI on page open **or** “Analyze with AI” button
- [ ] Set green threshold (e.g. score ≥ 70 = green, else red)

---

## Phase 6 — Seed data, polish & deploy

### Seed data
- [ ] Seed org demo account (or use real signup)
- [ ] Seed programme 1: Berlin — Computer Science
- [ ] Seed programme 2: Paris — Art & Architecture
- [ ] Seed 5–8 fake applications across both programmes (varied quality for AI demo)

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
