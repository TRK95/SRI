// This file is adapted from:
// https://github.com/source-academy/conductor
// Original author(s): Source Academy Team

import { IDataHandler, DataType, TypedValue, PairIdentifier, ArrayIdentifier, ClosureIdentifier, OpaqueIdentifier, Identifier, IFunctionSignature, ExternCallable, List } from './IDataHandler';
import { Value } from '../../cse-machine/types';

export class SchemeDataHandler implements IDataHandler {
  readonly hasDataInterface = true;
  
  private pairStore: Map<string, { car: TypedValue<DataType>; cdr: TypedValue<DataType> }> = new Map();
  private arrayStore: Map<string, { elements: TypedValue<DataType>[]; type: DataType }> = new Map();
  private closureStore: Map<string, { sig: IFunctionSignature; func: ExternCallable<any>; dependsOn?: (Identifier | null)[] }> = new Map();
  private opaqueStore: Map<string, { data: any; immutable: boolean }> = new Map();
  private identifierCounter = 0;

  // Pair operations
  pair_make(head: TypedValue<DataType>, tail: TypedValue<DataType>): PairIdentifier {
    const id = `pair_${this.identifierCounter++}`;
    this.pairStore.set(id, { car: head, cdr: tail });
    return id;
  }

  pair_head(p: PairIdentifier): TypedValue<DataType> {
    const pair = this.pairStore.get(p);
    if (!pair) throw new Error(`Pair ${p} not found`);
    return pair.car;
  }

  pair_sethead(p: PairIdentifier, tv: TypedValue<DataType>): void {
    const pair = this.pairStore.get(p);
    if (!pair) throw new Error(`Pair ${p} not found`);
    pair.car = tv;
  }

  pair_tail(p: PairIdentifier): TypedValue<DataType> {
    const pair = this.pairStore.get(p);
    if (!pair) throw new Error(`Pair ${p} not found`);
    return pair.cdr;
  }

  pair_settail(p: PairIdentifier, tv: TypedValue<DataType>): void {
    const pair = this.pairStore.get(p);
    if (!pair) throw new Error(`Pair ${p} not found`);
    pair.cdr = tv;
  }

  pair_assert(p: PairIdentifier, headType?: DataType, tailType?: DataType): void {
    const pair = this.pairStore.get(p);
    if (!pair) throw new Error(`Pair ${p} not found`);
    
    if (headType && pair.car.type !== headType) {
      throw new Error(`Expected head type ${headType}, got ${pair.car.type}`);
    }
    
    if (tailType && pair.cdr.type !== tailType) {
      throw new Error(`Expected tail type ${tailType}, got ${pair.cdr.type}`);
    }
  }

  // Array operations
  array_make<T extends DataType>(t: T, len: number, init?: TypedValue<NoInfer<T>>): ArrayIdentifier<NoInfer<T>> {
    const id = `array_${this.identifierCounter++}`;
    const elements: TypedValue<DataType>[] = [];
    
    for (let i = 0; i < len; i++) {
      elements.push(init || { type: 'void', value: undefined });
    }
    
    this.arrayStore.set(id, { elements, type: t });
    return id;
  }

  array_length(a: ArrayIdentifier<DataType>): number {
    const array = this.arrayStore.get(a);
    if (!array) throw new Error(`Array ${a} not found`);
    return array.elements.length;
  }

  array_get(a: ArrayIdentifier<DataType.VOID>, idx: number): TypedValue<DataType>;
  array_get<T extends DataType>(a: ArrayIdentifier<T>, idx: number): TypedValue<NoInfer<T>>;
  array_get(a: ArrayIdentifier<DataType>, idx: number): TypedValue<DataType> {
    const array = this.arrayStore.get(a);
    if (!array) throw new Error(`Array ${a} not found`);
    if (idx < 0 || idx >= array.elements.length) throw new Error(`Index ${idx} out of bounds`);
    return array.elements[idx];
  }

  array_type<T extends DataType>(a: ArrayIdentifier<T>): NoInfer<T> {
    const array = this.arrayStore.get(a);
    if (!array) throw new Error(`Array ${a} not found`);
    return array.type as NoInfer<T>;
  }

  array_set(a: ArrayIdentifier<DataType.VOID>, idx: number, tv: TypedValue<DataType>): void;
  array_set<T extends DataType>(a: ArrayIdentifier<T>, idx: number, tv: TypedValue<NoInfer<T>>): void;
  array_set(a: ArrayIdentifier<DataType>, idx: number, tv: TypedValue<DataType>): void {
    const array = this.arrayStore.get(a);
    if (!array) throw new Error(`Array ${a} not found`);
    if (idx < 0 || idx >= array.elements.length) throw new Error(`Index ${idx} out of bounds`);
    array.elements[idx] = tv;
  }

  array_assert<T extends DataType>(a: ArrayIdentifier<DataType>, type?: T, length?: number): asserts a is ArrayIdentifier<NoInfer<T>> {
    const array = this.arrayStore.get(a);
    if (!array) throw new Error(`Array ${a} not found`);
    
    if (type && array.type !== type) {
      throw new Error(`Expected array type ${type}, got ${array.type}`);
    }
    
    if (length !== undefined && array.elements.length !== length) {
      throw new Error(`Expected array length ${length}, got ${array.elements.length}`);
    }
  }

  // Closure operations
  closure_make<const T extends IFunctionSignature>(sig: T, func: ExternCallable<T>, dependsOn?: (Identifier | null)[]): ClosureIdentifier<T["returnType"]> {
    const id = `closure_${this.identifierCounter++}`;
    this.closureStore.set(id, { sig, func, dependsOn });
    return id;
  }

  closure_is_vararg(c: ClosureIdentifier<DataType>): boolean {
    const closure = this.closureStore.get(c);
    if (!closure) throw new Error(`Closure ${c} not found`);
    return closure.sig.vararg || false;
  }

  closure_arity(c: ClosureIdentifier<DataType>): number {
    const closure = this.closureStore.get(c);
    if (!closure) throw new Error(`Closure ${c} not found`);
    return closure.sig.parameters.length;
  }

  async closure_call<T extends DataType>(c: ClosureIdentifier<DataType>, args: TypedValue<DataType>[], returnType: T): Promise<TypedValue<NoInfer<T>>> {
    const closure = this.closureStore.get(c);
    if (!closure) throw new Error(`Closure ${c} not found`);
    
    const result = await closure.func(...args);
    if (result.type !== returnType) {
      throw new Error(`Expected return type ${returnType}, got ${result.type}`);
    }
    
    return result as TypedValue<NoInfer<T>>;
  }

  async closure_call_unchecked<T extends DataType>(c: ClosureIdentifier<T>, args: TypedValue<DataType>[]): Promise<TypedValue<NoInfer<T>>> {
    const closure = this.closureStore.get(c);
    if (!closure) throw new Error(`Closure ${c} not found`);
    
    const result = await closure.func(...args);
    return result as TypedValue<NoInfer<T>>;
  }

  closure_arity_assert(c: ClosureIdentifier<DataType>, arity: number): void {
    const actualArity = this.closure_arity(c);
    if (actualArity !== arity) {
      throw new Error(`Expected closure arity ${arity}, got ${actualArity}`);
    }
  }

  // Opaque operations
  opaque_make(v: any, immutable: boolean = false): OpaqueIdentifier {
    const id = `opaque_${this.identifierCounter++}`;
    this.opaqueStore.set(id, { data: v, immutable });
    return id;
  }

  opaque_get(o: OpaqueIdentifier): any {
    const opaque = this.opaqueStore.get(o);
    if (!opaque) throw new Error(`Opaque ${o} not found`);
    return opaque.data;
  }

  opaque_update(o: OpaqueIdentifier, v: any): void {
    const opaque = this.opaqueStore.get(o);
    if (!opaque) throw new Error(`Opaque ${o} not found`);
    if (opaque.immutable) throw new Error(`Cannot update immutable opaque object ${o}`);
    opaque.data = v;
  }

  // Lifetime management
  tie(dependent: Identifier, dependee: Identifier | null): void {
    // For now, just store the dependency - could be extended for garbage collection
    console.log(`Tied ${dependent} to ${dependee}`);
  }

  untie(dependent: Identifier, dependee: Identifier | null): void {
    // For now, just log the untie - could be extended for garbage collection
    console.log(`Untied ${dependent} from ${dependee}`);
  }

  // Standard library functions
  list(...elements: TypedValue<DataType>[]): TypedValue<DataType.LIST> {
    return { type: 'list', value: elements };
  }

  is_list(xs: List): boolean {
    return xs.type === 'list';
  }

  list_to_vec(xs: List): TypedValue<DataType>[] {
    if (!this.is_list(xs)) throw new Error('Expected list');
    return xs.value as TypedValue<DataType>[];
  }

  async accumulate<T extends Exclude<DataType, DataType.VOID>>(
    op: ClosureIdentifier<DataType>, 
    initial: TypedValue<T>, 
    sequence: List, 
    resultType: T
  ): Promise<TypedValue<T>> {
    const elements = this.list_to_vec(sequence);
    let result = initial;
    
    for (const element of elements) {
      result = await this.closure_call(op, [result, element], resultType);
    }
    
    return result;
  }

  length(xs: List): number {
    if (!this.is_list(xs)) throw new Error('Expected list');
    return (xs.value as TypedValue<DataType>[]).length;
  }
} 