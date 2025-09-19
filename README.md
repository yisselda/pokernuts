# Poker Nuts Practice CLI

A minimal TypeScript CLI for practicing poker nuts identification on flop scenarios in Texas Hold'em.

[![CI](https://github.com/yisselda/pokernuts/workflows/CI/badge.svg)](https://github.com/yisselda/pokernuts/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/yisselda/pokernuts/branch/main/graph/badge.svg)](https://codecov.io/gh/yisselda/pokernuts)
[![npm version](https://badge.fury.io/js/poker-nuts-practice.svg)](https://www.npmjs.com/package/poker-nuts-practice)
[![Node.js Version](https://img.shields.io/node/v/poker-nuts-practice.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ♠ ♥ [**Try the Live Demo!**](https://yisselda.github.io/pokernuts/) ♦ ♣

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Try_Now!-brightgreen?style=for-the-badge)](https://yisselda.github.io/pokernuts/)

## Features

- **Random flop generation** with seedable RNG for reproducible games
- **Interactive nuts guessing** with multiple input formats (AA, KQs, A5o, AhQh)
- **Comprehensive hand evaluation** covering all poker hand types
- **Smart pattern canonicalization** for suited/offsuit requirements
- **Test-driven development** with 100% test coverage

## Installation

### Global Installation (Recommended)

```bash
npm install -g poker-nuts-practice

# Then run anywhere:
pokernuts
```

### Local Development

```bash
# Clone and install
git clone https://github.com/yisselda/pokernuts.git
cd pokernuts
npm install

# Run tests
npm test

# Start playing
npm run cli

# Play with specific seed for reproducible flops
npm run cli -- -seed=12345
```

## Architecture

- **src/engine.ts** - Core poker logic, hand evaluation, nuts calculation
- **src/cli.ts** - Interactive command-line interface
- **tests/engine.test.ts** - Comprehensive test suite

## Technical Details

- **Language**: TypeScript with Node.js
- **Testing**: Vitest framework
- **RNG**: Custom seedable Linear Congruential Generator
- **Performance**: Single nuts calculation <100ms
- **Hand Types**: Royal flush, quads, full house, flush, straight, trips, two pair, pair, high card

## Programmatic API

Use the poker engine in your own applications:

### React/React Native

```jsx
import { createRNG, dealFlop, evaluateNuts, validateGuess } from 'poker-nuts-practice/engine'

function PokerGame() {
  const [rng] = useState(() => createRNG())
  const [flop, setFlop] = useState([])

  const dealNewFlop = () => setFlop(dealFlop(rng))

  const handleGuess = (guess) => {
    const result = validateGuess(flop, guess)
    // result.correct, result.reason, result.canonicalNuts
    return result
  }

  return <YourPokerUI />
}
```

### Node.js/Custom CLI

```js
import { createRNG, dealFlop, evaluateNuts, formatCard } from 'poker-nuts-practice/engine'

const rng = createRNG(42) // Optional seed for deterministic results
const flop = dealFlop(rng)
const nuts = evaluateNuts(flop)

console.log(`Flop: ${flop.map(formatCard).join(' ')}`)
console.log(`Nuts: ${nuts.patterns.join(', ')} (${nuts.explanation})`)
```

### Available Functions

- `createRNG(seed?)` - Create seedable random number generator
- `dealFlop(rng)` - Deal 3-card flop
- `evaluateNuts(flop)` - Find nuts for given flop
- `validateGuess(flop, guess)` - Validate user guess
- `formatCard(card)` - Format card as "Ah", "Ks", etc.
- `parseCard(string)` - Parse card string to Card object

### 🎯 Complete Examples

See the [examples/](https://github.com/yisselda/pokernuts/tree/main/examples) directory for full working implementations:

- **React Web App** - Interactive UI with real-time validation
- **React Native** - Mobile poker practice app
- **Node.js Bot** - Automated flop analysis
- **Custom CLI** - Build your own poker tools

Each example is ready to run with `npm install && npm start`!

## Development

```bash
# Run tests in watch mode
npm run dev:test

# Build TypeScript
npm run build

# Run built JavaScript
npm start
```

### Contributing

This project uses automated versioning and changelog generation. Please use conventional commit messages:

```bash
# Features
git commit -m "feat: add new poker hand evaluation"

# Bug fixes
git commit -m "fix: correct straight flush detection"

# Documentation
git commit -m "docs: update API examples"

# Tests
git commit -m "test: add edge case coverage"

# Refactoring
git commit -m "refactor: simplify nuts calculation"

# Performance
git commit -m "perf: optimize flop generation"

# CI/Build
git commit -m "ci: update Node.js versions"

# Chores
git commit -m "chore: update dependencies"
```

Commits to `main` automatically trigger release creation when appropriate.
