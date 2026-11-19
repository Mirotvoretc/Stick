'use strict'

const assert = require('node:assert/strict')
const GameEngine = require('../game-engine')
const htmlPath = require('node:path').join(__dirname, '..', 'index.html')

function runMovementTest(slots) {
  const engine = new GameEngine(htmlPath)
  engine.start({ mode: 'duel', maps: [0], rounds: 3, players: slots.map((slot, index) => ({ slot, c: index, ch: 0 })) })

  for (let i = 0; i < 100; i++) {
    engine.setInputs(Object.fromEntries(slots.map(slot => [slot, { l: false, r: false, j: false, d: false, s: false, m: false }])))
    engine.step(1 / 60)
  }

  const before = new Map(engine.snapshot().ents.filter(entity => entity.pi !== undefined).map(entity => [entity.pi, entity.x]))
  const input = Object.fromEntries(slots.map(slot => [slot, { l: false, r: true, j: false, d: false, s: false, m: false }]))

  for (let i = 0; i < 120; i++) {
    engine.setInputs(input)
    engine.step(1 / 60)
  }

  const after = new Map(engine.snapshot().ents.filter(entity => entity.pi !== undefined).map(entity => [entity.pi, entity.x]))
  for (const [index] of slots.entries()) {
    assert.ok(after.get(index) > before.get(index) + 20, `player ${index} did not move right`)
  }
  return engine
}

const twoPlayers = runMovementTest([0, 1])
const sparseSlots = runMovementTest([0, 2])

for (const engine of [twoPlayers, sparseSlots]) {
  const snapshot = engine.snapshot()
  assert.equal(snapshot.ents.filter(entity => entity.pi !== undefined).length, 2)
  assert.doesNotThrow(() => JSON.stringify(snapshot))
}

const bossEngine = new GameEngine(htmlPath)
bossEngine.start({ mode: 'boss', maps: [0], players: [{ slot: 0, c: 0, ch: 0 }, { slot: 1, c: 1, ch: 0 }] })
assert.equal(bossEngine.status().mode, 'boss')
assert.ok(bossEngine.status().boss)

console.log('Engine tests passed: two-player controls, sparse player slots, snapshots and boss startup.')
