import { Value } from '../../cse-machine/types';

export interface IDataHandler {
  // Pair operations
  createPair(car: Value, cdr: Value): string;
  getCar(pairId: string): Value;
  getCdr(pairId: string): Value;
  setCar(pairId: string, value: Value): void;
  setCdr(pairId: string, value: Value): void;
  
  // List operations
  createList(elements: Value[]): string;
  getListElements(listId: string): Value[];
  setListElements(listId: string, elements: Value[]): void;
  
  // Array operations
  createArray(elements: Value[]): string;
  getArrayElement(arrayId: string, index: number): Value;
  setArrayElement(arrayId: string, index: number, value: Value): void;
  getArrayLength(arrayId: string): number;
  
  // Closure operations
  createClosure(params: string[], body: any[], env: any): string;
  callClosure(closureId: string, args: Value[]): Value;
  getClosureParams(closureId: string): string[];
  
  // Opaque operations
  createOpaque(data: any): string;
  getOpaqueData(opaqueId: string): any;
  setOpaqueData(opaqueId: string, data: any): void;
  
  // Type checking
  isPair(value: Value): boolean;
  isList(value: Value): boolean;
  isArray(value: Value): boolean;
  isClosure(value: Value): boolean;
  isOpaque(value: Value): boolean;
  
  // Utility
  getValueType(value: Value): string;
  createIdentifier(value: Value): string;
  getValueFromIdentifier(identifier: string): Value;
} 