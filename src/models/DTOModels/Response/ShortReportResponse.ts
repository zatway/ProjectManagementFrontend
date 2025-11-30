import type {ReportType} from "../Еnums/ReportType.ts";
import type {ReportStatus} from "../Еnums/ReportStatus.ts";

export interface ShortReportResponse {
    reportId: number;
    projectName: string;
    reportType: ReportType;
    generatedAt: Date;
    status: ReportStatus;
    targetFileName?: string;
}
