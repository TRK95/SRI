# scm-slang-main: Direct Scheme Interpreter for Source Academy

A direct Scheme interpreter with CSE machine that integrates with Source Academy's Conductor system.

## Features

- ✅ **Direct Scheme Interpretation**: No JavaScript transpilation
- ✅ **CSE Machine**: Step-by-step evaluation with control, stash, and environment
- ✅ **Source Academy Integration**: Full Conductor plugin compatibility
- ✅ **Standard Library**: Built-in Scheme primitives and data structures
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Educational**: Perfect for teaching Scheme and programming concepts

## Architecture

```
Scheme Code → Parser → Scheme AST → CSE Machine → Results
```

### Components

1. **Direct Parser**: Uses existing transpiler parser but returns Scheme AST
2. **CSE Machine**: Control-Stash-Environment model for evaluation
3. **Conductor Integration**: Plugin system for Source Academy
4. **Data Handler**: Manages Scheme data types (pairs, lists, vectors, etc.)
5. **Standard Library**: Built-in Scheme functions and primitives

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```typescript
import { runScheme, createContext } from './dist';

// Simple evaluation
const result = await runScheme('(+ 2 3)');
console.log(result); // { status: 'finished', value: { type: 'number', value: 5 } }

// With custom context
const context = createContext();
const result = await runInContext('(define x 5)', context);
```

### Source Academy Integration

The interpreter is designed to work with Source Academy's Conductor system:

1. **Language Configuration**: `scheme-language.json` defines the language for Source Academy
2. **Plugin System**: Implements `IEvaluator` interface for Conductor
3. **Data Types**: Supports all Scheme data types (pairs, lists, vectors, closures)
4. **Standard Library**: Provides Scheme primitives and functions

## Data Types

| Type | Description | Example |
|------|-------------|---------|
| `number` | Numeric values | `42`, `3.14` |
| `string` | String literals | `"hello"` |
| `boolean` | Boolean values | `#t`, `#f` |
| `symbol` | Scheme symbols | `'symbol` |
| `nil` | Empty list | `()` |
| `pair` | Cons cells | `(cons 1 2)` |
| `list` | Linked lists | `(list 1 2 3)` |
| `vector` | Arrays | `#(1 2 3)` |
| `closure` | Functions | `(lambda (x) (+ x 1))` |
| `primitive` | Built-in functions | `+`, `car`, `cdr` |

## Standard Library

### List Operations
- `cons`, `car`, `cdr`
- `list`, `append`, `reverse`
- `length`, `null?`, `pair?`

### Vector Operations
- `make-vector`, `vector-ref`, `vector-set!`
- `vector-length`, `vector?`

### Arithmetic
- `+`, `-`, `*`, `/`
- `=`, `<`, `>`, `<=`, `>=`

### Type Predicates
- `number?`, `string?`, `boolean?`
- `symbol?`, `null?`, `pair?`, `vector?`

## Development

### Project Structure

```
src/
├── cse-machine/          # CSE machine implementation
│   ├── types.ts         # Value types and interfaces
│   ├── environment.ts   # Environment management
│   ├── control.ts       # Control stack
│   ├── stash.ts         # Value stash
│   ├── ast-to-instr.ts  # AST to instructions
│   └── interpreter.ts   # Main interpreter
├── conductor/           # Source Academy integration
│   ├── runner/         # Runner plugin
│   └── types/          # Data handlers
├── transpiler/         # Existing parser (reused)
├── direct-parser.ts    # Direct parser interface
└── index.ts           # Main entry point
```

### Building

```bash
npm run build    # Build TypeScript to JavaScript
npm run test     # Run basic tests
npm run dev      # Development mode
```

### Testing

```bash
# Run basic functionality tests
npm run test

# Test specific features
npx ts-node test-basic.ts
```

## Source Academy Integration

To use this with Source Academy:

1. **Build the project**: `npm run build`
2. **Register the language**: Add to Source Academy's language registry
3. **Configure the entry point**: Point to `dist/index.js`
4. **Set up the language data**: Use `scheme-language.json`

### Language Configuration

The `scheme-language.json` file defines:
- Language name and version
- Entry point for the runner
- Supported file extensions
- Features (step-by-step, breakpoints, etc.)
- Standard library location

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Based on the Source Academy Conductor system
- Inspired by SICP and educational programming
- Built with TypeScript for type safety
