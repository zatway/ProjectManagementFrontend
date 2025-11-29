import { Input, Select, DatePicker, Row, Col, Space, Button, Typography } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import { ProjectStatus } from "../../models/DTOModels/Еnums/ProjectStatus";
import { getProjectStatusLabel } from "../../utils/getStatusConfig";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface Props {
    search: string;
    status: ProjectStatus | undefined;
    dateRange: [Dayjs, Dayjs] | null;
    resultsCount: number;

    onSearch: (s: string) => void;
    onStatusChange: (s: ProjectStatus | undefined) => void;
    onDateChange: (d: [Dayjs, Dayjs] | null) => void;
    onClear: () => void;
}

export const FiltersPanel = ({
                                 search,
                                 status,
                                 dateRange,
                                 resultsCount,
                                 onSearch,
                                 onStatusChange,
                                 onDateChange,
                                 onClear
                             }: Props) => {
    return (
        <>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Input
                        placeholder="Поиск по названию проекта..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                    />
                </Col>

                <Col span={24}>
                    <Select
                        placeholder="Фильтр по статусу"
                        style={{ width: "100%" }}
                        value={status}
                        onChange={onStatusChange}
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
                        value={dateRange}
                        onChange={d => onDateChange(d ? [d[0]!, d[1]!] : null)}
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
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>Результаты: {resultsCount}</Text>

                    <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={onClear}
                        style={{ padding: 0 }}
                    >
                        Очистить фильтры
                    </Button>
                </Space>
            </div>
        </>
    );
};
