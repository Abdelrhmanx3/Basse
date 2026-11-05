export type PersistedSnapshot<T> = {
  value: T;
  isHydrated: boolean;
};

export function createPersistedStore<T>(
  key: string,
  initialValue: T,
  parseValue: (value: unknown) => T,
) {
  const serverSnapshot: PersistedSnapshot<T> = {
    value: initialValue,
    isHydrated: false,
  };
  const listeners = new Set<() => void>();
  let snapshot: PersistedSnapshot<T> | null = null;

  const getSnapshot = (): PersistedSnapshot<T> => {
    if (typeof window === "undefined") return serverSnapshot;
    if (snapshot) return snapshot;

    let value = initialValue;
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) value = parseValue(JSON.parse(storedValue));
    } catch (error) {
      console.error(`Unable to restore "${key}" from localStorage.`, error);
    }
    snapshot = { value, isHydrated: true };
    return snapshot;
  };

  const getServerSnapshot = () => serverSnapshot;

  const emitChange = () => {
    for (const listener of listeners) listener();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== key && event.key !== null) return;
    snapshot = null;
    emitChange();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (listeners.size === 1 && typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  };

  const update = (updater: (currentValue: T) => T) => {
    const value = updater(getSnapshot().value);
    snapshot = { value, isHydrated: true };

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save "${key}" to localStorage.`, error);
    }
    emitChange();
  };

  return { getSnapshot, getServerSnapshot, subscribe, update };
}
