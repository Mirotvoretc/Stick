function teslaFire(e,dm){
 const sx=e.x+e.f*24*e.sz,sy=e.y-38*e.sz;
 let first=null,best=1e9;
 for(const o of ents){if(o.hp<=0||o.tm==e.tm)continue;const dx=o.x-sx,dy=o.y-o.h*.5-sy,d=Math.hypot(dx,dy);if(dx*e.f>0&&d<560&&Math.abs(dy)<170&&d<best){best=d;first=o}}
 if(!first){spark(sx,sy,16,'#63eaff');return}
 hit(first,dm,e,e.f*220);
 ZP.push({x1:sx,y1:sy,x2:first.x,y2:first.y-first.h*.5,life:.24,c:'#63eaff'});
 let second=null,bd=190;
 for(const o of ents){if(o===first||o.hp<=0||o.tm==e.tm)continue;const d=Math.hypot(o.x-first.x,o.y-o.h*.5-(first.y-first.h*.5));if(d<bd){bd=d;second=o}}
 if(second){hit(second,Math.round(dm*.62),e,(Math.sign(second.x-first.x)||1)*130);ZP.push({x1:first.x,y1:first.y-first.h*.5,x2:second.x,y2:second.y-second.h*.5,life:.2,c:'#b8f8ff'})}
 fx(first.x,first.y-first.h*.5,14,'#63eaff',280);G.sh=Math.max(G.sh,5)
}
function updFields(dt){
 if(G.timeField){const f=G.timeField;f.life-=dt;if(f.life<=0)G.timeField=null;else for(const e of ents)if(e.hp>0&&e.tm!=f.tm&&Math.hypot(e.x-f.x,e.y-e.h*.5-f.y)<285)e.tslow=Math.max(e.tslow||0,.22)}
 if(G.gravityField){const f=G.gravityField;f.life-=dt;f.pulse=(f.pulse||0)+dt;const progress=cl(1-f.life/f.duration,0,1);f.max=36+Math.pow(progress,.78)*1755;const pullPower=2015;for(const e of ents)if(e.hp>0&&e.tm!=f.tm){const dx=f.x-e.x,dy=f.y-(e.y-e.h*.5),d=Math.hypot(dx,dy);if(d<f.max&&d>4){const force=(1-d/f.max)*pullPower;e.vx+=dx/d*force*dt;e.vy+=dy/d*force*dt;if(R()<dt*18)PT.push({x:e.x+(R()-.5)*e.w,y:e.y-e.h*.5+(R()-.5)*e.h,vx:dx/d*90,vy:dy/d*90,g:0,l:.42,c:R()<.5?'#d5b0ff':'#72d9ff',r:2+R()*3})}}for(const p of P)if(p.t!='x'&&p.life>0){const dx=f.x-p.x,dy=f.y-p.y,d=Math.hypot(dx,dy);if(d<f.max&&d>4){const force=(1-d/f.max)*pullPower;p.vx+=dx/d*force*dt;p.vy+=dy/d*force*dt}}
  if(f.life<=0){for(const e of ents)if(e.hp>0&&e.tm!=f.tm)hit(e,9000,f.src,Math.sign(e.x-f.x||1)*900);fx(f.x,f.y,220,'#b98cff',1050);fx(f.x,f.y,150,'#8deaff',900);fx(f.x,f.y,90,'#ffffff',720);RG.push({x:f.x,y:f.y,l:2.8,big:1});G.gravityBlast={x:f.x,y:f.y,t:0,life:3.2};G.sh=Math.max(G.sh,35);G.gravityField=null}}
 if(G.gravityBlast){G.gravityBlast.t+=dt;if(G.gravityBlast.t>=G.gravityBlast.life)G.gravityBlast=null}
}
function drawFields(){
 if(G.timeField){const f=G.timeField,r=285,k=.12+.06*Math.sin(G.t*8);cx.save();cx.globalCompositeOperation='lighter';cx.strokeStyle='#8b91ff';cx.globalAlpha=.7;cx.lineWidth=3;cx.beginPath();cx.arc(f.x,f.y,r,0,7);cx.stroke();cx.globalAlpha=.16+k;cx.fillStyle='#8b91ff';cx.beginPath();cx.arc(f.x,f.y,r,0,7);cx.fill();for(let i=0;i<12;i++){const a=G.t*.8+i*Math.PI/6;cx.fillStyle='#d8dcff';cx.beginPath();cx.arc(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,4,0,7);cx.fill()}cx.restore()}
 if(G.gravityField){const f=G.gravityField,t=G.t,p=cl(1-f.life/f.duration,0,1),r=f.max*(.96+.035*Math.sin(t*7));cx.save();cx.globalCompositeOperation='lighter';
  let halo=cx.createRadialGradient(f.x,f.y,Math.max(2,r*.025),f.x,f.y,r);halo.addColorStop(0,'#05020d');halo.addColorStop(.13,'#120928');halo.addColorStop(.28,'#6c38ad99');halo.addColorStop(.52,'#bc83ff38');halo.addColorStop(1,'#8b5bff00');cx.fillStyle=halo;cx.beginPath();cx.arc(f.x,f.y,r,0,7);cx.fill();
  for(let i=0;i<5;i++){cx.save();cx.translate(f.x,f.y);cx.rotate(t*(i%2?-.42:.56)+i*.52);cx.scale(1,.22+i*.055);cx.strokeStyle=i%2?'#7bdcff':'#e1a8ff';cx.globalAlpha=.38+i*.07;cx.lineWidth=10-i;cx.beginPath();cx.ellipse(0,0,r*(.47+i*.055),r*(.25+i*.026),0,0,7);cx.stroke();cx.restore()}
  for(let i=0;i<34;i++){const a=t*(i%2?1.6:-1.2)+i*2.399,d=r*(.22+((i*37)%73)/100),sz=1.6+(i%4);cx.fillStyle=i%3?'#d9b6ff':'#8cecff';cx.globalAlpha=.35+.45*Math.abs(Math.sin(t*4+i));cx.beginPath();cx.arc(f.x+Math.cos(a)*d,f.y+Math.sin(a)*d*.45,sz,0,7);cx.fill()}
  cx.globalAlpha=1;const core=(14+Math.pow(p,.85)*210)*1.3;let disk=cx.createRadialGradient(f.x,f.y,Math.max(2,core*.25),f.x,f.y,Math.min(core*1.9,r*.8));disk.addColorStop(0,'#020108');disk.addColorStop(.31,'#070512');disk.addColorStop(.43,'#17102b');disk.addColorStop(.53,'#ffc27d');disk.addColorStop(.61,'#b66aff');disk.addColorStop(.72,'#4bd9ff99');disk.addColorStop(1,'#4bd9ff00');cx.fillStyle=disk;cx.beginPath();cx.arc(f.x,f.y,Math.min(core*1.9,r*.8),0,7);cx.fill();
  for(let i=0;i<4;i++){cx.save();cx.translate(f.x,f.y);cx.rotate(t*(i%2?1.8:-1.35)+i*.55);cx.scale(1,.28+i*.04);cx.strokeStyle=i%2?'#7deaff':'#ffc58d';cx.globalAlpha=.82-i*.12;cx.lineWidth=4-i*.45;cx.beginPath();cx.ellipse(0,0,(108+i*25)*1.3,(66+i*13)*1.3,0,0,7);cx.stroke();cx.restore()}
  cx.globalAlpha=1;cx.fillStyle='#020107';cx.beginPath();cx.arc(f.x,f.y,core*.72+Math.sin(t*11)*3,0,7);cx.fill();cx.strokeStyle='#f0c5ff';cx.lineWidth=3.5;cx.globalAlpha=.98;cx.beginPath();cx.arc(f.x,f.y,core*.78+Math.sin(t*11)*3,0,7);cx.stroke();
  for(let i=0;i<8;i++){const a=t*2+i*Math.PI/4;cx.strokeStyle=i%2?'#a9e9ff':'#f5c1ff';cx.globalAlpha=.7;cx.lineWidth=2.5;cx.beginPath();cx.moveTo(f.x+Math.cos(a)*112,f.y+Math.sin(a)*49);cx.quadraticCurveTo(f.x+Math.cos(a+.4)*r*.52,f.y+Math.sin(a+.4)*r*.3,f.x+Math.cos(a+1.1)*r*.82,f.y+Math.sin(a+1.1)*r*.52);cx.stroke()}
  cx.globalAlpha=.12+.1*Math.sin(t*15);cx.fillStyle='#b98cff';cx.fillRect(0,0,W,H);cx.restore()}
  if(G.gravityBlast){const b=G.gravityBlast,t=b.t,fade=Math.max(0,1-t/b.life),grow=Math.min(1,t/.88),r=35+Math.pow(grow,.72)*3487.5,flash=Math.max(0,1-t/.28);cx.save();cx.globalCompositeOperation='lighter';
   const shock=cx.createRadialGradient(b.x,b.y,Math.max(2,r*.35),b.x,b.y,r);shock.addColorStop(0,`rgba(255,255,255,${.22*fade})`);shock.addColorStop(.18,`rgba(224,174,255,${.22*fade})`);shock.addColorStop(.42,`rgba(105,205,255,${.13*fade})`);shock.addColorStop(1,'rgba(100,50,180,0)');cx.fillStyle=shock;cx.fillRect(0,0,W,H);
   for(let i=0;i<5;i++){const radius=r*(.22+i*.17),alpha=fade*(.88-i*.12);cx.strokeStyle=i%2?'#8feaff':'#edc2ff';cx.globalAlpha=alpha;cx.lineWidth=(18-i*2.4)*(1-grow*.35);cx.beginPath();cx.arc(b.x,b.y,radius,0,7);cx.stroke()}
   cx.globalAlpha=fade*.62;for(let i=0;i<26;i++){const a=i*Math.PI*2/26+t*(i%2?-.8:.65),len=95+(i%5)*32;cx.strokeStyle=i%3?'#d6b2ff':'#a3eaff';cx.lineWidth=2+(i%3);cx.beginPath();cx.moveTo(b.x+Math.cos(a)*Math.max(15,r*.16),b.y+Math.sin(a)*Math.max(15,r*.16));cx.lineTo(b.x+Math.cos(a)*(r*.62+len),b.y+Math.sin(a)*(r*.62+len));cx.stroke()}
   if(flash>0){const fg=cx.createRadialGradient(b.x,b.y,0,b.x,b.y,260+flash*240);fg.addColorStop(0,`rgba(255,255,255,${.95*flash})`);fg.addColorStop(.24,`rgba(239,206,255,${.72*flash})`);fg.addColorStop(.58,`rgba(138,202,255,${.28*flash})`);fg.addColorStop(1,'rgba(130,80,210,0)');cx.fillStyle=fg;cx.fillRect(0,0,W,H)}
   cx.globalAlpha=fade*.9;cx.fillStyle='#fff';cx.beginPath();cx.arc(b.x,b.y,Math.max(2,44*(1-grow)),0,7);cx.fill();cx.restore()}
 for(const z of ZP){const k=Math.max(0,z.life/.24);cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=k;cx.strokeStyle=z.c;cx.lineWidth=8*k+2;cx.beginPath();cx.moveTo(z.x1,z.y1);const mx=(z.x1+z.x2)/2+(R()-.5)*24,my=(z.y1+z.y2)/2+(R()-.5)*24;cx.lineTo(mx,my);cx.lineTo(z.x2,z.y2);cx.stroke();cx.strokeStyle='#ffffff';cx.lineWidth=2*k;cx.stroke();cx.restore()}
}
function startMapEvent(){if(M&&M.event===false){G.ev=null;return}const spec=MAP_EVENTS[G.mi]||MAP_EVENTS[0];G.ev={...spec,timer:7+R()*5,warning:0,active:0,x:W*.5,dir:R()<.5?-1:1,tick:0,serial:0,fallY:-80,rocks:[]}}
function eventImpact(ev,x,damage=24,radius=120){fx(x,GY-8,36,ev.c,420);fx(x,GY-8,18,'#ffda9a',320);RG.push({x,y:GY-12,l:.55,big:1});G.sh=Math.max(G.sh,7);for(const e of ents)if(e.hp>0&&Math.abs(e.x-x)<radius&&e.y>GY-235)hit(e,damage,null,(Math.sign(e.x-x)||1)*250)}
function triggerMapEvent(ev){ev.serial++;ev.x=140+R()*(W-280);ev.active=0;ev.tick=0;ev.hitDone=0;
 if(ev.type=='meteor'){ev.active=1.25;ev.fallY=-95;ev.hitX=ev.x;G.sh=Math.max(G.sh,2)}
 else if(ev.type=='rockfall'){ev.active=2.2;ev.rocks=Array.from({length:4},(_,i)=>({x:cl(ev.x+(R()-.5)*300,70,W-70),y:-80-R()*210,vy:80+R()*100,done:0}));G.sh=Math.max(G.sh,3)}
 else if(ev.type=='eruption'){ev.active=3.1;ev.tick=.08;fx(ev.x,GY-5,42,'#ff623d',420);fx(ev.x,GY-5,24,'#ffc04d',300);RG.push({x:ev.x,y:GY-8,l:.55,big:1});G.sh=Math.max(G.sh,5)}
 else if(ev.type=='bridge'){ev.active=1.5;ev.tick=.05;G.sh=Math.max(G.sh,5);for(let i=0;i<22;i++)PT.push({x:ev.x+(R()-.5)*280,y:GY-10,vx:(R()-.5)*240,vy:-80-R()*250,g:650,l:.5+R()*.5,c:R()<.5?'#d4a36d':'#8d6040',r:3+R()*4});for(const e of ents)if(e.hp>0&&Math.abs(e.x-ev.x)<190){e.vx+=(Math.sign(e.x-ev.x)||1)*(100+R()*80);if(e.og)hit(e,8,null,(Math.sign(e.x-ev.x)||1)*120)}}
 else if(ev.type=='gravity'){ev.active=4.5;G.sh=Math.max(G.sh,3)}
 else if(['gust','icegust','sandstorm'].includes(ev.type)){ev.active=4;ev.dir=R()<.5?-1:1;ev.tick=0;G.sh=Math.max(G.sh,2)}
 else if(ev.type=='dark'){ev.active=4.5;G.sh=Math.max(G.sh,1)}
 else if(ev.type=='roots'||ev.type=='vines'){ev.active=3.6;ev.tick=0;fx(ev.x,GY-4,22,ev.c,240);G.sh=Math.max(G.sh,2)}
}
function updEvent(dt){const ev=G.ev;if(!ev||G.demo||G.pause||G.end)return;if(ev.impactLife>0)ev.impactLife=Math.max(0,ev.impactLife-dt);
 if(ev.warning>0){ev.warning-=dt;if(ev.warning<=0)triggerMapEvent(ev)}
 if(ev.active>0){ev.active-=dt;
  if(ev.type=='meteor'&&!ev.hitDone){ev.fallY+=940*dt;const catcher=ents.find(o=>o.hp>0&&Math.abs(o.x-ev.hitX)<o.w*.5+30&&ev.fallY>=o.y-o.h-30&&ev.fallY<=o.y+24);if(catcher){ev.hitDone=1;ev.active=0;ev.impactX=ev.hitX;ev.impactY=ev.fallY;ev.impactLife=.82;hit(catcher,30,null,Math.sign(catcher.x-ev.hitX||ev.dir||1)*460,.22,1);TX.push({x:catcher.x,y:catcher.y-catcher.h-22,t:'ПОПАДАНИЕ МЕТЕОРИТА · -30',l:1.2,c:'#ff9b55'});fx(ev.hitX,ev.fallY,42,'#ff9b55',560);fx(ev.hitX,ev.fallY,20,'#fff0b8',360);RG.push({x:ev.hitX,y:ev.fallY,l:.75,big:1});G.sh=Math.max(G.sh,14);return;}if(R()<dt*65)PT.push({x:ev.hitX+(R()-.5)*18,y:ev.fallY,vx:(R()-.5)*35,vy:120,g:0,l:.28,c:'#ffb36a',r:2+R()*3});if(ev.fallY>=GY-42){ev.hitDone=1;ev.impactX=ev.hitX;ev.impactY=GY-18;ev.impactLife=.82;eventImpact(ev,ev.hitX,26,125);ev.active=Math.max(ev.active,.45)}}
  if(ev.type=='rockfall'){for(const rock of ev.rocks){if(rock.done)continue;rock.vy+=720*dt;rock.y+=rock.vy*dt;if(rock.y>=GY-28){rock.done=1;eventImpact(ev,rock.x,18,88);for(let k=0;k<8;k++)PT.push({x:rock.x,y:GY-12,vx:(R()-.5)*220,vy:-80-R()*180,g:600,l:.35+R()*.35,c:'#c8a27b',r:2+R()*3})}else if(R()<dt*34)PT.push({x:rock.x+(R()-.5)*10,y:rock.y,vx:(R()-.5)*45,vy:80,g:0,l:.25,c:'#c4a17a',r:2+R()*2})}if(ev.rocks.every(r=>r.done))ev.active=Math.min(ev.active,.25)}
  if(ev.type=='eruption'){ev.tick-=dt;if(ev.tick<=0){ev.tick=.28;for(let k=0;k<25;k++){const a=-Math.PI/2+(R()-.5)*1.05,v=220+R()*500;PT.push({x:ev.x+(R()-.5)*42,y:GY-8,vx:Math.cos(a)*v,vy:Math.sin(a)*v-190,g:560,l:.7+R()*.9,c:['#ff321b','#ff6924','#ff9d32','#ffd05a','#fff0a2'][R()*5|0],r:3+R()*6})}for(let k=0;k<10;k++)PT.push({x:ev.x+(R()-.5)*90,y:GY-10,vx:(R()-.5)*95,vy:-80-R()*120,g:-35,l:.8+R()*.5,c:'#4c302a',r:5+R()*8});RG.push({x:ev.x,y:GY-6,l:.42,big:1});G.sh=Math.max(G.sh,3.2);for(const e of ents)if(e.hp>0&&e.og&&Math.abs(e.x-ev.x)<145)hit(e,9,null,(Math.sign(e.x-ev.x)||1)*115)}}
  if(['gust','icegust','sandstorm'].includes(ev.type)){for(const e of ents)if(e.hp>0)e.vx+=ev.dir*(ev.type=='sandstorm'?110:ev.type=='icegust'?180:145)*dt;ev.tick-=dt;if(ev.tick<=0){ev.tick=.08;for(let i=0;i<(ev.type=='sandstorm'?5:3);i++){const y=70+R()*500;PT.push({x:ev.dir>0?-12:W+12,y,vx:ev.dir*(ev.type=='sandstorm'?360:ev.type=='icegust'?480:390),vy:(R()-.5)*35,g:0,l:.6,c:ev.type=='icegust'?'#bfefff':ev.type=='sandstorm'?'#e5bd82':'#a8dff0',r:ev.type=='sandstorm'?2+R()*3:1.5+R()*2})}}}
  if(ev.type=='roots'||ev.type=='vines'){ev.tick-=dt;if(ev.tick<=0){ev.tick=.3;for(const e of ents)if(e.hp>0&&Math.abs(e.x-ev.x)<(ev.type=='vines'?125:95)&&e.og){st(e,'sl',ev.type=='vines'?.55:.42);if(ev.type=='vines')e.vx+=(Math.sign(e.x-ev.x)||1)*-55}}}
 }
 if(ev.active<=0&&ev.warning<=0){ev.timer-=dt;if(ev.timer<=0){ev.warning=1.45;ev.x=140+R()*(W-280);ev.timer=13+R()*5;ev.hitDone=0;TX.push({x:W/2,y:150,t:ev.name.toUpperCase(),l:1.3,c:ev.c})}}
}
function drawEvent(){const ev=G.ev;if(!ev||G.demo)return;cx.save();cx.lineCap='round';cx.lineJoin='round';
  if(ev.warning>0){const p=1-ev.warning/1.45,pulse=.55+.45*Math.sin(G.t*17);cx.save();cx.globalCompositeOperation='lighter';const gx=cx.createRadialGradient(ev.x,GY-16,4,ev.x,GY-16,180);gx.addColorStop(0,ev.c+'66');gx.addColorStop(1,ev.c+'00');cx.fillStyle=gx;cx.fillRect(ev.x-180,GY-196,360,196);cx.strokeStyle=ev.c;cx.globalAlpha=.45+.45*pulse;cx.lineWidth=3+2*pulse;cx.beginPath();cx.ellipse(ev.x,GY-8,52+92*p,13+20*p,0,0,7);cx.stroke();cx.setLineDash([10,8]);cx.lineWidth=2;cx.beginPath();cx.moveTo(ev.x,GY-190);cx.lineTo(ev.x,GY-22);cx.stroke();cx.setLineDash([]);cx.fillStyle=ev.c;cx.globalAlpha=.8;cx.beginPath();cx.arc(ev.x,GY-13,6+5*pulse,0,7);cx.fill();cx.restore();cx.globalAlpha=.96;cx.fillStyle='#080b16d9';cx.strokeStyle=ev.c;cx.lineWidth=2;cx.beginPath();cx.roundRect(W/2-195,92,390,52,13);cx.fill();cx.stroke();cx.fillStyle='#fff';cx.font='bold 11px system-ui';cx.textAlign='center';cx.fillText('ВНИМАНИЕ · СОБЫТИЕ НАЧИНАЕТСЯ',W/2,111);cx.font='bold 18px system-ui';cx.fillStyle=ev.c;cx.fillText(ev.name.toUpperCase(),W/2,132)}
 if(ev.type=='meteor'&&ev.impactLife>0)drawMeteorImpact(ev);
 if(ev.active>0){
  if(ev.type=='meteor'&&!ev.hitDone){const y=ev.fallY;cx.save();cx.globalCompositeOperation='lighter';const trail=cx.createLinearGradient(ev.hitX-10,y-8,ev.hitX+28,y+230);trail.addColorStop(0,'#fff7d9');trail.addColorStop(.12,'#ffd16cdd');trail.addColorStop(.38,'#ff793d99');trail.addColorStop(1,'#e5452400');cx.fillStyle=trail;cx.beginPath();cx.moveTo(ev.hitX-15,y-5);cx.quadraticCurveTo(ev.hitX-80,y+72,ev.hitX-25,y+240);cx.quadraticCurveTo(ev.hitX+8,y+178,ev.hitX+32,y+230);cx.quadraticCurveTo(ev.hitX+30,y+92,ev.hitX+13,y-8);cx.closePath();cx.fill();cx.restore();drawAsteroid(ev.hitX,y,25,G.t*5.4,true,ev.serial||1)}
  if(ev.type=='rockfall'){for(let i=0;i<ev.rocks.length;i++){const rock=ev.rocks[i];if(!rock.done)drawAsteroid(rock.x,rock.y,18+(i%2)*4,G.t*(i%2?3.8:-4.4)+i*.7,false,i+2)}}
  if(ev.type=='eruption'){cx.save();cx.globalCompositeOperation='lighter';const pulse=.83+.17*Math.sin(G.t*18),x=ev.x;let g=cx.createRadialGradient(x,GY-5,4,x,GY-5,275);g.addColorStop(0,'#fff9d2');g.addColorStop(.18,'#ffb13fee');g.addColorStop(.48,'#ff562cbb');g.addColorStop(1,'#ff281000');cx.fillStyle=g;cx.beginPath();cx.ellipse(x,GY-20,246*pulse,138,0,Math.PI,Math.PI*2);cx.fill();for(let i=0;i<11;i++){const xx=x+(i-5)*24+Math.sin(G.t*8+i)*12,h=115+((i*47+Math.floor(G.t*21)%90)%185),w=11+(i%3)*4;g=cx.createLinearGradient(xx,GY,xx,GY-h);g.addColorStop(0,'#ff321b');g.addColorStop(.35,i%2?'#ff7528':'#ffc04b');g.addColorStop(.78,'#ffe18a');g.addColorStop(1,'#fff8ca00');cx.fillStyle=g;cx.beginPath();cx.moveTo(xx-w,GY);cx.bezierCurveTo(xx-w*2,GY-h*.35,xx+w*1.8,GY-h*.72,xx+Math.sin(G.t*10+i)*7,GY-h);cx.bezierCurveTo(xx+w*2,GY-h*.68,xx+w*2,GY-h*.3,xx+w,GY);cx.closePath();cx.fill()}cx.globalAlpha=.48;cx.strokeStyle='#ffb34d';cx.lineWidth=4;for(let i=-4;i<=4;i++){cx.beginPath();cx.moveTo(x+i*19,GY-4);cx.lineTo(x+i*32+(i%2?10:-10),GY-32-Math.abs(i)*4);cx.stroke()}cx.globalAlpha=.7;for(let i=0;i<5;i++){const xx=x+(i-2)*36+Math.sin(G.t*3+i)*12;cx.fillStyle='#53352c';cx.beginPath();cx.ellipse(xx,GY-125-i%2*27,24+i*3,10+i*2,0,0,7);cx.fill()}cx.restore()}
  if(ev.type=='bridge'){cx.globalAlpha=.3+.18*Math.sin(G.t*30);cx.fillStyle='#d6a36f';cx.fillRect(0,GY-8,W,15);cx.globalAlpha=.9;for(let i=0;i<22;i++){const x=i*62+(G.t*110%62);cx.strokeStyle=i%2?'#3d281c':'#ffd09a';cx.lineWidth=i%2?3:1.5;cx.beginPath();cx.moveTo(x,GY-18);cx.lineTo(x+18,GY+7);cx.stroke()}}
  if(ev.type=='dark'){cx.globalAlpha=.68;cx.fillStyle='#08091c';cx.fillRect(0,0,W,H);cx.globalAlpha=.95;const g=cx.createRadialGradient(W-150,116,8,W-150,116,90);g.addColorStop(0,'#050713');g.addColorStop(.55,'#a5b3ff55');g.addColorStop(1,'#a5b3ff00');cx.fillStyle=g;cx.beginPath();cx.arc(W-150,116,90,0,7);cx.fill();cx.strokeStyle='#a5b3ff';cx.lineWidth=5;cx.beginPath();cx.arc(W-150,116,48,0,7);cx.stroke();cx.fillStyle='#08091c';cx.beginPath();cx.arc(W-128,100,43,0,7);cx.fill()}
  if(ev.type=='gravity'){cx.globalAlpha=.2;cx.fillStyle='#38145b';cx.fillRect(0,0,W,H);cx.globalCompositeOperation='lighter';for(let i=0;i<8;i++){cx.strokeStyle=i%2?'#e4baff':'#75ddff';cx.globalAlpha=.3+i*.055;cx.lineWidth=4-i*.25;cx.beginPath();cx.ellipse(W/2,H/2,175+i*78,54+i*27,G.t*(i%2?1:-1)+i*.2,0,7);cx.stroke()}const vg=cx.createRadialGradient(W/2,H/2,10,W/2,H/2,190);vg.addColorStop(0,'#010107');vg.addColorStop(.38,'#070311');vg.addColorStop(.55,'#a55ce8aa');vg.addColorStop(.72,'#5bcff966');vg.addColorStop(1,'#5bcff900');cx.fillStyle=vg;cx.beginPath();cx.arc(W/2,H/2,190,0,7);cx.fill();cx.strokeStyle='#f0c4ff';cx.lineWidth=5;cx.globalAlpha=.9;cx.beginPath();cx.ellipse(W/2,H/2,112,45,G.t*1.3,0,7);cx.stroke();cx.fillStyle='#020107';cx.beginPath();cx.arc(W/2,H/2,78,0,7);cx.fill()}
  if(ev.type=='icegust'||ev.type=='sandstorm'||ev.type=='gust'){const sand=ev.type=='sandstorm',ice=ev.type=='icegust';cx.globalAlpha=sand?.22:ice?.13:.1;cx.fillStyle=sand?'#c58a4f':ice?'#9deaff':'#a8dff0';cx.fillRect(0,0,W,H);cx.globalAlpha=sand?.48:.35;cx.strokeStyle=ev.c;cx.lineWidth=sand?5:ice?3.5:3;for(let i=0;i<22;i++){const y=25+i*31,x=(G.t*(sand?500:ice?560:430)*ev.dir+i*173)%(W+340)-170;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x-ev.dir*(sand?220:ice?175:130),y-(sand?16:8));cx.stroke()}if(ice){cx.globalAlpha=.5;for(let i=0;i<12;i++){const x=(i*113+G.t*170*ev.dir+W)%W,y=(i*59+G.t*90)%H;cx.strokeStyle='#e5fbff';cx.lineWidth=2;cx.beginPath();cx.moveTo(x-7,y-7);cx.lineTo(x+7,y+7);cx.moveTo(x+7,y-7);cx.lineTo(x-7,y+7);cx.stroke()}}}
  if(ev.type=='roots'||ev.type=='vines'){cx.globalAlpha=.85;cx.strokeStyle=ev.c;cx.lineWidth=ev.type=='vines'?8:10;for(let i=-4;i<=4;i++){const x=ev.x+i*(ev.type=='vines'?20:25),h=(ev.type=='vines'?200:165)+Math.sin(G.t*5+i)*16;cx.beginPath();cx.moveTo(x,GY);cx.bezierCurveTo(x-35,GY-h*.2,x+35,GY-h*.68,x+Math.sin(G.t*6+i)*15,GY-h);cx.stroke();for(const q of[-1,1]){cx.fillStyle=ev.type=='vines'?'#9cf27e':'#b9df78';cx.beginPath();cx.ellipse(x+q*15,GY-h*.52,13,5,q*.6,0,7);cx.fill()}}}
   cx.globalAlpha=.94;cx.fillStyle='#080b16c9';cx.strokeStyle=ev.c;cx.lineWidth=2;cx.beginPath();cx.roundRect(W/2-174,92,348,38,10);cx.fill();cx.stroke();cx.fillStyle=ev.c;cx.font='bold 15px system-ui';cx.textAlign='center';cx.fillText(ev.name.toUpperCase(),W/2,117)}
 cx.restore()}
function fire(e){const w=WP[e.wp],x=e.x+e.f*22*e.sz,y=e.y-38*e.sz,crit=!!(CH[e.ch].brawler&&e.wp=='fist'&&R()<.10),dm=w.dm*(e.rg?2:CH[e.ch].dm||1)*(e.dm||1)*(e.boost>0&&CH[e.ch].assault?1:1)*(crit?3:1);e.cd=w.cd;if(crit){TX.push({x:e.x,y:e.y-e.h-24,t:'КРИТИЧЕСКИЙ УДАР!',l:1,c:'#ffd166'});fx(e.x+e.f*34,e.y-35,20,'#ffd166',280)}
 if(w.t=='k'){e.sw=.3;let nh=0;const air=!e.og&&e.wp=='hamm';for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&Math.abs(o.x-e.x-e.f*(w.cx||36))<(w.rn||60)+o.w/2&&o.y>e.y-100&&o.y-o.h<e.y+8){nh++;hit(o,air?dm*1.1:dm,e,e.f*(e.wp=='hamm'?(air?1200:900):420))}fx(e.x+e.f*46,e.y-34,12,'#fff',320);spark(e.x+e.f*46,e.y-34,8,'#fff');if(air&&nh){RG.push({x:e.x+e.f*46,y:e.y-20,l:.3});G.sh=Math.max(G.sh,10)}if(e.wp=='katana'&&nh){e.katHits=(e.katHits||0)+1;if(e.katHits>=10)brk(e)}else if(e.wp!='katana')use(e);return}
 if(w.t=='x'){e.rbow={t:0,a:null,dur:5.2,r:0};TX.push({x:e.x,y:e.y-e.h-20,t:'РАДУЖНАЯ СФЕРА!',l:1.1,c:'#ff9ae6'});use(e);return}
 if(w.t=='l'){e.chg=w.ch;return}
 if(w.t=='e'){teslaFire(e,dm);use(e);return}
 if(w.t=='m'){e.mirror=15;fx(e.x,e.y-e.h*.5,26,'#a8e9ff',300);TX.push({x:e.x,y:e.y-e.h-20,t:'ЗЕРКАЛО · 15 СЕК',l:1.1,c:'#a8e9ff'});use(e);return}
 if(w.t=='u'){G.timeField={x:e.x,y:e.y-e.h*.5,tm:e.tm,life:10,src:e};fx(e.x,e.y-e.h*.5,35,'#8b91ff',360);TX.push({x:e.x,y:e.y-e.h-20,t:'ВРЕМЯ ЗАМЕДЛЕНО',l:1.1,c:'#aeb2ff'});use(e);return}
 if(w.t=='v'){const gx=cl(e.x+e.f*215,210,W-210),gy=cl(e.y-e.h*.6-36,155,GY-120);G.gravityField={x:gx,y:gy,tm:e.tm,life:5.4,duration:5.4,max:36,dm:9000,src:e,pulse:0};fx(gx,gy,12,'#b98cff',120);fx(gx,gy,7,'#75dcff',90);TX.push({x:e.x,y:e.y-e.h-20,t:'ГРАВИТАЦИОННЫЙ КОЛЛАПС',l:1.4,c:'#e0baff'});G.sh=Math.max(G.sh,7);use(e);return}
 e.rc=.1;fx(x,y,3,'#fff1b0',150);if(w.t=='b'&&!w.pel)PT.push({x:e.x,y:y+4,vx:-e.f*(50+R()*80),vy:-220,l:.7,c:'#d9b44a',r:2});for(let i=0;i<(w.pel||1);i++){const a=(R()-.5)*(w.sp||0)*2-(w.t=='s'?.1:w.t=='g'?.45:0);pr({x,y,vx:Math.cos(a)*w.v*e.f,vy:Math.sin(a)*w.v,dm,tm:e.tm,t:w.t,col:w.c,life:w.life||(w.t=='r'?3.6:w.t=='q'?3.2:1.6),src:e,g:w.t=='s'?600:w.t=='g'?900:w.t=='n'?250:0,fz:w.fz})}
 e.vx-=e.f*(w.pel?240:w.t=='r'?140:0);use(e)}
function beam(e){if(e.wp!='laser'||e.hp<=0)return;const x=e.x+e.f*24*e.sz,y=e.y-38*e.sz,dm=WP.laser.dm*(e.rg?2:CH[e.ch].dm||1)*(e.dm||1)*(e.boost>0&&CH[e.ch].assault?1.12:1);BM.push({x,y,f:e.f,l:.25});G.sh=Math.max(G.sh,7);fx(x,y,10,'#d46bff',300);
 for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&(o.x-x)*e.f>0&&y>o.y-o.h-8&&y<o.y+4)hit(o,dm,e,e.f*380);use(e)}
function boom(p){fx(p.x,p.y,30,'#ffb347',380);fx(p.x,p.y,14,'#666',200);G.sh=Math.max(G.sh,12);RG.push({x:p.x,y:p.y,l:.3});
 for(const o of ents)if(o.hp>0){const d=Math.hypot(o.x-p.x,o.y-o.h/2-p.y),r=125+o.w*.5;if(d<r)hit(o,p.dm*(1-d/r*.55),p.src,Math.sign(o.x-p.x||1)*420)}}
function upd(e,dt){const c=CH[e.ch],I=(e.fz>0||(e.ramTimer||0)>0)?{}:e.in;e.ramTimer=Math.max(0,(e.ramTimer||0)-dt);e.cd-=dt*(e.tslow>0?.45:1);e.batTimer=Math.max(0,(e.batTimer||0)-dt);e.batFlash=Math.max(0,(e.batFlash||0)-dt);e.fz-=dt;e.mirror=Math.max(0,(e.mirror||0)-dt);e.tslow=Math.max(0,(e.tslow||0)-dt);e.fl-=dt;e.dr-=dt;e.sw-=dt;e.rc-=dt;e.rf-=dt;e.kc-=dt;e.sl-=dt;e.boost=Math.max(0,(e.boost||0)-dt);e.mark=Math.max(0,(e.mark||0)-dt);if(e.ch==11&&e.hp>0){e.damageClock=(e.damageClock||0)+dt;if(e.damageClock>=15){e.regenClock=(e.regenClock||0)+dt;if(e.regenClock>=1.5){const n=Math.floor(e.regenClock/1.5);e.regenClock-=n*1.5;e.hp=Math.min(e.mh,e.hp+n);TX.push({x:e.x,y:e.y-e.h-10,t:'+'+n,l:.7,c:'#8de6a0'});fx(e.x,e.y-e.h*.55,4,'#8de6a0',100)}}}if(e.rb)rbUpd(e,dt);if(e.rbow)rbowUpd(e,dt);if(c.med&&e.hp>0){e.mt=Math.min(20,(e.mt||0)+dt);if(e.mt>=20&&e.hp<e.mh){e.mt=0;e.hp=Math.min(e.mh,e.hp+10);TX.push({x:e.x,y:e.y-e.h-10,t:'+10',l:.8,c:'#7ee08a'});fx(e.x,e.y-e.h/2,8,'#7ee08a',140)}}if(c.rage&&e.hp>0){const q=e.hp/e.mh;if(q>=.45)e.rgd=0;if(!e.rg&&!e.rgd&&q<.45){e.rg=1;fx(e.x,e.y-e.h/2,24,'#ff3b3b',420);G.sh=Math.max(G.sh,8);TX.push({x:e.x,y:e.y-e.h-24,t:'ЯРОСТЬ!',l:1.2,c:'#ff6b4a'})}if(e.rg){dot(e,2*dt,'#ff8a7a');if(R()<dt*30)pf(e,'#ff3b3b',-120,-50);if(e.hp<=e.mh*.2){e.rg=0;e.rgd=1}}}if(e.bn>0){e.bn-=dt;dot(e,7*dt,'#ff9a2e');if(R()<dt*30)pf(e,R()<.5?'#ff9a2e':'#ffd25a',-150,-60)}if(e.br>0){e.br-=dt;dot(e,3*e.bl*dt,'#ff5a6a');if(R()<dt*(8+e.bl*7))PT.push({x:e.x+(R()-.5)*12,y:e.y-R()*e.h*.8,vx:(R()-.5)*40,vy:-20,l:.55,c:'#c1121f',r:1.8+R()});if(e.br<=0)e.bl=0}if(e.sl>0&&R()<dt*14)pf(e,'#9fe3ff',20,-10);if(e.fz>0&&R()<dt*12)pf(e,'#e6f8ff',30,10);if(e.zk=='f'&&R()<dt*25)pf(e,'#ff9a2e',-150,-60);if(e.zk=='i'&&R()<dt*10)pf(e,'#bfeaff',20,10);
 if(e.chg>0){e.chg-=dt;if(e.chg<=0)beam(e)}
 const t=(e.ramTimer>0?0:(I.r?1:0)-(I.l?1:0)),sp=261*(c.sp||1)*(e.spm||1)*(e.boost>0?1.58:1)*(e.chg>0?.25:1)*(e.wp=='mini'&&e.cd>0?.6:1)*(e.sl>0?.5:1)*(e.rb?(e.rb.t<1.5?.1:.55):1)*(e.tslow>0?.38:1)*(e.batTimer>0?.72:1);e.wallKick=Math.max(0,(e.wallKick||0)-dt);
 if(e.ramTimer>0){e.vx=(e.ramDir||e.f||1)*1040;e.vy=0;e.y=e.ramY}else if(e.wallKick<=0)e.vx+=(t*sp-e.vx)*Math.min(1,dt*(e.og?(M.ic?3.5:14):5));else e.vx*=Math.max(0,1-dt*1.1);if(t&&e.wallKick<=0)e.f=t;if(e.fo&&e.ramTimer<=0)e.f=e.fo;
 if(I.j&&!e.pj&&e.batTimer<=0){if(e.og){const support=e.y<GY-12&&platformForPoint(e.x,e.y+6);if(c.acrobat&&support){const dir=(I.r?1:0)-(I.l?1:0);e.vy=-900;e.vx+=dir?dir*360:-e.f*190;e.f=dir||e.f;e.wallKick=.28;G.sh=Math.max(G.sh,6);fx(e.x,e.y-8,28,'#a9efff',360);fx(e.x,e.y-8,14,'#ffffff',230);RG.push({x:e.x,y:e.y-10,l:.42,big:1});TX.push({x:e.x,y:e.y-e.h-18,t:'ОТСКОК ОТ ПЛАТФОРМЫ',l:.9,c:'#a9efff'})}else e.vy=-(e.B?860:e.ai?790:720)*(c.jm||1);e.dj=c.acrobat?0:(c.dj||0)}else if(c.acrobat){const wall=e.x<=17?-1:e.x>=W-17?1:0;let edge=null;for(const p of M.pl){const side=e.x<p[0]?p[0]:p[0]+p[2];if(Math.abs(e.x-side)<24&&e.y>p[1]-20&&e.y-e.h<p[1]+38&&(!edge||Math.abs(e.x-side)<edge.d))edge={side,d:Math.abs(e.x-side)}}if(wall||edge){const away=wall?-wall:(e.x<edge.side?-1:1);e.vy=-820;e.vx=away*560;e.f=away;e.wallKick=.26;G.sh=Math.max(G.sh,5);fx(e.x,e.y-28,22,'#a9efff',330);TX.push({x:e.x,y:e.y-e.h-16,t:'ОТСКОК ОТ ПОВЕРХНОСТИ',l:.8,c:'#a9efff'})}}else if(e.dj>0){e.vy=-650;e.dj--;fx(e.x,e.y,8,'#fff',120)}}e.pj=I.j;
 if(I.d&&e.batTimer<=0&&e.og&&e.y<GY)e.dr=.22;
 if(I.s&&e.cd<=0&&e.chg<=0&&!e.rb)fire(e);
 if(I.m&&!e.pm&&e.kc<=0){if(c.brawler){e.kc=17;e.ramTimer=.9;e.ramDir=e.f||1;e.ramY=e.y;e.ramHit=0;e.vx=e.ramDir*1040;e.vy=0;G.sh=Math.max(G.sh,6);fx(e.x,e.y-28,26,'#ffb05c',360);TX.push({x:e.x,y:e.y-e.h-18,t:'ТАРАН!',l:.9,c:'#ffd08a'})}else if(c.med){e.kc=12;pr({x:e.x+e.f*14,y:e.y-44*e.sz,vx:e.f*340+e.vx*.3,vy:-420,g:900,tm:e.tm,t:'h',life:4,src:e});TX.push({x:e.x,y:e.y-e.h-14,t:'АПТЕЧКА',l:.7,c:'#7ee08a'})}else if(c.vampire){e.kc=15;e.batTimer=3;e.vx*=.35;e.vy*=.2;fx(e.x,e.y-e.h*.5,28,'#b78cff',300);fx(e.x,e.y-e.h*.5,18,'#f3d9ff',220);TX.push({x:e.x,y:e.y-e.h-18,t:'ФОРМА ЛЕТУЧЕЙ МЫШИ · 3 СЕК',l:1.1,c:'#d8b5ff'})}else if(c.engineer){e.kc=13;const mine=TUR.filter(t=>t.tm==e.tm).sort((a,b)=>a.life-b.life);if(mine.length>=2)mine[0].life=Math.min(mine[0].life,0.15);TUR.push({x:cl(e.x+e.f*48,28,W-28),y:e.y,tm:e.tm,life:8.5,maxLife:8.5,cd:.18,range:620,dmg:17,angle:e.f>0?0:Math.PI,c:e.c,src:e});fx(e.x,e.y-8,18,'#8ce5ff',260);TX.push({x:e.x,y:e.y-e.h-14,t:'УСИЛЕННАЯ ТУРЕЛЬ!',l:1,c:'#8ce5ff'})}else if(c.duelist){e.kc=12;e.mirror=1.35;fx(e.x,e.y-e.h*.5,18,'#b5f5ff',260);const marked=ents.filter(o=>o.hp>0&&o.tm!=e.tm&&Math.hypot(o.x-e.x,o.y-o.h*.5-(e.y-e.h*.5))<520).sort((a,b)=>(b.mh+(b.B?3000:0)+(b.z?350:0))-(a.mh+(a.B?3000:0)+(a.z?350:0))).slice(0,3);for(const o of marked){o.mark=4;o.markTeam=e.tm;fx(o.x,o.y-o.h*.5,18,'#ffcf58',300);TX.push({x:o.x,y:o.y-o.h-18,t:'МЕТКА · ×1,5',l:1,c:'#ffd166'})}TX.push({x:e.x,y:e.y-e.h-14,t:'ПАРИРОВАНИЕ + МЕТКИ',l:1,c:'#b5f5ff'})}else if(c.assault){e.kc=16;WALLS=WALLS.filter(w=>w.tm!=e.tm);WALLS.push({x:cl(e.x,140,W-140),y:cl(e.y-142,150,GY-95),bottom:e.y,tm:e.tm,src:e,life:5,hp:50,max:50});fx(e.x,e.y-75,32,'#ffb05a',360);TX.push({x:e.x,y:e.y-e.h-14,t:'ЗАЩИТНЫЙ БАРЬЕР · 50',l:1,c:'#ffb05a'})}}e.pm=I.m;
 if(e.ramTimer>0){e.vy=0;e.y=e.ramY}else{if(e.batTimer>0){const fly=(I.d?1:0)-(I.j?1:0);e.vy+=(fly*260-e.vy)*Math.min(1,dt*5)}e.vy+=1600*dt*(M.gv||1)*(e.batTimer>0?.025:1)*(G.ev&&G.ev.type=='gravity'&&G.ev.active>0?.42:1)*(e.vy>0?(c.fg||1):1);if(c.sf&&e.vy>170)e.vy=170}const px=e.x,py=e.y,w0=e.og,v0=e.vy,edge=e.B?Math.min(W*.25,e.w*.58+12):14;e.x=cl(e.x+e.vx*dt,edge,W-edge);if(e.ramTimer<=0)e.y+=e.vy*dt;if(e.z||e.B)blockMonsterByWalls(e,px,py);e.og=0;
 if(e.batTimer>0){if(e.y>GY-24){e.y=GY-24;e.vy=-40}}else if(e.y>=GY){e.y=GY;e.vy=0;e.og=1}else if(e.vy>=0&&e.dr<=0)for(const p of M.pl)if(e.x>p[0]-4&&e.x<p[0]+p[2]+4&&py<=p[1]+1&&e.y>=p[1]){e.y=p[1];e.vy=0;e.og=1}
 if(e.ramTimer>0&&!e.ramHit){if(e.x<=edge+1||e.x>=W-edge-1)e.ramTimer=0;else{for(const o of ents){if(o===e||o.hp<=0||o.tm===e.tm)continue;if(Math.abs(o.x-e.x)<(o.w+e.w)*.5+8&&Math.abs((o.y-o.h*.5)-(e.y-e.h*.5))<(o.h+e.h)*.42){e.ramHit=1;e.ramTimer=0;e.vx=e.ramDir*150;hit(o,20,e,e.ramDir*760,.9,1);fx(o.x,o.y-o.h*.5,24,'#ffbd69',340);TX.push({x:o.x,y:o.y-o.h-20,t:'ТАРАН · -20',l:.9,c:'#ffd08a'});break}}}if(e.ramTimer>0&&R()<dt*42)PT.push({x:e.x-e.ramDir*18,y:e.y-27,vx:-e.ramDir*(80+R()*90),vy:-20-R()*45,g:0,l:.28,c:'#ffb05c',r:2+R()*2})}
 if(e.og&&!w0&&v0>420){fx(e.x,e.y,7,'#ffffff77',120);if(c.slam)tslam(e)}if(e.og&&Math.abs(e.vx)>200&&R()<dt*16)PT.push({x:e.x-Math.sign(e.vx)*8,y:e.y-1,vx:-e.vx*.1,vy:-25,g:0,l:.3,c:'#ffffff66',r:2+R()*2});if(e.ch==3&&Math.abs(e.vx)>120&&R()<dt*40)pf(e,'#cfeaff',0,-10);e.ph+=Math.abs(e.vx)*dt*.07}
function near(e){let t=null,b=1e9;for(const o of ents)if(o.hp>0&&o.tm!=e.tm){const d=Math.abs(o.x-e.x)+Math.abs(o.y-e.y)*.6;if(d<b){b=d;t=o}}return t}
function platformForPoint(x,y){let best=null,bd=1e9;for(const p of M.pl){if(x<p[0]-16||x>p[0]+p[2]+16)continue;const d=Math.abs(p[1]-y);if(d<58&&d<bd){bd=d;best=p}}return best}
function aiNavigate(e,x,y,I,dt){
 const goal=platformForPoint(x,y);let current=-1;
 for(let i=0;i<M.pl.length;i++){const p=M.pl[i];if(e.x>=p[0]-12&&e.x<=p[0]+p[2]+12&&Math.abs(e.y-p[1])<22){current=i;break}}
 if(e.og)e.aiPlatform=current;else if(e.aiPlatform!=null)current=e.aiPlatform;
 const goalIndex=goal?M.pl.indexOf(goal):-1,currentY=current<0?GY:M.pl[current][1],goalY=goal?goal[1]:y+8;
 if(y<e.y-48&&currentY>goalY+18&&goalIndex>=0){
  const nodes=[[0,GY,W],...M.pl],from=current+1,to=goalIndex+1,prev=Array(nodes.length).fill(-1),queue=[from];prev[from]=from;
  for(let q=0;q<queue.length&&prev[to]<0;q++){
   const a=queue[q],pa=nodes[a];
   for(let b=1;b<nodes.length;b++){
    if(prev[b]>=0||b==a)continue;
    const pb=nodes[b],rise=pa[1]-pb[1],gap=Math.max(0,pb[0]-(pa[0]+pa[2]),pa[0]-(pb[0]+pb[2]));
    if(rise>18&&rise<=185&&gap<=315&&pb[2]>e.w+22){prev[b]=a;queue.push(b)}
   }
  }
  if(prev[to]>=0&&from!==to){
   let path=[to];while(path[0]!=from)path.unshift(prev[path[0]]);
   const next=nodes[path[1]],margin=e.w*.65+8,landingX=cl(x,next[0]+margin,next[0]+next[2]-margin),dx=landingX-e.x,rise=currentY-next[1];
   I.l=0;I.r=0;if(Math.abs(dx)>16)(dx>0?I.r=1:I.l=1);
   if(e.og&&e.aiJumpCd<=0&&Math.abs(dx)<225&&rise<=185){I.j=1;e.aiJumpCd=.78}
   return 1;
  }
  let best=null,bestScore=1e9;
  for(const p of M.pl){const rise=e.y-p[1],gap=Math.max(0,p[0]-e.x,e.x-(p[0]+p[2]));if(rise>18&&rise<=185&&gap<300&&p[2]>e.w+22){const land=cl(x,p[0]+e.w*.65+8,p[0]+p[2]-e.w*.65-8),score=Math.abs(land-e.x)+Math.abs(p[1]-goalY)*.45;if(score<bestScore){bestScore=score;best={p,land,rise}}}}
  if(best){const dx=best.land-e.x;I.l=0;I.r=0;if(Math.abs(dx)>16)(dx>0?I.r=1:I.l=1);if(e.og&&e.aiJumpCd<=0&&Math.abs(dx)<225){I.j=1;e.aiJumpCd=.85}return 1}
 }
 if(y>e.y+78&&e.og&&e.y<GY-12)I.d=1;
 return 0;
}
function bot(e,dt){const I=e.in={};e.at=(e.at||0)-dt;e.ai=e.ai||['aggressive','cautious','collector'][R()*3|0];e.aiJumpCd=Math.max(0,(e.aiJumpCd||0)-dt);
 if(e.at<=0){e.at=.16+R()*.16;e.tg=near(e);e.pk=null;let best=1e9;for(const i of IT){if(e.ch==11&&!i.kit)continue;const d=Math.abs(i.x-e.x)+Math.abs(i.y-e.y)*.65;const useful=i.kit?e.hp<e.mh*.82:(e.wp=='fist'||e.am<=2||e.ai=='collector');if(useful&&d<best&&d<900){best=d;e.pk=i}}}
 const t=e.tg&&e.tg.hp>0?e.tg:near(e),item=e.pk&&IT.includes(e.pk)?e.pk:null;
 const needsItem=item&&(e.ai=='collector'||e.wp=='fist'||e.am<=2||item.kit&&e.hp<e.mh*.82);
 if(needsItem&&(!t||e.ai=='collector'||e.wp=='fist')){const dx=item.x-e.x,dy=item.y-e.y;e.fo=Math.sign(dx)||e.f;const nav=aiNavigate(e,item.x,item.y,I,dt);if(!nav&&Math.abs(dx)>28)(dx>0?I.r=1:I.l=1);if(Math.abs(dx)<38&&Math.abs(dy)<90){if(item.kit&&e.hp<e.mh*.7)I.j=0;else if(item.wp&&item.wp=='rain')I.j=0}return}
 if(!t)return;const dx=t.x-e.x,dy=t.y-e.y,ad=Math.abs(dx),weapon=e.wp,melee=['fist','katana','hamm'].includes(weapon),short=['shot','fire','tesla','harpoon','boomerang'].includes(weapon),range=melee?58:short?190:weapon=='snip'||weapon=='laser'?470:350;
 e.fo=Math.sign(dx)||e.f;const navigating=aiNavigate(e,t.x,t.y,I,dt);
 if(!navigating&&e.ai=='cautious'){
  if(ad<range*.72){dx>0?I.l=1:I.r=1}else if(ad>range*1.05){dx>0?I.r=1:I.l=1}
  if(ad<150&&e.og&&e.aiJumpCd<=0&&Math.abs(dy)<55&&R()<dt*1.2){I.j=1;e.aiJumpCd=.75}
 }else if(!navigating&&e.ai=='collector'){
  if(ad>range*.9){dx>0?I.r=1:I.l=1}else if(ad<range*.5&&melee){dx>0?I.r=1:I.l=1}
  if(ad<90&&e.og&&e.aiJumpCd<=0&&Math.abs(dy)<55&&R()<dt*.8){I.j=1;e.aiJumpCd=.8}
 }else if(!navigating){
  if(ad>range*.8){dx>0?I.r=1:I.l=1}else if(ad<range*.35&&melee){dx>0?I.l=1:I.r=1}
  if(ad<130&&e.og&&e.aiJumpCd<=0&&Math.abs(dy)<55&&R()<dt*1.2){I.j=1;e.aiJumpCd=.75}
 }
 if(!navigating&&dy>90&&e.og&&e.y<GY-12)I.d=1;
 const vertical=Math.abs(dy)<(melee?100:170);if(vertical&&ad<(melee?95:range+80)&&e.cd<=0)I.s=1;
 if(e.ch==5&&e.hp<e.mh*.72&&e.kc<=0)I.m=1;
 if(e.ch==7&&e.kc<=0&&ad>90&&ad<430)I.m=1;
 if(e.ch==8&&e.kc<=0&&P.some(p=>p.tm!=e.tm&&Math.hypot(p.x-e.x,p.y-e.y)<190))I.m=1;
 if(e.ch==9&&e.kc<=0&&ad<range*1.35)I.m=1;
}
function zom(e,dt){const I=e.in={},t=near(e);if(!t)return;if(e.eliteType==='spitter'){e.eliteCd=Math.max(0,(e.eliteCd||0)-dt);const dx=t.x-e.x,dy=(t.y-t.h*.5)-(e.y-e.h*.55),ad=Math.abs(dx);if(e.eliteCd<=0&&ad<560&&ad>150&&Math.abs(dy)<250){e.eliteCd=3.8+R()*1.2;const a=Math.atan2(dy,dx),v=390;pr({x:e.x,y:e.y-e.h*.55,vx:Math.cos(a)*v,vy:Math.sin(a)*v,dm:8+G.wv*.85,tm:e.tm,col:'#b58cff',t:'w',life:2.8,src:e});fx(e.x,e.y-e.h*.55,12,'#b58cff',180)}if(ad<150){dx>0?I.l=1:I.r=1}else if(ad>360){dx>0?I.r=1:I.l=1}if(e.og&&t.y<e.y-75&&e.aiJumpCd<=0){I.j=1;e.aiJumpCd=1.1}return;}if((e.zRecoil||0)>0){e.zRecoil=Math.max(0,e.zRecoil-dt);return}const dx=t.x-e.x;dx>0?I.r=1:I.l=1;e.zJumpCd=Math.max(0,(e.zJumpCd||0)-dt);if(t.y-e.y<-70&&e.og&&e.zJumpCd<=0){I.j=1;e.zJumpCd=1.05}if(t.y-e.y>75&&e.y<GY&&e.og&&e.zDropCd<=0){I.d=1;e.zDropCd=.7}else e.zDropCd=Math.max(0,(e.zDropCd||0)-dt);
 if(Math.abs(dx)<12+e.w/2&&t.y>e.y-e.h&&t.y-t.h<e.y&&e.cd<=0){e.cd=1.45;e.zRecoil=.42;hit(t,e.dmg,e,e.f*540);t.vy-=165;e.vx=-e.f*165;if(e.zk=='i')st(t,'sl',1.1);if(e.zk=='f')st(t,'bn',.95)}}
function bossDamage(e,amount){return Math.round(amount*(e.awakened?1.72:e.rageMode?1.36:1))}
function bossPhaseCheck(e){
 if(!e.B||G.mode!='boss'||G.lv<5||e.phaseRolled||e.hp<=0||e.hp/e.mh>=.5)return;
 e.phaseRolled=1;
 const roll=R();
 if(roll<.05){
  e.awakened=1;e.rageMode=0;e.hp=Math.min(e.mh,Math.max(e.hp,e.mh*.72));e.bossActionLock=1.8;e.bt=1.5;e.bossHazards=[];
  e.awakenedCd1=2.2;e.awakenedCd2=4.4;e.awakenedCd3=6.5;
  G.bn='ПРОБУЖДЕНИЕ!';G.bt=2.8;G.sh=Math.max(G.sh,24);RG.push({x:e.x,y:e.y-e.h*.5,l:1.2,big:1});
  fx(e.x,e.y-e.h*.5,100,'#f4d8ff',720);fx(e.x,e.y-e.h*.5,70,'#ffcf67',560);
  TX.push({x:e.x,y:e.y-e.h-42,t:'БОСС ПРОБУДИЛСЯ',l:2,c:'#ffe6a1'});
 }else if(roll<.35){
  e.rageMode=1;e.bossActionLock=1.2;e.bt=1.2;
  G.bn='РЕЖИМ ЯРОСТИ!';G.bt=2.3;G.sh=Math.max(G.sh,16);RG.push({x:e.x,y:e.y,l:.85,big:1});
  fx(e.x,e.y-e.h*.5,70,'#ff3b43',560);TX.push({x:e.x,y:e.y-e.h-35,t:'БОСС В ЯРОСТИ',l:1.6,c:'#ff626b'});
 }
}
function bossHazard(e,x,y,delay,radius,damage,color,kind='circle',width=76){
 if(!e.bossHazards)e.bossHazards=[];
 e.bossHazards.push({x,y,t:delay,delay,r:radius,d:bossDamage(e,damage),c:color,kind,width,flash:0});
 TX.push({x,y:y-24,t:kind=='line'?'ОПАСНАЯ ЛИНИЯ':'ОПАСНАЯ ЗОНА',l:Math.min(1.3,delay),c:color});
}
function bossUpdateHazards(e,dt){
 if(!e.bossHazards)return;
 for(const h of e.bossHazards){
  if(h.t>0){h.t-=dt;if(h.t<=0){
   RG.push({x:h.x,y:h.y,l:.55,big:1});fx(h.x,h.y,34,h.c,440);G.sh=Math.max(G.sh,7);
   for(const o of ents){if(o.hp<=0||o.tm==e.tm||o.pi==null)continue;let inside=false;
    if(h.kind=='line')inside=Math.abs(o.y-o.h*.5-h.y)<h.width&&Math.abs(o.x-h.x)<h.r;
    else if(h.kind=='column')inside=Math.abs(o.x-h.x)<h.width&&o.y>h.y-h.r&&o.y<h.y+h.r;
    else inside=Math.hypot(o.x-h.x,o.y-o.h*.5-h.y)<h.r+o.w*.35;
    if(inside)hit(o,h.d,e,Math.sign(o.x-h.x||1)*260);
   }
   h.flash=.28;
  }}else if(h.flash>0)h.flash-=dt;
 }
 e.bossHazards=e.bossHazards.filter(h=>h.t>0||h.flash>0);
}
function bossDashUpdate(e,t,dt){
 e.bossDashCd=Math.max(0,(e.bossDashCd||0)-dt);
 e.bossDashDecision=Math.max(0,(e.bossDashDecision||0)-dt);
 const previousDashWind=e.bossDashWind||0;e.bossDashWind=Math.max(0,previousDashWind-dt);
 if(previousDashWind>0&&e.bossDashWind<=0){
  e.bossDashWind=0;e.bossDashActive=.42;e.bossDashHits=[];const dir=e.bossDashDir||e.f||1;
  e.vx=dir*(e.awakened?1580:e.rageMode?1450:1280);e.vy=Math.min(e.vy,0);e.wallKick=.42;
  e.bossActionLock=Math.max(e.bossActionLock||0,2.4);G.sh=Math.max(G.sh,8);
  fx(e.x+dir*38,e.y-25,34,'#ff4d65',360);TX.push({x:e.x,y:e.y-e.h-18,t:'РЫВОК БОССА!',l:.85,c:'#ff667a'});
 }
 if(e.bossDashActive>0){
  e.bossDashActive=Math.max(0,e.bossDashActive-dt);
  for(const o of ents){if(o.hp<=0||o.pi==null||o.tm==e.tm)continue;const ids=e.bossDashHits||(e.bossDashHits=[]);if(ids.includes(o.nid))continue;
   if(Math.abs(o.x-e.x)<e.w*.5+o.w*.5+24&&Math.abs((o.y-o.h*.5)-(e.y-e.h*.5))<e.h*.55){ids.push(o.nid);hit(o,bossDamage(e,36),e,(e.bossDashDir||e.f)*680)}
  }
 }
 if(e.bossDashCd>0||e.bossDashWind>0||e.bossDashActive>0||e.bossActionLock>0||e.bossDashDecision>0)return;
 const ahead=t&&t.hp>0&&(t.x-e.x)*(e.fo||e.f)>55&&Math.abs((t.y-t.h*.5)-(e.y-e.h*.5))<230&&Math.abs(t.x-e.x)<640;
 e.bossDashDecision=.42;
 if(ahead&&R()<.2){e.bossDashCd=e.awakened?5.4:6.8;e.bossDashWind=.58;e.bossDashDir=e.fo||e.f||1;e.vx=0;
  TX.push({x:cl(e.x+e.bossDashDir*210,60,W-60),y:e.y-e.h-42,t:'ПРИГОТОВЬСЯ К РЫВКУ!',l:.58,c:'#ff5668'});
  RG.push({x:cl(e.x+e.bossDashDir*210,60,W-60),y:e.y-20,l:.6,big:1});
 }
}
function bossFireFan(e,t,count,spread,speed,damage,color,type='w'){
 const sx=e.x+e.fo*48,sy=e.y-e.h*.58,aim=Math.atan2(t.y-t.h*.48-sy,t.x-sx),d=bossDamage(e,damage);
 for(let i=0;i<count;i++){const a=aim+(i-(count-1)/2)*spread,v=speed+R()*45;pr({x:sx,y:sy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,dm:d,tm:e.tm,col:color,t:type,life:3.8,src:e})}
 fx(sx,sy,24,color,280);
}
function bossSpacing(e,t,I,min,max){
 const dx=t.x-e.x,ad=Math.abs(dx),toward=Math.sign(dx)||e.fo||1;
 let mode=e.bossMoveMode||0;
 if(ad>max+28)mode=1;
 else if(ad<min-28)mode=-1;
 else if(ad>=min+18&&ad<=max-18)mode=0;
 e.bossMoveMode=mode;
 I.l=0;I.r=0;
 if(mode===1)(toward>0?I.r=1:I.l=1);
 else if(mode===-1)(toward>0?I.l=1:I.r=1);
 if(ad>28)e.fo=toward;
}
function bossNavigatePlatform(e,t,I,dt){
 if(!t||!e.og||t.y>=e.y-78||e.bossDashWind>0||e.bossDashActive>0)return false;
 const route={l:0,r:0,j:0,d:0};
 if(!aiNavigate(e,t.x,t.y,route,dt))return false;
 I.l=route.l;I.r=route.r;I.d=route.d;if(route.j)I.j=1;
 e.bossMoveMode=0;
 return true;
}
function bossAI(e,dt){
 const I=e.in={},players=ents.filter(o=>o.pi!=null&&o.hp>0);let nearest=null,best=1e12;
 for(const o of players){const d=Math.hypot(o.x-e.x,(o.y-o.h*.5)-(e.y-e.h*.5));if(d<best){best=d;nearest=o}}
 let t=players.find(o=>o.nid===e.bossTargetNid)||null;
 if(!t||t.hp<=0){t=nearest;e.bossTargetNid=t?t.nid:null}
 else if(nearest&&nearest!==t){const lockedDistance=Math.hypot(t.x-e.x,(t.y-t.h*.5)-(e.y-e.h*.5)),nearestDistance=Math.hypot(nearest.x-e.x,(nearest.y-nearest.h*.5)-(e.y-e.h*.5));if(nearestDistance+135<lockedDistance){t=nearest;e.bossTargetNid=t.nid}}
 if(!t)return;
 bossUpdateHazards(e,dt);
 e.bossActionLock=Math.max(0,(e.bossActionLock||0)-dt);
 e.aiJumpCd=Math.max(0,(e.aiJumpCd||0)-dt);
 const dx=t.x-e.x,ad=Math.abs(dx),spec=BOSS_TYPES.find(b=>b.id==e.btype)||BOSS_TYPES[0];
 if(ad>28)e.fo=dx>0?1:-1;
 const phaseSpeed=e.awakened?1.58:e.rageMode?1.3:1;
 const rate=e.awakened?.62:e.rageMode?.78:1;
 e.spm=(spec.speed+.025*Math.min(G.lv,8))*phaseSpeed;
 e.bt=(e.bt??2)-dt;

 if(e.btype=='warlord'){
  e.warlordSlashCd=Math.max(0,(e.warlordSlashCd||0)-dt);
  bossSpacing(e,t,I,205,315)
  if(!e.awakened){
   if(e.bt<=0){e.bt=(6.2+R()*1.6)*rate;bossFireFan(e,t,9,.13,410,8,'#b58aff');e.bossActionLock=.9;TX.push({x:e.x,y:e.y-e.h-26,t:'ТЕНЕВОЙ ЗАЛП',l:.9,c:'#d8baff'})}
   e.warlordWindup=(e.warlordWindup||0)-dt;
   if(e.warlordWindup<=0&&(e.warlordSlashCd||0)<=0&&e.bt<3){e.warlordWindup=.82;e.warlordSlashCd=7.4*rate;e.bossActionLock=1;TX.push({x:e.x,y:e.y-e.h-25,t:'РАЗРЕЗ ТЕНИ!',l:.82,c:'#e0caff'})}
   if(e.warlordWindup>0){e.warlordWindup-=dt;if(e.warlordWindup<=0){const dir=e.fo;pr({x:e.x+dir*50,y:e.y-e.h*.54,vx:dir*850,vy:(t.y-t.h*.5-(e.y-e.h*.54))*.9,dm:bossDamage(e,43),tm:e.tm,col:'#7d42c8',src:e,t:'w',life:2.2,shadowWave:1});fx(e.x+dir*46,e.y-e.h*.54,36,'#d8aaff',400)}}
  }else{
   e.awakenedCd1=(e.awakenedCd1??2)-dt;e.awakenedCd2=(e.awakenedCd2??4)-dt;e.awakenedCd3=(e.awakenedCd3??6)-dt;
   if(e.awakenedCd1<=0){e.awakenedCd1=7.2*rate;const sx=e.x+e.fo*54,sy=e.y-e.h*.55;for(let i=0;i<7;i++){const a=(i-3)*.14;for(const sign of[-1,1])pr({x:sx,y:sy,vx:Math.cos(a+sign*.48)*690,vy:Math.sin(a+sign*.48)*690,dm:bossDamage(e,42),tm:e.tm,col:'#d9a4ff',src:e,t:'w',life:2.6})}G.sh=Math.max(G.sh,9);TX.push({x:e.x,y:e.y-e.h-28,t:'ЭКЛИПТИЧЕСКИЙ КРЕСТ',l:1.1,c:'#e6caff'});e.bossActionLock=1}
   if(e.awakenedCd2<=0){e.awakenedCd2=9.4*rate;for(const o of players){bossHazard(e,cl(o.x+(R()-.5)*170,55,W-55),GY-20,.95,118,58,'#c37dff','circle')}TX.push({x:W/2,y:150,t:'РАЗРЫВЫ ТЕНИ',l:1.1,c:'#ce9dff'});e.bossActionLock=1.2}
   if(e.awakenedCd3<=0){e.awakenedCd3=11.5*rate;const a=R()*Math.PI*2;for(let i=0;i<16;i++){const ang=a+i*Math.PI*2/16,v=460;pr({x:e.x,y:e.y-e.h*.55,vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,dm:bossDamage(e,35),tm:e.tm,col:'#9b5bda',src:e,t:'c',life:4})}G.sh=Math.max(G.sh,12);e.bossActionLock=1}
  }
 }else if(e.btype=='colossus'){
  bossSpacing(e,t,I,95,195)
  if(!e.awakened){
   if(e.bt<=0&&e.og){e.bt=5.2*rate;e.vy=-1020*(e.rageMode?1.12:1);e.vx=Math.sign(dx)*460;e.colossusSlam=.55;e.colossusSlamArmed=1;e.bossActionLock=1.1;TX.push({x:e.x,y:e.y-e.h-18,t:'СОКРУШАЮЩИЙ ПРЫЖОК',l:1,c:'#e5c28d'});fx(e.x,e.y,30,'#e5c28d',350)}
   if(e.colossusSlamArmed){e.colossusSlam=Math.max(0,(e.colossusSlam||0)-dt);if(e.colossusSlam<=0&&e.og){e.colossusSlamArmed=0;G.sh=Math.max(G.sh,18);RG.push({x:e.x,y:e.y,l:.7,big:1});for(const dir of[-1,1])pr({x:e.x+dir*34,y:e.y-22,vx:dir*560,vy:-20,dm:bossDamage(e,34),tm:e.tm,col:'#dcb783',src:e,t:'w',life:2.1,g:90});for(const o of players)if(Math.abs(o.x-e.x)<255&&o.y>e.y-160)hit(o,bossDamage(e,30),e,Math.sign(o.x-e.x||1)*500)}}
  }else{
   e.awakenedCd1=(e.awakenedCd1??2)-dt;e.awakenedCd2=(e.awakenedCd2??4)-dt;e.awakenedCd3=(e.awakenedCd3??7)-dt;
   if(e.awakenedCd1<=0){e.awakenedCd1=7.6*rate;for(let i=0;i<5;i++){const x=cl(t.x+(i-2)*118+(R()-.5)*60,60,W-60);bossHazard(e,x,GY-20,.9,92,52,'#e7c28d','circle')}e.bossActionLock=1.15;TX.push({x:W/2,y:140,t:'КАМЕННЫЙ ЛИВЕНЬ',l:1,c:'#f0d2a0'})}
   if(e.awakenedCd2<=0){e.awakenedCd2=9.8*rate;for(let i=-1;i<=1;i++)pr({x:e.x+e.fo*48,y:e.y-45,vx:e.fo*(520+i*95),vy:-120+Math.abs(i)*75,dm:bossDamage(e,48),tm:e.tm,col:'#e9c18c',src:e,t:'w',life:3,g:520});for(const o of players)bossHazard(e,cl(o.x,70,W-70),GY-14,1,150,68,'#f2c58a','circle');e.bossActionLock=1.2}
   if(e.awakenedCd3<=0){e.awakenedCd3=12*rate;for(let i=0;i<4;i++)bossHazard(e,110+i*460,GY-150,.82,230,58,'#c69a69','column',70);e.bossActionLock=1.2;TX.push({x:W/2,y:150,t:'РАЗЛОМ АРЕНЫ',l:.9,c:'#f0c58f'})}
  }
 }else if(e.btype=='necromancer'){
  bossSpacing(e,t,I,325,475)
  if(!e.awakened){
   e.summon=(e.summon??7)-dt;const summoned=ents.filter(o=>o.z&&o.hp>0).length;
   if(e.summon<=0&&summoned<9){e.summon=11.5+R()*2;const count=Math.min(2+(R()<.48?1:0),9-summoned);for(let i=0;i<count;i++)spawnZ(G.lv*1.5,e.x+(i-(count-1)/2)*76,e.y);fx(e.x,e.y-48,54,'#a24dff',480);fx(e.x,e.y-48,28,'#f0d7ff',330);TX.push({x:e.x,y:e.y-e.h-20,t:'ПРИЗЫВ ДУХОВ',l:1.1,c:'#d9a0ff'});e.bossActionLock=1}
   if(e.bt<=0){e.bt=3.8*rate;bossFireFan(e,t,5,.19,390,27,'#bc8cff','c');e.bossActionLock=.65}
  }else{
   e.awakenedCd1=(e.awakenedCd1??2)-dt;e.awakenedCd2=(e.awakenedCd2??4)-dt;e.awakenedCd3=(e.awakenedCd3??6)-dt;
   if(e.awakenedCd1<=0){e.awakenedCd1=9*rate;const count=Math.min(5,10-ents.filter(o=>o.z&&o.hp>0).length);for(let i=0;i<count;i++){spawnZ(G.lv*2.4,e.x+(i-(count-1)/2)*80,e.y);const z=ents[ents.length-1];z.hp*=1.7;z.mh=z.hp;z.spm*=1.25;z.dmg*=1.55;z.c='#d8a0ff';z.zk='b'}fx(e.x,e.y-50,64,'#d0a0ff',520);TX.push({x:e.x,y:e.y-e.h-24,t:'АРМИЯ ПРОБУЖДЁННЫХ',l:1.2,c:'#e7caff'});e.bossActionLock=1.2}
   if(e.awakenedCd2<=0){e.awakenedCd2=8*rate;const base=Math.atan2(t.y-t.h*.5-(e.y-e.h*.55),t.x-e.x);for(let i=0;i<12;i++){const a=base+i*Math.PI*2/12,v=410;pr({x:e.x,y:e.y-e.h*.55,vx:Math.cos(a)*v,vy:Math.sin(a)*v,dm:bossDamage(e,38),tm:e.tm,col:'#d9a0ff',src:e,t:'c',life:4.5})}e.bossActionLock=1}
   if(e.awakenedCd3<=0){e.awakenedCd3=10.5*rate;for(let i=0;i<3;i++)bossHazard(e,cl(t.x+(i-1)*145,55,W-55),cl(t.y-t.h*.5+(i-1)*55,120,GY-35),.75,165,64,'#ad72ff','circle');TX.push({x:W/2,y:145,t:'ПОГЛОЩЕНИЕ ДУШ',l:1,c:'#e1c5ff'});e.bossActionLock=1.1}
  }
 }else if(e.btype=='electric'){
  bossSpacing(e,t,I,225,350)
  if(!e.awakened){
   if(e.elTimer>0){e.elTimer-=dt;if(e.elTimer<=0){const tx=e.elX,ty=e.elY;if(!blockEnemyBeam(e.x,e.y-70,tx,ty)){ZP.push({x1:e.x,y1:e.y-70,x2:tx,y2:ty,life:.4,c:'#63eaff'});for(let k=-1;k<=1;k++)ZP.push({x1:tx,y1:ty,x2:tx+k*(100+R()*30),y2:GY,life:.32,c:'#b6f7ff'});for(const o of players)if(Math.hypot(o.x-tx,o.y-o.h*.5-ty)<125)hit(o,bossDamage(e,42),e,(Math.sign(o.x-tx)||1)*340);fx(tx,ty,42,'#63eaff',500)}G.sh=Math.max(G.sh,10)}}
   if(e.bt<=0&&e.elTimer<=0){e.bt=4.5*rate;e.elTimer=.78;e.elX=t.x;e.elY=t.y-t.h*.5;TX.push({x:e.elX,y:e.elY-25,t:'ПРИЦЕЛ МОЛНИИ',l:.8,c:'#8feeff'});e.bossActionLock=1}
  }else{
   e.awakenedCd1=(e.awakenedCd1??2)-dt;e.awakenedCd2=(e.awakenedCd2??4)-dt;e.awakenedCd3=(e.awakenedCd3??6)-dt;
   if(e.awakenedCd1<=0){e.awakenedCd1=8*rate;for(let i=0;i<5;i++)bossHazard(e,100+i*350,GY-10,.86,140,55,'#63eaff','column',62);e.bossActionLock=1.1;TX.push({x:W/2,y:145,t:'ГРОЗОВАЯ СЕТКА',l:1,c:'#9bf4ff'})}
   if(e.awakenedCd2<=0){e.awakenedCd2=9.2*rate;let chain=players.slice().sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y)).slice(0,3);for(let i=0;i<chain.length;i++){const a=i?chain[i-1]:e,b=chain[i];ZP.push({x1:a.x,y1:a.y-(a.h||70)*.5,x2:b.x,y2:b.y-b.h*.5,life:.65,c:'#73eeff'});hit(b,bossDamage(e,48+i*12),e,Math.sign(b.x-e.x||1)*320)}fx(e.x,e.y-e.h*.5,50,'#73eeff',520);e.bossActionLock=1}
   if(e.awakenedCd3<=0){e.awakenedCd3=11.5*rate;const base=Math.atan2(t.y-t.h*.5-(e.y-e.h*.55),t.x-e.x);for(let i=0;i<10;i++){const a=base+(i-4.5)*.24;pr({x:e.x+e.fo*40,y:e.y-e.h*.55,vx:Math.cos(a)*560,vy:Math.sin(a)*560,dm:bossDamage(e,46),tm:e.tm,col:'#82f0ff',src:e,t:'c',life:4.2})}e.bossActionLock=1}
  }
 }
 bossNavigatePlatform(e,t,I,dt);
 bossDashUpdate(e,t,dt);
 e.bossJumpCd=Math.max(0,(e.bossJumpCd||0)-dt);
 const edgeMargin=e.w*.58+28,moveDir=I.r?1:I.l?-1:0,prev=e.bossLastX;
 if(moveDir&&e.og&&prev!=null&&Math.abs(e.x-prev)<1.25)e.bossStuck=(e.bossStuck||0)+dt;else e.bossStuck=0;e.bossLastX=e.x;
 if(e.og&&e.bossJumpCd<=0&&(e.bossStuck>.4||e.x<edgeMargin||e.x>W-edgeMargin)){
  I.j=1;if(e.x<edgeMargin){I.l=0;I.r=1;e.fo=1}else if(e.x>W-edgeMargin){I.r=0;I.l=1;e.fo=-1}else{I.l=e.x>W/2?1:0;I.r=e.x<=W/2?1:0;e.fo=e.x<=W/2?1:-1}
  e.bossJumpCd=1.1;e.bossStuck=0;e.vx+=(e.x<W/2?1:-1)*230;
 }
 if(e.og&&t.y<e.y-95&&e.bossJumpCd<=0&&R()<dt*1.6){I.j=1;e.bossJumpCd=.95;e.vx+=Math.sign(t.x-e.x||1)*240}
 if(e.x<edgeMargin){I.l=0;I.r=1;e.fo=1;if(e.og&&e.bossJumpCd<=0){I.j=1;e.vx=350;e.bossJumpCd=1.15}}
 else if(e.x>W-edgeMargin){I.r=0;I.l=1;e.fo=-1;if(e.og&&e.bossJumpCd<=0){I.j=1;e.vx=-350;e.bossJumpCd=1.15}}
}
function updTurrets(dt){for(const t of TUR){t.life-=dt;t.cd-=dt;let target=null,best=t.range||620;for(const o of ents){if(o.hp<=0||o.tm==t.tm)continue;const d=Math.hypot(o.x-t.x,(o.y-o.h*.55)-(t.y-22));if(d<best){best=d;target=o}}if(target){const dx=target.x-t.x,dy=target.y-target.h*.55-(t.y-22);t.angle=Math.atan2(dy,dx);if(t.cd<=0){t.cd=.42;const d=Math.max(1,Math.hypot(dx,dy));pr({x:t.x+Math.cos(t.angle)*16,y:t.y-22+Math.sin(t.angle)*16,vx:dx/d*790,vy:dy/d*790,dm:t.dmg||17,tm:t.tm,t:'b',col:'#8ce5ff',life:1.35,src:t});fx(t.x+Math.cos(t.angle)*17,t.y-22+Math.sin(t.angle)*17,5,'#8ce5ff',110)}}}TUR=TUR.filter(t=>{if(t.life>0)return 1;fx(t.x,t.y-8,16,'#8ce5ff',190);return 0})}
function updWalls(dt){for(const w of WALLS){w.life-=dt;if(R()<dt*18)PT.push({x:w.x+(R()-.5)*190,y:w.y+R()*(w.bottom-w.y),vx:(R()-.5)*30,vy:-25,g:0,l:.35,c:'#ffcb82',r:1.5+R()*2})}WALLS=WALLS.filter(w=>w.life>0&&w.hp>0)}
function drawWalls(){for(const w of WALLS){const l=w.x-112,r=w.x+112,top=w.y,bottom=w.bottom,k=Math.min(1,w.life/1.2);cx.save();cx.globalCompositeOperation='lighter';const grad=cx.createLinearGradient(l,top,r,bottom);grad.addColorStop(0,`rgba(255,174,82,${.2*k})`);grad.addColorStop(.5,`rgba(122,216,255,${.31*k})`);grad.addColorStop(1,`rgba(255,174,82,${.2*k})`);cx.fillStyle=grad;cx.beginPath();cx.moveTo(l,top);cx.lineTo(r,top);cx.lineTo(r,bottom);cx.lineTo(l,bottom);cx.closePath();cx.fill();cx.strokeStyle='#8ee9ff';cx.globalAlpha=.95*k;cx.lineWidth=10;cx.beginPath();cx.moveTo(l,top);cx.lineTo(l,bottom);cx.moveTo(r,top);cx.lineTo(r,bottom);cx.moveTo(l,top);cx.lineTo(r,top);cx.stroke();cx.globalAlpha=.52*k;cx.lineWidth=3;for(let y=top+12;y<bottom;y+=18){cx.beginPath();cx.moveTo(l,y);cx.lineTo(r,y);cx.stroke()}for(let x=l+12;x<r;x+=20){cx.beginPath();cx.moveTo(x,top);cx.lineTo(x+12,bottom);cx.stroke()}cx.globalAlpha=1;cx.fillStyle='#101a2b';cx.fillRect(w.x-38,top-20,76,9);cx.fillStyle='#ffb45e';cx.fillRect(w.x-35,top-18,70*Math.max(0,w.hp/w.max),5);cx.restore()}}
function blockMonsterByWalls(e,oldX,oldY){const half=e.w*.5;for(const w of WALLS){const l=w.x-112,r=w.x+112,top=w.y,bottom=w.bottom;if(e.y<top-5||e.y-e.h>bottom+5)continue;if(oldX+half<l&&e.x+half>=l&&e.vx>0){e.x=l-half;e.vx=0}else if(oldX-half>l&&e.x-half<=l&&e.vx<0){e.x=l+half;e.vx=0}else if(oldX+half<r&&e.x+half>=r&&e.vx>0){e.x=r-half;e.vx=0}else if(oldX-half>r&&e.x-half<=r&&e.vx<0){e.x=r+half;e.vx=0}if(e.x>l-half&&e.x<r+half&&oldY<=top&&e.y>=top&&e.vy>0){e.y=top;e.vy=0}}}
function blockEnemyBeam(x1,y1,x2,y2){for(const w of WALLS){const l=w.x-112,r=w.x+112,top=w.y,bottom=w.bottom;const edges=[[l,top,l,bottom],[r,top,r,bottom],[l,top,r,top]];for(const [ax,ay,bx,by] of edges){const den=(x1-x2)*(ay-by)-(y1-y2)*(ax-bx);if(Math.abs(den)<.0001)continue;const t=((x1-ax)*(ay-by)-(y1-ay)*(ax-bx))/den,u=-((x1-x2)*(y1-ay)-(y1-y2)*(x1-ax))/den;if(t>=0&&t<=1&&u>=0&&u<=1){w.hp--;fx(ax,ay,8,'#9cecff',180);if(w.hp<=0)TX.push({x:w.x,y:w.y-20,t:'БАРЬЕР РАЗРУШЕН',l:1,c:'#ffb45e'});return true}}}return false}
function blockEnemyProjectile(p,oldX,oldY){if(!p.src||!(p.src.z||p.src.B))return false;for(const w of WALLS){const l=w.x-112,r=w.x+112,top=w.y,bottom=w.bottom;let blocked=false;if(((oldX<l&&p.x>=l)||(oldX>l&&p.x<=l))&&p.y>=top-4&&p.y<=bottom+4)blocked=true;else if(((oldX<r&&p.x>=r)||(oldX>r&&p.x<=r))&&p.y>=top-4&&p.y<=bottom+4)blocked=true;else if(((oldY<top&&p.y>=top)||(oldY>top&&p.y<=top))&&p.x>=l&&p.x<=r)blocked=true;if(blocked){w.hp--;p.life=0;fx(p.x,p.y,8,'#9cecff',190);if(w.hp<=0){fx(w.x,w.y+55,34,'#ffb45e',360);TX.push({x:w.x,y:w.y-20,t:'БАРЬЕР РАЗРУШЕН',l:1,c:'#ffb45e'})}return true}}return false}
function updP(dt){for(const p of P){p.life-=dt;p.age+=dt;
 if(p.t=='x'){const s=p.src;if(!s||s.hp<=0){p.life=0;continue}let target=null,best=1e12;for(const o of ents)if(o.hp>0&&o.tm!=p.tm){const d=Math.hypot(o.x-s.x,o.y-o.h*.5-(s.y-s.h*.5));if(d<best){best=d;target=o}}if(target){const wanted=target.y-target.h*.5,delta=wanted-p.y,step=(p.followSpeed||185)*dt;p.y+=cl(delta,-step,step)}p.tick=(p.tick||0)-dt;if(p.tick<=0){p.tick=.2;for(const o of ents)if(o.hp>0&&o.tm!=p.tm&&Math.abs(o.y-o.h*.5-p.y)<o.h*.5+18){hit(o,7,p.src,Math.sign(o.x-s.x||1)*35);fx(o.x,o.y-o.h*.5,5,`hsl(${G.t*220%360},100%,70%)`,120)}}if(R()<dt*38)PT.push({x:R()*W,y:p.y+(R()-.5)*24,vx:(R()-.5)*30,vy:(R()-.5)*20,l:.3,c:`hsl(${R()*360},100%,65%)`,r:2+R()*2})}
 if(p.t=='r'||p.t=='c'){if(p.age>(p.t=='c'?.18:.35)){let tg=null,bd=1e9;for(const o of ents)if(o.hp>0&&o.tm!=p.tm){const d=Math.hypot(o.x-p.x,o.y-o.h/2-p.y);if(d<bd){bd=d;tg=o}}if(tg){const ca=Math.atan2(p.vy,p.vx);let da=Math.atan2(tg.y-tg.h/2-p.y,tg.x-p.x)-ca;da=Math.atan2(Math.sin(da),Math.cos(da));const na=ca+cl(da,p.t=='c'?-1.3*dt:-2.3*dt,p.t=='c'?1.3*dt:2.3*dt),sp=Math.min(p.t=='c'?370:460,Math.hypot(p.vx,p.vy)+(p.t=='c'?90:260)*dt);p.vx=Math.cos(na)*sp;p.vy=Math.sin(na)*sp}}PT.push({x:p.x,y:p.y,vx:R()*30-15,vy:R()*30-15,l:.45,c:p.col||'#c9c9c9',r:p.t=='c'?4+R()*2:3+R()*2})}
 if(p.t=='q'&&p.src){if(p.age>.48)p.returning=1;if(R()<dt*38)PT.push({x:p.x,y:p.y,vx:(R()-.5)*45,vy:(R()-.5)*45,l:.24,c:p.returning?'#ffe5b2':'#ff9c50',r:1.5+R()*2});if(p.returning){const dx=p.src.x-p.x,dy=(p.src.y-p.src.h*.5)-p.y,d=Math.hypot(dx,dy);if(d<25){p.life=0}else{const a=Math.atan2(dy,dx),sp=900;p.vx=Math.cos(a)*sp;p.vy=Math.sin(a)*sp}}}
 const ox=p.x,oy=p.y;p.px=ox;p.py=oy;p.vy+=(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(blockEnemyProjectile(p,ox,oy))continue;
 if(p.t=='h'){let floor=null;if(p.y>=GY)floor=GY;if(p.vy>0)for(const q of M.pl)if(p.x>q[0]&&p.x<q[0]+q[2]&&p.y>=q[1]&&p.y-p.vy*dt<=q[1])floor=floor==null?q[1]:Math.min(floor,q[1]);if(floor!=null){p.y=floor;p.life=0;IT.push({x:cl(p.x,24,W-24),y:floor,vy:0,wp:null,kit:true,tm:p.tm,life:24,air:false,medThrown:true});fx(p.x,floor-8,8,'#7ee08a',125);TX.push({x:p.x,y:floor-30,t:'АПТЕЧКА НА ЗЕМЛЕ',l:.8,c:'#7ee08a'})}continue}
 if(p.t=='x')continue;for(const o of ents){if(o.hp<=0||(o.tm===p.tm&&p.t!=='p')||o===p.src||p.life<=0)continue;if(Math.abs(p.x-o.x)>=o.w/2+5||p.y<=o.y-o.h-5||p.y>=o.y+3)continue;
  if(p.t=='p'&&o.tm===p.tm){p.life=0;if(p.src&&p.src.hp>0){o.vx+=(p.src.x-o.x)*.72;o.vy-=130}TX.push({x:o.x,y:o.y-o.h-18,t:'СОЮЗНИК ПРИТЯНУТ',l:.8,c:'#e4c47a'});fx(p.x,p.y,14,'#e4c47a',250);break}
  if(o.ch==3&&!o.cl&&phase(p,o))continue;
  if(o.mirror>0&&!p.reflected){p.tm=o.tm;p.vx=-p.vx*1.12;p.vy=-p.vy*1.12;p.src=o;p.reflected=1;p.age=0;p.life=Math.max(p.life,1.25);o.sw=.3;fx(p.x,p.y,12,'#a8e9ff',260);ZP.push({x1:o.x,y1:o.y-o.h*.5,x2:p.x,y2:p.y,life:.2,c:'#a8e9ff'});break}
  if(o.wp=='katana'&&(o.katRefs||0)<5&&Math.sign(p.x-o.x)==o.f){p.tm=o.tm;p.vx=-p.vx*1.1;p.vy=-p.vy;p.src=o;p.age=0;p.life=Math.max(p.life,1.5);o.sw=.3;fx(p.x,p.y,10,'#fff',240);G.sh=Math.max(G.sh,4);
   o.rf=.12;o.katRefs=(o.katRefs||0)+1;if(o.katRefs>=5)brk(o);break}
  if(p.t=='x'){continue}
  if(p.t=='q'){p.hitTargets=p.hitTargets||[];if(!p.hitTargets.includes(o)){p.hitTargets.push(o);hit(o,p.dm,p.src,Math.sign(p.vx)*130,p.fz,1);p.returning=1;fx(p.x,p.y,8,'#ffa85c',200)}break}
  if(p.t=='p'){p.life=0;hit(o,p.dm,p.src,Math.sign(p.vx)*p.dm*3,p.fz,1);if(p.src&&p.src.hp>0){o.vx+=(p.src.x-o.x)*.9;o.vy-=100}fx(p.x,p.y,14,'#e4c47a',260);break}
  p.life=0;if(p.t!='r'&&p.t!='g'){hit(o,p.dm,p.src,Math.sign(p.vx)*p.dm*3,p.fz,1);if(p.t=='f')st(o,'bn',2.5);if(p.t=='n')bleed(o)}break
 }
 if(p.t=='g'&&p.vy>0)for(const q of M.pl)if(p.x>q[0]&&p.x<q[0]+q[2]&&p.y>q[1]&&p.y-p.vy*dt<=q[1]){p.y=q[1];p.vy=-p.vy*.5;p.vx*=.7}
 if(p.t=='r'&&(p.x<2||p.x>W-2||M.pl.some(q=>p.x>q[0]&&p.x<q[0]+q[2]&&p.y>q[1]-4&&p.y<q[1]+18)))p.life=0;
 if(p.y>GY){if(p.t=='g'){p.y=GY;p.vy=-Math.abs(p.vy)*.5;p.vx*=.7}else if(p.t!='q')p.life=0}if(p.x<-60||p.x>W+60||p.y<-300){p.life=0;p.oob=1}}
 for(let i=0;i<P.length;i++){
  const a=P[i];if(a.life<=0||a.t=='x'||a.t=='h')continue;
  for(let j=i+1;j<P.length;j++){
   const b=P[j];if(b.life<=0||b.t=='x'||b.t=='h'||a.tm==null||b.tm==null||a.tm==b.tm)continue;
   const ax0=Number.isFinite(a.px)?a.px:a.x,ay0=Number.isFinite(a.py)?a.py:a.y,bx0=Number.isFinite(b.px)?b.px:b.x,by0=Number.isFinite(b.py)?b.py:b.y;
   const rx=ax0-bx0,ry=ay0-by0,rvx=(a.x-ax0)-(b.x-bx0),rvy=(a.y-ay0)-(b.y-by0),den=rvx*rvx+rvy*rvy;
   const k=den>0?cl(-(rx*rvx+ry*rvy)/den,0,1):0,dx=rx+rvx*k,dy=ry+rvy*k;
   const radius=(a.t=='r'?16:a.t=='g'?12:a.t=='q'?12:7)+(b.t=='r'?16:b.t=='g'?12:b.t=='q'?12:7);
   if(dx*dx+dy*dy>radius*radius)continue;
   const mx=(a.x+b.x)*.5,my=(a.y+b.y)*.5;a.life=0;b.life=0;
   fx(mx,my,12,a.t=='r'||a.t=='g'?'#ffb35c':'#dce8ff',190);RG.push({x:mx,y:my,l:.18});
   if(a.t=='r'||a.t=='g'){boom(a);a.detonated=1}
   if(b.t=='r'||b.t=='g'){boom(b);b.detonated=1}
   break;
  }
 }
 P=P.filter(p=>{if(p.life>0)return 1;if((p.t=='r'||p.t=='g')&&!p.oob&&!p.detonated)boom(p);return 0})}
function weightedDrop(){const entries=Object.entries(DROP_WEIGHTS),total=entries.reduce((n,v)=>n+v[1],0);let r=R()*total;for(const[k,w]of entries){r-=w;if(r<=0)return k}return 'pistol'}
function spawnIT(){const r=R(),kit=r<.10,rain=!kit&&r<.13,gravity=!kit&&!rain&&r<.14;IT.push({x:60+R()*(W-120),y:-60,vy:0,wp:gravity?'gravity':rain?'rain':weightedDrop(),kit,life:26})}
function updIT(dt){for(const i of IT){i.life-=dt;const py=i.y;i.vy=Math.min(i.vy+250*dt,78);i.y+=i.vy*dt;let gy=GY;for(const p of M.pl)if(i.x>p[0]&&i.x<p[0]+p[2]&&py<=p[1]+1&&i.y>=p[1])gy=Math.min(gy,p[1]);
 if(i.y>=gy){i.y=gy;i.vy=0}i.air=i.y<gy-3;
 for(const e of ents)if(e.hp>0&&!e.z&&!e.B&&!(CH[e.ch].brawler&&!i.kit)&&(i.tm==null||i.tm==e.tm)&&Math.abs(e.x-i.x)<34&&i.y>e.y-e.h-34&&i.y<e.y+24){if(i.kit){if(e.hp>=e.mh)continue;const h=Math.round(e.mh*.4);e.hp=Math.min(e.mh,e.hp+h);i.life=0;TX.push({x:e.x,y:e.y-e.h-18,t:'+'+h,l:.9,c:'#7ee08a'});fx(i.x,i.y-12,14,'#7ee08a',220);e.bn=0;e.br=0;e.bl=0;break}const w=WP[i.wp];e.wp=i.wp;e.am=w.am;e.katHits=0;e.katRefs=0;i.life=0;fx(i.x,i.y-12,12,w.c,220);TX.push({x:e.x,y:e.y-e.h-18,t:w.n,l:.9,c:w.c});break}}
 IT=IT.filter(i=>i.life>0)}
