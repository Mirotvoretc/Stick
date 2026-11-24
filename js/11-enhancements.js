(()=>{
const oldNear27=near;
near=function(e){let t=oldNear27(e),best=t?Math.abs(t.x-e.x)+Math.abs(t.y-e.y)*.6:1e9;for(const o of TUR){if(o.hp<=0||o.tm===e.tm)continue;const d=Math.abs(o.x-e.x)+Math.abs(o.y-e.y)*.6;if(d<best){best=d;t=o}}return t};

function electricChain27(source,first,damage,maxTargets=4,range=280,aid=null,falloff=.76){if(!first||first.hp<=0)return 0;const team=source&&source.tm!=null?source.tm:3,visited=[];let current=first,amount=damage,count=0;while(current&&count<maxTargets){visited.push(current);const x=current.x,y=current.y-(current.h||0)*.5;hit(current,Math.max(1,Math.round(amount)),source,0,0,1,aid);count++;let next=null,best=range;for(const o of ents.concat(TUR)){if(!o||o.hp<=0||o.tm===team||visited.includes(o))continue;const d=Math.hypot(o.x-x,(o.y-(o.h||0)*.5)-y);if(d<best){best=d;next=o}}if(next){ZP.push({x1:x,y1:y,x2:next.x,y2:next.y-(next.h||0)*.5,life:.28,c:'#8deeff'});current=next;amount*=falloff}else current=null}if(visited.length){fx(visited[0].x,visited[0].y-(visited[0].h||0)*.5,12,'#73e9ff',250);G.sh=Math.max(G.sh||0,4)}return count}
function electricChainAt27(source,x,y,damage,maxTargets=4,range=320){let first=null,best=range;for(const o of ents.concat(TUR)){if(!o||o.hp<=0||o.tm===(source&&source.tm))continue;const d=Math.hypot(o.x-x,(o.y-(o.h||0)*.5)-y);if(d<best){best=d;first=o}}return first?electricChain27(source,first,damage,maxTargets,range,null,.76):0}
window.electricChain= electricChain27;window.electricChain27=electricChain27;

const oldTesla27=teslaFire;
teslaFire=function(e,dm,aid){const x=e.x+e.f*24*e.sz,y=e.y-38*e.sz;let first=null,best=620;for(const o of ents.concat(TUR)){if(!o||o.hp<=0||o.tm===e.tm)continue;const dx=o.x-x,dy=(o.y-(o.h||0)*.5)-y,d=Math.hypot(dx,dy);if(dx*e.f>0&&d<best&&Math.abs(dy)<190){best=d;first=o}}if(!first)return oldTesla27(e,dm,aid);ZP.push({x1:x,y1:y,x2:first.x,y2:first.y-(first.h||0)*.5,life:.28,c:'#63eaff'});electricChain27(e,first,dm,4,280,aid,.76)};
const oldEle27=ATK.electric;
ATK.electric=function(e,a,t,rage){if(a.k!=='chain')return oldEle27(e,a,t,rage);const x=e.x,y=e.y-e.h*.65;if(a.t<.85){e.tel={k:'line',x1:x,y1:y,x2:t.x,y2:t.y-t.h*.5,p:Math.min(1,a.t/.85),c:'#8feeff'};return}if(!a.go){a.go=1;e.tel=null;if(!blockEnemyBeam(x,y,t.x,t.y-t.h*.5)){ZP.push({x1:x,y1:y,x2:t.x,y2:t.y-t.h*.5,life:.35,c:'#63eaff'});electricChain27(e,t,bossDamage(18),Math.max(4,bossProjectileCount(4,2,8)),450,null,.82)}G.sh=Math.max(G.sh,8)}if(a.t>1.15){e.atk=null;e.tel=null;e.bt=rage?2.2:3.1}};

const oldZom27=zom;
zom=function(e,dt){if(e.zk!=='e')return oldZom27(e,dt);const t=near(e);if(!t)return;const I=e.in={},dx=t.x-e.x,ad=Math.abs(dx),nav=aiNavigate(e,t.x,t.y,I,dt);if(!nav){if(ad<210)dx>0?I.l=1:I.r=1;else if(ad>330)dx>0?I.r=1:I.l=1}e.fo=Math.sign(dx)||e.f;e.electricCd=(e.electricCd||2.1)-dt;if(e.electricCd<=0&&ad<660&&Math.abs(t.y-e.y)<270){e.electricCd=3.3;const x=e.x+e.f*20,y=e.y-e.h*.62;let first=null,best=680;for(const o of ents.concat(TUR)){if(!o||o.hp<=0||o.tm===e.tm)continue;const d=Math.hypot(o.x-x,(o.y-(o.h||0)*.5)-y);if(d<best){best=d;first=o}}if(first){ZP.push({x1:x,y1:y,x2:first.x,y2:first.y-(first.h||0)*.5,life:.28,c:'#62ddff'});electricChain27(e,first,7+G.wv*1.5,4,255,null,.7)}}if(ad<24&&Math.abs(t.y-e.y)<80&&e.cd<=0){e.cd=1.5;hit(t,e.dmg,e,e.f*220,0,0)}};

const oldFire27=fire;
fire=function(e){if(e.wp!=='rail'&&e.wp!=='acid')return oldFire27(e);const id=e.wp,w=WP[id],aid=typeof slimeNewAttack==='function'?slimeNewAttack(e,id):null,power=CH[e.ch].slime?slimeAttackMultiplier(e):(e.rg?2:CH[e.ch].dm||1),dm=w.dm*power*(e.dm||1),x=e.x+e.f*24*e.sz,y=e.y-38*e.sz;e.attackId=aid;e.cd=w.cd/(G.chaosFireRate||1);e.rc=.1;if(id==='rail'){BM.push({x,y,f:e.f,l:.28,c:'#8deaff'});const hits=ents.concat(TUR).filter(o=>o&&o.hp>0&&o.tm!==e.tm&&(o.x-x)*e.f>0&&Math.abs((o.y-(o.h||0)*.5)-y)<(o.h||60)*.5+26).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x)).slice(0,8);for(const o of hits){hit(o,dm,e,e.f*160,0,0,aid);ZP.push({x1:x,y1:y,x2:o.x,y2:o.y-(o.h||0)*.5,life:.18,c:'#8deaff'})}fx(x,y,15,'#8deaff',300);G.sh=Math.max(G.sh,6)}else{pr({x,y,vx:e.f*w.v+e.vx*.18,vy:-35,dm,tm:e.tm,t:'a',col:w.c,life:w.life||2.2,src:e,g:w.g||170,aid});fx(x,y,8,'#9be86a',180)}use(e)};

const oldBoom27=boom;
boom=function(p){oldBoom27(p);if(!M)return;for(const q of M.pl){const f=q.feature;if(!f||f.type!=='breakable'||q[3])continue;const px=cl(p.x,q[0],q[0]+q[2]);if(Math.hypot(p.x-px,p.y-q[1])<150){f.hp-=Math.max(1,(p.dm||30)/24);if(f.hp<=0){q[3]=1;f.broken=1;fx(q[0]+q[2]/2,q[1],36,'#d2bd9b',340);TX.push({x:q[0]+q[2]/2,y:q[1]-18,t:'ПЛАТФОРМА РАЗРУШЕНА',l:1,c:'#e3c59c'})}}}};

const oldUpd27=upd;
upd=function(e,dt){
 oldUpd27(e,dt);
 if(e.hp<=0)return;
 if(e.acidTime>0){
  e.acidTime=Math.max(0,e.acidTime-dt);
  e.acidTick=(e.acidTick||.8)-dt;
  if(e.acidTick<=0){e.acidTick=.8;if(e.acidSource&&e.acidSource.tm!==e.tm)hit(e,e.acidDamage||4,e.acidSource,0,0,1,e.acidAid)}
 }
 if(!G||!G.arenaFeatures)return;
 const f=G.arenaFeatures;
 for(const p of f.pads){
  if(e.og&&e.x>p.x-36&&e.x<p.x+36&&Math.abs(e.y-p.y)<4&&(e.padCd||0)<=0){
   e.vy=-1080;e.og=0;e.padCd=.55;fx(e.x,e.y-8,18,'#7cecff',300);
   TX.push({x:e.x,y:e.y-e.h-14,t:'ПРЫЖОК!',l:.55,c:'#8cecff'});
  }
 }
 e.padCd=Math.max(0,(e.padCd||0)-dt);
 e.portalCd=Math.max(0,(e.portalCd||0)-dt);
 if(e.portalCd<=0&&e.og){
  for(let i=0;i<f.portals.length;i++){
   const p=f.portals[i];
   if(!p||p.disabled)continue;
   if(Math.abs(e.x-p.x)<31&&Math.abs(e.y-p.y)<9){
    const d=f.portals[1-i];
    if(!d||d.disabled)break;
    const dir=i===0?-1:1;
    const minX=d.platform?d.platform[0]+e.w*.5+10:24;
    const maxX=d.platform?d.platform[0]+d.platform[2]-e.w*.5-10:W-24;
    e.x=cl(d.x+dir*48,minX,maxX);
    e.y=d.y;
    e.vx*=.25;e.vy=0;e.og=1;
    e.portalCd=1.5;
    e.portalFlash=.28;
    const color=d.color||'#c68cff';
    fx(p.x,p.y-46,30,p.color||'#67eaff',390);
    fx(d.x,d.y-46,30,color,390);
    TX.push({x:e.x,y:e.y-e.h-14,t:'ТЕЛЕПОРТ · 1.5 С',l:.7,c:color});
    break;
   }
  }
 }
 if(e.B&&e.btype==='spider'&&e.og&&!e.spiderHang){
  const p=M.pl.find(q=>!q[3]&&Math.abs(q[1]-e.y)<7&&e.x>q[0]&&e.x<q[0]+q[2]);
  if(p){e.spiderHang=.58;e.spiderHangY=p[1];e.vy=0;e.clingFlash=.25;fx(e.x,e.y-8,9,'#a9dfff',180)}
 }
};

function updateMoving27(dt){if(!G||!G.arenaFeatures)return;for(const f of G.arenaFeatures.moving){const p=f.platform,ox=p[0],oy=p[1];f.phase+=dt*f.speed;const nx=f.baseX+Math.sin(f.phase)*f.ampX,ny=f.baseY+Math.sin(f.phase*.73)*f.ampY,dx=nx-ox,dy=ny-oy;for(const e of ents)if(e.hp>0&&e.og&&e.x>=ox-8&&e.x<=ox+p[2]+8&&Math.abs(e.y-oy)<5){e.x+=dx;e.y+=dy}p[0]=nx;p[1]=ny}}
function choosePortalPlatforms27(){
 const candidates=M.pl.filter(p=>!p[3]&&!p.feature&&p[2]>=92&&p[1]<GY-34);
 const pick=(side)=>{
  const target=W*(side==='left'?.39:.61);
  const pool=candidates.filter(p=>side==='left'?p[0]+p[2]*.5<W*.5:p[0]+p[2]*.5>W*.5);
  pool.sort((a,b)=>{
   const score=p=>Math.abs(p[0]+p[2]*.5-target)+Math.abs(p[1]-(GY-160))*.42-Math.min(180,p[2])*.08;
   return score(a)-score(b);
  });
  return pool[0]||null;
 };
 const left=pick('left'),right=pick('right');
 const make=(platform,id,color,fallbackX)=>({id,x:platform?platform[0]+platform[2]*.5:fallbackX,y:platform?platform[1]:GY,platform,offsetX:platform?platform[2]*.5:0,color,disabled:false});
 return [make(left,'A','#59e8ff',W*.39),make(right,'B','#c58aff',W*.61)];
}
function syncArenaPortals27(){
 if(!G||!G.arenaFeatures)return;
 for(const p of G.arenaFeatures.portals){
  if(p.platform){p.x=p.platform[0]+p.offsetX;p.y=p.platform[1];p.disabled=!!(p.platform[3]||p.platform.feature&&p.platform.feature.broken)}
 }
}
function setupArena27(){
 if(!G||!M)return;
 const f={pads:[{x:W*.2,y:GY},{x:W*.8,y:GY}],portals:choosePortalPlatforms27(),moving:[]};
 G.arenaFeatures=f;
 const br=[W*.37,GY-142,170];br.feature={type:'breakable',hp:5,max:5};M.pl.push(br);
 const mp=[W*.62,GY-252,185];mp.feature={type:'moving'};f.moving.push({platform:mp,baseX:mp[0],baseY:mp[1],phase:R()*6.28,ampX:105,ampY:28,speed:.72});M.pl.push(mp);
 f.breakable=br;G.deviceTimer=8+R()*7;syncArenaPortals27();mkbg();
}
function limitSlimes27(){const a=ents.filter(e=>e.pi!=null&&CH[e.ch]&&CH[e.ch].slime).sort((x,y)=>x.pi-y.pi);for(const e of a.slice(2)){e.ch=0;e.mh=CH[0].hp;e.hp=Math.min(e.hp,e.mh);e.sz=.98;e.w=20*e.sz;e.h=58*e.sz;e.dm=1;TX.push({x:e.x,y:e.y-e.h-18,t:'ЛИМИТ СЛИЗЕЙ · 2',l:1.3,c:'#71c9ff'})}}
const oldNext27=nextRound;
nextRound=function(){oldNext27();DEV=[];limitSlimes27();setupArena27()};

function spawnDevice27(){if(!G||DEV.length>=5)return;const barrel=R()<.66;DEV.push({kind:barrel?'barrel':'generator',x:90+R()*(W-180),y:-55,vy:30+R()*55,hp:barrel?52:78,mh:barrel?52:78,tm:3,life:27,src:null,fall:1,flash:0})}
function detonateDevice27(d,source){if(!d||d.dead)return;d.dead=1;const tm=source&&source.tm!=null?source.tm:3,src=source||d;fx(d.x,d.y,38,d.kind==='barrel'?'#ff9a39':'#71eaff',520);RG.push({x:d.x,y:d.y,l:.4});G.sh=Math.max(G.sh,9);if(d.kind==='barrel'||d.kind==='drone'){const drone=d.kind==='drone',radius=drone?125:235,baseDamage=drone?52:88;for(const o of ents)if(o.hp>0&&o.tm!==tm){const dist=Math.hypot(o.x-d.x,(o.y-o.h*.5)-d.y);if(dist<radius)hit(o,Math.round(baseDamage*(1-dist/radius*.58)),src,Math.sign(o.x-d.x||1)*(drone?280:430),0,1)}if(!drone)for(const q of DEV)if(q!==d&&!q.dead&&Math.hypot(q.x-d.x,q.y-d.y)<175){q.hp=0;detonateDevice27(q,src)}}else{electricChainAt27(src,d.x,d.y,36,4,350);for(const o of ents)if(o.hp>0&&o.tm!==tm&&Math.hypot(o.x-d.x,o.y-o.h*.5-d.y)<145)st(o,'sl',.6)}}
function deviceProjectileHit27(p,ox,oy){if(!p||p.life<=0)return false;for(const d of DEV){if(d.dead||d.y<-100||Math.hypot(p.x-d.x,p.y-d.y)>24)continue;d.tm=p.tm??3;d.src=p.src||d.src;d.hp-=Math.max(8,p.dm||12);d.flash=.12;p.life=0;fx(d.x,d.y,8,d.kind==='barrel'?'#ffbf6b':'#80efff',180);if(d.hp<=0)detonateDevice27(d,d.src);return true}for(const q of M.pl){const f=q.feature;if(!f||f.type!=='breakable'||q[3]||p.vy<0)continue;if(ox<=q[1]&&p.y>=q[1]&&p.x>=q[0]&&p.x<=q[0]+q[2]){f.hp-=Math.max(1,(p.dm||8)/28);p.life=0;if(f.hp<=0){q[3]=1;f.broken=1;fx(p.x,q[1],34,'#d2bd9b',320);TX.push({x:p.x,y:q[1]-18,t:'ПЛАТФОРМА РАЗРУШЕНА',l:1,c:'#e3c59c'})}else fx(p.x,q[1],7,'#e3c59c',130);return true}}return false}
window.deviceProjectileHit27=deviceProjectileHit27;
function updateDevices27(dt){if(!G||!G.arenaFeatures)return;G.deviceTimer=(G.deviceTimer||9)-dt;if(G.deviceTimer<=0){spawnDevice27();G.deviceTimer=12+R()*10}for(const d of DEV){if(d.dead)continue;d.life-=dt;d.flash=Math.max(0,(d.flash||0)-dt);if(d.fall){d.vy+=520*dt;d.y+=d.vy*dt;if(d.y>=GY){d.y=GY;d.vy=0;d.fall=0;fx(d.x,d.y-8,9,'#c7d4da',160)}}else if(d.kind==='drone'){const t=ents.filter(o=>o.hp>0&&o.tm!==d.tm&&!o.cl).sort((a,b)=>Math.hypot(a.x-d.x,a.y-d.y)-Math.hypot(b.x-d.x,b.y-d.y))[0];if(t){const dx=t.x-d.x,dy=t.y-t.h*.5-d.y,dist=Math.max(1,Math.hypot(dx,dy));d.vx+=(dx/dist*350-d.vx)*Math.min(1,dt*3);d.vy+=(dy/dist*350-d.vy)*Math.min(1,dt*3);d.x+=d.vx*dt;d.y+=d.vy*dt;if(dist<28)detonateDevice27(d,d.src)}if(R()<dt*22)PT.push({x:d.x,y:d.y,vx:(R()-.5)*30,vy:(R()-.5)*30,g:0,l:.22,c:'#ff695e',r:2})}if(d.life<=0){if(d.kind==='drone')detonateDevice27(d,d.src);else d.dead=1}}DEV=DEV.filter(d=>!d.dead&&d.hp>0&&d.life>0)}
function drawPortalVisual27(p,i,t){
 if(!p||p.disabled)return;
 const color=p.color||(i?'#c58aff':'#59e8ff'),phase=t*2.15+i*1.35,cy=-54;
 cx.save();cx.translate(p.x,p.y);cx.globalCompositeOperation='lighter';
 cx.shadowColor=color;cx.shadowBlur=28;cx.globalAlpha=.78;
 cx.strokeStyle=color;cx.lineWidth=7;cx.beginPath();cx.ellipse(0,cy,31,49,0,0,Math.PI*2);cx.stroke();
 cx.globalAlpha=.34;cx.fillStyle=color;cx.beginPath();cx.ellipse(0,cy,25,43,0,0,Math.PI*2);cx.fill();
 cx.shadowBlur=0;cx.globalAlpha=.96;cx.strokeStyle='#e8fbff';cx.lineWidth=2.2;cx.beginPath();cx.ellipse(0,cy,23,40,0,0,Math.PI*2);cx.stroke();
 cx.globalAlpha=.7;cx.strokeStyle=color;cx.lineWidth=3;cx.beginPath();cx.ellipse(Math.sin(phase)*5,cy,13,35,phase,0,Math.PI*2);cx.stroke();
 cx.globalAlpha=.85;cx.fillStyle='#fff';
 for(let k=0;k<4;k++){const a=phase+k*Math.PI*.5;cx.beginPath();cx.arc(Math.cos(a)*20,cy+Math.sin(a)*35,2.6,0,Math.PI*2);cx.fill()}
 cx.globalAlpha=.95;cx.strokeStyle=color;cx.lineWidth=5;cx.beginPath();cx.ellipse(0,-2,46,11,0,0,Math.PI*2);cx.stroke();
 cx.globalAlpha=.32;cx.fillStyle=color;cx.beginPath();cx.ellipse(0,-2,42,8,0,0,Math.PI*2);cx.fill();
 cx.globalCompositeOperation='source-over';cx.shadowBlur=0;cx.globalAlpha=1;
 cx.fillStyle='#081323';cx.fillRect(-38,-119,76,19);cx.strokeStyle=color;cx.lineWidth=1.5;cx.strokeRect(-38,-119,76,19);
 cx.fillStyle='#f4fbff';cx.font='bold 11px system-ui,sans-serif';cx.textAlign='center';cx.fillText('ПОРТАЛ '+p.id,0,-106);
 cx.restore();
}
function drawArenaFeatures27(){
 if(!G||!G.arenaFeatures)return;
 syncArenaPortals27();
 const t=G.t;
 for(const p of M.pl){
  const f=p.feature;if(!f||f.broken)continue;
  const x=p[0],y=p[1],w=p[2];cx.save();
  if(f.type==='moving'){cx.shadowColor='#56ddff';cx.shadowBlur=14;rr(x,y,w,13,'#1d7890',cx,7);rr(x+8,y+2,w-16,5,'#8aefff',cx,4)}
  else{rr(x,y,w,13,'#75553b',cx,5);cx.strokeStyle='#f2c99a';cx.lineWidth=2;cx.beginPath();cx.moveTo(x+8,y+3);cx.lineTo(x+w-8,y+10);cx.moveTo(x+w*.3,y+2);cx.lineTo(x+w*.52,y+12);cx.stroke();rr(x+w/2-24,y-14,48,4,'#161820',cx,2);rr(x+w/2-22,y-13,44*Math.max(0,f.hp/f.max),2,'#ffcb78',cx,1)}
  cx.restore();
 }
 for(const p of G.arenaFeatures.pads){cx.save();cx.translate(p.x,p.y);cx.globalCompositeOperation='lighter';cx.strokeStyle='#7cecff';cx.lineWidth=4;cx.globalAlpha=.8;cx.beginPath();cx.ellipse(0,-2,40,9,0,0,Math.PI*2);cx.stroke();cx.globalAlpha=.25+.15*Math.sin(t*8);cx.fillStyle='#7cecff';cx.beginPath();cx.ellipse(0,-2,35,7,0,0,Math.PI*2);cx.fill();cx.restore()}
 for(let i=0;i<G.arenaFeatures.portals.length;i++)drawPortalVisual27(G.arenaFeatures.portals[i],i,t);
 for(const d of DEV){
  cx.save();cx.translate(d.x,d.y);
  if(d.kind==='drone'){cx.rotate(Math.atan2(d.vy||0,d.vx||1));cx.shadowColor='#ff625c';cx.shadowBlur=12;cx.fillStyle='#a72f38';cx.strokeStyle='#ffc0b8';cx.lineWidth=2;cx.beginPath();cx.arc(0,0,10,0,Math.PI*2);cx.fill();cx.stroke();cx.fillStyle='#ffcc9e';cx.fillRect(-16,-2,32,4);cx.fillStyle='#fff';cx.beginPath();cx.arc(0,-2,3,0,Math.PI*2);cx.fill()}
  else if(d.kind==='barrel'){cx.shadowColor='#ff9b43';cx.shadowBlur=9;rr(-13,-19,26,38,d.flash?'#fff':'#a94f25',cx,6);rr(-15,-12,30,5,'#e5b26a',cx,2);rr(-15,8,30,5,'#e5b26a',cx,2);cx.fillStyle='#ffe08a';cx.font='bold 10px sans-serif';cx.textAlign='center';cx.fillText('GAS',0,3)}
  else{cx.shadowColor='#67eaff';cx.shadowBlur=12;rr(-17,-21,34,42,d.flash?'#fff':'#245d70',cx,5);rr(-12,-15,24,12,'#80edff',cx,3);cx.fillStyle='#c5ffff';cx.fillRect(-9,4,18,3)}
  cx.restore();
  if(d.kind!=='drone'){cx.fillStyle='#0b1320';cx.fillRect(d.x-17,d.y-27,34,4);cx.fillStyle=d.hp/d.mh>.45?'#79e5bd':'#ff806e';cx.fillRect(d.x-16,d.y-26,32*Math.max(0,d.hp/d.mh),2)}
 }
}
window.drawArenaFeatures27=drawArenaFeatures27;
window.drawPortalVisual27=drawPortalVisual27;
window.choosePortalPlatforms27=choosePortalPlatforms27;
window.syncArenaPortals27=syncArenaPortals27;

const oldWall27=blockMonsterByWalls;
blockMonsterByWalls=function(e,ox,oy,dt=1/60){const before=e.x;oldWall27(e,ox,oy,dt);if(Math.abs(e.x-before)>1&&e.tm!=null){for(const w of WALLS)if(e.tm!==w.tm&&e.y>w.y-5&&e.y-e.h<w.bottom+5&&Math.abs(before-w.x)<e.w*.5+100){w.hp-=Math.max(1,(e.dmg||6)*.5*dt);if(w.hp<=0)TX.push({x:w.x,y:w.y-18,t:'БАРЬЕР РАЗРУШЕН',l:.9,c:'#ffb45e'})}}};

const oldTurretDraw27=drawTurrets;
drawTurrets=function(){oldTurretDraw27();for(const t of TUR){cx.save();cx.fillStyle='#101522';cx.fillRect(t.x-20,t.y-37,40,5);cx.fillStyle=t.hp>40?'#72e4a4':'#ff755f';cx.fillRect(t.x-19,t.y-36,38*cl(t.hp/100,0,1),3);if(t.evolved){cx.font='10px system-ui';cx.textAlign='center';cx.fillStyle=t.c;cx.fillText(t.kind==='electric'?'TESLA':'ROCKET',t.x,t.y-42)}cx.restore()}};

const oldBossAI27=bossAI;
bossAI=function(e,dt){if(e.btype!=='spider')return oldBossAI27(e,dt);const I=e.in={},t=bossTarget(e)||near(e);if(!t)return;const rage=e.hp<=e.mh*.53;if(rage&&!e.spiderRage){e.spiderRage=1;e.arm=0;TX.push({x:e.x,y:e.y-e.h-30,t:'БРОНЯ СБРОШЕНА · ЯРОСТЬ!',l:1.8,c:'#ff755f'});fx(e.x,e.y-e.h*.5,50,'#ff8a65',520);G.sh=Math.max(G.sh,13)}e.fo=Math.sign(t.x-e.x)||e.f;const spec=BOSS_TYPES.find(b=>b.id==='spider');e.spm=spec.speed*(rage?1.24:1);e.spiderCd=(e.spiderCd??2.5)-dt*bossAbilityRate();const dx=t.x-e.x,ad=Math.abs(dx);if(e.spiderHang>0){I.l=I.r=0}else{const nav=aiNavigate(e,t.x,t.y,I,dt);if(!nav&&ad>170){I.r=dx>0?1:0;I.l=dx<0?1:0}}if(e.spiderAtk){const a=e.spiderAtk;a.t+=dt*bossAbilityRate();if(a.kind==='laser'){e.tel={k:'line',x1:e.x+e.f*22,y1:e.y-e.h*.72,x2:a.x,y2:a.y,p:Math.min(1,a.t/.78),c:'#ff5663',mark:1};if(a.t>=.78&&!a.done){a.done=1;e.tel=null;if(!blockEnemyBeam(e.x,e.y-e.h*.72,a.x,a.y)){ZP.push({x1:e.x,y1:e.y-e.h*.72,x2:a.x,y2:a.y,life:.32,c:'#ff5968'});const dx2=a.x-e.x,dy2=a.y-(e.y-e.h*.72),len=dx2*dx2+dy2*dy2;for(const o of foes(e)){const q=cl(((o.x-e.x)*dx2+(o.y-o.h*.5-(e.y-e.h*.72))*dy2)/(len||1),0,1),px=e.x+q*dx2,py=e.y-e.h*.72+q*dy2;if(Math.hypot(o.x-px,o.y-o.h*.5-py)<35)hit(o,bossDamage(38),e,Math.sign(dx2)*220,0,1)}}}if(a.t>1.12){e.spiderAtk=null;e.tel=null;e.spiderCd=2.5}}else if(a.kind==='drones'){if(!a.done&&a.t>=.16){a.done=1;for(let i=0;i<(rage?3:2);i++)DEV.push({kind:'drone',x:e.x+e.f*36+(i-.5)*18,y:e.y-e.h*.7,vx:e.f*130,vy:(i-1)*40,tm:e.tm,src:e,life:3,hp:1,mh:1})}if(a.t>1){e.spiderAtk=null;e.spiderCd=3}}else if(a.kind==='web'){if(!a.done&&a.t>=.65){a.done=1;zone(cl(a.x,70,W-70),a.y,115,.5,2.1,e.tm,e,bossDamage(7),'#75bde1',1);fx(a.x,a.y,26,'#76c9f0',320)}if(a.t>1){e.spiderAtk=null;e.spiderCd=3.2}}else if(a.kind==='jump'){if(!a.done&&a.t>=.32){a.done=1;e.vy=-820;e.vx=cl((a.x-e.x)*1.15,-620,620);e.og=0}if(a.t>1.35){e.spiderAtk=null;e.spiderCd=2.8}}return}if(e.spiderCd<=0){let kind=['laser','drones','web','jump'][R()*4|0];if(ad<170&&kind==='laser')kind='jump';e.spiderAtk={kind,t:0,x:t.x,y:t.y-t.h*.55};e.spiderCd=4.1;TX.push({x:e.x,y:e.y-e.h-24,t:kind==='laser'?'ЛАЗЕРНЫЙ ПРИЦЕЛ':kind==='drones'?'ВЫПУСК ДРОНОВ':kind==='web'?'ЭЛЕКТРОСЕТЬ':'ПРЫЖОК ПАУКА',l:.9,c:'#ff8290'})}e.spiderJumpCd=(e.spiderJumpCd||0)-dt;if(e.spiderJumpCd<=0&&e.og&&ad>240){I.j=1;e.spiderJumpCd=2.6}};

const oldDrawBoss27=drawBoss;
drawBoss=function(e){if(e.btype!=='spider')return oldDrawBoss27(e);const T=G.t,u=e.h/120,dead=e.hp<=0;cx.save();cx.translate(e.x,e.y);cx.scale(e.f*u,u);if(dead){cx.rotate((e.dk||1)*Math.min(1,(1-e.dd/1.3)*2)*1.1);cx.globalAlpha=Math.min(1,e.dd*3)}const glow=cx.createRadialGradient(0,-42,4,0,-42,92);glow.addColorStop(0,'#b4edff66');glow.addColorStop(1,'#64cfff00');cx.fillStyle=glow;cx.beginPath();cx.arc(0,-42,92,0,7);cx.fill();cx.lineWidth=8;cx.lineCap='round';cx.strokeStyle='#263847';for(let i=0;i<4;i++){const side=i<2?-1:1,leg=i%2?1:-1;cx.beginPath();cx.moveTo(side*24,-47);cx.lineTo(side*(54+i*4),-61+leg*15);cx.lineTo(side*(75+i*5),-28+leg*22);cx.lineTo(side*(88+i*4),-4);cx.stroke()}const body=cx.createLinearGradient(-38,-88,40,-8);body.addColorStop(0,'#e0edf5');body.addColorStop(.36,'#6f8da2');body.addColorStop(.7,'#34495b');body.addColorStop(1,'#152432');cx.fillStyle=body;cx.strokeStyle='#101a28';cx.lineWidth=5;cx.beginPath();cx.ellipse(0,-46,47,36,0,0,7);cx.fill();cx.stroke();cx.fillStyle='#819bab';cx.beginPath();cx.ellipse(0,-82,28,20,0,0,7);cx.fill();cx.stroke();cx.fillStyle='#ff4157';cx.shadowColor='#ff4157';cx.shadowBlur=16;for(const x of[-13,13]){cx.beginPath();cx.ellipse(x,-85,7,4,0,0,7);cx.fill()}cx.shadowBlur=0;if(e.arm>0){cx.strokeStyle='#d8e5ed';cx.lineWidth=5;cx.beginPath();cx.ellipse(0,-46,55,42,0,0,7);cx.stroke()}else{cx.strokeStyle='#ff846f';cx.lineWidth=3;cx.beginPath();cx.moveTo(-24,-70);cx.lineTo(-8,-47);cx.lineTo(-22,-20);cx.moveTo(25,-68);cx.lineTo(7,-46);cx.lineTo(23,-16);cx.stroke()}cx.restore();if(!dead&&e.tel)drawTel(e)};

const oldStep27=step;
function updateMovingPlatforms27(dt){if(!G||!G.arenaFeatures)return;for(const f of G.arenaFeatures.moving){const p=f.platform,ox=p[0],oy=p[1];f.phase+=dt*f.speed;const nx=f.baseX+Math.sin(f.phase)*f.ampX,ny=f.baseY+Math.sin(f.phase*.73)*f.ampY,dx=nx-ox,dy=ny-oy;for(const e of ents)if(e.hp>0&&e.og&&e.x>=ox-8&&e.x<=ox+p[2]+8&&Math.abs(e.y-oy)<5){e.x+=dx;e.y+=dy}p[0]=nx;p[1]=ny}syncArenaPortals27()}
step=function(dt){if(G&&!G.pause&&!G.end&&G.arenaFeatures)updateMovingPlatforms27(dt);oldStep27(dt);if(G&&!G.pause&&!G.end&&G.cd<=0&&G.arenaFeatures)updateDevices27(dt)};

window.isWorldVisible27=function(x,y,padX=0,padY=0){if(!CAM||!G)return true;const z=Math.max(.2,CAM.z||1);return x>=CAM.x-padX&&x<=CAM.x+VW/z+padX&&y>=CAM.y-padY&&y<=CAM.y+VH/z+padY};
window.drawArenaFeatures27=drawArenaFeatures27;
})();
