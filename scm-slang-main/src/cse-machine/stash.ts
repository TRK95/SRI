import { Value, Stash } from './types';

export class SchemeStash implements Stash {
  private stack: Value[] = [];

  push(value: Value): void {
    this.stack.push(value);
  }

  pop(): Value | undefined {
    return this.stack.pop();
  }

  peek(): Value | undefined {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  clear(): void {
    this.stack = [];
  }

  getStack(): Value[] {
    return [...this.stack];
  }
} 