import { Table } from "antd";
import {getColumns, type IProjectActions} from "./columns.tsx";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import type {FC} from "react";

interface ProjectTableProps {
    data: ShortProjectResponse[];
    actions: IProjectActions
}

export const ProjectTable: FC<ProjectTableProps> = ({ data, actions }) => {
    return (
        <Table
            columns={getColumns(actions)}
            dataSource={data}
            rowKey="projectId"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} из ${total} записей`
            }}
            scroll={{ x: 800 }}
        />
    );
};
