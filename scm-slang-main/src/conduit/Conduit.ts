// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IPlugin } from "./types/IPlugin";
import { PluginClass } from "./types/PluginClass";

export class Conduit {
    private plugins: Map<string, IPlugin> = new Map();

    registerPlugin<T extends IPlugin>(plugin: T): T {
        this.plugins.set(plugin.name, plugin);
        return plugin;
    }

    unregisterPlugin(plugin: IPlugin): void {
        this.plugins.delete(plugin.name);
    }

    getPlugin(name: string): IPlugin | undefined {
        return this.plugins.get(name);
    }

    getAllPlugins(): IPlugin[] {
        return Array.from(this.plugins.values());
    }
} 