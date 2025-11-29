export enum StageStatus {
    /// <summary>
    /// Ожидает начала выполнения
    /// </summary>
    Pending = 'Pending',

    /// <summary>
    /// Находится в процессе выполнения
    /// </summary>
    InProgress = 'InProgress',

    /// <summary>
    /// Выполнение этапа завершено
    /// </summary>
    Completed = 'Completed',

    /// <summary>
    /// Срок выполнения просрочен
    /// </summary>
    Delayed = 'Delayed'
}
