// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

export interface IChannel<T> {
    send(message: T): void;
    onReceive(listener: (message: T) => void): void;
    removeListener(listener: (message: T) => void): void;
}

export interface IChannelQueue<T> {
    send(message: T): void;
    receive(): Promise<T>;
    tryReceive(): T | undefined;
    onReceive(listener: (message: T) => void): void;
    removeListener(listener: (message: T) => void): void;
}

export interface IConduit {
    registerPlugin<T extends IPlugin>(plugin: T): T;
    unregisterPlugin(plugin: IPlugin): void;
    getChannel<T>(name: string): IChannel<T>;
    terminate(): void;
}

export interface IPlugin {
    readonly name: string;
}

export interface PluginClass<Arg extends any[], T extends IPlugin> {
    new(...arg: Arg): T;
}

export interface ILink {
    postMessage(message: any): void;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
} 