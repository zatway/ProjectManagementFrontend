import {ReportStatus} from "../models/DTOModels/Еnums/ReportStatus.ts";
import {ProjectStatus} from "../models/DTOModels/Еnums/ProjectStatus.ts";
import {ReportType} from "../models/DTOModels/Еnums/ReportType.ts";
import {StageStatus} from "../models/DTOModels/Еnums/StageStatus.ts";
import {StageType} from "../models/DTOModels/Еnums/StageType.ts";

export const getReportStatusConfig = (status: ReportStatus) => {
    switch (status) {
        case ReportStatus.Pending:
            return {color: "blue", text: "Планирование"};
        case ReportStatus.InProgress:
            return {color: "gold", text: "В процессе"};
        case ReportStatus.Complete:
            return {color: "green", text: "Доступен для скачивания"};
        case ReportStatus.Failed:
            return {color: "red", text: "Ошибка генерации"};
        default:
            return {color: "default", text: status};
    }
};

export const getReportType = (type: ReportType) => {
    switch (type) {
        case ReportType.ExcelKpi:
            return 'Экспорт данных в Excel для KPI'
        case ReportType.PdfAct:
            return 'PDF-отчет по шаблону ГОСТ (Акт)'
    }
}

export const getProjectStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.Planning:
            return {color: "blue"};
        case ProjectStatus.Active:
            return {color: "green"};
        case ProjectStatus.OnHold:
            return {color: "red"};
        case ProjectStatus.Completed:
            return {color: "gray"};
        case ProjectStatus.Canceled:
            return {color: "red"};
        default:
            return {color: "default", text: status};
    }
};

export const getProjectStatusLabel = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.Planning:
            return 'Планирование';
        case ProjectStatus.Active:
            return 'В работе';
        case ProjectStatus.OnHold:
            return 'Приостановлено';
        case ProjectStatus.Completed:
            return 'Завершен';
        case ProjectStatus.Canceled:
            return 'Отменен';

    }
}

export const getStageStatusLabel = (stageStatus: StageStatus) => {
    switch (stageStatus) {
        case StageStatus.Pending:
            return 'Ожидает начала выполнения';
        case StageStatus.InProgress:
            return 'В процессе выполнения';
        case StageStatus.Completed:
            return 'Выполнено';
        case StageStatus.Delayed:
            return 'Просрочено';
    }
}

export const getStageTypeLabel = (stageType: StageType) => {
    switch (stageType) {
        case StageType.Exploration:
            return 'Изыскательские работы';
        case StageType.Design:
            return 'Проектирование';
        case StageType.Installation:
            return 'Монтажные работы';
        case StageType.Testing:
            return 'Тестирование и отладка';
    }
}
