import type {ReportType} from "../Еnums/ReportType.ts";

/**
 * DTO для запроса на генерацию отчета с возможностью настройки полей.
 */
export interface GenerateReportRequest {
    projectId: number;
    stageId?: number;
    stageIds?: number[];
    reportType: ReportType;
    reportConfig?: string;
    targetFileName?: string;
}
