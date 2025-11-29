/**
 * Создание api сервиса с настроенным baseUrl
 * @param baseUrl - базовый адрес запросов, например (имя_хоста/контроллер/)
 * @returns функции с настроенным токеном:
 * - функция выполняющая GET запрос 'get()'
 * - функция выполняющая POST запрос 'post()'
 * - функция выполняющая PUT запрос 'put()'
 * - функция выполняющая DELETE запрос 'remove()'
 */
import ApiService from "./ApiService.ts";
import {api} from "./api.ts";


export const createApiService = (baseUrl: string) => {
    const service = new ApiService(baseUrl);
    return api.fetchWithAuthorization(service);
};
