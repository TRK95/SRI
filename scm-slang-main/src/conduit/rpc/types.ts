// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

export type Remote<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R
        ? (...args: A) => Promise<R>
        : never;
}; 