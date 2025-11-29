import {Button, Badge, Space} from "antd";
import type {MenuProps} from "antd";
import type {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";

import {getProjectStatusColor, getProjectStatusLabel} from "../../utils/getStatusConfig.ts";

import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import {ProjectStatus} from "../../models/DTOModels/Еnums/ProjectStatus.ts";

import {ProjectActionsDropdown} from "./ProjectActionsDropdown.tsx";

export interface IProjectActions {
    generateReport: () => Promise<void>;
    openReportsList: () => Promise<void>;
    addStage: () => Promise<void>;
    openStagesList: () => Promise<void>;
    delete: () => Promise<void>;
}

export const projectActionsItems = (actions: IProjectActions): MenuProps["items"] => [
    {key: "generateReport", label: "Сгенерировать отчёт", onClick: actions.generateReport},
    {key: "reportsList", label: "Список отчетов", onClick: actions.openReportsList},
    {key: "addStage", label: "Добавить этап", onClick: actions.addStage},
    {key: "stagesList", label: "Список этапов", onClick: actions.openStagesList},
    {key: "delete", label: "Удалить", onClick: actions.delete},
];

export const getColumns = (actions: IProjectActions): ColumnsType<ShortProjectResponse> => [
    {
        title: "Проект",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Дата начала",
        dataIndex: "startDate",
        key: "startDate",
        render: (date: string) => dayjs(date).format("DD.MM.YYYY")
    },
    {
        title: "Дата окончания",
        dataIndex: "endDate",
        key: "endDate",
        render: (date: string) => dayjs(date).format("DD.MM.YYYY")
    },
    {
        title: "Статус",
        dataIndex: "status",
        key: "status",
        render: (status: ProjectStatus) => {
            return <Badge color={getProjectStatusColor(status).color} text={getProjectStatusLabel(status)}/>;
        }
    },
    {
        title: "Действия",
        key: "actions",
        render: (_, record) => (
            <Space>
                <Button
                    type="link"
                    size="small"
                    onClick={() => window.location.href = `/projects/${record.projectId}`}
                >
                    Редактировать
                </Button>
                <ProjectActionsDropdown items={projectActionsItems(actions)} />
            </Space>
        )
    }
];
