/**
 * Direct Scheme parser that uses the existing transpiler parser
 * but returns Scheme AST instead of transpiling to JavaScript
 */

import { SchemeLexer } from "./transpiler/lexer";
import { SchemeParser } from "./transpiler/parser";
import { Expression } from "./transpiler/types/nodes/scheme-node-types";
import { MACRO_CHAPTER } from "./transpiler/types/constants";

/**
 * Parse Scheme source code directly into a Scheme AST
 * @param source The Scheme source code
 * @param chapter The chapter of the Scheme language (defaults to latest)
 * @returns Array of Scheme expressions
 */
export function parseSchemeDirect(
  source: string,
  chapter: number = Infinity
): Expression[] {
  // Instantiate the lexer
  const lexer = new SchemeLexer(source);

  // Generate tokens
  const tokens = lexer.scanTokens();

  // Instantiate the parser
  const parser = new SchemeParser(source, tokens, chapter);

  // Parse into Scheme AST
  const ast: Expression[] = parser.parse();

  return ast;
}

/**
 * Parse Scheme source code with validation
 * @param source The Scheme source code
 * @param chapter The chapter of the Scheme language
 * @returns Array of Scheme expressions
 */
export function parseSchemeWithValidation(
  source: string,
  chapter: number = Infinity
): Expression[] {
  return parseSchemeDirect(source, chapter);
} 