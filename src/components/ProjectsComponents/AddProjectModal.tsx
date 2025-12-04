import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import {useState, type FC} from "react";
import type {Dayjs} from "dayjs";
import type {CreateProjectRequest} from "../../models/DTOModels/Request/CreateProjectRequest.ts";

interface AddProjectModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (p: CreateProjectRequest) => void;
}

interface AddProjectFormValues {
    name: string;
    description: string;
    budget: number;
    dates: [Dayjs, Dayjs];
}

/**
 * Модальное окно создания проекта.
 * Принимает значения формы, конвертирует диапазон дат в ISO‑строки и передаёт API-модель `CreateProjectRequest`.
 */
export const AddProjectModal: FC<AddProjectModalProps> = ({ open, onCancel, onSave }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async (values: AddProjectFormValues) => {
        setIsSubmitting(true);
        try {
            const [start, end] = values.dates;
            const payload: CreateProjectRequest = {
                name: values.name,
                description: values.description,
                budget: values.budget,
                startDate: start.toISOString(),
                endDate: end.toISOString()
            };
            await onSave(payload);
            form.resetFields();
        } finally {
            setIsSubmitting(false);
        }
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
            confirmLoading={isSubmitting}
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
