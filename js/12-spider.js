/* ===================================================================
   v2.7 — БОСС «МЕХАНО-ПАУК»
   цепляется за платформы · лазеры из глаз · рой дронов
   на 50% HP сбрасывает броню: быстрее, шустрее, прыгает
   =================================================================== */
BOSS_TYPES.push({id:'spider',n:'Механо-паук',hp:1320,size:2,speed:.62,near:230,far:420,first:3.2,atk:['lasers','drones','sweep','cling','pounce'],w:132,h:80,arm:300});
Object.assign(ATKN,{lasers:'ГЛАЗНЫЕ ЛАЗЕРЫ',drones:'РОЙ ДРОНОВ',sweep:'ЛАЗЕРНАЯ РАЗВЁРТКА',cling:'ЗАХВАТ ПЛАТФОРМЫ',pounce:'ПРЫЖОК ПАУКА'});
Object.assign(PREF,{lasers:0,drones:0,sweep:1,cling:0,pounce:2});
const SP_EYES=[[46,-58],[52,-50],[41,-47],[47,-65]];
function spiderPt(e,lx,ly){const hang=!!(e.hang||e.clingTr);return[e.x+e.f*lx,hang?e.y-e.h-ly:e.y+ly]}
function spiderEye(e,i){const E=SP_EYES[i%SP_EYES.length];return spiderPt(e,E[0],E[1])}
function spiderCan(e,k){if(e.clingTr)return false;if(k=='pounce')return !!e.shed&&!e.hang;if(k=='cling')return !e.hang;return true}
function spiderTick(e,dt){
 if(e.hp<=0){e.hang=null;e.clingTr=null;return}
 if(!e.shed&&e.hp<=e.mh*.5){e.shed=1;e.arm=0;e.armM=0;e.atk=null;e.tel=null;e.bt=1.1;e.vul=1.2;G.sh=Math.max(G.sh,20);G.fl=.5;
  for(let i=0;i<16;i++)PT.push({x:e.x+(R()-.5)*120,y:e.y-e.h*.8,vx:(R()-.5)*620,vy:-200-R()*420,g:1000,l:1.3,c:i%3?'#9aa4b8':'#cbd2df',r:5+R()*3});
  cutIn('БРОНЯ СБРОШЕНА','ФАЗА 2 · ПАУК РАЗГОНЯЕТСЯ','#ffb35a');fx(e.x,e.y-e.h*.6,40,'#ff9a3c',520);TX.push({x:e.x,y:e.y-e.h-34,t:'БРОНЯ СБРОШЕНА! ПАУК РАЗГОНЯЕТСЯ',l:2,c:'#ffb35a'})}
 if(e.hang){e.hang.t-=dt;e.rushCd=Math.max(e.rushCd||0,1.5);if(e.hang.t<=0)spiderDrop(e)}
 else if(e.clingTr)e.rushCd=Math.max(e.rushCd||0,1.5)}
function spiderDrop(e){e.hang=null;e.vy=80;e.og=0;e.slam=.06;TX.push({x:e.x,y:e.y-e.h-20,t:'ПАДЕНИЕ!',l:.8,c:'#ffb35a'})}
function spiderPhys(e,dt){
 if(e.hp<=0){e.hang=null;e.clingTr=null;return false}
 if(e.clingTr){const c=e.clingTr;c.t+=dt;const k=Math.min(1,c.t/c.dur),s=k*k*(3-2*k);
  e.x=c.sx+(c.tx-c.sx)*s;e.y=c.sy+(c.ty-c.sy)*s-Math.sin(k*Math.PI)*c.arc;e.vx=e.vy=0;e.og=0;e.ph+=dt*9;
  if(R()<dt*50)PT.push({x:e.x,y:e.y-e.h*.5,vx:(R()-.5)*40,vy:20,g:0,l:.4,c:'#e8f1ff',r:2});
  if(k>=1){e.clingTr=null;e.hang={y:c.py,x0:c.x0,x1:c.x1,t:c.hold};G.sh=Math.max(G.sh,8);fx(e.x,c.py+6,16,'#cbd2df',260)}
  return true}
 if(e.hang){const h=e.hang,lo=h.x0+30,hi=h.x1-30;e.x=hi>lo?cl(e.x+e.vx*dt,lo,hi):(h.x0+h.x1)/2;e.y=h.y+e.h;e.vy=0;e.og=0;e.ph+=Math.abs(e.vx)*dt*.07;return true}
 return false}

function atkSpider(e,a,t,rage){const k=a.k,sh=!!e.shed,end=d=>{e.atk=null;e.tel=null;e.bt=d},hang=!!e.hang;
 if(k=='lasers'){
  if(!a.d){a.d=1;const n=Math.min(5,2+(sh?1:0)+bossLevelExtra(4,2));
   for(let i=0;i<n;i++)HZ.push({k:'beam',org:()=>spiderEye(e,i),track:t,off:(i-(n-1)/2)*.2,a0:0,ang:null,tm:e.tm,src:e,dm:bossDamage(15),wt:.95,dur:.45,w:22,c:'#ff5a3c',hit:[],tk:0,tick:.1,t:0,x:0,y:0})}
  if(a.t>1.9)end(sh?1.5:2.6)}
 else if(k=='sweep'){
  if(!a.d){a.d=1;const side=Math.sign(t.x-e.x)||e.f,o=spiderEye(e,0),an=x=>Math.atan2(GY-o[1],x-o[0]);let a0=an(e.x+side*90),a1=an(e.x+side*680);if(R()<.5){const q=a0;a0=a1;a1=q}
   HZ.push({k:'beam',org:()=>spiderEye(e,0),a0,a1,ang:a0,sweep:1,tm:e.tm,src:e,dm:bossDamage(8),wt:.9,dur:1.5,w:26,c:'#ff7a3c',hit:[],tk:0,tick:.16,t:0,x:0,y:0})}
  if(a.t>2.6)end(sh?1.6:2.8)}
 else if(k=='drones'){const p=spiderPt(e,-24,-58);e.tel={k:'orb',x:p[0],y:p[1],p:Math.min(1,a.t/.8),c:'#ff8a3c'};
  if(a.t>=.8&&!a.go){a.go=1;e.tel=null;const alive=DR.filter(d=>d.tm==e.tm).length,n=Math.min(Math.max(0,8-alive),2+(sh?2:0)+bossLevelExtra(3,3)),base=hang?Math.PI/2:-Math.PI/2;
   for(let i=0;i<n;i++){const an=base+(i-(n-1)/2)*.55;spawnDrone(p[0],p[1],e.tm,e,bossDamage(14),{vx:Math.cos(an)*260,vy:Math.sin(an)*260,life:3,r:85})}
   fx(p[0],p[1],26,'#ff8a3c',340);G.sh=Math.max(G.sh,6)}
  if(a.t>1.2)end(sh?1.8:3)}
 else if(k=='cling'){
  if(!a.pl){const cand=M.pl.filter(p=>!p[3]&&p[1]>=690&&p[2]>=110&&Math.abs(p[0]+p[2]/2-e.x)>60).sort((x,y)=>Math.abs(x[0]+x[2]/2-t.x)-Math.abs(y[0]+y[2]/2-t.x));
   if(!cand.length){end(1.5);return}a.pl=cand[0];a.ax=cl(t.x,a.pl[0]+45,a.pl[0]+a.pl[2]-45)}
  const p=a.pl;
  if(!a.go){e.tel={k:'spot',x:a.ax,y:p[1]+4,p:Math.min(1,a.t/.9),c:'#ff8a3c'};
   if(a.t>=.9){a.go=1;e.tel=null;e.clingTr={sx:e.x,sy:e.y,tx:a.ax,ty:p[1]+17+e.h,arc:200,dur:.7,t:0,py:p[1]+17,x0:p[0],x1:p[0]+p[2],hold:sh?4.2:5.5};TX.push({x:e.x,y:e.y-e.h-20,t:'ЗАХВАТ ПЛАТФОРМЫ',l:.8,c:'#ffb35a'})}}
  if(a.t>1.9)end(1.2)}
 else if(k=='pounce'){
  if(a.x==null)a.x=t.x;
  if(!a.air){e.tel={k:'spot',x:a.x,y:e.y,p:Math.min(1,a.t),c:'#ff5a3c'};if(a.t>=.8&&e.og){a.air=1;a.t=0;e.tel=null;e.vy=-940;e.slam=.7;fx(e.x,e.y,18,'#e5c28d',260)}}
  else{if(!e.og)e.vx=cl((a.x-e.x)*1.4,-640,640);if((a.t>.5&&e.og)||a.t>2.2)end(1.6)}}}
ATK.spider=atkSpider;

/* ---------- отрисовка ---------- */
function drawSpiderBoss(e){
 const T=G.t,dead=e.hp<=0,fl=e.fl>0,hang=!!(e.hang||e.clingTr),sh=!!e.shed,arm=e.arm>0&&!sh,C=a=>dead?'#a02a2f':fl?'#ffffff':a,ink='#0b0d17';
 cx.save();
 if(!dead&&!hang)cx.drawImage(shSpr(),e.x-96,e.y-9,192,18);
 if(e.clingTr){cx.strokeStyle='#e8f1ff';cx.lineWidth=2;cx.globalAlpha=.8;cx.beginPath();cx.moveTo(e.x,e.y-e.h*.5);cx.lineTo(e.clingTr.tx,e.clingTr.py);cx.stroke();cx.globalAlpha=1}
 cx.translate(e.x,hang?e.y-e.h:e.y);
 if(dead){cx.rotate(e.dk*Math.min(1,(1-e.dd/1.3)*2.4)*1.5);cx.globalAlpha=Math.min(1,e.dd*3)}
 cx.scale(e.f,hang?-1:1);cx.lineJoin='round';cx.lineCap='round';
 const walk=Math.abs(e.vx)>10,ph=e.ph*1.1,sway=Math.sin(T*2)*1.5;
 const leg=(j,far)=>{const hx=[-34,-12,12,34][j]+(far?3:0),hy=-48+(far?-4:0),rest=[-122,-64,64,124][j]+(far?10:0),sp=ph+j*1.57+(far?3.14:0),
   fx_=rest+(walk?Math.sin(sp)*18:0),fy=walk?-Math.max(0,Math.cos(sp))*18:0,dx=fx_-hx,dy=fy-hy,d0=Math.hypot(dx,dy),L1=70,L2=84,d=cl(d0,24,L1+L2-3),a=(L1*L1-L2*L2+d*d)/(2*d),hh=Math.sqrt(Math.max(0,L1*L1-a*a)),ux=dx/(d0||1),uy=dy/(d0||1);
   let px=uy,py=-ux;if(py>0){px=-px;py=-py}
   const kx=hx+ux*a+px*hh,ky=hy+uy*a+py*hh,col=C(far?(sh?'#2a2f3d':'#3a4158'):(sh?'#3a4150':'#59647d'));
   cx.beginPath();cx.moveTo(hx,hy);cx.lineTo(kx,ky);cx.lineTo(fx_,fy);cx.strokeStyle=ink;cx.lineWidth=12;cx.stroke();cx.strokeStyle=col;cx.lineWidth=7.5;cx.stroke();
   if(!far){cx.strokeStyle=mix(col.length==7?col:'#59647d',1,.4);cx.lineWidth=2;cx.beginPath();cx.moveTo(hx,hy-2);cx.lineTo(kx,ky-2);cx.stroke()}
   cx.fillStyle=C(sh?'#ff9a3c':'#8b95ad');cx.beginPath();cx.arc(kx,ky,far?4.5:6,0,7);cx.fill();cx.lineWidth=2;cx.strokeStyle=ink;cx.stroke();
   cx.fillStyle=ink;cx.beginPath();cx.moveTo(fx_-4,fy-3);cx.lineTo(fx_+1,fy+3);cx.lineTo(fx_+5,fy-3);cx.closePath();cx.fill()};
 for(let j=0;j<4;j++)leg(j,1);
 // брюшко
 const abd=C(sh?'#2f3546':'#4f5a78'),core=.55+.45*Math.sin(T*5);
 cx.beginPath();cx.ellipse(-26,-56+sway*.4,44,34,0,0,7);cx.fillStyle=abd;cx.fill();cx.lineWidth=3;cx.strokeStyle=ink;cx.stroke();
 cx.fillStyle=C(sh?'#1f2433':'#39425c');for(let i=0;i<4;i++){cx.beginPath();cx.ellipse(-26-26+i*17,-56,3,24,0,0,7);cx.fill()}
 const cg=cx.createRadialGradient(-26,-54,2,-26,-54,sh?26:18);cg.addColorStop(0,sh?'#fff3c0':'#e0ffff');cg.addColorStop(.4,sh?`rgba(255,140,50,${core})`:`rgba(90,220,255,${core*.7})`);cg.addColorStop(1,'rgba(255,100,40,0)');cx.fillStyle=cg;cx.beginPath();cx.arc(-26,-54,sh?26:18,0,7);cx.fill();
 const bay=e.atk&&e.atk.k=='drones';rr(-46,-24,34,9,bay?'#ff8a3c':'#171b28',cx,3);
 if(arm){cx.beginPath();cx.ellipse(-26,-62,40,25,-.08,Math.PI,0);cx.closePath();cx.fillStyle=C('#97a3bf');cx.fill();cx.lineWidth=3;cx.strokeStyle=ink;cx.stroke();cx.strokeStyle=C('#6b7690');cx.lineWidth=2;for(let i=0;i<3;i++){cx.beginPath();cx.moveTo(-50+i*18,-62);cx.lineTo(-47+i*18,-84);cx.stroke()}cx.fillStyle='#e6ecf8';for(let i=0;i<4;i++){cx.beginPath();cx.arc(-58+i*18,-70,1.6,0,7);cx.fill()}}
 else if(!dead){cx.strokeStyle=sh?'#ff9a3c':'#5aa0ff';cx.lineWidth=2;cx.globalAlpha=.7;cx.beginPath();cx.moveTo(-60,-66);cx.lineTo(-40,-78);cx.lineTo(-18,-70);cx.moveTo(-60,-50);cx.lineTo(-36,-40);cx.stroke();cx.globalAlpha=1}
 // шея и голова
 cx.fillStyle=C(sh?'#2f3546':'#59647d');cx.beginPath();cx.arc(4,-54,11,0,7);cx.fill();cx.stroke();
 cx.beginPath();cx.ellipse(31,-52,29,25,0,0,7);cx.fillStyle=C(sh?'#3a4150':'#5d6a89');cx.fill();cx.lineWidth=3;cx.strokeStyle=ink;cx.stroke();
 if(arm){cx.beginPath();cx.ellipse(31,-56,26,18,0,Math.PI*1.05,Math.PI*1.95);cx.closePath();cx.fillStyle=C('#a6b2cc');cx.fill();cx.stroke()}
 cx.fillStyle=C('#171b28');for(const s of[-1,1]){cx.beginPath();cx.moveTo(52,-40+s*3);cx.lineTo(62,-33+s*6);cx.lineTo(53,-35+s*2);cx.closePath();cx.fill()}
 cx.strokeStyle=ink;cx.lineWidth=3;cx.beginPath();cx.moveTo(30,-76);cx.lineTo(40,-94);cx.stroke();cx.fillStyle=Math.sin(T*8)>0?'#ff5a3c':'#5a1a14';cx.beginPath();cx.arc(40,-94,3.2,0,7);cx.fill();
 // глаза
 if(!dead){const chg=e.atk&&(e.atk.k=='lasers'||e.atk.k=='sweep'),pul=chg?1+.5*Math.sin(T*30):1;
  for(let i=0;i<SP_EYES.length;i++){const E=SP_EYES[i],r=(i<2?5:3.4)*pul,col=sh?'255,178,74':'255,60,60';
   const g=cx.createRadialGradient(E[0],E[1],0,E[0],E[1],r*3);g.addColorStop(0,`rgba(${col},.9)`);g.addColorStop(1,`rgba(${col},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(E[0],E[1],r*3,0,7);cx.fill();
   cx.fillStyle='#fff';cx.beginPath();cx.arc(E[0],E[1],r*.55,0,7);cx.fill()}}
 for(let j=0;j<4;j++)leg(j,0);
 cx.restore();if(!dead&&e.tel)drawTel(e)}
