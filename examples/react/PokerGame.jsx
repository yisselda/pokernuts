import React, { useState } from 'react'
import { createRNG, dealFlop, validateGuess, formatCard } from 'poker-nuts-practice/engine'

export default function PokerGame() {
  const [rng] = useState(() => createRNG())
  const [flop, setFlop] = useState([])
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null)

  const dealNewFlop = () => {
    const newFlop = dealFlop(rng)
    setFlop(newFlop)
    setResult(null)
    setGuess('')
  }

  const handleGuess = () => {
    if (!guess.trim() || flop.length === 0) return

    const validation = validateGuess(flop, guess)
    setResult(validation)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>🃏 Poker Nuts Practice</h2>

      <button onClick={dealNewFlop} style={{ marginBottom: '1rem' }}>
        Deal New Flop
      </button>

      {flop.length > 0 && (
        <div>
          <h3>Flop: {flop.map(formatCard).join(' ')}</h3>

          <div style={{ margin: '1rem 0' }}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess (AA, KQs, A5o, AhQh)"
              style={{ marginRight: '0.5rem', padding: '0.5rem' }}
            />
            <button onClick={handleGuess}>Submit Guess</button>
          </div>

          {result && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: result.correct ? '#d4edda' : '#f8d7da',
                color: result.correct ? '#155724' : '#721c24',
                border: `1px solid ${result.correct ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px',
              }}
            >
              <strong>{result.correct ? '✅ Correct!' : '❌ Incorrect'}</strong>
              <p>{result.reason}</p>
              {!result.correct && <p>Nuts: {result.canonicalNuts.join(', ')}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
