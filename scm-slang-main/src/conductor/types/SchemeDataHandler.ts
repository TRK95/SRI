import { IDataHandler } from './IDataHandler';
import { Value } from '../../cse-machine/types';

export class SchemeDataHandler implements IDataHandler {
  private pairStore: Map<string, { car: Value; cdr: Value }> = new Map();
  private listStore: Map<string, Value[]> = new Map();
  private arrayStore: Map<string, Value[]> = new Map();
  private closureStore: Map<string, { params: string[]; body: any[]; env: any }> = new Map();
  private opaqueStore: Map<string, any> = new Map();
  private identifierCounter = 0;

  // Pair operations
  createPair(car: Value, cdr: Value): string {
    const id = `pair_${this.identifierCounter++}`;
    this.pairStore.set(id, { car, cdr });
    return id;
  }

  getCar(pairId: string): Value {
    const pair = this.pairStore.get(pairId);
    if (!pair) throw new Error(`Pair ${pairId} not found`);
    return pair.car;
  }

  getCdr(pairId: string): Value {
    const pair = this.pairStore.get(pairId);
    if (!pair) throw new Error(`Pair ${pairId} not found`);
    return pair.cdr;
  }

  setCar(pairId: string, value: Value): void {
    const pair = this.pairStore.get(pairId);
    if (!pair) throw new Error(`Pair ${pairId} not found`);
    pair.car = value;
  }

  setCdr(pairId: string, value: Value): void {
    const pair = this.pairStore.get(pairId);
    if (!pair) throw new Error(`Pair ${pairId} not found`);
    pair.cdr = value;
  }

  // List operations
  createList(elements: Value[]): string {
    const id = `list_${this.identifierCounter++}`;
    this.listStore.set(id, elements);
    return id;
  }

  getListElements(listId: string): Value[] {
    const list = this.listStore.get(listId);
    if (!list) throw new Error(`List ${listId} not found`);
    return list;
  }

  setListElements(listId: string, elements: Value[]): void {
    this.listStore.set(listId, elements);
  }

  // Array operations
  createArray(elements: Value[]): string {
    const id = `array_${this.identifierCounter++}`;
    this.arrayStore.set(id, elements);
    return id;
  }

  getArrayElement(arrayId: string, index: number): Value {
    const array = this.arrayStore.get(arrayId);
    if (!array) throw new Error(`Array ${arrayId} not found`);
    if (index < 0 || index >= array.length) throw new Error(`Index ${index} out of bounds`);
    return array[index];
  }

  setArrayElement(arrayId: string, index: number, value: Value): void {
    const array = this.arrayStore.get(arrayId);
    if (!array) throw new Error(`Array ${arrayId} not found`);
    if (index < 0 || index >= array.length) throw new Error(`Index ${index} out of bounds`);
    array[index] = value;
  }

  getArrayLength(arrayId: string): number {
    const array = this.arrayStore.get(arrayId);
    if (!array) throw new Error(`Array ${arrayId} not found`);
    return array.length;
  }

  // Closure operations
  createClosure(params: string[], body: any[], env: any): string {
    const id = `closure_${this.identifierCounter++}`;
    this.closureStore.set(id, { params, body, env });
    return id;
  }

  callClosure(closureId: string, args: Value[]): Value {
    const closure = this.closureStore.get(closureId);
    if (!closure) throw new Error(`Closure ${closureId} not found`);
    // This would need to be integrated with your CSE machine
    // For now, return a placeholder
    return { type: 'undefined' };
  }

  getClosureParams(closureId: string): string[] {
    const closure = this.closureStore.get(closureId);
    if (!closure) throw new Error(`Closure ${closureId} not found`);
    return closure.params;
  }

  // Opaque operations
  createOpaque(data: any): string {
    const id = `opaque_${this.identifierCounter++}`;
    this.opaqueStore.set(id, data);
    return id;
  }

  getOpaqueData(opaqueId: string): any {
    const data = this.opaqueStore.get(opaqueId);
    if (!data) throw new Error(`Opaque ${opaqueId} not found`);
    return data;
  }

  setOpaqueData(opaqueId: string, data: any): void {
    this.opaqueStore.set(opaqueId, data);
  }

  // Type checking
  isPair(value: Value): boolean {
    return value.type === 'pair';
  }

  isList(value: Value): boolean {
    return value.type === 'list' || (value.type === 'pair' && this.isList(value.cdr));
  }

  isArray(value: Value): boolean {
    return value.type === 'vector';
  }

  isClosure(value: Value): boolean {
    return value.type === 'closure';
  }

  isOpaque(value: Value): boolean {
    return value.type === 'opaque';
  }

  // Utility
  getValueType(value: Value): string {
    return value.type;
  }

  createIdentifier(value: Value): string {
    const id = `value_${this.identifierCounter++}`;
    // Store the value for later retrieval
    // This is a simplified implementation
    return id;
  }

  getValueFromIdentifier(identifier: string): Value {
    // This would need to retrieve the stored value
    // For now, return undefined
    return { type: 'undefined' };
  }
} 