import { Table } from "antd";
import {getColumns, type IProjectActions} from "./columns.tsx";
import type {FC} from "react";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortProjectResponse.ts";

interface ProjectTableProps {
    data: ShortProjectResponse[];
    actions: IProjectActions;
    loading?: boolean;
}

export const ProjectTable: FC<ProjectTableProps> = ({ data, actions, loading }) => {
    return (
        <Table
            columns={getColumns(actions)}
            dataSource={data}
            rowKey="projectId"
            loading={loading}
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
