# scm-slang-main: Direct Scheme Interpreter for Source Academy

A direct Scheme interpreter with CSE machine that integrates with Source Academy's Conductor system.

## Features

- ✅ **Direct Scheme Interpretation**: No JavaScript transpilation
- ✅ **CSE Machine**: Step-by-step evaluation with control, stash, and environment
- ✅ **Source Academy Integration**: Full Conductor plugin compatibility
- ✅ **Standard Library**: Built-in Scheme primitives and data structures
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Educational**: Perfect for teaching Scheme and programming concepts
- ✅ **Module Support**: External module loading and registration
- ✅ **Data Handler Interface**: Full Conductor data type support

## Architecture

```
Scheme Code → Parser → Scheme AST → CSE Machine → Results
                    ↓
            Conductor Integration
                    ↓
            Source Academy Ecosystem
```

### Components

1. **Direct Parser**: Uses existing transpiler parser but returns Scheme AST
2. **CSE Machine**: Control-Stash-Environment model for evaluation
3. **Conductor Integration**: Plugin system for Source Academy
4. **Data Handler**: Manages Scheme data types (pairs, lists, vectors, etc.)
5. **Standard Library**: Built-in Scheme functions and primitives
6. **Module System**: External module loading and registration

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
2. **Plugin System**: Implements `IEvaluator` and `IInterfacableEvaluator` interfaces for Conductor
3. **Data Types**: Supports all Scheme data types (pairs, lists, vectors, closures)
4. **Standard Library**: Provides Scheme primitives and functions
5. **Module Support**: External module loading and registration

### Conductor Integration

```typescript
import { SchemeEvaluator, initialise } from './dist';

// Initialize the Conductor system
const { runnerPlugin, conduit } = initialise(SchemeEvaluator);

// The evaluator now supports:
// - Standard IEvaluator interface
// - IDataHandler interface for data type management
// - Module registration and loading
// - External plugin support
```

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

## Conductor Data Handler Interface

The interpreter implements the full Conductor `IDataHandler` interface:

### Pair Operations
- `pair_make(head, tail)`: Create a new pair
- `pair_head(p)`: Get the head of a pair
- `pair_tail(p)`: Get the tail of a pair
- `pair_sethead(p, value)`: Set the head of a pair
- `pair_settail(p, value)`: Set the tail of a pair
- `pair_assert(p, headType?, tailType?)`: Assert pair types

### Array Operations
- `array_make(type, length, init?)`: Create a new array
- `array_length(a)`: Get array length
- `array_get(a, index)`: Get array element
- `array_set(a, index, value)`: Set array element
- `array_type(a)`: Get array element type
- `array_assert(a, type?, length?)`: Assert array properties

### Closure Operations
- `closure_make(sig, func, dependsOn?)`: Create a new closure
- `closure_is_vararg(c)`: Check if closure accepts variable arguments
- `closure_arity(c)`: Get closure arity
- `closure_call(c, args, returnType)`: Call closure with type checking
- `closure_call_unchecked(c, args)`: Call closure without type checking
- `closure_arity_assert(c, arity)`: Assert closure arity

### Opaque Operations
- `opaque_make(value, immutable?)`: Create opaque object
- `opaque_get(o)`: Get opaque value
- `opaque_update(o, value)`: Update opaque value

### Standard Library Functions
- `list(...elements)`: Create a list
- `is_list(xs)`: Check if value is a list
- `list_to_vec(xs)`: Convert list to vector
- `accumulate(op, initial, sequence, resultType)`: Accumulate over sequence
- `length(xs)`: Get list length

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
│   ├── types/          # Data handlers
│   ├── common/         # Common utilities
│   └── module/         # Module system
├── conduit/            # Communication layer
│   ├── types.ts        # Channel interfaces
│   ├── Conduit.ts      # Main conduit
│   ├── Channel.ts      # Channel implementation
│   └── ChannelQueue.ts # Queued channels
├── transpiler/         # Existing parser (reused)
├── direct-parser.ts    # Direct parser interface
└── index.ts           # Main entry point
```

### Building

```bash
npm run build    # Build TypeScript to JavaScript
npm run test     # Run basic tests
npm run test:conductor # Run Conductor integration tests
npm run dev      # Development mode
```

### Testing

```bash
# Run basic functionality tests
npm run test

# Run Conductor integration tests
npm run test:conductor

# Test specific features
npx ts-node test-basic.ts
npx ts-node test-conductor-integration.ts
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

### Conductor Protocol

The interpreter implements the full Conductor protocol:

- **Channel Communication**: File, chunk, service, I/O, error, and status channels
- **Service Messages**: Hello, abort, entry, and plugin service messages
- **RPC Support**: Remote procedure calls for file operations
- **Module Loading**: External module and plugin loading
- **Data Type Management**: Full type-safe data handling

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
- Full integration with Source Academy ecosystem
