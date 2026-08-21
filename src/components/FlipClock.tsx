import { useEffect, useState } from 'react'
import { longDate } from '../lib/date'

function Card({ value }: { value: string }) {
  return (
    <div className="relative rounded-md bg-neutral-100 px-2 py-1 font-mono text-4xl font-bold tracking-tight text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.5)] tabular-nums">
      <span className="absolute inset-x-0 top-1/2 h-px bg-neutral-400/60" />
      {value}
    </div>
  )
}

export function FlipClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours24 = now.getHours()
  const hours = `${hours24 % 12 === 0 ? 12 : hours24 % 12}`.padStart(2, '0')
  const minutes = `${now.getMinutes()}`.padStart(2, '0')
  const seconds = `${now.getSeconds()}`.padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-1">
        <Card value={hours} />
        <span className="pb-2 text-2xl font-bold text-neutral-500">:</span>
        <Card value={minutes} />
        <span className="pb-2 text-2xl font-bold text-neutral-500">:</span>
        <Card value={seconds} />
        <div className="ml-1 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs font-bold text-neutral-900">
          {hours24 >= 12 ? 'PM' : 'AM'}
        </div>
      </div>
      <p className="text-sm font-semibold text-neutral-200">{longDate(now)}</p>
    </div>
  )
}
