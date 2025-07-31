// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { ConductorError } from "./ConductorError";

export class ConductorInternalError extends ConductorError {
    constructor(message: string) {
        super(message);
        this.name = "ConductorInternalError";
    }
} 