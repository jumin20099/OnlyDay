const STORAGE_PREFIX = "onlyday_my_letter_";

export type MyLetterRecord = {
  ordinal: number;
  savedAt: string;
};

export function getMyLetter(shareToken: string): MyLetterRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + shareToken);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as MyLetterRecord).ordinal === "number" &&
      typeof (parsed as MyLetterRecord).savedAt === "string"
    ) {
      return parsed as MyLetterRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export function setMyLetter(shareToken: string, ordinal: number) {
  try {
    const record: MyLetterRecord = {
      ordinal,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_PREFIX + shareToken, JSON.stringify(record));
  } catch {
    /* localStorage 비활성 또는 quota 초과 시 무시 */
  }
}
