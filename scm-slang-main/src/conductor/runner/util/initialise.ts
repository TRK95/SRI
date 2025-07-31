// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { Conduit } from "../../../conduit/Conduit";
import { RunnerPlugin } from "../RunnerPlugin";
import { EvaluatorClass } from "../types/EvaluatorClass";

export function initialise<T extends EvaluatorClass>(EvaluatorClass: T) {
    const conduit = new Conduit();
    const runnerPlugin = new RunnerPlugin(conduit, EvaluatorClass);
    conduit.registerPlugin(runnerPlugin);
    return { runnerPlugin, conduit };
} 