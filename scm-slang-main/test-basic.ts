import { runScheme, createContext, runInContext } from './src/index';

async function testBasicScheme() {
  console.log('Testing basic Scheme interpreter...\n');

  // Test 1: Simple arithmetic
  console.log('Test 1: Simple arithmetic');
  const result1 = await runScheme('(+ 2 3)');
  console.log('Result:', result1);
  console.log('');

  // Test 2: Variable definition
  console.log('Test 2: Variable definition');
  const result2 = await runScheme('(define x 5)');
  console.log('Result:', result2);
  console.log('');

  // Test 3: Lambda function
  console.log('Test 3: Lambda function');
  const result3 = await runScheme('((lambda (x) (+ x 1)) 5)');
  console.log('Result:', result3);
  console.log('');

  // Test 4: Conditional
  console.log('Test 4: Conditional');
  const result4 = await runScheme('(if (> 5 3) "yes" "no")');
  console.log('Result:', result4);
  console.log('');

  // Test 5: List operations
  console.log('Test 5: List operations');
  const result5 = await runScheme('(cons 1 (cons 2 ()))');
  console.log('Result:', result5);
  console.log('');

  // Test 6: Function definition
  console.log('Test 6: Function definition');
  const result6 = await runScheme(`
    (define square (lambda (x) (* x x)))
    (square 4)
  `);
  console.log('Result:', result6);
  console.log('');

  console.log('All tests completed!');
}

testBasicScheme().catch(console.error); 