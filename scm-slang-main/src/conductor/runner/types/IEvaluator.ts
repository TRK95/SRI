// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IRunnerPlugin } from "./IRunnerPlugin";

export interface IEvaluator {
    readonly conductor: IRunnerPlugin;

    /**
     * Starts the evaluator with the given entry point.
     * @param entryPoint The entry point file name.
     * @returns A promise that resolves when the evaluator starts.
     */
    startEvaluator(entryPoint: string): Promise<void>;

    /**
     * Evaluates a file.
     * @param fileName The name of the file to be evaluated.
     * @param fileContent The content of the file to be evaluated.
     * @returns A promise that resolves when the evaluation is complete.
     */
    evaluateFile(fileName: string, fileContent: string): Promise<void>;

    /**
     * Evaluates a chunk.
     * @param chunk The chunk to be evaluated.
     * @returns A promise that resolves when the evaluation is complete.
     */
    evaluateChunk(chunk: string): Promise<void>;
} 