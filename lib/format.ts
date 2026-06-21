const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-06-12" -> "Jun 12" (no Date parsing — timezone-safe). */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  const mi = Number(m);
  const di = Number(d);
  if (!mi || !di) return iso;
  return `${MONTHS[mi - 1]} ${di}`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
