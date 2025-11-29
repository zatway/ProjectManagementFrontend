import { Button, Dropdown } from "antd";
import { LogoutOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from "@ant-design/icons";

interface Props {
    onNewProject: () => void;
    onRefresh: () => void;
    onLogout: () => void;
}

export const HeaderActions = ({ onNewProject, onRefresh, onLogout }: Props) => {
    const items = [
        {
            key: "new",
            label: "Новый проект",
            icon: <PlusOutlined />,
            onClick: onNewProject,
        },
        {
            key: "refresh",
            label: "Обновить",
            icon: <ReloadOutlined />,
            onClick: onRefresh,
        },
    ];

    return (
        <>
            <Dropdown menu={{ items }} placement="bottomRight">
                <Button type="text" style={{ color: "white" }}>
                    Действия <DownOutlined />
                </Button>
            </Dropdown>

            <Button
                type="text"
                icon={<LogoutOutlined />}
                style={{ color: "white" }}
                onClick={onLogout}
            >
                Выход
            </Button>
        </>
    );
};
