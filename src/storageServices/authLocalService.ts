import { localStorageCore } from "../storages/localStorageCore";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'refresh_token';
const FULL_NAME_ROLE_KEY = 'refresh_token';
const ID = 'id';
const keys = [TOKEN_KEY, REFRESH_TOKEN_KEY, ID];

export const authLocalService = {
    getToken: (): string | null => {
        return localStorageCore.getItem<string>(TOKEN_KEY);
    },
    getUserId: (): number | null => {
        return localStorageCore.getItem<number>(ID);
    },
    getExpiredUtc: (): string | null => {
        return localStorageCore.getItem<string>(EXPIRED_UTC_KEY);
    },
    setUserRole: (role: string | UserRole): void => {
        localStorageCore.setItem(USER_ROLE_KEY, role);
    },
    getUserRoles: (): UserRole[] | null => {
        return localStorageCore.getItem<UserRole[]>(USER_ROLE_KEY);
    },
    clearIdentityData: (): void => {
        keys.forEach((key) => {
            localStorageCore.removeItem(key);
        });
    },
    hasAuthData: (): boolean => {
        return localStorageCore.hasItem(TOKEN_KEY) || localStorageCore.hasItem(USER_ROLE_KEY);
    },
    setIdentityData: (identityData: IToken) => {
        Object.entries(identityData).forEach(([key, value]) => {
            localStorageCore.setItem(key, value);
        });
    },
};
