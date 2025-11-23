export const localStorageCore = {
    setItem<T>(key: string, value: T): void {
        if (value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    getItem<T>(key: string): T | null {
        const value = localStorage.getItem(key);
        if (value === null) {
            return null;
        }
        try {
            return JSON.parse(value) as T;
        } catch (error) {
            console.error('Error parsing localStorage item:', error);
            return null;
        }
    },

    removeItem(key: string): void {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    },

    clear(): void {
        localStorage.clear();
    },

    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    },

    getItemWithDefault<T>(key: string, defaultValue: T): T {
        const value = localStorageCore.getItem<T>(key);
        return value !== null ? value : defaultValue;
    },

    setMultipleItems(items: Record<string, unknown>): void {
        for (const [key, value] of Object.entries(items)) {
            localStorageCore.setItem(key, value);
        }
    },

    getMultipleItems<T>(keys: string[]): Record<string, T | null> {
        const result: Record<string, T | null> = {};
        for (const key of keys) {
            result[key] = localStorageCore.getItem<T>(key);
        }
        return result;
    },

    setItemWithExpiry<T>(key: string, value: T, ttl: number): void {
        const expiryItem = {
            value,
            expiry: Date.now() + ttl,
        };
        localStorageCore.setItem(key, expiryItem);
    },

    getItemWithExpiry<T>(key: string): T | null {
        const item = localStorageCore.getItem<{ value: T; expiry: number }>(key);
        if (!item) {
            return null;
        }
        if (Date.now() > item.expiry) {
            localStorageCore.removeItem(key);
            return null;
        }
        return item.value;
    },

    getAllKeys(): string[] {
        return Object.keys(localStorage);
    },
};
