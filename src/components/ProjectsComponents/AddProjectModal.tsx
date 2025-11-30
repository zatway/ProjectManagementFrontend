import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import type {FC} from "react";
import type {CreateProjectRequest} from "../../models/DTOModels/Request/CreateProjectRequest.ts";

interface AddProjectModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (p: CreateProjectRequest) => void;
}

export const AddProjectModal: FC<AddProjectModalProps> = ({ open, onCancel, onSave }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: CreateProjectRequest) => {
        onSave(values);
        form.resetFields();
    };

    return (
        <Modal
            title="Новый проект"
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            okText="Создать"
            cancelText="Отмена"
            style={{ top: 50 }}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Название"
                    name="name"
                    rules={[{ required: true, message: "Введите название проекта" }]}
                >
                    <Input placeholder="Введите название" />
                </Form.Item>

                <Form.Item
                    label="Описание"
                    name="description"
                    rules={[{ required: true, message: "Введите описание" }]}
                >
                    <Input.TextArea rows={3} placeholder="Описание проекта" />
                </Form.Item>

                <Form.Item
                    label="Бюджет"
                    name="budget"
                    initialValue={0.01}
                    rules={[{ required: true, message: "Введите бюджет" }]}
                >
                    <InputNumber
                        min={0.01}
                        style={{ width: "100%" }}
                        placeholder="0.00"
                    />
                </Form.Item>

                <Form.Item
                    label="Период выполнения"
                    name="dates"
                    rules={[{ required: true, message: "Выберите период" }]}
                >
                    <DatePicker.RangePicker
                        style={{ width: "100%" }}
                        format="DD.MM.YYYY"
                        placeholder={["Дата начала", "Дата окончания"]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
