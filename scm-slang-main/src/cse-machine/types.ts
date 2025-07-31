import { Expression } from '../transpiler/types/nodes/scheme-node-types';
import { Environment } from './environment';

export type Node = { isEnvDependent?: boolean } & (
    | Expression
    | StatementSequence
);

export interface StatementSequence {
    type: 'StatementSequence';
    body: Expression[];
    location: any;
}

export enum InstrType {
    RESET = 'Reset',
    WHILE = 'While',
    FOR = 'For',
    ASSIGNMENT = 'Assignment',
    APPLICATION = 'Application',
    UNARY_OP = 'UnaryOperation',
    BINARY_OP = 'BinaryOperation',
    BOOL_OP = 'BoolOperation',
    COMPARE = 'Compare',
    CALL = 'Call',
    RETURN = 'Return',
    BREAK = 'Break',
    CONTINUE = 'Continue',
    IF = 'If',
    FUNCTION_DEF = 'FunctionDef',
    LAMBDA = 'Lambda',
    MULTI_LAMBDA = 'MultiLambda',
    GROUPING = 'Grouping',
    LITERAL = 'Literal',
    VARIABLE = 'Variable',
    TERNARY = 'Ternary',
    PASS = 'Pass',
    ASSERT = 'Assert',
    IMPORT = 'Import',
    GLOBAL = 'Global',
    NONLOCAL = 'NonLocal',
    Program = 'Program',
    BRANCH = 'Branch',
    POP = 'Pop',
    ENVIRONMENT = 'environment',
    MARKER = 'marker',
    // Scheme-specific instructions
    DEFINE = 'Define',
    SET = 'Set',
    COND = 'Cond',
    LET = 'Let',
    BEGIN = 'Begin',
    DELAY = 'Delay',
    PAIR = 'Pair',
    LIST = 'List',
    VECTOR = 'Vector',
    SYMBOL = 'Symbol',
    NIL = 'Nil',
    CAR = 'Car',
    CDR = 'Cdr',
    CONS = 'Cons',
    SEQUENCE = 'Sequence',
}

interface BaseInstr {
  instrType: InstrType
  srcNode: Node
  isEnvDependent?: boolean
}

export interface WhileInstr extends BaseInstr {
  test: Expression
  body: Expression
}

export interface ForInstr extends BaseInstr {
  init: Expression
  test: Expression
  update: Expression
  body: Expression
}

export interface AssmtInstr extends BaseInstr {
  symbol: string
  constant: boolean
  declaration: boolean
}

export interface UnOpInstr extends BaseInstr {
  symbol: string
}

export interface BinOpInstr extends BaseInstr {
  symbol: string
}

export interface AppInstr extends BaseInstr {
  numOfArgs: number
  srcNode: Expression
}

export interface BranchInstr extends BaseInstr {
  consequent: Expression
  alternate: Expression | null | undefined
}

export interface EnvInstr extends BaseInstr {
  env: Environment
}

export interface ArrLitInstr extends BaseInstr {
  arity: number
}

export interface DefineInstr extends BaseInstr {
  name: string
  value: Expression
}

export interface SetInstr extends BaseInstr {
  name: string
  value: Expression
}

export interface CondInstr extends BaseInstr {
  predicates: Expression[]
  consequents: Expression[]
  catchall?: Expression
}

export interface LetInstr extends BaseInstr {
  identifiers: string[]
  values: Expression[]
  body: Expression
}

export interface BeginInstr extends BaseInstr {
  expressions: Expression[]
}

export interface DelayInstr extends BaseInstr {
  expression: Expression
}

export interface PairInstr extends BaseInstr {
  car: Expression
  cdr: Expression
}

export interface ListInstr extends BaseInstr {
  elements: Expression[]
  terminator?: Expression
}

export interface VectorInstr extends BaseInstr {
  elements: Expression[]
}

export interface SymbolInstr extends BaseInstr {
  value: string
}

export interface NilInstr extends BaseInstr {
}

export interface CarInstr extends BaseInstr {
  pair: Expression
}

export interface CdrInstr extends BaseInstr {
  pair: Expression
}

export interface ConsInstr extends BaseInstr {
  car: Expression
  cdr: Expression
}

export interface SequenceInstr extends BaseInstr {
  expressions: Expression[]
}

export type Instr =
  | BaseInstr
  | WhileInstr
  | AssmtInstr
  | AppInstr
  | BranchInstr
  | EnvInstr
  | ArrLitInstr
  | DefineInstr
  | SetInstr
  | CondInstr
  | LetInstr
  | BeginInstr
  | DelayInstr
  | PairInstr
  | ListInstr
  | VectorInstr
  | SymbolInstr
  | NilInstr
  | CarInstr
  | CdrInstr
  | ConsInstr
  | UnOpInstr
  | BinOpInstr
  | SequenceInstr;

// Value types for Scheme
export type Value = 
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'symbol'; value: string }
  | { type: 'nil' }
  | { type: 'pair'; car: Value; cdr: Value }
  | { type: 'list'; elements: Value[] }
  | { type: 'vector'; elements: Value[] }
  | { type: 'closure'; params: string[]; body: Expression[]; env: Environment }
  | { type: 'primitive'; name: string; func: Function }
  | { type: 'error'; message: string }
  | { type: 'undefined' }
  | { type: 'opaque'; data: any };

// Context for CSE machine
export interface Context {
  control: Control;
  stash: Stash;
  environment: Environment;
  runtime: {
    isRunning: boolean;
  };
}

// Control stack
export interface Control {
  push(instr: Instr): void;
  pop(): Instr | undefined;
  peek(): Instr | undefined;
  isEmpty(): boolean;
  clear(): void;
  getStack(): Instr[];
}

// Stash for values
export interface Stash {
  push(value: Value): void;
  pop(): Value | undefined;
  peek(): Value | undefined;
  isEmpty(): boolean;
  clear(): void;
  getStack(): Value[];
}

// Result types
export interface Finished {
  status: 'finished';
  value: Value;
  representation: Value;
}

export interface Error {
  status: 'error';
  message: string;
}

export type Result = Finished | Error; 