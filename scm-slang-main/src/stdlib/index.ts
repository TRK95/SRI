import { IDataHandler } from '../conductor/types/IDataHandler';
import { Value } from '../cse-machine/types';

export class SchemeStandardLibrary {
  constructor(private dataHandler: IDataHandler) {}

  // List operations
  list(...elements: Value[]): string {
    return this.dataHandler.createList(elements);
  }

  car(pairId: string): Value {
    return this.dataHandler.getCar(pairId);
  }

  cdr(pairId: string): Value {
    return this.dataHandler.getCdr(pairId);
  }

  cons(car: Value, cdr: Value): string {
    return this.dataHandler.createPair(car, cdr);
  }

  // Array operations
  makeVector(length: number, fill: Value): string {
    const elements = new Array(length).fill(fill);
    return this.dataHandler.createArray(elements);
  }

  vectorRef(vectorId: string, index: number): Value {
    return this.dataHandler.getArrayElement(vectorId, index);
  }

  vectorSet(vectorId: string, index: number, value: Value): void {
    this.dataHandler.setArrayElement(vectorId, index, value);
  }

  // Type predicates
  isPair(value: Value): boolean {
    return this.dataHandler.isPair(value);
  }

  isList(value: Value): boolean {
    return this.dataHandler.isList(value);
  }

  isVector(value: Value): boolean {
    return this.dataHandler.isArray(value);
  }

  isNull(value: Value): boolean {
    return value.type === 'nil';
  }

  // Utility functions
  length(listId: string): number {
    const elements = this.dataHandler.getListElements(listId);
    return elements.length;
  }

  append(...listIds: string[]): string {
    const allElements: Value[] = [];
    for (const listId of listIds) {
      const elements = this.dataHandler.getListElements(listId);
      allElements.push(...elements);
    }
    return this.dataHandler.createList(allElements);
  }

  reverse(listId: string): string {
    const elements = this.dataHandler.getListElements(listId);
    return this.dataHandler.createList(elements.reverse());
  }
} 