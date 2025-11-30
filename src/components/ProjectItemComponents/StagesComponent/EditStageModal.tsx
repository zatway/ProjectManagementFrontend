import { Modal, Form, InputNumber, DatePicker, Select, message } from 'antd';
import {type FC, useEffect, useState} from 'react';
import { stagesApi } from '../../../apis/stagesApi';
import type { ShortStageResponse } from '../../../models/DTOModels/Response/ShortStageResponse.ts';
import type { UserResponse } from '../../../models/DTOModels/Response/UserResponse.ts';
import { StageStatus } from '../../../models/DTOModels/Еnums/StageStatus.ts';
import { usersApi } from '../../../apis/usersApi.ts';
import dayjs from "dayjs";
import {getStageStatusLabel} from "../../../utils/enumConverter.ts";

interface EditStageModalProps {
    stage: ShortStageResponse;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

const EditStageModal: FC<EditStageModalProps> = ({ stage, open, onClose, onSaved }) => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await usersApi.getAllSUsers();
            if (!res.error) setUsers(res.data || []);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchStage = async () => {
            const res = await stagesApi.getStageDetail(stage.stageId);
            if (res.data) {
                const specialist = users?.find(u => u.fullName === res.data?.specialistUserFullName);
                form.setFieldsValue({
                    progressPercent: res.data.progressPercent,
                    status: res.data.status,
                    specialistUserId: specialist ? specialist.id : undefined,
                    deadline: dayjs(res.data.deadline).format('DD.MM.YYYY HH:mm')
                });
            }
        };
        fetchStage();
    }, [stage, users, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const res = await stagesApi.updateStage(stage.stageId, {
                progressPercent: values.progressPercent,
                status: values.status,
                specialistUserId: values.specialistUserId,
                deadline: values.deadline ? values.deadline.toISOString() : undefined,
            });
            if (!res.error) {
                message.success('Этап обновлён');
                onSaved();
            } else {
                message.error('Не удалось обновить этап');
            }
        } catch (e) {}
        finally {
            onClose();
        }
    };

    const stageStatusOptions = Object.values(StageStatus).map(sS => ({
        value: sS,
        label: getStageStatusLabel(sS)
    }));

    return (
        <Modal title="Редактировать этап" open={open} onCancel={onClose} onOk={handleSave} okText="Сохранить">
            <Form form={form} layout="vertical">
                <Form.Item label="Прогресс (%)" name="progressPercent">
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Дедлайн" name="deadline">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
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
