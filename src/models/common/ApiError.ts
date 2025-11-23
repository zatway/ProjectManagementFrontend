import {ErrorTitles} from "./enums/ErrorTitles.ts";

export class ApiError extends Error {
    title: ErrorTitles;
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.title = mapErrorParams(status);
        this.status = status;
    }
}

const mapErrorParams = (status: number) => {
    switch (status) {
        case 401:
            return ErrorTitles.UNAUTHORIZED;
        case 403:
            return ErrorTitles.PERMISSION_DENIED;
        case 404:
            return ErrorTitles.NOT_FOUND;
        case 500:
            return ErrorTitles.SERVER_ERROR;
        default:
            return ErrorTitles.GENERIC;
    }
};
