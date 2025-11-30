import { Modal, Form, Input, InputNumber, message } from 'antd';
import { type FC } from 'react';
import { reportsApi } from '../../../apis/reportsApi';

interface GenerateReportModalProps {
    projectId: number;
    open: boolean;
    onClose: () => void;
    onGenerated: () => void;
}

const GenerateReportModal: FC<GenerateReportModalProps> = ({ projectId, open, onClose, onGenerated }) => {
    const [form] = Form.useForm();

    const handleGenerate = async () => {
        try {
            const values = await form.validateFields();
            const req = {
                projectId,
                stageId: values.stageId || undefined,
                reportType: values.reportType,
                reportConfig: values.reportConfig,
                targetFileName: values.targetFileName
            };
            const res = await reportsApi.generateReport(req);
            if (!res.error) {
                message.success('Генерация отчёта запущена');
                onGenerated();
            } else message.error('Не удалось запустить генерацию отчёта');
        } catch (e) {
        } finally {
            onClose();
        }
    };

    return (
        <Modal title="Сгенерировать отчёт" open={open} onCancel={onClose} onOk={handleGenerate} okText="Запустить">
            <Form layout="vertical" form={form}>
                <Form.Item label="Тип отчёта" name="reportType" rules={[{required: true}]}><Input/></Form.Item>
                <Form.Item label="ID этапа (опционно)" name="stageId"><InputNumber style={{width: '100%'}}/></Form.Item>
                <Form.Item label="Имя файла (опционно)" name="targetFileName"><Input/></Form.Item>
                <Form.Item label="Конфиг (json, опционно)" name="reportConfig"><Input.TextArea rows={3}/></Form.Item>
            </Form>
        </Modal>
    );
};

export default GenerateReportModal;
