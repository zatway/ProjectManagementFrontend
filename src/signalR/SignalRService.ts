import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {env} from "../env.ts";
import type {NotificationResponse} from "../models/DTOModels/Response/SignalR/NotificationResponse.ts";
import {authLocalService} from "../storageServices/authLocalService.ts";

export class SignalRService {
    private connection: HubConnection | null = null;
    private readonly hubUrl: string;
    private handlers: Map<string, ((...args: any[]) => void)[]> = new Map();

    constructor() {
        this.hubUrl = `${env.REACT_APP_SERVICE_SERVICE_HOST}${env.REACT_APP_SERVICE_SERVICE_SIGNALR_HUB}`;
        console.log('[SignalR] Hub URL:', this.hubUrl); // Лог URL
    }

    public async connect(): Promise<void> {
        if (this.connection?.state === 'Connected') {
            console.log('[SignalR] Already connected');
            return;
        }

        const token = authLocalService.getToken() || '';
        if (!token) {
            console.error('[SignalR] No access token found in localStorage. Login required.');
            return;
        }
        console.log('[SignalR] Using token:', token ? 'Present' : 'Missing'); // Не логируем сам токен!

        if (this.connection) {
            await this.disconnect();
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.Debug) // Включи Debug для детальных логов SignalR
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        this.registerEventHandlers();

        try {
            await this.connection.start();
            console.log('[SignalR] Connected successfully. Connection ID:', this.connection.connectionId);
            this.notifyReconnectStatus('connected');
        } catch (err) {
            console.error('[SignalR] Connection failed:', err);
            this.notifyReconnectStatus('failed');
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('[SignalR] Disconnected');
            } catch (err) {
                console.error('[SignalR] Disconnect error:', err);
            } finally {
                this.connection = null;
            }
        }
    }

    public on(methodName: string, handler: (...args: any[]) => void): void {
        if (!this.handlers.has(methodName)) {
            this.handlers.set(methodName, []);
        }
        this.handlers.get(methodName)!.push(handler);
        console.log(`[SignalR] Handler registered for: ${methodName}`);
    }

    public off(methodName: string, handler: (...args: any[]) => void): void {
        const handlers = this.handlers.get(methodName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    public offAll(methodName: string): void {
        this.handlers.delete(methodName);
    }

    public getConnectionState(verbose = false) {
        const state = this.connection?.state;
        if (verbose) {
            console.log('[SignalR] Current state:', state);
        }
        return state;
    }

    private registerEventHandlers(): void {
        if (!this.connection) return;

        this.connection.on('ReceiveNotification', (notification: NotificationResponse) => {
            console.log('[SignalR] Received notification:', notification); // КЛЮЧЕВОЙ ЛОГ!
            const handlers = this.handlers.get('ReceiveNotification') || [];
            handlers.forEach(handler => handler(notification));
        });

        this.connection.onclose((error) => {
            console.log('[SignalR] Connection closed:', error);
            this.notifyReconnectStatus('closed');
        });

        this.connection.onreconnecting((error) => {
            console.log('[SignalR] Reconnecting:', error);
            this.notifyReconnectStatus('reconnecting');
        });

        this.connection.onreconnected((connectionId) => {
            console.log('[SignalR] Reconnected:', connectionId);
            this.notifyReconnectStatus('reconnected');
        });
    }

    private notifyReconnectStatus(status: string): void {
        console.log(`[SignalR] Status: ${status}`);
    }

    public dispose(): void {
        this.handlers.clear();
        this.disconnect();
    }
}

export const signalRService = new SignalRService();
