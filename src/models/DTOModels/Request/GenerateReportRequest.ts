import type {ReportType} from "../Еnums/ReportType.ts";

export interface GenerateReportRequest {
    projectId: number;
    stageId?: number;
    reportType: ReportType;
    reportConfig?: string;
    targetFileName?: string;
}
