import { useState, useEffect } from "react";
import { Layout, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import {ProjectStatus} from "../../models/DTOModels/Еnums/ProjectStatus.ts";
import {HeaderActions} from "../HeaderActions/HeaderActions.tsx";
import {FiltersPanel} from "../FiltersPanel/FiltersPanel.tsx";
import {ProjectTable} from "../ProjectTable/ProjectTable.tsx";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const mockData: ShortProjectResponse[] = [
    {
        projectId: 1,
        name: "Проект Альфа",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-06-30"),
        status: ProjectStatus.Planning,
    },
    {
        projectId: 2,
        name: "Проект Бета",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-07-15"),
        status: ProjectStatus.Active,
    },
    {
        projectId: 3,
        name: "Проект Гамма",
        startDate: new Date("2025-03-10"),
        endDate: new Date("2025-08-20"),
        status: ProjectStatus.Completed,
    },
];

const MainPage = () => {
    const [data, setData] = useState(mockData);
    const [filteredData, setFilteredData] = useState(mockData);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
    const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);

    useEffect(() => {
        setData(mockData);
        setFilteredData(mockData);
    }, []);

    const filterData = (
        s = search,
        st = status,
        d = dates
    ) => {
        let filtered = [...data];

        if (s) filtered = filtered.filter(p => p.name.toLowerCase().includes(s.toLowerCase()));

        if (st) filtered = filtered.filter(p => p.status === st);

        if (d) {
            const [start, end] = d;
            filtered = filtered.filter(p => {
                const ds = dayjs(p.startDate);
                return !ds.isBefore(start) && !ds.isAfter(end);
            });
        }

        setFilteredData(filtered);
    };

    const onSearch = (s: string) => {
        setSearch(s);
        filterData(s, status, dates);
    };

    const onStatus = (st?: ProjectStatus) => {
        setStatus(st);
        filterData(search, st, dates);
    };

    const onDates = (d: [Dayjs, Dayjs] | null) => {
        setDates(d);
        filterData(search, status, d);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus(undefined);
        setDates(null);
        setFilteredData(data);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    backgroundColor: "#208100"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
                    <Title level={3} style={{ color: "white", margin: 0, marginRight: 24 }}>
                        Панель проектов
                    </Title>

                    <HeaderActions
                        onNewProject={() => console.log("create")}
                        onRefresh={() => setFilteredData(data)}
                        onLogout={() => console.log("logout")}
                    />
                </div>
            </Header>

            <Layout>
                <Sider
                    width={300}
                    style={{
                        background: "#fff",
                        padding: "24px",
                        borderRight: "1px solid #f0f0f0"
                    }}
                >
                    <FiltersPanel
                        search={search}
                        status={status}
                        dateRange={dates}
                        resultsCount={filteredData.length}
                        onSearch={onSearch}
                        onStatusChange={onStatus}
                        onDateChange={onDates}
                        onClear={clearFilters}
                    />
                </Sider>

                <Content
                    style={{
                        margin: "24px",
                        background: "#fff",
                        borderRadius: 6,
                        padding: "16px"
                    }}
                >
                    <ProjectTable data={filteredData} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainPage;
