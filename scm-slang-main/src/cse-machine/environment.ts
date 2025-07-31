import { Value } from './types';

export interface Environment {
  lookup(name: string): Value | undefined;
  define(name: string, value: Value): void;
  assign(name: string, value: Value): boolean;
  extend(names: string[], values: Value[]): Environment;
  getParent(): Environment | null;
  getAllBindings(): Map<string, Value>;
}

export class SchemeEnvironment implements Environment {
  private bindings: Map<string, Value>;
  private parent: Environment | null;

  constructor(parent: Environment | null = null) {
    this.bindings = new Map();
    this.parent = parent;
  }

  lookup(name: string): Value | undefined {
    const value = this.bindings.get(name);
    if (value !== undefined) {
      return value;
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    return undefined;
  }

  define(name: string, value: Value): void {
    this.bindings.set(name, value);
  }

  assign(name: string, value: Value): boolean {
    if (this.bindings.has(name)) {
      this.bindings.set(name, value);
      return true;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    return false;
  }

  extend(names: string[], values: Value[]): Environment {
    const newEnv = new SchemeEnvironment(this);
    for (let i = 0; i < names.length; i++) {
      newEnv.define(names[i], values[i]);
    }
    return newEnv;
  }

  getParent(): Environment | null {
    return this.parent;
  }

  getAllBindings(): Map<string, Value> {
    return new Map(this.bindings);
  }
}

export function createProgramEnvironment(): Environment {
  const env = new SchemeEnvironment();
  
  // Add primitive functions
  env.define('+', { type: 'primitive', name: '+', func: (a: number, b: number) => a + b });
  env.define('-', { type: 'primitive', name: '-', func: (a: number, b: number) => a - b });
  env.define('*', { type: 'primitive', name: '*', func: (a: number, b: number) => a * b });
  env.define('/', { type: 'primitive', name: '/', func: (a: number, b: number) => a / b });
  env.define('=', { type: 'primitive', name: '=', func: (a: number, b: number) => a === b });
  env.define('<', { type: 'primitive', name: '<', func: (a: number, b: number) => a < b });
  env.define('>', { type: 'primitive', name: '>', func: (a: number, b: number) => a > b });
  env.define('<=', { type: 'primitive', name: '<=', func: (a: number, b: number) => a <= b });
  env.define('>=', { type: 'primitive', name: '>=', func: (a: number, b: number) => a >= b });
  
  // List primitives
  env.define('cons', { type: 'primitive', name: 'cons', func: (car: Value, cdr: Value) => ({ type: 'pair', car, cdr }) });
  env.define('car', { type: 'primitive', name: 'car', func: (pair: Value) => {
    if (pair.type === 'pair') return pair.car;
    throw new Error('car: expected pair');
  }});
  env.define('cdr', { type: 'primitive', name: 'cdr', func: (pair: Value) => {
    if (pair.type === 'pair') return pair.cdr;
    throw new Error('cdr: expected pair');
  }});
  
  // Boolean primitives
  env.define('null?', { type: 'primitive', name: 'null?', func: (value: Value) => ({ type: 'boolean', value: value.type === 'nil' }) });
  env.define('pair?', { type: 'primitive', name: 'pair?', func: (value: Value) => ({ type: 'boolean', value: value.type === 'pair' }) });
  env.define('number?', { type: 'primitive', name: 'number?', func: (value: Value) => ({ type: 'boolean', value: value.type === 'number' }) });
  env.define('string?', { type: 'primitive', name: 'string?', func: (value: Value) => ({ type: 'boolean', value: value.type === 'string' }) });
  env.define('boolean?', { type: 'primitive', name: 'boolean?', func: (value: Value) => ({ type: 'boolean', value: value.type === 'boolean' }) });
  
  // Display function
  env.define('display', { type: 'primitive', name: 'display', func: (value: Value) => {
    console.log(valueToString(value));
    return { type: 'undefined' };
  }});
  
  return env;
}

function valueToString(value: Value): string {
  switch (value.type) {
    case 'number':
      return value.value.toString();
    case 'string':
      return value.value;
    case 'boolean':
      return value.value ? '#t' : '#f';
    case 'symbol':
      return value.value;
    case 'nil':
      return '()';
    case 'pair':
      return `(${valueToString(value.car)} . ${valueToString(value.cdr)})`;
    case 'list':
      return `(${value.elements.map(valueToString).join(' ')})`;
    case 'vector':
      return `#(${value.elements.map(valueToString).join(' ')})`;
    case 'closure':
      return '#<procedure>';
    case 'primitive':
      return `#<primitive:${value.name}>`;
    case 'error':
      return `Error: ${value.message}`;
    case 'undefined':
      return '#<undefined>';
    default:
      return String(value);
  }
} 