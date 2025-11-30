import type {UserRole} from "../Еnums/UserRole.ts";

export interface RegisterRequest {
    username: string;
    password: string;
    role: UserRole;
    fullName: string;
}
