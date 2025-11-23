export interface NotificationResponse {
    notificationId: number;
    userId: number;
    projectId?: number;
    message: string;
    isRead: boolean;
    createdAt: Date | string;
    projectName?: string;
}
