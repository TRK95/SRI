import { SchemeEvaluator, RunnerPlugin, initialise, runScheme } from './src/index';

async function testConductorIntegration() {
  console.log('Testing Conductor integration...\n');

  // Test 1: Basic Scheme evaluation
  console.log('Test 1: Basic Scheme evaluation');
  const result1 = await runScheme('(+ 2 3)');
  console.log('Result:', result1);
  console.log('');

  // Test 2: Create evaluator instance
  console.log('Test 2: Create evaluator instance');
  const mockConductor = {
    sendOutput: (msg: string) => console.log('Output:', msg),
    requestFile: async (name: string) => undefined,
    requestChunk: async () => "",
    requestInput: async () => "",
    tryRequestInput: () => undefined,
    sendError: (error: any) => console.error('Error:', error),
    updateStatus: (status: any, active: boolean) => console.log('Status:', status, active),
    hostLoadPlugin: (name: string) => console.log('Load plugin:', name),
    registerPlugin: (plugin: any, ...args: any[]) => plugin,
    unregisterPlugin: (plugin: any) => console.log('Unregister plugin'),
    registerModule: (module: any) => module,
    unregisterModule: (module: any) => console.log('Unregister module'),
    importAndRegisterExternalPlugin: async (location: string, ...args: any[]) => {
      throw new Error('External plugin loading not implemented');
    },
    importAndRegisterExternalModule: async (location: string) => {
      throw new Error('External module loading not implemented');
    }
  };

  const evaluator = new SchemeEvaluator(mockConductor as any);
  console.log('Evaluator created successfully');
  console.log('');

  // Test 3: Test data handler interface
  console.log('Test 3: Test data handler interface');
  console.log('hasDataInterface:', evaluator.hasDataInterface);
  
  // Test pair operations
  const pairId = evaluator.pair_make(
    { type: 'number', value: 1 },
    { type: 'number', value: 2 }
  );
  console.log('Created pair:', pairId);
  
  const head = evaluator.pair_head(pairId);
  console.log('Pair head:', head);
  
  const tail = evaluator.pair_tail(pairId);
  console.log('Pair tail:', tail);
  console.log('');

  // Test 4: Test array operations
  console.log('Test 4: Test array operations');
  const arrayId = evaluator.array_make('number', 3, { type: 'number', value: 0 });
  console.log('Created array:', arrayId);
  
  const length = evaluator.array_length(arrayId);
  console.log('Array length:', length);
  
  const element = evaluator.array_get(arrayId, 0);
  console.log('Array element:', element);
  console.log('');

  // Test 5: Test list operations
  console.log('Test 5: Test list operations');
  const list = evaluator.list(
    { type: 'number', value: 1 },
    { type: 'number', value: 2 },
    { type: 'number', value: 3 }
  );
  console.log('Created list:', list);
  
  const isList = evaluator.is_list(list);
  console.log('Is list:', isList);
  
  const listLength = evaluator.length(list);
  console.log('List length:', listLength);
  console.log('');

  console.log('All Conductor integration tests completed successfully!');
}

testConductorIntegration().catch(console.error); 