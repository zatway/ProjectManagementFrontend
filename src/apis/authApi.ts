import {env} from "../env.ts";
import type {LoginRequest} from "../models/DTOModels/Request/LoginRequest.ts";
import ApiService, {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import type {LoginResponse} from "../models/DTOModels/Response/LoginResponse.ts";
import {authLocalService} from "../storageServices/authLocalService.ts";
import type {RefreshTokenRequest} from "../models/DTOModels/Request/RefreshTokenRequest.ts";
import type {RegisterRequest} from "../models/DTOModels/Request/RegisterRequest.ts";
import type {SimpleCommandResult} from "../models/DTOModels/Response/SimpleCommandResult.ts";

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
     * @param loginData - Данные для авторизации
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

    /**
     * Получает действующий access token по refreshToken.
     * @param refreshData - Данные для продления сессии.
     * @returns {Promise<ResponseOptions<LoginResponse>>} Промис с токеном авторизации или ошибкой.
     */
    refresh: async (refreshData: RefreshTokenRequest): Promise<ResponseOptions<LoginResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошбика авторизации',
            errorText: `Не удалось обработать обновление сессии`,
        };
        const response = await authService.post<RefreshTokenRequest, LoginResponse>(authApi.endPoints.refresh, options, refreshData);
        if (response.data) authLocalService.setIdentityData(response.data);
        return response;
    },

    /**
     * Выполняет регистрацию в систему с использованием данных для регистрации.
     * @param registerData - Данные для регистрации пользователя
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом авторизации.
     */
    register: async (registerData: RegisterRequest): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошбика авторизации',
            errorText: `Не удалось обработать обновление сессии`,
        };
        const response = await authService.post<RegisterRequest, unknown>(authApi.endPoints.register, options, registerData);
        if (response.data) return {data: {successfully: true}}
        return {error: response?.error, data: {successfully: false}};
    },
};

const authService = new ApiService(env.REACT_APP_SERVICE_SERVICE_HOST);
