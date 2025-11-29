export enum UserRole {
    /// <summary>
    /// Полный доступ (CRUD проектов/этапов)
    /// </summary>
    Administrator = 'Administrator',

    /// <summary>
    /// Просмотр/редактирование этапов, генерация отчётов
    /// </summary>
    Specialist = 'Specialist',
}
