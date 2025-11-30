import type {StageStatus} from "../Еnums/StageStatus.ts";
import type {StageType} from "../Еnums/StageType.ts";

export interface CreateStageRequest {
    name: string;
    stageType: StageType;
    progressPercent: number;
    deadline: string;
    status: StageStatus;
    specialistUserId: number;
}
