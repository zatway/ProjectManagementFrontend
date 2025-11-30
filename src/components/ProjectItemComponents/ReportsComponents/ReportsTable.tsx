import { Table, Button, Space, message } from 'antd';
import { useState, useEffect } from 'react';
import { reportsApi } from '../../../apis/reportsApi';
import type { ShortReportResponse } from '../../../models/DTOModels/Response/ShortReportResponse.ts';
import dayjs from 'dayjs';
import GenerateReportModal from "./GenerateReportModal.tsx";

interface ReportsTableProps {
    projectId: number;
}

const ReportsTable = ({ projectId }: ReportsTableProps) => {
    const [reports, setReports] = useState<ShortReportResponse[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchReports = async () => {
        const res = await reportsApi.getReportsByProject(projectId);
        if (!res.error) setReports(res.data || []);
    };

    useEffect(() => { fetchReports(); }, [projectId]);

    const downloadReport = async (reportId: number, fileName?: string) => {
        const res = await reportsApi.downloadReport(reportId);
        if (!res.error && res.data) {
            const blob = res.data as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || `report_${reportId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            message.success('Скачивание начато');
        } else message.error('Не удалось скачать отчет');
    };

    const columns = [
        { title: 'ID', dataIndex: 'reportId' },
        { title: 'Название', dataIndex: 'name' },
        { title: 'Создан', dataIndex: 'createdDate', render: (d: string) => dayjs(d).format('DD.MM.YYYY HH:mm') },
        { title: 'Действия', key: 'actions', render: (_: any, record: ShortReportResponse) => (
                <Space>
                    <Button type="link" onClick={() => downloadReport(record.reportId, record.projectName)}>Скачать</Button>
                </Space>
            )}
    ];

    return (
        <>
            <Button type="primary" style={{ marginBottom: 12 }} onClick={() => setModalOpen(true)}>Сгенерировать отчет</Button>
            <Table dataSource={reports} rowKey="reportId" columns={columns} bordered />
            <GenerateReportModal projectId={projectId} open={isModalOpen} onClose={() => setModalOpen(false)} onGenerated={fetchReports} />
        </>
    );
};

export default ReportsTable;
