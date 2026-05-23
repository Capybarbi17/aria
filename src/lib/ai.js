export const GREEN_SCORE_THRESHOLD = 70
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT =
  'You are an expert academic coordinator. Evaluate student applications fairly and objectively against programme requirements.'

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

Return ONLY valid JSON. No explanation. No markdown. No preamble.
Format: {"score":85,"reason":"One sentence justification."}
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

export async function analyzeCandidate(programme, applicant) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_ANTHROPIC_API_KEY to your .env file to use AI analysis.')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildCandidatePrompt(programme, applicant) }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data?.error?.message || `API error (${response.status})`
    throw new Error(message)
  }

  const text = data?.content?.[0]?.text
  if (!text) throw new Error('Empty response from AI.')

  const parsed = parseJsonFromText(text)
  const score = Math.min(100, Math.max(0, Number(parsed.score)))
  if (Number.isNaN(score)) throw new Error('AI returned an invalid score.')

  return {
    score,
    verdict: scoreToVerdict(score),
    reason: String(parsed.reason || 'No reason provided.').trim(),
  }
}
