/**
 * scm-slang-main: Direct Scheme interpreter with CSE machine
 * 
 * This is a direct Scheme interpreter that works independently from JavaScript.
 * It uses the existing transpiler parser but evaluates Scheme AST directly
 * instead of transpiling to JavaScript.
 */

// Export the direct parser
export { parseSchemeDirect, parseSchemeWithValidation } from './direct-parser';

// Export CSE machine components
export { runCSEMachine, evaluate } from './cse-machine/interpreter';
export { SchemeControl } from './cse-machine/control';
export { SchemeStash } from './cse-machine/stash';
export { createProgramEnvironment } from './cse-machine/environment';
export { astToInstructions } from './cse-machine/ast-to-instr';
export * from './cse-machine/types';

// Export Conductor integration
export { SchemeEvaluator } from './conductor/runner/types/SchemeEvaluator';
export { BasicEvaluator } from './conductor/runner/BasicEvaluator';
export * from './conductor/runner/types';

// Export transpiler components (for compatibility)
export * from './transpiler';
export * from './utils/encoder-visitor';
export { unparse } from './utils/reverse_parser';

// Main function for running Scheme code
import { parseSchemeDirect } from './direct-parser';
import { evaluate } from './cse-machine/interpreter';
import { SchemeControl } from './cse-machine/control';
import { SchemeStash } from './cse-machine/stash';
import { createProgramEnvironment } from './cse-machine/environment';
import { Context } from './cse-machine/types';

export interface IOptions {
  stepLimit?: number;
}

export interface Result {
  status: 'finished' | 'error';
  value?: any;
  representation?: any;
  message?: string;
}

/**
 * Run Scheme code in context
 * @param code The Scheme source code
 * @param context The execution context
 * @param options Execution options
 * @returns Promise resolving to the result
 */
export async function runInContext(
  code: string,
  context: Context,
  options: IOptions = {}
): Promise<Result> {
  try {
    const result = evaluate(code, context, options);
    return result;
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Create a default context for Scheme execution
 * @returns A new Context with default environment
 */
export function createContext(): Context {
  return {
    control: new SchemeControl(),
    stash: new SchemeStash(),
    environment: createProgramEnvironment(),
    runtime: {
      isRunning: true
    }
  };
}

/**
 * Simple function to evaluate Scheme code
 * @param code The Scheme source code
 * @returns Promise resolving to the result
 */
export async function runScheme(code: string): Promise<Result> {
  const context = createContext();
  return runInContext(code, context);
}

// Initialize Conductor system
import { initialise } from './conductor/runner/util/initialise';
import { SchemeEvaluator } from './conductor/runner/types/SchemeEvaluator';

const { runnerPlugin, conduit } = initialise(SchemeEvaluator);

export { runnerPlugin, conduit };
