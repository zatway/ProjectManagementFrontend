import { Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { stagesApi } from '../../../apis/stagesApi';
import { type FC, useEffect, useState } from 'react';
import type { ShortStageResponse } from '../../../models/DTOModels/Response/ShortStageResponse.ts';
import type { UserResponse } from '../../../models/DTOModels/Response/UserResponse.ts';
import {StageStatus} from "../../../models/DTOModels/Еnums/StageStatus.ts";
import {usersApi} from "../../../apis/usersApi.ts";
import type {StageResponse} from "../../../models/DTOModels/Response/StageResponse.ts";

interface EditStageModalProps {
    projectId: number;
    shortStage: ShortStageResponse | null;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

const stageStatusOptions: { value: StageStatus; label: string }[] = [
    { value: StageStatus.Pending, label: 'Ожидает начала выполнения' },
    { value: StageStatus.InProgress, label: 'В процессе выполнения' },
    { value: StageStatus.Completed, label: 'Выполнено' },
    { value: StageStatus.Delayed, label: 'Просрочено' },
];

const EditStageModal: FC<EditStageModalProps> = ({ projectId, shortStage, open, onClose, onSaved }) => {
    const [form] = Form.useForm();
    const [stage, setStage] = useState<StageResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await usersApi.getAllSUsers();
            if (!res.error) setUsers(res.data || []);
        };
        const fetchStage = async () => {
            if(shortStage?.stageId) {
                const res = await stagesApi.getStageDetail(shortStage.stageId);
                if (!res.error) setStage(res.data ?? null);
            }
        };
        fetchUsers();
        fetchStage();
    }, []);

    useEffect(() => {
        if (stage) {
            form.setFieldsValue({
                name: stage.name,
                stageType: stage.stageType,
                progressPercent: stage.progressPercent,
                status: stage.status,
                specialistUserId: stage.specialistUserFullName,
                deadline: stage.deadline ? stage.deadline : undefined,
            });
        } else {
            form.resetFields();
        }
    }, [stage, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (stage) {
                const res = await stagesApi.updateStage(stage.stageId, {
                    progressPercent: values.progressPercent,
                    status: values.status,
                    deadline: values.deadline ? values.deadline.toISOString() : undefined,
                    specialistUserId: values.specialistUserId,
                });
                if (!res.error) {
                    message.success('Этап обновлён');
                    onSaved();
                }
            } else {
                const res = await stagesApi.createStage(projectId, {
                    name: values.name,
                    stageType: values.stageType,
                    progressPercent: values.progressPercent || 0,
                    status: values.status,
                    specialistUserId: values.specialistUserId,
                    deadline: values.deadline ? values.deadline.toISOString() : undefined,
                });
                if (!res.error) {
                    message.success('Этап создан');
                    onSaved();
                }
            }
        } catch (e) {
            // validation error
        } finally {
            onClose();
        }
    };

    return (
        <Modal
            title={stage ? 'Редактировать этап' : 'Добавить этап'}
            open={open}
            onCancel={onClose}
            onOk={handleSave}
            okText="Сохранить"
        >
            <Form form={form} layout="vertical">
                {!stage && (
                    <>
                        <Form.Item label="Название" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Тип этапа" name="stageType" rules={[{ required: true }]}><Input /></Form.Item>
                    </>
                )}
                <Form.Item label="Прогресс (%)" name="progressPercent"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
                <Form.Item label="Дедлайн" name="deadline"><DatePicker style={{ width: '100%' }} /></Form.Item>
                <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
                    <Select options={stageStatusOptions} />
                </Form.Item>
                <Form.Item label="Специалист" name="specialistUserId" rules={[{ required: true }]}>
                    <Select
                        placeholder="Выберите специалиста"
                        options={users.map(u => ({ value: u.id, label: u.fullName }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditStageModal;
