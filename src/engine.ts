export type Suit = 'h' | 'd' | 'c' | 's'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
export type Card = { rank: Rank; suit: Suit }

export interface RNG {
  seed: (n: number) => void
  next: () => number
  randInt: (n: number) => number
}

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const SUITS: Suit[] = ['h', 'd', 'c', 's']

export function createRNG(initialSeed?: number): RNG {
  let seed = initialSeed ?? Date.now()

  return {
    seed: (n: number) => {
      seed = n
    },
    next: () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    },
    randInt: (n: number) => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return Math.floor((seed / 0x100000000) * n)
    },
  }
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit })
    }
  }
  return deck
}

function shuffle(deck: Card[], rng: RNG): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rng.randInt(i + 1)
    const temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
}

export function dealFlop(rng: RNG): Card[] {
  const deck = createDeck()
  shuffle(deck, rng)
  return deck.slice(0, 3)
}

export function formatCard(card: Card): string {
  return card.rank + card.suit
}

export function parseCard(str: string): Card {
  if (str.length !== 2) throw new Error('Invalid card format')
  const rank = str[0] as Rank
  const suit = str[1] as Suit
  if (!RANKS.includes(rank) || !SUITS.includes(suit)) {
    throw new Error('Invalid card format')
  }
  return { rank, suit }
}

function getRankValue(rank: Rank): number {
  return RANKS.indexOf(rank)
}

type HandType = number
const HAND_TYPES = {
  HIGH_CARD: 0,
  PAIR: 1,
  TWO_PAIR: 2,
  THREE_KIND: 3,
  STRAIGHT: 4,
  FLUSH: 5,
  FULL_HOUSE: 6,
  FOUR_KIND: 7,
  STRAIGHT_FLUSH: 8,
}

export function evaluateHand(cards: Card[]): [HandType, ...number[]] {
  if (cards.length !== 5) throw new Error('Hand must have exactly 5 cards')

  const ranks = cards.map((c) => getRankValue(c.rank))
  const suits = cards.map((c) => c.suit)

  const rankCounts = new Map<number, number>()
  const suitCounts = new Map<Suit, number>()

  for (const rank of ranks) {
    rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
  }

  for (const suit of suits) {
    suitCounts.set(suit, (suitCounts.get(suit) || 0) + 1)
  }

  const isFlush = Math.max(...suitCounts.values()) === 5
  const uniqueRanks = [...new Set(ranks)].sort((a, b) => b - a)

  let isStraight = false
  let straightHigh = -1

  if (uniqueRanks.length === 5) {
    if (
      uniqueRanks[0] === 12 &&
      uniqueRanks[1] === 3 &&
      uniqueRanks[2] === 2 &&
      uniqueRanks[3] === 1 &&
      uniqueRanks[4] === 0
    ) {
      isStraight = true
      straightHigh = 3
    } else if (uniqueRanks[0] - uniqueRanks[4] === 4) {
      isStraight = true
      straightHigh = uniqueRanks[0]
    }
  }

  const counts = [...rankCounts.values()].sort((a, b) => b - a)
  const countRanks = [...rankCounts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])
    .map(([rank]) => rank)

  if (isStraight && isFlush) {
    return [HAND_TYPES.STRAIGHT_FLUSH, straightHigh]
  }
  if (counts[0] === 4) {
    return [HAND_TYPES.FOUR_KIND, countRanks[0], countRanks[1]]
  }
  if (counts[0] === 3 && counts[1] === 2) {
    return [HAND_TYPES.FULL_HOUSE, countRanks[0], countRanks[1]]
  }
  if (isFlush) {
    return [HAND_TYPES.FLUSH, ...ranks.sort((a, b) => b - a)]
  }
  if (isStraight) {
    return [HAND_TYPES.STRAIGHT, straightHigh]
  }
  if (counts[0] === 3) {
    return [HAND_TYPES.THREE_KIND, countRanks[0], ...countRanks.slice(1, 3)]
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return [HAND_TYPES.TWO_PAIR, countRanks[0], countRanks[1], countRanks[2]]
  }
  if (counts[0] === 2) {
    return [HAND_TYPES.PAIR, countRanks[0], ...countRanks.slice(1, 4)]
  }

  return [HAND_TYPES.HIGH_CARD, ...ranks.sort((a, b) => b - a)]
}

function compareHands(hand1: [HandType, ...number[]], hand2: [HandType, ...number[]]): number {
  for (let i = 0; i < Math.max(hand1.length, hand2.length); i++) {
    const val1 = hand1[i] ?? -1
    const val2 = hand2[i] ?? -1
    if (val1 !== val2) return val1 - val2
  }
  return 0
}

export function getRemainingDeck(flop: Card[]): Card[] {
  const deck = createDeck()
  const flopSet = new Set(flop.map(formatCard))
  return deck.filter((card) => !flopSet.has(formatCard(card)))
}

export function getAllTwoCardCombos(deck: Card[]): Card[][] {
  const combos: Card[][] = []
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      combos.push([deck[i], deck[j]])
    }
  }
  return combos
}

export function evaluateNuts(flop: Card[]): { patterns: string[]; explanation: string } {
  const remainingDeck = getRemainingDeck(flop)
  const allCombos = getAllTwoCardCombos(remainingDeck)

  let bestHand: [HandType, ...number[]] | null = null
  const bestCombos: Card[][] = []

  for (const combo of allCombos) {
    const fiveCards = [...flop, ...combo]
    const handValue = evaluateHand(fiveCards)

    if (!bestHand || compareHands(handValue, bestHand) > 0) {
      bestHand = handValue
      bestCombos.length = 0
      bestCombos.push(combo)
    } else if (compareHands(handValue, bestHand) === 0) {
      bestCombos.push(combo)
    }
  }

  if (!bestHand) {
    throw new Error('No valid hand found')
  }

  const patterns = canonicalizePatterns(bestCombos, flop, bestHand)
  const explanation = getHandExplanation(bestHand)

  return { patterns, explanation }
}

function canonicalizePatterns(
  combos: Card[][],
  flop: Card[],
  handValue: [HandType, ...number[]]
): string[] {
  const patterns = new Set<string>()
  const handType = handValue[0]

  const flushSuit = getFlushSuit(flop)
  const needsSpecificSuit = handType === HAND_TYPES.FLUSH || handType === HAND_TYPES.STRAIGHT_FLUSH

  for (const combo of combos) {
    const [card1, card2] = combo
    const rank1 = card1.rank
    const rank2 = card2.rank

    if (rank1 === rank2) {
      patterns.add(rank1 + rank2)
    } else {
      const suited = card1.suit === card2.suit
      const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
      const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1

      if (needsSpecificSuit && flushSuit && suited && card1.suit === flushSuit) {
        patterns.add(highRank + lowRank + flushSuit)
      } else if (!needsSpecificSuit) {
        if (suited) {
          patterns.add(highRank + lowRank + 's')
        } else {
          patterns.add(highRank + lowRank + 'o')
        }
      }
    }
  }

  if (patterns.size === 0 && needsSpecificSuit) {
    for (const combo of combos) {
      const [card1, card2] = combo
      const rank1 = card1.rank
      const rank2 = card2.rank
      const suited = card1.suit === card2.suit
      const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
      const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1

      if (suited && card1.suit === flushSuit) {
        patterns.add(highRank + lowRank + flushSuit)
      }
    }
  }

  const result = [...patterns].sort()
  if (result.length === 0) {
    for (const combo of combos) {
      const [card1, card2] = combo
      const rank1 = card1.rank
      const rank2 = card2.rank

      if (rank1 === rank2) {
        patterns.add(rank1 + rank2)
      } else {
        const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
        const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1
        patterns.add(highRank + lowRank)
      }
    }
    return [...patterns].sort()
  }

  return result
}

function getFlushSuit(flop: Card[]): Suit | null {
  const suitCounts = new Map<Suit, number>()
  for (const card of flop) {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1)
  }

  for (const [suit, count] of suitCounts) {
    if (count >= 3) return suit
  }
  return null
}

function getHandExplanation(handValue: [HandType, ...number[]]): string {
  const handType = handValue[0]

  switch (handType) {
    case HAND_TYPES.STRAIGHT_FLUSH:
      return handValue[1] === 12 ? 'royal flush' : 'straight flush'
    case HAND_TYPES.FOUR_KIND:
      return 'four of a kind'
    case HAND_TYPES.FULL_HOUSE:
      return 'full house'
    case HAND_TYPES.FLUSH:
      return 'flush'
    case HAND_TYPES.STRAIGHT:
      return 'straight'
    case HAND_TYPES.THREE_KIND:
      return 'three of a kind'
    case HAND_TYPES.TWO_PAIR:
      return 'two pair'
    case HAND_TYPES.PAIR:
      return 'pair'
    default:
      return 'high card'
  }
}

export function validateGuess(
  flop: Card[],
  guess: string
): {
  correct: boolean
  reason: string
  canonicalGuess?: string
  canonicalNuts: string[]
} {
  const nutsResult = evaluateNuts(flop)

  try {
    const canonicalGuess = parseGuess(guess, flop)

    // Check if guess matches any nuts pattern
    // For 2-rank guesses like "T7", check if T7o or T7s is in nuts
    const isCorrect =
      nutsResult.patterns.includes(canonicalGuess) ||
      (canonicalGuess.length === 2 &&
        nutsResult.patterns.some((pattern) => pattern.startsWith(canonicalGuess)))

    return {
      correct: isCorrect,
      reason: isCorrect ? 'Correct!' : `Incorrect. Nuts: ${nutsResult.patterns.join(', ')}`,
      canonicalGuess,
      canonicalNuts: nutsResult.patterns,
    }
  } catch (error) {
    return {
      correct: false,
      reason: `Invalid format. ${(error as Error).message}`,
      canonicalNuts: nutsResult.patterns,
    }
  }
}

function parseGuess(guess: string, flop: Card[]): string {
  const cleaned = guess.trim().toUpperCase()

  if (cleaned.length === 2) {
    const rank1 = cleaned[0] as Rank
    const rank2 = cleaned[1] as Rank
    if (!RANKS.includes(rank1) || !RANKS.includes(rank2)) {
      throw new Error("Guess must be like 'AA', 'KQs', 'A5o', or exact 'AhQh'")
    }
    if (rank1 === rank2) {
      return cleaned
    }
    const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
    const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1
    return highRank + lowRank
  }

  if (cleaned.length === 3) {
    const rank1 = cleaned[0] as Rank
    const rank2 = cleaned[1] as Rank
    const modifier = cleaned[2]

    if (!RANKS.includes(rank1) || !RANKS.includes(rank2)) {
      throw new Error("Guess must be like 'AA', 'KQs', 'A5o', or exact 'AhQh'")
    }

    const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
    const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1

    if (modifier === 'S') {
      const flushSuit = getFlushSuit(flop)
      if (flushSuit) {
        return highRank + lowRank + flushSuit
      }
      return highRank + lowRank + 's'
    } else if (modifier === 'O') {
      return highRank + lowRank + 'o'
    } else if (SUITS.includes(modifier.toLowerCase() as Suit)) {
      return highRank + lowRank + modifier.toLowerCase()
    }

    throw new Error("Guess must be like 'AA', 'KQs', 'A5o', or exact 'AhQh'")
  }

  if (cleaned.length === 4) {
    const rank1 = cleaned[0] as Rank
    const suit1 = cleaned[1].toLowerCase() as Suit
    const rank2 = cleaned[2] as Rank
    const suit2 = cleaned[3].toLowerCase() as Suit

    if (
      !RANKS.includes(rank1) ||
      !SUITS.includes(suit1) ||
      !RANKS.includes(rank2) ||
      !SUITS.includes(suit2)
    ) {
      throw new Error("Guess must be like 'AA', 'KQs', 'A5o', or exact 'AhQh'")
    }

    if (rank1 === rank2) {
      return rank1 + rank2
    }

    const highRank = getRankValue(rank1) > getRankValue(rank2) ? rank1 : rank2
    const lowRank = getRankValue(rank1) > getRankValue(rank2) ? rank2 : rank1
    const suited = suit1 === suit2

    if (suited) {
      const flushSuit = getFlushSuit(flop)
      if (flushSuit && suit1 === flushSuit) {
        return highRank + lowRank + suit1
      }
      return highRank + lowRank + 's'
    } else {
      return highRank + lowRank + 'o'
    }
  }

  throw new Error("Guess must be like 'AA', 'KQs', 'A5o', or exact 'AhQh'")
}
