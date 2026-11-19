'use strict'

const fs = require('node:fs')
const vm = require('node:vm')

const DEFAULT_KEYS = [
  { l: 'KeyA', r: 'KeyD', j: 'KeyW', d: 'KeyS', s: 'KeyF', m: 'KeyG' },
  { l: 'ArrowLeft', r: 'ArrowRight', j: 'ArrowUp', d: 'ArrowDown', s: 'Enter', m: 'ShiftRight' },
  { l: 'KeyJ', r: 'KeyL', j: 'KeyI', d: 'KeyK', s: 'KeyH', m: 'KeyU' }
]

const NO_INPUT = Object.freeze({ l: false, r: false, j: false, d: false, s: false, m: false })

function createCanvasContext() {
  const gradient = { addColorStop() {} }
  const target = {
    fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, globalAlpha: 1,
    globalCompositeOperation: 'source-over', lineCap: 'butt', lineJoin: 'miter',
    font: '10px sans-serif', textAlign: 'start', textBaseline: 'alphabetic',
    shadowColor: 'transparent', shadowBlur: 0,
    beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, arc() {}, arcTo() {},
    ellipse() {}, rect() {}, roundRect() {}, fill() {}, stroke() {}, fillRect() {},
    strokeRect() {}, clearRect() {}, save() {}, restore() {}, translate() {}, rotate() {},
    scale() {}, setTransform() {}, transform() {}, setLineDash() {}, drawImage() {},
    fillText() {}, strokeText() {}, quadraticCurveTo() {}, bezierCurveTo() {},
    createLinearGradient() { return gradient },
    createRadialGradient() { return gradient },
    measureText() { return { width: 0 } }
  }
  return new Proxy(target, {
    get(obj, key) {
      if (key in obj) return obj[key]
      if (typeof key === 'string') return () => {}
      return undefined
    },
    set(obj, key, value) {
      obj[key] = value
      return true
    }
  })
}

function createCanvas() {
  const context = createCanvasContext()
  return {
    width: 1600,
    height: 900,
    style: {},
    getContext(type) { return type === '2d' ? context : null },
    toDataURL() { return '' },
    addEventListener() {}
  }
}

function safePlayer(p, index) {
  const source = p && typeof p === 'object' ? p : {}
  const c = Number.isFinite(Number(source.c)) ? Math.max(0, Math.min(7, Math.trunc(Number(source.c)))) : index % 8
  const ch = Number.isFinite(Number(source.ch)) ? Math.max(0, Math.min(11, Math.trunc(Number(source.ch)))) : 0
  return { slot: index, c, ch }
}

class GameEngine {
  constructor(htmlPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map(m => { const srcMatch = m[1].match(/\bsrc=[\"']([^\"']+)[\"']/i); if (srcMatch) { const rel = srcMatch[1].replace(/^\//, '').split(/[?#]/, 1)[0]; return fs.readFileSync(require('node:path').join(__dirname, rel), 'utf8') } return m[2] }).filter(s => s.trim())
    if (scripts.length < 4) throw new Error('The game HTML must contain its three core gameplay scripts.')

    const mainCanvas = createCanvas()
    const elements = new Map([['c', mainCanvas]])
    const document = {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false } }, textContent: '', value: '', addEventListener() {} })
        return elements.get(id)
      },
      createElement(tag) { return tag === 'canvas' ? createCanvas() : { style: {}, addEventListener() {} } },
      querySelectorAll() { return [] }
    }

    let randomOverride = null
    const math = Object.create(Math)
    math.random = () => {
      if (randomOverride !== null) {
        const result = randomOverride
        randomOverride = null
        return result
      }
      return Math.random()
    }
    math.__setRandom = value => { randomOverride = value }

    const sandbox = {
      document,
      navigator: { maxTouchPoints: 0 },
      CanvasRenderingContext2D: undefined,
      innerWidth: 1600,
      innerHeight: 900,
      devicePixelRatio: 1,
      sc: 1,
      addEventListener() {},
      removeEventListener() {},
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame() { return 0 },
      performance: { now: () => Date.now() },
      console,
      Math: math,
      Date,
      JSON,
      Map,
      Set,
      WeakSet,
      WeakMap
    }

    this.context = vm.createContext(sandbox, { name: 'stick-arena-authoritative-match' })
    for (const script of scripts.slice(0, 4)) {
      vm.runInContext(script, this.context, { timeout: 1500, displayErrors: true })
    }

    const bridge = `
      globalThis.endMatch = function(){ if (typeof G !== 'undefined' && G) G.end = 1; };
      const __defaultKeys = ${JSON.stringify(DEFAULT_KEYS)};
      const __noInput = ${JSON.stringify(NO_INPUT)};
      let __connectedPlayers = [{slot:0,c:0,ch:0}];
      let __engineSlotMap = {0:0};
      let __physicalInputs = {};
      const __prepareRoundPlayers = function(){
        const sorted = __connectedPlayers.slice().sort((a,b)=>a.slot-b.slot).slice(0,3);
        if (!sorted.some(p=>p.slot===0)) sorted.unshift({slot:0,c:0,ch:0});
        __engineSlotMap = {};
        S.p = sorted.map((p,i)=>{
          __engineSlotMap[p.slot] = i;
          return {c:Math.max(0,Math.min(7,p.c|0)),ch:Math.max(0,Math.min(11,p.ch|0)),k:__defaultKeys[i]};
        });
        while(S.p.length<3) S.p.push({c:S.p.length%8,ch:0,k:__defaultKeys[S.p.length]});
        NET.conns = sorted.slice(1).map((p,i)=>({slot:i+1,ws:{readyState:1}}));
        NET.remote = {};
        for(let i=0;i<sorted.length;i++) NET.remote[i] = Object.assign({},__noInput);
      };
      const __originalNextRound = nextRound;
      nextRound = function(){ __prepareRoundPlayers(); return __originalNextRound(); };
      globalThis.__arenaEngine = {
        start(config){
          const cfg = config || {};
          const allowed = ['solo','duel','v12','v22','zomb','boss'];
          S.mode = allowed.includes(cfg.mode) ? cfg.mode : 'boss';
          S.rounds = Math.max(1,Math.min(7,Number(cfg.rounds)||3));
          const maps = Array.isArray(cfg.maps) ? cfg.maps.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<MP.length) : [];
          S.maps = maps.length ? maps : [0];
          S.t3 = false;
          const incoming = Array.isArray(cfg.players) ? cfg.players : [];
          __connectedPlayers = incoming.map((p,i)=>({slot:Math.max(0,Math.min(2,p.slot|0)),c:Math.max(0,Math.min(7,p.c|0)),ch:Math.max(0,Math.min(11,p.ch|0))}));
          if(!__connectedPlayers.some(p=>p.slot===0)) __connectedPlayers.unshift({slot:0,c:0,ch:0});
          __physicalInputs = {};
          NET = {role:'host',peer:null,pc:null,conn:null,conns:[],slot:0,manual:false,lastSend:0,remote:{},ready:true,retries:0,retryTimer:null,targetCode:null,lastMi:-1,lobby:null,entitySeq:0};
          K = {}; TOUCH = {l:0,r:0,j:0,d:0,s:0,m:0};
          __prepareRoundPlayers();
          startMatch(0);
          return this.snapshot();
        },
        setConnectedPlayers(players){
          __connectedPlayers = (Array.isArray(players)?players:[]).map(p=>({slot:Math.max(0,Math.min(2,p.slot|0)),c:Math.max(0,Math.min(7,p.c|0)),ch:Math.max(0,Math.min(11,p.ch|0))}));
          if(!__connectedPlayers.some(p=>p.slot===0)) __connectedPlayers.unshift({slot:0,c:0,ch:0});
          __physicalInputs = {};
        },
        setInputs(inputs){
          const source = inputs && typeof inputs === 'object' ? inputs : {};
          const mapped = {};
          for(const physicalSlot of Object.keys(__engineSlotMap)){
            const logicalSlot = __engineSlotMap[physicalSlot];
            const raw = source[physicalSlot] || __noInput;
            mapped[logicalSlot] = {l:!!raw.l,r:!!raw.r,j:!!raw.j,d:!!raw.d,s:!!raw.s,m:!!raw.m};
          }
          for(let i=0;i<3;i++) if(!mapped[i]) mapped[i] = Object.assign({},__noInput);
          NET.remote = mapped;
          __physicalInputs = source;
        },
        step(dt){
          let delta = Math.max(0,Math.min(0.05,Number(dt)||0));
          if(G.hs>0){G.hs=Math.max(0,G.hs-delta);delta=0}
          else if(G.slow>0){G.slow=Math.max(0,G.slow-delta);delta*=.35}
          step(delta);
        },
        disconnectPlayer(physicalSlot){
          const logicalSlot = __engineSlotMap[physicalSlot];
          if(logicalSlot===undefined) return false;
          const player = ents.find(e=>e.pi===logicalSlot&&!e.cl);
          if(player && player.hp>0) die(player);
          __physicalInputs[physicalSlot] = Object.assign({},__noInput);
          return true;
        },
        setPaused(value){G.pause=!!value;},
        isEnded(){return !!(G&&G.end);},
        status(){
          const boss = ents.find(e=>e.B);
          return {mode:G.mode,level:G.lv,players:ents.filter(e=>e.pi!=null&&!e.cl).length,boss:titleSafe(boss),ended:!!G.end};
        },
        snapshot(){
          const skip = new Set(['src','own','tg','pk','in','rl','gp']);
          const clone = function(value){
            const seen = new WeakSet();
            return JSON.parse(JSON.stringify(value,function(key,item){
              if(skip.has(key)||typeof item==='function') return undefined;
              if(item&&typeof item==='object'){if(seen.has(item)) return undefined;seen.add(item);}
              return item;
            }));
          };
          const gSource = Object.assign({},G,{bo:null});
          return {
            g:clone(gSource),mi:G.mi,ents:clone(ents),
            P:clone(P.slice(-64)),IT:clone(IT.slice(-6)),PT:clone(PT.slice(-28)),
            TX:clone(TX.slice(-14)),RG:clone(RG.slice(-8)),BM:clone(BM.slice(-8)),
            ZP:clone(ZP.slice(-12)),TUR:clone(TUR),WALLS:clone(WALLS)
          };
        },
        forceBossPhase(hpRatio,roll){
          const boss = ents.find(e=>e.B);
          if(!boss) return null;
          const originalLevel = G.lv;
          G.lv = Math.max(5, G.lv);
          boss.hp = boss.mh * Math.max(0,Math.min(1,Number(hpRatio)||0));
          Math.__setRandom(Math.max(0,Math.min(.999999,Number(roll)||0)));
          bossPhaseCheck(boss);
          G.lv = originalLevel;
          return {awakened:!!boss.awakened,rage:!!boss.rageMode,hp:boss.hp,maxHp:boss.mh};
        }
      };
      function titleSafe(boss){ return boss ? {id:boss.btype,name:boss.bname,hp:boss.hp,maxHp:boss.mh,awakened:!!boss.awakened,rage:!!boss.rageMode} : null; }
    `
    vm.runInContext(bridge, this.context, { timeout: 1500, displayErrors: true })
    this.api = this.context.__arenaEngine
  }

  start(config) { return this.api.start(config) }
  setConnectedPlayers(players) { return this.api.setConnectedPlayers(players) }
  setInputs(inputs) { return this.api.setInputs(inputs) }
  step(dt) { return this.api.step(dt) }
  disconnectPlayer(slot) { return this.api.disconnectPlayer(slot) }
  setPaused(value) { return this.api.setPaused(value) }
  isEnded() { return this.api.isEnded() }
  status() { return this.api.status() }
  snapshot() { return this.api.snapshot() }
  forceBossPhase(hpRatio, roll) { return this.api.forceBossPhase(hpRatio, roll) }
}

module.exports = GameEngine
