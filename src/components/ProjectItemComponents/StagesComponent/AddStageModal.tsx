import { Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import {type FC, useEffect, useState} from 'react';
import { stagesApi } from '../../../apis/stagesApi';
import type { UserResponse } from '../../../models/DTOModels/Response/UserResponse.ts';
import { StageStatus } from '../../../models/DTOModels/Еnums/StageStatus.ts';
import {usersApi} from "../../../apis/usersApi.ts";
import { getStageStatusLabel, getStageTypeLabel} from "../../../utils/enumConverter.ts";
import {StageType} from "../../../models/DTOModels/Еnums/StageType.ts";

interface AddStageModalProps {
    projectId: number;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

/**
 * Модальное окно создания этапа.
 * Собирает значения формы, конвертирует дату‑дедлайн в ISO‑строку и отправляет запрос `stagesApi.createStage`.
 */
const AddStageModal: FC<AddStageModalProps> = ({ projectId, open, onClose, onSaved }) => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await usersApi.getAllSUsers();
            if (!res.error) setUsers(res.data || []);
        };
        fetchUsers();
        form.resetFields();
    }, [open]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
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
            } else {
                message.error('Не удалось создать этап');
            }
        } catch (e) {}
        finally { onClose(); }
    };

    const stageStatusOptions = Object.values(StageStatus).map(sS => ({
        value: sS,
        label: getStageStatusLabel(sS)
    }));

    const stageTypeOptions = Object.values(StageType).map(sT => ({
        value: sT,
        label: getStageTypeLabel(sT)
    }));

    return (
        <Modal title="Добавить этап" open={open} onCancel={onClose} onOk={handleSave} okText="Создать">
            <Form form={form} layout="vertical">
                <Form.Item label="Название" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="Тип этапа" name="stageType" rules={[{ required: true }]}>
                    <Select placeholder="Выберите тип отчёта" options={stageTypeOptions} />
                </Form.Item>
                <Form.Item label="Прогресс (%)" name="progressPercent"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
                <Form.Item label="Дедлайн" name="deadline"><DatePicker style={{ width: '100%' }} /></Form.Item>
                <Form.Item label="Статус" name="status" rules={[{ required: true }]}><Select options={stageStatusOptions} /></Form.Item>
                <Form.Item label="Специалист" name="specialistUserId" rules={[{ required: true }]}>
                    <Select placeholder="Выберите специалиста" options={users.map(u => ({ value: u.id, label: u.fullName }))} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddStageModal;
