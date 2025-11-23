export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: string;
    budget?: number;
    startDate?: Date | string;
    endDate?: Date | string;
}
