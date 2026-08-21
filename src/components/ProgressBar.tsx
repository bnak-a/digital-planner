export function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-36 rounded-sm border-2 border-neutral-100 bg-neutral-900 p-[3px]">
        <div
          className="h-full rounded-[2px] bg-neutral-100 transition-[width] duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-neutral-300">
        {label}: {value}%
      </span>
    </div>
  )
}
