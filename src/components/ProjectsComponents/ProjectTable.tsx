import { Table } from "antd";
import { getColumns } from "./columns.tsx";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import type {FC} from "react";

interface ProjectTableProps {
    data: ShortProjectResponse[]
}

export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
    return (
        <Table
            columns={getColumns()}
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
