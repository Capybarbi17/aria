import { useState } from 'react'
import Button from '../ui/Button'

export default function SharePanel({ url, programmeTitle }) {
  const [copied, setCopied] = useState(false)

  const message = `Apply to ${programmeTitle}: ${url}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Application: ${programmeTitle}`)}&body=${encodeURIComponent(message)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Application link
        </p>
        <p className="mt-1 break-all text-sm font-medium text-indigo-700">{url}</p>
      </div>

      <Button type="button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy link'}
      </Button>

      <div className="grid gap-2 sm:grid-cols-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          WhatsApp
        </a>
        <a
          href={emailUrl}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Email
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Facebook
        </a>
      </div>

      <p className="text-center text-xs text-slate-500">
        Share this link on social media, email, or messaging — students apply without signing up.
      </p>
    </div>
  )
}
