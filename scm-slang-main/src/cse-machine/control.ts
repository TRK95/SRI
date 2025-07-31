import { Instr, Control } from './types';

export class SchemeControl implements Control {
  private stack: Instr[] = [];

  push(instr: Instr): void {
    this.stack.push(instr);
  }

  pop(): Instr | undefined {
    return this.stack.pop();
  }

  peek(): Instr | undefined {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  clear(): void {
    this.stack = [];
  }

  getStack(): Instr[] {
    return [...this.stack];
  }
} 