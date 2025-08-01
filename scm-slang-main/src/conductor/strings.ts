// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

export enum InternalPluginName {
    RUNNER_MAIN = "runner"
}

export enum InternalChannelName {
    FILE = "file",
    CHUNK = "chunk",
    SERVICE = "service",
    STANDARD_IO = "standard_io",
    ERROR = "error",
    STATUS = "status"
} 