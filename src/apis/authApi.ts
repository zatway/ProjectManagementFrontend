import {env} from "../env.ts";
import type {LoginRequest} from "../models/DTOModels/Request/LoginRequest.ts";
import ApiService, {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import type {LoginResponse} from "../models/DTOModels/Response/LoginResponse.ts";

/**
 * API-сервис для работы с аутентификацией.
 * Предоставляет методы для входа в систему, выхода и обновления токена авторизации.
 */
export const authApi = {
    /**
     * Эндпоинты для API-запросов аутентификации.
     */
    endPoints: {
        login: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_LOGIN,
        register: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_REGISTER,
        refresh: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_REFRESH_TOKEN,
    },

    /**
     * Выполняет вход в систему с использованием данных авторизации.
     * Сохраняет полученный токен в локальном хранилище, если запрос успешен.
     * @param loginData - Данные для авторизации (например, логин и пароль или refresh-токен).
     * @returns {Promise<ResponseOptions<LoginResponse>>} Промис с токеном авторизации или ошибкой.
     */
    login: async (loginData: LoginRequest): Promise<ResponseOptions<LoginResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошбика авторизации',
            errorText: `Не удалось обработать запрос авторизации`,
        };
        const response = await authService.post<LoginRequest, LoginResponse>(authApi.endPoints.login, options, loginData);
        if (response.data) authLocalService.setIdentityData(response.data);
        return response;
    },

};

const authService = new ApiService(env.REACT_APP_SERVICE_SERVICE_HOST);
