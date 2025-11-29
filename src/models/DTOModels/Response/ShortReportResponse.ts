import type {ReportStatus} from "../Еnums/ReportStatus.ts";

export interface ShortProjectResponse {
    projectId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status: ReportStatus;
}
