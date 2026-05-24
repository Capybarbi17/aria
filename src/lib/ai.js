export const GREEN_SCORE_THRESHOLD = 70
const MODEL = 'gpt-4o-mini'

const SYSTEM_PROMPT =
  'You are an expert academic coordinator. Evaluate student applications fairly and objectively against programme requirements. Always respond with valid JSON only.'

const PROGRAMME_EXTRACT_SYSTEM =
  'You extract structured exchange programme listing fields from unstructured text such as calls for applications, brochures, or emails. Always respond with valid JSON only.'

function buildCandidatePrompt(programme, applicant) {
  return `PROGRAMME: ${programme.title}
LOCATION: ${programme.location}
REQUIREMENTS: ${programme.requirements}

APPLICANT:
${JSON.stringify(
  {
    name: applicant.full_name,
    email: applicant.email,
    motivation: applicant.motivation,
    gpa: applicant.gpa,
    language_level: applicant.language_level,
    cv_uploaded: !!applicant.cv_url,
  },
  null,
  2
)}

Return JSON with exactly these keys: "score" (number 0-100) and "reason" (one sentence string).
Score 0-100 where 100 is an excellent match for the requirements.`
}

function parseJsonFromText(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : trimmed
  return JSON.parse(raw)
}

export function scoreToVerdict(score) {
  return score >= GREEN_SCORE_THRESHOLD ? 'green' : 'red'
}

function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_OPENAI_API_KEY to your .env file to use AI features.')
  }
  return apiKey
}

async function chatCompletionJson({ system, user, maxTokens }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || `API error (${response.status})`
    throw new Error(message)
  }

  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from AI.')

  return parseJsonFromText(text)
}

function buildProgrammeExtractPrompt(rawText) {
  return `Extract exchange programme listing fields from the text below.

TEXT:
"""
${rawText.trim()}
"""

Return JSON with exactly these keys:
- "title" (string): programme name
- "location" (string): destination city and/or country
- "description" (string): what the exchange offers — duration, benefits, overview
- "requirements" (string): ideal candidate criteria (GPA, field, languages, skills) — used later to score applicants
- "deadline" (string or null): application deadline as YYYY-MM-DD if a date is mentioned, otherwise null

Infer missing details reasonably from context. Keep requirements detailed enough for AI applicant review.`
}

function normalizeDeadline(value) {
  if (!value || value === 'null') return ''
  const str = String(value).trim()
  if (!str) return ''
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const parsed = new Date(str)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

export async function extractProgrammeFromText(rawText) {
  if (!rawText?.trim()) {
    throw new Error('Paste your programme call or announcement first.')
  }

  const parsed = await chatCompletionJson({
    system: PROGRAMME_EXTRACT_SYSTEM,
    user: buildProgrammeExtractPrompt(rawText),
    maxTokens: 1024,
  })

  const title = String(parsed.title || '').trim()
  const location = String(parsed.location || '').trim()
  const description = String(parsed.description || '').trim()
  const requirements = String(parsed.requirements || '').trim()
  const deadline = normalizeDeadline(parsed.deadline)

  if (!title || !location) {
    throw new Error(
      'Could not find a programme title and location. Add more detail or use the manual form.'
    )
  }

  return {
    title,
    location,
    description,
    requirements,
    deadline,
  }
}

export async function analyzeCandidate(programme, applicant) {
  const parsed = await chatCompletionJson({
    system: SYSTEM_PROMPT,
    user: buildCandidatePrompt(programme, applicant),
    maxTokens: 256,
  })

  const score = Math.min(100, Math.max(0, Number(parsed.score)))
  if (Number.isNaN(score)) throw new Error('AI returned an invalid score.')

  return {
    score,
    verdict: scoreToVerdict(score),
    reason: String(parsed.reason || 'No reason provided.').trim(),
  }
}
