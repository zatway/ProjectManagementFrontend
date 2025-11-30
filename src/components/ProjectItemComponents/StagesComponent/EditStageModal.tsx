import { Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { stagesApi } from '../../../apis/stagesApi';
import { type FC, useEffect } from 'react';
import type { ShortStageResponse } from '../../../models/DTOModels/Response/ShortStageResponse.ts';

interface EditStageModalProps {
    projectId: number;
    stage: ShortStageResponse | null;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

const EditStageModal: FC<EditStageModalProps> = ({ projectId, stage, open, onClose, onSaved }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (stage) {
            form.setFieldsValue({
                name: stage.name,
                stageType: stage.stageType,
                progressPercent: stage.progressPercent,
                status: stage.status
            });
        } else form.resetFields();
    }, [stage, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (stage) {
                const res = await stagesApi.updateStage(stage.stageId, {
                    progressPercent: values.progressPercent,
                    status: values.status,
                    deadline: values.deadline ? values.deadline.toISOString() : undefined
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
                    deadline: values.deadline ? values.deadline.toISOString() : undefined
                });
                if (!res.error) {
                    message.success('Этап создан');
                    onSaved();
                }
            }
        } catch (e) {
        } finally {
            onClose();
        }
    };

    return (
        <Modal title={stage ? 'Редактировать этап' : 'Добавить этап'} open={open} onCancel={onClose} onOk={handleSave} okText="Сохранить">
            <Form form={form} layout="vertical">
                {!stage && (
                    <>
                        <Form.Item label="Название" name="name" rules={[{required: true}]}><Input/></Form.Item>
                        <Form.Item label="Тип этапа" name="stageType" rules={[{required: true}]}><Input/></Form.Item>
                    </>
                )}
                <Form.Item label="Прогресс (%)" name="progressPercent"><InputNumber min={0} max={100} style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Дедлайн" name="deadline"><DatePicker style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Статус" name="status"><Input/></Form.Item>
                <Form.Item label="ID специалиста" name="specialistUserId"><InputNumber style={{width: '100%'}}/></Form.Item>
            </Form>
        </Modal>
    );
};

export default EditStageModal;
