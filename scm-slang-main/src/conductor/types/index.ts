export * from "./Chunk";
export * from "./RunnerStatus";
export * from "./IDataHandler";
export * from "./SchemeDataHandler";

// Message types
export interface IChunkMessage {
    chunk: string;
}

export interface IIOMessage {
    message: string;
}

export interface IStatusMessage {
    status: RunnerStatus;
    isActive: boolean;
}

export interface IErrorMessage {
    error: any;
}

export interface IServiceMessage {
    type: ServiceMessageType;
    data: any;
}

export interface HelloServiceMessage extends IServiceMessage {
    type: ServiceMessageType.HELLO;
    data: {
        version: number;
    };
}

export interface AbortServiceMessage extends IServiceMessage {
    type: ServiceMessageType.ABORT;
    data: {
        minVersion: number;
    };
}

export interface EntryServiceMessage extends IServiceMessage {
    type: ServiceMessageType.ENTRY;
    data: string;
}

export interface PluginServiceMessage extends IServiceMessage {
    type: ServiceMessageType.PLUGIN;
    data: string;
}

export enum ServiceMessageType {
    HELLO = "hello",
    ABORT = "abort",
    ENTRY = "entry",
    PLUGIN = "plugin"
} 