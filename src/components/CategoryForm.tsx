import { useState } from 'react'

const PALETTE = ['#e0524a', '#5b8def', '#3fbf7f', '#c88bf0', '#f0b429', '#4fd1c5', '#f472b6']

interface Props {
  onSubmit: (name: string, color: string) => void
  onCancel: () => void
}

export function CategoryForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(PALETTE[0])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim()) onSubmit(name.trim(), color)
      }}
      className="space-y-4"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none placeholder:text-neutral-600 focus:border-accent"
      />
      <div className="flex gap-2">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Pick color ${c}`}
            onClick={() => setColor(c)}
            className={`size-7 rounded-full transition ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Add category
        </button>
      </div>
    </form>
  )
}
