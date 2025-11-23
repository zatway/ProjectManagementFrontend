export interface CreateStageRequest {
    name: string;
    stageType: string;
    progressPercent: number;
    deadline: Date | string;
    status: string;
    specialistUserId: number;
}
