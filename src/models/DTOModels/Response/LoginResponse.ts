import type {UserRole} from "../Еnums/UserRole.ts";

export interface LoginResponse {
    id: number;
    token: string;
    refreshToken: string;
    fullName: string;
    userRole: UserRole;
}
