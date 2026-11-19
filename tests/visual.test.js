'use strict'

const assert = require('node:assert/strict')
const vm = require('node:vm')
const path = require('node:path')
const GameEngine = require('../game-engine')

const engine = new GameEngine(path.join(__dirname, '..', 'index.html'))
engine.start({
  mode: 'zomb',
  maps: [0],
  players: [
    { slot: 0, c: 0, ch: 0 },
    { slot: 1, c: 1, ch: 0 }
  ]
})

const visualSmokeTest = `
  draw();
  for (const weapon of Object.keys(WP)) {
    drawE(mk({ x: 360, y: GY, f: 1, ch: 0, hp: 100, wp: weapon, am: 3, c: '#60b5d8', rc: .08 }));
  }
  drawE(mk({ x: 420, y: GY, f: 1, z: 1, zk: 'n', hp: 90, eliteType: null, c: '#86c46a' }));
  drawE(mk({ x: 480, y: GY, f: 1, z: 1, zk: 'f', hp: 150, eliteType: 'brute', c: '#a65c4c' }));
  drawE(mk({ x: 540, y: GY, f: 1, z: 1, zk: 'n', hp: 90, eliteType: 'runner', c: '#e7c45c' }));
  drawE(mk({ x: 600, y: GY, f: 1, z: 1, zk: 'n', hp: 90, eliteType: 'spitter', c: '#8c72c9' }));
  drawE(mk({ x: 660, y: GY, f: 1, B: 1, btype: 'colossus', hp: 1000, c: '#b18a5b' }));
  drawE(mk({ x: 720, y: GY, f: 1, B: 1, btype: 'necromancer', hp: 1000, c: '#a24dff' }));
  drawE(mk({ x: 780, y: GY, f: 1, B: 1, btype: 'electric', hp: 1000, c: '#63cfff' }));
  for (const projectile of [
    { t: 'r', x: 100, y: 100, vx: 300, vy: -80, age: 0, col: '#ff9b55' },
    { t: 'b', x: 140, y: 100, vx: 900, vy: 0, age: 0, col: '#ffe4a0' },
    { t: 'n', x: 180, y: 100, vx: 600, vy: 0, age: 0, col: '#e8eef8' },
    { t: 'p', x: 220, y: 100, vx: 600, vy: 0, age: 0, col: '#e4c47a' },
    { t: 'q', x: 260, y: 100, vx: 300, vy: 0, age: 0, col: '#ffa85c' },
    { t: 's', x: 300, y: 100, vx: 300, vy: 0, age: 0, col: '#9fe3ff' },
    { t: 'f', x: 340, y: 100, vx: 300, vy: 0, age: .1, col: '#ff9a2e' }
  ]) drawP(projectile);
  drawAsteroid(900, 220, 26, .4, true, 3);
  drawAsteroid(980, 220, 22, -.5, false, 5);
  drawMeteorImpact({ impactX: 1050, impactY: 760, impactLife: .6 });
  G.ev = { type: 'meteor', name: 'Метеоритный дождь', c: '#ff9b55', warning: 0, active: 1, fallY: 300, hitX: 800, hitDone: 0, serial: 3, impactLife: 0, rocks: [] };
  drawEvent();
  G.ev = { type: 'rockfall', name: 'Обвал шахты', c: '#c9a27b', warning: 0, active: 1, rocks: [{ x: 280, y: 200, done: 0 }, { x: 1280, y: 280, done: 0 }] };
  drawEvent();
`

assert.doesNotThrow(() => vm.runInContext(visualSmokeTest, engine.context, { timeout: 2500 }))
console.log('Visual tests passed: all weapon sprites, zombie elites, boss armor, projectiles, meteors and impact effects.')
