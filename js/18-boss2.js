/* ===================================================================
   v2.7 — ФАЗА 2 БОССОВ (ульты) · МИНИ-БОСС «ПОГЛОТИТЕЛЬ» · КАРТА «НЕБЕСНАЯ СТАНЦИЯ»
   =================================================================== */
/* ---------- ульты второй фазы (после ярости / сброса брони) ---------- */
const ULTS=new Set(['umbra','quake','harvest','thunder','overload']);
Object.assign(ATKN,{umbra:'КЛИНОК БЕЗДНЫ',quake:'ГНЕВ ТИТАНА',harvest:'ЖАТВА ДУШ',thunder:'ГНЕВ ГРОМОВЕРЖЦА',overload:'ПЕРЕГРУЗКА'});
Object.assign(PREF,{umbra:0,quake:0,harvest:0,thunder:0,overload:0,chain:1});
for(const[id,u]of[['warlord','umbra'],['colossus','quake'],['necromancer','harvest'],['electric','thunder'],['spider','overload']]){const b=BOSS_TYPES.find(x=>x.id==id);if(b)b.atk2=[u]}
for(const id of['warlord','colossus','necromancer','electric','spider']){const orig=ATK[id];ATK[id]=function(e,a,t,rage){if(ULTS.has(a.k))return ultRun(e,a,t);return orig(e,a,t,rage)}}
function ultRun(e,a,t){const k=a.k,end=d=>{e.atk=null;e.tel=null;e.bt=d},cy=e.y-e.h*.85,spec=BOSS_TYPES.find(b=>b.id==e.btype)||{n:''};
 if(!a.d){a.d=1;cutIn(ATKN[k],spec.n.toUpperCase()+' · ФАЗА 2','#ff5a8a');G.sh=Math.max(G.sh,14);animeT('lines',e.x,cy,'#ff9ab8',{r:200,d:.7,n:36});animeT('ring',e.x,e.y-4,'#ff5a8a',{r:240,sq:.25,d:.7})}
 if(k=='umbra'){e.tel={k:'orb',x:e.x,y:cy,p:Math.min(1,a.t/1.3),c:'#b06bff'};
  if(a.t>=1.3&&!a.go){a.go=1;e.tel=null;const n=11;for(let i=0;i<n;i++)rockAt(60+(W-120)*(i+.5)/n,GY,.35+(i%2?i:n-i)*.11,e.tm,e,bossDamage(18),'#a24dff','blade');
   for(const f of foes(e).slice(0,4))rockAt(f.x,f.y,.9,e.tm,e,bossDamage(18),'#a24dff','blade');
   for(const d of[-1,1])hwave(e.x+d*30,e.y,d,760,2.2,e.tm,e,bossDamage(16),'#b06bff');fx(e.x,cy,50,'#b06bff',520);animeT('slash',e.x,cy,'#d9b8ff',{a:-.35,r:420,d:.5});animeT('slash',e.x,cy,'#ffffff',{a:.35,r:380,d:.45})}
  if(a.t>3.4){e.vul=1.6;end(4.6)}}
 else if(k=='quake'){const r=640;e.tel={k:'ring',r,p:Math.min(1,a.t/1.4),c:'#ffb347',arm:Math.min(1,a.t/1.4)};
  if(a.t>=1.4&&!a.go){a.go=1;e.tel=null;for(const d of[-1,1]){hwave(e.x+d*30,e.y,d,620,3,e.tm,e,bossDamage(28),'#ffb347');hwave(e.x+d*30,e.y,d,430,3,e.tm,e,bossDamage(22),'#e5c28d')}
   for(let i=0;i<12;i++)rockAt(80+R()*(W-160),GY,.5+i*.16,e.tm,e,bossDamage(20),'#cbb08a');G.sh=Math.max(G.sh,22);fx(e.x,e.y,50,'#ffb347',560);animeT('ring',e.x,e.y,'#ffd9a0',{r:520,sq:.22,d:.6});e.vul=2.4}
  if(a.t>3.6)end(4.4)}
 else if(k=='harvest'){e.tel={k:'orb',x:e.x,y:cy,p:Math.min(1,a.t/1.2),c:'#9b67ef'};
  if(a.t>=1.2&&!a.go){a.go=1;e.tel=null;const n=bossProjectileCount(8,2,12);for(let i=0;i<n;i++){const an=i/n*6.283;pr({x:e.x,y:cy,vx:Math.cos(an)*260,vy:Math.sin(an)*260,dm:bossDamage(11),tm:e.tm,col:'#b48cff',src:e,t:'c',life:4.5})}
   for(const sx of[-70,70])spawnZ(Math.max(3,G.wv||3),cl(e.x+sx,30,W-30),e.y,'n',e.tm);fx(e.x,cy,50,'#9b67ef',520);animeT('star',e.x,cy,'#d9c2ff',{r:90,d:.5})}
  if(a.t>2.6)end(4.2)}
 else if(k=='thunder'){if(!a.go){a.go=1;const fs=foes(e),n=bossProjectileCount(7,2,11);for(let i=0;i<n;i++){const f=fs[i%Math.max(1,fs.length)]||t;if(f)HZ.push({k:'bolt',x:cl(f.x+(i<fs.length?0:(R()-.5)*160),40,W-40),y:f.y,wt:.7+i*.34,t:0,tm:e.tm,src:e,dm:bossDamage(20),aid:null})}}
  e.tel={k:'orb',x:e.x,y:cy,p:Math.min(1,a.t/1.2),c:'#63eaff'};if(a.t>1.3)e.tel=null;if(a.t>3.8)end(4.4)}
 else if(k=='overload'){e.tel={k:'orb',x:e.x,y:cy,p:Math.min(1,a.t/1.1),c:'#ff8a3c'};
  if(a.t>=1.1&&!a.go){a.go=1;e.tel=null;const o=spiderEye(e,0),an=x=>Math.atan2(GY-o[1],x-o[0]);
   for(let i=0;i<4;i++){const sd=i%2?1:-1,x0=e.x+sd*(80+i*40),x1=e.x+sd*(740+i*120);HZ.push({k:'beam',org:()=>spiderEye(e,i),a0:an(x0),a1:an(x1),ang:an(x0),sweep:1,tm:e.tm,src:e,dm:bossDamage(9),wt:.2,dur:1.7,w:26,c:'#ff7a3c',hit:[],tk:0,tick:.15,t:0,x:0,y:0})}
   for(let i=0;i<4;i++)spawnDrone(e.x,e.y-e.h*.6,e.tm,e,bossDamage(14),{vx:(i-1.5)*180,vy:-240,life:3,r:85});fx(e.x,cy,46,'#ff8a3c',520)}
  if(a.t>3.2)end(4.2)}}

/* ---------- мини-босс «Поглотитель» ---------- */
MINI.splice(1,0,{id:'absorber',n:'Поглотитель',c:'#9b5cff',sz:1.75,hp:700,sp:.5});
let SOUL=[];
function absorberAlive(){return ents.find(a=>a.mini=='absorber'&&a.hp>0)}
function spawnSoul(o){const ab=absorberAlive();if(!ab||o===ab||SOUL.length>44)return;SOUL.push({x:o.x,y:o.y-o.h*.6,vx:(R()-.5)*40,vy:-120-R()*50,t:0,heal:Math.max(1,Math.round(o.mh*.10)),to:ab,ph:R()*6,c:o.c||'#bfe3ff',trail:[]});if(S.soft!==1)fx(o.x,o.y-o.h*.5,6,'#d9ccff',120)}
function absorberTick(e,dt){e.abT=(e.abT??6)-dt;
 if(e.abT<=0&&!(e.abPull>0)){e.abPull=1.7;e.abT=11;TX.push({x:e.x,y:e.y-e.h-30,t:'ПОГЛОЩЕНИЕ!',l:1.2,c:'#d9b8ff',s:24});animeT('ring',e.x,e.y-e.h*.5,'#b48cff',{r:200,d:.8});animeT('lines',e.x,e.y-e.h*.5,'#d9b8ff',{r:170,d:.7,n:30})}
 if(e.abPull>0){e.abPull-=dt;for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&!o.B&&Math.hypot(o.x-e.x,o.y-e.y)<480){o.vx+=(Math.sign(e.x-o.x)||1)*1250*dt;if(R()<dt*20)PT.push({x:o.x,y:o.y-o.h*.5,vx:(e.x-o.x)*.8,vy:-20,g:0,l:.4,c:'#c9a8ff',r:2.4})}
  if(e.abPull<=0){for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&Math.hypot(o.x-e.x,o.y-o.h*.5-(e.y-e.h*.5))<130)hit(o,18,e,(Math.sign(o.x-e.x)||1)*420,0,1);fx(e.x,e.y-e.h*.5,36,'#9b5cff',460);G.sh=Math.max(G.sh,10);RG.push({x:e.x,y:e.y-e.h*.5,l:.4,big:1})}}}
function updSouls(dt){for(const s of SOUL){s.t+=dt;const ab=s.to;
  if(!ab||ab.hp<=0){s.vy-=80*dt;s.life=(s.life==null?1.1:s.life)-dt;s.x+=s.vx*dt;s.y+=s.vy*dt;continue}
  if(s.t<1.1){s.vy*=1-dt*1.7;s.vx*=1-dt*1.5;s.x+=Math.sin(s.t*7+s.ph)*22*dt}
  else{const dx=ab.x-s.x,dy=ab.y-ab.h*.6-s.y,d=Math.max(1,Math.hypot(dx,dy)),sp=(95+Math.min(75,(s.t-1.1)*50))*(ab.abPull>0?2.2:1);s.vx+=(dx/d*sp-s.vx)*Math.min(1,dt*2.6);s.vy+=(dy/d*sp-s.vy)*Math.min(1,dt*2.6)}
  s.x+=s.vx*dt;s.y+=s.vy*dt;s.trail.push(s.x,s.y);if(s.trail.length>16)s.trail.splice(0,2);
  if(Math.hypot(ab.x-s.x,ab.y-ab.h*.6-s.y)<38){ab.hp=Math.min(ab.mh,ab.hp+s.heal);TX.push({x:ab.x,y:ab.y-ab.h-8,t:'+'+s.heal,l:.7,c:'#d9b8ff'});fx(ab.x,ab.y-ab.h*.6,6,'#d9b8ff',160);s.dead=1;continue}
  for(const p of P)if(p.life>0&&p.tm!=ab.tm&&p.t!='h'&&Math.hypot(p.x-s.x,p.y-s.y)<17){if(p.t!='q')p.life=0;s.dead=1;fx(s.x,s.y,10,'#ffffff',200);TX.push({x:s.x,y:s.y-12,t:'ДУША РАЗВЕЯНА',l:.6,c:'#fff'});break}}
 SOUL=SOUL.filter(s=>!s.dead&&!(s.life<=0))}
function drawSouls(){for(const s of SOUL){const a=s.life!=null?Math.max(0,s.life):1;cx.save();cx.globalAlpha=a;
  if(s.trail.length>3){cx.globalCompositeOperation='lighter';cx.strokeStyle=s.c;cx.lineCap='round';for(let i=2;i<s.trail.length;i+=2){cx.globalAlpha=a*i/s.trail.length*.5;cx.lineWidth=2+i*.45;cx.beginPath();cx.moveTo(s.trail[i-2],s.trail[i-1]);cx.lineTo(s.trail[i],s.trail[i+1]);cx.stroke()}cx.globalAlpha=a}
  drawGlow(s.x,s.y,26,'#cfe0ff',.8*a);cx.globalCompositeOperation='source-over';cx.fillStyle='#f4f8ff';cx.beginPath();cx.ellipse(s.x,s.y,7,9,0,Math.PI,0);cx.lineTo(s.x+7,s.y+9);for(let i=0;i<3;i++)cx.quadraticCurveTo(s.x+4.5-i*4.6,s.y+4+Math.sin(G.t*9+i)*2,s.x+2.3-i*4.6,s.y+9);cx.closePath();cx.fill();cx.fillStyle='#4a3a7a';cx.beginPath();cx.arc(s.x-2.4,s.y-1,1.2,0,7);cx.arc(s.x+2.4,s.y-1,1.2,0,7);cx.fill();cx.restore()}}
function drawAbsorberAura(e){const T=G.t,x=e.x,y=e.y-e.h*.5;cx.save();cx.globalCompositeOperation='lighter';drawGlow(x,y,e.h*1.1,'#9b5cff',.35+.15*Math.sin(T*3)+(e.abPull>0?.3:0));cx.strokeStyle='#c9a8ff';cx.lineWidth=2;cx.globalAlpha=.6;for(let i=0;i<3;i++){const a=T*(1.3+i*.4)+i*2.1;cx.beginPath();cx.ellipse(x,y,e.h*.55+i*8,e.h*.3+i*4,a,0,4.2);cx.stroke()}
 if(e.abPull>0){cx.globalAlpha=.55;cx.lineWidth=3;for(let i=0;i<8;i++){const a=T*6+i*.785,r1=460-((T*500+i*70)%420);cx.beginPath();cx.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1*.6);cx.lineTo(x+Math.cos(a)*(r1-40),y+Math.sin(a)*(r1-40)*.6);cx.stroke()}}cx.restore()}

/* ---------- карта «Небесная станция» ---------- */
MP.push({n:'Небесная станция',g:['#040a22','#3f86ff'],h:'#14295e',d:'s',s:11,p:'#3b5078',t:'#9fe8ff',pl:[[40,540,150],[1090,540,150],[345,550,140],[795,550,140],[180,430,120],[980,430,120],[565,440,150],[40,320,110],[1130,320,110],[370,325,130],[780,325,130],[215,205,120],[945,205,120],[565,190,130]]});

/* ---------- раскладка платформ на большую арену: по краям, сверху и без толпы в центре ---------- */
function bigMap(m){
 const source=(m.pl||[]).map(p=>p.slice());
 const tier=y=>y>=480?0:y>=380?1:y>=250?2:3;
 const targetY=[852,706,560,414],refY=[550,440,320,205],rows=[[],[],[],[]];
 for(const p of source){
  const t=tier(p[1]),cx=cl(W/2+((p[0]+p[2]/2)-600)*1.5,88,W-88);
  const w=cl(Math.round(p[2]*1.22),108,156),y=targetY[t]+Math.round((p[1]-refY[t])*.08);
  rows[t].push({cx,y,w,t});
 }
 for(const row of rows){
  row.sort((a,b)=>a.cx-b.cx);
  let cursor=46;
  for(const p of row){p.x=Math.max(Math.round(p.cx-p.w/2),cursor);cursor=p.x+p.w+54}
  let right=row.length?row[row.length-1].x+row[row.length-1].w:0;
  if(right>W-46){const shift=right-(W-46);for(const p of row)p.x-=shift}
  if(row.length&&row[0].x<46){const shift=46-row[0].x;for(const p of row)p.x+=shift}
 }
 const platforms=rows.flat().map(p=>[Math.round(p.x),Math.round(p.y),p.w]);
 const addStep=(cx,y,w=88)=>{
  const offsets=[0,-92,92,-166,166,-238,238,-310,310];
  for(const off of offsets){
   const x=cl(Math.round(cx+off-w/2),42,W-42-w),center=x+w/2,yy=Math.round(y);
   const blocked=platforms.some(p=>Math.abs(p[1]-yy)<32&&center-w/2<p[0]+p[2]+25&&center+w/2>p[0]-25);
   if(blocked)continue;
   platforms.push([x,yy,w]);
   return true;
  }
  return false;
 };
 const bottom=rows[0].slice().sort((a,b)=>Math.abs(a.cx-W/2)-Math.abs(b.cx-W/2));
 for(const p of bottom.slice(0,Math.min(2,bottom.length)))addStep(p.cx+(p.cx<W/2?68:-68),934,86);
 if(!platforms.some(p=>Math.abs(p[1]-934)<28&&Math.abs(p[0]+p[2]/2-W/2)<150))addStep(W/2,934,86);
 for(let t=0;t<3;t++){
  const lower=rows[t],upper=rows[t+1];
  if(!lower.length||!upper.length)continue;
  for(const a of lower){
   const b=upper.reduce((best,p)=>Math.abs(p.cx-a.cx)<Math.abs(best.cx-a.cx)?p:best,upper[0]);
   const dx=b.cx-a.cx,dy=b.y-a.y;
   const steps=Math.max(1,Math.ceil(Math.abs(dx)/190)-1,Math.ceil(Math.abs(dy)/96)-1);
   for(let j=1;j<=steps;j++){
    const f=j/(steps+1),x=a.cx+dx*f,y=a.y+dy*f;
    addStep(x,y,82+(m.s%3)*4);
   }
  }
  const centralA=lower.reduce((best,p)=>Math.abs(p.cx-W/2)<Math.abs(best.cx-W/2)?p:best,lower[0]);
  const centralB=upper.reduce((best,p)=>Math.abs(p.cx-W/2)<Math.abs(best.cx-W/2)?p:best,upper[0]);
  addStep((centralA.cx+centralB.cx)/2,(centralA.y+centralB.y)/2,92);
 }
 m.pl=platforms;
}
