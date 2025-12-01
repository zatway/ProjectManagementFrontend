import {env} from "../env.ts";
import {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import {createApiService} from "../apiService/createApiService.ts";
import type {UserResponse} from "../models/DTOModels/Response/UserResponse.ts";

const {get } = createApiService(env.REACT_APP_SERVICE_SERVICE_HOST + env.REACT_APP_SERVICE_SERVICE_ENDPOINT_USERS);

/**
 * API-сервис для работы с пользоваетелями.
 * Предоставляет методы для получения пользователей.
 */
export const usersApi = {
    /**
     * Эндпоинты для API-запросов этапов.
     */
    endPoints: {
        all: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_USERS_ALL
    },

    /**
     * Получает всех пользователей.
     * @returns {Promise<ResponseOptions<UserResponse[]>>} Промис со списком пользователей.
     */
    getAllSUsers: async (): Promise<ResponseOptions<UserResponse[]>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения этапов',
            errorText: `Не удалось загрузить этапы проекта`,
        };
        const endpoint = usersApi.endPoints.all;
        return await get<UserResponse[]>(endpoint, options);
    },
};
