import type {StageStatus} from "../Еnums/StageStatus.ts";

export interface UpdateStageRequest {
    progressPercent?: number;
    deadline?: Date | string;
    status?: StageStatus;
    specialistUserId?: number;
}
