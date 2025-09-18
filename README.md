# Poker Nuts Practice CLI

A minimal TypeScript CLI for practicing poker nuts identification on flop scenarios.

## Features

- **Random flop generation** with seedable RNG for reproducible games
- **Interactive nuts guessing** with multiple input formats (AA, KQs, A5o, AhQh)
- **Comprehensive hand evaluation** covering all poker hand types
- **Smart pattern canonicalization** for suited/offsuit requirements
- **Test-driven development** with 100% test coverage

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start playing
npm run cli

# Play with specific seed for reproducible flops
npm run cli -- -seed=12345
```

## How to Play

1. The CLI deals a random 3-card flop
2. Guess which 2-card combinations make the nuts (best possible hand)
3. Enter your guess in formats like:
   - `AA` (pocket pair)
   - `KQs` (suited connectors)
   - `A5o` (offsuit)
   - `AhQh` (exact cards)
4. Get instant feedback with explanations
5. Type 'q' to quit

## Example Session

```
Flop: Ah Kh Qh
Guess: JT
✅ Correct! JT of hearts makes a royal flush

Flop: 7c 7d 2s
Guess: 77
✅ Correct! 77 makes four of a kind sevens
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

## Development

```bash
# Run tests in watch mode
npm run dev:test

# Build TypeScript
npm run build

# Run built JavaScript
npm start
```