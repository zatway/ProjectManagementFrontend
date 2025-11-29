import {ReportStatus} from "../models/DTOModels/Еnums/ReportStatus.ts";

export const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
        case ReportStatus.Pending:
            return {color: "blue", text: "Pending"};
        case ReportStatus.InProgress:
            return {color: "gold", text: "In Progress"};
        case ReportStatus.Complete:
            return {color: "green", text: "Complete"};
        case ReportStatus.Failed:
            return {color: "red", text: "Failed"};
        default:
            return {color: "default", text: status};
    }
};
