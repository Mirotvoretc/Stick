function spawnZ(w=G.wv,sx,sy){const r=R(),ty=w>2&&r<.18?'b':w>1&&r<.4?'i':w>3&&r<.62?'f':'n',top=R()<.3,z={n:['#86c46a',1,1],i:['#8fd8ff',.95,1],f:['#ff7a3c',1.1,1],b:['#5aa04a',.8,4]}[ty];let elite=null;if(w>=3){const er=R();if(er<.12)elite='runner';else if(er<.21)elite='brute';else if(er<.28)elite='spitter'}const em=elite==='brute'?2.15:elite==='runner'?.78:elite==='spitter'?1.12:1,es=elite==='brute'?1.28:elite==='runner'?.9:1,esp=elite==='runner'?1.48:elite==='brute'?.72:elite==='spitter'?.88:1,ed=elite==='brute'?1.65:elite==='runner'?1.12:elite==='spitter'?1.2:1;const color=elite==='runner'?'#e7c45c':elite==='brute'?'#a65c4c':elite==='spitter'?'#8c72c9':z[0];ents.push(mk({z:1,zk:ty,eliteType:elite,tm:1,x:sx??(top?60+R()*(W-120):R()<.5?24:W-24),y:sy??(top?-40:GY),hp:(36+w*9)*z[2]*em*.96,sz:(ty=='b'?1.5:1)*es,c:color,spm:(.52+Math.min(w,18)*.009)*z[1]*(ty=='b'?.72:1)*esp*.86,dmg:(5+w*.55)*(ty=='b'?1.75:1)*ed*.88,eliteArmor:elite==='brute'?.22:0,eliteCd:2+R()*2}))}
function spawnZo(){spawnZ(G.wv)}
function nextWave(){G.wv++;G.q=4+G.wv*3;G.zt=1;G.bn='ВОЛНА '+G.wv;G.bt=1.6;for(const e of ents)if(e.pi!=null){if(e.hp<=0){e.hp=e.mh*.5;e.x=cl(e.x,60,W-60);e.y=GY-1;fx(e.x,e.y-30,16,e.c,260)}else e.hp=Math.min(e.mh,e.hp+60)}}
function activePlayerCount(){if(NET.role==='host')return Math.min(3,1+(NET.conns||[]).filter(c=>c&&c.ws&&c.ws.readyState===1).length);if(NET.role==='guest')return Math.max(2,Math.min(3,(NET.lobby&&NET.lobby.players&&NET.lobby.players.length)||2));return S.t3?3:2}
function startMatch(demo){G={demo,mode:demo?'duel':S.mode,sc:[0,0,0],n3:demo?0:S.t3,rd:0,lv:1,wv:0,q:0,zt:0,t:0,sh:0,mi:-1,bt:0,ov:0,cd:0,it:1,need:Math.floor(S.rounds/2)+1};nextRound()}
function nextRound(){const m=G.mode,playerCount=G.demo?2:activePlayerCount(),hasThird=playerCount>=3,pl=S.maps.length?S.maps:[0];G.n3=hasThird?1:0;let mi;do mi=pl[R()*pl.length|0];while(mi==G.mi&&pl.length>1);G.mi=mi;M=MP[mi];mkbg();
 ents=[];P=[];IT=[];PT=[];TX=[];RG=[];BM=[];ZP=[];TUR=[];WALLS=[];G.timeField=null;G.gravityField=null;G.gravityBlast=null;G.ev=null;G.rd++;G.ov=0;G.lost=0;G.it=.2;G.sp3=0;G.cd=1.3;G.bt=1.3;G.bn=m=='boss'?'БОСС '+G.lv:'РАУНД '+G.rd;
 const add=o=>{const e=mk(o);ents.push(e);if(e.ch==4&&!e.cl)ents.push(mk({cl:1,own:e,tm:e.tm,x:e.x-e.f*34,f:e.f,c:e.c,hp:Math.round(e.mh/1.75),sz:.9,dm:.67}));return e},
 pc=(i,tm,x,f)=>add({pi:i,tm,x,f,c:COL[S.p[i].c],ch:S.p[i].ch}),bt=(tm,x,f,c)=>add({tm,x,f,c,ch:[0,1,2,3,4,5,6,7,8,9,10,11][R()*12|0],dm:.85,ai:['aggressive','cautious','collector'][R()*3|0]});
 if(G.demo){bt(0,W*.16,1,COL[R()*8|0]);bt(1,W*.84,-1,COL[R()*8|0])}else{pc(0,0,(m=='zomb'||m=='boss')?(hasThird?W*.12:W*.2):W*.2,1);
  if(m=='solo'){bt(1,W*.8,-1,COL[1])}
  if(m=='duel'){pc(1,1,W*.86,-1);if(hasThird)pc(2,2,W*.5,1)}
  if(m=='v12'){pc(1,1,W*.86,-1);const a=S.swap|0;bt(a,a?W*.8:W*.2,a?-1:1,COL[S.p[a].c])}
  if(m=='v22'){pc(1,1,W*.86,-1);bt(0,W*.2,1,COL[S.p[0].c]);bt(1,W*.8,-1,COL[S.p[1].c])}
  if(m=='zomb'||m=='boss'){pc(1,0,hasThird?W*.5:W*.86,hasThird?1:-1);if(hasThird)pc(2,0,W*.86,-1)}
  if(m=='boss'){const spec=BOSS_TYPES[(G.lv-1)%BOSS_TYPES.length],hpScale=1.38+Math.max(0,playerCount-2)*.22;G.bossSpec=spec;G.bo=add({B:1,btype:spec.id,bname:spec.n,tm:1,x:W*.84,y:GY,f:-1,c:spec.id=='electric'?'#63cfff':spec.id=='necromancer'?'#a24dff':spec.id=='colossus'?'#b18a5b':'#6845a8',hp:(spec.hp+G.lv*280)*hpScale*.85,sz:spec.size});G.bn=spec.n.toUpperCase()} }
 if(m=='zomb'){G.wv=0;nextWave()}startMapEvent()}
function step(dt){G.sh=Math.max(0,G.sh-dt*40);
 for(const p of PT){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g??(p.r>5?0:600))*dt;p.l-=dt}PT=PT.filter(p=>p.l>0);if(PT.length>240)PT.splice(0,PT.length-240);
 for(const t of TX){t.y-=40*dt;t.l-=dt}TX=TX.filter(t=>t.l>0);if(TX.length>30)TX.splice(0,TX.length-30);for(const r of RG)r.l-=dt;RG=RG.filter(r=>r.l>0);for(const b of BM)b.l-=dt;BM=BM.filter(b=>b.l>0);for(const z of ZP)z.life-=dt;ZP=ZP.filter(z=>z.life>0);
 if(G.bt>0)G.bt-=dt;if(G.end||G.pause)return;G.t+=dt;if(G.cd>0){G.cd-=dt;return}
 updEvent(dt);updFields(dt);updTurrets(dt);updWalls(dt);G.it-=dt;if(G.it<=0){G.it=(G.sp3=(G.sp3||0)+1)<4?1.2:4+R()*3;if(IT.length<4)spawnIT()}updIT(dt);
 for(const e of ents)if(e.hp>0){if(e.pi!=null){const k=S.p[e.pi].k;e.in=NET.role=='host'&&NET.remote[e.pi]?NET.remote[e.pi]:{l:K[k.l]||e.pi==0&&TOUCH.l,r:K[k.r]||e.pi==0&&TOUCH.r,j:K[k.j]||e.pi==0&&TOUCH.j,d:K[k.d]||e.pi==0&&TOUCH.d,s:K[k.s]||e.pi==0&&TOUCH.s,m:K[k.m]||e.pi==0&&TOUCH.m}}else if(e.z)zom(e,dt);else if(e.B)bossAI(e,dt);else bot(e,dt);upd(e,dt)}else if(e.dd>0){e.dd-=dt;e.in={};upd(e,dt);if(e.dd<=0)fx(e.x,e.y-24,14,'#d8d8d8',140)}
 updP(dt);ents=ents.filter(e=>e.hp>0||e.pi!=null||e.dd>0);
 if(G.mode=='solo'||G.mode=='duel'||G.mode=='v12'||G.mode=='v22'){const al=t=>ents.filter(e=>e.tm==t&&e.hp>0&&!e.cl).length,a=al(0),b=al(1),c3=al(2),na=(a>0)+(b>0)+(c3>0);
  if(!G.ov&&na<2){G.ov=2.2;G.bt=2.2;if(na){const w=a?0:b?1:2;G.sc[w]++;G.bn=G.demo?'':'ПОБЕДА: '+tn(w)}else G.bn='НИЧЬЯ'}
  if(G.ov){G.ov-=dt;if(G.ov<=0){G.ov=0;if(!G.demo&&G.sc.some(v=>v>=G.need))endMatch();else nextRound()}}}
 else{if(G.mode=='zomb'&&!G.ov){if(G.q>0){G.zt-=dt;if(G.zt<=0){G.zt=Math.max(.4,1.2-G.wv*.06);G.q--;spawnZ()}}else if(!ents.some(e=>e.z&&e.hp>0)){G.bk=(G.bk??2.5)-dt;if(G.bk<=0){G.bk=null;nextWave()}}}
  if(G.mode=='boss'&&!G.ov&&G.bo.hp<=0){G.ov=3;G.lv++;G.bn='БОСС ПОВЕРЖЕН!';G.bt=3}
  if(!G.ov&&!ents.some(e=>e.pi!=null&&e.hp>0)){G.ov=2;G.lost=1;G.bn='ПОРАЖЕНИЕ';G.bt=2}
  if(G.ov){G.ov-=dt;if(G.ov<=0){G.ov=0;G.lost?endMatch():nextRound()}}}}
