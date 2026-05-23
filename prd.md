# ExchangeHub — MVP Product Requirements Document
> Hackathon Build | React + Supabase + Anthropic API | 48 hours

---

## 1. Overview

ExchangeHub replaces the chaotic email and WhatsApp-based workflow that universities and exchange organisations use to manage student applications for funded and unfunded exchange programmes.

Instead of coordinators manually reading inboxes and building spreadsheets, ExchangeHub centralises programme listings, collects structured student applications, and uses Claude AI to rank candidates in seconds.

| | |
|---|---|
| **Problem** | Coordinators spend 40+ hours per cohort reading applications from email, WhatsApp and spreadsheets. No structure, no ranking, no audit trail. |
| **Solution** | A marketplace where orgs post programmes, students apply in a structured form, and AI instantly ranks candidates. |
| **Target users** | Exchange organisations / NGOs (supply side) and university coordinators + students (demand side). |
| **Business model** | Orgs pay per programme listing or per cohort. Universities get free access to drive student adoption. |
| **Hackathon goal** | Live demo of all 4 screens with real AI ranking output. Win on the wow moment, not the feature list. |

---

## 2. Technical Stack

- [ ] Create React + Vite project
- [ ] Install and configure Tailwind CSS
- [ ] Create Supabase project
- [ ] Configure Supabase Auth (email + role field)
- [ ] Create `.env` file with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_API_KEY`
- [ ] Deploy frontend to Vercel

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast scaffold, great UI, no build config pain |
| Auth | Supabase Auth | Email login + role field — zero custom auth code |
| Database | Supabase Postgres | Hosted, instant, no setup |
| File storage | Supabase Storage | CV uploads, URL saved to DB — 3 lines of code |
| AI ranking | Anthropic API — `claude-sonnet-4-20250514` | Called directly from React via fetch, key in .env |
| Hosting | Vercel + Supabase | Both free tier, deploy in under 10 min |
| State | React useState + Supabase realtime | No Redux needed |

---

## 3. Database Schema

> Create all three tables before writing any frontend code.

### `programmes` table
- [ ] Create `programmes` table in Supabase

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `title` | text | Programme name |
| `country` | text | Destination country |
| `funded` | boolean | true = fully funded |
| `deadline` | date | Application deadline |
| `description` | text | Full programme details |
| `requirements` | text | Criteria AI uses to rank candidates |
| `org_id` | uuid | FK to auth.users |
| `created_at` | timestamptz | Auto |

### `applications` table
- [ ] Create `applications` table in Supabase

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `programme_id` | uuid | FK to programmes |
| `student_id` | uuid | FK to auth.users |
| `motivation` | text | Why they want this programme (main AI input) |
| `gpa` | numeric | 0.0 to 4.0 or local equivalent |
| `language_level` | text | A1 / A2 / B1 / B2 / C1 / C2 |
| `cv_url` | text | Supabase Storage URL |
| `status` | text | `applied` \| `shortlisted` \| `accepted` \| `rejected` |
| `ai_score` | numeric | 0 to 100, set by AI ranking call |
| `ai_reason` | text | One-sentence AI justification |
| `created_at` | timestamptz | Auto |

### `profiles` table
- [ ] Create `profiles` table in Supabase (linked to `auth.users`)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | FK to auth.users |
| `role` | text | `org` \| `student` \| `coordinator` |
| `full_name` | text | Display name |

---

## 4. The Four Screens

> Build these in order. Do not move to the next screen until the current one works with real Supabase data.

---

### Screen 1 — Post a Programme `[Organisation]`

> The org logs in and fills a form to list a new exchange programme. This is the supply side of the marketplace.

**Form fields**
- [ ] Programme title (text input)
- [ ] Destination country (text input)
- [ ] Funded toggle — yes / no (boolean)
- [ ] Application deadline (date picker)
- [ ] Full description (textarea)
- [ ] Requirements / ideal candidate criteria (textarea — this is fed to the AI)

**Behaviour**
- [ ] On submit: insert row into `programmes` table with `org_id` from auth session
- [ ] After submit: redirect to org dashboard
- [ ] Org dashboard shows list of their programmes with applicant count per programme
- [ ] Seed 3 demo programmes so the demo never starts from an empty state

---

### Screen 2 — Student Application `[Student]`

> Student browses available programmes and submits a structured form. Replaces chaotic email/WhatsApp submissions.

**Programme listing page**
- [ ] Cards showing: title, country, funded badge, deadline
- [ ] Filter by funded status (funded / all)
- [ ] Clicking a card opens the application form

**Application form**
- [ ] Motivation textarea (enforce min 100 words client-side)
- [ ] GPA input (numeric, 0.0–4.0)
- [ ] Language level dropdown (A1 / A2 / B1 / B2 / C1 / C2)
- [ ] CV upload (PDF only, upload to Supabase Storage, save URL to DB)

**Behaviour**
- [ ] On submit: insert row into `applications` with `status = 'applied'`
- [ ] Show confirmation message: *"Your application was submitted. You will be notified of the outcome."*
- [ ] Guard: check for duplicate before allowing submit (one application per student per programme)

---

### Screen 3 — AI Candidate Ranking `[Coordinator]` ⭐

> Coordinator clicks one button and Claude reads every application and returns a ranked shortlist. This is the demo's wow moment — make it work perfectly.

**Applicant table**
- [ ] Coordinator selects a programme from their dashboard
- [ ] Table shows all applicants: name, GPA, language level, motivation snippet, current status
- [ ] "Rank with AI" button prominently displayed

**AI ranking flow**
- [ ] On button click: show loading spinner with text *"Claude is reviewing applications..."*
- [ ] Fetch all applications for the programme from Supabase
- [ ] Build prompt using the template in Section 6
- [ ] Call `https://api.anthropic.com/v1/messages` directly from React
- [ ] Parse the JSON array response
- [ ] Update `ai_score` and `ai_reason` for each application row in Supabase
- [ ] Re-render table sorted by `ai_score` descending
- [ ] Show score badge (0–100) and AI reason per candidate row

---

### Screen 4 — Coordinator Review Board `[Coordinator]`

> Kanban board for final decisions. Shows humans stay in control.

**Kanban board**
- [ ] Install `@hello-pangea/dnd` for drag-and-drop
- [ ] Four columns: **Applied** | **Shortlisted** | **Accepted** | **Rejected**
- [ ] Cards display: student name, AI score badge, AI one-sentence reason, GPA, language level
- [ ] Counter badge on each column header showing applicant count

**Behaviour**
- [ ] On card drag-and-drop: update `status` in Supabase immediately
- [ ] Accept and Reject buttons on each card as fallback to drag-and-drop
- [ ] (Nice to have) Export shortlisted candidates as CSV

---

## 5. 48-Hour Timeline

| Hours | Owner | Task | Done |
|---|---|---|---|
| 0 – 2h | Everyone | Supabase setup, tables, Auth, React scaffold, .env | - [ ] |
| 2 – 8h | Dev 1 + Dev 2 | Screen 1: Post a programme form + org dashboard | - [ ] |
| 8 – 16h | Dev 1 + Dev 2 | Screen 2: Programme listing + student application form + CV upload | - [ ] |
| 16 – 28h | Dev 1 (AI) + Dev 2 (UI) | Screen 3: Applicant table + AI ranking + JSON parsing + Supabase update | - [ ] |
| 28 – 38h | Dev 2 + Dev 3 | Screen 4: Kanban board + drag-and-drop + status update | - [ ] |
| 38 – 44h | Everyone | Seed demo data, connect all screens, bug fixes | - [ ] |
| 44 – 48h | Everyone | Pitch prep, rehearse narrative, verify AI ranking on demo machine | - [ ] |

---

## 6. AI Ranking — Prompt Template

> Paste this into your codebase as a constant. The critical part is forcing JSON-only output.

```javascript
const SYSTEM_PROMPT = `You are an expert academic coordinator. Rank student applications fairly and objectively.`;

const buildRankingPrompt = (programme, applicants) => `
PROGRAMME: ${programme.title}
COUNTRY: ${programme.country}
REQUIREMENTS: ${programme.requirements}

APPLICANTS (JSON):
${JSON.stringify(applicants.map(a => ({
  student_id: a.student_id,
  name: a.full_name,
  motivation: a.motivation,
  gpa: a.gpa,
  language_level: a.language_level,
  cv_uploaded: !!a.cv_url
})), null, 2)}

Return ONLY a valid JSON array. No explanation. No markdown. No preamble.
Format: [{"student_id":"...","score":85,"reason":"One sentence justification."}]
Score 0-100. Order descending by score.
`;
```

**Calling the API from React:**

```javascript
const rankCandidates = async (programme, applications) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildRankingPrompt(programme, applications) }],
    }),
  });

  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text); // [{ student_id, score, reason }]
};
```

- [ ] Prompt template implemented in codebase
- [ ] API call working and returning valid JSON
- [ ] Scores and reasons saved back to Supabase
- [ ] Tested with at least 5 seeded applicants before demo

---

## 7. Pitch Narrative

> Practise until it runs exactly 2 minutes.

- [ ] Pitch rehearsed at least twice end-to-end
- [ ] AI ranking demo confirmed working on the presentation machine
- [ ] Demo data seeded and ready (no live typing during demo)

**The script:**

**BEFORE (30 sec)**
> "Right now, coordinators receive applications by email, WhatsApp, and chat. For every cohort that is 40+ hours of manually reading PDFs, copying data into spreadsheets, and debating rankings. Great candidates get lost in inboxes."

**DEMO (90 sec)**
> Show all 4 screens live. Post a programme. Apply as a student. Click **Rank with AI** — pause for effect. Show the ranked list with scores and reasons. Drag a candidate to Accepted on the Kanban board.

**AFTER (30 sec)**
> "ExchangeHub turns 40 hours of manual work into 30 seconds. We have a contact at [university name] who confirmed this is exactly how they work today. We are not guessing — we are solving a real problem."

**MONEY (15 sec)**
> "Organisations pay per programme listing. Universities get free access. As volume grows we add analytics and a university SIS integration API."

---

## 8. Judge Q&A — Pre-prepared Answers

| Question | Answer |
|---|---|
| **GDPR?** | Students voluntarily submit their own data for the purpose of applying. It is not shared beyond the coordinator. We store only what is necessary. |
| **AI bias?** | AI is a sorting assistant, not the decision maker. The coordinator has full override. Final decisions are always human. |
| **Who pays first?** | Orgs pay per listing. Universities get free access. Orgs have immediate ROI — they save hours of coordination per cohort. |
| **Why not just use Google Forms?** | Forms don't group applicants per programme, don't rank them, and don't give coordinators a review board. We do all three. |

---

## Final Checklist — Before You Demo

- [ ] All 4 screens work end-to-end with real Supabase data
- [ ] AI ranking returns a valid ranked list every time
- [ ] At least 5 seeded applicants across 2–3 programmes
- [ ] Demo runs without any login friction (pre-log in before presenting)
- [ ] Vercel deployment live with a public URL
- [ ] Pitch is 2 minutes, before/after narrative is tight
- [ ] University contact name-dropped in the pitch
