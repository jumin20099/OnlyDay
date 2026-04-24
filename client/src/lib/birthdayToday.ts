/** 케이크 `birthday` (YYYY-MM-DD, 연도는 참고용)의 월·일이 지금 KST 달력과 같은지 */
export function isCakeBirthdayTodayKst(cakeBirthdayYmd: string): boolean {
  const p = cakeBirthdayYmd.trim().split("-").map((x) => Number(x));
  if (p.length < 3 || p.some((n) => Number.isNaN(n))) return false;
  const month = p[1];
  const day = p[2];
  const kstYmd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [, mk, dk] = kstYmd.split("-").map(Number);
  return mk === month && dk === day;
}
