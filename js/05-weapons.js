function fire(e){const w=WP[e.wp],weaponId=e.wp,aid=typeof slimeNewAttack=='function'?slimeNewAttack(e,weaponId):null,x=e.x+e.f*22*e.sz,y=e.y-38*e.sz,crit=!!(CH[e.ch].brawler&&e.wp=='fist'&&R()<.25+((e.ev&&e.ev.crit)||0)),baseMult=CH[e.ch].slime?slimeAttackMultiplier(e):(e.rg?2:CH[e.ch].dm||1),dm=w.dm*baseMult*(e.dm||1)*(e.boost>0&&CH[e.ch].assault?1:1)*(crit?3:1);e.attackId=aid;e.cd=w.cd*(e.ev&&e.ev.cdm||1);if(crit){TX.push({x:e.x,y:e.y-e.h-24,t:'КРИТИЧЕСКИЙ УДАР!',l:1,c:'#ffd166'});fx(e.x+e.f*34,e.y-35,20,'#ffd166',280)}
 if(w.t=='k'){const swingWeapon=e.wp;e.sw=.3;let nh=0;const air=!e.og&&swingWeapon=='hamm';if(swingWeapon=='katana')e.katHits=(e.katHits||0)+1;else use(e);for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&Math.abs(o.x-e.x-e.f*(w.cx||36))<(w.rn||60)+o.w/2&&o.y>e.y-100&&o.y-o.h<e.y+8){nh++;hit(o,air?dm*1.1:dm,e,e.f*(w.kb??(swingWeapon=='hamm'?(air?1200:900):420)),0,0,aid);if(swingWeapon=='saw'&&R()<.3)bleed(o)}nh+=propMelee(e,w.cx||36,w.rn||60,dm)+wallMelee(e,(w.cx||36)+(w.rn||60),swingWeapon=='hamm'?3:1);for(const t of TUR)if(t.hp>0&&t.tm!=e.tm&&Math.abs(t.x-e.x-e.f*(w.cx||36))<(w.rn||60)+18&&Math.abs(t.y-e.y)<60){hitTur(t,dm,e);nh++}fx(e.x+e.f*46,e.y-34,12,'#fff',320);spark(e.x+e.f*46,e.y-34,8,'#fff');if(air&&nh){RG.push({x:e.x+e.f*46,y:e.y-20,l:.3});G.sh=Math.max(G.sh,10)}if(swingWeapon=='katana'&&e.katHits>=10)brk(e);return}
 if(w.t=='x'){e.rb={t:0,a:null,tk:0,aid,copyPower:baseMult*(e.dm||1)};e.wp='fist';e.am=1e9;e.copyWeaponPower=0;TX.push({x:e.x,y:e.y-e.h-20,t:'РАДУЖНЫЙ ЗАЛП!',l:1.2,c:'#ff9ae6'});return}
 if(w.t=='l'){e.chg=w.ch;e.chgAid=aid;e.chgPower=baseMult;return}
 if(w.t=='e'){teslaFire(e,dm,aid);use(e);return}
 if(w.t=='m'){e.mirror=15;fx(e.x,e.y-e.h*.5,26,'#a8e9ff',300);TX.push({x:e.x,y:e.y-e.h-20,t:'ЗЕРКАЛО · 15 СЕК',l:1.1,c:'#a8e9ff'});use(e);return}
 if(w.t=='u'){G.timeField={x:e.x,y:e.y-e.h*.5,tm:e.tm,life:10,radius:360,slow:TS,src:e};fx(e.x,e.y-e.h*.5,35,'#8b91ff',360);TX.push({x:e.x,y:e.y-e.h-20,t:'ВРЕМЯ ЗАМЕДЛЕНО',l:1.1,c:'#aeb2ff'});use(e);return}
 if(w.t=='v'){const gx=cl(e.x+e.f*215,210,W-210),gy=cl(e.y-e.h*.6-36,155,GY-120);G.gravityField={x:gx,y:gy,tm:e.tm,life:6,tot:6,max:Math.hypot(W,H)+180,dm:9999,fullMap:1,src:e,pulse:0,aid,copyPower:baseMult};fx(gx,gy,54,'#b98cff',470);fx(gx,gy,28,'#75dcff',330);TX.push({x:e.x,y:e.y-e.h-20,t:'ГРАВИТАЦИОННЫЙ КОЛЛАПС',l:1.4,c:'#e0baff'});G.sh=Math.max(G.sh,7);use(e);return}
 if(w.t=='d'){for(let i=0;i<2;i++)spawnDrone(x+e.f*8,y-4-i*6,e.tm,e,dm,{vx:e.f*(190+i*70),vy:-110-i*100,life:3,r:80,col:'#ff7a5a',aid});use(e);fx(x,y,12,'#ff9a7a',240);TX.push({x:e.x,y:e.y-e.h-18,t:'РОЙ!',l:.7,c:'#ff9a7a'});return}
 if(w.t=='t'){let tg=null,bd=820;for(const o of ents){if(o.hp<=0||o.tm==e.tm||o.bat>0)continue;const dx=o.x-e.x;if(dx*e.f<-40)continue;const d=Math.hypot(dx,o.y-e.y);if(d<bd){bd=d;tg=o}}const tx=tg?tg.x:cl(e.x+e.f*340,40,W-40),ty=tg?tg.y:e.y;HZ.push({k:'bolt',x:tx,y:ty,wt:.55,t:0,tm:e.tm,src:e,dm,aid});use(e);fx(x,y,12,'#9ad7ff',260);TX.push({x:e.x,y:e.y-e.h-18,t:'ГРОЗА',l:.7,c:'#9ad7ff'});return}
 if(w.t=='i'){const mm=spawnProp('mine',cl(e.x+e.f*30,20,W-20),e.y-6,{tm:e.tm,src:e,dm,aid,vx:e.f*170+e.vx*.4,vy:-250});const own=OB.filter(q=>q.k=='mine'&&q.src===e&&!q.dead);if(own.length>5)own[0].dead=1;use(e);fx(x,y,6,'#cfd6e6',160);return}
 e.rc=.1;fx(x,y,3,'#fff1b0',150);if(w.t=='b'&&!w.pel&&!w.pierce)PT.push({x:e.x,y:y+4,vx:-e.f*(50+R()*80),vy:-220,l:.7,c:'#d9b44a',r:2});for(let i=0;i<(w.pel||1);i++){const a=(R()-.5)*(w.sp||0)*2-(w.t=='s'?.1:w.t=='g'?.45:0);pr({x,y,vx:Math.cos(a)*w.v*e.f,vy:Math.sin(a)*w.v,dm,tm:e.tm,t:w.t,col:w.c,life:w.life||(w.t=='r'?3.6:w.t=='q'?3.2:1.6),src:e,g:w.t=='s'?600:w.t=='g'?900:w.t=='n'?250:0,fz:w.fz,aid,pierce:w.pierce,rad:w.rad})}
 e.vx-=e.f*(w.pel?240:w.t=='r'?140:0);use(e)}
function beam(e){if(!['laser','sunlance'].includes(e.wp)||e.hp<=0)return;const weapon=WP[e.wp],x=e.x+e.f*24*e.sz,y=e.y-38*e.sz,dm=weapon.dm*(CH[e.ch].slime?(e.chgPower||7/6):(e.rg?2:CH[e.ch].dm||1))*(e.dm||1)*(e.boost>0&&CH[e.ch].assault?1.12:1),lim=wallLimit(x,y,e.f,e.tm,3);BM.push({x,y,f:e.f,l:e.wp=='sunlance'?.38:.25,lim,c:weapon.c});G.sh=Math.max(G.sh,e.wp=='sunlance'?12:7);fx(x,y,14,weapon.c,360);
 const ok=px=>(px-x)*e.f>0&&(lim==null||(px-lim)*e.f<0);
 for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&ok(o.x)&&y>o.y-o.h-8&&y<o.y+4)hit(o,dm,e,e.f*380,0,0,e.chgAid);
 for(const q of OB)if(!q.dead&&ok(q.x)&&y>q.y-q.h-8&&y<q.y+4)damageProp(q,dm,e,e.chgAid,e.f*200);
 for(const t of TUR)if(t.hp>0&&t.tm!=e.tm&&ok(t.x)&&Math.abs(y-(t.y-20))<26)hitTur(t,dm,e);
 use(e);e.chgAid=null}
function boom(p){const R0=p.rad||100,small=!!p.rad,pz=p.t=='z';fx(p.x,p.y,small?18:30,pz?'#7dffb0':'#ffb347',small?300:380);fx(p.x,p.y,14,pz?'#c9ffe0':'#666',200);G.sh=Math.max(G.sh,small?7:12);RG.push({x:p.x,y:p.y,l:.3});
 for(const o of ents)if(o.hp>0&&o.tm!=p.tm){const d=Math.hypot(o.x-p.x,o.y-o.h/2-p.y),r=R0+o.w*.5;if(d<r){hit(o,p.dm*(1-d/r*.55),p.src,Math.sign(o.x-p.x)*(small?260:420),0,0,p.aid);if(pz)st(o,'sl',1.8)}}
 for(const t of TUR)if(t.hp>0&&t.tm!=p.tm&&Math.hypot(t.x-p.x,t.y-18-p.y)<R0)hitTur(t,p.dm*.5,p.src);
 for(const q of OB)if(!q.dead&&Math.hypot(q.x-p.x,q.y-q.h*.5-p.y)<R0+q.w*.5)damageProp(q,p.dm,p.src,p.aid,Math.sign(q.x-p.x)*300);
 for(const w of WALLS)if(w.hp>0&&w.tm!=p.tm&&Math.abs(w.x-p.x)<R0+96&&p.y>w.y-R0&&p.y<w.bottom+R0)wallHurt(w,2)}
function upd(e,dt){const c=CH[e.ch],I=(e.fz>0||e.stun>0)?{}:e.in;e.invuln=Math.max(0,(e.invuln||0)-dt);e.stun=Math.max(0,(e.stun||0)-dt);e.cd-=dt*(e.tslow>0?TSC:1)*(G.cf.hs||1);e.fz-=dt;e.mirror=Math.max(0,(e.mirror||0)-dt);e.tslow=Math.max(0,(e.tslow||0)-dt);e.fl-=dt;e.dr-=dt;e.sw-=dt;e.rc-=dt;e.rf-=dt;e.kc-=dt*(e.tslow>0?TSC:1)*(e.kcr||1)*(G.cf.hs||1);e.sl-=dt;e.boost=Math.max(0,(e.boost||0)-dt);{const hb=e.bat>0;e.bat=Math.max(0,(e.bat||0)-dt);if(hb&&e.bat<=0)fx(e.x,e.y-e.h/2,18,'#c1121f',260)}e.mark=Math.max(0,(e.mark||0)-dt);if(!e.z&&!e.B&&!e.cl&&e.hp>0){e.damageClock=(e.damageClock||0)+dt;const delay=(c.brawler?11:16)*(e.ev&&e.ev.regm||1);if(e.damageClock>=delay){e.regenClock=(e.regenClock||0)+dt;if(e.regenClock>=1.5){const n=Math.floor(e.regenClock/1.5);e.regenClock-=n*1.5;e.hp=Math.min(e.mh,e.hp+n);TX.push({x:e.x,y:e.y-e.h-10,t:'+'+n,l:.7,c:'#8de6a0'});fx(e.x,e.y-e.h*.55,4,'#8de6a0',100)}}}if(e.rb)rbUpd(e,dt);if(c.med&&e.hp>0){e.mt=Math.min(12,(e.mt||0)+dt);if(e.mt>=12&&e.hp<e.mh){e.mt=0;const ph=Math.round(10*(e.ev&&e.ev.pas||1));e.hp=Math.min(e.mh,e.hp+ph);TX.push({x:e.x,y:e.y-e.h-10,t:'+'+ph,l:.8,c:'#7ee08a'});fx(e.x,e.y-e.h/2,8,'#7ee08a',140)}}if(c.rage&&e.hp>0){const q=e.hp/e.mh;const rt=.45+((e.ev&&e.ev.rgT)||0);if(q>=rt)e.rgd=0;if(!e.rg&&!e.rgd&&q<rt){e.rg=1;fx(e.x,e.y-e.h/2,24,'#ff3b3b',420);G.sh=Math.max(G.sh,8);TX.push({x:e.x,y:e.y-e.h-24,t:'ЯРОСТЬ!',l:1.2,c:'#ff6b4a'})}if(e.rg){dot(e,3*dt,'#ff8a7a');if(R()<dt*30)pf(e,'#ff3b3b',-120,-50);if(e.hp<=e.mh*.2){e.rg=0;e.rgd=1}}}if(e.bn>0){e.bn-=dt;dot(e,7*dt,'#ff9a2e');if(R()<dt*30)pf(e,R()<.5?'#ff9a2e':'#ffd25a',-150,-60)}if(e.br>0){e.br-=dt;dot(e,3*e.bl*dt,'#ff5a6a');if(R()<dt*(8+e.bl*7))PT.push({x:e.x+(R()-.5)*12,y:e.y-R()*e.h*.8,vx:(R()-.5)*40,vy:-20,l:.55,c:'#c1121f',r:1.8+R()});if(e.br<=0)e.bl=0}if(e.sl>0&&R()<dt*14)pf(e,'#9fe3ff',20,-10);if(e.fz>0&&R()<dt*12)pf(e,'#e6f8ff',30,10);if(e.zk=='f'&&R()<dt*25)pf(e,'#ff9a2e',-150,-60);if(e.zk=='i'&&R()<dt*10)pf(e,'#bfeaff',20,10);
 if(e.chg>0){e.chg-=dt;if(e.chg<=0)beam(e)}
 const t=(I.r?1:0)-(I.l?1:0),sp=290*(c.sp||1)*(e.spm||1)*(e.boost>0?1.58:1)*(e.chg>0?.25:1)*(e.wp=='mini'&&e.cd>0?.6:1)*(e.sl>0?.5:1)*(e.rb?(e.rb.t<1.5?.1:.55):1)*(e.tslow>0?TS:1)*(e.bat>0?.62:1)*GSPD*(G.cf.sp||1);e.wallKick=Math.max(0,(e.wallKick||0)-dt);
 if(e.wallKick<=0)e.vx+=(t*sp-e.vx)*Math.min(1,dt*(e.og?(M.ic?3.5:14):5));else e.vx*=Math.max(0,1-dt*1.1);if(t&&e.wallKick<=0)e.f=t;if(e.fo)e.f=e.fo;if(e.dsT>0){e.dsT-=dt;e.vx=e.dvx*GSPD*(e.tslow>0?TS:1);if(R()<.8)PT.push({x:e.x,y:e.y-e.h/2,vx:0,vy:0,g:0,l:.3,c:'#9b67ef88',r:12})}
 if(I.j&&!e.pj)e.jbuf=.16;e.jbuf=Math.max(0,(e.jbuf||0)-dt);
 if(I.j&&(!e.pj||(e.autoJ&&e.og))&&!(e.bat>0)){if(e.og){if(c.acrobat){e.vy=-880*(e.jmm||1);e.vx=e.f*480*(e.ev&&e.ev.spr||1);e.wallKick=.18;e.dj=0;e.jbuf=0;G.sh=Math.max(G.sh,2);fx(e.x,e.y,14,'#a9efff',260);TX.push({x:e.x,y:e.y-e.h-16,t:'ОТСКОК',l:.6,c:'#a9efff'})}else{e.vy=-795*(c.jm||1)*(e.jmm||1);e.dj=Math.max(c.dj||0,S.phone&&e.pi!=null?1:0)}}else if(c.acrobat){const wall=acroWall(e);if(wall&&(e.wk||0)<3){e.wk=(e.wk||0)+1;e.vy=-835;e.vx=-wall*520;e.f=-wall;e.wallKick=.22;G.sh=Math.max(G.sh,3);fx(e.x,e.y-28,16,'#a9efff',260);TX.push({x:e.x,y:e.y-e.h-16,t:'ОТСКОК ОТ СТЕНЫ',l:.7,c:'#a9efff'})}}else if(e.dj>0){e.vy=-695;e.dj--;fx(e.x,e.y,8,'#fff',120)}}e.pj=I.j;
 if(I.d&&e.og&&e.y<GY)e.dr=.22;
 if(I.s&&e.cd<=0&&e.chg<=0&&!e.rb&&!(e.bat>0))fire(e);
 if(e.revWait>0)slimeReviveTick(e,dt,I);
 if(c.killer&&e.hp>0){killerTick(e,dt);if(I.m&&!e.pm)killerPress(e)}else if(I.m&&!e.pm&&e.kc<=0){animeAbility(e);if(c.slime){slimeCopy(e)}else if(c.med){e.kc=12;slimeRecordAbility(e,'medic',12);pr({x:e.x+e.f*14,y:e.y-44*e.sz,vx:e.f*340+e.vx*.3,vy:-420,g:900,tm:e.tm,t:'h',life:4,src:e,km:(e.ev&&e.ev.kit)||1});TX.push({x:e.x,y:e.y-e.h-14,t:'АПТЕЧКА',l:.7,c:'#7ee08a'})}else if(c.vamp){if(e.ev&&e.ev.world){e.kc=25;G.worldStop={tm:e.tm,x:e.x,y:e.y-e.h*.5,radius:620,life:1.7,src:e};cutIn('THE WORLD','ВРЕМЯ ОСТАНОВЛЕНО','#ffd166');animeT('ring',e.x,e.y-e.h*.5,'#ffd166',{r:620,d:.8});animeT('lines',e.x,e.y-e.h*.5,'#fff0b0',{r:420,d:.7,n:42});G.sh=Math.max(G.sh,14);TX.push({x:e.x,y:e.y-e.h-20,t:'ЗАСТЫВШЕЕ ВРЕМЯ',l:1.4,c:'#ffd166'})}else{e.kc=20;slimeRecordAbility(e,'vamp',20);e.bat=3*(e.ev&&e.ev.batT||1);fx(e.x,e.y-e.h/2,30,'#c1121f',380);TX.push({x:e.x,y:e.y-e.h-16,t:'ЛЕТУЧАЯ МЫШЬ!',l:1,c:'#ff7a8a'})}}else if(c.engineer){if(!e.og||Math.abs(e.vy)>45){e.kc=.35;TX.push({x:e.x,y:e.y-e.h-16,t:'ТУРЕЛЬ МОЖНО СТАВИТЬ ТОЛЬКО НА ЗЕМЛЕ',l:1,c:'#ffd166'})}else{e.kc=22;slimeRecordAbility(e,'engineer',22);placeTurret(e,1,null);fx(e.x,e.y-8,18,'#8ce5ff',260);TX.push({x:e.x,y:e.y-e.h-14,t:'ТУРЕЛЬ · 100 ПРОЧНОСТИ',l:1,c:'#8ce5ff'})}}else if(c.duelist){e.kc=12;slimeRecordAbility(e,'duelist',12);e.mirror=1.35*(e.ev&&e.ev.pry||1);fx(e.x,e.y-e.h*.5,18,'#b5f5ff',260);const marked=ents.filter(o=>o.hp>0&&o.tm!=e.tm&&Math.hypot(o.x-e.x,o.y-o.h*.5-(e.y-e.h*.5))<520).sort((a,b)=>(b.mh+(b.B?3000:0)+(b.z?350:0))-(a.mh+(a.B?3000:0)+(a.z?350:0))).slice(0,3+((e.ev&&e.ev.mks)||0));for(const o of marked){o.mark=4;o.markTeam=e.tm;fx(o.x,o.y-o.h*.5,18,'#ffcf58',300);TX.push({x:o.x,y:o.y-o.h-18,t:'МЕТКА · ×1,5',l:1,c:'#ffd166'})}TX.push({x:e.x,y:e.y-e.h-14,t:'ПАРИРОВАНИЕ + МЕТКИ',l:1,c:'#b5f5ff'})}else if(c.assault){e.kc=16;slimeRecordAbility(e,'assault',16);WALLS=WALLS.filter(w=>w.tm!=e.tm);WALLS.push(mkWall(e));fx(e.x,e.y-75,26,'#ffb05a',300);TX.push({x:e.x,y:e.y-e.h-14,t:'БАРЬЕР · 16 ПРОЧНОСТИ',l:1,c:'#ffb05a'})}else if(c.necromancer){necroCast(e)}}e.pm=I.m;
 if(e.B&&(e.clingTr||e.hang)&&spiderPhys(e,dt))return;
 if(e.bat>0){e.vy+=(((I.d?1:0)-(I.j?1:0))*320-e.vy)*Math.min(1,dt*7)}else{e.vy+=1600*dt*(M.gv||1)*(G.cf.gv||1)*(G.ev&&G.ev.type=='gravity'&&G.ev.active>0?.42:1)*(e.vy>0?(c.fg||1):1);if(c.sf&&e.vy>170)e.vy=170}if(e.stand&&e.og){e.x=cl(e.x+e.stand.dx,14,W-14);e.y+=e.stand.dy}const px=e.x,py=e.y,w0=e.og,v0=e.vy;e.x=cl(e.x+e.vx*dt,14,W-14);e.y+=e.vy*dt;if(WALLS.length)blockMonsterByWalls(e,px,py);e.og=0;e.stand=null;if(e._onwall){e.og=1;e._onwall=0;e.vy=0}
 if(e.y>=GY){e.y=GY;e.vy=0;e.og=1}else if(e.vy>=0&&e.dr<=0)for(const p of M.pl)if(e.x>p[0]-4&&e.x<p[0]+p[2]+4&&py<=p[1]+1&&e.y>=p[1]){e.y=p[1];e.vy=0;e.og=1}
 if(!e.og&&e.vy>=0&&e.dr<=0&&DY.pl.length)ixLand(e,px,py);
 if(e.og&&!w0&&v0>420){e.sq=.14;if(G.cf.bnc&&v0>300&&!e.B){e.vy=-v0*.62;e.og=0}fx(e.x,e.y,7,'#ffffff77',120);if(c.slam)tslam(e);if(c.slime&&e.slimeSlam)slimeResolveSlam(e);if(c.acrobat&&(I.j||e.jbuf>0)){e.vy=-945*(e.ev&&e.ev.spr||1);e.vx=e.f*300*(e.ev&&e.ev.spr||1);e.wallKick=.12;e.jbuf=0;e.og=0;e.wk=0;fx(e.x,e.y,16,'#a9efff',280);TX.push({x:e.x,y:e.y-e.h-14,t:'ПРУЖИНА!',l:.7,c:'#a9efff'})}}if(e.og&&Math.abs(e.vx)>200&&R()<dt*16)PT.push({x:e.x-Math.sign(e.vx)*8,y:e.y-1,vx:-e.vx*.1,vy:-25,g:0,l:.3,c:'#ffffff66',r:2+R()*2});if(e.ch==3&&Math.abs(e.vx)>120&&R()<dt*40)pf(e,'#cfeaff',0,-10);if(e.og)e.wk=0;e.sq=Math.max(0,(e.sq||0)-dt);e.ph+=Math.abs(e.vx)*dt*.07;if(e.hp>0)ixUpd(e,dt)}
function near(e){let t=null,b=1e9;for(const o of ents)if(o.hp>0&&o.tm!=e.tm){const d=Math.abs(o.x-e.x)+Math.abs(o.y-e.y)*.6;if(d<b){b=d;t=o}}return t}
function zombieCanClimb(e){return !!(e&&(e.zk=='v'||e.mini=='hunter'||e.verticalHunter))}
function verticalTargetCost(e,o,hunt=.2){const dx=Math.abs(o.x-e.x),dy=Math.abs((o.y-(o.h||58)*.55)-(e.y-(e.h||58)*.55)),weight=.36+(1-hunt)*.88;return dx+dy*weight+Math.max(0,dy-155)*(1-hunt)*.45}
function platformForPoint(x,y){let best=null,bd=1e9;for(const p of M.pl){if(x<p[0]-16||x>p[0]+p[2]+16)continue;const d=Math.abs(p[1]-y);if(d<58&&d<bd){bd=d;best=p}}return best}
function aiNavigate(e,x,y,I,dt){
 if(e.z)e.aiJumpCd=Math.max(0,(e.aiJumpCd||0)-dt);else if(e.aiJumpCd==null)e.aiJumpCd=0;
 if(e.z&&y<e.y-145&&!zombieCanClimb(e)){e.navC=null;return 0}
 const goal=platformForPoint(x,y);let current=-1;
 for(let i=0;i<M.pl.length;i++){const p=M.pl[i];if(e.x>=p[0]-12&&e.x<=p[0]+p[2]+12&&Math.abs(e.y-p[1])<22){current=i;break}}
 if(e.og)e.aiPlatform=current;else if(e.aiPlatform!=null)current=e.aiPlatform;
 const nodes=M._n||(M._n=[[0,GY,W],...M.pl]),from=current+1,goalIndex=goal?M.pl.indexOf(goal):-1,to=goalIndex+1;
 if(goal&&goalIndex>=0&&from!==to&&goal[1]<e.y-42){
  let nxt=-2;const nc=e.navC;
  if(nc&&nc.f===from&&nc.t===to&&G.t-nc.at<.3)nxt=nc.n;
  else{
   const prev=Array(nodes.length).fill(-1),queue=[from];prev[from]=from;
   for(let q=0;q<queue.length&&prev[to]<0;q++){
    const a=queue[q],pa=nodes[a];
    for(let b=1;b<nodes.length;b++){
     if(prev[b]>=0||b===a)continue;
     const pb=nodes[b],rise=pa[1]-pb[1],gap=Math.max(0,pb[0]-(pa[0]+pa[2]),pa[0]-(pb[0]+pb[2]));
     const disc=750*750-3200*rise,reach=rise<=0?300:disc>=0?290*(750+Math.sqrt(disc))/1600*.9:0;if(rise<=175&&rise>=-260&&gap<=reach){prev[b]=a;queue.push(b)}
    }
   }
   nxt=-1;if(prev[to]>=0){let path=[to];while(path[0]!==from)path.unshift(prev[path[0]]);if(path.length>1)nxt=path[1]}
   e.navC={f:from,t:to,n:nxt,at:G.t}}
  if(nxt>=0){const next=nodes[nxt],left=next[0],right=next[0]+next[2],targetX=e.x<left?left+24:e.x>right?right-24:(left+right)*.5,dx=targetX-e.x;
   if(Math.abs(dx)>14)(dx>0?I.r=1:I.l=1);
   e.aiNavTarget=targetX;
   if(e.og&&e.aiJumpCd<=0&&Math.abs(dx)<Math.min(220,Math.max(72,gapDistance(e,next)+34))){I.j=1;e.aiJumpCd=.78}
   return 1}
 }
 if(y>e.y+78&&e.og&&e.y<GY-12)I.d=1;
 return 0
}
function gapDistance(e,p){return e.x<p[0]?p[0]-e.x:e.x>p[0]+p[2]?e.x-(p[0]+p[2]):0}
