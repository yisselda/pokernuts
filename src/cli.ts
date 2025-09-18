#!/usr/bin/env node

import { createInterface } from 'readline'
import { createRNG, dealFlop, validateGuess, formatCard, type Card, type RNG } from './engine.js'

export interface ParsedArgs {
  seed?: number
}

export function parseArgs(args: string[] = process.argv.slice(2)): ParsedArgs {
  let seed: number | undefined

  for (const arg of args) {
    if (arg.startsWith('-seed=')) {
      const seedStr = arg.split('=')[1]
      if (!seedStr) {
        throw new Error('Invalid seed format. Use -seed=NUMBER')
      }
      seed = parseInt(seedStr, 10)
      if (isNaN(seed)) {
        throw new Error('Invalid seed value')
      }
    }
  }

  return { seed }
}

export function printIntroduction(): void {
  console.log('🃏 Poker Nuts Practice CLI')
  console.log('Type your guess like: AA, KQs, A5o, or exact AhQh')
  console.log("Type 'q' to quit\n")
}

export function formatFlopDisplay(flop: Card[]): string {
  return `Flop: ${flop.map(formatCard).join(' ')}`
}

export function isQuitCommand(input: string): boolean {
  return input.trim().toLowerCase() === 'q'
}

export function isEmptyInput(input: string): boolean {
  return input.trim() === ''
}

export function processGuess(
  flop: Card[],
  guess: string
): {
  correct: boolean
  message: string
} {
  const result = validateGuess(flop, guess)

  if (result.correct) {
    return {
      correct: true,
      message: `✅ Correct! ${result.reason}`,
    }
  } else {
    return {
      correct: false,
      message: `❌ ${result.reason}`,
    }
  }
}

export function createGameLoop(
  rng: RNG,
  rl: { question: (query: string, callback: (answer: string) => void) => void; close: () => void }
): () => void {
  function playRound(): void {
    const flop = dealFlop(rng)
    console.log(formatFlopDisplay(flop))

    rl.question('Guess the nuts: ', (input: string) => {
      if (isQuitCommand(input)) {
        console.log('Thanks for playing! 👋')
        rl.close()
        return
      }

      if (isEmptyInput(input)) {
        console.log('Please enter a guess or "q" to quit\n')
        playRound()
        return
      }

      const result = processGuess(flop, input.trim())
      console.log(`${result.message}\n`)
      playRound()
    })
  }

  return playRound
}

export function main(): void {
  try {
    const { seed } = parseArgs()
    const rng = createRNG(seed)

    printIntroduction()

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const playRound = createGameLoop(rng, rl)
    playRound()
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
