export interface CreateProjectRequest {
    name: string;
    description: string;
    budget: number;
    startDate: Date | string;
    endDate: Date | string;
}
