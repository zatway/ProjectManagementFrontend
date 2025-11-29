import {useState, useRef, useEffect} from "react";
import {Layout, Typography} from "antd";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortReportResponse.ts";
import {HeaderActions} from "../HeaderActions/HeaderActions.tsx";
import {FiltersPanel} from "../ProjectsComponents/FiltersPanel.tsx";
import {ProjectTable} from "../ProjectsComponents/ProjectTable.tsx";
import {AddProjectModal} from "../ProjectsComponents/AddProjectModal.tsx";
import {projectApi} from "../../apis/projectsApi.ts";
import {hasValue} from "../../utils/hasValue.ts";
import type {CreateProjectRequest} from "../../models/DTOModels/Request/CreateProjectRequest.ts";

const {Header, Sider, Content} = Layout;
const {Title} = Typography;

const ProjectsPage = () => {
    const originalProjectsList = useRef<ShortProjectResponse[]>([]);
    const [filteredData, setFilteredData] = useState(originalProjectsList.current);

    const [isAddModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const res = await projectApi.getAllProjects();
        if (hasValue(res.data)) {
            originalProjectsList.current = res.data;
            setFilteredData(res.data);
        } else {
            originalProjectsList.current = [];
            setFilteredData([]);
        }
    }

    const createNewProject = async (newProject: CreateProjectRequest) => {
        const res = await projectApi.createProject(newProject);
        if (hasValue(res.data)) await fetchProjects();
        setAddModalOpen(false);
    }

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    backgroundColor: "#208100"
                }}
            >
                <div style={{display: "flex", alignItems: "center", justifyContent: 'flex-end'}}>
                    <Title level={3} style={{color: "white", margin: 0, marginRight: 24}}>
                        Панель проектов
                    </Title>

                    <HeaderActions
                        onNewProject={() => setAddModalOpen(true)}
                        onRefresh={() => setFilteredData([])}
                        onLogout={() => console.log("logout")}
                    />
                    <AddProjectModal
                        open={isAddModalOpen}
                        onCancel={() => setAddModalOpen(false)}
                        onSave={createNewProject}
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
                        filteredData={filteredData}
                        setFilteredData={setFilteredData}
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
                    <ProjectTable data={filteredData}/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProjectsPage;
