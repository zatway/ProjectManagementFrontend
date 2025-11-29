import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Tabs, Spin, Typography } from "antd";
import { projectApi } from "../../apis/projectsApi";
import type {ProjectResponse} from "../../models/DTOModels/Response/ProjectResponse.ts";

const { Title } = Typography;

const ProjectDetailsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            projectApi.getDetailsProject(Number(projectId)).then(res => {
                if (!res.error) setProject(res.data || null);
                setLoading(false);
            });
        }
    }, [projectId]);

    if (loading) return <Spin style={{ margin: "100px auto", display: "block" }} />;

    if (!project) return <Title level={3}>Проект не найден</Title>;

    return (
        <Layout style={{ minHeight: "100vh", padding: 24 }}>
            <Title level={2}>{project.name}</Title>

            <Tabs defaultActiveKey="project" type="card">
                <Tabs.TabPane tab="Проект" key="project">
                    <p><strong>Описание:</strong> {project.description}</p>
                    <p><strong>Бюджет:</strong> {project.budget}</p>
                    <p><strong>Статус:</strong> {project.status}</p>
                    {/*<p><strong>Дата начала:</strong> {project.startDate?.toLocaleDateString()}</p>*/}
                    {/*<p><strong>Дата окончания:</strong> {project.endDate?.toLocaleDateString()}</p>*/}
                    <p><strong>Этапов:</strong> {project.stagesCount}</p>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Этапы" key="stages">
                    {/* Тут можно подгружать список этапов */}
                    <p>Список этапов...</p>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Отчёты" key="reports">
                    {/* Тут можно подгружать отчёты проекта */}
                    <p>Список отчетов...</p>
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    );
};

export default ProjectDetailsPage;
