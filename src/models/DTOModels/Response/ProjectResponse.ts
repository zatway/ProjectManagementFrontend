import type {ProjectStatus} from "../Еnums/ProjectStatus.ts";

export interface ProjectResponse {
    projectId: number;
    name: string;
    description: string;
    budget: number;
    startDate: Date;
    endDate: Date;
    status: ProjectStatus;
    stagesCount: number;
}
