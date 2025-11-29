import {useState, type FC, useEffect} from "react";
import {Layout, Table, Button, Input, Select, DatePicker, Badge, Space, Avatar, Typography, Menu, Dropdown, Row, Col} from "antd";
import type {ColumnsType} from "antd/es/table";
import {LogoutOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, DownOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import { ReportStatus } from "../models/DTOModels/Еnums/ReportStatus";
import type { ShortProjectResponse } from "../models/DTOModels/Response/ShortReportResponse";
import {getStatusConfig} from "../utils/getStatusConfig.ts";

const {Header, Sider, Content} = Layout;
const {Title, Text} = Typography;
const {RangePicker} = DatePicker;
const {Option} = Select;

const mockData: ShortProjectResponse[] = [
    {
        projectId: 1,
        name: "Проект Альфа",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-06-30"),
        status: ReportStatus.Pending,
    },
    {
        projectId: 2,
        name: "Проект Бета",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-07-15"),
        status: ReportStatus.InProgress,
    },
    {
        projectId: 3,
        name: "Проект Гамма",
        startDate: new Date("2025-03-10"),
        endDate: new Date("2025-08-20"),
        status: ReportStatus.Complete,
    },
];

const MainPage: FC = () => {
    const [data, setData] = useState<ShortProjectResponse[]>(mockData);
    const [filteredData, setFilteredData] = useState<ShortProjectResponse[]>(mockData);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

    useEffect(() => {
        // Симуляция загрузки данных; замените на реальный fetch
        setData(mockData);
        setFilteredData(mockData);
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterData(value, statusFilter, dateRange);
    };

    const handleStatusFilter = (value: ReportStatus | undefined) => {
        setStatusFilter(value);
        filterData(searchTerm, value, dateRange);
    };

    const handleDateFilter = (dates: [Dayjs, Dayjs] | null) => {
        setDateRange(dates);
        filterData(searchTerm, statusFilter, dates);
    };

    const filterData = (search: string, status?: ReportStatus, dates?: [Dayjs, Dayjs] | null) => {
        let filtered = [...data];

        if (search) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (status) {
            filtered = filtered.filter(item => item.status === status);
        }

        if (dates) {
            const [startDateFilter, endDateFilter] = dates;
            filtered = filtered.filter(item => {
                const start = dayjs(item.startDate);
                // Исправлено: включение границ дат
                return !start.isBefore(startDateFilter) && !start.isAfter(endDateFilter);
            });
        }

        setFilteredData(filtered);
    };

    const handleLogout = () => {
        // Реализуйте логику выхода, например, dispatch action или navigate
        console.log("Нажата кнопка выхода");
    };

    const handleNewProject = () => {
        // Реализуйте логику создания нового проекта
        console.log("Нажата кнопка 'Новый проект'");
    };

    const handleRefresh = () => {
        // Реализуйте логику обновления, например, повторный fetch данных
        setFilteredData(data);
        console.log("Нажата кнопка обновления");
    };

    const columns: ColumnsType<ShortProjectResponse> = [
        {
            title: "Проект",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: ShortProjectResponse) => (
                <Space>
                    <Avatar size={32} style={{backgroundColor: "#208100"}}>П</Avatar>
                    <div>
                        <Title level={5} style={{margin: 0}}>{name}</Title>
                        <Text type="secondary">ID: {record.projectId}</Text>
                    </div>
                </Space>
            ),
            width: 250,
        },
        {
            title: "Дата начала",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: Date) => dayjs(date).format("DD.MM.YYYY"),
            width: 120,
        },
        {
            title: "Дата окончания",
            dataIndex: "endDate",
            key: "endDate",
            render: (date: Date) => dayjs(date).format("DD.MM.YYYY"),
            width: 120,
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status: ReportStatus) => {
                const config = getStatusConfig(status);
                return <Badge color={config.color} text={config.text} />;
            },
            width: 120,
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: any, record: ShortProjectResponse) => (
                <Space size="middle">
                    <Button type="link" size="small">Просмотр</Button>
                    <Button type="link" size="small">Редактировать</Button>
                    <Dropdown
                        overlay={
                            <Menu
                                items={[
                                    {key: "1", label: "Скачать отчет"},
                                    {key: "2", label: "Дублировать"},
                                    {key: "3", label: "Удалить"},
                                ]}
                            />
                        }
                        trigger={["click"]}
                    >
                        <Button type="link" size="small">
                            Ещё <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            ),
            width: 200,
        },
    ];

    const headerMenu = (
        <Menu mode="horizontal" style={{lineHeight: "48px"}}>
            <Menu.Item key="new" icon={<PlusOutlined />} onClick={handleNewProject}>
                Новый проект
            </Menu.Item>
            <Menu.Item key="refresh" icon={<ReloadOutlined />} onClick={handleRefresh}>
                Обновить
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", backgroundColor: "#208100"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Title level={3} style={{color: "white", margin: 0, marginRight: 24}}>Панель проектов</Title>
                    <Dropdown overlay={headerMenu} placement="bottomRight">
                        <Button type="text" style={{color: "white"}}>
                            Действия <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <Button type="text" icon={<LogoutOutlined />} style={{color: "white"}} onClick={handleLogout}>
                    Выход
                </Button>
            </Header>
            <Layout>
                <Sider width={300} style={{background: "#fff", padding: "24px", borderRight: "1px solid #f0f0f0", boxShadow: "2px 0 8px rgba(0,0,0,0.05)"}}>
                    <Title level={4} style={{marginBottom: 24, color: "#208100"}}>Поиск и фильтры</Title>
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Input
                                placeholder="Поиск по названию проекта..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Col>
                        <Col span={24}>
                            <Select
                                placeholder="Фильтр по статусу"
                                style={{width: "100%"}}
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                allowClear
                            >
                                {Object.values(ReportStatus).map(status => (
                                    <Option key={status} value={status}>{status}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={24}>
                            <RangePicker
                                style={{width: "100%"}}
                                value={dateRange}
                                onChange={data => handleDateFilter([data![0]!, data![1]!])}
                                placeholder={["Дата начала", "Дата окончания"]}
                                format="DD.MM.YYYY"
                            />
                        </Col>
                    </Row>
                    <div style={{marginTop: 24, padding: "16px", background: "#f5f5f5", borderRadius: 6, border: "1px solid #d9d9d9"}}>
                        <Space direction="vertical" style={{width: "100%"}}>
                            <Text strong>Результаты: {filteredData.length}</Text>
                            <Button
                                type="link"
                                icon={<FilterOutlined />}
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter(undefined);
                                    setDateRange(null);
                                    setFilteredData(data);
                                }}
                                style={{padding: 0}}
                            >
                                Очистить фильтры
                            </Button>
                        </Space>
                    </div>
                </Sider>
                <Layout style={{padding: "24px", background: "#f0f2f5"}}>
                    <Content style={{background: "#fff", borderRadius: 6, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="projectId"
                            pagination={{pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} записей`}}
                            scroll={{x: 800}}
                        />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainPage;
