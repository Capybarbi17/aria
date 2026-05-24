import { supabase } from './supabase'

export const DEMO_EMAIL = 'demo@exchangehub.app'
export const DEMO_PASSWORD = 'DemoExchange2026!'

export const DEMO_STORAGE_KEY = 'exchangehub_demo_meta'

const BERLIN_SLUG = 'demo-berlin-computer-science'
const PARIS_SLUG = 'demo-paris-art-architecture'

const PROGRAMMES = [
  {
    slug: BERLIN_SLUG,
    title: 'Berlin — Computer Science Exchange',
    location: 'Berlin, Germany',
    description:
      'A semester exchange with partner universities in Berlin. Includes tuition support and housing stipend for qualified CS students.',
    requirements:
      'Computer Science or related field. Minimum GPA 3.2. B2 German or English. Strong motivation and prior programming projects.',
    deadline: '2026-09-01',
  },
  {
    slug: PARIS_SLUG,
    title: 'Paris — Art & Architecture',
    location: 'Paris, France',
    description:
      'Studio-based programme for art and architecture students. Work with atelier partners in central Paris.',
    requirements:
      'Portfolio required. Architecture, Fine Arts, or Design background. GPA 3.0+. B1 French preferred. Creative motivation letter essential.',
    deadline: '2026-08-15',
  },
]

const APPLICANTS = {
  [BERLIN_SLUG]: [
    {
      full_name: 'Alex Chen',
      email: 'alex.chen.demo@student.edu',
      phone: '+1 555 0101',
      gpa: 3.8,
      language_level: 'C1',
      motivation:
        'I am a third-year Computer Science student passionate about distributed systems and open source. Berlin\'s tech ecosystem aligns perfectly with my thesis on edge computing. I have contributed to two OSS projects and interned at a cloud startup. This exchange would let me study under Prof. Weber\'s lab while improving my German professional skills.',
      ai_score: 88,
      ai_verdict: 'green',
      ai_reason: 'Strong CS fit with excellent GPA and relevant technical experience for the Berlin programme.',
    },
    {
      full_name: 'Jordan Smith',
      email: 'jordan.smith.demo@student.edu',
      phone: '+1 555 0102',
      gpa: 2.4,
      language_level: 'A2',
      motivation:
        'I want to travel and experience Berlin nightlife. I think coding is cool and would like to try it abroad.',
      ai_score: 32,
      ai_verdict: 'red',
      ai_reason: 'Low GPA, weak language level, and motivation lacks academic or technical depth required.',
    },
    {
      full_name: 'Samira Patel',
      email: 'samira.patel.demo@student.edu',
      phone: '+44 555 0103',
      gpa: 3.5,
      language_level: 'B2',
      motivation:
        'My focus is machine learning and I have published a small paper on neural networks for healthcare. Berlin offers courses matching my ML track. I am eager to collaborate with European researchers and bring diverse perspectives to my home university.',
      ai_score: 79,
      ai_verdict: 'green',
      ai_reason: 'Solid academic profile with ML alignment and adequate language skills for the programme.',
    },
  ],
  [PARIS_SLUG]: [
    {
      full_name: 'Elena Rossi',
      email: 'elena.rossi.demo@student.edu',
      phone: '+39 555 0201',
      gpa: 3.6,
      language_level: 'B1',
      motivation:
        'As an architecture student I have spent two years developing sustainable housing concepts. Paris ateliers would refine my portfolio and expose me to European urban design. My drawings have won a regional student award and I am committed to community-focused architecture.',
      ai_score: 85,
      ai_verdict: 'green',
      ai_reason: 'Excellent creative background and motivation directly matches art and architecture requirements.',
    },
    {
      full_name: 'Chris Taylor',
      email: 'chris.taylor.demo@student.edu',
      phone: '+1 555 0202',
      gpa: 3.1,
      language_level: 'A1',
      motivation:
        'I am a business major but enjoy sketching on weekends. Paris seems beautiful and I would like to visit museums.',
      ai_score: 28,
      ai_verdict: 'red',
      ai_reason: 'Wrong academic background, no portfolio focus, and motivation does not meet programme criteria.',
    },
  ],
}

export async function ensureDemoLogin() {
  const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (signIn?.session) return signIn.session

  const { data: signUp, error: signUpError } = await supabase.auth.signUp({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    options: {
      data: { organization_name: 'Demo Exchange Organization', phone: '' },
    },
  })

  if (signUpError && !signUpError.message.includes('already')) {
    throw new Error(signUpError.message)
  }

  const { data: retry, error: retryError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (retryError) {
    throw new Error(`Demo login failed: ${retryError.message}`)
  }

  return retry.session
}

export async function seedDemoData(orgId) {
  const meta = { programmes: {}, berlinApplicationId: null, strongApplicationId: null }

  for (const prog of PROGRAMMES) {
    const { data: existing } = await supabase
      .from('programmes')
      .select('id, slug')
      .eq('org_id', orgId)
      .eq('slug', prog.slug)
      .maybeSingle()

    let programmeId = existing?.id

    if (!programmeId) {
      const { data: inserted, error } = await supabase
        .from('programmes')
        .insert({ ...prog, org_id: orgId })
        .select('id, slug')
        .single()

      if (error) throw new Error(error.message)
      programmeId = inserted.id
    }

    meta.programmes[prog.slug] = { id: programmeId, slug: prog.slug }

    for (const applicant of APPLICANTS[prog.slug]) {
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('programme_id', programmeId)
        .eq('email', applicant.email)
        .maybeSingle()

      if (existingApp) {
        if (prog.slug === BERLIN_SLUG && applicant.full_name === 'Alex Chen') {
          meta.berlinProgrammeId = programmeId
          meta.strongApplicationId = existingApp.id
        }
        continue
      }

      const { data: app, error: appError } = await supabase
        .from('applications')
        .insert({
          programme_id: programmeId,
          full_name: applicant.full_name,
          email: applicant.email,
          phone: applicant.phone,
          gpa: applicant.gpa,
          language_level: applicant.language_level,
          motivation: applicant.motivation,
          cv_url: null,
          status: 'applied',
          ai_score: applicant.ai_score,
          ai_verdict: applicant.ai_verdict,
          ai_reason: applicant.ai_reason,
        })
        .select('id')
        .single()

      if (appError) throw new Error(appError.message)

      if (prog.slug === BERLIN_SLUG && applicant.full_name === 'Alex Chen') {
        meta.berlinProgrammeId = programmeId
        meta.strongApplicationId = app.id
      }
    }
  }

  meta.berlinSlug = BERLIN_SLUG
  meta.parisSlug = PARIS_SLUG
  meta.berlinProgrammeId = meta.programmes[BERLIN_SLUG]?.id
  meta.parisProgrammeId = meta.programmes[PARIS_SLUG]?.id

  if (!meta.strongApplicationId && meta.berlinProgrammeId) {
    const { data: alex } = await supabase
      .from('applications')
      .select('id')
      .eq('programme_id', meta.berlinProgrammeId)
      .eq('email', 'alex.chen.demo@student.edu')
      .maybeSingle()
    meta.strongApplicationId = alex?.id
  }

  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(meta))
  return meta
}

export function getDemoMeta() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getBerlinApplyUrl() {
  return `${window.location.origin}/apply/${BERLIN_SLUG}`
}
