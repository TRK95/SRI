// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IChannel } from "./types";

export class Channel<T> implements IChannel<T> {
    private listeners: ((message: T) => void)[] = [];

    send(message: T): void {
        this.listeners.forEach(listener => listener(message));
    }

    onReceive(listener: (message: T) => void): void {
        this.listeners.push(listener);
    }

    removeListener(listener: (message: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
} 