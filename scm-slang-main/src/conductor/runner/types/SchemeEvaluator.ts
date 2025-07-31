import { runCSEMachine } from "../../../cse-machine/interpreter";
import { Context } from "../../../cse-machine/types";
import { BasicEvaluator } from "../BasicEvaluator";
import { IRunnerPlugin } from "./IRunnerPlugin";
import { parseSchemeDirect } from "../../../direct-parser";
import { Expression } from "../../../transpiler/types/nodes/scheme-node-types";
import { SchemeControl } from "../../../cse-machine/control";
import { SchemeStash } from "../../../cse-machine/stash";
import { createProgramEnvironment } from "../../../cse-machine/environment";

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

export class SchemeEvaluator extends BasicEvaluator {
  private context: Context;
  private options: { stepLimit: number };
  
  constructor(conductor: IRunnerPlugin) {
    super(conductor);
    this.context = defaultContext;
    this.options = defaultOptions;
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