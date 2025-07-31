// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IPlugin } from "./IPlugin";

export type PluginClass<Arg extends any[] = any[], T extends IPlugin = IPlugin> = new (...arg: Arg) => T; 