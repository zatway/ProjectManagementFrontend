// ProjectDetailsPage.tsx
import {useParams} from "react-router-dom";
import {type FC, useEffect, useState} from "react";
import {Layout, Tabs, Spin, Typography, Button} from "antd";
import {projectApi} from "../../apis/projectsApi";
import type {ProjectResponse} from "../../models/DTOModels/Response/ProjectResponse.ts";
import ProjectHeader from "./ProjectHeader.tsx";
import ProjectInfo from "./ProjectInfo.tsx";
import StagesTable from "./StagesComponent/StagesTable.tsx";
import ReportsTable from "./ReportsComponents/ReportsTable.tsx";
import EditStageModal from "./StagesComponent/EditStageModal.tsx";
import GenerateReportModal from "./ReportsComponents/GenerateReportModal.tsx";
import EditProjectModal from "./EditProjectModal.tsx";

const {Header, Content} = Layout;
const {Title} = Typography;

interface ProjectDetailsPageProps {
    openedTab: 'projectDetails' | 'stagesList' | 'reportsList';
}

const ProjectDetailsPage: FC<ProjectDetailsPageProps> = ({openedTab}) => {
    const {projectId} = useParams<{ projectId: string }>();

    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(openedTab);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            setLoading(true);
            const res = await projectApi.getDetailsProject(Number(projectId));
            if (!res.error) setProject(res.data || null);
            setLoading(false);
        };
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        setActiveTab(openedTab);
    }, [openedTab]);

    if (loading) return <Spin style={{margin: "100px auto", display: "block"}}/>;
    if (!project) return <Title level={3}>Проект не найден</Title>;

    const tabs = [
        { key: "projectDetails", label: "Детали проекта", children: <ProjectInfo project={project} /> },
        { key: "stagesList", label: "Этапы", children: <StagesTable projectId={Number(projectId)} /> },
        { key: "reportsList", label: "Отчёты", children: <ReportsTable projectId={Number(projectId)} /> },
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", backgroundColor: "#208100"}}>
                <ProjectHeader />
                <Button onClick={() => window.location.href = "/ProjectsPage"}>Назад</Button>
            </Header>
            <Content style={{margin: 24, padding: 24, background: "#fff", borderRadius: 8}}>
                <Tabs
                    activeKey={activeTab}
                    onChange={key => setActiveTab(key as 'projectDetails' | 'stagesList' | 'reportsList')}
                    type="card"
                    items={tabs}
                />
            </Content>
        </Layout>
    );
};

export default ProjectDetailsPage;
