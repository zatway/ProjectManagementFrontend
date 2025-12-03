import {useParams} from "react-router-dom";
import {type FC, useEffect, useState} from "react";
import {Layout, Tabs, Spin, Button, Result, notification} from "antd";
import {projectApi} from "../../apis/projectsApi";
import type {ProjectResponse} from "../../models/DTOModels/Response/ProjectResponse.ts";
import ProjectHeader from "./ProjectHeader.tsx";
import ProjectInfo from "./ProjectInfo.tsx";
import StagesTable from "./StagesComponent/StagesTable.tsx";
import ReportsTable from "./ReportsComponents/ReportsTable.tsx";
import type {NotificationResponse} from "../../models/DTOModels/Response/SignalR/NotificationResponse.ts";
import {notificationsApi} from "../../apis/notificationsApi.ts";
import {hasValue} from "../../utils/hasValue.ts";
import {signalRService} from "../../signalR/SignalRService.ts";
import {HeaderActions} from "../HeaderActions/HeaderActions.tsx";

const {Header, Content} = Layout;

interface ProjectDetailsPageProps {
    openedTab: 'projectDetails' | 'stagesList' | 'reportsList';
}

const ProjectDetailsPage: FC<ProjectDetailsPageProps> = ({openedTab}) => {
    const {projectId} = useParams<{ projectId: string }>();

    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(openedTab);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

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
        const fetchNotifications = async () => {
            const res = await notificationsApi.getNotifications();
            if (hasValue(res.data)) {
                const sorted = res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setNotifications(sorted);
            } else {
                setNotifications([]);
            }
        };

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

    useEffect(() => {
        setActiveTab(openedTab);
    }, [openedTab]);

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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return <Spin style={{margin: "100px auto", display: "block"}}/>;
    if (!project) return  <Result
        status="404"
        title="404"
        subTitle="Проект не найден"
        extra={<Button type="primary" onClick={() => window.location.href = '/projects'}>Вернуться на главную</Button>}
    />;

    const tabs = [
        { key: "projectDetails", label: "Детали проекта", children: <ProjectInfo initProject={project} /> },
        { key: "stagesList", label: "Этапы", children: <StagesTable projectId={Number(projectId)} /> },
        { key: "reportsList", label: "Отчёты", children: <ReportsTable projectId={Number(projectId)} /> },
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", backgroundColor: "#208100"}}>
                <ProjectHeader />
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <HeaderActions
                        onNewProject={() => {}}
                        onRefresh={() => {}}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        markAsRead={markAsRead}
                        deleteNotification={deleteNotification}
                    />
                    <Button onClick={() => window.location.href = "/projects"}>Назад</Button>
                </div>
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
