export interface StageResponse {
    stageId: number;
    projectId: number;
    projectName: string;
    name: string;
    stageType: string;
    progressPercent: number;
    status: string;
    deadline: Date | string;
    specialistUserFullName: string;
}
