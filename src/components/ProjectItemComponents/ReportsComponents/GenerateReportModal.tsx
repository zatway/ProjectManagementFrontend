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

/**
 * Модальное окно запуска генерации отчёта.
 * Собирает параметры отчёта и этапов (можно выбрать несколько) и отправляет запрос `reportsApi.generateReport`.
 * Если этапы не выбраны, в отчёт включаются все этапы проекта.
 */
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
                reportType: values.reportType,
                targetFileName: values.targetFileName,
            };

            if (values.stageIds && Array.isArray(values.stageIds) && values.stageIds.length > 0) {
                if (values.stageIds.length === 1) {
                    req.stageId = values.stageIds[0];
                } else {
                    req.stageIds = values.stageIds;
                }
            }

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

                <Form.Item label="Этапы (опционно)" name="stageIds">
                    <Select
                        mode="multiple"
                        placeholder="Выберите этапы (если не выбрано, включаются все этапы проекта)"
                        allowClear
                        options={stages.map(s => ({ value: s.stageId, label: s.name }))}
                    />
                </Form.Item>

                <Form.Item label="Имя файла (опционно)" name="targetFileName">
                    <Input placeholder="Введите имя файла" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GenerateReportModal;
