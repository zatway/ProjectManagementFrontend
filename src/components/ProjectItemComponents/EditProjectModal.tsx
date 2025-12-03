import {Modal, Form, Input, InputNumber, DatePicker, message, Select} from 'antd';
import {type FC} from 'react';
import type {UpdateProjectRequest} from "../../models/DTOModels/Request/UpdateProjectRequest.ts";
import {projectApi} from "../../apis/projectsApi.ts";
import {getProjectStatusLabel} from "../../utils/enumConverter.ts";
import {ProjectStatus} from "../../models/DTOModels/Еnums/ProjectStatus.ts";
import type {EditFormValues} from "./ProjectInfo.tsx";

interface EditProjectModalProps {
    projectId: number;
    open: boolean;
    initialValues: EditFormValues;
    onClose: () => void;
    onUpdated: () => void;
}

const EditProjectModal: FC<EditProjectModalProps> = ({projectId, open, initialValues, onClose, onUpdated}) => {
    const [form] = Form.useForm();

    const buildUpdatePayload = (values: UpdateProjectRequest): UpdateProjectRequest => {
        const payload: UpdateProjectRequest = {};
        if (values.name !== undefined) payload.name = values.name;
        if (values.description !== undefined) payload.description = values.description;
        if (values.status !== undefined) payload.status = values.status;
        if (values.budget !== undefined) payload.budget = values.budget;
        if (values.startDate) payload.startDate = values.startDate;
        if (values.endDate) payload.endDate = values.endDate;
        return payload;
    };

    const handleSave = async () => {
        try {
            const values = await form?.validateFields?.();
            const req = buildUpdatePayload(values);
            const res = await projectApi.updateProject(projectId, req);
            if (!res.error) {
                message.success('Проект успешно обновлён');
                onUpdated();
            } else {
                message.error('Не удалось обновить проект');
            }
        } catch (e) {
        } finally {
            onClose();
        }
    };

    const projectStatusOptions = Object.values(ProjectStatus).map(sS => ({
        value: sS,
        label: getProjectStatusLabel(sS)
    }));

    return (
        <Modal title="Редактировать проект" open={open} onCancel={onClose} onOk={handleSave} okText="Сохранить">
            <Form layout="vertical" form={form} initialValues={initialValues}>
                <Form.Item label="Название" name="name" rules={[{required: true}]}><Input/></Form.Item>
                <Form.Item label="Описание" name="description"><Input.TextArea rows={4}/></Form.Item>
                <Form.Item label="Бюджет" name="budget" rules={[{required: true}]}><InputNumber min={0}
                                                                                                style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Дата начала" name="startDate" rules={[{required: true}]}><DatePicker
                    style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Дата окончания" name="endDate" rules={[{required: true}]}><DatePicker
                    style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Статус" name="status" rules={[{required: true}]}>
                    <Select placeholder="Выберите специалиста" options={projectStatusOptions}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProjectModal;
