const EVO_TREES12_EXTRA={
 medic:{title:'Медик',subtitle:'Выбери: усиленное лечение команды или боевые стимуляторы. Побочные узлы развивают только выбранное направление.',nodes:[
  {id:'med_field',name:'Полевой хирург',type:'main',cost:2,desc:'Пассивное лечение повышается до 15 HP раз в 12 с, аптечка лечит 55% HP. Урон Медика снижается на 10%.'},
  {id:'med_stim',name:'Боевые стимуляторы',type:'main',cost:2,desc:'Аптечка лечит 32% HP и даёт ×1,2 урона на 6 с. Пассивное лечение снижается до 8 HP.'},
  {id:'med_aura',name:'Триаж',parent:'med_field',cost:2,desc:'Аптечка дополнительно лечит союзников в радиусе 180 на 12% их максимального HP.'},
  {id:'med_emergency',name:'Экстренная помощь',parent:'med_field',cost:3,desc:'При здоровье ниже 35% пассивное лечение повышается до 22 HP, аптечка лечит 60%, но её перезарядка увеличивается до 14 с.'},
  {id:'med_adrenaline',name:'Адреналиновый укол',parent:'med_stim',cost:2,desc:'Поднявший аптечку получает +18% скорости передвижения на 5 с.'},
  {id:'med_overdose',name:'Предельная доза',parent:'med_stim',cost:3,desc:'Аптечка даёт ×1,35 урона на 8 с, но лечит только 25% HP.'}
 ]},
 slime:{title:'Слизь',subtitle:'Выбери между поглощением жизненной силы и совершенствованием копирования.',nodes:[
  {id:'slime_absorb',name:'Пожиратель',type:'main',cost:2,desc:'Лечение за убийство повышается до 15%, обычный прирост силы — до +0,05x, за тяжёлые цели — +0,18x, за боссов — +0,35x.'},
  {id:'slime_mimic',name:'Идеальный мимик',type:'main',cost:2,desc:'Начальная сила копии повышается до ×1,4, шанс сбоя копирования оружия снижается до 20%, но лечение за убийство падает до 8%.'},
  {id:'slime_feast',name:'Глубокое поглощение',parent:'slime_absorb',cost:2,desc:'Лечение увеличивается до 18%, а бонус за босса — до +0,4x.'},
  {id:'slime_core',name:'Насыщенное ядро',parent:'slime_absorb',cost:3,desc:'Порог жертвенного возрождения снижается с ×3,5 до ×3,0; возрождение всё ещё возвращает 75% HP и обнуляет множитель.'},
  {id:'slime_stable',name:'Стабильная мимикрия',parent:'slime_mimic',cost:2,desc:'Каждое последующее копирование ослабляет копию на 0,03x вместо 0,05x.'},
  {id:'slime_fast',name:'Быстрая адаптация',parent:'slime_mimic',cost:3,desc:'Копирование оружия имеет 15% шанс сбоя, а дополнительные 5 секунд перезарядки способности сокращаются до 3.'}
 ]}
};
Object.assign(EVO_TREES12,EVO_TREES12_EXTRA);
for(const p of EVO_PROFILE12.players){p.trees.medic=p.trees.medic||[];p.trees.slime=p.trees.slime||[]}
evoSaveProfile12();

function evoMedicStats13(e){const slot=e&&CH[e.ch]?.med&&e.pi!=null?e.pi:-1,has=id=>slot>=0&&evoHas12(slot,'medic',id);const s={regen:10,regenDelay:12,pack:.4,cooldown:12,damage:1,allyHeal:0,allyRadius:0,damageBuff:0,buffDuration:0,speedBuff:0,speedDuration:0};if(has('med_field')){s.regen=15;s.pack=.55;s.damage=.9}if(has('med_aura')){s.allyHeal=.12;s.allyRadius=180}if(has('med_emergency')&&e.hp/e.mh<.35){s.regen=22;s.pack=.6;s.cooldown=14}if(has('med_stim')){s.regen=8;s.pack=.32;s.damageBuff=1.2;s.buffDuration=6}if(has('med_adrenaline')){s.speedBuff=1.18;s.speedDuration=5}if(has('med_overdose')){s.pack=.25;s.damageBuff=1.35;s.buffDuration=8;s.cooldown=14}return s}
function evoSlimeStats13(e){const slot=e&&CH[e.ch]?.slime&&e.pi!=null?e.pi:-1,has=id=>slot>=0&&evoHas12(slot,'slime',id);const s={heal:.10,normal:.03,heavy:.15,boss:.3,copyBase:1.3,copyDecay:.05,weaponFail:.3,cooldownExtra:5,reviveAt:3.5};if(has('slime_absorb')){s.heal=.15;s.normal=.05;s.heavy=.18;s.boss=.35}if(has('slime_feast')){s.heal=.18;s.boss=.4}if(has('slime_core'))s.reviveAt=3;if(has('slime_mimic')){s.heal=.08;s.normal=.025;s.heavy=.12;s.boss=.27;s.copyBase=1.4;s.weaponFail=.2}if(has('slime_stable'))s.copyDecay=.03;if(has('slime_fast')){s.weaponFail=.15;s.cooldownExtra=3}return s}

if(CH[12]&&CH[12].slime){CH[12].hp=Math.round(CH[12].hp*.6);CH[12].d='Слизь: ослабленная форма для ограничения до двух Слизней на арене. Копирует недавние способности и оружие; эволюции усиливают поглощение или копирование.'}
if(!CH.some(c=>c.killer))CH.push({n:'Киллер',hp:250,dm:1.1,killer:1,d:'250 HP, урон ×1,1. Активная способность: ритм-метка над ближайшим врагом. Нажми способность ещё раз, когда движущийся маркер окажется в зелёной зоне. Успех удваивает урон следующего попадания; промах оглушает на 0,3 с и ставит перезарядку 15 с.'});

const skyStation={n:'Небесная станция',g:['#050d25','#263d70'],h:'#172947',d:'s',s:31,p:'#54799b',t:'#9ee8ff',skyStation:1,pl:[[40,560,210],[1030,560,210],[280,500,160],[840,500,160],[520,420,220],[130,355,150],[1000,355,150],[385,270,160],[735,270,160],[565,170,180]]};
if(!MP.some(m=>m.n===skyStation.n))MP.push(skyStation);
const oldProps13=props;
props=function(c){oldProps13(c);if(!M||!M.skyStation)return;c.save();c.fillStyle='#0b1d38';c.strokeStyle='#6b9ec1';c.lineWidth=5;
 for(const [x,y,w,h] of [[90,430,230,95],[420,340,190,110],[850,420,245,105],[1320,350,230,115],[1570,455,210,80]]){c.fillRect(x,GY-y,w,h);c.strokeRect(x,GY-y,w,h);c.fillStyle='#65cfff33';for(let wx=x+15;wx<x+w-10;wx+=30)c.fillRect(wx,GY-y+15,13,18);c.fillStyle='#0b1d38'}
 c.strokeStyle='#8beaff';c.lineWidth=8;c.beginPath();c.moveTo(0,GY-650);c.lineTo(W,GY-650);c.stroke();for(let x=80;x<W;x+=240){c.fillStyle='#172f50';c.fillRect(x,GY-690,110,30);c.fillStyle='#80eaff';c.fillRect(x+12,GY-682,86,5);c.fillStyle='#e9f7ff';c.beginPath();c.arc(x+55,GY-705,6,0,7);c.fill()}
 c.strokeStyle='#5d86aa';c.lineWidth=14;c.beginPath();c.moveTo(70,GY-95);c.lineTo(220,GY-220);c.lineTo(400,GY-220);c.moveTo(1120,GY-100);c.lineTo(1300,GY-230);c.lineTo(1510,GY-230);c.stroke();c.globalAlpha=.22;c.fillStyle='#6ee4ff';c.fillRect(0,GY-8,W,8);c.restore()};

function activeHumanSlots13(){if(S.mode==='v12'||S.mode==='v22')return[0,1];return S.t3?[0,1,2]:[0,1]}
const oldStartMatch13=startMatch;
startMatch=function(demo){if(!demo){let count=0,changed=false;for(const i of activeHumanSlots13()){if(S.p[i].ch===12){count++;if(count>2){S.p[i].ch=0;changed=true}}}oldStartMatch13(demo);if(changed){G.bn='МАКСИМУМ ДВЕ СЛИЗИ';G.bt=2.2}}else oldStartMatch13(demo)};

function spawnDevourer13(w){const e=mk({z:1,zk:'m',mini:'devourer',mname:'Поглотитель',tm:1,x:R()<.5?70:W-70,y:GY,hp:700+w*28,sz:2.05,c:'#8e72c9',spm:.43,dmg:9+w*.42});e.arm=e.armM=65+w*5;e.devourAttack=2.8;e.devourMelee=1.2;ents.push(e);G.devourer=e;G.devourerSouls=[];TX.push({x:e.x,y:e.y-e.h-28,t:'МИНИ-БОСС: ПОГЛОТИТЕЛЬ',l:2.4,c:'#c6a0ff'});fx(e.x,e.y-e.h*.55,44,'#9768d0',560);G.sh=Math.max(G.sh,12);return e}
const oldSpawnMini13=spawnMini;
spawnMini=function(w){if(R()<.28)return spawnDevourer13(w);return oldSpawnMini13(w)};
const oldZom13=zom;
zom=function(e,dt){if(e.mini!=='devourer')return oldZom13(e,dt);const t=near(e);if(!t)return zomBase(e,dt);const dx=t.x-e.x,ad=Math.abs(dx),I=e.in={};e.fo=Math.sign(dx)||1;if(ad>255){const nav=aiNavigate(e,t.x,t.y,I,dt);if(!nav){if(dx>0)I.r=1;else I.l=1}}else if(ad<150){if(dx>0)I.l=1;else I.r=1}e.devourAttack=(e.devourAttack??2.8)-dt;e.devourMelee=(e.devourMelee??1.2)-dt;if(e.devourAttack<=0&&ad>120){e.devourAttack=3.4;const sx=e.x+e.f*34,sy=e.y-e.h*.64,tm=1;pr({x:sx,y:sy,vx:e.f*245,vy:-40,dm:16+G.wv*1.4,tm,col:'#a778e8',src:e,t:'c',life:3.8,fz:.45});TX.push({x:e.x,y:e.y-e.h-14,t:'ДУША-ПРОКЛЯТИЕ',l:.7,c:'#c39aff'});fx(sx,sy,9,'#b78aff',180)}if(ad<82&&Math.abs(t.y-e.y)<75&&e.devourMelee<=0){e.devourMelee=1.35;hit(t,12+G.wv*.7,e,Math.sign(dx||1)*260,.18,1);fx(t.x,t.y-t.h*.5,12,'#a36fd0',200)}};

function drawDevourerSoul13(s){cx.save();cx.translate(s.x,s.y);cx.globalCompositeOperation='lighter';cx.globalAlpha=.55+.35*Math.sin(G.t*9+s.seed);const g=cx.createRadialGradient(-2,-3,1,0,0,15);g.addColorStop(0,'#fff');g.addColorStop(.28,'#e5d4ff');g.addColorStop(.7,'#a16ce3');g.addColorStop(1,'#4a267a00');cx.fillStyle=g;cx.beginPath();cx.arc(0,0,15,0,7);cx.fill();cx.strokeStyle='#e8d8ff';cx.lineWidth=2;cx.beginPath();cx.moveTo(0,8);cx.quadraticCurveTo(-7,17,0,23);cx.quadraticCurveTo(7,17,0,8);cx.stroke();cx.restore()}
function updateDevourerSouls13(dt){const boss=G&&G.devourer;if(!boss||boss.hp<=0){if(G)G.devourerSouls=[];return}const souls=G.devourerSouls||[];for(let i=souls.length-1;i>=0;i--){const s=souls[i];if(s.phase==='rise'){s.rise+=dt;s.y-=92*dt;if(s.rise>=.72)s.phase='seek'}else{const dx=boss.x-s.x,dy=(boss.y-boss.h*.55)-s.y,d=Math.hypot(dx,dy);if(d<24){const heal=Math.min(boss.mh-boss.hp,s.heal);boss.hp=Math.min(boss.mh,boss.hp+s.heal);if(heal>0){TX.push({x:boss.x,y:boss.y-boss.h-16,t:'+'+Math.round(heal)+' · ДУША',l:.9,c:'#c6a0ff'});fx(boss.x,boss.y-boss.h*.55,9,'#b48aff',170)}souls.splice(i,1);continue}const speed=95,step=Math.min(d,speed*dt);s.x+=dx/d*step;s.y+=dy/d*step}if(s.life<=0)souls.splice(i,1);else s.life-=dt}}
const oldDieContent13=die;
die=function(o){const boss=G&&G.devourer;const result=oldDieContent13(o);if(o&&o.hp<=0){if(o===boss){G.devourer=null;G.devourerSouls=[]}else if((o.z||o.B)&&boss&&boss.hp>0&&!o._devourSoul){o._devourSoul=1;G.devourerSouls=G.devourerSouls||[];if(G.devourerSouls.length<50)G.devourerSouls.push({x:o.x,y:o.y-o.h*.55,phase:'rise',rise:0,life:18,heal:(o.mh||o.hp||30)*.1,seed:R()*6.28})}}return result};
const oldStepContent13=step;
step=function(dt){oldStepContent13(dt);if(!G||G.pause||G.end||G.cd>0)return;updateDevourerSouls13(dt)};
const oldNextRoundContent13=nextRound;
nextRound=function(){oldNextRoundContent13();G.devourer=null;G.devourerSouls=[]};
const oldDrawEventContent13=drawEvent;
drawEvent=function(){oldDrawEventContent13();if(G&&G.devourerSouls)for(const s of G.devourerSouls)if(isWorldVisible27(s.x,s.y,30,30))drawDevourerSoul13(s)};

function killerCurrentZone13(e){return .075/Math.pow(1.5,Math.floor((e.killerStreak||0)/5))}
function killerFail13(e,message){e.killerAim=null;e.killerNeedRelease=true;e.killerStreak=0;e.kc=15;e.kcMax=15;e.fz=Math.max(e.fz||0,.3);e.vx*=.25;TX.push({x:e.x,y:e.y-e.h-20,t:message||'ПРОМАХ · ОГЛУШЕНИЕ',l:1.05,c:'#ff737d'});fx(e.x,e.y-e.h*.55,12,'#ff5368',210)}
function killerStartAim13(e){const target=ents.filter(o=>o!==e&&o.hp>0&&o.tm!==e.tm&&!o.cl&&!(o.own===e)).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];if(!target){killerFail13(e,'НЕТ ЦЕЛИ ДЛЯ ЗАХВАТА');return}e.killerAim={target,phase:R()*6.28,pos:.5,seed:R()*10,zone:killerCurrentZone13(e)};TX.push({x:target.x,y:target.y-target.h-34,t:'ЗАХВАТ · НАЖМИ ЕЩЁ РАЗ',l:.75,c:'#ff737d'});fx(target.x,target.y-target.h*.6,7,'#ff5368',140)}
function killerResolveAim13(e){const a=e.killerAim,t=a&&a.target;if(!a||!t||t.hp<=0){killerFail13(e,'ЦЕЛЬ ПОТЕРЯНА');return}const zone=killerCurrentZone13(e);if(Math.abs(a.pos-.5)<=zone){const streak=e.killerStreak||0,damage=Math.min(5120,10*Math.pow(2,Math.min(9,streak)));e.killerStreak=streak+1;e.killerAim=null;e.kc=0;e.kcMax=15;hit(t,damage,e,Math.sign(t.x-e.x||e.f)*170,0,1);TX.push({x:t.x,y:t.y-t.h-22,t:'ТОЧНО · '+damage+' УРОНА · СЕРИЯ '+(streak+1),l:1.05,c:'#78ff9a'});fx(t.x,t.y-t.h*.55,16,'#77ff9a',250)}else killerFail13(e,'ПРОМАХ · СЕРИЯ СБРОШЕНА')}
const oldUpdContent13=upd;
upd=function(e,dt){if(CH[e.ch]?.killer&&e.hp>0){const pressed=!!(e.in&&e.in.m)&&!e.pm&&!e.killerNeedRelease&&e.fz<=0;if(e.killerAim){const a=e.killerAim;a.phase+=(2.15+1.85*Math.sin(G.t*1.4+a.seed))*dt;a.pos=.5+.455*Math.sin(a.phase);a.pos=cl(a.pos,.03,.97);a.zone=killerCurrentZone13(e)}if(pressed){if(e.killerAim)killerResolveAim13(e);else if(e.kc<=0)killerStartAim13(e)}const result=oldUpdContent13(e,dt);if(e.killerNeedRelease){if(!(e.in&&e.in.m))e.killerNeedRelease=false;else e.pm=true}return result}return oldUpdContent13(e,dt)};

const oldDrawEContent13=drawE;
drawE=function(e){oldDrawEContent13(e);if(!e)return;if(CH[e.ch]?.killer&&!e.z&&!e.B){cx.save();cx.globalCompositeOperation='source-over';cx.strokeStyle='#180d17';cx.lineWidth=5;cx.lineCap='round';cx.beginPath();cx.moveTo(e.x-13,e.y-e.h+13);cx.lineTo(e.x-4,e.y-e.h+4);cx.lineTo(e.x+14,e.y-e.h+10);cx.stroke();cx.strokeStyle='#ff596b';cx.lineWidth=3;cx.beginPath();cx.moveTo(e.x-10,e.y-e.h+12);cx.lineTo(e.x-2,e.y-e.h+6);cx.lineTo(e.x+12,e.y-e.h+11);cx.stroke();cx.restore()}
 if(e.mini==='devourer'){cx.save();cx.globalCompositeOperation='source-over';cx.translate(e.x,e.y-e.h*.5);const s=e.sz||1;cx.scale(s,s);cx.fillStyle='#302044';cx.strokeStyle='#c6a0ff';cx.lineWidth=3;cx.beginPath();cx.moveTo(-18,-35);cx.lineTo(-29,-55);cx.lineTo(-10,-47);cx.lineTo(0,-58);cx.lineTo(12,-47);cx.lineTo(30,-55);cx.lineTo(18,-34);cx.closePath();cx.fill();cx.stroke();cx.fillStyle='#b68aff';cx.shadowColor='#b68aff';cx.shadowBlur=12;cx.fillRect(-11,-11,6,4);cx.fillRect(6,-11,6,4);cx.shadowBlur=0;cx.strokeStyle='#d7b8ff';cx.lineWidth=5;cx.beginPath();cx.moveTo(-17,0);cx.lineTo(-30,15);cx.moveTo(17,0);cx.lineTo(30,15);cx.stroke();cx.restore()}
 const owner=ents.find(p=>p.hp>0&&p.killerAim&&p.killerAim.target===e);if(owner&&owner.killerAim){const a=owner.killerAim,x=e.x-48,y=e.y-e.h-68,w=96,h=10,zone=killerCurrentZone13(owner);cx.save();cx.globalCompositeOperation='source-over';cx.fillStyle='#080b16eF';cx.strokeStyle='#ff6478';cx.lineWidth=1.5;cx.beginPath();cx.roundRect(x,y,w,h,4);cx.fill();cx.stroke();cx.fillStyle='#2b3940';cx.fillRect(x+2,y+2,w-4,h-4);cx.fillStyle='#62ff98';cx.fillRect(e.x-zone*w,y+1,zone*w*2,h-2);cx.fillStyle='#fff';cx.shadowColor='#ff526c';cx.shadowBlur=7;cx.fillRect(x+a.pos*w-1.5,y-3,3,h+6);cx.shadowBlur=0;cx.font='9px "Russo One",Impact,sans-serif';cx.textAlign='center';cx.fillStyle='#ffe8ee';cx.fillText('КИЛЛЕР · '+((owner.killerStreak||0)+1),e.x,y-5);cx.restore()}
};

function drawStationHud13(){/* station detail is baked into the map background */}

const oldSlimeOnKill13=slimeOnKill;
slimeOnKill=function(victim,source){if(!victim||!source||source.ch!==12||source.pi==null)return;const by=victim.damageBySlot||{},mine=by[source.pi]||0,others=Object.keys(by).reduce((n,k)=>Math.max(n,Number(k)!==source.pi?(by[k]||0):0),0);if(mine<=others)return;const s=evoSlimeStats13(source);let bonus=0;if(victim.B){if(mine<=victim.mh*.5)return;bonus=s.boss}else if(victim.z||victim.pi!=null){bonus=victim.mh>=source.mh*2?s.heavy:s.normal}else return;const heal=Math.max(1,Math.round(victim.mh*s.heal));source.hp=Math.min(source.mh,source.hp+heal);source.slimeBonus=(source.slimeBonus||0)+bonus;TX.push({x:source.x,y:source.y-source.h-10,t:'+'+heal+' · СИЛА +'+bonus.toFixed(2),l:1,c:'#70d5ff'});fx(source.x,source.y-source.h*.55,8,'#55b9ff',180)};
