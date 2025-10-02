export function convertDate(d: string | number | Date): number {
  if (d instanceof Date) return d.getTime();
  if (typeof d === "number") return d > 1e12 ? d : d * 1000;
  const s = d.trim();

  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();

  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // dd/mm/yyyy
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();

  m = s.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/); // mm-dd-yyyy or mm.dd.yyyy
  if (m) return new Date(+m[3], +m[1] - 1, +m[2]).getTime();

  return new Date(s).getTime();
}
