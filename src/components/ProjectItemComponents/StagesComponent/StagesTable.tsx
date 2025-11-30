import { Table, Button, Space, Popconfirm, message } from 'antd';
import { useState, useEffect } from 'react';
import { stagesApi } from '../../../apis/stagesApi';
import type { ShortStageResponse } from '../../../models/DTOModels/Response/ShortStageResponse.ts';
import EditStageModal from "./EditStageModal.tsx";

interface StagesTableProps {
    projectId: number;
}

const StagesTable = ({ projectId }: StagesTableProps) => {
    const [stages, setStages] = useState<ShortStageResponse[]>([]);
    const [isStageModalOpen, setStageModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<ShortStageResponse | null>(null);

    const fetchStages = async () => {
        const res = await stagesApi.getAllStages(projectId);
        if (!res.error) setStages(res.data || []);
    };

    useEffect(() => { fetchStages(); }, [projectId]);

    const deleteStage = async (stageId: number) => {
        const res = await stagesApi.deleteStage(stageId);
        if (!res.error) {
            message.success('Этап удалён');
            fetchStages();
        } else message.error('Не удалось удалить этап');
    };

    const stageColumns = [
        { title: 'Название', dataIndex: 'name' },
        { title: 'Тип', dataIndex: 'stageType' },
        { title: 'Прогресс', dataIndex: 'progressPercent', render: (v: number) => v + '%' },
        { title: 'Статус', dataIndex: 'status' },
        {
            title: 'Действия', render: (_: any, record: ShortStageResponse) => (
                <Space>
                    <Button type="link" onClick={() => { setEditingStage(record); setStageModalOpen(true); }}>Редактировать</Button>
                    <Popconfirm title={`Удалить этап "${record.name}"?"`} onConfirm={() => deleteStage(record.stageId)} okText="Да" cancelText="Отмена">
                        <Button type="link" style={{color: 'red'}}>Удалить</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <Button type="primary" style={{ marginBottom: 12 }} onClick={() => { setEditingStage(null); setStageModalOpen(true); }}>Добавить этап</Button>
            <Table dataSource={stages} rowKey="stageId" columns={stageColumns} bordered />
            <EditStageModal projectId={projectId} stage={editingStage} open={isStageModalOpen} onClose={() => setStageModalOpen(false)} onSaved={fetchStages} />
        </>
    );
};

export default StagesTable;
