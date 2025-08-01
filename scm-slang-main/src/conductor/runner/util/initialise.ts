// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { Conduit } from "../../../conduit/Conduit";
import { RunnerPlugin } from "../RunnerPlugin";
import { EvaluatorClass } from "../types/EvaluatorClass";
import { IConduit, ILink } from "../../../conduit/types";
import { IRunnerPlugin } from "../types/IRunnerPlugin";

/**
 * Initialise this runner with the evaluator to be used.
 * @param evaluatorClass The Evaluator to be used on this runner.
 * @param link The underlying communication link.
 * @returns The initialised `runnerPlugin` and `conduit`.
 */
export function initialise(evaluatorClass: EvaluatorClass, link: ILink = self as ILink): { runnerPlugin: IRunnerPlugin, conduit: IConduit } {
    const conduit = new Conduit();
    
    // Create channels
    const fileChannel = conduit.getChannel("file");
    const chunkChannel = conduit.getChannel("chunk");
    const serviceChannel = conduit.getChannel("service");
    const ioChannel = conduit.getChannel("standard_io");
    const errorChannel = conduit.getChannel("error");
    const statusChannel = conduit.getChannel("status");
    
    const runnerPlugin = new RunnerPlugin(
        conduit,
        [fileChannel, chunkChannel, serviceChannel, ioChannel, errorChannel, statusChannel],
        evaluatorClass
    );
    
    conduit.registerPlugin(runnerPlugin);
    
    return { runnerPlugin, conduit };
} 