// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IConduit, IChannel, IPlugin } from "./types";
import { Channel } from "./Channel";

export class Conduit implements IConduit {
    private channels: Map<string, IChannel<any>> = new Map();
    private plugins: Map<string, IPlugin> = new Map();

    registerPlugin<T extends IPlugin>(plugin: T): T {
        this.plugins.set(plugin.name, plugin);
        return plugin;
    }

    unregisterPlugin(plugin: IPlugin): void {
        this.plugins.delete(plugin.name);
    }

    getChannel<T>(name: string): IChannel<T> {
        if (!this.channels.has(name)) {
            this.channels.set(name, new Channel<T>());
        }
        return this.channels.get(name)!;
    }

    terminate(): void {
        // Clean up resources
        this.channels.clear();
        this.plugins.clear();
    }
} 