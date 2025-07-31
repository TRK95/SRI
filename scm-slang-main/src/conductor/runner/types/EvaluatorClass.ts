// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IEvaluator } from "./IEvaluator";
import { IRunnerPlugin } from "./IRunnerPlugin";

export type EvaluatorClass = new (conductor: IRunnerPlugin) => IEvaluator; 