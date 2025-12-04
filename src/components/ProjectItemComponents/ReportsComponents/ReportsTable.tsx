import {Table, Button, Space, message, Badge} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import {reportsApi} from '../../../apis/reportsApi';
import type {ShortReportResponse} from '../../../models/DTOModels/Response/ShortReportResponse.ts';
import dayjs from 'dayjs';
import GenerateReportModal from "./GenerateReportModal.tsx";
import {
    getReportStatusConfig,
    getReportType
} from "../../../utils/enumConverter.ts";

interface ReportsTableProps {
    projectId: number;
    refetchTrigger?: number;
}

/**
 * Таблица отчётов по проекту.
 * Загружает отчёты для проекта, позволяет запускать генерацию новых отчётов и скачивать готовые файлы.
 * @param projectId - ID проекта для загрузки отчётов
 * @param refetchTrigger - Триггер для принудительной перезагрузки отчётов (увеличивается при получении уведомлений)
 */
const ReportsTable = ({projectId, refetchTrigger}: ReportsTableProps) => {
    const [reports, setReports] = useState<ShortReportResponse[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await reportsApi.getReportsByProject(projectId);
            if (!res.error) setReports(res.data || []);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
        if (refetchTrigger !== undefined && refetchTrigger > 0) {
            fetchReports();
        }
    }, [refetchTrigger, fetchReports]);

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
        {title: 'ID', dataIndex: 'reportId'},
        {title: 'Название', dataIndex: 'targetFileName'},
        {
            title: 'Тип',
            dataIndex: 'reportType',
            render: (_: any, record: ShortReportResponse) => getReportType(record.reportType)
        },
        {
            title: 'Создан',
            dataIndex: 'generatedAt',
            render: (d: string) => dayjs(d).format('DD.MM.YYYY HH:mm')
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            render: (_: any, report: ShortReportResponse) => <Badge color={getReportStatusConfig(report.status).color}
                                                                    text={getReportStatusConfig(report.status).text}/>
        },
        {
            title: 'Действия', key: 'actions', render: (_: any, record: ShortReportResponse) => (
                <Space>
                    <Button type="link"
                            onClick={() => downloadReport(record.reportId, record.projectName)}>Скачать</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <Button type="primary" style={{marginBottom: 12}} onClick={() => setModalOpen(true)}>
                Сгенерировать отчет
            </Button>
            <Table dataSource={reports} rowKey="reportId" columns={columns} bordered loading={isLoading}/>
            <GenerateReportModal projectId={projectId} open={isModalOpen} onClose={() => setModalOpen(false)}
                                 onGenerated={fetchReports}/>
        </>
    );
};

export default ReportsTable;


