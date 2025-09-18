#!/usr/bin/env node

import { createInterface } from 'readline'
import { createRNG, dealFlop, validateGuess, formatCard } from './engine.js'

function parseArgs(): { seed?: number } {
  const args = process.argv.slice(2)
  let seed: number | undefined

  for (const arg of args) {
    if (arg.startsWith('-seed=')) {
      seed = parseInt(arg.split('=')[1], 10)
      if (isNaN(seed)) {
        console.error('Invalid seed value')
        process.exit(1)
      }
    }
  }

  return { seed }
}

function main() {
  const { seed } = parseArgs()
  const rng = createRNG(seed)

  console.log('🃏 Poker Nuts Practice CLI')
  console.log('Type your guess like: AA, KQs, A5o, or exact AhQh')
  console.log("Type 'q' to quit\n")

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function playRound() {
    const flop = dealFlop(rng)
    const flopStr = flop.map(formatCard).join(' ')

    console.log(`Flop: ${flopStr}`)

    rl.question('Guess the nuts: ', (input) => {
      const guess = input.trim()

      if (guess.toLowerCase() === 'q') {
        console.log('Thanks for playing! 👋')
        rl.close()
        return
      }

      if (!guess) {
        console.log('Please enter a guess or "q" to quit\n')
        playRound()
        return
      }

      const result = validateGuess(flop, guess)

      if (result.correct) {
        console.log(`✅ Correct! ${result.reason}\n`)
      } else {
        console.log(`❌ ${result.reason}\n`)
      }

      playRound()
    })
  }

  playRound()
}

main()