import {ApiError} from "../models/common/ApiError.ts";
import {authLocalService} from "../storageServices/authLocalService.ts";

/**
 * Типы возможных форматов ответа от сервера.
 */
type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

/**
 * Опции для HTTP-запроса.
 * @interface
 * @template T - Тип тела запроса.
 */
export interface RequestOptions<T> {
    /** HTTP-метод запроса. */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    /** Заголовки запроса. */
    headers?: Record<string, string>;
    /** Тело запроса. */
    body?: T;
    /** Контекст ошибки для отображения пользователю. */
    errorContext?: string;
    /** Тип ожидаемого ответа. */
    responseType?: ResponseType;
    /** Пользовательский текст ошибки. */
    errorText?: string;
    /** Флаг для отображения всплывающего уведомления об ошибке. */
    showPopup?: boolean;
    /** Флаг, указывающий, что тело запроса нужно отправлять как FormData ([FromForm]) */
    isFormData?: boolean;
}

/**
 * Результат выполнения HTTP-запроса.
 * @interface
 * @template T - Тип данных ответа.
 */
export interface ResponseOptions<T> {
    /** Данные ответа от сервера. */
    data?: T;
    /** Сообщение об ошибке, если запрос завершился неудачно. */
    error?: {
        displayText: string;
        body?: unknown;
    };
}

/**
 * Класс для выполнения HTTP-запросов к API.
 * Предоставляет методы для выполнения GET, POST, PUT и DELETE запросов с обработкой ошибок и авторизации.
 */
class ApiService {
    private readonly baseUrl: string;

    /**
     * Создает экземпляр ApiService.
     * @param baseUrl - Базовый URL для API-запросов.
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Выполняет HTTP-запрос с обработкой ошибок и авторизации.
     * @param endpoint - Эндпоинт для запроса (необязательный).
     * @param options - Опции запроса, включая метод, заголовки, тело и настройки обработки ошибок.
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом запроса или ошибкой.
     * @template TRequest - Тип тела запроса.
     * @template TResponse - Тип данных ответа.
     */
    private async request<TRequest, TResponse>(
        endpoint?: string,
        options: RequestOptions<TRequest> = {},
    ): Promise<ResponseOptions<TResponse>> {
        const {
            method = 'GET',
            headers = {},
            body,
            errorText,
            responseType = 'json',
            isFormData = false,
        } = options;
        let errorMessage = errorText ? errorText : '';
        let errorBody: unknown;
        try {
            const controller = new AbortController();

            let requestBody: BodyInit | undefined;
            const finalHeaders = {...headers};

            if (body) {
                if (isFormData) {
                    requestBody = body instanceof FormData ? body : this.toFormData(body as Record<string, unknown>);
                } else {
                    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json';
                    requestBody = JSON.stringify(body);
                }
            }
            const response = await fetch(`${this.baseUrl}${endpoint ?? ''}`, {
                method,
                headers: finalHeaders,
                body: requestBody,
                signal: controller.signal,
            });

            if (!response.ok) {
                if (response.status === 401 && authLocalService.getToken() && authLocalService.getRefreshToken()) {
                    // const res = await authApi.refresh({
                    //     token: authLocalService.getToken()!,
                    //     refreshToken: authLocalService.getRefreshToken()!
                    // });
                    // if(!hasValue(res.data)) {
                    //     authLocalService.clearIdentityData();
                    //     window.location.href = '/';
                    // }
                    window.location.href = '/';
                } else {
                    try {
                        errorBody = await response.json();
                    } catch {
                        errorBody = await response.text();
                    }
                    throw new ApiError(errorMessage, response.status);
                }
            }

            const handler = response[responseType as ResponseType]().catch(() => {
                errorMessage = 'Не удалось обработать запрос';
                throw new Error('Не удалось обработать запрос');
            });
            if (response.status === 204) return {data: undefined};
            const data = (await handler) as TResponse;

            return {data: data};
        } catch (error) {
            console.log(error);
            return {error: {displayText: errorMessage, body: errorBody}};
        }
    }

    /**
     * Выполняет преобразование объекта в FormData
     * @param obj - Объект который надо преобразовать.
     * @returns {FormData} Преобразованная FormData
     */
    private toFormData(obj: Record<string, unknown>): FormData {
        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            if (value instanceof Blob || value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((v) => formData.append(key, v));
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        return formData;
    }

    /**
     * Выполняет GET-запрос.
     * @param endpoint - Эндпоинт для запроса.
     * @param requestOptions - Дополнительные опции запроса (необязательные).
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом GET-запроса или ошибкой.
     * @template TResponse - Тип данных ответа.
     */
    public get<TResponse>(endpoint: string, requestOptions?: RequestOptions<never>): Promise<ResponseOptions<TResponse>> {
        return this.request<never, TResponse>(endpoint, {method: 'GET', ...requestOptions});
    }

    /**
     * Выполняет POST-запрос.
     * @param endpoint - Эндпоинт для запроса.
     * @param requestOptions - Дополнительные опции запроса (необязательные).
     * @param body - Тело запроса (необязательное).
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом POST-запроса или ошибкой.
     * @template TRequest - Тип тела запроса.
     * @template TResponse - Тип данных ответа.
     */
    public post<TRequest, TResponse>(
        endpoint: string,
        requestOptions?: RequestOptions<never>,
        body?: TRequest,
    ): Promise<ResponseOptions<TResponse>> {
        return this.request<TRequest, TResponse>(endpoint, {method: 'POST', body, ...requestOptions});
    }

    /**
     * Выполняет PATCH-запрос.
     * @param endpoint - Эндпоинт для запроса.
     * @param requestOptions - Дополнительные опции запроса (необязательные).
     * @param body - Тело запроса (необязательное).
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом PATCH-запроса или ошибкой.
     * @template TRequest - Тип тела запроса.
     * @template TResponse - Тип данных ответа.
     */
    public patch<TRequest, TResponse>(
        endpoint: string,
        requestOptions?: RequestOptions<never>,
        body?: TRequest,
    ): Promise<ResponseOptions<TResponse>> {
        return this.request<TRequest, TResponse>(endpoint, {method: 'PATCH', body, ...requestOptions});
    }

    /**
     * Выполняет PUT-запрос.
     * @param endpoint - Эндпоинт для запроса.
     * @param requestOptions - Дополнительные опции запроса (необязательные).
     * @param body - Тело запроса (необязательное).
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом PUT-запроса или ошибкой.
     * @template TRequest - Тип тела запроса.
     * @template TResponse - Тип данных ответа.
     */
    public put<TRequest, TResponse>(
        endpoint: string,
        requestOptions?: RequestOptions<never>,
        body?: TRequest,
    ): Promise<ResponseOptions<TResponse>> {
        return this.request<TRequest, TResponse>(endpoint, {method: 'PUT', body, ...requestOptions});
    }

    /**
     * Выполняет DELETE-запрос.
     * @param endpoint - Эндпоинт для запроса.
     * @param requestOptions - Дополнительные опции запроса (необязательные).
     * @returns {Promise<ResponseOptions<TResponse>>} Промис с результатом DELETE-запроса или ошибкой.
     * @template TResponse - Тип данных ответа.
     */
    public remove<TResponse>(endpoint: string, requestOptions?: RequestOptions<never>): Promise<ResponseOptions<TResponse>> {
        return this.request<never, TResponse>(endpoint, {method: 'DELETE', ...requestOptions});
    }
}

export default ApiService;
