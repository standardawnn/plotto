// Dates shown in the prototype follow the real calendar (relative to today).
const DAYS = '일월화수목금토';
const pad = (n: number) => String(n).padStart(2, '0');
export function day(offset = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}
/** "10/25" */
export const mmdd = (o = 0) => { const d = day(o); return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`; };
/** "1025" */
export const mmddCompact = (o = 0) => { const d = day(o); return `${pad(d.getMonth() + 1)}${pad(d.getDate())}`; };
/** "토" */
export const weekday = (o = 0) => DAYS[day(o).getDay()];
/** "10/25 토" */
export const mmddDay = (o = 0) => `${mmdd(o)} ${weekday(o)}`;
/** "2026.10.25" */
export const dotted = (o = 0) => { const d = day(o); return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`; };
/** "10월 25일" */
export const korean = (o = 0) => { const d = day(o); return `${d.getMonth() + 1}월 ${d.getDate()}일`; };
