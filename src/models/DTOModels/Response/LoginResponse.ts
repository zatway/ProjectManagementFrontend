export interface LoginResponse {
    id: number;
    token: string;
    refreshToken: string;
    fullName: string;
    userRole: string;
}
