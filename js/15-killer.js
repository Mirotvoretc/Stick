/* ===================================================================
   v2.7 — КЛАСС «КИЛЛЕР» (хардкор)
   250 HP, урон ×1.1. Способность — удар по метке с тайминг-шкалой.
   =================================================================== */
CH.push({n:'Киллер',hp:250,sp:1.04,dm:1.1,killer:1,d:'ХАРДКОР: 250 HP, урон ×1.1. Способность — удар по метке: над самим Киллером появляется шкала с бегунком, нажми способность ещё раз, когда он в зелёной зоне. Попадание: 10 урона, перезарядка сбрасывается сразу; каждое попадание подряд удваивает урон (20, 40, 80…), после 5-го зона уже в 1,5 раза. Промах: оглушение на 1 с и перезарядка 15 с.'});
const KB={w:112,h:12,base:.085};
function killerZone(e){const st=e.kStreak||0;let z=KB.base*((e.ev&&e.ev.kz)||1);if(st>=5)z/=1.5;if(st>=10)z/=1.5;return z}
function killerTarget(e){let t=null,bd=900;for(const o of ents){if(o.hp<=0||o.tm==e.tm||o.bat>0||o.cl)continue;const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;t=o}}return t}
function killerPress(e){const K=e.kl;
 if(!K){if(e.kc>0||(e.klLock||0)>0)return;const t=killerTarget(e);
  if(!t){e.kc=1;e.kcMax=1;return}
  e.kl={tg:t,ph:R()*6.28,t:0,pos:.5,seed:R()*6};fx(e.x,e.y-e.h*.65,8,'#ff5c82',180);return}
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
function drawKillerMeter(e){
 const K=e&&e.kl,t=K&&K.tg;if(!K||!t||t.hp<=0)return;
 const w=58,h=4,x=cl(e.x-w*.5,8,W-w-8),y=cl(e.y-e.h-9,8,H-12),z=cl(killerZone(e),.025,.4),zoneW=Math.max(8,w*z),marker=x+cl(K.pos,0,1)*w;
 cx.save();cx.globalAlpha=.98;rr(x-2,y-2,w+4,h+4,'#090d18e8',cx,3);rr(x,y,w,h,'#303746',cx,2);rr(x+w*.5-zoneW*.5,y+1,zoneW,h-2,'#54e39a',cx,1);cx.fillStyle='#fff';cx.fillRect(marker-1,y-1,2,h+2);cx.restore();
}
function drawKiller(){
 for(const e of ents){
  if(CH[e.ch]&&CH[e.ch].killer&&e.kl&&e.hp>0)drawKillerMeter(e);
  if(e.stun>0&&e.hp>0){const T=G.t*6;cx.save();cx.fillStyle='#ffe066';for(let i=0;i<3;i++){const a=T+i*2.09;cx.save();cx.translate(e.x+Math.cos(a)*18,e.y-e.h-8+Math.sin(a)*5);cx.rotate(a);cx.beginPath();for(let j=0;j<10;j++){const q=j%2?2:5;cx.lineTo(Math.cos(j*.628)*q,Math.sin(j*.628)*q)}cx.closePath();cx.fill();cx.restore()}cx.restore()}
 }
}
