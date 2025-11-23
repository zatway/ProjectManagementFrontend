import type {Env} from "./vite-env";

export const env: Env = {
    REACT_APP_SERVICE_SERVICE_HOST: 'http://localhost:5274',
    REACT_APP_SERVICE_SERVICE_SIGNALR_HUB: '/hubs/notifications',
    REACT_APP_SERVICE_SERVICE_ENDPOINT_LOGIN: '/login',
    REACT_APP_SERVICE_SERVICE_ENDPOINT_REGISTER: '/register',
    REACT_APP_SERVICE_SERVICE_ENDPOINT_REFRESH_TOKEN: '/refresh'
};

(function () {
    const ev1 = import.meta.env.MODE === 'development' ? env.REACT_APP_SERVICE_SERVICE_HOST : eval('"PROD_ENV_VITE_SERVICES_HOST"');

    env.REACT_APP_SERVICE_SERVICE_HOST = ev1 === '' ? `${window.location.protocol}//${window.location.hostname}:8031` : ev1;
})();
