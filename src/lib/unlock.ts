const STORAGE_KEY = "wedding-quest-pokedex-progress";

type StoredProgress = {
  unlockedEntryIds: string[];
  lastScannedAt?: string;
};

export function loadUnlockedIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredProgress;
    return Array.isArray(parsed.unlockedEntryIds) ? parsed.unlockedEntryIds : [];
  } catch {
    return [];
  }
}

export function persistUnlockedIds(unlockedEntryIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredProgress = {
    unlockedEntryIds,
    lastScannedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetUnlockedIds() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
