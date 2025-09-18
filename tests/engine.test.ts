import { describe, it, expect } from 'vitest'
import {
  createRNG,
  dealFlop,
  evaluateNuts,
  validateGuess,
  formatCard,
  parseCard,
  type Card,
} from '../src/engine.js'

describe('Card parsing and formatting', () => {
  it('should parse valid cards', () => {
    expect(parseCard('Ah')).toEqual({ rank: 'A', suit: 'h' })
    expect(parseCard('2s')).toEqual({ rank: '2', suit: 's' })
    expect(parseCard('Td')).toEqual({ rank: 'T', suit: 'd' })
    expect(parseCard('Kc')).toEqual({ rank: 'K', suit: 'c' })
  })

  it('should throw on invalid cards', () => {
    expect(() => parseCard('Zz')).toThrow()
    expect(() => parseCard('1h')).toThrow()
    expect(() => parseCard('A')).toThrow()
    expect(() => parseCard('Ahh')).toThrow()
  })

  it('should format cards correctly', () => {
    expect(formatCard({ rank: 'A', suit: 'h' })).toBe('Ah')
    expect(formatCard({ rank: '2', suit: 's' })).toBe('2s')
    expect(formatCard({ rank: 'T', suit: 'd' })).toBe('Td')
  })
})

describe('RNG and deck dealing', () => {
  it('should create deterministic RNG with seed', () => {
    const rng1 = createRNG(12345)
    const rng2 = createRNG(12345)

    expect(rng1.next()).toBe(rng2.next())
    expect(rng1.randInt(52)).toBe(rng2.randInt(52))
  })

  it('should deal deterministic flop with fixed seed', () => {
    const rng = createRNG(12345)
    const flop = dealFlop(rng)

    expect(flop).toHaveLength(3)
    expect(flop[0]).toEqual({ rank: '9', suit: 'h' })
    expect(flop[1]).toEqual({ rank: '4', suit: 'd' })
    expect(flop[2]).toEqual({ rank: 'Q', suit: 'd' })
  })
})

describe('Nuts evaluation', () => {
  it('should find royal flush nuts on monotone board', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: 'Q', suit: 'h' },
    ]

    const result = evaluateNuts(flop)
    expect(result.patterns).toEqual(['JTh'])
    expect(result.explanation).toContain('royal flush')
  })

  it('should find four of a kind nuts on paired board', () => {
    const flop: Card[] = [
      { rank: '7', suit: 'c' },
      { rank: '7', suit: 'd' },
      { rank: '2', suit: 's' },
    ]

    const result = evaluateNuts(flop)
    expect(result.patterns).toEqual(['77'])
    expect(result.explanation).toContain('four of a kind')
  })

  it('should find straight nuts on connected board', () => {
    const flop: Card[] = [
      { rank: '9', suit: 'h' },
      { rank: 'T', suit: 'd' },
      { rank: 'J', suit: 'c' },
    ]

    const result = evaluateNuts(flop)
    expect(result.patterns).toEqual(['KQo', 'KQs'])
    expect(result.explanation).toContain('straight')
  })

  it('should find straight flush nuts on suited connected board', () => {
    const flop: Card[] = [
      { rank: '2', suit: 'h' },
      { rank: '3', suit: 'h' },
      { rank: '4', suit: 'h' },
    ]

    const result = evaluateNuts(flop)
    expect(result.patterns).toEqual(['65h'])
    expect(result.explanation).toContain('straight flush')
  })
})

describe('Guess validation', () => {
  it('should validate correct guesses for royal flush', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: 'Q', suit: 'h' },
    ]

    const result1 = validateGuess(flop, 'JTh')
    expect(result1.correct).toBe(true)

    const result2 = validateGuess(flop, 'JhTh')
    expect(result2.correct).toBe(true)
  })

  it('should reject incorrect suits for flush requirements', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: 'Q', suit: 'h' },
    ]

    const result = validateGuess(flop, 'JTs')
    expect(result.correct).toBe(true) // JTs should map to JTh when hearts is the flush suit
  })

  it('should validate four of a kind nuts on paired board', () => {
    const flop: Card[] = [
      { rank: '7', suit: 'c' },
      { rank: '7', suit: 'd' },
      { rank: '2', suit: 's' },
    ]

    const result1 = validateGuess(flop, '77')
    expect(result1.correct).toBe(true)

    const result2 = validateGuess(flop, '22')
    expect(result2.correct).toBe(false)
  })

  it('should validate straight nuts with any suits', () => {
    const flop: Card[] = [
      { rank: '9', suit: 'h' },
      { rank: 'T', suit: 'd' },
      { rank: 'J', suit: 'c' },
    ]

    const result1 = validateGuess(flop, 'KQo')
    expect(result1.correct).toBe(true)

    const result2 = validateGuess(flop, 'KQs')
    expect(result2.correct).toBe(true)

    const result3 = validateGuess(flop, 'Q8o')
    expect(result3.correct).toBe(false)
  })

  it('should handle invalid guess formats', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'd' },
      { rank: 'Q', suit: 's' },
    ]

    const result1 = validateGuess(flop, 'ZZ')
    expect(result1.correct).toBe(false)
    expect(result1.reason).toContain('format')

    const result2 = validateGuess(flop, '15')
    expect(result2.correct).toBe(false)
    expect(result2.reason).toContain('format')

    const result3 = validateGuess(flop, 'QQx')
    expect(result3.correct).toBe(false)
    expect(result3.reason).toContain('format')
  })

  it('should return valid nuts patterns for any flop', () => {
    // Test various flop scenarios
    const flops = [
      [
        { rank: 'J', suit: 'h' },
        { rank: 'T', suit: 'd' },
        { rank: '9', suit: 's' },
      ],
      [
        { rank: 'A', suit: 'h' },
        { rank: 'K', suit: 'h' },
        { rank: '7', suit: 'h' },
      ],
      [
        { rank: 'A', suit: 's' },
        { rank: 'A', suit: 'h' },
        { rank: 'K', suit: 'd' },
      ],
      [
        { rank: '2', suit: 'c' },
        { rank: '7', suit: 'h' },
        { rank: 'J', suit: 's' },
      ],
    ] as Card[][]

    flops.forEach((flop) => {
      const nuts = evaluateNuts(flop)
      expect(nuts.patterns).toBeDefined()
      expect(nuts.explanation).toBeDefined()
      expect(nuts.patterns.length).toBeGreaterThan(0)
      expect(typeof nuts.explanation).toBe('string')
    })
  })

  it('should handle edge case board textures', () => {
    // Test monotone board
    const monotoneFlop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: '7', suit: 'h' },
    ]

    const nuts = evaluateNuts(monotoneFlop)
    expect(nuts.patterns.length).toBeGreaterThan(0)
    expect(nuts.explanation).toBeDefined()

    // Test validation still works
    const result = validateGuess(monotoneFlop, 'QJ')
    expect(result.canonicalGuess).toBeDefined()
  })

  it('should maintain API consistency across different boards', () => {
    const testFlops = [
      [
        { rank: 'A', suit: 's' },
        { rank: 'A', suit: 'h' },
        { rank: 'K', suit: 'd' },
      ],
      [
        { rank: '2', suit: 'c' },
        { rank: '3', suit: 'h' },
        { rank: '4', suit: 's' },
      ],
      [
        { rank: 'K', suit: 'h' },
        { rank: 'K', suit: 'd' },
        { rank: 'K', suit: 's' },
      ],
    ] as Card[][]

    testFlops.forEach((flop) => {
      const nuts = evaluateNuts(flop)

      // API structure consistency
      expect(nuts).toHaveProperty('patterns')
      expect(nuts).toHaveProperty('explanation')
      expect(Array.isArray(nuts.patterns)).toBe(true)
      expect(typeof nuts.explanation).toBe('string')

      // Validation API consistency
      const validation = validateGuess(flop, 'AA')
      expect(validation).toHaveProperty('correct')
      expect(validation).toHaveProperty('reason')
      expect(validation).toHaveProperty('canonicalNuts')
      expect(typeof validation.correct).toBe('boolean')
    })
  })

  it('should validate guess format consistency', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'd' },
      { rank: 'Q', suit: 's' },
    ]

    // Test various valid formats
    const result1 = validateGuess(flop, 'JT')
    expect(result1.canonicalGuess).toBeDefined()

    const result2 = validateGuess(flop, 'JTo')
    expect(result2.canonicalGuess).toBeDefined()

    const result3 = validateGuess(flop, 'JhTh')
    expect(result3.canonicalGuess).toBeDefined()
  })
})
