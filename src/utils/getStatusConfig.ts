import {ReportStatus} from "../models/DTOModels/Еnums/ReportStatus.ts";
import {ProjectStatus} from "../models/DTOModels/Еnums/ProjectStatus.ts";

export const getReportStatusColor = (status: ReportStatus) => {
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
