// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IModulePlugin } from "../IModulePlugin";

export type ModuleClass<T extends IModulePlugin> = {
    new(evaluator: any): T;
}; 