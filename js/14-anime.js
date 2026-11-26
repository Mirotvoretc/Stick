/* ===================================================================
   v2.7 — АНИМЕ-ЭФФЕКТЫ
   скоростные линии · росчерки клинка · кольца · звёзды · вставки-заставки
   =================================================================== */
let AN=[];
function anime(k,x,y,c,o){AN.push(Object.assign({k,x,y,c:c||'#ffffff',l:.5,L:.5,a:0,r:60},o||{}));if(AN.length>36)AN.shift()}
function animeT(k,x,y,c,o){o=o||{};o.l=o.L=o.d||o.l||.5;anime(k,x,y,c,o)}
function cutIn(text,sub,c){if(S.soft&&G.cut)return;G.cut={t:text,s:sub||'',c:c||'#ff5a8a',l:1.7,L:1.7}}
function updAN(dt){for(const a of AN)a.l-=dt;AN=AN.filter(a=>a.l>0);if(G.cut){G.cut.l-=dt;if(G.cut.l<=0)G.cut=null}}
function drawAN(){
 for(const a of AN){const k=1-a.l/a.L;cx.save();cx.translate(a.x,a.y);cx.globalCompositeOperation='lighter';
  if(a.k=='lines'){cx.strokeStyle=a.c;cx.lineCap='round';const n=a.n||22;for(let i=0;i<n;i++){const an=i/n*6.283+a.a,r1=a.r*(.2+k*.8),r2=r1+a.r*(.55*(1-k)+.1)*(.6+.4*Math.sin(i*7.3));cx.globalAlpha=(1-k)*.9;cx.lineWidth=1.5+(1-k)*3.2;cx.beginPath();cx.moveTo(Math.cos(an)*r1,Math.sin(an)*r1);cx.lineTo(Math.cos(an)*r2,Math.sin(an)*r2);cx.stroke()}}
  else if(a.k=='slash'){cx.rotate(a.a);const len=a.r*(.45+Math.min(1,k*5)*.9);cx.globalAlpha=1-k;const g=cx.createLinearGradient(-len,0,len,0);g.addColorStop(0,'#fff0');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#fff0');cx.fillStyle=g;cx.beginPath();cx.moveTo(-len,0);cx.quadraticCurveTo(0,-9*(1-k)-2,len,0);cx.quadraticCurveTo(0,9*(1-k)+2,-len,0);cx.fill();cx.strokeStyle=a.c;cx.lineWidth=4;cx.globalAlpha=(1-k)*.8;cx.beginPath();cx.moveTo(-len,0);cx.quadraticCurveTo(0,-12,len,0);cx.stroke()}
  else if(a.k=='ring'){cx.strokeStyle=a.c;cx.globalAlpha=1-k;cx.lineWidth=7*(1-k)+1;cx.beginPath();cx.ellipse(0,0,a.r*k,a.r*k*(a.sq||1),0,0,7);cx.stroke();cx.globalAlpha=(1-k)*.5;cx.lineWidth=2;cx.beginPath();cx.ellipse(0,0,a.r*k*.7,a.r*k*.7*(a.sq||1),0,0,7);cx.stroke()}
  else if(a.k=='star'){cx.globalAlpha=1-k;cx.fillStyle=a.c;cx.rotate(k*2);const R1=a.r*(1-k*.4);cx.beginPath();for(let i=0;i<8;i++){const q=i%2?R1*.22:R1;cx.lineTo(Math.cos(i*.785)*q,Math.sin(i*.785)*q)}cx.closePath();cx.fill()}
  cx.restore()}}
function drawCutIn(){const c=G.cut;if(!c)return;const k=1-c.l/c.L,ein=Math.min(1,k*7),eout=Math.min(1,c.l*4),a=Math.min(ein,eout),w=VW,h=VH,y=h*.3,bh=h*.2;
 cx.save();cx.globalAlpha=a*.9;cx.fillStyle='#07080f';cx.beginPath();cx.moveTo(-w*.1-(1-ein)*w,y+bh*.1);cx.lineTo(w*1.1-(1-ein)*w,y-bh*.1);cx.lineTo(w*1.1-(1-ein)*w,y+bh*.95);cx.lineTo(-w*.1-(1-ein)*w,y+bh*1.15);cx.closePath();cx.fill();
 cx.globalCompositeOperation='lighter';cx.strokeStyle=c.c;cx.lineWidth=3;cx.globalAlpha=a*.5;for(let i=0;i<26;i++){const yy=y+bh*.1+((i*37)%100)/100*bh,x0=((i*173+k*900*(1+i%3))%(w*1.2))-w*.1;cx.beginPath();cx.moveTo(x0,yy);cx.lineTo(x0+80+i%4*40,yy-6);cx.stroke()}
 cx.globalCompositeOperation='source-over';cx.globalAlpha=a;cx.fillStyle=c.c;cx.beginPath();cx.moveTo(-w*.1,y+bh*1.12);cx.lineTo(w*1.1,y+bh*.92);cx.lineTo(w*1.1,y+bh*.98);cx.lineTo(-w*.1,y+bh*1.18);cx.fill();
 const sh=(1-ein)*-120+ (1-eout)*160;cx.translate(sh,0);cx.font='italic 900 '+Math.round(h*.085)+'px "Russo One",Impact,sans-serif';cx.textAlign='center';cx.lineJoin='round';cx.lineWidth=8;cx.strokeStyle='#000';cx.strokeText(c.t,w/2,y+bh*.62);cx.fillStyle='#fff';cx.fillText(c.t,w/2,y+bh*.62);cx.lineWidth=2;cx.strokeStyle=c.c;cx.strokeText(c.t,w/2,y+bh*.62);
 if(c.s){cx.font='italic 700 '+Math.round(h*.034)+'px "Russo One",Impact,sans-serif';cx.lineWidth=5;cx.strokeStyle='#000';cx.strokeText(c.s,w/2,y+bh*.92);cx.fillStyle=c.c;cx.fillText(c.s,w/2,y+bh*.92)}
 cx.restore()}
/* эффект при использовании способности класса */
function animeAbility(e){const c=CH[e.ch],x=e.x,y=e.y-e.h*.55;
 if(c.duelist){animeT('slash',x+e.f*26,y,'#b5f5ff',{a:-.6,r:90,d:.4});animeT('slash',x+e.f*26,y,'#ffffff',{a:.5,r:80,d:.34});animeT('lines',x,y,'#b5f5ff',{r:80,d:.4});TX.push({x,y:e.y-e.h-30,t:'КОНТР-СТОЙКА!',l:.9,c:'#b5f5ff',s:22})}
 else if(c.med){animeT('ring',x,y,'#8de6a0',{r:70,sq:1,d:.5});for(let i=0;i<14;i++)PT.push({x:x+(R()-.5)*40,y:y+(R()-.5)*30,vx:(R()-.5)*120,vy:-30-R()*90,g:-20,l:1+R()*.6,c:i%2?'#ffb7d5':'#d7ffd9',r:2.6+R()*2});TX.push({x,y:e.y-e.h-30,t:'ЦЕЛИТЕЛЬНЫЙ ЛЕПЕСТОК',l:.9,c:'#ffd0e4',s:20})}
 else if(c.vamp){animeT('lines',x,y,'#ff3b4a',{r:100,d:.5,n:30});animeT('ring',x,y,'#c1121f',{r:90,d:.45});TX.push({x,y:e.y-e.h-30,t:'КРОВАВАЯ НОЧЬ!',l:.9,c:'#ff6a7a',s:22})}
 else if(c.engineer){animeT('ring',e.x+e.f*40,e.y-4,'#8ce5ff',{r:80,sq:.3,d:.6});animeT('lines',e.x+e.f*40,e.y-20,'#8ce5ff',{r:70,d:.4});TX.push({x,y:e.y-e.h-30,t:'РАЗВЁРТЫВАНИЕ!',l:.9,c:'#8ce5ff',s:20})}
 else if(c.assault){animeT('ring',x+e.f*30,y,'#ffb45e',{r:90,d:.5});animeT('star',x+e.f*30,y,'#ffe0a8',{r:46,d:.4});TX.push({x,y:e.y-e.h-30,t:'НЕПРОНИЦАЕМЫЙ ЩИТ!',l:.9,c:'#ffb45e',s:20})}
 else if(c.slime){animeT('ring',x,y,'#55b9ff',{r:80,d:.5});animeT('star',x,y,'#9fdcff',{r:40,d:.4})}
 else if(c.acrobat){animeT('lines',x,y,'#a9efff',{r:70,d:.35})}}
