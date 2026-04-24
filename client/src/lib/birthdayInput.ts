/**
 * 생일 입력: `20070123` 숫자 8자리, 또는 `2007-01-23` → API용 `YYYY-MM-DD` (KST 맞춤이 아니라 “월·일”만 쓰임, 연도는 서버가 참조년으로 맞춤)
 */
export function parseBirthdayInputToIso(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

export function isValidCalendarDateYmd(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const t = new Date(y, mo - 1, d);
  return t.getFullYear() === y && t.getMonth() === mo - 1 && t.getDate() === d;
}
