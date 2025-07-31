import { Context, Value, Result, Finished, Error, Instr, InstrType } from './types';
import { SchemeControl } from './control';
import { SchemeStash } from './stash';
import { createProgramEnvironment } from './environment';
import { astToInstructions } from './ast-to-instr';
import { parseSchemeDirect } from '../direct-parser';
import { Expression } from '../transpiler/types/nodes/scheme-node-types';

export function runCSEMachine(
  code: string,
  ast: Expression[],
  context: Context,
  options: { stepLimit?: number } = {}
): Result {
  const { stepLimit = 100000 } = options;
  
  try {
    // Convert AST to instructions
    const instructions = astToInstructions(ast);
    
    // Initialize CSE machine
    context.control.clear();
    context.stash.clear();
    
    // Push instructions onto control stack (in reverse order)
    for (let i = instructions.length - 1; i >= 0; i--) {
      context.control.push(instructions[i]);
    }
    
    // Execute instructions
    let stepCount = 0;
    while (!context.control.isEmpty() && stepCount < stepLimit) {
      const instruction = context.control.pop();
      if (!instruction) break;
      
      executeInstruction(instruction, context);
      stepCount++;
    }
    
    if (stepCount >= stepLimit) {
      return {
        status: 'error',
        message: 'Step limit exceeded'
      };
    }
    
    // Get result from stash
    const result = context.stash.pop();
    if (!result) {
      return {
        status: 'error',
        message: 'No result found'
      };
    }
    
    return {
      status: 'finished',
      value: result,
      representation: result
    };
    
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : String(err)
    };
  }
}

function executeInstruction(instruction: Instr, context: Context): void {
  switch (instruction.instrType) {
    case InstrType.LITERAL:
      const literalInstr = instruction as any;
      context.stash.push(literalInstr.value);
      break;
      
    case InstrType.VARIABLE:
      const variableInstr = instruction as any;
      const value = context.environment.lookup(variableInstr.symbol);
      if (value === undefined) {
        throw new Error(`Unbound variable: ${variableInstr.symbol}`);
      }
      context.stash.push(value);
      break;
      
    case InstrType.DEFINE:
      const defineInstr = instruction as any;
      const valueToDefine = context.stash.pop();
      if (valueToDefine === undefined) {
        throw new Error('No value to define');
      }
      context.environment.define(defineInstr.name, valueToDefine);
      context.stash.push({ type: 'undefined' });
      break;
      
    case InstrType.SET:
      const setInstr = instruction as any;
      const valueToSet = context.stash.pop();
      if (valueToSet === undefined) {
        throw new Error('No value to set');
      }
      const success = context.environment.assign(setInstr.name, valueToSet);
      if (!success) {
        throw new Error(`Cannot set undefined variable: ${setInstr.name}`);
      }
      context.stash.push({ type: 'undefined' });
      break;
      
    case InstrType.APPLICATION:
      const appInstr = instruction as any;
      const args: Value[] = [];
      
      // Pop arguments from stash
      for (let i = 0; i < appInstr.numOfArgs; i++) {
        const arg = context.stash.pop();
        if (arg === undefined) {
          throw new Error('Not enough arguments');
        }
        args.unshift(arg); // Reverse order
      }
      
      // Get operator
      const operator = context.stash.pop();
      if (operator === undefined) {
        throw new Error('No operator found');
      }
      
      // Apply operator
      const result = applyOperator(operator, args, context);
      context.stash.push(result);
      break;
      
    case InstrType.BRANCH:
      const branchInstr = instruction as any;
      const testValue = context.stash.pop();
      if (testValue === undefined) {
        throw new Error('No test value for conditional');
      }
      
      // In Scheme, only #f is false, everything else is true
      const isTrue = testValue.type !== 'boolean' || testValue.value;
      
      if (isTrue) {
        // Push consequent instructions
        const consequentInstructions = astToInstructions([branchInstr.consequent]);
        for (let i = consequentInstructions.length - 1; i >= 0; i--) {
          context.control.push(consequentInstructions[i]);
        }
      } else if (branchInstr.alternate) {
        // Push alternate instructions
        const alternateInstructions = astToInstructions([branchInstr.alternate]);
        for (let i = alternateInstructions.length - 1; i >= 0; i--) {
          context.control.push(alternateInstructions[i]);
        }
      } else {
        // No alternate, push undefined
        context.stash.push({ type: 'undefined' });
      }
      break;
      
    case InstrType.LAMBDA:
      const lambdaInstr = instruction as any;
      context.stash.push({
        type: 'closure',
        params: lambdaInstr.params,
        body: lambdaInstr.body,
        env: context.environment
      });
      break;
      
    case InstrType.SEQUENCE:
      const sequenceInstr = instruction as any;
      // Push expressions in reverse order
      for (let i = sequenceInstr.expressions.length - 1; i >= 0; i--) {
        const exprInstructions = astToInstructions([sequenceInstr.expressions[i]]);
        for (let j = exprInstructions.length - 1; j >= 0; j--) {
          context.control.push(exprInstructions[j]);
        }
      }
      break;
      
    case InstrType.CONS:
      const consInstr = instruction as any;
      const cdr = context.stash.pop();
      const car = context.stash.pop();
      if (car === undefined || cdr === undefined) {
        throw new Error('Not enough values for cons');
      }
      context.stash.push({ type: 'pair', car, cdr });
      break;
      
    case InstrType.NIL:
      context.stash.push({ type: 'nil' });
      break;
      
    case InstrType.SYMBOL:
      const symbolInstr = instruction as any;
      context.stash.push({ type: 'symbol', value: symbolInstr.value });
      break;
      
    case InstrType.LIST:
      const listInstr = instruction as any;
      const elements: Value[] = [];
      
      // Pop elements from stash
      for (let i = 0; i < listInstr.elements.length; i++) {
        const element = context.stash.pop();
        if (element === undefined) {
          throw new Error('Not enough elements for list');
        }
        elements.unshift(element);
      }
      
      // Handle terminator if present
      let terminator: Value = { type: 'nil' };
      if (listInstr.terminator) {
        const terminatorValue = context.stash.pop();
        if (terminatorValue !== undefined) {
          terminator = terminatorValue;
        }
      }
      
      // Build list using cons
      let list: Value = terminator;
      for (let i = elements.length - 1; i >= 0; i--) {
        list = { type: 'pair', car: elements[i], cdr: list };
      }
      
      context.stash.push(list);
      break;
      
    case InstrType.BEGIN:
      const beginInstr = instruction as any;
      // Push expressions in reverse order
      for (let i = beginInstr.expressions.length - 1; i >= 0; i--) {
        const exprInstructions = astToInstructions([beginInstr.expressions[i]]);
        for (let j = exprInstructions.length - 1; j >= 0; j--) {
          context.control.push(exprInstructions[j]);
        }
      }
      break;
      
    case InstrType.LET:
      const letInstr = instruction as any;
      const values: Value[] = [];
      
      // Pop values from stash
      for (let i = 0; i < letInstr.identifiers.length; i++) {
        const value = context.stash.pop();
        if (value === undefined) {
          throw new Error('Not enough values for let');
        }
        values.unshift(value);
      }
      
      // Create new environment
      const newEnv = context.environment.extend(letInstr.identifiers, values);
      const oldEnv = context.environment;
      context.environment = newEnv;
      
      // Push body instructions
      const bodyInstructions = astToInstructions([letInstr.body]);
      for (let i = bodyInstructions.length - 1; i >= 0; i--) {
        context.control.push(bodyInstructions[i]);
      }
      
      // Restore environment after body
      context.control.push({
        instrType: InstrType.ENVIRONMENT,
        srcNode: letInstr.srcNode,
        env: oldEnv
      });
      break;
      
    case InstrType.ENVIRONMENT:
      const envInstr = instruction as any;
      context.environment = envInstr.env;
      break;
      
    case InstrType.VECTOR:
      const vectorInstr = instruction as any;
      const vectorElements: Value[] = [];
      
      // Pop elements from stash
      for (let i = 0; i < vectorInstr.elements.length; i++) {
        const element = context.stash.pop();
        if (element === undefined) {
          throw new Error('Not enough elements for vector');
        }
        vectorElements.unshift(element);
      }
      
      context.stash.push({ type: 'vector', elements: vectorElements });
      break;
      
    default:
      throw new Error(`Unknown instruction type: ${instruction.instrType}`);
  }
}

function applyOperator(operator: Value, args: Value[], context: Context): Value {
  if (operator.type === 'primitive') {
    return applyPrimitive(operator, args);
  } else if (operator.type === 'closure') {
    return applyClosure(operator, args, context);
  } else {
    throw new Error(`Cannot apply non-procedure: ${operator.type}`);
  }
}

function applyPrimitive(primitive: Value, args: Value[]): Value {
  if (primitive.type !== 'primitive') {
    throw new Error('Expected primitive');
  }
  
  try {
    const result = primitive.func(...args);
    return result;
  } catch (error) {
    return { type: 'error', message: error instanceof Error ? error.message : String(error) };
  }
}

function applyClosure(closure: Value, args: Value[], context: Context): Value {
  if (closure.type !== 'closure') {
    throw new Error('Expected closure');
  }
  
  if (args.length !== closure.params.length) {
    throw new Error(`Expected ${closure.params.length} arguments, got ${args.length}`);
  }
  
  // Create new environment for closure
  const newEnv = closure.env.extend(closure.params, args);
  const oldEnv = context.environment;
  context.environment = newEnv;
  
  // Execute closure body
  const bodyInstructions = astToInstructions(closure.body);
  for (let i = bodyInstructions.length - 1; i >= 0; i--) {
    context.control.push(bodyInstructions[i]);
  }
  
  // Restore environment after execution
  context.control.push({
    instrType: InstrType.ENVIRONMENT,
    srcNode: closure.body[0],
    env: oldEnv
  });
  
  return { type: 'undefined' };
}

// Convenience function to evaluate Scheme code
export function evaluate(code: string, context: Context, options: { stepLimit?: number } = {}): Result {
  const ast = parseSchemeDirect(code);
  return runCSEMachine(code, ast, context, options);
} 