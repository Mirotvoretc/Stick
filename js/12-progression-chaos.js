const EVO_STORE_KEY12='stickArenaEvolutionProfileV1';
const EVO_TREES12={
 engineer:{title:'Инженер',subtitle:'Выбери одну главную специализацию: стойкость турели или её огневая мощь.',nodes:[
  {id:'eng_defense',name:'Бастион турели',type:'main',cost:2,desc:'Турель получает +40% прочности, но наносит на 10% меньше урона.'},
  {id:'eng_damage',name:'Боевой протокол',type:'main',cost:2,desc:'Турель наносит +30% урона, но получает на 20% меньше прочности и быстрее изнашивается.'},
  {id:'eng_repair',name:'Автопочинка',parent:'eng_defense',cost:2,desc:'Рядом с инженером турель чинится быстрее: 2,25 HP/с. Без инженера теряет только 1,2 HP/с.'},
  {id:'eng_armor',name:'Усиленный корпус',parent:'eng_defense',cost:3,desc:'Ещё +25% прочности турели, но её перезарядка увеличивается на 12%.'},
  {id:'eng_overclock',name:'Перегрузка',parent:'eng_damage',cost:2,desc:'Турель стреляет на 22% чаще, но теряет ещё 0,5 HP/с, когда инженер далеко.'},
  {id:'eng_fast_evolution',name:'Ранняя эволюция',parent:'eng_damage',cost:3,desc:'Турель эволюционирует после 22 убийств вместо 30; эволюционировавшая турель наносит на 10% меньше урона.'}
 ]},
 duelist:{title:'Дуэлянт',subtitle:'Три направления: отражать атаки, усиливать метки или перестроить активную способность.',nodes:[
  {id:'duel_parry',name:'Мастер парирования',type:'main',cost:2,desc:'Отражение длится 1,7 с вместо 1,35 с, но метки ослабляются до ×1,4.'},
  {id:'duel_marks',name:'Охотник за метками',type:'main',cost:2,desc:'Метки усиливаются до ×1,7, но парирование сокращается до 1,05 с.'},
  {id:'duel_technique',name:'Техника рипоста',type:'main',cost:3,desc:'Перестраивает активную способность: перезарядка 10 с, но метки слабее (×1,35), а парирование длится 1,2 с.'},
  {id:'duel_guard',name:'Непробиваемая стойка',parent:'duel_parry',cost:2,desc:'Ещё +0,25 с отражения, но перезарядка способности увеличивается ещё на 0,5 с.'},
  {id:'duel_counter',name:'Контрвыпад',parent:'duel_parry',cost:3,desc:'Парирование длится до 2,1 с, но метки ослабляются до ×1,3.'},
  {id:'duel_hunt',name:'Расширенная охота',parent:'duel_marks',cost:2,desc:'Помечает до четырёх целей вместо трёх; метка действует 3 с.'},
  {id:'duel_execute',name:'Приговор',parent:'duel_marks',cost:3,desc:'Урон по отмеченным целям повышается до ×1,9, но метка действует только 2,5 с.'},
  {id:'duel_rhythm',name:'Идеальный ритм',parent:'duel_technique',cost:2,desc:'Перезарядка способности дополнительно сокращается до 8,8 с, но парирование становится короче — 1,1 с.'},
  {id:'duel_afterimage',name:'Ложный след',parent:'duel_technique',cost:3,desc:'Способность помечает до четырёх целей, но метки действуют 2,8 с.'}
 ]}
};
function evoDefaultProfile12(){return{players:Array.from({length:3},()=>({kills:0,progress:0,pts:0,trees:{engineer:[],duelist:[],medic:[],slime:[]}}))}}
function evoLoadProfile12(){try{const raw=JSON.parse(localStorage.getItem(EVO_STORE_KEY12)||'null');const base=evoDefaultProfile12();if(raw&&Array.isArray(raw.players)){for(let i=0;i<3;i++){const p=raw.players[i]||{};base.players[i]={kills:Math.max(0,Number(p.kills)||0),progress:cl(Number(p.progress)||0,0,49),pts:Math.max(0,Number(p.pts)||0),trees:{engineer:Array.isArray(p.trees?.engineer)?p.trees.engineer:[],duelist:Array.isArray(p.trees?.duelist)?p.trees.duelist:[],medic:Array.isArray(p.trees?.medic)?p.trees.medic:[],slime:Array.isArray(p.trees?.slime)?p.trees.slime:[]}}}}return base}catch(e){return evoDefaultProfile12()}}
let EVO_PROFILE12=evoLoadProfile12();
function evoSaveProfile12(){try{localStorage.setItem(EVO_STORE_KEY12,JSON.stringify(EVO_PROFILE12))}catch(e){}}
function evoSlot12(slot){return EVO_PROFILE12.players[cl(slot|0,0,2)]}
function evoPoints12(slot){return evoSlot12(slot).pts}
function evoKills12(slot){return evoSlot12(slot).kills}
function evoProgress12(slot){return evoSlot12(slot).progress}
function evoClassKey12(slot){const c=CH[S.p[slot]?.ch||0];return c?.engineer?'engineer':c?.duelist?'duelist':c?.med?'medic':c?.slime?'slime':null}
function evoNodes12(slot,key){return evoSlot12(slot).trees[key]||[]}
function evoHas12(slot,key,id){return evoNodes12(slot,key).includes(id)}
function evoRecordKill12(source){if(!source||source.pi==null||source.pi<0||source.pi>2)return;const p=evoSlot12(source.pi);p.kills++;p.progress++;if(p.progress>=50){p.progress-=50;p.pts++;if(typeof TX!=='undefined')TX.push({x:source.x||W/2,y:(source.y||GY)-70,t:'+1 PTS · ЭВОЛЮЦИЯ',l:1.35,c:'#ffd166'});if(typeof fx==='function')fx(source.x||W/2,(source.y||GY)-55,12,'#ffd166',180)}evoSaveProfile12()}
function evoBuy12(slot,key,id){const tree=EVO_TREES12[key],node=tree?.nodes.find(n=>n.id===id);if(!node)return;const p=evoSlot12(slot),owned=p.trees[key]||[];if(owned.includes(id))return;const main=tree.nodes.filter(n=>n.type==='main');if(node.type==='main'&&main.some(n=>owned.includes(n.id)))return;if(node.parent&&!owned.includes(node.parent))return;if(p.pts<node.cost)return;p.pts-=node.cost;owned.push(id);p.trees[key]=owned;evoSaveProfile12();openEvolution12(slot)}
function evoReset12(slot,key){const tree=EVO_TREES12[key];if(!tree)return;const p=evoSlot12(slot),owned=p.trees[key]||[];p.pts+=tree.nodes.filter(n=>owned.includes(n.id)).reduce((sum,n)=>sum+n.cost,0);p.trees[key]=[];evoSaveProfile12();openEvolution12(slot)}
function evoNodeCard12(slot,key,node){const owned=evoHas12(slot,key,node.id),all=evoNodes12(slot,key),otherMain=EVO_TREES12[key].nodes.some(n=>n.type==='main'&&n.id!==node.id&&all.includes(n.id)),locked=(node.type==='main'?otherMain:!all.includes(node.parent)),poor=evoPoints12(slot)<node.cost,can=!owned&&!locked&&!poor;const status=owned?'УСТАНОВЛЕНО':locked?'СНАЧАЛА ОТКРОЙ ОСНОВУ':poor?'НЕ ХВАТАЕТ PTS':`СТОИМОСТЬ · ${node.cost} PTS`;return `<article class="evo-card ${node.type==='main'?'main ':''}${owned?'bought ':''}${!owned&&!can?'locked':''}"><div class="evo-status">${node.type==='main'?'ОСНОВНАЯ ЭВОЛЮЦИЯ':'ПОБОЧНАЯ ВЕТКА'} · ${status}</div><h3>${node.name}</h3><p>${node.desc}</p>${owned?'<button class="ch s" disabled>Уже изучено</button>':`<button class="ch s" ${can?'':'disabled'} onclick="evoBuy12(${slot},'${key}','${node.id}')">Изучить · ${node.cost} PTS</button>`}</article>`}
function openEvolution12(slot){slot=cl(slot|0,0,2);const key=evoClassKey12(slot),p=evoSlot12(slot);let body='';if(!key){body=`<div class="evo-card"><h3>Ветка пока готовится</h3><p>Полноценный прототип сейчас доступен для Инженера и Дуэлянта. PTS не пропадают: они сохраняются за игроком ${slot+1} и будут доступны для следующих классов.</p></div>`}else{const tree=EVO_TREES12[key],owned=p.trees[key]||[],main=tree.nodes.filter(n=>n.type==='main'),side=tree.nodes.filter(n=>n.parent);body=`<p>${tree.subtitle}</p><h2>Основной выбор — только одно направление</h2><div class="evo-grid">${main.map(n=>evoNodeCard12(slot,key,n)).join('')}</div><h2>Побочные эволюции выбранного направления</h2><div class="evo-grid">${side.map(n=>evoNodeCard12(slot,key,n)).join('')}</div>`}const spent=key?(EVO_TREES12[key].nodes.filter(n=>(p.trees[key]||[]).includes(n.id)).reduce((s,n)=>s+n.cost,0)):0;$('evb').innerHTML=`<h1>ЭВОЛЮЦИИ <span>ИГРОК ${slot+1}</span></h1><div class="evo-top"><div><b>${key?EVO_TREES12[key].title:CH[S.p[slot].ch].n}</b><br><small>${p.kills} убийств · следующий PTS через ${50-p.progress} убийств · потрачено ${spent} PTS</small></div><div class="evo-stat">${p.pts} PTS</div></div>${body}<div class="evo-foot"><button class="bt" onclick="show('setup');rs()">Назад к выбору класса</button>${key?`<button class="ch s" ${spent?'':'disabled'} onclick="evoReset12(${slot},'${key}')">Сбросить эволюции · вернуть ${spent} PTS</button>`:''}</div>`;show('evolution')}
function evoDuelistStats12(e){const slot=e.pi;if(slot==null)return{cooldown:12,mirror:1.35,count:3,duration:4,multiplier:1.5};const has=id=>evoHas12(slot,'duelist',id);let s={cooldown:12,mirror:1.35,count:3,duration:4,multiplier:1.5};if(has('duel_parry')){s.mirror=1.7;s.multiplier=1.4;s.cooldown=13}if(has('duel_guard')){s.mirror+=.25;s.cooldown+=.5}if(has('duel_counter')){s.mirror=2.1;s.multiplier=1.3;s.cooldown+=1}if(has('duel_marks')){s.mirror=1.05;s.multiplier=1.7;s.duration=3.5}if(has('duel_hunt')){s.count=4;s.duration=3;s.multiplier=1.75}if(has('duel_execute')){s.multiplier=1.9;s.duration=2.5}if(has('duel_technique')){s.cooldown=10;s.mirror=1.2;s.multiplier=1.35;s.duration=3.5}if(has('duel_rhythm')){s.cooldown=8.8;s.mirror=1.1}if(has('duel_afterimage')){s.count=4;s.duration=2.8}return s}
function evoApplyTurret12(t){if(!t||t.evoApplied||!t.src||t.src.pi==null||t.src.ch!==7)return;t.evoApplied=1;const slot=t.src.pi,has=id=>evoHas12(slot,'engineer',id);t.evolveAt=31;if(has('eng_defense')){t.mh*=1.4;t.hp=t.mh;t.dmg*=.9}if(has('eng_repair')){t.evoRepair=2.25;t.evoDecay=1.2}if(has('eng_armor')){t.mh*=1.25;t.hp=t.mh;t.cd*=1.12}if(has('eng_damage')){t.mh*=.8;t.hp=t.mh;t.dmg*=1.3;t.evoDecay=2.5;t.evoEvolvedDmgMul=.9}if(has('eng_overclock')){t.cd*=.78;t.evoFireRate=1.28;t.evoDecay=(t.evoDecay??2)+.5}if(has('eng_fast_evolution')){t.evolveAt=22;t.evoEvolvedDmgMul=.9}}
const oldDieEvo12=die;
die=function(o){const credit=o&&(o.lastHitOwner||o.lastHitSource);const result=oldDieEvo12(o);if(o&&o.hp<=0&&!o._evoCounted&&!o.turret&&!o.cl&&credit&&credit.pi!=null&&credit.pi>=0&&credit.pi<3&&credit.tm!==o.tm){o._evoCounted=1;evoRecordKill12(credit)}return result};
const oldTurretsEvo12=updTurrets;
updTurrets=function(dt){for(const t of TUR)evoApplyTurret12(t);return oldTurretsEvo12(dt)};

const CHAOS_EVENTS12=[
 {id:'gravity',name:'НЕВЕСОМОСТЬ',desc:'Гравитация ослаблена',c:'#93b8ff',duration:10},
 {id:'overdrive',name:'АДРЕНАЛИНОВЫЙ РЫВОК',desc:'Все сущности двигаются быстрее',c:'#ffbf69',duration:9},
 {id:'overclock',name:'ПЕРЕЗАРЯДКА',desc:'Оружие стреляет быстрее, урон немного выше',c:'#73e5ff',duration:9},
 {id:'bloodmoon',name:'КРОВАВАЯ ЛУНА',desc:'Зомби и боссы быстрее и опаснее',c:'#ff6478',duration:10},
 {id:'lightning',name:'ГРОЗОВОЙ ФРОНТ',desc:'Молнии периодически поражают поле боя',c:'#8feaff',duration:10},
 {id:'meteor',name:'МЕТЕОРИТНЫЙ ДОЖДЬ',desc:'На арену падают небольшие метеориты',c:'#ff9b60',duration:10},
 {id:'supply',name:'НЕБЕСНАЯ ПОСТАВКА',desc:'На арену падают дополнительные образцы оружия',c:'#a7e5bd',duration:6},
 {id:'recovery',name:'ИМПУЛЬС ВОССТАНОВЛЕНИЯ',desc:'Игроки немедленно восстанавливают часть здоровья',c:'#8be5a4',duration:5}
];
function chaosResetModifiers12(){if(!G)return;G.chaosGravity=1;G.chaosMoveMul=1;G.chaosFireRate=1;G.chaosDamage=1;G.chaosEnemySpeed=1;G.chaosEnemyDamage=1}
function chaosBegin12(){if(!G||!G.chaos)return;chaosResetModifiers12();let pool=CHAOS_EVENTS12.filter(e=>e.id!==G.chaosLast),spec=pool[Math.floor(R()*pool.length)]||CHAOS_EVENTS12[0];G.chaosLast=spec.id;G.chaosEvent={...spec,life:spec.duration,tick:.3,strike:null};G.chaosNext=30+R()*15;G.bn='ХАОС: '+spec.name;G.bt=2.2;TX.push({x:W/2,y:150,t:'СЛУЧАЙНОЕ СОБЫТИЕ',l:1.4,c:spec.c});
 if(spec.id==='gravity')G.chaosGravity=.58;
 if(spec.id==='overdrive')G.chaosMoveMul=1.28;
 if(spec.id==='overclock'){G.chaosFireRate=1.28;G.chaosDamage=1.12}
 if(spec.id==='bloodmoon'){G.chaosEnemySpeed=1.28;G.chaosEnemyDamage=1.18}
 if(spec.id==='supply'){const players=ents.filter(e=>e.pi!=null&&e.hp>0),count=Math.max(2,Math.min(3,players.length||2));for(let i=0;i<count;i++){const owner=players[i%Math.max(1,players.length)];IT.push({x:owner?cl(owner.x+(R()-.5)*220,50,W-50):100+R()*(W-200),y:-80-R()*100,vy:0,wp:weightedDrop(),kit:0,life:24})}}
 if(spec.id==='recovery'){for(const e of ents)if(e.pi!=null&&e.hp>0){const heal=Math.round(e.mh*.18);e.hp=Math.min(e.mh,e.hp+heal);TX.push({x:e.x,y:e.y-e.h-16,t:'+'+heal+' · ХАОС',l:1.1,c:'#8be5a4'});fx(e.x,e.y-e.h*.5,14,'#8be5a4',230)}}
}
function chaosLightning12(){const alive=ents.filter(e=>e.hp>0),players=alive.filter(e=>e.pi!=null);if(!players.length)return;const source=players[Math.floor(R()*players.length)],ax=source.x,ay=source.y-source.h*.5;let from={x:ax,y:ay},pool=alive.filter(e=>e.tm!==source.tm&&!e.cl),amount=18,count=0;while(pool.length&&count<3){let best=-1,dist=360;for(let i=0;i<pool.length;i++){const o=pool[i],d=Math.hypot(o.x-from.x,o.y-o.h*.5-from.y);if(d<dist){dist=d;best=i}}if(best<0)break;const o=pool.splice(best,1)[0],tx=o.x,ty=o.y-o.h*.5;hit(o,Math.round(amount),source,Math.sign(tx-from.x||1)*120,0,1);ZP.push({x1:from.x,y1:from.y,x2:tx,y2:ty,life:.22,c:'#8feaff'});from={x:tx,y:ty};amount*=.82;count++}fx(ax,ay,12,'#8feaff',250)}
function chaosMeteor12(ev){const players=ents.filter(e=>e.pi!=null&&e.hp>0),target=players.length?players[Math.floor(R()*players.length)]:ents.find(e=>e.hp>0);if(!target)return;ev.strike={x:cl(target.x+(R()-.5)*360,90,W-90),life:.82};}
function updateChaos12(dt){if(!G||!G.chaos||G.demo||G.pause||G.end||G.cd>0||G.ov>0)return;G.chaosNext=(G.chaosNext??(30+R()*15))-dt;if(G.chaosEvent){const ev=G.chaosEvent;ev.life-=dt;if(ev.id==='lightning'){ev.tick-=dt;if(ev.tick<=0){ev.tick=1.15;chaosLightning12()}}if(ev.id==='meteor'){ev.tick-=dt;if(ev.tick<=0&&!ev.strike){ev.tick=1.65;chaosMeteor12(ev)}if(ev.strike){ev.strike.life-=dt;if(ev.strike.life<=0){eventImpact(ev,ev.strike.x,22,115);ev.strike=null}}}if(ev.life<=0){G.chaosEvent=null;chaosResetModifiers12()}}if(G.chaosNext<=0)chaosBegin12()}
const oldStepChaos12=step;
step=function(dt){oldStepChaos12(dt);updateChaos12(dt)};
const oldNextRoundChaos12=nextRound;
nextRound=function(){oldNextRoundChaos12();if(G&&G.chaos){G.chaosEvent=null;chaosResetModifiers12()}};
const oldDrawEventChaos12=drawEvent;
drawEvent=function(){oldDrawEventChaos12();const ev=G&&G.chaosEvent;if(!ev||ev.id!=='meteor'||!ev.strike)return;const k=1-ev.strike.life/.82;cx.save();cx.globalCompositeOperation='lighter';cx.strokeStyle='#ff9b60';cx.lineWidth=4;cx.globalAlpha=.5+.4*Math.sin(G.t*22);cx.beginPath();cx.ellipse(ev.strike.x,GY-8,42+26*k,13+8*k,0,0,7);cx.stroke();cx.globalAlpha=.28;cx.fillStyle='#ff9b60';cx.beginPath();cx.ellipse(ev.strike.x,GY-8,34+18*k,10+5*k,0,0,7);cx.fill();cx.restore()};
const oldHudChaos12=hud;
hud=function(){oldHudChaos12();const ev=G&&G.chaosEvent;if(!G||!G.chaos||!ev)return;const hs=S.phone?1.3:1,w=VW/hs,h=VH/hs,x=w/2-170,y=h-34;cx.save();cx.scale(hs,hs);rr(x,y,340,24,'#07101ddd',cx,8);cx.strokeStyle=ev.c;cx.lineWidth=1.5;cx.beginPath();cx.roundRect(x,y,340,24,8);cx.stroke();cx.textAlign='left';cx.font='11px "Russo One",Impact,sans-serif';cx.fillStyle=ev.c;cx.fillText('ХАОС · '+ev.name,x+10,y+15);cx.textAlign='right';cx.fillStyle='#eaf3ff';cx.fillText(ev.life.toFixed(1)+'с',x+330,y+15);cx.restore()};
