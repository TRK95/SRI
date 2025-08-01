// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IChannelQueue } from "./types";

export class ChannelQueue<T> implements IChannelQueue<T> {
    private queue: T[] = [];
    private listeners: ((message: T) => void)[] = [];

    send(message: T): void {
        this.queue.push(message);
        this.listeners.forEach(listener => listener(message));
    }

    async receive(): Promise<T> {
        if (this.queue.length > 0) {
            return this.queue.shift()!;
        }
        
        return new Promise((resolve) => {
            const listener = (message: T) => {
                this.removeListener(listener);
                resolve(message);
            };
            this.listeners.push(listener);
        });
    }

    tryReceive(): T | undefined {
        return this.queue.shift();
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