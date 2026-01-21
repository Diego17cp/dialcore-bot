export type CacheEntry<T> = {
    data: T;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const getCache = <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}
export const setCache = <T>(key: string, data: T, ttlMs: number = 5 * 60_000): void => {
    const expiresAt = Date.now() + ttlMs;
    cache.set(key, { data, expiresAt });
}