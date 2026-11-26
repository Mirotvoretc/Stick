function updIT(dt){for(const i of IT){i.life-=dt;const py=i.y;i.vy=Math.min(i.vy+300*dt,125);i.y+=i.vy*dt;let gy=GY;for(const p of M.pl)if(i.x>p[0]&&i.x<p[0]+p[2]&&py<=p[1]+1&&i.y>=p[1])gy=Math.min(gy,p[1]);
 if(i.y>=gy){i.y=gy;i.vy=0}i.air=i.y<gy-3;
 for(const e of ents)if(e.hp>0&&!e.z&&!e.B&&!e.minion&&!(CH[e.ch].brawler&&!i.kit)&&(i.tm==null||i.tm==e.tm)&&Math.abs(e.x-i.x)<(e.og?28:46)&&i.y>e.y-e.h-34&&i.y<e.y+20){if(i.kit){if(e.hp>=e.mh)continue;const h=Math.round(e.mh*.4*(i.km||1));e.hp=Math.min(e.mh,e.hp+h);i.life=0;TX.push({x:e.x,y:e.y-e.h-18,t:'+'+h,l:.9,c:'#7ee08a'});fx(i.x,i.y-12,14,'#7ee08a',220);e.bn=0;e.br=0;e.bl=0;break}const w=WP[i.wp];e.wp=i.wp;e.am=slimeWeaponAmmo(e,i.wp);e.katHits=0;e.katRefs=0;i.life=0;fx(i.x,i.y-12,12,w.c,220);TX.push({x:e.x,y:e.y-e.h-18,t:w.n,l:.9,c:w.c});break}}
 IT=IT.filter(i=>i.life>0)}



function spawnZold(w=G.wv,sx,sy){const r=R(),ty=w>2&&r<.18?'b':w>1&&r<.4?'i':w>3&&r<.62?'f':'n',top=R()<.3,z={n:['#86c46a',1,1],i:['#8fd8ff',.95,1],f:['#ff7a3c',1.1,1],b:['#5aa04a',.8,4]}[ty];
 ents.push(mk({z:1,zk:ty,tm:1,x:sx??(top?60+R()*(W-120):R()<.5?24:W-24),y:sy??(top?-40:GY),hp:(36+w*9)*z[2],sz:ty=='b'?1.5:1,c:z[0],spm:(.52+Math.min(w,18)*.009)*z[1]*(ty=='b'?.72:1),dmg:(5+w*.55)*(ty=='b'?1.75:1)}))}
function spawnZo(){const big=G.wv>2&&R()<.15,top=R()<.3;ents.push(mk({z:1,tm:1,x:top?60+R()*(W-120):R()<.5?24:W-24,y:top?-40:GY,hp:(36+G.wv*9)*(big?4:1),sz:big?1.5:1,c:big?'#5aa04a':'#86c46a',spm:(.52+Math.min(G.wv,18)*.009)*(big?.72:1),dmg:(5+G.wv*.55)*(big?1.75:1)}))}
function nextWave(){G.wv++;const tier=G.mode=='survival'?Math.floor(G.wv/5):0;G.survTier=tier;G.q=Math.min(G.mode=='survival'?48:38,4+Math.round(G.wv*1.55*(G.mode=='survival'?1+tier*.12:1)));if(G.wv%5==0){spawnMini(G.wv);G.q=Math.round(G.q*.65)}G.zt=G.mode=='survival'?Math.max(.48,1.35-G.survTier*.055):1.35;G.bn='ВОЛНА '+G.wv;G.bt=1.6;if(G.mode=='survival'&&G.wv%5==0){G.bn='УГРОЗА РАСТЁТ';G.bt=2.4;cutIn('ЭТАП '+(G.wv/5+1),'Враги становятся опаснее','#ff8a5c');G.sh=Math.max(G.sh,12)}for(const e of ents)if(e.pi!=null){if(e.hp<=0){e.hp=e.mh*.5;e.x=cl(e.x,60,W-60);e.y=GY-1;fx(e.x,e.y-30,16,e.c,260)}else e.hp=Math.min(e.mh,e.hp+60)}}
function startMatch(demo){G={demo,mode:demo?'duel':S.mode,sc:[0,0,0],n3:demo?0:S.t3,rd:0,lv:1,wv:0,q:0,zt:0,t:0,sh:0,mi:-1,bt:0,ov:0,cd:0,it:1,need:Math.floor(S.rounds/2)+1,cf:{},hs:0};nextRound()}
function nextRound(){const m=G.mode,pl=S.maps.length?S.maps:[0];let mi;do mi=pl[R()*pl.length|0];while(mi==G.mi&&pl.length>1);G.mi=mi;M={...MP[mi],pl:MP[mi].pl.map(p=>p.slice())};buildIX();mkbg();
 ents=[];P=[];IT=[];PT=[];TX=[];RG=[];BM=[];ZP=[];TUR=[];WALLS=[];HZ=[];OB=[];DR=[];SOUL=[];AN=[];G.cut=null;G.cf={};G.chx=null;G.hs=0;G.pt=9+R()*5;G.timeField=null;G.gravityField=null;G.gravityBlast=null;G.ev=null;G.rd++;G.hint=G.rd<=1&&!G.demo?8:0;G.ov=0;G.lost=0;G.it=.2;G.sp3=0;G.cd=1.3;G.bt=1.3;G.bn=m=='boss'?'БОСС '+G.lv:'РАУНД '+G.rd;
 const add=o=>{const e=mk(o);ents.push(e);if(e.ch==4&&!e.cl)ents.push(mk({cl:1,own:e,tm:e.tm,x:e.x-e.f*34,f:e.f,c:e.c,hp:Math.round(e.mh/1.75),sz:.9,dm:.67}));return e},
 pc=(i,tm,x,f)=>S.phone&&i>0?bt(tm,x,f,COL[S.p[i].c],effCh(i)):add({pi:i,tm,x,f,c:COL[S.p[i].c],ch:effCh(i),autoJ:S.phone&&i==0?1:0}),bt=(tm,x,f,c,ch)=>add({tm,x,f,c,ch:ch??[0,2,3,4,5,6,7,8,9,10,11][R()*11|0],dm:.85,ai:['aggressive','cautious','collector'][R()*3|0]});
 if(G.demo){bt(0,W/2-400,1,COL[R()*8|0]);bt(1,W/2+400,-1,COL[R()*8|0])}else{pc(0,0,(m=='zomb'||m=='survival'||m=='boss')?(S.t3?W/2-420:W/2-260):W/2-420,1);
  if(m=='duel'){pc(1,1,W/2+420,-1);if(S.t3)pc(2,2,W/2,1)}
  if(m=='v12'){pc(1,1,W/2+420,-1);const a=S.swap|0;bt(a,a?W/2+300:W/2-300,a?-1:1,COL[S.p[a].c])}
  if(m=='v22'){pc(1,1,W/2+420,-1);bt(0,W/2-300,1,COL[S.p[0].c]);bt(1,W/2+300,-1,COL[S.p[1].c])}
  if(m=='zomb'||m=='survival'||m=='boss'){pc(1,0,S.t3?W/2+420:W/2+260,-1);if(S.t3)pc(2,0,W/2,1)}
  if(m=='boss'){const spec=S.boss>=0&&BOSS_TYPES[S.boss]?BOSS_TYPES[S.boss]:BOSS_TYPES[(G.lv-1)%BOSS_TYPES.length];G.bossSpec=spec;G.bo=add({B:1,btype:spec.id,bname:spec.n,tm:1,x:S.t3?W/2:W/2+520,y:GY,f:-1,c:spec.id=='spider'?'#e0463c':spec.id=='electric'?'#63cfff':spec.id=='necromancer'?'#a24dff':spec.id=='colossus'?'#b18a5b':'#6845a8',hp:(spec.hp*.85+G.lv*145)*(S.t3?1.28:1),sz:spec.size,...(spec.w?{w:spec.w,h:spec.h,arm:spec.arm+G.lv*30,armM:spec.arm+G.lv*30}:{})});G.bn=spec.n.toUpperCase()} }
 for(const e of ents)if(e.pi!=null&&!e.cl)applyEvo(e);
 if(m=='zomb'||m=='survival'){G.wv=0;nextWave()}startMapEvent();camUpd(10)}
function step(dt){G.sh=Math.max(0,G.sh-dt*40);G.fl=Math.max(0,(G.fl||0)-dt*.8);
 for(const p of PT){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g??(p.r>5?0:600))*dt;p.l-=dt}PT=PT.filter(p=>p.l>0);{const ptc=(PERF.low&&S.gfx!=1)||S.gfx==2?330:560;if(PT.length>ptc)PT.splice(0,PT.length-ptc)}G.hint=Math.max(0,(G.hint||0)-dt);
 for(const t of TX){t.y-=40*dt;t.l-=dt}TX=TX.filter(t=>t.l>0);if(TX.length>30)TX.splice(0,TX.length-30);for(const r of RG)r.l-=dt;RG=RG.filter(r=>r.l>0);for(const b of BM)b.l-=dt;BM=BM.filter(b=>b.l>0);for(const z of ZP)z.life-=dt;ZP=ZP.filter(z=>z.life>0);updAN(dt);updSouls(dt);
 if(G.bt>0)G.bt-=dt;if(G.end||G.pause)return;if(G.hs>0){G.hs-=dt;return}G.t+=dt;if(G.cd>0){G.cd-=dt;return}
 updChaos(dt);updEvent(dt);updFields(dt);updIX(dt);updTurrets(dt);updWalls(dt);updHZ(dt);G.pt=(G.pt??9)-dt;if(G.pt<=0){G.pt=12+R()*8;if(S.props&&!G.demo&&OB.filter(o=>o.k!='mine').length<4)propDrop()}G.it-=dt;if(G.it<=0){G.it=(G.sp3=(G.sp3||0)+1)<4?1.2:4+R()*3;if(IT.length<4)spawnIT()}updIT(dt);
 if(G.worldStop){G.worldStop.life-=dt;if(G.worldStop.life<=0){G.worldStop=null;TX.push({x:W/2,y:220,t:'ВРЕМЯ ВОЗВРАЩАЕТСЯ',l:.8,c:'#ffd166'})}}
 for(const e of ents)if(e.hp>0){if(G.worldStop&&e.tm!=G.worldStop.tm&&Math.hypot(e.x-G.worldStop.x,e.y-e.h*.5-G.worldStop.y)<G.worldStop.radius){e.vx=0;e.vy=0;e.in={};continue}if(e.minion){e.minionLife-=dt;if(e.minionLife<=0){e.hp=0;e.dd=.65;fx(e.x,e.y-e.h*.5,12,'#b94b69',220);continue}}if(e.pi!=null){const k=S.p[e.pi].k;e.in={l:K[k.l],r:K[k.r],j:K[k.j],d:K[k.d],s:K[k.s],m:K[k.m]}}else if(e.z)zom(e,dt);else if(e.B)bossAI(e,dt);else bot(e,dt);upd(e,dt)}else if(e.dd>0){e.dd-=dt;e.in={};upd(e,dt);if(e.dd<=0)fx(e.x,e.y-24,14,'#d8d8d8',140)}
 updP(dt);updOB(dt);updDR(dt);ents=ents.filter(e=>e.hp>0||e.pi!=null||e.dd>0);
 if(G.mode=='duel'||G.mode=='v12'||G.mode=='v22'){const al=t=>ents.filter(e=>e.tm==t&&e.hp>0&&!e.cl).length,a=al(0),b=al(1),c3=al(2),na=(a>0)+(b>0)+(c3>0);
  if(!G.ov&&na<2){G.ov=2.2;G.bt=2.2;if(na){const w=a?0:b?1:2;G.sc[w]++;G.bn=G.demo?'':'ПОБЕДА: '+tn(w)}else G.bn='НИЧЬЯ'}
  if(G.ov){G.ov-=dt;if(G.ov<=0){G.ov=0;if(!G.demo&&G.sc.some(v=>v>=G.need))endMatch();else nextRound()}}}
 else{if((G.mode=='zomb'||G.mode=='survival')&&!G.ov){if(G.q>0){G.zt-=dt;if(G.zt<=0){G.zt=Math.max(.48,(G.mode=='survival'?1.35-(G.survTier||0)*.055:1.42-G.wv*.035)*(G.contracts&&G.contracts.includes('horde')?0.88:1));G.q--;spawnZ()}}else if(!ents.some(e=>e.z&&e.hp>0)){G.bk=(G.bk??2.5)-dt;if(G.bk<=0){G.bk=null;nextWave()}}}
  if(G.mode=='boss'&&!G.ov&&G.bo.hp<=0){G.ov=3;G.lv++;G.bn='БОСС ПОВЕРЖЕН!';G.bt=3}
  if(!G.ov&&!ents.some(e=>e.pi!=null&&e.hp>0)){G.ov=2;G.lost=1;G.bn='ПОРАЖЕНИЕ';G.bt=2}
  if(G.ov){G.ov-=dt;if(G.ov<=0){G.ov=0;G.lost?endMatch():nextRound()}}}}



const ZT={n:{c:'#86c46a',sp:1,hp:1,dm:1},i:{c:'#8fd8ff',sp:.95,hp:1,dm:1},f:{c:'#ff7a3c',sp:1.1,hp:1,dm:1},b:{c:'#5aa04a',sp:.72,hp:3,dm:1.5,sz:1.5},a:{c:'#9aa4b8',sp:.82,hp:1.5,dm:1.2,arm:1},r:{c:'#d9e86a',sp:1.75,hp:.5,dm:.7},s:{c:'#7be08a',sp:.7,hp:.8,dm:.8},x:{c:'#ff5a4a',sp:1.15,hp:.7,dm:1},e:{c:'#5fd8ff',sp:1.05,hp:1.1,dm:.9}};
const MINI=[{id:'butcher',n:'Мясник',c:'#b34a3a',sz:1.9,hp:620,sp:.62},{id:'shaman',n:'Шаман',c:'#4aa8b8',sz:1.55,hp:480,sp:.5},{id:'demo',n:'Подрывник',c:'#c0842a',sz:1.7,hp:560,sp:.55}];
function spawnZ(w=G.wv,sx,sy,force,team=1,ownerSlime=null){let ty=force||'n';
 if(!force){const pool=[['n',10]];if(w>=2)pool.push(['i',3],['r',3]);if(w>=3)pool.push(['f',3],['a',3],['b',2]);if(w>=4)pool.push(['s',3]);if(w>=5)pool.push(['x',3]);if(w>=6)pool.push(['e',3]);let q=R()*pool.reduce((a,p)=>a+p[1],0);for(const p of pool){q-=p[1];if(q<=0){ty=p[0];break}}}
 const z=ZT[ty],elite=!force&&w>=5&&R()<Math.min(.22,.04+w*.007),top=R()<.3,hp=(30+w*5.2)*z.hp*(elite?1.9:1);
 const e=mk({z:1,zk:ty,tm:team,ownerSlime,elite:elite?1:0,x:sx??(top?60+R()*(W-120):R()<.5?24:W-24),y:sy??(top?-40:GY),hp,sz:(z.sz||1)*(elite?1.12:1),c:z.c,spm:(.47+Math.min(w,20)*.006)*z.sp,dmg:(4+w*.38)*z.dm*(elite?1.3:1)});
 if(z.arm)e.arm=e.armM=60+w*6;if(elite){e.arm=(e.arm||0)+30;e.armM=e.arm}
 ents.push(e);return e}
function spawnMini(w){const m=MINI[(Math.floor(w/5)-1)%MINI.length],e=mk({z:1,zk:'m',mini:m.id,mname:m.n,tm:1,x:R()<.5?60:W-60,y:GY,hp:m.hp+w*24,sz:m.sz,c:m.c,spm:m.sp,dmg:8+w*.45});e.arm=e.armM=40+w*5;ents.push(e);TX.push({x:e.x,y:e.y-e.h-26,t:'МИНИ-БОСС: '+m.n.toUpperCase(),l:2,c:'#ffd166'});G.sh=Math.max(G.sh,10);return e}
function blast(e){e.boomed=1;fx(e.x,e.y-20,40,'#ff6a3a',420);RG.push({x:e.x,y:e.y-20,l:.4});G.sh=Math.max(G.sh,9);for(const o of ents)if(o.hp>0&&o!==e&&o.tm!=e.tm&&Math.hypot(o.x-e.x,(o.y-o.h/2)-(e.y-e.h/2))<115)hit(o,24,e,(Math.sign(o.x-e.x)||1)*380,0,1);for(const t of TUR)if(t.hp>0&&t.tm!=e.tm&&Math.hypot(t.x-e.x,t.y-18-(e.y-e.h/2))<115)hitTur(t,40,e)}
function zom(e,dt){const t=zTgt(e);if(!t)return zomBase(e,dt);const dx=t.x-e.x,ad=Math.abs(dx),k=e.zk;e.az=(e.az||0)-dt*(e.tslow>0?TS:1);
 if(k=='s'||e.mini=='shaman'){const I=e.in={},lo=e.mini?340:290,hi=e.mini?460:400,nav=aiNavigate(e,t.x,t.y,I,dt);if(!nav){if(ad<lo)dx>0?I.l=1:I.r=1;else if(ad>hi)dx>0?I.r=1:I.l=1;}if((e.x<120&&I.l)||(e.x>W-120&&I.r)){I.l=0;I.r=0;if(e.og&&(e.zjc=(e.zjc||0)-dt)<=0){I.j=1;e.zjc=1}}e.fo=Math.sign(dx)||1;
  if(e.az<=0&&Math.abs(t.y-e.y)<220){e.az=e.mini?3.2:2.4;e.lastAbility={kind:'zombie',id:'shaman',time:G.t,cooldown:e.az};const an=Math.atan2(t.y-t.h*.5-(e.y-e.h*.7),dx);pr({x:e.x+e.f*20,y:e.y-e.h*.7,vx:Math.cos(an)*(e.mini?420:360),vy:Math.sin(an)*360,dm:e.mini?12:8,tm:1,col:e.mini?'#8feeff':'#9be36a',src:e,t:e.mini?'s':'b',fz:e.mini?.6:0,life:1.8});fx(e.x+e.f*20,e.y-e.h*.7,5,'#9be36a',180)}
  if(e.mini=='shaman'){e.sum=(e.sum??5)-dt;if(e.sum<=0&&ents.filter(o=>o.z&&o.hp>0).length<24){e.sum=9;spawnZ(G.wv,e.x-70,e.y,'n');spawnZ(G.wv,e.x+70,e.y,'n');fx(e.x,e.y-40,24,'#4aa8b8',320)}}return}
 if(k=='e'){zomBase(e,dt);e.zp=(e.zp??2.2)-dt*(e.tslow>0?TS:1);if(e.zp<=0&&ad<220&&Math.abs(t.y-e.y)<160){e.zp=3.2;const ox=e.x+e.f*14,oy=e.y-e.h*.7;if(t.isTur){hitTur(t,e.dmg*1.8,e);ZP.push({x1:ox,y1:oy,x2:t.x,y2:t.y-20,life:.2,c:'#63eaff'})}else chainBolt(e,t,Math.max(6,e.dmg*1.8),null,{n:4,range:150,ox,oy});TX.push({x:e.x,y:e.y-e.h-14,t:'РАЗРЯД!',l:.6,c:'#8feeff'})}return}
 if(k=='x'){zomBase(e,dt);if(ad<64&&Math.abs(t.y-e.y)<80&&!e.fuse){e.fuse=.45;TX.push({x:e.x,y:e.y-e.h-12,t:'!',l:.5,c:'#ff5a4a'})}if(e.fuse){e.fuse-=dt;if(e.fuse<=0){blast(e);e.hp=0;die(e)}}return}
 if(e.mini=='absorber'){zomBase(e,dt);absorberTick(e,dt);return}
 if(e.mini=='butcher'){zomBase(e,dt);e.chT=(e.chT??4)-dt;if(!e.chg2&&e.chT<=0&&ad>180&&ad<700){e.chg2=.8;e.chD=Math.sign(dx)||e.f;e.chT=7;TX.push({x:e.x,y:e.y-e.h-14,t:'ТАРАН!',l:.8,c:'#ff8a5c'})}
  if(e.chg2>0){e.chg2-=dt;e.tel={k:'line',x1:e.x,y1:e.y-30,x2:e.x+e.chD*430,y2:e.y-30,p:1-e.chg2/.8,c:'#ff5a4a'};if(e.chg2<=0){e.chg2=0;e.tel=null;e.dsT=.45;e.dvx=e.chD*900}}
  if(e.dsT>0){e.dh=e.dh||[];for(const o of foes(e))if(!e.dh.includes(o)&&Math.abs(o.x-e.x)<40+o.w/2&&Math.abs(o.y-e.y)<70){e.dh.push(o);hit(o,22,e,e.chD*400,0,1)}}else e.dh=null;return}
 if(e.mini=='demo'){zomBase(e,dt);e.gr=(e.gr??3)-dt;if(e.gr<=0&&ad>140){e.gr=4;const T2=1,sx=e.x,sy=e.y-e.h*.8;pr({x:sx,y:sy,vx:(t.x-sx)/T2,vy:(t.y-t.h/2-sy-450*T2*T2)/T2,dm:24,tm:1,col:'#c0842a',src:e,t:'g',g:900,life:2});TX.push({x:e.x,y:e.y-e.h-14,t:'ГРАНАТА!',l:.6,c:'#ffb347'})}return}
 zomBase(e,dt)}
function zExtra(e,y){if(!e.z)return;const s=e.sz,T=G.t;
 if(e.elite){cx.save();cx.globalCompositeOperation='lighter';const g=cx.createRadialGradient(e.x,e.y-e.h*.5,4,e.x,e.y-e.h*.5,60*s);g.addColorStop(0,'rgba(255,214,102,.45)');g.addColorStop(1,'rgba(255,214,102,0)');cx.fillStyle=g;cx.beginPath();cx.arc(e.x,e.y-e.h*.5,60*s,0,7);cx.fill();cx.strokeStyle='rgba(255,214,102,.8)';cx.lineWidth=3;cx.beginPath();cx.ellipse(e.x,e.y-2,26*s,7*s,0,0,7);cx.stroke();cx.restore();cx.fillStyle='#ffd166';cx.beginPath();cx.moveTo(e.x-9,y-2);cx.lineTo(e.x-9,y-12);cx.lineTo(e.x-4,y-7);cx.lineTo(e.x,y-14);cx.lineTo(e.x+4,y-7);cx.lineTo(e.x+9,y-12);cx.lineTo(e.x+9,y-2);cx.closePath();cx.fill()}
 if(e.arm>0){cx.save();cx.translate(e.x,e.y);cx.scale(e.f*s,s);OL=1;rr(-9,-65,18,8,'#9aa4bb',cx,3);rr(-8,-44,16,16,'#8e97ad',cx,3);rr(-8,-44,16,4,'#c3cbe0',cx,2);OL=0;cx.restore()}
 if(e.zk=='x'){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=.3+.4*Math.abs(Math.sin(T*(e.fuse?30:6)));cx.fillStyle='#ff4a3a';cx.beginPath();cx.arc(e.x,e.y-e.h*.5,22*s,0,7);cx.fill();cx.restore()}
 if(e.mini=='absorber')drawAbsorberAura(e);
 if(e.zk=='e'){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=.25+.25*Math.abs(Math.sin(T*9));cx.fillStyle='#63eaff';cx.beginPath();cx.arc(e.x,e.y-e.h*.5,20*s,0,7);cx.fill();cx.globalAlpha=.9;cx.strokeStyle='#d9ffff';cx.lineWidth=1.6;if(Math.sin(T*25+e.x)>.2){cx.beginPath();const bx=e.x,by=e.y-e.h*.8;cx.moveTo(bx,by);for(let i=1;i<4;i++)cx.lineTo(bx+Math.sin(T*40+i*3)*12,by-i*7);cx.stroke()}cx.restore()}
 if(e.mini){const w=110;rr(e.x-w/2-2,y-16,w+4,10,'#0b0d17',cx,4);rr(e.x-w/2,y-14,w*Math.max(0,e.hp/e.mh),6,e.c,cx,3);if(e.armM&&e.arm>0)rr(e.x-w/2,y-5,w*e.arm/e.armM,3,'#cbd2df',cx,1);cx.font='bold 12px system-ui,sans-serif';cx.textAlign='center';cx.fillStyle='#ffd166';cx.fillText(e.mname,e.x,y-22)}
 else if(e.armM&&e.arm>0){rr(e.x-17,y+6,34*e.arm/e.armM,3,'#cbd2df',cx,1)}
 if(e.tel)drawTel(e)}
function dodge(e,I){let dir=0,jump=0;
 for(const p of P){if(p.tm==e.tm||p.life<=0||p.t=='f'||Math.abs(p.vx)<150)continue;const dx=e.x-p.x,dy=(e.y-e.h*.5)-p.y;if(Math.abs(dy)<e.h*.75&&Math.abs(dx)<260&&dx*p.vx>0&&dx*p.vx!==0&&Math.sign(dx)!=Math.sign(p.vx)){if(e.og&&(p.t=='r'||p.t=='g'||R()<.45))jump=1;else dir=Math.sign(dx)||1;break}}
 for(const h of HZ){if(h.k=='zone'&&Math.abs(e.x-h.x)<h.r+60&&Math.abs(e.y-h.y)<60){dir=Math.sign(e.x-h.x)||1;break}if(h.k=='rock'&&h.t<h.wt+.8&&Math.abs(e.x-h.x)<70&&Math.abs(e.y-h.y)<140){dir=Math.sign(e.x-h.x)||1;break}if(h.k=='wave'&&Math.abs(e.y-h.y)<50&&Math.abs(e.x-h.x)<220&&(h.x-e.x)*h.dir<0){jump=1;break}}
 const ev=G.ev;if(ev&&ev.warning>0&&ev.sites)for(const x of ev.sites)if(Math.abs(e.x-x)<150&&e.y>GY-260){dir=Math.sign(e.x-x)||1;break}
 if(dir>0){I.r=1;I.l=0}else if(dir<0){I.l=1;I.r=0}
 if(jump&&e.og&&(e.jc||0)<=0){I.j=1;e.jc=.55}}
function bossTarget(e){const valid=o=>o&&o.hp>0&&o.tm!=e.tm,spec=BOSS_TYPES.find(b=>b.id==e.btype),hunt=spec?.verticalHunt??.24;let best=null,bd=1e9;for(const o of foes(e)){const d=verticalTargetCost(e,o,hunt);if(d<bd){bd=d;best=o}}if(valid(e.targetRef)){const cur=e.targetRef;if(G.t<(e.targetLockUntil||0))return cur;const cd=verticalTargetCost(e,cur,hunt);if(best&&best!==cur&&bd<cd*.72){e.targetRef=best;e.targetLockUntil=G.t+1.9;return best}return cur}e.targetRef=best;e.targetLockUntil=G.t+1.9;return best}
const PREF={nova:0,rift:2,blink:2,leap:2,stomp:1,rocks:2,throw:2,souls:0,circles:0,step:1,strike:2,chain:0,field:0,wave:1};
function clash(){const CT=['b','s','n','c','w','r','g'];for(let i=0;i<P.length;i++){const a=P[i];if(a.life<=0||!CT.includes(a.t))continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.life<=0||b.tm==a.tm||!CT.includes(b.t))continue;if(Math.abs(a.x-b.x)<15&&Math.abs(a.y-b.y)<15){fx((a.x+b.x)/2,(a.y+b.y)/2,8,'#fff3b0',300);spark((a.x+b.x)/2,(a.y+b.y)/2,8,'#fff');if(!a.big)a.life=0;if(!b.big)b.life=0;if(a.life<=0)break}}}}

function bot(e,dt){botMain(e,dt);dodge(e,e.in)}
const IS_TOUCH=(typeof matchMedia!='undefined'&&matchMedia('(pointer:coarse)').matches)||(typeof window!='undefined'&&'ontouchstart' in window&&innerWidth<1100);
const TC={sz:1,op:.8,lefty:0,jb:1,pos:{}};
try{const v=JSON.parse(localStorage.getItem('sa_tc')||'null');if(v)Object.assign(TC,v)}catch(x){}
function tcSave(){try{localStorage.setItem('sa_tc',JSON.stringify(TC))}catch(x){}}
const TCB=[{id:'bf',t:'ОГОНЬ',k:'s',d:{x:88,y:74},s:92,c:'255,77,94',i:'<circle cx="12" cy="12" r="3.2" fill="#fff"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>'},{id:'ba',t:'СПОСОБ.',k:'m',d:{x:71,y:86},s:68,c:'80,160,255',i:'<path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7.2L12 17.8 5.6 21.5l1.7-7.2L2 9.6 9 9z" fill="#fff"/>'},{id:'bj',t:'ПРЫЖОК',k:'j',d:{x:92,y:44},s:72,c:'80,210,120',i:'<path d="M12 3l8 9h-5v8H9v-8H4z" fill="#fff"/>'},{id:'bp',t:'',k:null,d:{x:94,y:10},s:40,c:'120,130,160',i:'<rect x="6" y="5" width="4" height="14" rx="1" fill="#fff"/><rect x="14" y="5" width="4" height="14" rx="1" fill="#fff"/>'}];
let tcEditing=0;
const JOY={id:null,ox:0,oy:0,dx:0,dy:0};
function setK(c,v){if(v)K[c]=1;else delete K[c]}
function tcPos(b){const p=TC.pos[b.id]||b.d;return{x:TC.lefty?100-p.x:p.x,y:p.y}}
function tcLayout(){if(!$('tc'))return;for(const b of TCB){const el=$(b.id),p=tcPos(b),s=b.s*TC.sz*Math.min(1,innerHeight/520);el.style.width=el.style.height=s+'px';el.style.background=`radial-gradient(circle at 35% 28%,rgba(255,255,255,.38),rgba(${b.c},.6) 55%,rgba(20,24,40,.7))`;el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.opacity=TC.op;el.style.display=(b.id=='bj'&&!TC.jb)?'none':'grid'}
 const z=$('jz');z.style.left=TC.lefty?'auto':'0';z.style.right=TC.lefty?'0':'auto';joyHome()}
function joyHome(){const jb=$('jb');if(!jb||JOY.id!==null)return;jb.style.display='block';jb.style.left=(TC.lefty?86:14)+'%';jb.style.top='72%';jb.style.opacity=.3*TC.op/.8;$('jk').style.transform=''}
function joyApply(){const k=S.p[0].k;setK(k.l,JOY.dx<-18);setK(k.r,JOY.dx>18);setK(k.j,JOY.dy<-26);setK(k.d,JOY.dy>34)}
function tcBuild(){const t=$('tc');if(!t)return;t.innerHTML='<div id="jz"></div><div id="jb"><div id="jk"></div></div>'+TCB.map(b=>`<div class="tcb" id="${b.id}"><svg viewBox="0 0 24 24" width="${b.t?'38%':'60%'}" height="${b.t?'38%':'60%'}">${b.i}</svg><span>${b.t}</span></div>`).join('')+`<div id="tcp"><b>Настройка сенсорного управления</b> <small>перетащи кнопки пальцем</small>
 <label>Размер <input type="range" min="60" max="150" value="${Math.round(TC.sz*100)}" oninput="TC.sz=this.value/100;tcLayout()"></label>
 <label>Прозрачность <input type="range" min="30" max="100" value="${Math.round(TC.op*100)}" oninput="TC.op=this.value/100;tcLayout()"></label>
 <div class="row"><button class="ch s" onclick="TC.lefty=TC.lefty?0:1;tcLayout();tcSave()">Поменять стороны</button><button class="ch s" onclick="TC.jb=TC.jb?0:1;tcLayout();tcSave()">Кнопка прыжка</button><button class="ch s" onclick="TC.pos={};TC.sz=1;TC.op=.8;TC.lefty=0;TC.jb=1;tcSave();tcBuild()">Сброс</button><button class="bt" onclick="tcEdit(0)">Готово</button></div></div>`;
 tcLayout();tcBind()}
function tcBind(){const jz=$('jz'),jb=$('jb'),jk=$('jk');
 jz.onpointerdown=e=>{if(tcEditing)return;JOY.id=e.pointerId;JOY.ox=e.clientX;JOY.oy=e.clientY;JOY.dx=JOY.dy=0;jb.style.display='block';jb.style.opacity=TC.op;jb.style.left=e.clientX+'px';jb.style.top=e.clientY+'px';jk.style.transform='';try{jz.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
 jz.onpointermove=e=>{if(e.pointerId!==JOY.id)return;let dx=e.clientX-JOY.ox,dy=e.clientY-JOY.oy;const m=Math.hypot(dx,dy),L=60;if(m>L){dx*=L/m;dy*=L/m}JOY.dx=dx;JOY.dy=dy;jk.style.transform=`translate(${dx}px,${dy}px)`;joyApply()};
 const end=e=>{if(e.pointerId!==JOY.id)return;JOY.id=null;JOY.dx=JOY.dy=0;joyApply();joyHome()};jz.onpointerup=end;jz.onpointercancel=end;
 for(const b of TCB){const el=$(b.id);
  el.onpointerdown=e=>{if(tcEditing){el._d={ox:e.clientX,oy:e.clientY,p:tcPos(b)};try{el.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault();return}if(b.k){setK(S.p[0].k[b.k],1);el.classList.add('on')}else if(b.id=='bp'){if(!G.demo&&!G.end)pause()}e.preventDefault()};
  el.onpointermove=e=>{if(!tcEditing||!el._d)return;const r=$('tc').getBoundingClientRect(),x=cl(el._d.p.x+(e.clientX-el._d.ox)/r.width*100,4,96),y=cl(el._d.p.y+(e.clientY-el._d.oy)/r.height*100,4,96);TC.pos[b.id]={x:TC.lefty?100-x:x,y};tcLayout()};
  const up=e=>{if(tcEditing){el._d=null;tcSave();return}if(b.k){setK(S.p[0].k[b.k],0);el.classList.remove('on')}};el.onpointerup=up;el.onpointercancel=up}}
function tcShow(){const t=$('tc');if(!t)return;const on=!!(IS_TOUCH&&S.phone&&(cur===''||tcEditing));t.style.display=on?'block':'none';document.body.classList.toggle('ph',!!(IS_TOUCH&&S.phone));document.body.classList.toggle('playing',cur==='')}
function tcEdit(on){tcEditing=on?1:0;const t=$('tc');if(t)t.classList.toggle('edit',!!on);if(!on)tcSave();tcShow()}
function goFull(){try{const d=document.documentElement;(d.requestFullscreen||d.webkitRequestFullscreen).call(d)}catch(x){}}

