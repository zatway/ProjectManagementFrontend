export interface NotificationResponse {
    notificationId: number;
    userId: number;
    projectId?: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    projectName?: string;
}
