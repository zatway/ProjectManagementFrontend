import type {ProjectStatus} from "../Еnums/ProjectStatus.ts";

export interface ShortProjectResponse {
    projectId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status: ProjectStatus;
}
