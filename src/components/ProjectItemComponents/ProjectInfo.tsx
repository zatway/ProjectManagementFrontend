import { useState } from 'react';
import { Descriptions, Badge, Button } from 'antd';
import dayjs, {type Dayjs} from 'dayjs';
import { getProjectStatusColor, getProjectStatusLabel } from '../../utils/enumConverter.ts';
import type { ProjectResponse } from '../../models/DTOModels/Response/ProjectResponse.ts';
import EditProjectModal from './EditProjectModal';
import {projectApi} from "../../apis/projectsApi.ts";
import {hasValue} from "../../utils/hasValue.ts";

interface ProjectInfoProps {
    initProject: ProjectResponse;
}

export type EditFormValues = {
    name: string;
    description?: string | null;
    budget: number;
    status: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
};

const ProjectInfo = ({ initProject }: ProjectInfoProps) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [project, setProject] = useState<ProjectResponse>(initProject);

    const initialValues: EditFormValues = {
        name: project.name,
        description: project.description,
        budget: project.budget,
        startDate: project.startDate ? dayjs(project.startDate) : null,
        endDate: project.endDate ? dayjs(project.endDate) : null,
        status: project.status
    };

    const onUpdated = async () => {
    const res = await projectApi.getDetailsProject(initProject.projectId);
    if(hasValue(res.data))
        setProject(res.data);
    }

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
