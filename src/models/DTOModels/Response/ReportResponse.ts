import type {ReportType} from "../Еnums/ReportType.ts";
import type {ReportStatus} from "../Еnums/ReportStatus.ts";

export interface ReportResponse {
    reportId: number;
    projectId: number;
    reportType: ReportType;
    status: ReportStatus;
    generatedAt: string;
    projectName: string;
}
