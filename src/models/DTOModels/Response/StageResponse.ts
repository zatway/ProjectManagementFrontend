import type {StageStatus} from "../Еnums/StageStatus.ts";
import type {StageType} from "../Еnums/StageType.ts";

export interface StageResponse {
    stageId: number;
    projectId: number;
    projectName: string;
    name: string;
    stageType: StageType;
    progressPercent: number;
    status: StageStatus;
    deadline: Date;
    specialistUserFullName: string;
}
