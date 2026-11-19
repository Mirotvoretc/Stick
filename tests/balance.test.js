'use strict'

const assert = require('node:assert/strict')
const path = require('node:path')
const vm = require('node:vm')
const GameEngine = require('../game-engine')
const htmlPath = path.join(__dirname, '..', 'index.html')

const duel = new GameEngine(htmlPath)
duel.start({
  mode: 'duel',
  maps: [0],
  rounds: 3,
  players: [
    { slot: 0, c: 0, ch: 4 },
    { slot: 1, c: 1, ch: 0 }
  ]
})

const cloneResult = vm.runInContext(`(() => {
  const original = ents.find(e => e.pi === 0 && !e.cl)
  const clone = ents.find(e => e.cl && e.own === original)
  const enemy = ents.find(e => e.pi === 1)
  original.hp = 1
  hit(original, 10, enemy, 0, 0, 1)
  return { hp: original.hp, maxHp: original.mh, cloneHp: clone.hp, revived: original.cloneRevived }
})()`, duel.context)
assert.equal(cloneResult.revived, 1)
assert.equal(cloneResult.hp, cloneResult.maxHp * .5)
assert.equal(cloneResult.cloneHp, 0)

const wallResult = vm.runInContext(`(() => {
  WALLS = [{ x: 500, y: 200, bottom: 825, hp: 50, max: 50, life: 5 }]
  const enemy = { x: 650, y: 600, w: 40, h: 58, vx: 500, vy: 0 }
  blockMonsterByWalls(enemy, 300, 600)
  return { x: enemy.x, vx: enemy.vx }
})()`, duel.context)
assert.equal(wallResult.x, 368)
assert.equal(wallResult.vx, 0)

const boss = new GameEngine(htmlPath)
boss.start({
  mode: 'boss',
  maps: [0],
  rounds: 1,
  players: [
    { slot: 0, c: 0, ch: 0 },
    { slot: 1, c: 1, ch: 0 }
  ]
})
const bossState = boss.status().boss
const baseBossHp = vm.runInContext('BOSS_TYPES[0].hp', boss.context)
const expectedBossHp = (baseBossHp + 280) * 1.38 * .85
assert.ok(Math.abs(bossState.maxHp - expectedBossHp) < .01)


const brawler = new GameEngine(htmlPath)
brawler.start({
  mode: 'duel', maps: [0], rounds: 3,
  players: [
    { slot: 0, c: 0, ch: 11 },
    { slot: 1, c: 1, ch: 0 }
  ]
})
const healResult = vm.runInContext(`(() => {
  const fighter = ents.find(e => e.pi === 0)
  const target = ents.find(e => e.pi === 1)
  fighter.hp = 100
  Math.__setRandom(.1)
  hit(target, 1, fighter, 0, 0, 1)
  return fighter.hp
})()`, brawler.context)
assert.equal(healResult, 103)

const duelist = new GameEngine(htmlPath)
duelist.start({
  mode: 'duel', maps: [0], rounds: 3,
  players: [
    { slot: 0, c: 0, ch: 8 },
    { slot: 1, c: 1, ch: 0 }
  ]
})
const parryResult = vm.runInContext(`(() => {
  const fighter = ents.find(e => e.pi === 0)
  const shooter = ents.find(e => e.pi === 1)
  fighter.parryTimer = 4
  fighter.parryCharges = 3
  P.push({ x: fighter.x, y: fighter.y-fighter.h*.5, vx: -120, vy: 0, life: 1, age: 0, t: 'b', dm: 12, tm: shooter.tm, src: shooter })
  updP(1/60)
  return { charges: fighter.parryCharges, reflected: !!P[0].reflected, team: P[0].tm }
})()`, duelist.context)
assert.equal(parryResult.charges, 2)
assert.equal(parryResult.reflected, true)
assert.equal(parryResult.team, 0)

const bossStun = new GameEngine(htmlPath)
bossStun.start({
  mode: 'boss', maps: [0], rounds: 1,
  players: [
    { slot: 0, c: 0, ch: 11 },
    { slot: 1, c: 1, ch: 0 }
  ]
})
const stunResult = vm.runInContext(`(() => {
  const boss = ents.find(e => e.B)
  st(boss, 'sl', 3)
  hit(boss, 20, ents.find(e => e.pi === 0), 0, 2, 1)
  return { slow: boss.sl || 0, freeze: boss.fz || 0 }
})()`, bossStun.context)
assert.equal(stunResult.slow, 0)
assert.equal(stunResult.freeze, 0)

const balance = vm.runInContext(`({
  brawler: CH[11].d,
  medic: CH[5].d,
  ghost: CH[3].d,
  berserker: CH[2].d,
  duelist: CH[8].d,
  jumpHeight: 800,
  brawlerCritChance: 0.25,
  ghostProjectileDodgeChance: 0.15,
  brawlerHealChance: 0.15
})`, duel.context)
assert.match(balance.brawler, /25%/)
assert.match(balance.brawler, /15%/)
assert.match(balance.medic, /12 с/)
assert.match(balance.ghost, /15%/)
assert.match(balance.berserker, /1 HP\/с/)
assert.match(balance.duelist, /трёх пуль/)

console.log('Balance tests passed: clone handoff, barrier collision, -15% boss HP and requested class values.')
