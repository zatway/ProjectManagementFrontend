/// <reference types="vite/client" />
export type Env = {
    REACT_APP_SERVICE_SERVICE_SIGNALR_HUB: string;
    REACT_APP_SERVICE_SERVICE_HOST: string;
    REACT_APP_SERVICE_SERVICE_ENDPOINT_LOGIN: string;
    REACT_APP_SERVICE_SERVICE_ENDPOINT_REGISTER: string;
    REACT_APP_SERVICE_SERVICE_ENDPOINT_REFRESH_TOKEN: string;
};

export {};

declare global {
    interface Window {
        env: {
            VITE_SERVICES_HOST: string;
        };
    }
}
