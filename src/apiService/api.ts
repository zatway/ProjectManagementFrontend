import { authLocalService } from "../storageServices/authLocalService";
import type {RequestOptions, ResponseOptions} from "./ApiService";
import type ApiService from "./ApiService";


/**
 * Утилита для выполнения HTTP-запросов с авторизацией.
 * Предоставляет методы для создания обертки над ApiService с автоматическим добавлением заголовка авторизации.
 */
export const api = {
    /**
     * Создает обертку над ApiService, добавляя заголовок Authorization с токеном, если он доступен.
     * @param service - Экземпляр ApiService для выполнения запросов.
     * @returns Объект с методами get, post, put и remove, включающими заголовок авторизации.
     */
    fetchWithAuthorization: (service: ApiService) => {
        return {
            /**
             * Выполняет GET-запрос с добавлением заголовка авторизации.
             * @param endPoint - Эндпоинт для запроса (необязательный).
             * @param options - Дополнительные опции запроса (необязательные).
             * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
             */
            get: async <TResponse>(endPoint: string, options?: RequestOptions<never>): Promise<ResponseOptions<TResponse>> => {
                const token = authLocalService.getToken();
                const localOptions: RequestOptions<never> = {
                    ...options,
                    headers: token ? { Authorization: `Bearer ${token}`, ...options?.headers } : options?.headers,
                };
                return await service.get<TResponse>(endPoint, localOptions);
            },

            /**
             * Выполняет POST-запрос с добавлением заголовка авторизации.
             * @param endPoint - Эндпоинт для запроса (необязательный).
             * @param body - Тело запроса (необязательное).
             * @param options - Дополнительные опции запроса (необязательные).
             * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
             */
            post: async <TRequest, TResponse>(
                endPoint: string,
                body?: TRequest,
                options?: RequestOptions<never>,
            ): Promise<ResponseOptions<TResponse>> => {
                const token = authLocalService.getToken();
                const localOptions: RequestOptions<never> = {
                    ...options,
                    headers: token ? { Authorization: `Bearer ${token}`, ...options?.headers } : options?.headers,
                };
                return await service.post<TRequest, TResponse>(endPoint, localOptions, body);
            },

            /**
             * Выполняет PATCH-запрос с добавлением заголовка авторизации.
             * @param endPoint - Эндпоинт для запроса (необязательный).
             * @param body - Тело запроса (необязательное).
             * @param options - Дополнительные опции запроса (необязательные).
             * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
             */
            patch: async <TRequest, TResponse>(
                endPoint: string,
                body?: TRequest,
                options?: RequestOptions<never>,
            ): Promise<ResponseOptions<TResponse>> => {
                const token = authLocalService.getToken();
                const localOptions: RequestOptions<never> = {
                    ...options,
                    headers: token ? { Authorization: `Bearer ${token}`, ...options?.headers } : options?.headers,
                };
                return await service.patch<TRequest, TResponse>(endPoint, localOptions, body);
            },

            /**
             * Выполняет DELETE-запрос с добавлением заголовка авторизации.
             * @param endPoint - Эндпоинт для запроса (необязательный).
             * @param options - Дополнительные опции запроса (необязательные).
             * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
             */
            remove: async <TResponse>(endPoint: string, options?: RequestOptions<never>): Promise<ResponseOptions<TResponse>> => {
                const token = authLocalService.getToken();
                const localOptions: RequestOptions<never> = {
                    ...options,
                    headers: token ? { Authorization: `Bearer ${token}`, ...options?.headers } : options?.headers,
                };
                return await service.remove<TResponse>(endPoint, localOptions);
            },

            /**
             * Выполняет PUT-запрос с добавлением заголовка авторизации.
             * @param endPoint - Эндпоинт для запроса (необязательный).
             * @param body - Тело запроса (необязательное).
             * @param options - Дополнительные опции запроса (необязательные).
             * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
             */
            put: async <TRequest, TResponse>(
                endPoint: string,
                body?: TRequest,
                options?: RequestOptions<never>,
            ): Promise<ResponseOptions<TResponse>> => {
                const token = authLocalService.getToken();
                const localOptions: RequestOptions<never> = {
                    ...options,
                    headers: token ? { Authorization: `Bearer ${token}`, ...options?.headers } : options?.headers,
                };
                return await service.put<TRequest, TResponse>(endPoint, localOptions, body);
            },
        };
    },
};
