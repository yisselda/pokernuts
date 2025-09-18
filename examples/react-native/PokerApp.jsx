import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { createRNG, dealFlop, validateGuess, formatCard } from 'poker-nuts-practice/engine'

export default function PokerApp() {
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
    <View style={styles.container}>
      <Text style={styles.title}>🃏 Poker Nuts Practice</Text>

      <TouchableOpacity style={styles.button} onPress={dealNewFlop}>
        <Text style={styles.buttonText}>Deal New Flop</Text>
      </TouchableOpacity>

      {flop.length > 0 && (
        <View style={styles.gameArea}>
          <Text style={styles.flop}>
            Flop: {flop.map(formatCard).join(' ')}
          </Text>

          <TextInput
            style={styles.input}
            value={guess}
            onChangeText={setGuess}
            placeholder="Enter your guess (AA, KQs, A5o, AhQh)"
            autoCapitalize="characters"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleGuess}>
            <Text style={styles.buttonText}>Submit Guess</Text>
          </TouchableOpacity>

          {result && (
            <View style={[
              styles.result,
              { backgroundColor: result.correct ? '#d4edda' : '#f8d7da' }
            ]}>
              <Text style={[
                styles.resultText,
                { color: result.correct ? '#155724' : '#721c24' }
              ]}>
                {result.correct ? '✅ Correct!' : '❌ Incorrect'}
              </Text>
              <Text style={styles.reason}>{result.reason}</Text>
              {!result.correct && (
                <Text style={styles.nuts}>
                  Nuts: {result.canonicalNuts.join(', ')}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
  },
  flop: {
    fontSize: 20,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  result: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reason: {
    marginTop: 5,
  },
  nuts: {
    marginTop: 5,
    fontStyle: 'italic',
  },
})