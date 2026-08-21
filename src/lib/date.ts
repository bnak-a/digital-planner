export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function toKey(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

/** The 42 cells of a month grid, starting on the Sunday of the first week. */
export function monthGrid(year: number, month: number): Date[] {
  const first = startOfWeek(new Date(year, month, 1))
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(first)
    d.setDate(first.getDate() + i)
    return d
  })
}

export function formatCellLabel(date: Date, month: number): string {
  const isFirstOfMonth = date.getDate() === 1
  if (isFirstOfMonth && date.getMonth() !== month) {
    return `${MONTHS[date.getMonth()].slice(0, 3)} 1`
  }
  return `${date.getDate()}`
}

export function longDate(date: Date): string {
  return `${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]} | ${
    MONTHS[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return toKey(a) === toKey(b)
}
