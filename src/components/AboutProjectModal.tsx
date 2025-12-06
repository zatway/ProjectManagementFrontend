import {Modal, Typography, Divider} from "antd";

const {Title, Paragraph, Text} = Typography;

interface AboutProjectModalProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Модальное окно с информацией о курсовом проекте.
 */
const AboutProjectModal = ({open, onClose}: AboutProjectModalProps) => {
    return (
        <Modal
            title={
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span>О проекте</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div style={{padding: '8px 0'}}>
                <Title level={4} style={{marginTop: 0}}>Тема проекта</Title>
                <Paragraph>
                    Система управления проектами с веб-интерфейсом для отслеживания этапов выполнения проектов,
                    генерации отчетов и управления уведомлениями.
                </Paragraph>

                <Divider/>

                <Title level={4}>Исполнитель</Title>
                <Paragraph>
                    <Text strong>Арсланбеков Радмир Рустамович</Text>
                </Paragraph>

                <Divider/>

                <Title level={4}>Технологии</Title>
                <Paragraph>
                    <ul style={{marginBottom: 0}}>
                        <li><Text strong>Frontend:</Text> React + TypeScript, Redux Toolkit, Ant Design</li>
                        <li><Text strong>Backend:</Text> ASP.NET Core, Entity Framework Core</li>
                        <li><Text strong>База данных:</Text> PostgreSQL</li>
                        <li><Text strong>Уведомления:</Text> SignalR</li>
                    </ul>
                </Paragraph>
            </div>
        </Modal>
    );
};

export default AboutProjectModal;

