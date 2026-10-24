const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 86_400_000;

/** Parses `yyyy-mm` or `yyyy-mm-dd` as a UTC date. */
function parse(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

const label = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

export function formatRange(start: string, end?: string | null): string {
  return `${label(parse(start))} to ${end ? label(parse(end)) : "now"}`;
}

export function formatDuration(start: string, end?: string | null): string {
  const to = end ? parse(end).getTime() : Date.now();
  const days = Math.max(1, Math.round((to - parse(start).getTime()) / DAY));
  if (days < 84) {
    const weeks = Math.max(1, Math.round(days / 7));
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  const months = Math.round(days / 30.44);
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = `${years} ${years === 1 ? "year" : "years"}`;
  return rest ? `${y} ${rest} ${rest === 1 ? "month" : "months"}` : y;
}

export function ageFrom(dob: string, now = new Date()): number {
  const b = parse(dob);
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < b.getUTCMonth() ||
    (now.getUTCMonth() === b.getUTCMonth() && now.getUTCDate() < b.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export const startTime = (value: string) => parse(value).getTime();
