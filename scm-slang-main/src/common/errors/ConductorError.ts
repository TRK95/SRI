// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

export class ConductorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConductorError";
    }
} 