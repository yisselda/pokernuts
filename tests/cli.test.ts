import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRNG, type Card } from '../src/engine.js'
import {
  parseArgs,
  printIntroduction,
  formatFlopDisplay,
  isQuitCommand,
  isEmptyInput,
  processGuess,
  createGameLoop,
  main,
  type ParsedArgs
} from '../src/cli.js'

describe('parseArgs', () => {
  it('should return empty object when no arguments provided', () => {
    const result = parseArgs([])
    expect(result).toEqual({})
  })

  it('should parse valid seed argument', () => {
    const result = parseArgs(['-seed=12345'])
    expect(result).toEqual({ seed: 12345 })
  })

  it('should parse multiple arguments with seed', () => {
    const result = parseArgs(['-seed=999', 'other-arg'])
    expect(result).toEqual({ seed: 999 })
  })

  it('should throw error for invalid seed format', () => {
    expect(() => parseArgs(['-seed='])).toThrow('Invalid seed format. Use -seed=NUMBER')
  })

  it('should throw error for non-numeric seed', () => {
    expect(() => parseArgs(['-seed=abc'])).toThrow('Invalid seed value')
  })

  it('should parse decimal seed as integer', () => {
    // parseInt handles decimals by truncating, so 12.34 becomes 12
    const result = parseArgs(['-seed=12.34'])
    expect(result).toEqual({ seed: 12 })
  })

  it('should ignore non-seed arguments', () => {
    const result = parseArgs(['--help', '--version', 'file.txt'])
    expect(result).toEqual({})
  })
})

describe('printIntroduction', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should print introduction messages', () => {
    printIntroduction()

    expect(consoleSpy).toHaveBeenCalledTimes(3)
    expect(consoleSpy).toHaveBeenNthCalledWith(1, '🃏 Poker Nuts Practice CLI')
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Type your guess like: AA, KQs, A5o, or exact AhQh')
    expect(consoleSpy).toHaveBeenNthCalledWith(3, "Type 'q' to quit\n")
  })
})

describe('formatFlopDisplay', () => {
  it('should format flop cards correctly', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'd' },
      { rank: 'Q', suit: 's' }
    ]

    const result = formatFlopDisplay(flop)
    expect(result).toBe('Flop: Ah Kd Qs')
  })

  it('should handle different card combinations', () => {
    const flop: Card[] = [
      { rank: '2', suit: 'c' },
      { rank: 'T', suit: 'h' },
      { rank: 'J', suit: 'd' }
    ]

    const result = formatFlopDisplay(flop)
    expect(result).toBe('Flop: 2c Th Jd')
  })
})

describe('isQuitCommand', () => {
  it('should return true for "q"', () => {
    expect(isQuitCommand('q')).toBe(true)
  })

  it('should return true for "Q" (case insensitive)', () => {
    expect(isQuitCommand('Q')).toBe(true)
  })

  it('should handle whitespace around quit command', () => {
    expect(isQuitCommand('  q  ')).toBe(true)
    expect(isQuitCommand('\tQ\n')).toBe(true)
  })

  it('should return false for non-quit commands', () => {
    expect(isQuitCommand('quit')).toBe(false)
    expect(isQuitCommand('AA')).toBe(false)
    expect(isQuitCommand('KQs')).toBe(false)
    expect(isQuitCommand('')).toBe(false)
  })
})

describe('isEmptyInput', () => {
  it('should return true for empty string', () => {
    expect(isEmptyInput('')).toBe(true)
  })

  it('should return true for whitespace-only strings', () => {
    expect(isEmptyInput('   ')).toBe(true)
    expect(isEmptyInput('\t\n')).toBe(true)
    expect(isEmptyInput(' \t \n ')).toBe(true)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmptyInput('AA')).toBe(false)
    expect(isEmptyInput(' KQ ')).toBe(false)
    expect(isEmptyInput('q')).toBe(false)
  })
})

describe('processGuess', () => {
  it('should return correct result for royal flush nuts', () => {
    // Royal flush possible flop
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: 'Q', suit: 'h' }
    ]
    // TJ of hearts should be nuts (royal flush)
    const result = processGuess(flop, 'TJh')
    expect(result.correct).toBe(true)
    expect(result.message).toContain('✅ Correct!')
  })

  it('should return incorrect result for wrong suit on flush board', () => {
    // Flush board - hearts
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'h' },
      { rank: '7', suit: 'h' }
    ]
    // TJ of spades should not be nuts on heart flush board
    const result = processGuess(flop, 'TJs')
    expect(result.correct).toBe(false)
    expect(result.message).toContain('❌')
  })

  it('should return correct result for pocket pair nuts', () => {
    // Use exact scenario from working engine test
    const flop: Card[] = [
      { rank: '7', suit: 'c' },
      { rank: '7', suit: 'd' },
      { rank: '2', suit: 's' }
    ]
    // Pocket 7s should be nuts (quads)
    const result = processGuess(flop, '77')
    expect(result.correct).toBe(true)
    expect(result.message).toContain('✅ Correct!')
  })

  it('should handle invalid input format gracefully', () => {
    const flop: Card[] = [
      { rank: 'A', suit: 'h' },
      { rank: 'K', suit: 'd' },
      { rank: 'Q', suit: 's' }
    ]
    const result = processGuess(flop, 'invalid-format')
    expect(result.correct).toBe(false)
    expect(result.message).toContain('❌')
    expect(result.message).toContain('format')
  })

  it('should format success and failure messages correctly', () => {
    const flop: Card[] = [
      { rank: '2', suit: 'c' },
      { rank: '7', suit: 'h' },
      { rank: 'J', suit: 's' }
    ]

    // Test message structure for any result
    const result = processGuess(flop, 'AA')
    expect(result).toHaveProperty('correct')
    expect(result).toHaveProperty('message')
    expect(typeof result.correct).toBe('boolean')
    expect(typeof result.message).toBe('string')

    if (result.correct) {
      expect(result.message).toMatch(/^✅ Correct!/)
    } else {
      expect(result.message).toMatch(/^❌/)
    }
  })
})

describe('createGameLoop', () => {
  let mockRng: ReturnType<typeof createRNG>
  let mockRl: any
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockRng = createRNG(12345)
    mockRl = {
      question: vi.fn(),
      close: vi.fn()
    }
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should create a function that starts a game round', () => {
    const playRound = createGameLoop(mockRng, mockRl)
    expect(typeof playRound).toBe('function')

    playRound()
    expect(mockRl.question).toHaveBeenCalledWith('Guess the nuts: ', expect.any(Function))
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Flop:'))
  })

  it('should handle quit command in game loop', () => {
    const playRound = createGameLoop(mockRng, mockRl)
    playRound()

    const questionCallback = mockRl.question.mock.calls[0][1]
    questionCallback('q')

    expect(consoleSpy).toHaveBeenCalledWith('Thanks for playing! 👋')
    expect(mockRl.close).toHaveBeenCalled()
  })

  it('should handle empty input in game loop', () => {
    const playRound = createGameLoop(mockRng, mockRl)
    playRound()

    const questionCallback = mockRl.question.mock.calls[0][1]

    // Reset the question mock to track recursive call
    mockRl.question.mockClear()
    questionCallback('')

    expect(consoleSpy).toHaveBeenCalledWith('Please enter a guess or "q" to quit\n')
    expect(mockRl.question).toHaveBeenCalledTimes(1) // Called again for next round
  })
})

describe('main', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let processExitSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    processExitSpy.mockRestore()
  })

  it('should handle invalid arguments gracefully', () => {
    // Mock parseArgs to throw error
    const originalArgv = process.argv
    process.argv = ['node', 'cli.js', '-seed=invalid']

    expect(() => main()).toThrow('process.exit called')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid seed value')
    expect(processExitSpy).toHaveBeenCalledWith(1)

    process.argv = originalArgv
  })
})