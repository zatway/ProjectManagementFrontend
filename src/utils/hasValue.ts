export const hasValue = <T>(v: T | null | undefined): v is NonNullable<T> =>
    v !== null && typeof v !== 'undefined' && (typeof v !== 'number' || !isNaN(v));
