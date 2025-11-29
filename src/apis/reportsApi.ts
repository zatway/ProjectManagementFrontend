import {env} from "../env.ts";
import {type RequestOptions, type ResponseOptions} from "../apiService/ApiService.ts";
import {createApiService} from "../apiService/createApiService.ts";
import type {GenerateReportRequest} from "../models/DTOModels/Request/GenerateReportRequest.ts";
import type {ReportResponse} from "../models/DTOModels/Response/ReportResponse.ts";
import type {ShortProjectResponse} from "../models/DTOModels/Response/ShortReportResponse.ts";

const { get, post } = createApiService(env.REACT_APP_SERVICE_SERVICE_HOST);

/**
 * API-сервис для работы с отчетами.
 * Предоставляет методы для генерации, скачивания и получения списка отчетов.
 */
export const reportsApi = {
    /**
     * Эндпоинты для API-запросов отчетов.
     */
    endPoints: {
        base: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_REPORTS,
        generate: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_REPORTS_GENERATE,
        download: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_REPORTS_DOWNLOAD,
        projectReports: env.REACT_APP_SERVICE_SERVICE_ENDPOINT_PROJECTS_STAGES,
    },

    /**
     * Запускает асинхронную генерацию нового отчета.
     * @param generateData - Данные для генерации отчета.
     * @returns {Promise<ResponseOptions<ReportResponse>>} Промис с информацией о сгенерированном отчете или ошибкой.
     */
    generateReport: async (generateData: GenerateReportRequest): Promise<ResponseOptions<ReportResponse>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка генерации отчета',
            errorText: `Не удалось запустить генерацию отчета`,
        };
        const endpoint = `${reportsApi.endPoints.base}${reportsApi.endPoints.generate}`;
        return await post<GenerateReportRequest, ReportResponse>(endpoint,generateData, options);
    },

    /**
     * Скачивает готовый файл отчета по его ID.
     * @param reportId - Идентификатор отчета.
     * @returns {Promise<ResponseOptions<Blob>>} Промис с blob-файлом отчета или ошибкой.
     */
    downloadReport: async (reportId: number): Promise<ResponseOptions<Blob>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка скачивания отчета',
            errorText: `Не удалось скачать отчет`,
            responseType: 'blob',
        };
        const endpoint = `${reportsApi.endPoints.base}/${reportId}${reportsApi.endPoints.download}`;
        return await get<Blob>(endpoint, options);
    },

    /**
     * Получает список отчетов по проекту.
     * @param projectId - Идентификатор проекта.
     * @returns {Promise<ResponseOptions<ShortProjectResponse[]>>} Промис со списком отчетов или ошибкой.
     */
    getReportsByProject: async (projectId: number): Promise<ResponseOptions<ShortProjectResponse[]>> => {
        const options: RequestOptions<never> = {
            errorContext: 'Ошибка получения отчетов',
            errorText: `Не удалось загрузить отчеты проекта`,
        };
        const endpoint = `${reportsApi.endPoints.projectReports}/${projectId}/reports`;
        return await get<ShortProjectResponse[]>(endpoint, options);
    },
};
