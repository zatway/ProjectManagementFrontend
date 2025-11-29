export enum ReportStatus {
    /// <summary>
    /// Генерация запрошена и ожидает обработки.
    /// </summary>
    Pending = 'Pending',

    /// <summary>
    /// Отчет находится в процессе генерации.
    /// </summary>
    InProgress = 'InProgress',

    /// <summary>
    /// Генерация успешно завершена, файл доступен для скачивания.
    /// </summary>
    Complete = 'Complete',

    /// <summary>
    /// Генерация завершилась с ошибкой.
    /// </summary>
    Failed = 'Failed'
}
