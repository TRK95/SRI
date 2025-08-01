// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { PluginClass } from "../../conduit/types";
import { ModuleClass } from "../module/types/ModuleClass";

export async function importExternalPlugin(location: string): Promise<PluginClass<any[], any>> {
    // For now, return a placeholder - this would need to be implemented
    // based on the actual module loading mechanism
    throw new Error("External plugin loading not implemented");
}

export async function importExternalModule(location: string): Promise<ModuleClass<any>> {
    // For now, return a placeholder - this would need to be implemented
    // based on the actual module loading mechanism
    throw new Error("External module loading not implemented");
} 