/* ===================================================================
   v2.7 — КЛАСС «КИЛЛЕР» (хардкор)
   250 HP, урон ×1.1. Способность — удар по метке с тайминг-шкалой.
   =================================================================== */
CH.push({n:'Киллер',hp:250,sp:1.04,dm:1.1,killer:1,d:'ХАРДКОР: 250 HP, урон ×1.1. Способность — удар по метке: над ближайшим врагом появляется шкала с бегунком, нажми способность ещё раз, когда он в зелёной зоне. Попадание: 10 урона, перезарядка сбрасывается сразу; каждое попадание подряд удваивает урон (20, 40, 80…), после 5-го зона уже в 1,5 раза. Промах: оглушение на 1 с и перезарядка 15 с.'});
const KB={w:112,h:12,base:.085};
function killerZone(e){const st=e.kStreak||0;let z=KB.base*((e.ev&&e.ev.kz)||1);if(st>=5)z/=1.5;if(st>=10)z/=1.5;return z}
function killerTarget(e){let t=null,bd=900;for(const o of ents){if(o.hp<=0||o.tm==e.tm||o.bat>0||o.cl)continue;const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;t=o}}return t}
function killerPress(e){const K=e.kl;
 if(!K){if(e.kc>0||(e.klLock||0)>0)return;const t=killerTarget(e);
  if(!t){e.kc=1;e.kcMax=1;TX.push({x:e.x,y:e.y-e.h-14,t:'НЕТ ЦЕЛИ',l:.7,c:'#9aa4b8'});return}
  e.kl={tg:t,ph:R()*6.28,t:0,pos:.5,seed:R()*6};animeT('ring',t.x,t.y-t.h*.5,'#ff3b6b',{r:60,d:.4});animeT('lines',t.x,t.y-t.h*.5,'#ff7a9a',{r:50,d:.35,n:16});TX.push({x:t.x,y:t.y-t.h-48,t:'МЕТКА!',l:.7,c:'#ff6a8a',s:20});return}
 if(K.t<.1)return;
 const ok=Math.abs(K.pos-.5)<=killerZone(e)/2;killerResolve(e,ok)}
function killerResolve(e,ok,silent){const K=e.kl;if(!K)return;const t=K.tg;e.kl=null;
 if(ok){const st=e.kStreak||0,dmg=Math.round(10*Math.pow(2,Math.min(7,st))*(CH[e.ch].dm||1)*(e.dm||1)*((e.ev&&e.ev.kd)||1));e.kStreak=st+1;
  if(t&&t.hp>0){hit(t,dmg,e,(Math.sign(t.x-e.x)||1)*320,0,1,slimeNextAttackId())}
  const x=t?t.x:e.x,y=t?t.y-t.h*.5:e.y-30;
  animeT('slash',x,y,'#ff3b6b',{a:-.7,r:110,d:.4});animeT('slash',x,y,'#ffffff',{a:.7,r:100,d:.34});animeT('lines',x,y,'#ffd0dc',{r:110,d:.45,n:28});animeT('star',x,y,'#fff',{r:50,d:.3});
  G.sh=Math.max(G.sh,6+Math.min(10,st*2));G.hs=.07;e.kc=0;e.kcMax=1;e.klLock=.3;
  TX.push({x:e.x,y:e.y-e.h-18,t:'ТОЧНО! ×'+(st+1)+' · '+dmg,l:1,c:'#7dff9a',s:24});
  if(st+1==5)TX.push({x:e.x,y:e.y-e.h-46,t:'ЗОНА СУЖЕНА',l:1.2,c:'#ffd166',s:18});
  if(st+1>=3)cutIn('СЕРИЯ ×'+(st+1),'КИЛЛЕР',st+1>=5?'#ff3b6b':'#ffb45e')}
 else{e.kStreak=0;e.stun=1*((e.ev&&e.ev.ks)||1);e.kc=15;e.kcMax=15;e.klLock=.3;
  animeT('ring',e.x,e.y-e.h,'#9aa4b8',{r:50,d:.4});TX.push({x:e.x,y:e.y-e.h-18,t:silent?'ТАЙМАУТ!':'ПРОМАХ!',l:1.1,c:'#ff7a7a',s:24});fx(e.x,e.y-e.h,10,'#ffd166',200)}}
function killerTick(e,dt){if(!e.kInit){e.kInit=1;e.kc=0}e.klLock=Math.max(0,(e.klLock||0)-dt);const K=e.kl;if(!K)return;
 if(!K.tg||K.tg.hp<=0){e.kl=null;e.kc=1;e.kcMax=1;return}
 K.t+=dt;const w=Math.max(1.3,3.3*(1+.78*Math.sin(K.t*1.9+K.seed))*((e.ev&&e.ev.kt)||1));K.ph+=dt*w;K.pos=.5+.5*Math.sin(K.ph);
 if(K.t>6)killerResolve(e,false,true)}
function drawKiller(){
 for(const e of ents){
  if(e.kl&&e.hp>0){const K=e.kl,t=K.tg;if(!t||t.hp<=0)continue;const bx=t.x,by=t.y-t.h-34,w=KB.w,h=KB.h,z=killerZone(e);cx.save();cx.translate(bx,by);
   cx.globalAlpha=.9;cx.strokeStyle='#ff3b6b';cx.lineWidth=2;cx.beginPath();cx.arc(0,t.h*.5+34,t.h*.62,0,7);cx.stroke();cx.setLineDash([5,6]);cx.beginPath();cx.moveTo(-t.h*.9,t.h*.5+34);cx.lineTo(t.h*.9,t.h*.5+34);cx.moveTo(0,t.h*.5+34-t.h*.9);cx.lineTo(0,t.h*.5+34+t.h*.9);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1;
   rr(-w/2-3,-h/2-3,w+6,h+6,'#0a0c15f0',cx,5);cx.fillStyle='#2a2f44';cx.fillRect(-w/2,-h/2,w,h);
   cx.fillStyle='#3dff7a';cx.fillRect(-z*w/2,-h/2,z*w,h);cx.globalCompositeOperation='lighter';cx.fillStyle='#3dff7a66';cx.fillRect(-z*w/2-2,-h/2-2,z*w+4,h+4);cx.globalCompositeOperation='source-over';
   const sx=(K.pos-.5)*w;cx.fillStyle='#fff';cx.beginPath();cx.moveTo(sx,-h/2-5);cx.lineTo(sx+4,-h/2-1);cx.lineTo(sx-4,-h/2-1);cx.closePath();cx.fill();cx.fillRect(sx-1,-h/2-1,2,h+2);
   cx.font='bold 11px system-ui,sans-serif';cx.textAlign='center';cx.fillStyle='#ffd0dc';cx.fillText('×'+((e.kStreak||0)+1)+' · '+Math.round(10*Math.pow(2,Math.min(7,e.kStreak||0))),0,-h/2-9);cx.restore()}
  if(e.stun>0&&e.hp>0){const T=G.t*6;cx.save();cx.fillStyle='#ffe066';for(let i=0;i<3;i++){const a=T+i*2.09;cx.save();cx.translate(e.x+Math.cos(a)*18,e.y-e.h-8+Math.sin(a)*5);cx.rotate(a);cx.beginPath();for(let j=0;j<10;j++){const q=j%2?2:5;cx.lineTo(Math.cos(j*.628)*q,Math.sin(j*.628)*q)}cx.closePath();cx.fill();cx.restore()}cx.restore()}}}
