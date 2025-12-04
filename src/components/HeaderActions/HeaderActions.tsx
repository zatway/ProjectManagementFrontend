import {Button, Dropdown, Badge, Popover, List, Popconfirm, Typography} from "antd";
import {LogoutOutlined, PlusOutlined, ReloadOutlined, DownOutlined, BellOutlined} from "@ant-design/icons";
import {authLocalService} from "../../storageServices/authLocalService.ts";
import {useState} from "react";
import type {NotificationResponse} from "../../models/DTOModels/Response/SignalR/NotificationResponse.ts";

interface Props {
    onNewProject?: () => void;
    onRefresh?: () => void;
    actionBtnVisible?: boolean;
    notifications: NotificationResponse[];
    unreadCount: number;
    markAsRead: (notificationId: number) => Promise<void>;
    deleteNotification: (notificationId: number) => Promise<void>;
}

const {Text} = Typography;

/**
 * Панель действий в шапке приложения.
 * Отображает кнопки действий, выводит список уведомлений и позволяет помечать их прочитанными или удалять.
 */
export const HeaderActions = ({
                                  onNewProject,
                                  onRefresh,
                                  actionBtnVisible = true,
                                  notifications,
                                  unreadCount,
                                  markAsRead,
                                  deleteNotification
                              }: Props) => {
    const [visible, setVisible] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleVisibleChange = (newVisible: boolean) => {
        setVisible(newVisible);
    };

    const handleMarkAsRead = async (id: number) => {
        setProcessingId(id);
        await markAsRead(id);
        if (notifications.length === 1) setVisible(false);
        setProcessingId(null);
    };

    const handleDelete = async (id: number) => {
        setProcessingId(id);
        await deleteNotification(id);
        if (notifications.length === 1) setVisible(false);
        setProcessingId(null);
    };

    const notificationContent = (
        <List
            size="small"
            dataSource={notifications}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleMarkAsRead(item.notificationId)}
                            disabled={item.isRead || processingId === item.notificationId}
                            loading={processingId === item.notificationId}
                        >
                            {item.isRead ? 'Прочитано' : 'Прочитать'}
                        </Button>,
                        <Popconfirm
                            title="Удалить уведомление?"
                            onConfirm={() => handleDelete(item.notificationId)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button type="link" size="small" danger loading={processingId === item.notificationId}>
                                Удалить
                            </Button>
                        </Popconfirm>
                    ]}
                >
                    <List.Item.Meta
                        title={
                            <Text
                                style={{
                                    fontWeight: item.isRead ? 'normal' : 'bold',
                                    margin: 0
                                }}
                            >
                                {item.message}
                            </Text>
                        }
                        description={
                            <div>
                                <Text type="secondary" style={{fontSize: '12px'}}>
                                    {new Date(item.createdAt).toLocaleString('ru-RU')}
                                </Text>
                                {item.projectName && (
                                    <div>
                                        <Text type="secondary" style={{fontSize: '12px'}}>
                                            Проект: {item.projectName}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </List.Item>
            )}
            locale={{
                emptyText: 'Нет уведомлений'
            }}
            style={{maxHeight: 400, overflow: 'auto'}}
        />
    );

    const items = [
        {
            key: "new",
            label: "Новый проект",
            icon: <PlusOutlined/>,
            onClick: onNewProject,
        },
        {
            key: "refresh",
            label: "Обновить",
            icon: <ReloadOutlined/>,
            onClick: onRefresh,
        },
    ];

    const onLogout = () => {
        authLocalService.clearIdentityData();
        window.location.href = '/';
    };

    return (
        <div style={{display: 'flex', alignItems: "center", justifyContent: "flex-end", gap: 8}}>
            {actionBtnVisible ? <Dropdown menu={{items}} placement="bottomRight">
                <Button type="text" style={{color: "white"}}>
                    Действия <DownOutlined/>
                </Button>
            </Dropdown> : <></>}

            <Popover
                content={notificationContent}
                title="Уведомления"
                popupVisible={visible}
                onOpenChange={handleVisibleChange}
                placement="bottomRight"
                trigger="click"
                overlayStyle={{width: 400}}
            >
                <Badge count={unreadCount} offset={[10, -5]} style={{backgroundColor: '#208100'}}>
                    <Button type="text" icon={<BellOutlined style={{color: "white", fontSize: 18}}/>}/>
                </Badge>
            </Popover>

            <Button
                type="text"
                icon={<LogoutOutlined/>}
                style={{color: "white"}}
                onClick={onLogout}
            >
                Выход
            </Button>
        </div>
    );
};
