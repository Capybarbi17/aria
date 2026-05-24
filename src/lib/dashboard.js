export function daysUntilDeadline(deadline) {
  if (!deadline) return null
  const end = new Date(`${deadline}T23:59:59`)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}

export function deadlineTimelinePercent(programme) {
  if (!programme.deadline) return null
  const end = new Date(`${programme.deadline}T23:59:59`).getTime()
  const start = programme.created_at
    ? new Date(programme.created_at).getTime()
    : end - 180 * 24 * 60 * 60 * 1000
  const now = Date.now()
  if (end <= start) return 100
  const pct = ((now - start) / (end - start)) * 100
  return Math.min(100, Math.max(0, Math.round(pct)))
}

export function computeDashboardStats(programmes) {
  const allApps = programmes.flatMap((p) => p.applications ?? [])
  const totalApplicants = allApps.length
  const pendingReview = allApps.filter((a) => a.status === 'applied').length
  const analyzed = allApps.filter((a) => a.ai_verdict).length
  const engagementRate =
    totalApplicants > 0 ? Math.round((analyzed / totalApplicants) * 100) : 0

  return {
    totalProgrammes: programmes.length,
    totalApplicants,
    pendingReview,
    engagementRate,
  }
}

export function emailInitials(email) {
  if (!email) return '?'
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase() || '?'
}
