// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IChannel } from "../types";
import { Remote } from "./types";

export function makeRpc<T>(channel: IChannel<any>): Remote<T> {
    return new Proxy({} as Remote<T>, {
        get(target, prop) {
            return async (...args: any[]) => {
                const response = await new Promise((resolve, reject) => {
                    const listener = (message: any) => {
                        channel.removeListener(listener);
                        if (message.error) {
                            reject(new Error(message.error));
                        } else {
                            resolve(message.result);
                        }
                    };
                    channel.onReceive(listener);
                    
                    channel.send({
                        method: prop as string,
                        args,
                        id: Date.now().toString()
                    });
                });
                return response;
            };
        }
    });
} 