import {env} from "../env.ts";
import {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import type {SimpleCommandResult} from "../models/DTOModels/Response/SimpleCommandResult.ts";
import {createApiService} from "../apiService/createApiService.ts";
import type {CreateStageRequest} from "../models/DTOModels/Request/CreateStageRequest.ts";
import type {UpdateStageRequest} from "../models/DTOModels/Request/UpdateStageRequest.ts";
import type {StageResponse} from "../models/DTOModels/Response/StageResponse.ts";
import type {ShortStageResponse} from "../models/DTOModels/Response/ShortStageResponse.ts";

const {get, post, patch, remove} = createApiService(`${env.REACT_APP_SERVICE_SERVICE_HOST}${env.REACT_APP_SERVICE_SERVICE_ENDPOINT_STAGES}`);

/**
 * API-сервис для работы с этапами проектов.
 * Предоставляет методы для создания, получения, обновления и удаления этапов.
 */
export const stagesApi = {
    /**
     * Эндпоинты для API-запросов этапов.
     */
    endPoints: {
        getAll: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_STAGES_GET_ALL,
        detail: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_STAGES_DETAIL,
    },

    /**
     * Создает новый этап в проекте.
     * @param projectId - Идентификатор проекта.
     * @param createData - Данные для создания этапа.
     * @returns {Promise<ResponseOptions<number>>} Промис с ID созданного этапа или ошибкой.
     */
    createStage: async (projectId: number, createData: CreateStageRequest): Promise<ResponseOptions<number>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка создания этапа',
            errorText: `Не удалось создать этап`,
        };
        return await post<CreateStageRequest, number>(`/${projectId}`, createData, options);
    },

    /**
     * Получает все этапы проекта.
     * @param projectId - Идентификатор проекта.
     * @returns {Promise<ResponseOptions<ShortStageResponse[]>>} Промис со списком этапов или ошибкой.
     */
    getAllStages: async (projectId: number): Promise<ResponseOptions<ShortStageResponse[]>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения этапов',
            errorText: `Не удалось загрузить этапы проекта`,
        };
        return await get<ShortStageResponse[]>(`/${projectId}${stagesApi.endPoints.getAll}`, options);
    },

    /**
     * Получает детали этапа по ID.
     * @param stageId - Идентификатор этапа.
     * @returns {Promise<ResponseOptions<StageResponse>>} Промис с деталями этапа или ошибкой.
     */
    getStageDetail: async (stageId: number): Promise<ResponseOptions<StageResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения этапа',
            errorText: `Не удалось получить детали этапа`,
        };
        return await get<StageResponse>(`/${stageId}${stagesApi.endPoints.detail}`, options);
    },

    /**
     * Обновляет существующий этап.
     * @param stageId - Идентификатор этапа.
     * @param updateData - Данные для обновления этапа.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом обновления.
     */
    updateStage: async (stageId: number, updateData: UpdateStageRequest): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка обновления этапа',
            errorText: `Не удалось обновить этап`,
        };
        const response = await patch<UpdateStageRequest, unknown>(`/${stageId}`, updateData, options);
        if (!response.error) {
            return {data: {successfully: true}};
        }
        return {error: response?.error, data: {successfully: false}};
    },

    /**
     * Удаляет этап по ID.
     * @param stageId - Идентификатор этапа.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом удаления.
     */
    deleteStage: async (stageId: number): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка удаления этапа',
            errorText: `Не удалось удалить этап`,
        };
        const response = await remove<unknown>(`/${stageId}`, options);
        if (!response.error) {
            return {data: {successfully: true}};
        }
        return {error: response?.error, data: {successfully: false}};
    },
};
