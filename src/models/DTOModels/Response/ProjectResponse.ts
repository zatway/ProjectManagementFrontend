import type {ProjectStatus} from "../Еnums/ProjectStatus.ts";

export interface ProjectResponse {
    projectId: number;
    name: string;
    description: string;
    budget: number;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    stagesCount: number;
}
