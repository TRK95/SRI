import { Expression } from '../transpiler/types/nodes/scheme-node-types';
import { Instr, InstrType, Node, Value } from './types';

export function astToInstructions(ast: Expression[]): Instr[] {
  const instructions: Instr[] = [];
  
  for (const expr of ast) {
    instructions.push(...expressionToInstructions(expr));
  }
  
  return instructions;
}

function expressionToInstructions(expr: Expression): Instr[] {
  const instructions: Instr[] = [];
  
  if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.NumericLiteral)) {
    const numExpr = expr as any;
    instructions.push({
      instrType: InstrType.LITERAL,
      srcNode: expr,
      value: { type: 'number', value: parseFloat(numExpr.value) }
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.StringLiteral)) {
    const strExpr = expr as any;
    instructions.push({
      instrType: InstrType.LITERAL,
      srcNode: expr,
      value: { type: 'string', value: strExpr.value }
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.BooleanLiteral)) {
    const boolExpr = expr as any;
    instructions.push({
      instrType: InstrType.LITERAL,
      srcNode: expr,
      value: { type: 'boolean', value: boolExpr.value }
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Identifier)) {
    const idExpr = expr as any;
    instructions.push({
      instrType: InstrType.VARIABLE,
      srcNode: expr,
      symbol: idExpr.name
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Definition)) {
    const defExpr = expr as any;
    // Define: evaluate the value, then define the name
    instructions.push(...expressionToInstructions(defExpr.value));
    instructions.push({
      instrType: InstrType.DEFINE,
      srcNode: expr,
      name: defExpr.name.name,
      value: defExpr.value
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Application)) {
    const appExpr = expr as any;
    // Application: evaluate operator and operands, then apply
    instructions.push(...expressionToInstructions(appExpr.operator));
    for (const operand of appExpr.operands) {
      instructions.push(...expressionToInstructions(operand));
    }
    instructions.push({
      instrType: InstrType.APPLICATION,
      srcNode: expr,
      numOfArgs: appExpr.operands.length
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Conditional)) {
    const condExpr = expr as any;
    // Conditional: evaluate test, then branch
    instructions.push(...expressionToInstructions(condExpr.test));
    instructions.push({
      instrType: InstrType.BRANCH,
      srcNode: expr,
      consequent: condExpr.consequent,
      alternate: condExpr.alternate
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Lambda)) {
    const lambdaExpr = expr as any;
    // Lambda: create closure
    instructions.push({
      instrType: InstrType.LAMBDA,
      srcNode: expr,
      params: lambdaExpr.params.map((p: any) => p.name),
      body: [lambdaExpr.body]
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Sequence)) {
    const seqExpr = expr as any;
    // Sequence: evaluate all expressions in sequence
    instructions.push({
      instrType: InstrType.SEQUENCE,
      srcNode: expr,
      expressions: seqExpr.expressions
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Pair)) {
    const pairExpr = expr as any;
    // Pair: evaluate car and cdr, then cons
    instructions.push(...expressionToInstructions(pairExpr.car));
    instructions.push(...expressionToInstructions(pairExpr.cdr));
    instructions.push({
      instrType: InstrType.CONS,
      srcNode: expr,
      car: pairExpr.car,
      cdr: pairExpr.cdr
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Nil)) {
    instructions.push({
      instrType: InstrType.NIL,
      srcNode: expr
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Symbol)) {
    const symExpr = expr as any;
    instructions.push({
      instrType: InstrType.SYMBOL,
      srcNode: expr,
      value: symExpr.value
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Reassignment)) {
    const reassignExpr = expr as any;
    // Set!: evaluate value, then assign
    instructions.push(...expressionToInstructions(reassignExpr.value));
    instructions.push({
      instrType: InstrType.SET,
      srcNode: expr,
      name: reassignExpr.name.name,
      value: reassignExpr.value
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Extended.List)) {
    const listExpr = expr as any;
    // List: evaluate all elements, then create list
    for (const element of listExpr.elements) {
      instructions.push(...expressionToInstructions(element));
    }
    if (listExpr.terminator) {
      instructions.push(...expressionToInstructions(listExpr.terminator));
    }
    instructions.push({
      instrType: InstrType.LIST,
      srcNode: expr,
      elements: listExpr.elements,
      terminator: listExpr.terminator
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Extended.Begin)) {
    const beginExpr = expr as any;
    // Begin: evaluate all expressions in sequence
    instructions.push({
      instrType: InstrType.BEGIN,
      srcNode: expr,
      expressions: beginExpr.expressions
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Extended.Let)) {
    const letExpr = expr as any;
    // Let: evaluate all values, then create new environment
    for (const value of letExpr.values) {
      instructions.push(...expressionToInstructions(value));
    }
    instructions.push({
      instrType: InstrType.LET,
      srcNode: expr,
      identifiers: letExpr.identifiers.map((id: any) => id.name),
      values: letExpr.values,
      body: letExpr.body
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Extended.Cond)) {
    const condExpr = expr as any;
    // Cond: evaluate predicates and consequents
    instructions.push({
      instrType: InstrType.COND,
      srcNode: expr,
      predicates: condExpr.predicates,
      consequents: condExpr.consequents,
      catchall: condExpr.catchall
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Extended.FunctionDefinition)) {
    const funcExpr = expr as any;
    // Function definition: create lambda and define
    const lambda = new (require('../transpiler/types/nodes/scheme-node-types').Atomic.Lambda)(
      funcExpr.location, 
      funcExpr.body, 
      funcExpr.params, 
      funcExpr.rest
    );
    instructions.push(...expressionToInstructions(lambda));
    instructions.push({
      instrType: InstrType.DEFINE,
      srcNode: expr,
      name: funcExpr.name.name,
      value: lambda
    } as any);
  } else if (expr instanceof (require('../transpiler/types/nodes/scheme-node-types').Atomic.Vector)) {
    const vecExpr = expr as any;
    // Vector: evaluate all elements, then create vector
    for (const element of vecExpr.elements) {
      instructions.push(...expressionToInstructions(element));
    }
    instructions.push({
      instrType: InstrType.VECTOR,
      srcNode: expr,
      elements: vecExpr.elements
    } as any);
  } else {
    // Default case: treat as literal
    instructions.push({
      instrType: InstrType.LITERAL,
      srcNode: expr,
      value: { type: 'undefined' }
    } as any);
  }
  
  return instructions;
} 