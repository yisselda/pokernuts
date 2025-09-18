#!/usr/bin/env node

import { createRNG, dealFlop, evaluateNuts, formatCard } from 'poker-nuts-practice/engine'

// Simple bot that deals flops and shows the nuts
function pokerBot() {
  const rng = createRNG()

  console.log('🤖 Poker Nuts Bot')
  console.log('Dealing 5 random flops...\n')

  for (let i = 1; i <= 5; i++) {
    const flop = dealFlop(rng)
    const nuts = evaluateNuts(flop)

    console.log(`${i}. Flop: ${flop.map(formatCard).join(' ')}`)
    console.log(`   Nuts: ${nuts.patterns.join(', ')} (${nuts.explanation})`)
    console.log('')
  }
}

// Run with deterministic seed for testing
function deterministicExample() {
  const rng = createRNG(12345) // Fixed seed

  console.log('🎯 Deterministic Example (seed: 12345)')

  const flop = dealFlop(rng)
  const nuts = evaluateNuts(flop)

  console.log(`Flop: ${flop.map(formatCard).join(' ')}`)
  console.log(`Nuts: ${nuts.patterns.join(', ')}`)
  console.log(`Explanation: ${nuts.explanation}`)
}

// Run both examples
pokerBot()
deterministicExample()