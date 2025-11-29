import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface Props {
    items: MenuProps["items"];
}

export const ProjectActionsDropdown = ({ items }: Props) => {
    return (
        <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="link" size="small">
                Ещё <DownOutlined />
            </Button>
        </Dropdown>
    );
};
