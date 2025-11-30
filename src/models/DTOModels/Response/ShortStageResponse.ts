import type {StageStatus} from "../Еnums/StageStatus.ts";

export interface ShortStageResponse {
    stageId: number;
    name: string;
    stageType: string;
    progressPercent: number;
    status: StageStatus;
}
