/* ===================================================================
   v2.7 — МОДИФИКАТОР «ХАОС»
   В любом режиме каждые 30–45 секунд включается случайное событие.
   =================================================================== */
const CHAOS=[
{id:'lowg',n:'Лунная гравитация',d:'всё падает медленнее, прыжки выше',c:'#9ad7ff',on(){G.cf.gv=.55}},
{id:'heavy',n:'Тяжёлая гравитация',d:'гравитация ×1,6, прыжки ниже',c:'#d1a77a',on(){G.cf.gv=1.6}},
{id:'turbo',n:'Турбо-режим',d:'скорость всех ×1,35',c:'#ffd166',on(){G.cf.sp=1.35}},
{id:'berserk',n:'Час берсерка',d:'весь урон ×1,5',c:'#ff6a5a',on(){G.cf.dm=1.5}},
{id:'ice',n:'Ледяной пол',d:'все скользят, торможение почти пропало',c:'#8feaff',on(){M.ic=1},off(){M.ic=MP[G.mi].ic}},
{id:'wind',n:'Ураган',d:'ветер сдувает всех; направление меняется',c:'#bfe3ff',on(){G.cf.wind=150*(R()<.5?-1:1);G.cf.windT=0},tick(dt){G.cf.windT+=dt;if(G.cf.windT>6){G.cf.windT=0;G.cf.wind=-G.cf.wind;TX.push({x:W/2,y:200,t:'ВЕТЕР МЕНЯЕТ НАПРАВЛЕНИЕ',l:1,c:'#bfe3ff',s:20})}}},
{id:'barrels',n:'Дождь бочек',d:'с неба падают бочки, генераторы и баллоны',c:'#ff9a5a',on(){G.cf.pdT=0},tick(dt){G.cf.pdT-=dt;if(G.cf.pdT<=0){G.cf.pdT=2.8;if(OB.filter(o=>o.k!='mine').length<6)propDrop()}}},
{id:'moon',n:'Кровавая луна',d:'каждый лечится на 25% нанесённого урона',c:'#ff4a6a',on(){G.cf.vamp=.25}},
{id:'dark',n:'Тьма',d:'видно только вокруг бойцов',c:'#8a7bff',on(){G.cf.dark=1}},
{id:'bounce',n:'Пружинный пол',d:'при приземлении все отскакивают',c:'#7dffb0',on(){G.cf.bnc=1}},
{id:'haste',n:'Шквал',d:'оружие и способности перезаряжаются вдвое быстрее',c:'#ff9de1',on(){G.cf.hs=2}},
{id:'swap',n:'Рокировка',d:'каждые 8 секунд случайные бойцы меняются местами',c:'#b58cff',on(){G.cf.swT=6},tick(dt){G.cf.swT-=dt;if(G.cf.swT<=0){G.cf.swT=8;chaosSwap()}}}
];
function chaosSwap(){const c=ents.filter(e=>e.hp>0&&!e.B&&!e.cl&&!(e.bat>0)&&!e.hang);if(c.length<2)return;const a=c.splice(R()*c.length|0,1)[0],b=c[R()*c.length|0];
 const ax=a.x,ay=a.y;fx(a.x,a.y-a.h*.5,16,'#b58cff',300);fx(b.x,b.y-b.h*.5,16,'#b58cff',300);animeT('ring',a.x,a.y-a.h*.5,'#d6b8ff',{r:60,d:.4});animeT('ring',b.x,b.y-b.h*.5,'#d6b8ff',{r:60,d:.4});
 a.x=b.x;a.y=b.y;b.x=ax;b.y=ay;a.vx=a.vy=b.vx=b.vy=0;a.invuln=Math.max(a.invuln||0,.4);b.invuln=Math.max(b.invuln||0,.4);a.navC=b.navC=null;TX.push({x:a.x,y:a.y-a.h-16,t:'РОКИРОВКА!',l:.8,c:'#d6b8ff',s:20})}
function updChaos(dt){if(!S.chaos||G.demo)return;let C=G.chx;if(!C)C=G.chx={cur:null,t:4,last:-1,dur:40};
 C.t-=dt;
 if(C.cur){if(C.cur.tick)C.cur.tick(dt);if(C.t<=0){if(C.cur.off)C.cur.off();G.cf={};C.cur=null;C.t=.15}}
 else if(C.t<=0){let k;do k=R()*CHAOS.length|0;while(k==C.last&&CHAOS.length>1);C.last=k;const ev=CHAOS[k];G.cf={};C.cur=ev;C.t=C.dur=30+R()*15;if(ev.on)ev.on();cutIn('ХАОС: '+ev.n.toUpperCase(),ev.d,ev.c);G.fl=Math.max(G.fl||0,.22);G.sh=Math.max(G.sh,8);TX.push({x:W/2,y:260,t:'ХАОС: '+ev.n,l:1.4,c:ev.c,s:24})}}
function chaosHud(W,y,F){const C=G.chx;if(!C||!C.cur||G.demo)return;const ev=C.cur,k=cl(C.t/C.dur,0,1);rr(W/2-200,y,400,34,'#0a0c15e0',cx,10);rr(W/2-196,y+26,392*k,5,ev.c,cx,2);cx.font='15px '+F;cx.textAlign='center';cx.fillStyle=ev.c;cx.fillText('ХАОС · '+ev.n.toUpperCase(),W/2,y+16);cx.font='11px system-ui,sans-serif';cx.fillStyle='#d9deef';cx.fillText(ev.d+' · '+Math.ceil(C.t)+' с',W/2,y+25-1)}
let DKc=null;
function drawDark(){if(!G.cf||!G.cf.dark)return;if(!DKc){DKc=document.createElement('canvas');DKc.width=320;DKc.height=180}const x=DKc.getContext('2d'),f=320/VW;x.globalCompositeOperation='source-over';x.clearRect(0,0,320,180);x.fillStyle='rgba(3,5,16,.88)';x.fillRect(0,0,320,180);x.globalCompositeOperation='destination-out';
 const hole=(wx,wy,r)=>{const sx=(wx-CAM.x)*CAM.z*f,sy=(wy-CAM.y)*CAM.z*f,rr_=r*CAM.z*f,g=x.createRadialGradient(sx,sy,0,sx,sy,rr_);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(sx,sy,rr_,0,7);x.fill()};
 for(const e of ents)if(e.hp>0)hole(e.x,e.y-e.h*.5,e.B?260:150);for(const p of P)hole(p.x,p.y,55);for(const t of TUR)hole(t.x,t.y-20,110);for(const o of OB)hole(o.x,o.y-20,70);for(const h of HZ)if(h.k=='zone')hole(h.x,h.y,h.r+30);
 cx.drawImage(DKc,0,0,VW,VH)}
