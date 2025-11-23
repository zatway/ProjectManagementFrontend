export interface UpdateStageRequest {
    progressPercent?: number;
    deadline?: Date | string;
    status?: string;
    specialistUserId?: number;
}
