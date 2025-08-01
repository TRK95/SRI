// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { runCSEMachine } from "../../../cse-machine/interpreter";
import { Context } from "../../../cse-machine/types";
import { BasicEvaluator } from "../BasicEvaluator";
import { IRunnerPlugin } from "./IRunnerPlugin";
import { IInterfacableEvaluator } from "./IInterfacableEvaluator";
import { parseSchemeDirect } from "../../../direct-parser";
import { Expression } from "../../../transpiler/types/nodes/scheme-node-types";
import { SchemeControl } from "../../../cse-machine/control";
import { SchemeStash } from "../../../cse-machine/stash";
import { createProgramEnvironment } from "../../../cse-machine/environment";
import { SchemeDataHandler } from "../../types/SchemeDataHandler";
import { DataType, TypedValue } from "../../types/IDataHandler";

const defaultContext: Context = {
  control: new SchemeControl(),
  stash: new SchemeStash(),
  environment: createProgramEnvironment(),
  runtime: {
    isRunning: true
  }
};

const defaultOptions = {
  stepLimit: 100000
};

export class SchemeEvaluator extends BasicEvaluator implements IInterfacableEvaluator {
  private context: Context;
  private options: { stepLimit: number };
  private dataHandler: SchemeDataHandler;
  
  constructor(conductor: IRunnerPlugin) {
    super(conductor);
    this.context = defaultContext;
    this.options = defaultOptions;
    this.dataHandler = new SchemeDataHandler();
  }
  
  async evaluateChunk(chunk: string): Promise<void> {
    try {
      const ast = parseSchemeDirect(chunk);
      const result = runCSEMachine(chunk, ast, this.context, this.options);
      
      if (result.status === 'finished') {
        this.conductor.sendOutput(valueToString(result.value));
      } else {
        this.conductor.sendOutput(`Error: ${result.message}`);
      }
    } catch (error) {
      this.conductor.sendOutput(`Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  // IDataHandler implementation
  readonly hasDataInterface = true;

  // Pair operations
  pair_make(head: TypedValue<DataType>, tail: TypedValue<DataType>): string {
    return this.dataHandler.pair_make(head, tail);
  }

  pair_head(p: string): TypedValue<DataType> {
    return this.dataHandler.pair_head(p);
  }

  pair_sethead(p: string, tv: TypedValue<DataType>): void {
    this.dataHandler.pair_sethead(p, tv);
  }

  pair_tail(p: string): TypedValue<DataType> {
    return this.dataHandler.pair_tail(p);
  }

  pair_settail(p: string, tv: TypedValue<DataType>): void {
    this.dataHandler.pair_settail(p, tv);
  }

  pair_assert(p: string, headType?: DataType, tailType?: DataType): void {
    this.dataHandler.pair_assert(p, headType, tailType);
  }

  // Array operations
  array_make<T extends DataType>(t: T, len: number, init?: TypedValue<NoInfer<T>>): string {
    return this.dataHandler.array_make(t, len, init);
  }

  array_length(a: string): number {
    return this.dataHandler.array_length(a);
  }

  array_get(a: string, idx: number): TypedValue<DataType> {
    return this.dataHandler.array_get(a, idx);
  }

  array_type<T extends DataType>(a: string): NoInfer<T> {
    return this.dataHandler.array_type(a);
  }

  array_set(a: string, idx: number, tv: TypedValue<DataType>): void {
    this.dataHandler.array_set(a, idx, tv);
  }

  array_assert<T extends DataType>(a: string, type?: T, length?: number): asserts a is string {
    this.dataHandler.array_assert(a, type, length);
  }

  // Closure operations
  closure_make<T extends any>(sig: T, func: any, dependsOn?: (string | null)[]): string {
    return this.dataHandler.closure_make(sig, func, dependsOn);
  }

  closure_is_vararg(c: string): boolean {
    return this.dataHandler.closure_is_vararg(c);
  }

  closure_arity(c: string): number {
    return this.dataHandler.closure_arity(c);
  }

  async closure_call<T extends DataType>(c: string, args: TypedValue<DataType>[], returnType: T): Promise<TypedValue<NoInfer<T>>> {
    return this.dataHandler.closure_call(c, args, returnType);
  }

  async closure_call_unchecked<T extends DataType>(c: string, args: TypedValue<DataType>[]): Promise<TypedValue<NoInfer<T>>> {
    return this.dataHandler.closure_call_unchecked(c, args);
  }

  closure_arity_assert(c: string, arity: number): void {
    this.dataHandler.closure_arity_assert(c, arity);
  }

  // Opaque operations
  opaque_make(v: any, immutable?: boolean): string {
    return this.dataHandler.opaque_make(v, immutable);
  }

  opaque_get(o: string): any {
    return this.dataHandler.opaque_get(o);
  }

  opaque_update(o: string, v: any): void {
    this.dataHandler.opaque_update(o, v);
  }

  // Lifetime management
  tie(dependent: string, dependee: string | null): void {
    this.dataHandler.tie(dependent, dependee);
  }

  untie(dependent: string, dependee: string | null): void {
    this.dataHandler.untie(dependent, dependee);
  }

  // Standard library functions
  list(...elements: TypedValue<DataType>[]): TypedValue<DataType.LIST> {
    return this.dataHandler.list(...elements);
  }

  is_list(xs: any): boolean {
    return this.dataHandler.is_list(xs);
  }

  list_to_vec(xs: any): TypedValue<DataType>[] {
    return this.dataHandler.list_to_vec(xs);
  }

  async accumulate<T extends Exclude<DataType, DataType.VOID>>(
    op: string, 
    initial: TypedValue<T>, 
    sequence: any, 
    resultType: T
  ): Promise<TypedValue<T>> {
    return this.dataHandler.accumulate(op, initial, sequence, resultType);
  }

  length(xs: any): number {
    return this.dataHandler.length(xs);
  }
}

function valueToString(value: any): string {
  if (value.type === 'number') {
    return value.value.toString();
  } else if (value.type === 'string') {
    return value.value;
  } else if (value.type === 'boolean') {
    return value.value ? '#t' : '#f';
  } else if (value.type === 'symbol') {
    return value.value;
  } else if (value.type === 'nil') {
    return '()';
  } else if (value.type === 'pair') {
    return `(${valueToString(value.car)} . ${valueToString(value.cdr)})`;
  } else if (value.type === 'list') {
    return `(${value.elements.map(valueToString).join(' ')})`;
  } else if (value.type === 'vector') {
    return `#(${value.elements.map(valueToString).join(' ')})`;
  } else if (value.type === 'closure') {
    return '#<procedure>';
  } else if (value.type === 'primitive') {
    return `#<primitive:${value.name}>`;
  } else if (value.type === 'error') {
    return `Error: ${value.message}`;
  } else if (value.type === 'undefined') {
    return '#<undefined>';
  } else {
    return value.toString();
  }
} 