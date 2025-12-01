import {Table, Button, Space, Popconfirm, message} from 'antd';
import {useState, useEffect} from 'react';
import {stagesApi} from '../../../apis/stagesApi';
import type {ShortStageResponse} from '../../../models/DTOModels/Response/ShortStageResponse.ts';
import EditStageModal from "./EditStageModal.tsx";
import {hasValue} from "../../../utils/hasValue.ts";
import {getStageTypeLabel} from "../../../utils/enumConverter.ts";
import AddStageModal from "./AddStageModal.tsx";
import type {UserResponse} from "../../../models/DTOModels/Response/UserResponse.ts";
import {usersApi} from "../../../apis/usersApi.ts";

interface StagesTableProps {
    projectId: number;
}

const StagesTable = ({projectId}: StagesTableProps) => {
    const [stages, setStages] = useState<ShortStageResponse[]>([]);
    const [isStageModalOpen, setStageModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<ShortStageResponse | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);

    const fetchStages = async () => {
        const res = await stagesApi.getAllStages(projectId);
        if (!res.error) setStages(res.data || []);
    };

    const fetchUsers = async () => {
        const res = await usersApi.getAllSUsers();
        if (!res.error) setUsers(res.data || []);
    };

    useEffect(() => {
        fetchStages();
        fetchUsers();
    }, [projectId]);

    const deleteStage = async (stageId: number) => {
        const res = await stagesApi.deleteStage(stageId);
        if (!res.error) {
            message.success('Этап удалён');
            fetchStages();
        } else message.error('Не удалось удалить этап');
    };

    const stageColumns = [
        {title: 'Название', dataIndex: 'name'},
        {
            title: 'Тип',
            dataIndex: 'stageType',
            render: (_: any, record: ShortStageResponse) =>
                (getStageTypeLabel(record.stageType))
        },
        {title: 'Прогресс', dataIndex: 'progressPercent', render: (v: number) => v + '%'},
        {
            title: 'Статус', dataIndex: 'status', render: (_: any, record: ShortStageResponse) =>
                getStageTypeLabel(record.stageType)
        },
        {
            title: 'Действия', render: (_: any, record: ShortStageResponse) => (
                <Space>
                    <Button type="link" onClick={() => {
                        setEditingStage(record);
                        setStageModalOpen(true);
                    }}>Редактировать</Button>
                    <Popconfirm title={`Удалить этап "${record.name}"?"`} onConfirm={() => deleteStage(record.stageId)}
                                okText="Да" cancelText="Отмена">
                        <Button type="link" style={{color: 'red'}}>Удалить</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <Button type="primary" style={{marginBottom: 12}} onClick={() => {
                setEditingStage(null);
                setStageModalOpen(true);
            }}>Добавить этап</Button>
            <Table dataSource={stages} rowKey="stageId" columns={stageColumns} bordered/>
            {hasValue(editingStage) ?
                <EditStageModal users={users} stage={editingStage} open={isStageModalOpen} onClose={() => setStageModalOpen(false)}
                                onSaved={fetchStages}/> :
                <AddStageModal projectId={projectId} open={isStageModalOpen} onClose={() => setStageModalOpen(false)}
                               onSaved={fetchStages}/>}
        </>
    );
};

export default StagesTable;
