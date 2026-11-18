'use strict'

const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { performance } = require('node:perf_hooks')
const { WebSocketServer, WebSocket } = require('ws')
const GameEngine = require('./game-engine')

const PORT = Number(process.env.PORT || 8080)
const ROOT = __dirname
const INDEX_FILE = ['index.html', 'stick_optimized.html', 'stick.html'].map(name => path.join(ROOT, name)).find(file => fs.existsSync(file)) || path.join(ROOT, 'index.html')
const rooms = new Map()
const clients = new WeakMap()
const TICK_RATE = 60
const SNAPSHOT_RATE = 20
const TICK_MS = 1000 / TICK_RATE
const SNAPSHOT_MS = 1000 / SNAPSHOT_RATE
const NO_INPUT = Object.freeze({ l: false, r: false, j: false, d: false, s: false, m: false })
const ALLOWED_MODES = new Set(['solo', 'duel', 'v12', 'v22', 'zomb', 'boss'])

function send(ws, payload, options = {}) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return false
  if (!options.force && ws.bufferedAmount > (options.limit || 512 * 1024)) return false
  try {
    ws.send(typeof payload === 'string' ? payload : JSON.stringify(payload))
    return true
  } catch (_) {
    return false
  }
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += alphabet[crypto.randomInt(alphabet.length)]
  return code
}

function cleanInput(value) {
  const source = value && typeof value === 'object' ? value : {}
  return {
    l: source.l === true,
    r: source.r === true,
    j: source.j === true,
    d: source.d === true,
    s: source.s === true,
    m: source.m === true
  }
}

function cleanPlayer(value, slot) {
  const source = value && typeof value === 'object' ? value : {}
  return {
    slot,
    c: Number.isFinite(Number(source.c)) ? Math.max(0, Math.min(7, Math.trunc(Number(source.c)))) : slot % 8,
    ch: Number.isFinite(Number(source.ch)) ? Math.max(0, Math.min(11, Math.trunc(Number(source.ch)))) : 0
  }
}

function connectedPlayers(room) {
  const result = [cleanPlayer(room.playerConfigs.get(0), 0)]
  for (const slot of [1, 2]) {
    const ws = room.guests.get(slot)
    if (ws && ws.readyState === WebSocket.OPEN) result.push(cleanPlayer(room.playerConfigs.get(slot), slot))
  }
  return result
}

function lobbyState(room) {
  return {
    type: 'lobby',
    players: connectedPlayers(room),
    mode: room.settings.mode,
    maps: room.settings.maps.slice(),
    rounds: room.settings.rounds,
    swap: room.settings.swap
  }
}

function broadcast(room, payload) {
  send(room.host, payload)
  for (const guest of room.guests.values()) send(guest, payload)
}

function broadcastLobby(room) {
  broadcast(room, lobbyState(room))
}

function createRoom(ws) {
  let code
  do code = makeCode()
  while (rooms.has(code))

  const room = {
    code,
    host: ws,
    guests: new Map(),
    playerConfigs: new Map([[0, { c: 0, ch: 0 }]]),
    settings: { mode: 'duel', maps: [0, 4, 5], rounds: 3, swap: 0 },
    inputs: new Map(),
    engine: null,
    started: false,
    paused: false,
    accumulator: 0,
    lastTick: performance.now(),
    lastSnapshot: 0,
    snapshotSeq: 0,
    error: null
  }

  rooms.set(code, room)
  clients.set(ws, { role: 'host', room, slot: 0, rateAt: Date.now(), rateCount: 0 })
  send(ws, { type: 'created', code, slot: 0 })
  broadcastLobby(room)
}

function joinRoom(ws, requestedCode) {
  const code = String(requestedCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const room = rooms.get(code)
  if (!room || !room.host || room.host.readyState !== WebSocket.OPEN) {
    send(ws, { type: 'error', message: 'Комната не найдена или хост отключился.' })
    return
  }
  if (room.started && room.engine && !room.engine.isEnded()) {
    send(ws, { type: 'error', message: 'Матч уже идёт. Подключиться можно после его завершения.' })
    return
  }

  let slot = 0
  for (const candidate of [1, 2]) {
    if (!room.guests.has(candidate)) {
      slot = candidate
      break
    }
  }
  if (!slot) {
    send(ws, { type: 'error', message: 'В комнате уже три игрока.' })
    return
  }

  room.guests.set(slot, ws)
  room.playerConfigs.set(slot, { c: slot, ch: 0 })
  room.inputs.set(slot, { input: Object.assign({}, NO_INPUT), at: Date.now() })
  clients.set(ws, { role: 'guest', room, slot, rateAt: Date.now(), rateCount: 0 })
  send(ws, { type: 'welcome', slot, code: room.code })
  send(room.host, { type: 'peer-joined', slot })
  broadcastLobby(room)
}

function updateLobbyFromHost(room, data) {
  if (room.started && room.engine && !room.engine.isEnded()) return
  const mode = String(data.mode || 'duel')
  if (ALLOWED_MODES.has(mode)) room.settings.mode = mode
  const maps = Array.isArray(data.maps)
    ? [...new Set(data.maps.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n <= 9))].slice(0, 10)
    : []
  if (maps.length) room.settings.maps = maps
  const rounds = Number(data.rounds)
  if ([1, 3, 5, 7].includes(rounds)) room.settings.rounds = rounds
  room.settings.swap = Number(data.swap) === 1 ? 1 : 0

  if (Array.isArray(data.players)) {
    for (const player of data.players) {
      const slot = Number(player && player.slot)
      if (!Number.isInteger(slot) || slot < 0 || slot > 2) continue
      if (slot !== 0 && !room.guests.has(slot)) continue
      room.playerConfigs.set(slot, cleanPlayer(player, slot))
    }
  }
  broadcastLobby(room)
}

function updateGuestConfig(room, slot, data) {
  if (room.started && room.engine && !room.engine.isEnded()) return
  room.playerConfigs.set(slot, cleanPlayer(data, slot))
  broadcastLobby(room)
}

function startAuthoritativeMatch(room, config) {
  if (room.started && room.engine && !room.engine.isEnded()) {
    send(room.host, { type: 'error', message: 'Матч уже запущен.' })
    return
  }

  if (config && typeof config === 'object') updateLobbyFromHost(room, config)
  const players = connectedPlayers(room)
  let engine
  try {
    engine = new GameEngine(INDEX_FILE)
    engine.start({
      mode: room.settings.mode,
      maps: room.settings.maps,
      rounds: room.settings.rounds,
      players
    })
  } catch (error) {
    console.error('Failed to start authoritative match:', error)
    send(room.host, { type: 'error', message: 'Сервер не смог запустить матч. Проверьте файлы игры и попробуйте ещё раз.' })
    room.engine = null
    room.started = false
    return
  }

  room.engine = engine
  room.started = true
  room.paused = false
  room.accumulator = 0
  room.lastTick = performance.now()
  room.lastSnapshot = 0
  room.inputs.clear()
  for (const player of players) room.inputs.set(player.slot, { input: Object.assign({}, NO_INPUT), at: Date.now() })

  broadcast(room, { type: 'start' })
  broadcastLobby(room)
  broadcastState(room, true)
}

function broadcastState(room, force = false) {
  if (!room.engine) return
  let packet
  try {
    const payload = { type: 'state', state: room.engine.snapshot(), seq: ++room.snapshotSeq }
    packet = JSON.stringify(payload)
  } catch (error) {
    console.error('Snapshot serialization failed:', error)
    room.error = 'Не удалось собрать снимок состояния матча.'
    broadcast(room, { type: 'error', message: room.error })
    return
  }
  const peers = [room.host, ...room.guests.values()]
  for (const peer of peers) {
    if (!peer || peer.readyState !== WebSocket.OPEN) continue
    if (!force && peer.bufferedAmount > 700 * 1024) continue
    if (peer.bufferedAmount > 2 * 1024 * 1024) {
      try { peer.close(1013, 'Client too slow') } catch (_) {}
      continue
    }
    send(peer, packet, { force: true })
  }
}

function rateAllowed(client, maximum = 75) {
  const now = Date.now()
  if (now - client.rateAt >= 1000) {
    client.rateAt = now
    client.rateCount = 0
  }
  client.rateCount++
  return client.rateCount <= maximum
}

function handleMessage(ws, raw) {
  let data
  try { data = JSON.parse(raw.toString()) } catch (_) {
    send(ws, { type: 'error', message: 'Некорректное сообщение.' })
    return
  }
  if (!data || typeof data !== 'object' || typeof data.type !== 'string') return

  const client = clients.get(ws)
  if (!client) {
    if (data.type === 'create') createRoom(ws)
    else if (data.type === 'join') joinRoom(ws, data.code)
    else if (data.type === 'ping') send(ws, { type: 'pong' })
    else send(ws, { type: 'error', message: 'Сначала создай комнату или подключись к ней.' })
    return
  }
  if (!rateAllowed(client, data.type === 'input' ? 65 : 35)) return

  const room = client.room
  if (data.type === 'ping') {
    send(ws, { type: 'pong' })
    return
  }

  if (data.type === 'input') {
    room.inputs.set(client.slot, { input: cleanInput(data.input), at: Date.now() })
    return
  }

  if (client.role === 'host') {
    if (data.type === 'lobby') updateLobbyFromHost(room, data)
    else if (data.type === 'start') startAuthoritativeMatch(room, data.config)
    else if (data.type === 'pause' && room.engine && !room.engine.isEnded()) {
      room.paused = !!data.paused
      room.engine.setPaused(room.paused)
      broadcast(room, { type: 'paused', paused: room.paused })
    }
  } else if (data.type === 'config') {
    updateGuestConfig(room, client.slot, data)
  }
}

function removeClient(ws) {
  const client = clients.get(ws)
  if (!client) return
  clients.delete(ws)
  const room = client.room

  if (client.role === 'host') {
    if (rooms.get(room.code) === room) rooms.delete(room.code)
    for (const guest of room.guests.values()) {
      send(guest, { type: 'room-closed', message: 'Хост отключился. Комната закрыта.' }, { force: true })
      try { guest.close(1000, 'Room closed') } catch (_) {}
    }
    room.guests.clear()
    room.engine = null
    return
  }

  if (room.guests.get(client.slot) === ws) room.guests.delete(client.slot)
  room.inputs.delete(client.slot)
  if (room.engine && !room.engine.isEnded()) {
    try { room.engine.disconnectPlayer(client.slot) } catch (error) { console.error('disconnect player', error) }
    room.engine.setConnectedPlayers(connectedPlayers(room))
  }
  if (room.playerConfigs.has(client.slot)) room.playerConfigs.delete(client.slot)
  send(room.host, { type: 'peer-left', slot: client.slot })
  broadcastLobby(room)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  if (url.pathname === '/health') {
    const response = { ok: true, service: 'stick-arena-authoritative', rooms: rooms.size, activeMatches: [...rooms.values()].filter(r => r.started && r.engine && !r.engine.isEnded()).length }
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(response))
    return
  }

  const assetRoots = [{ prefix: '/js/', dir: path.join(ROOT, 'js') }, { prefix: '/css/', dir: path.join(ROOT, 'css') }];
  const asset = assetRoots.find(item => url.pathname.startsWith(item.prefix));
  if (req.method === 'GET' && asset) {
    const relative = decodeURIComponent(url.pathname.slice(asset.prefix.length));
    if (!relative || relative.includes('..') || relative.includes('\\') || relative.includes('/')) { res.writeHead(400); res.end('Bad asset path'); return; }
    const file = path.join(asset.dir, relative);
    fs.readFile(file, (error, content) => { if (error) { res.writeHead(404); res.end('Asset not found'); return; }
      const type = file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/css; charset=utf-8';
      res.writeHead(200, { 'content-type': type, 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff' }); res.end(content);
    }); return;
  }

  const pagePaths = new Set(['/', '/index.html', '/stick_optimized.html'])
  if (req.method === 'GET' && pagePaths.has(url.pathname)) {
    fs.readFile(INDEX_FILE, (error, content) => {
      if (error) {
        res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('Stick Arena game file is missing. Add index.html to the repository root.')
        return
      }
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache, no-store, must-revalidate',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'same-origin'
      })
      res.end(content)
    })
    return
  }

  if (url.pathname === '/favicon.ico') {
    res.writeHead(204)
    res.end()
    return
  }
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

const wss = new WebSocketServer({
  server,
  path: '/ws',
  maxPayload: 16 * 1024,
  perMessageDeflate: false
})

wss.on('connection', ws => {
  ws.isAlive = true
  ws.on('pong', () => { ws.isAlive = true })
  ws.on('message', raw => handleMessage(ws, raw))
  ws.on('close', () => removeClient(ws))
  ws.on('error', () => removeClient(ws))
})

setInterval(() => {
  for (const room of rooms.values()) {
    if (!room.started || !room.engine || room.engine.isEnded()) continue
    const now = performance.now()
    const elapsed = Math.max(0, Math.min(150, now - room.lastTick))
    room.lastTick = now
    room.accumulator = Math.min(250, room.accumulator + elapsed)

    let steps = 0
    while (room.accumulator >= TICK_MS && steps < 8) {
      const currentTime = Date.now()
      const inputs = {}
      for (const player of connectedPlayers(room)) {
        const record = room.inputs.get(player.slot)
        inputs[player.slot] = record && currentTime - record.at < 280 ? record.input : NO_INPUT
      }
      try {
        room.engine.setInputs(inputs)
        room.engine.step(TICK_MS / 1000)
      } catch (error) {
        console.error('Authoritative simulation failed:', error)
        room.error = 'Ошибка симуляции матча. Хост может запустить новый матч.'
        broadcast(room, { type: 'error', message: room.error })
        room.engine = null
        room.started = false
        room.paused = false
        break
      }
      room.accumulator -= TICK_MS
      steps++
    }

    if (now - room.lastSnapshot >= SNAPSHOT_MS) {
      room.lastSnapshot = now
      broadcastState(room)
    }
  }
}, 8)

setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      try { ws.terminate() } catch (_) {}
      continue
    }
    ws.isAlive = false
    try { ws.ping() } catch (_) { try { ws.terminate() } catch (_) {} }
  }
}, 25000)

server.keepAliveTimeout = 65000
server.headersTimeout = 70000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Stick Arena authoritative server listening on ${PORT}`)
})

process.on('SIGTERM', () => {
  for (const ws of wss.clients) {
    try { ws.close(1001, 'Server restarting') } catch (_) {}
  }
  server.close(() => process.exit(0))
})
