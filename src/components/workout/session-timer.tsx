'use client'

import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

function format(totalSeconds: number) {
  const s = Math.max(0, totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

/**
 * Ticking elapsed-time display for a live session. The server can only render
 * a frozen value, so the count is recomputed from startedAt in the browser.
 */
export function SessionTimer({ startedAt }: { startedAt: string }) {
  const startMs = new Date(startedAt).getTime()
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - startMs) / 1000)
  )

  useEffect(() => {
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startMs) / 1000)),
      1000
    )
    return () => clearInterval(id)
  }, [startMs])

  return (
    <span className="tabular inline-flex items-center gap-1.5">
      <Timer className="size-4" />
      {format(elapsed)}
    </span>
  )
}
