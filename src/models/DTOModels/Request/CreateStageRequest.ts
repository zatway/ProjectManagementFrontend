export interface CreateStageRequest {
    name: string;
    stageType: string;
    progressPercent: number;
    deadline: string;
    status: string;
    specialistUserId: number;
}
