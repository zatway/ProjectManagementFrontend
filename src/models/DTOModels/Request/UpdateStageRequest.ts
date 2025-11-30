import type {StageStatus} from "../Еnums/StageStatus.ts";

export interface UpdateStageRequest {
    progressPercent?: number;
    deadline?: string;
    status?: StageStatus;
    specialistUserId?: number;
}
