import { Button, Badge, Space } from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import {getProjectStatusColor, getProjectStatusLabel} from "../../utils/getStatusConfig";

import type { ShortProjectResponse } from "../../models/DTOModels/Response/ShortReportResponse";
import { ProjectStatus } from "../../models/DTOModels/Еnums/ProjectStatus";

import { ProjectActionsDropdown } from "../UI/ProjectActionsDropdown";

export const projectActionsItems: MenuProps["items"] = [
    { key: "download", label: "Скачать отчёт", onClick: () => {} },
    { key: "duplicate", label: "Дублировать", onClick: () => {} },
    { key: "delete", label: "Удалить", onClick: () => {} },
];

export const getColumns = (): ColumnsType<ShortProjectResponse> => [
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
            return <Badge color={getProjectStatusColor(status).color} text={getProjectStatusLabel(status)} />;
        }
    },
    {
        title: "Действия",
        key: "actions",
        render: () => (
            <Space>
                <Button type="link" size="small">Просмотр</Button>
                <Button type="link" size="small">Редактировать</Button>
                <ProjectActionsDropdown items={projectActionsItems} />
            </Space>
        )
    }
];
