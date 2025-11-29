import {env} from "../env.ts";
import  {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import type {SimpleCommandResult} from "../models/DTOModels/Response/SimpleCommandResult.ts";
import {createApiService} from "../apiService/createApiService.ts";
import type {NotificationResponse} from "../models/DTOModels/Response/SignalR/NotificationResponse.ts";

const { get, remove, patch } = createApiService(`${env.REACT_APP_SERVICE_SERVICE_HOST} ${env.REACT_APP_SERVICE_SERVICE_ENDPOINT_NOTIFICATION}`);

/**
 * API-сервис для работы с уведомлениями.
 * Предоставляет методы для получения, отметки как прочитанное и удаления уведомлений.
 */
export const notificationsApi = {
    /**
     * Эндпоинты для API-запросов уведомлений.
     */
    endPoints: {
        read: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_NOTIFICATION_READ,
    },

    /**
     * Получает все уведомления (прочитанные и непрочитанные) для текущего пользователя.
     * @returns {Promise<ResponseOptions<NotificationResponse[]>>} Промис со списком уведомлений или ошибкой.
     */
    getNotifications: async (): Promise<ResponseOptions<NotificationResponse[]>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения уведомлений',
            errorText: `Не удалось загрузить уведомления`,
        };
        return await get<NotificationResponse[]>('', options);
    },

    /**
     * Отмечает уведомление как прочитанное.
     * @param notificationId - Идентификатор уведомления.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом операции.
     */
    markAsRead: async (notificationId: number): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка отметки уведомления как прочитанного',
            errorText: `Не удалось отметить уведомление как прочитанное`,
        };
        const response = await patch<unknown, unknown>(`/${notificationId}${notificationsApi.endPoints.read}`, options);
        if (!response.error) {
            return { data: { successfully: true } };
        }
        return { error: response?.error, data: { successfully: false } };
    },

    /**
     * Удаляет уведомление.
     * @param notificationId - Идентификатор уведомления.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом удаления.
     */
    deleteNotification: async (notificationId: number): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка удаления уведомления',
            errorText: `Не удалось удалить уведомление`,
        };
        const response = await remove<unknown>(`/${notificationId}`, options);
        if (!response.error) {
            return { data: { successfully: true } };
        }
        return { error: response?.error, data: { successfully: false } };
    },
};
