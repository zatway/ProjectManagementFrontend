import { Modal, Form, Input, Select, message } from 'antd';
import { reportsApi } from '../../../apis/reportsApi';
import { stagesApi } from '../../../apis/stagesApi';
import {useEffect, useState, type FC } from 'react';
import type { ShortStageResponse } from '../../../models/DTOModels/Response/ShortStageResponse.ts';
import type {GenerateReportRequest} from "../../../models/DTOModels/Request/GenerateReportRequest.ts";
import {getReportType} from "../../../utils/enumConverter.ts";
import {ReportType} from "../../../models/DTOModels/Еnums/ReportType.ts";

interface GenerateReportModalProps {
    projectId: number;
    open: boolean;
    onClose: () => void;
    onGenerated: () => void;
}

const GenerateReportModal: FC<GenerateReportModalProps> = ({ projectId, open, onClose, onGenerated }) => {
    const [form] = Form.useForm();
    const [stages, setStages] = useState<ShortStageResponse[]>([]);

    useEffect(() => {
        const fetchStages = async () => {
            const res = await stagesApi.getAllStages(projectId);
            if (!res.error) setStages(res.data || []);
        };
        if (open) fetchStages();
    }, [projectId, open]);

    const handleGenerate = async () => {
        try {
            const values = await form.validateFields();
            const req: GenerateReportRequest = {
                projectId,
                stageId: values.stageId || undefined,
                reportType: values.reportType,
                targetFileName: values.targetFileName,
                // reportConfig: JSON.stringify({
                //     IncludeProgress: values.includeProgress ?? true,
                //     IncludeDeadline: values.includeDeadline ?? true
                // })
            };
            const res = await reportsApi.generateReport(req);
            if (!res.error) {
                message.success('Генерация отчёта запущена');
                onGenerated();
            } else {
                message.error('Не удалось запустить генерацию отчёта');
            }
        } catch (e) {}
        finally {
            onClose();
        }
    };

    const reportTypeOptions = Object.values(ReportType).map(rt => ({
        value: rt,
        label: getReportType(rt)
    }));

    return (
        <Modal title="Сгенерировать отчёт" open={open} onCancel={onClose} onOk={handleGenerate} okText="Запустить">
            <Form layout="vertical" form={form}>
                <Form.Item label="Тип отчёта" name="reportType" rules={[{ required: true }]}>
                    <Select placeholder="Выберите тип отчёта" options={reportTypeOptions} />
                </Form.Item>

                <Form.Item label="Этап (опционно)" name="stageId">
                    <Select
                        placeholder="Выберите этап"
                        allowClear
                        options={stages.map(s => ({ value: s.stageId, label: s.name }))}
                    />
                </Form.Item>

                <Form.Item label="Имя файла (опционно)" name="targetFileName">
                    <Input placeholder="Введите имя файла" />
                </Form.Item>

                {/*<Form.Item name="includeProgress" valuePropName="checked">*/}
                {/*    <Checkbox>Включать прогресс</Checkbox>*/}
                {/*</Form.Item>*/}

                {/*<Form.Item name="includeDeadline" valuePropName="checked">*/}
                {/*    <Checkbox>Включать сроки</Checkbox>*/}
                {/*</Form.Item>*/}
            </Form>
        </Modal>
    );
};

export default GenerateReportModal;
