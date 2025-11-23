export interface GenerateReportRequest {
    projectId: number;
    stageId?: number;
    reportType: string;
    reportConfig?: string;
    targetFileName?: string;
}
