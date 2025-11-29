export interface ProjectResponse {
    projectId: number;
    name: string;
    description: string;
    budget: number;
    startDate: Date | string;
    endDate: Date | string;
    status: string;
    stagesCount: number;
}
