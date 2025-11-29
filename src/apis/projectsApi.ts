import {env} from "../env.ts";
import ApiService, {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import type {CreateProjectRequest} from "../models/DTOModels/Request/CreateProjectRequest.ts";
import type {UpdateProjectRequest} from "../models/DTOModels/Request/UpdateProjectRequest.ts";
import type {SimpleCommandResult} from "../models/DTOModels/Response/SimpleCommandResult.ts";
import type {ProjectResponse} from "../models/DTOModels/Response/ReportResponse.ts";
import type {ShortProjectResponse} from "../models/DTOModels/Response/ShortReportResponse.ts";

/**
 * API-сервис для работы с проектами.
 * Предоставляет методы для создания, обновления, удаления и получения проектов.
 */
export const projectApi = {
    /**
     * Эндпоинты для API-запросов проектов.
     */
    endPoints: {
        all: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS_ALL,
        create: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS_CREATE,
        update: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS_UPDATE,
        delete: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS_DELETE,
    },

    /**
     * Получает детали проекта по ID.
     * @param id - Идентификатор проекта.
     * @returns {Promise<ResponseOptions<ProjectResponse>>} Промис с деталями проекта или ошибкой.
     */
    getDetailsProject: async (id: number): Promise<ResponseOptions<ProjectResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения проекта',
            errorText: `Не удалось получить детали проекта`,
        };
        return await projectService.get<ProjectResponse>(`/${id}`, options);
    },

    /**
     * Получает список всех проектов.
     * @returns {Promise<ResponseOptions<ShortProjectResponse>>} Промис со списком проектов или ошибкой.
     */
    getAllProjects: async (): Promise<ResponseOptions<ShortProjectResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения проектов',
            errorText: `Не удалось загрузить список проектов`,
        };
        return await projectService.get<ShortProjectResponse>(projectApi.endPoints.all, options);
    },

    /**
     * Создает новый проект.
     * @param createData - Данные для создания проекта.
     * @returns {Promise<ResponseOptions<number>>} Промис с ID созданного проекта или ошибкой.
     */
    createProject: async (createData: CreateProjectRequest): Promise<ResponseOptions<number>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка создания проекта',
            errorText: `Не удалось создать проект`,
        };
        return await projectService.post<CreateProjectRequest, number>(projectApi.endPoints.create, options, createData);
    },

    /**
     * Обновляет существующий проект.
     * @param id - Идентификатор проекта.
     * @param updateData - Данные для обновления проекта.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом обновления.
     */
    updateProject: async (id: number, updateData: UpdateProjectRequest): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка обновления проекта',
            errorText: `Не удалось обновить проект`,
        };
        const endpoint = `${projectApi.endPoints.update}/${id}`;
        const response = await projectService.patch<UpdateProjectRequest, unknown>(endpoint, options, updateData);
        if (!response.error) {
            return { data: { successfully: true } };
        }
        return { error: response?.error, data: { successfully: false } };
    },

    /**
     * Удаляет проект по ID.
     * @param id - Идентификатор проекта.
     * @returns {Promise<ResponseOptions<SimpleCommandResult>>} Промис с результатом удаления.
     */
    deleteProject: async (id: number): Promise<ResponseOptions<SimpleCommandResult>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка удаления проекта',
            errorText: `Не удалось удалить проект`,
        };
        const endpoint = `${projectApi.endPoints.delete}/${id}`;
        const response = await projectService.remove<unknown>(endpoint, options);
        if (!response.error) {
            return { data: { successfully: true } };
        }
        return { error: response?.error, data: { successfully: false } };
    },
};

const projectService = new ApiService(`${env.REACT_APP_SERVICE_SERVICE_HOST}${env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS}`);
