import type {StageStatus} from "../Еnums/StageStatus.ts";
import type {StageType} from "../Еnums/StageType.ts";

export interface ShortStageResponse {
    stageId: number;
    name: string;
    stageType: StageType;
    progressPercent: number;
    status: StageStatus;
}
