import { useState } from 'react';
import { Descriptions, Badge, Button } from 'antd';
import dayjs from 'dayjs';
import { getProjectStatusColor, getProjectStatusLabel } from '../../utils/getStatusConfig';
import type { ProjectResponse } from '../../models/DTOModels/Response/ProjectResponse.ts';
import EditProjectModal from './EditProjectModal';
import type {UpdateProjectRequest} from "../../models/DTOModels/Request/UpdateProjectRequest.ts";

interface ProjectInfoProps {
    project: ProjectResponse;
    onUpdated: () => void;
}

const ProjectInfo = ({ project, onUpdated }: ProjectInfoProps) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const initialValues: UpdateProjectRequest = {
        name: project.name,
        description: project.description,
        budget: project.budget,
        startDate: dayjs(project.startDate),
        endDate: dayjs(project.endDate),
        status: project.status
    };

    return (
        <>
            <Button type="primary" style={{ marginBottom: 12 }} onClick={() => setEditModalOpen(true)}>Редактировать проект</Button>
            <Descriptions bordered column={1} size="middle" labelStyle={{ fontWeight: 600 }}>
                <Descriptions.Item label="Название">{project.name}</Descriptions.Item>
                <Descriptions.Item label="Описание">{project.description}</Descriptions.Item>
                <Descriptions.Item label="Бюджет">{project.budget.toLocaleString()} ₽</Descriptions.Item>
                <Descriptions.Item label="Дата начала">{dayjs(project.startDate).format('DD.MM.YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Дата окончания">{dayjs(project.endDate).format('DD.MM.YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Статус">
                    <Badge color={getProjectStatusColor(project.status).color} text={getProjectStatusLabel(project.status)} />
                </Descriptions.Item>
                <Descriptions.Item label="Этапов">{project.stagesCount}</Descriptions.Item>
            </Descriptions>

            <EditProjectModal
                projectId={project.projectId}
                open={isEditModalOpen}
                initialValues={initialValues}
                onClose={() => setEditModalOpen(false)}
                onUpdated={onUpdated}
            />
        </>
    );
};

export default ProjectInfo;
