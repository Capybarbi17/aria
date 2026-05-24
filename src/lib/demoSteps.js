import { getBerlinApplyUrl } from './demoSeed'

export const DEMO_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to the ExchangeHub demo',
    body: 'In 7 steps you will see how an organization posts a programme, shares a link, students apply without an account, and AI flags the best candidates.',
    path: '/dashboard',
    role: 'org',
  },
  {
    id: 'post',
    title: 'Step 1 — Post a programme',
    body: 'Organizations list exchange opportunities here — fill the form manually or paste a programme call and let AI extract every field.',
    path: '/programmes/new',
    role: 'org',
    highlight: 'post-form',
  },
  {
    id: 'link',
    title: 'Step 2 — Shareable application link',
    body: 'After posting, ExchangeHub generates a unique URL. Copy it and share via WhatsApp, email, or social media — no student login required.',
    path: '/dashboard',
    role: 'org',
    highlight: 'share-link',
  },
  {
    id: 'apply',
    title: 'Step 3 — Student opens the link',
    body: 'Students see programme details and requirements, then fill a simple form. This is the public apply page — no account needed.',
    path: () => `/apply/demo-berlin-computer-science`,
    role: 'student',
    highlight: 'apply-header',
  },
  {
    id: 'form',
    title: 'Step 4 — Student submits application',
    body: 'Name, contact, GPA, motivation letter, and PDF CV. One application per email per programme.',
    path: () => `/apply/demo-berlin-computer-science`,
    role: 'student',
    highlight: 'apply-form',
  },
  {
    id: 'folder',
    title: 'Step 5 — Applications arrive in folders',
    body: 'Each programme is a folder. The organization sees every applicant with GPA, language level, and AI badges.',
    path: (meta) => `/programmes/${meta?.berlinProgrammeId || ''}`,
    role: 'org',
    highlight: 'applicant-list',
  },
  {
    id: 'ai',
    title: 'Step 6 — AI assistant (wow moment)',
    body: 'Open a candidate and click Analyze with AI. OpenAI scores fit 0–100 and shows a green or red flag with a one-sentence reason.',
    path: (meta) =>
      meta?.berlinProgrammeId && meta?.strongApplicationId
        ? `/programmes/${meta.berlinProgrammeId}/applications/${meta.strongApplicationId}`
        : '/dashboard',
    role: 'org',
    highlight: 'ai-panel',
  },
  {
    id: 'done',
    title: 'Demo complete',
    body: `You turned a 40-hour inbox workflow into minutes. Try analyzing Jordan Smith (red flag) vs Alex Chen (green flag) in the Berlin folder.`,
    path: '/dashboard',
    role: 'org',
  },
]

export function getStepApplyUrl() {
  return getBerlinApplyUrl()
}
