import { Input, Select, DatePicker, Row, Col, Space, Button, Typography } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { ProjectStatus } from "../../models/DTOModels/Еnums/ProjectStatus.ts";
import { getProjectStatusLabel } from "../../utils/getStatusConfig.ts";
import {type FC, useState} from "react";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface FiltersPanelProps {
    filteredData: ShortProjectResponse[]
    setFilteredData: (filteredData: ShortProjectResponse[]) => void;
}

export const FiltersPanel: FC<FiltersPanelProps> = ({setFilteredData, filteredData}) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
    const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);

    const filterData = () => {
        let filtered = [...filteredData];

        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

        if (status) filtered = filtered.filter(p => p.status === status);

        if (dates) {
            const [start, end] = dates;
            filtered = filtered.filter(p => {
                const ds = dayjs(p.startDate);
                return !ds.isBefore(start) && !ds.isAfter(end);
            });
        }

        setFilteredData(filtered);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus(undefined);
        setDates(null);
        setFilteredData([]);
    };

    return (
        <>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Input
                        placeholder="Поиск по названию проекта..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            filterData();
                        }}
                    />
                </Col>

                <Col span={24}>
                    <Select
                        placeholder="Фильтр по статусу"
                        style={{ width: "100%" }}
                        value={status}
                        onChange={value => {
                            setStatus(value as ProjectStatus);
                            filterData();
                        }}
                        allowClear
                    >
                        {Object.values(ProjectStatus).map(v => (
                            <Select.Option key={v} value={v}>
                                {getProjectStatusLabel(v)}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>

                <Col span={24}>
                    <RangePicker
                        style={{ width: "100%" }}
                        value={dates}
                        onChange={d => setDates(d ? [d[0]!, d[1]!] : null)}
                        format="DD.MM.YYYY"
                        placeholder={["Дата начала", "Дата окончания"]}
                    />
                </Col>
            </Row>

            <div
                style={{
                    marginTop: 24,
                    padding: "16px",
                    background: "#f5f5f5",
                    borderRadius: 6,
                    border: "1px solid #d9d9d9"
                }}
            >
                <Space style={{ width: "100%" }}>
                    <Text strong>Результаты: {filteredData.length}</Text>

                    <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={clearFilters}
                        style={{ padding: 0 }}
                    >
                        Очистить фильтры
                    </Button>
                </Space>
            </div>
        </>
    );
};
