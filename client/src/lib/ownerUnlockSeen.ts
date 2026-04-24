const STORAGE_PREFIX = "onlyday_owner_unlock_seen_";

export function getOwnerSeenUnlockKeys(cakeId: string): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + cakeId);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function addOwnerSeenUnlockKey(cakeId: string, featureKey: string) {
  const s = getOwnerSeenUnlockKeys(cakeId);
  s.add(featureKey);
  localStorage.setItem(STORAGE_PREFIX + cakeId, JSON.stringify(Array.from(s)));
}
