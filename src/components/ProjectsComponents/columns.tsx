import {Button, Badge, Space, Popconfirm} from "antd";
import type {MenuProps} from "antd";
import type {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";

import {getProjectStatusColor, getProjectStatusLabel} from "../../utils/getStatusConfig.ts";

import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import {ProjectStatus} from "../../models/DTOModels/Еnums/ProjectStatus.ts";

import {ProjectActionsDropdown} from "./ProjectActionsDropdown.tsx";

export interface IProjectActions {
    openReportsList: (record: ShortProjectResponse) => Promise<void>;
    openStagesList: (record: ShortProjectResponse) => Promise<void>;
    delete: (record: ShortProjectResponse) => Promise<void>;
}

export const projectActionsItems = (actions: IProjectActions, record: ShortProjectResponse): MenuProps["items"] => [
    {key: "reportsList", label: "Список отчетов", onClick: () => actions.openReportsList(record)},
    {key: "stagesList", label: "Список этапов", onClick: () => actions.openStagesList(record)},
    {
        key: "delete",
        label: (
            <Popconfirm
                title="Удалить проект?"
                description={`Вы действительно хотите удалить проект "${record.name}"?`}
                okText="Да"
                cancelText="Отмена"
                onConfirm={() => actions.delete(record)}
            >
                <span onClick={(e: React.MouseEvent<HTMLSpanElement>) => e.stopPropagation()}
                      style={{color: "red"}}>Удалить</span>
            </Popconfirm>
        ),
    },
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
                <ProjectActionsDropdown items={projectActionsItems(actions, record)}/>
            </Space>
        )
    }
];
