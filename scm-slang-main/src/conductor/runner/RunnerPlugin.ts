// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IPlugin } from "../../conduit/types/IPlugin";
import { IRunnerPlugin } from "./types/IRunnerPlugin";
import { IEvaluator } from "./types/IEvaluator";
import { EvaluatorClass } from "./types/EvaluatorClass";
import { ConductorError } from "../../common/errors/ConductorError";
import { Chunk, RunnerStatus } from "../types";

export class RunnerPlugin implements IRunnerPlugin {
    readonly name = "runner";
    private evaluator: IEvaluator | null = null;
    private isRunning = false;

    constructor(
        private conduit: any,
        private EvaluatorClass: EvaluatorClass
    ) {
        this.evaluator = new EvaluatorClass(this);
    }

    async requestFile(fileName: string): Promise<string | undefined> {
        // For now, return undefined - file reading would need to be implemented
        return undefined;
    }

    async requestChunk(): Promise<Chunk> {
        // For now, return empty string - chunk handling would need to be implemented
        return "";
    }

    async requestInput(): Promise<string> {
        // For now, return empty string - input handling would need to be implemented
        return "";
    }

    tryRequestInput(): string | undefined {
        // For now, return undefined - input handling would need to be implemented
        return undefined;
    }

    sendOutput(message: string): void {
        console.log(message);
    }

    sendError(error: ConductorError): void {
        console.error(error.message);
    }

    updateStatus(status: RunnerStatus, isActive: boolean): void {
        this.isRunning = isActive && status === "running";
    }

    hostLoadPlugin(pluginName: string): void {
        // For now, do nothing - plugin loading would need to be implemented
    }

    registerPlugin<Arg extends any[], T extends IPlugin>(pluginClass: any, ...arg: Arg): T {
        const plugin = new pluginClass(...arg);
        this.conduit.registerPlugin(plugin);
        return plugin;
    }

    unregisterPlugin(plugin: IPlugin): void {
        this.conduit.unregisterPlugin(plugin);
    }

    registerModule<T extends any>(moduleClass: any): T {
        const module = new moduleClass();
        this.conduit.registerPlugin(module);
        return module;
    }

    unregisterModule(module: any): void {
        this.conduit.unregisterPlugin(module);
    }

    async importAndRegisterExternalPlugin(location: string, ...arg: any[]): Promise<IPlugin> {
        // For now, throw error - external plugin loading would need to be implemented
        throw new Error("External plugin loading not implemented");
    }

    async importAndRegisterExternalModule(location: string): Promise<any> {
        // For now, throw error - external module loading would need to be implemented
        throw new Error("External module loading not implemented");
    }
} 