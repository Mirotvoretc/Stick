/* ===================================================================
   v2.7 — НОВЫЕ СИСТЕМЫ
   константы · цепная молния · турели · барьер штурмовика · дроны
   падающие предметы (бочки, генераторы) · интерактивные платформы
   лучи и грозовые удары · настройки
   =================================================================== */
const GSPD=.8;            // все сущности медленнее на 20%
const TS=.35,TSC=.315;    // временной излучатель: скорость x0.35 (замедление на 65%), перезарядка x0.315
const SLIME_WEAK=.6;      // слизь слабее на 40%
const SLIME_NEED=250;     // убийств зомби для открытия Слизи
const PERF={ema:.0167,res:1,low:0,cool:4,downs:0,fps:60,fc:0,ft:0,ok:0};
let OB=[],DR=[],DY={pl:[],pads:[],tp:[]};
const FXQ=()=>(S.soft||PERF.low||S.gfx==2)?.55:1;
function credOf(s){if(!s)return s;if(s.ownerSlime)return s.ownerSlime;if(s.isTur&&s.src)return s.src;return s}
function tsAt(x,y,tm){const f=G.timeField;if(!f||f.tm==tm)return 1;return Math.hypot(x-f.x,y-f.y)<(f.radius||360)?TS:1}

/* ---------- сохранение настроек ---------- */
function loadS(){try{const v=JSON.parse(localStorage.getItem('sa_settings')||'null');if(!v)return;
 for(const k of['mode','rounds','t3','swap','soft','ix','props','boss','fps','gfx','chaos'])if(v[k]!=null)S[k]=v[k];
 if(!MD[S.mode])S.mode='duel';
 if(Array.isArray(v.maps)){const m=v.maps.filter(i=>MP[i]);if(m.length)S.maps=m}
 if(Array.isArray(v.p))v.p.forEach((q,i)=>{if(!S.p[i]||!q)return;if(q.c!=null&&COL[q.c])S.p[i].c=q.c;if(q.ch!=null&&CH[q.ch])S.p[i].ch=q.ch;if(q.k)Object.assign(S.p[i].k,q.k)})}catch(e){}}
function saveS(){try{localStorage.setItem('sa_settings',JSON.stringify({mode:S.mode,rounds:S.rounds,t3:S.t3,swap:S.swap|0,soft:S.soft,ix:S.ix,props:S.props,boss:S.boss,fps:S.fps,gfx:S.gfx,chaos:S.chaos,maps:S.maps,p:S.p.map(p=>({c:p.c,ch:p.ch,k:p.k}))}))}catch(e){}}

/* ---------- ЦЕПНАЯ МОЛНИЯ: минимум 4 цели, при убийстве перескакивает дальше ---------- */
function chainBolt(src,first,dm,aid,o){o=o||{};
 const tm=src.tm,range=o.range||210,fall=o.fall||.82,kx=o.kx||0,col=o.c||'#63eaff';let left=Math.max(4,o.n||4);
 let ox=o.ox,oy=o.oy;if(ox==null){ox=src.x;oy=src.y-(src.h||40)*.6}
 const done=[first];let tgt=first,d=dm,bonus=0;
 for(let g=0;g<16&&tgt;g++){
  const tx=tgt.x,ty=tgt.y-tgt.h*.5,hp0=tgt.hp;
  ZP.push({x1:ox,y1:oy,x2:tx,y2:ty,life:g?.2:.26,c:g?'#d6fbff':col});
  hit(tgt,Math.max(1,Math.round(d)),src,(Math.sign(tx-ox)||1)*kx,0,0,aid);
  fx(tx,ty,g?6:12,col,240);left--;
  if(tgt.hp<=0&&hp0>0&&bonus<3){bonus++;left++}          // убил цель — молния бьёт ещё одну рядом
  if(left<=0)break;
  let nx=null,bd=range;
  for(const q of ents){if(q.hp<=0||q.tm==tm||q.bat>0||done.includes(q))continue;const dd=Math.hypot(q.x-tx,q.y-q.h*.5-ty);if(dd<bd){bd=dd;nx=q}}
  if(!nx)break;done.push(nx);ox=tx;oy=ty;tgt=nx;d*=fall}
 G.sh=Math.max(G.sh,5);return done.length}
function teslaFire(e,dm,aid){
 const sx=e.x+e.f*24*e.sz,sy=e.y-38*e.sz;let first=null,best=1e9;
 for(const o of ents){if(o.hp<=0||o.tm==e.tm||o.bat>0)continue;const dx=o.x-sx,dy=o.y-o.h*.5-sy,d=Math.hypot(dx,dy);if(dx*e.f>0&&d<560&&Math.abs(dy)<170&&d<best){best=d;first=o}}
 if(!first){spark(sx,sy,16,'#63eaff');return}
 chainBolt(e,first,dm,aid,{ox:sx,oy:sy,n:4,range:210,kx:220})}
function eDischarge(o){o.boomed=1;let f=null,bd=300;for(const q of ents){if(q.hp<=0||q.tm==o.tm)continue;const d=Math.hypot(q.x-o.x,q.y-q.h*.5-(o.y-o.h*.5));if(d<bd){bd=d;f=q}}
 fx(o.x,o.y-o.h*.5,22,'#63eaff',360);RG.push({x:o.x,y:o.y-o.h*.5,l:.3});if(f)chainBolt(o,f,Math.max(6,o.dmg*1.5),null,{ox:o.x,oy:o.y-o.h*.6,n:4,range:230})}

/* ---------- ВЗРЫВЫ ПО ОБЛАСТИ ---------- */
function blastArea(x,y,r,dm,src,tm,aid,kx,fzT){
 for(const o of ents){if(o.hp<=0||(tm!=null&&o.tm==tm))continue;const d=Math.hypot(o.x-x,o.y-o.h*.5-y),r2=r+o.w*.5;if(d<r2){const k=1-d/r2;hit(o,Math.max(1,Math.round(dm*(.5+.5*k))),src,(Math.sign(o.x-x)||1)*kx*(.4+.6*k),fzT||0,0,aid)}}
 for(const t of TUR)if(t.hp>0&&(tm==null||t.tm!=tm)&&Math.hypot(t.x-x,t.y-18-y)<r)hitTur(t,dm*.6,src);
 for(const q of OB)if(!q.dead&&Math.hypot(q.x-x,q.y-q.h*.5-y)<r+q.w*.5)damageProp(q,dm*.9,src,aid,Math.sign(q.x-x)*300);
 for(const w of WALLS)if(w.hp>0&&(tm==null||w.tm!=tm)&&Math.abs(w.x-x)<r+96&&y>w.y-r&&y<w.bottom+r)w.hp-=Math.max(1,Math.round(dm/22))}

/* ---------- ТУРЕЛИ: прочность 100, враги атакуют, эволюция ---------- */
function mkTurret(e,power,owner){const v=e.ev||{},mh=Math.round(100*(v.tHp||1));return{x:cl(e.x+e.f*48,28,W-28),y:e.y,tm:e.tm,hp:mh,mh,cd:.2,range:620*(v.tRange||1),dmg:17*(power||1)*(v.tDm||1),rate:v.tRate||1,decM:v.tDec||1,repA:v.tRep||0,evoAdj:v.tEvo||0,angle:e.f>0?0:Math.PI,c:owner?'#8ce5ff':e.c,src:e,isTur:1,kind:'g',kills:0,w:34,h:36,fl:0,ownerSlime:owner||null,born:G.t,rep:0}}
function placeTurret(e,power,owner){for(const t of TUR)if(t.src===e&&t.hp>0)t.hp=0;TUR.push(mkTurret(e,power,owner))}   // у инженера только одна турель
function hitTur(t,d,s){if(t.hp<=0||d<=0)return;t.hp-=d;t.fl=.12;fx(t.x,t.y-18,4,'#cbd2df',150);if(R()<.6)TX.push({x:t.x+(R()-.5)*16,y:t.y-48,t:'-'+Math.round(d),l:.55,c:'#ffd0a0'})}
function turretKill(t){if(!TUR.includes(t)||t.hp<=0)return;t.kills=(t.kills||0)+1;
 if(t.kills>30+(t.evoAdj||0)&&t.kind=='g'){t.kind=R()<.5?'e':'r';t.mh=130;t.hp=t.mh;fx(t.x,t.y-20,30,t.kind=='e'?'#63eaff':'#ffb347',380);RG.push({x:t.x,y:t.y-20,l:.4,big:1});G.sh=Math.max(G.sh,8);TX.push({x:t.x,y:t.y-60,t:t.kind=='e'?'ЭВОЛЮЦИЯ: ЭЛЕКТРО-ТУРЕЛЬ!':'ЭВОЛЮЦИЯ: РАКЕТНАЯ ТУРЕЛЬ!',l:1.6,c:t.kind=='e'?'#8feeff':'#ffc170'})}}
function zTgt(e){const t=near(e),hunt=zombieCanClimb(e)?.78:.12;let best=t?verticalTargetCost(e,t,hunt):1e9,r=t;
 for(const u of TUR){if(u.tm==e.tm||u.hp<=0)continue;const d=verticalTargetCost(e,u,.08)*.72;if(d<best){best=d;r=u}}return r}
function updTurrets(dt){
 for(const t of TUR){t.cd-=dt;t.fl=Math.max(0,t.fl-dt);
  const eng=ents.some(o=>o.hp>0&&CH[o.ch].engineer&&o.tm==t.tm&&Math.hypot(o.x-t.x,o.y-o.h*.5-(t.y-18))<170);t.rep=eng?1:0;
  const dl=eng?-Math.max(.6,2*(t.decM||1)-(t.repA||0)):-5*(t.decM||1);
  t.hp=Math.min(t.mh,t.hp+dl*dt);
  if(dl>0&&R()<dt*6)PT.push({x:t.x+(R()-.5)*28,y:t.y-12,vx:0,vy:-55,g:-30,l:.6,c:'#7ee08a',r:2.2});
  let target=null,best=t.range;
  for(const o of ents){if(o.hp<=0||o.tm==t.tm||o.bat>0)continue;const d=Math.hypot(o.x-t.x,o.y-o.h*.55-(t.y-22));if(d<best){best=d;target=o}}
  if(target){const dx=target.x-t.x,dy=target.y-target.h*.55-(t.y-22);t.angle=Math.atan2(dy,dx);
   if(t.cd<=0){const d=Math.max(1,Math.hypot(dx,dy)),mx=t.x+Math.cos(t.angle)*18,my=t.y-22+Math.sin(t.angle)*18,rt=t.rate||1;
    if(t.kind=='e'){t.cd=.9/rt;chainBolt(t,target,t.dmg*.95,null,{ox:mx,oy:my,n:4,range:200,fall:.85})}
    else if(t.kind=='r'){t.cd=1.7/rt;pr({x:mx,y:my,vx:dx/d*470,vy:dy/d*470,dm:t.dmg*1.6,tm:t.tm,t:'r',col:'#ffb347',src:t,life:3})}
    else{t.cd=.42/rt;pr({x:mx,y:my,vx:dx/d*790,vy:dy/d*790,dm:t.dmg,tm:t.tm,t:'b',col:'#8ce5ff',life:1.35,src:t})}
    fx(mx,my,5,t.kind=='e'?'#63eaff':t.kind=='r'?'#ffb347':'#8ce5ff',110)}}}
 TUR=TUR.filter(t=>{if(t.hp>0)return 1;fx(t.x,t.y-14,26,'#ffb347',300);fx(t.x,t.y-14,12,'#8ce5ff',200);RG.push({x:t.x,y:t.y-14,l:.3});TX.push({x:t.x,y:t.y-52,t:'ТУРЕЛЬ РАЗРУШЕНА',l:1,c:'#ff9a6a'});return 0})}

/* ---------- БАРЬЕР ШТУРМОВИКА ---------- */
function mkWall(e){const v=e.ev||{},hp=Math.round(16*(v.wHp||1));return{x:cl(e.x,130,W-130),y:cl(e.y-142,150,GY-95),bottom:e.y,tm:e.tm,src:e,hp,max:hp,age:0,dec:v.wDec||1}}
function updWalls(dt){for(const w of WALLS){w.age+=dt;w.hp-=dt*(w.dec||1);               // прочность падает на 1 в секунду
  if(R()<dt*18)PT.push({x:w.x+(R()-.5)*190,y:w.y+R()*(w.bottom-w.y),vx:(R()-.5)*30,vy:-25,g:0,l:.35,c:'#ffcb82',r:1.5+R()*2})}
 for(const w of WALLS)if(w.hp<=0){fx(w.x,w.y+55,26,'#ffb45e',320);TX.push({x:w.x,y:w.y-20,t:'БАРЬЕР РАЗРУШЕН',l:1,c:'#ffb45e'})}
 WALLS=WALLS.filter(w=>w.hp>0)}
function blockMonsterByWalls(e,oldX,oldY){const half=e.w*.5;
 for(const w of WALLS){if(w.tm==e.tm||w.hp<=0)continue;const l=w.x-96,r=w.x+96,top=w.y,bottom=w.bottom;
  if(e.y<top-5||e.y-e.h>bottom+5)continue;
  const inside=e.x>l-half+2&&e.x<r+half-2&&e.y>top+6&&e.y-e.h<bottom;
  if(inside&&!(oldY<=top+1&&e.vy>=0)){if(e.x-(l-half)<(r+half)-e.x){e.x=l-half;if(e.vx>0)e.vx=0}else{e.x=r+half;if(e.vx<0)e.vx=0}continue}
  if(oldX+half<l&&e.x+half>=l&&e.vx>0){e.x=l-half;e.vx=0}else if(oldX-half>l&&e.x-half<=l&&e.vx<0){e.x=l+half;e.vx=0}else if(oldX+half<r&&e.x+half>=r&&e.vx>0){e.x=r-half;e.vx=0}else if(oldX-half>r&&e.x-half<=r&&e.vx<0){e.x=r+half;e.vx=0}
  if(e.x>l-half&&e.x<r+half&&oldY<=top&&e.y>=top&&e.vy>0){e.y=top;e.vy=0;e._onwall=1}}}
function wallHurt(w,d){w.hp-=d;fx(w.x+(R()-.5)*180,w.y+R()*(w.bottom-w.y),6,'#9cecff',170)}
function wallAttack(e,dmg){const half=e.w*.5;for(const w of WALLS){if(w.tm==e.tm||w.hp<=0)continue;const l=w.x-96,r=w.x+96;if(e.y<w.y-5||e.y-e.h>w.bottom+5)continue;
  if((e.f>0&&Math.abs(e.x+half-l)<14)||(e.f<0&&Math.abs(e.x-half-r)<14)){wallHurt(w,dmg);TX.push({x:e.x+e.f*30,y:e.y-e.h*.6,t:'-'+dmg,l:.5,c:'#ffb45e'});return true}}return false}
function wallMelee(e,reach,dmg){let h=0;for(const w of WALLS){if(w.tm==e.tm||w.hp<=0||e.y<w.y-10||e.y-e.h>w.bottom+10)continue;const l=w.x-96,r=w.x+96,fx0=e.x+e.f*reach;if(e.f>0?(e.x<r&&fx0>l-20):(e.x>l&&fx0<r+20)){wallHurt(w,dmg);h++}}return h}
function wallLimit(x,y,f,tm,dmg){let best=null;for(const w of WALLS){if(w.tm==tm||w.hp<=0||y<w.y||y>w.bottom)continue;const l=w.x-96,r=w.x+96,edge=f>0?l:r;if((edge-x)*f>0&&(best==null||(edge-best.e)*f<0))best={e:edge,w}}if(best){wallHurt(best.w,dmg||2);return best.e}return null}
function blockEnemyBeam(x1,y1,x2,y2,tm){for(const w of WALLS){if(w.hp<=0||(tm!=null&&w.tm==tm))continue;const l=w.x-96,r=w.x+96,top=w.y,bottom=w.bottom;const edges=[[l,top,l,bottom],[r,top,r,bottom],[l,top,r,top]];
  for(const[ax,ay,bx,by]of edges){const den=(x1-x2)*(ay-by)-(y1-y2)*(ax-bx);if(Math.abs(den)<.0001)continue;const t=((x1-ax)*(ay-by)-(y1-ay)*(ax-bx))/den,u=-((x1-x2)*(y1-ay)-(y1-y2)*(x1-ax))/den;if(t>=0&&t<=1&&u>=0&&u<=1){wallHurt(w,2);fx(ax,ay,8,'#9cecff',180);return true}}}return false}
function blockEnemyProjectile(p,oldX,oldY){if(p.t=='h')return false;
 for(const w of WALLS){if(w.hp<=0||w.tm==p.tm)continue;const l=w.x-96,r=w.x+96,top=w.y,bottom=w.bottom;let b=false;
  if(((oldX<l&&p.x>=l)||(oldX>l&&p.x<=l))&&p.y>=top-4&&p.y<=bottom+4)b=true;
  else if(((oldX<r&&p.x>=r)||(oldX>r&&p.x<=r))&&p.y>=top-4&&p.y<=bottom+4)b=true;
  else if(((oldY<top&&p.y>=top)||(oldY>top&&p.y<=top))&&p.x>=l&&p.x<=r)b=true;
  if(b){wallHurt(w,(p.t=='r'||p.t=='g'||p.t=='z'||p.big)?3:1);p.life=0;fx(p.x,p.y,8,'#9cecff',190);return true}}return false}

/* ---------- ДРОНЫ (босс-паук и «Рой дронов») ---------- */
function spawnDrone(x,y,tm,src,dm,o){o=o||{};DR.push({x,y,vx:o.vx||0,vy:o.vy==null?-160:o.vy,tm,src,dm,life:o.life||3,r:o.r||85,hp:1,ph:R()*6,age:0,col:o.col||'#ff5a4a',aid:o.aid})}
function droneBoom(d){fx(d.x,d.y,26,d.col,380);fx(d.x,d.y,12,'#ffe9a8',300);RG.push({x:d.x,y:d.y,l:.32});G.sh=Math.max(G.sh,6);
 blastArea(d.x,d.y,d.r,d.dm,d.src,d.tm,d.aid,300)}
function updDR(dt0){
 for(const d of DR){const dt=dt0*tsAt(d.x,d.y,d.tm);d.age+=dt;d.life-=dt;
  let tg=null,bd=1e9;for(const o of ents)if(o.hp>0&&o.tm!=d.tm&&!(o.bat>0)){const q=Math.hypot(o.x-d.x,o.y-o.h*.5-d.y);if(q<bd){bd=q;tg=o}}
  if(tg&&d.age>.3){const dx=tg.x-d.x,dy=tg.y-tg.h*.5-d.y,m=Math.max(1,Math.hypot(dx,dy));d.vx+=dx/m*620*dt;d.vy+=dy/m*620*dt+Math.sin(d.age*10+d.ph)*40*dt;const sp=Math.hypot(d.vx,d.vy);if(sp>310){d.vx*=310/sp;d.vy*=310/sp}}
  else{d.vx*=1-dt*1.4;d.vy*=1-dt*1.4}
  d.x=cl(d.x+d.vx*dt,10,W-10);d.y=cl(d.y+d.vy*dt,20,GY-10);
  if(R()<dt*40)PT.push({x:d.x,y:d.y,vx:(R()-.5)*30,vy:(R()-.5)*30,g:0,l:.3,c:'#ff9a5a',r:1.6});
  if(d.age>.25)for(const o of ents)if(o.hp>0&&o.tm!=d.tm&&!(o.bat>0)&&Math.abs(o.x-d.x)<o.w/2+13&&d.y>o.y-o.h-10&&d.y<o.y+8){d.life=0;break}
  if(d.life>0)for(const p of P)if(p.life>0&&p.tm!=d.tm&&p.t!='f'&&p.t!='h'&&Math.hypot(p.x-d.x,p.y-d.y)<18){if(p.t!='q')p.life=0;d.shot=1;break}}
 DR=DR.filter(d=>{if(d.shot){fx(d.x,d.y,12,'#cbd2df',260);spark(d.x,d.y,8,'#ffd37a');TX.push({x:d.x,y:d.y-16,t:'СБИТ',l:.6,c:'#cbd2df'});return 0}if(d.life>0)return 1;droneBoom(d);return 0})}

/* ---------- ЛУЧИ БОССА (HZ) И ГРОЗОВЫЕ УДАРЫ ---------- */
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy||1;let t=((px-x1)*dx+(py-y1)*dy)/l2;t=cl(t,0,1);return Math.hypot(px-(x1+dx*t),py-(y1+dy*t))}
function hzBeam(h,dt){
 const o=h.org();h.ox=o[0];h.oy=o[1];
 if(h.t<h.wt){if(h.track&&h.track.hp>0&&h.t<h.wt-.28)h.ang=Math.atan2(h.track.y-h.track.h*.5-h.oy,h.track.x-h.ox)+(h.off||0);if(h.ang==null)h.ang=h.a0}
 else{if(h.sweep){const k=cl((h.t-h.wt)/h.dur,0,1);h.ang=h.a0+(h.a1-h.a0)*k}}
 const sn=Math.sin(h.ang),cs=Math.cos(h.ang);let L=2600;if(sn>.03)L=Math.min(L,(GY-h.oy)/sn);h.len=Math.max(40,L);
 h.ex=h.ox+cs*h.len;h.ey=h.oy+sn*h.len;
 if(h.t>=h.wt){
  if(!h.chk){h.chk=1;h.blocked=blockEnemyBeam(h.ox,h.oy,h.ex,h.ey,h.tm);G.sh=Math.max(G.sh,6);if(h.blocked)TX.push({x:h.ox,y:h.oy+30,t:'БЛОК',l:.6,c:'#8eeeff'})}
  h.tk-=dt;
  if(!h.blocked&&h.tk<=0){h.tk=h.tick||.12;
   for(const e of ents){if(e.hp<=0||e.tm==h.tm)continue;if(!h.sweep&&h.hit.includes(e))continue;
    const r=h.w/2+e.w/2,px=e.x;if(Math.min(segDist(px,e.y-e.h*.5,h.ox,h.oy,h.ex,h.ey),segDist(px,e.y-6,h.ox,h.oy,h.ex,h.ey),segDist(px,e.y-e.h+6,h.ox,h.oy,h.ex,h.ey))<r){h.hit.push(e);hit(e,h.dm,h.src,Math.sign(cs)*60,0,1,h.aid)}}
   for(const t of TUR)if(t.hp>0&&t.tm!=h.tm&&segDist(t.x,t.y-18,h.ox,h.oy,h.ex,h.ey)<h.w/2+18)hitTur(t,h.dm*.5,h.src)}
  if(R()<dt*60)PT.push({x:h.ex+(R()-.5)*30,y:h.ey+(R()-.5)*10,vx:(R()-.5)*260,vy:-R()*220,g:600,l:.4,c:h.c,r:2+R()*2})}
 if(h.t>h.wt+h.dur)h.dead=1}
function hzBolt(h,dt){if(h.t<h.wt||h.done)return;h.done=1;h.dead=1;
 let f=null,bd=130;for(const q of ents){if(q.hp<=0||q.tm==h.tm||q.bat>0)continue;const d=Math.hypot(q.x-h.x,q.y-q.h*.5-(h.y-30));if(d<bd){bd=d;f=q}}
 const sx=h.x+(R()-.5)*60,sy=-80;
 for(let i=0;i<2;i++)ZP.push({x1:sx,y1:sy,x2:h.x,y2:h.y-24,life:.32,c:i?'#ffffff':'#9ad7ff'});
 fx(h.x,h.y-20,24,'#9ad7ff',420);RG.push({x:h.x,y:h.y-10,l:.4,big:1});G.sh=Math.max(G.sh,10);
 if(f)chainBolt(h.src,f,h.dm,h.aid,{ox:h.x,oy:h.y-30,n:4,range:230,c:'#9ad7ff'});else spark(h.x,h.y-20,14,'#9ad7ff')}

/* ---------- ПАДАЮЩИЕ ПРЕДМЕТЫ: бочки, генераторы, баллоны, мины ---------- */
const OBT={barrel:{n:'Бензобак',w:34,h:46,hp:26},gen:{n:'Генератор',w:54,h:44,hp:42},cryo:{n:'Крио-баллон',w:30,h:56,hp:22},mine:{n:'Мина',w:28,h:12,hp:1}};
function spawnProp(k,x,y,ex){const t=OBT[k],o=Object.assign({k,x,y,vx:0,vy:0,w:t.w,h:t.h,hp:t.hp,mh:t.hp,fl:0,age:0,og:0,tm:null,src:null,aid:null,dead:0,fell:0},ex||{});OB.push(o);return o}
function propDrop(){const ks=['barrel','barrel','barrel','gen','gen','cryo'];spawnProp(ks[R()*ks.length|0],120+R()*(W-240),-80,{fell:1})}
function damageProp(o,d,src,aid,kx){if(o.dead)return;o.hp-=d;o.fl=.12;if(src){o.src=credOf(src);if(aid!=null)o.aid=aid}o.vx+=(kx||0)*.25;
 fx(o.x,o.y-o.h*.5,3,'#ffe0a8',170);if(o.k=='gen'&&R()<.5)ZP.push({x1:o.x,y1:o.y-o.h,x2:o.x+(R()-.5)*60,y2:o.y-o.h-20-R()*30,life:.12,c:'#7fe8ff'});if(o.hp<=0)explodeProp(o)}
function explodeProp(o){if(o.dead)return;o.dead=1;const x=o.x,y=o.y-o.h*.5,src=o.src,tm=src&&src.tm!=null?src.tm:(o.tm!=null?o.tm:null),aid=o.aid,ztm=tm==null?-1:tm;
 if(o.k=='barrel'){fx(x,y,46,'#ff8a3a',480);fx(x,y,22,'#ffe08a',360);fx(x,y,14,'#333',220);RG.push({x,y,l:.45,big:1});G.sh=Math.max(G.sh,15);blastArea(x,y,150,72,src,tm,aid,560);const z=zone(x,o.y,115,.15,4.6,ztm,src,5,'#ff8a3a',0,aid);z.bn=1;TX.push({x,y:y-44,t:'ВЗРЫВ БЕНЗИНА!',l:.9,c:'#ffb35a'})}
 else if(o.k=='gen'){fx(x,y,36,'#7fe8ff',460);fx(x,y,18,'#fff',380);RG.push({x,y,l:.45,big:1});G.sh=Math.max(G.sh,12);blastArea(x,y,115,46,src,tm,aid,380);
  let f=null,bd=440;for(const q of ents){if(q.hp<=0||(tm!=null&&q.tm==tm))continue;const dd=Math.hypot(q.x-x,q.y-q.h*.5-y);if(dd<bd){bd=dd;f=q}}
  if(f)chainBolt(src||{tm:-1,x,y,h:30},f,38,aid,{ox:x,oy:y,n:5,range:270,c:'#7fe8ff'});zone(x,o.y,100,.1,3.4,ztm,src,4,'#7fe8ff',1,aid);TX.push({x,y:y-44,t:'ЗАМЫКАНИЕ!',l:.9,c:'#9ff0ff'})}
 else if(o.k=='cryo'){fx(x,y,40,'#bfeaff',420);fx(x,y,18,'#fff',300);RG.push({x,y,l:.45,big:1});G.sh=Math.max(G.sh,10);blastArea(x,y,165,14,src,tm,aid,260,2.6);zone(x,o.y,150,.1,4.5,ztm,src,2,'#9fe3ff',1,aid);TX.push({x,y:y-44,t:'ЗАМОРОЗКА!',l:.9,c:'#bfeaff'})}
 else{fx(x,y,30,'#ffb347',420);fx(x,y,12,'#666',200);RG.push({x,y,l:.35});G.sh=Math.max(G.sh,10);blastArea(x,y,115,o.dm||70,src,tm,aid,520)}}
function propSurface(o,py){let best=null;if(o.y>=GY)best=GY;
 if(o.vy>=0){for(const p of M.pl)if(o.x>p[0]&&o.x<p[0]+p[2]&&py<=p[1]+1&&o.y>=p[1])best=best==null?p[1]:Math.min(best,p[1]);
  for(const p of DY.pl)if(p.solid&&o.x>p.x&&o.x<p.x+p.w&&py<=p.y+5+Math.abs(p.dy)&&o.y>=p.y&&(best==null||p.y<best)){best=p.y;o.stand=p}}return best}
function propHit(p){for(const o of OB){if(o.dead||(o.k=='mine'&&o.tm==p.tm))continue;
  if(Math.abs(p.x-o.x)<o.w/2+4&&p.y>o.y-o.h-4&&p.y<o.y+2){damageProp(o,p.dm*(p.t=='f'?1.6:1),p.src,p.aid,Math.sign(p.vx)*80);if(p.t=='q')p.returning=1;else if(!(p.pierce>0))p.life=0;return true}}return false}
function propMelee(e,reach,rn,dm){let n=0;for(const o of OB){if(o.dead||(o.k=='mine'&&o.tm==e.tm))continue;if(Math.abs(o.x-e.x-e.f*reach)<rn+o.w/2&&o.y>e.y-100&&o.y-o.h<e.y+8){damageProp(o,dm,e,e.attackId,e.f*220);n++}}return n}
function updOB(dt){
 for(const o of OB){o.age+=dt;o.fl=Math.max(0,o.fl-dt);
  if(o.stand&&o.og&&o.stand.solid){o.x+=o.stand.dx;o.y+=o.stand.dy}
  const py=o.y;o.vy=Math.min(1100,o.vy+1500*dt);o.y+=o.vy*dt;o.x=cl(o.x+o.vx*dt,16,W-16);o.vx*=Math.max(0,1-dt*(o.og?4:.6));
  const was=o.og;o.og=0;o.stand=null;const s=propSurface(o,py);
  if(s!=null){const imp=o.vy;o.y=s;o.vy=0;o.og=1;
   if(!was&&imp>380){fx(o.x,o.y,8,'#d8c7a8',160);if(o.fell&&imp>600){G.sh=Math.max(G.sh,7);RG.push({x:o.x,y:o.y,l:.25});for(const e of ents)if(e.hp>0&&Math.abs(e.x-o.x)<o.w/2+e.w/2&&e.y>py-10&&e.y-e.h<o.y)hit(e,24,null,0,0,1);o.fell=0}}}
  if(o.k=='mine'){if(o.age>30)o.dead=1;if(o.og&&o.age>.9)for(const e of ents)if(e.hp>0&&e.tm!=o.tm&&Math.abs(e.x-o.x)<48&&Math.abs(e.y-o.y)<56){explodeProp(o);break}}
  else if(o.k=='gen'&&o.hp<o.mh*.6&&R()<dt*8)ZP.push({x1:o.x,y1:o.y-o.h,x2:o.x+(R()-.5)*50,y2:o.y-o.h-14-R()*20,life:.1,c:'#7fe8ff'});
  else if(o.k=='barrel'&&o.hp<o.mh*.6&&R()<dt*14)PT.push({x:o.x+(R()-.5)*16,y:o.y-o.h,vx:(R()-.5)*20,vy:-60,g:-20,l:.5,c:'#777',r:3})}
 OB=OB.filter(o=>!o.dead);const big=OB.filter(o=>o.k!='mine');if(big.length>5){big[0].dead=1;OB=OB.filter(o=>!o.dead)}}

/* ---------- ИНТЕРАКТИВНЫЕ ПЛАТФОРМЫ ---------- */
function buildIX(){DY={pl:[],pads:[],tp:[]};if(!S.ix)return;
 const cxo=p=>p[0]+p[2]/2;
 // платформы ЗАМЕНЯЮТСЯ: обычная платформа карты превращается в ломающуюся/движущуюся
 const conv=(p,o)=>{const i=M.pl.indexOf(p);if(i<0)return;M.pl.splice(i,1);DY.pl.push(Object.assign({solid:1,dx:0,dy:0,h:17,x:p[0],y:p[1],w:p[2],x0:p[0],y0:p[1]},o))};
 const take=(f,n)=>{const c=M.pl.filter(f).sort(()=>R()-.5),r=[];for(const p of c){if(r.length>=n)break;if(r.every(q=>Math.abs(cxo(q)-cxo(p))>260))r.push(p)}return r};
 const wide=p=>p[2]>=100;
 const n0=M.pl.length;
 for(const p of[...take(p=>wide(p)&&cxo(p)<W*.4&&p[1]<830,1),...take(p=>wide(p)&&cxo(p)>W*.6&&p[1]<830,1)])conv(p,{k:'crumble',st:0,t:0,vy:0,pop:0});
 for(const p of take(p=>wide(p)&&(cxo(p)<W*.34||cxo(p)>W*.66)&&p[1]<700,1)){const ax=Math.min(110,p[0]-6,W-p[0]-p[2]-6);if(ax>40)conv(p,{k:'move',ax,ay:0,sp:.6,ph:R()*6})}
 if(n0>=10){const pool=[()=>take(p=>wide(p)&&p[1]<520&&Math.abs(cxo(p)-W/2)<W*.32,1).forEach(p=>conv(p,{k:'crumble',st:0,t:0,vy:0,pop:0})),()=>take(p=>wide(p)&&p[1]>700&&p[1]<900&&Math.abs(cxo(p)-W/2)>380,1).forEach(p=>conv(p,{k:'move',ax:0,ay:70,sp:.5,ph:R()*6}))];pool[R()*2|0]()}
 // трамплины и конвейеры — на земле, у краёв
 for(const x of[W*.17,W*.83])DY.pads.push({k:'tramp',x,y:GY,w:100,pw:1340,a:0});
 DY.pads.push({k:'conv',x:W*.30-130,y:GY,w:260,d0:1,sp:80,dir:1},{k:'conv',x:W*.70-130,y:GY,w:260,d0:-1,sp:80,dir:-1});
 // телепорты стоят на обычных платформах и на земле
 const hi=f=>M.pl.filter(f).sort((a,b)=>a[1]-b[1])[0],L=hi(p=>wide(p)&&cxo(p)<W/2),Rr=hi(p=>wide(p)&&cxo(p)>=W/2);
 if(L&&Rr)DY.tp.push({id:0,x:cxo(L),y:L[1],c:'#c77dff'},{id:0,x:cxo(Rr),y:Rr[1],c:'#c77dff'});
 DY.tp.push({id:1,x:62,y:GY,c:'#ff9f1c'},{id:1,x:W-62,y:GY,c:'#ff9f1c'})}
function updIX(dt){if(!DY.pl.length&&!DY.pads.length)return;const T=G.t;
 for(const p of DY.pl){p.dx=0;p.dy=0;
  if(p.k=='move'){const nx=p.x0+p.ax*Math.sin(T*p.sp+p.ph),ny=p.y0+p.ay*Math.sin(T*p.sp+p.ph);p.dx=nx-p.x;p.dy=ny-p.y;p.x=nx;p.y=ny}
  else if(p.k=='crumble'){
   if(p.st==1){p.t+=dt;p.shake=(R()-.5)*3.4;if(R()<dt*26)PT.push({x:p.x+R()*p.w,y:p.y+17,vx:(R()-.5)*30,vy:20,g:500,l:.5,c:'#a89886',r:2+R()*2});if(p.t>=1.3){p.st=2;p.t=0;p.solid=0;p.vy=0;p.shake=0;fx(p.x+p.w/2,p.y+8,14,'#a89886',260)}}
   else if(p.st==2){p.t+=dt;p.vy+=1700*dt;p.y+=p.vy*dt;if(p.t>.8){p.st=3;p.t=0}}
   else if(p.st==3){p.t+=dt;if(p.t>2.5){p.st=0;p.y=p.y0;p.solid=1;p.pop=.45;fx(p.x+p.w/2,p.y,12,'#d8c7a8',220)}}
   else if(p.pop>0)p.pop-=dt}}
 for(const q of DY.pads){if(q.a>0)q.a-=dt*3;if(q.k=='conv')q.dir=q.d0*(Math.floor(T/9)%2?-1:1)}
 for(const t of DY.tp)t.ph=(t.ph||0)+dt}
function ixLand(e,px,py){for(const p of DY.pl){if(!p.solid)continue;
  if(e.x>p.x-4&&e.x<p.x+p.w+4&&py<=p.y+5+Math.abs(p.dy)&&e.y>=p.y){e.y=p.y;e.vy=0;e.og=1;e.stand=p;if(p.k=='crumble'&&p.st==0){p.st=1;p.t=0}break}}}
function ixUpd(e,dt){
 if(G.cf.wind&&!e.B&&!e.hang)e.x=cl(e.x+G.cf.wind*dt*(e.og?.55:1),14,W-14);
 e.tpc=Math.max(0,(e.tpc||0)-dt);e.tpad=Math.max(0,(e.tpad||0)-dt);
 if(e.og&&!e.B&&e.tpad<=0)for(const q of DY.pads)if(q.k=='tramp'&&Math.abs(e.x-q.x)<q.w/2&&Math.abs(e.y-q.y)<6){e.vy=-q.pw*Math.sqrt(M.gv||1);e.og=0;e.tpad=.3;q.a=1;e.vx*=1.1;fx(q.x,q.y-6,14,'#ff7a8a',260);fx(e.x,e.y,8,'#fff',160);if(e.pi!=null)G.sh=Math.max(G.sh,3);break}
 if(e.og&&!e.stand)for(const c of DY.pads)if(c.k=='conv'&&e.x>c.x&&e.x<c.x+c.w&&Math.abs(e.y-c.y)<3){e.x=cl(e.x+c.dir*c.sp*dt,14,W-14);break}
 if(e.tpc<=0&&!e.B&&DY.tp.length)for(const t of DY.tp){if(Math.abs(e.x-t.x)<24&&Math.abs(e.y-t.y)<28){const o=DY.tp.find(q=>q.id==t.id&&q!==t);if(!o)break;fx(t.x,t.y-30,16,t.c,300);e.x=o.x;e.y=o.y;e.vy=Math.min(e.vy,0);e.tpc=1.3;e.aiPlatform=null;e.navC=null;fx(o.x,o.y-30,16,o.c,300);TX.push({x:o.x,y:o.y-80,t:'ТЕЛЕПОРТ',l:.6,c:t.c});break}}}
function ixProj(p){if(!DY.tp.length||p.tpc>0)return;for(const t of DY.tp)if(Math.hypot(p.x-t.x,p.y-(t.y-30))<30){const o=DY.tp.find(q=>q.id==t.id&&q!==t);if(!o)return;p.x=o.x;p.y=o.y-30;p.tpc=.4;fx(o.x,o.y-30,6,o.c,200);return}}
