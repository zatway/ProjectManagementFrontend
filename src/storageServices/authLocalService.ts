import { localStorageCore } from "../storages/localStorageCore";
import type {UserRole} from "../models/DTOModels/Еnums/UserRole.ts";
import type {LoginResponse} from "../models/DTOModels/Response/LoginResponse.ts";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'userRole';
const FULL_NAME_ROLE_KEY = 'fullName';
const ID = 'id';

const keys = [TOKEN_KEY, REFRESH_TOKEN_KEY, ID];

export const authLocalService = {
    getToken: (): string | null => {
        return localStorageCore.getItem<string>(TOKEN_KEY);
    },
    getRefreshToken: (): string | null => {
        return localStorageCore.getItem<string>(REFRESH_TOKEN_KEY);
    },
    getUserId: (): number | null => {
        return localStorageCore.getItem<number>(ID);
    },
    getFullName: (): string | null => {
        return localStorageCore.getItem<string>(FULL_NAME_ROLE_KEY);
    },
    getUserRole: (): UserRole | null => {
        return localStorageCore.getItem<UserRole>(USER_ROLE_KEY);
    },
    clearIdentityData: (): void => {
        keys.forEach((key) => {
            localStorageCore.removeItem(key);
        });
    },
    hasAuthData: (): boolean => {
        return localStorageCore.hasItem(TOKEN_KEY) || localStorageCore.hasItem(USER_ROLE_KEY);
    },
    setIdentityData: (identityData: LoginResponse) => {
        Object.entries(identityData).forEach(([key, value]) => {
            localStorageCore.setItem(key, value);
        });
    },
};
