import {ReportStatus} from "../../models/DTOModels/Еnums/ReportStatus.ts";

export const useLocalizedStatus = () => {
    const map: Record<ReportStatus, string> = {
        [ReportStatus.Pending]: "Ожидает",
        [ReportStatus.InProgress]: "В процессе",
        [ReportStatus.Complete]: "Готово",
        [ReportStatus.Failed]: "Ошибка",
    };

    const getStatusText = (status: ReportStatus): string => map[status];

    const getStatusOptions = () =>
        Object.values(ReportStatus).map((s) => ({
            value: s,
            label: map[s],
        }));

    return {
        map,
        getStatusText,
        getStatusOptions,
    };
};
