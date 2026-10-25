// "Today" is the real current date, so the schedule always opens on today.
export const projectToday = (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d })()

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

export function shiftDate(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getScheduleDates(selectedDate: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(selectedDate, index - 2)
    return {
      date,
      key: dateKey(date),
      label: `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
      weekday: weekdays[date.getDay()],
      isToday: dateKey(date) === dateKey(projectToday),
      isSelected: index === 2,
    }
  })
}

export function dayDifference(date: Date, reference: Date) {
  const toDay = (value: Date) =>
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / 86400000
  return toDay(date) - toDay(reference)
}
