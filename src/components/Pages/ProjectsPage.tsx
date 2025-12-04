import {useState, useRef, useEffect} from "react";
import {Layout, Typography, notification} from "antd";
import {HeaderActions} from "../HeaderActions/HeaderActions.tsx";
import {FiltersPanel} from "../ProjectsComponents/FiltersPanel.tsx";
import {ProjectTable} from "../ProjectsComponents/ProjectTable.tsx";
import {AddProjectModal} from "../ProjectsComponents/AddProjectModal.tsx";
import {projectApi} from "../../apis/projectsApi.ts";
import {notificationsApi} from "../../apis/notificationsApi.ts";
import {hasValue} from "../../utils/hasValue.ts";
import type {CreateProjectRequest} from "../../models/DTOModels/Request/CreateProjectRequest.ts";
import type {IProjectActions} from "../ProjectsComponents/columns.tsx";
import type {ShortProjectResponse} from "../../models/DTOModels/Response/ShortProjectResponse.ts";
import type {NotificationResponse} from "../../models/DTOModels/Response/SignalR/NotificationResponse.ts";
import {signalRService} from "../../signalR/SignalRService.ts";

const {Header, Sider, Content} = Layout;
const {Title} = Typography;

/**
 * Страница со списком проектов.
 * Загружает проекты и уведомления, поддерживает фильтры, сигналы SignalR и операции над проектами (создание/удаление).
 */
const ProjectsPage = () => {
    const originalProjectsList = useRef<ShortProjectResponse[]>([]);
    const [filteredData, setFilteredData] = useState(originalProjectsList.current);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isProjectsLoading, setIsProjectsLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
        fetchNotifications();

        const handleNotification = (newNotif: NotificationResponse) => {
            addNotification(newNotif);
            notification.open({
                title: newNotif.projectName ? `Project: ${newNotif.projectName}` : 'Notification',
                description: newNotif.message,
                placement: 'bottomRight',
                duration: 4.5,
            });
        };

        signalRService.on('ReceiveNotification', handleNotification);

        return () => {
            signalRService.off('ReceiveNotification', handleNotification);
        };
    }, []);

    const fetchProjects = async () => {
        setIsProjectsLoading(true);
        try {
            const res = await projectApi.getAllProjects();
            if (hasValue(res.data)) {
                originalProjectsList.current = res.data;
                setFilteredData(res.data);
            } else {
                originalProjectsList.current = [];
                setFilteredData([]);
            }
        } finally {
            setIsProjectsLoading(false);
        }
    };

    const fetchNotifications = async () => {
        const res = await notificationsApi.getNotifications();
        if (hasValue(res.data)) {
            const sorted = res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(sorted);
        } else {
            setNotifications([]);
        }
    };

    const createNewProject = async (newProject: CreateProjectRequest) => {
        const res = await projectApi.createProject(newProject);
        if (hasValue(res.data)) await fetchProjects();
        setAddModalOpen(false);
    };

    const markAsRead = async (notificationId: number) => {
        await notificationsApi.markAsRead(notificationId);
        setNotifications(prev => prev.map(n =>
            n.notificationId === notificationId ? { ...n, isRead: true } : n
        ));
    };

    const deleteNotification = async (notificationId: number) => {
        await notificationsApi.deleteNotification(notificationId);
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    };

    const addNotification = (newNotif: NotificationResponse) => {
        setNotifications(prev => {
            const exists = prev.some(n => n.notificationId === newNotif.notificationId);
            if (exists) return prev;
            return [newNotif, ...prev];
        });
    };

    const actionsItem: IProjectActions = {
        openReportsList: async (record) => {
            window.location.href = `/projects/${record.projectId}/reports`;
        },
        openStagesList: async (record) => {
            window.location.href = `/projects/${record.projectId}/stages`;
        },
        delete: async (record) => {
            const res = await projectApi.deleteProject(record.projectId);
            if (hasValue(res.data)) await fetchProjects();
        },
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

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
                <Title level={3} style={{color: "white", margin: 0, marginRight: 24}}>
                    Панель проектов
                </Title>
                <HeaderActions
                    onNewProject={() => setAddModalOpen(true)}
                    onRefresh={() => fetchProjects()}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    markAsRead={markAsRead}
                    deleteNotification={deleteNotification}
                />

                <AddProjectModal
                    open={isAddModalOpen}
                    onCancel={() => setAddModalOpen(false)}
                    onSave={createNewProject}
                />
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
                        originalData={originalProjectsList}
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
                    <ProjectTable data={filteredData} actions={actionsItem} loading={isProjectsLoading}/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProjectsPage;
