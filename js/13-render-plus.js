/* ===================================================================
   v2.7 — ГРАФИКА И ПРОИЗВОДИТЕЛЬНОСТЬ
   детальные фоны (кэшируются один раз) · лёгкие свечения вместо shadowBlur
   пакетная отрисовка частиц · кэш виньетки · авто-качество
   отрисовка: платформы, бочки, дроны, турели, барьер, лучи
   =================================================================== */
let bgS=1,LITE=0;
const hx2=a=>Math.round(cl(a,0,255)).toString(16).padStart(2,'0');
const GLS=new Map();
function glowSpr(col){if(!col||col.length!=7)col='#ffffff';let c=GLS.get(col);if(c)return c;c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,col);g.addColorStop(.35,col+'88');g.addColorStop(1,col+'00');x.fillStyle=g;x.fillRect(0,0,64,64);GLS.set(col,c);return c}
function drawGlow(x,y,r,col,a){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=a==null?.6:a;cx.drawImage(glowSpr(col),x-r,y-r,r*2,r*2);cx.restore()}
let SHs=null;function shSpr(){if(SHs)return SHs;SHs=document.createElement('canvas');SHs.width=96;SHs.height=16;const x=SHs.getContext('2d');x.scale(6,1);const g=x.createRadialGradient(8,8,0,8,8,8);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,16,16);return SHs}
function perfRes(){return S.gfx==1?1:S.gfx==2?.75:PERF.res}
function perfTick(rd){PERF.ema=PERF.ema*.94+rd*.06;PERF.fc++;PERF.ft+=rd;if(PERF.ft>=.5){PERF.fps=Math.round(PERF.fc/PERF.ft);PERF.fc=0;PERF.ft=0}
 PERF.cool-=rd;if(PERF.cool>0||S.gfx!=0)return;
 if(PERF.ema>.028&&PERF.downs<4){PERF.downs++;PERF.res=Math.max(.55,PERF.res-.15);PERF.low=1;PERF.cool=4;fit()}}
function perfReset(){PERF.res=1;PERF.low=0;PERF.downs=0;PERF.cool=2;PERF.ema=.0167;fit()}

/* ---------- виньетка и частицы ---------- */
let VGc=null,VGr=null;
function mkVG(a,b){const c=document.createElement('canvas');c.width=256;c.height=144;const x=c.getContext('2d'),g=x.createRadialGradient(128,72,144*.45,128,72,144*.95);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,256,144);return c}
function drawVignette(){if(!VGc){VGc=mkVG('rgba(0,0,0,0)','rgba(0,0,0,.62)');VGr=mkVG('rgba(255,0,0,0)','rgba(255,20,20,.6)')}
 cx.drawImage(VGc,0,0,VW,VH);
 if(!G.demo){let low=0;for(const e of ents)if(e.pi!=null&&e.hp>0&&e.hp<e.mh*.3)low=Math.max(low,1-e.hp/(e.mh*.3));if(low>0){cx.globalAlpha=low*(.45+.55*Math.sin(G.t*7)**2)*(S.soft?.5:1);cx.drawImage(VGr,0,0,VW,VH);cx.globalAlpha=1}}}
function drawPT(){let lc=null,open=false;const fl=()=>{if(open){cx.fill();open=false}};
 for(const p of PT){
  if(p.k){fl();lc=null;cx.globalAlpha=Math.min(1,p.l*5);cx.strokeStyle=p.c;cx.lineWidth=2;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*.04,p.y-p.vy*.04);cx.stroke();continue}
  const a=Math.min(1,p.l*2.5);
  if(a>=.99){if(p.c!==lc||!open){fl();cx.globalAlpha=1;cx.fillStyle=p.c;lc=p.c;cx.beginPath();open=true}
   if(p.r<2.6)cx.rect(p.x-p.r,p.y-p.r,p.r*2,p.r*2);else{cx.moveTo(p.x+p.r,p.y);cx.arc(p.x,p.y,p.r,0,7)}}
  else{fl();lc=null;cx.globalAlpha=a;cx.fillStyle=p.c;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}}
 fl();cx.globalAlpha=1}

/* ---------- снаряды: свечение ---------- */
function glowP(p){if(p.col&&p.t!='h'&&p.t!='n'&&p.t!='f'){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=.55;cx.drawImage(glowSpr(p.col),-15,-15,30,30);cx.restore()}}
function drawPlasma(p){const t=G.t*14;drawGlow(0,0,30,'#7dffb0',.7);cx.fillStyle='#d9ffe8';cx.beginPath();cx.arc(0,0,7+Math.sin(t)*1.2,0,7);cx.fill();cx.strokeStyle='#59f2a0';cx.lineWidth=2;for(let i=0;i<3;i++){cx.beginPath();cx.arc(0,0,11+i*2,t*(i+1)*.3,t*(i+1)*.3+2.1);cx.stroke()}}
function drawBolt(p){cx.rotate(Math.atan2(p.vy,p.vx));cx.fillStyle='#6b4a2a';cx.fillRect(-16,-1.2,26,2.4);cx.fillStyle='#d8dde8';cx.beginPath();cx.moveTo(10,-3.5);cx.lineTo(19,0);cx.lineTo(10,3.5);cx.closePath();cx.fill();cx.fillStyle='#e8d9b0';cx.fillRect(-17,-3,5,2);cx.fillRect(-17,1,5,2);drawGlow(2,0,14,'#ffe2a8',.35)}

/* ===================== ФОНЫ ===================== */
function gdot(c,x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+hx2(a));g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()}
function bgStars(c,n,q,maxY,a){c.fillStyle='#fff';for(let i=0;i<n;i++){const x=q(i*3.1)*W,y=q(i*7.7+2)*maxY,r=.6+q(i)*1.5;c.globalAlpha=(a||1)*(.35+q(i*2.3)*.65);c.beginPath();c.arc(x,y,r,0,7);c.fill()}c.globalAlpha=1}
function bgSky(c,s,q,Z){
 if(s==1){gdot(c,W*.74,H*.3,420,'#ffb15a',150);gdot(c,W*.74,H*.3,200,'#ffe2a0',210);c.fillStyle='#fff3cf';c.beginPath();c.arc(W*.74,H*.3,72,0,7);c.fill();
  for(let k=0;k<7;k++){const y=H*.12+k*46,x=q(k)*W*.9;c.fillStyle=k%2?'#ff9a6a55':'#ffcf9a44';c.beginPath();c.ellipse(x,y,220+q(k+4)*120,14+q(k+2)*8,0,0,7);c.fill()}
  c.strokeStyle='#2a1747';c.lineWidth=3;for(let i=0;i<8;i++){const x=W*.3+i*34+q(i)*20,y=H*.2+Math.sin(i)*26;c.beginPath();c.moveTo(x-10,y);c.quadraticCurveTo(x,y-9,x+10,y);c.quadraticCurveTo(x+20,y-9,x+30,y);c.stroke()}}
 else if(s==2){bgStars(c,70,q,H*.4,.7);c.globalCompositeOperation='lighter';
  for(let b=0;b<3;b++){const col=['#4dffb0','#59d6ff','#b07bff'][b],y0=H*(.14+b*.06);const g=c.createLinearGradient(0,y0-70,0,y0+130);g.addColorStop(0,col+'00');g.addColorStop(.4,col+'55');g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.moveTo(0,y0+130);for(let x=0;x<=W;x+=24)c.lineTo(x,y0+Math.sin(x*.004+b*2)*50+Math.sin(x*.011+b)*18);c.lineTo(W,y0+130);c.fill()}
  c.globalCompositeOperation='source-over'}
 else if(s==3){gdot(c,W*.3,H*.7,520,'#ff4a1a',150);const vx=W*.3,vy=H*.74;c.fillStyle='#1a0808';c.beginPath();c.moveTo(vx-420,vy+60);c.lineTo(vx-70,vy-250);c.lineTo(vx+70,vy-250);c.lineTo(vx+420,vy+60);c.fill();
  gdot(c,vx,vy-250,120,'#ff7a2a',230);c.strokeStyle='#ff6a1a';c.lineWidth=4;for(let i=0;i<4;i++){c.beginPath();c.moveTo(vx+(i-1.5)*22,vy-246);c.bezierCurveTo(vx+(i-1.5)*60,vy-170,vx+(i-1.5)*40,vy-90,vx+(i-1.5)*130,vy+40);c.stroke()}
  for(let i=0;i<9;i++){c.fillStyle=`rgba(40,20,20,${.35-i*.03})`;c.beginPath();c.arc(vx+i*18+q(i)*20,vy-290-i*42,40+i*9,0,7);c.fill()}}
 else if(s==4){bgStars(c,150,q,H*.5);gdot(c,W*.78,H*.2,200,'#cfe0ff',90);c.fillStyle='#e8efff';c.beginPath();c.arc(W*.78,H*.2,58,0,7);c.fill();c.fillStyle='#b9c6e6';for(const[a,b,r]of[[-18,-12,12],[14,10,9],[-6,22,7],[22,-18,5]]){c.beginPath();c.arc(W*.78+a,H*.2+b,r,0,7);c.fill()}}
 else if(s==5){c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x=W*(.45+i*.11);c.fillStyle='rgba(255,255,210,.07)';c.beginPath();c.moveTo(W*.85,-40);c.lineTo(x-60,GY);c.lineTo(x+40,GY);c.fill()}c.globalCompositeOperation='source-over';gdot(c,W*.85,-20,380,'#fff7b0',170)}
 else if(s==6){gdot(c,W*.5,H*.62,520,'#ffb15a',140);c.fillStyle='#ffd9a0';c.beginPath();c.arc(W*.5,H*.58,88,0,7);c.fill();
  c.fillStyle='#2a1a12';c.beginPath();c.moveTo(0,H*.35);c.lineTo(W*.12,H*.4);c.lineTo(W*.17,H*.55);c.lineTo(W*.12,H);c.lineTo(0,H);c.fill();c.beginPath();c.moveTo(W,H*.32);c.lineTo(W*.88,H*.4);c.lineTo(W*.83,H*.56);c.lineTo(W*.88,H);c.lineTo(W,H);c.fill()}
 else if(s==7){gdot(c,W*.7,H*.26,480,'#ffd27a',170);c.fillStyle='#fff0c0';c.beginPath();c.arc(W*.7,H*.26,76,0,7);c.fill();c.fillStyle='#7a3f1a';for(const[x,w]of[[W*.18,300],[W*.34,210],[W*.88,260]]){c.beginPath();c.moveTo(x-w/2,H*.77);c.lineTo(x,H*.77-w*.58);c.lineTo(x+w/2,H*.77);c.fill();c.fillStyle='#5a2c10';c.beginPath();c.moveTo(x,H*.77-w*.58);c.lineTo(x+w/2,H*.77);c.lineTo(x+4,H*.77);c.fill();c.fillStyle='#7a3f1a'}}
 else if(s==8){bgStars(c,260,q,H*.8);gdot(c,W*.25,H*.3,520,'#7a3cff',90);gdot(c,W*.7,H*.2,460,'#ff4fb0',70);gdot(c,W*.55,H*.55,520,'#3c6bff',70);
  const px=W*.2,py=H*.3;const pg=c.createRadialGradient(px-30,py-30,10,px,py,110);pg.addColorStop(0,'#ffd7a8');pg.addColorStop(.6,'#c96a4a');pg.addColorStop(1,'#4a1a2a');c.fillStyle=pg;c.beginPath();c.arc(px,py,110,0,7);c.fill();
  c.strokeStyle='#e8c9a0aa';c.lineWidth=7;c.beginPath();c.ellipse(px,py,190,40,-.35,0,7);c.stroke();c.fillStyle='#d6d9e6';c.beginPath();c.arc(W*.82,H*.14,24,0,7);c.fill()}
 else if(s==9){c.fillStyle='#08301f';for(let i=0;i<16;i++){c.beginPath();c.ellipse(i*W/15,-6,120+q(i)*70,90+q(i+3)*80,0,0,7);c.fill()}
  c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){c.fillStyle='rgba(200,255,170,.07)';c.beginPath();c.moveTo(W*(.2+i*.16),0);c.lineTo(W*(.14+i*.16),GY);c.lineTo(W*(.24+i*.16),GY);c.fill()}c.globalCompositeOperation='source-over';
  c.fillStyle='#0a2a1c';const tx=W*.7;c.fillRect(tx-150,H*.55,300,H*.25);c.fillRect(tx-100,H*.47,200,H*.1);c.fillRect(tx-50,H*.4,100,H*.08);c.fillStyle='#16553a';for(let i=0;i<6;i++)c.fillRect(tx-140+i*50,H*.58,16,H*.22)}
 else if(s==11){bgStars(c,220,q,H*.75);gdot(c,W*.12,H*.1,300,'#fff6c8',150);gdot(c,W*.12,H*.1,80,'#ffffff',230);
  const eg=c.createRadialGradient(W/2,H*2.05,H*1.0,W/2,H*2.05,H*1.4);eg.addColorStop(0,'#0f3f9c');eg.addColorStop(.7,'#2a7bff');eg.addColorStop(1,'#a6e4ff');c.fillStyle=eg;c.beginPath();c.arc(W/2,H*2.05,H*1.4,0,7);c.fill();
  c.globalAlpha=.55;c.fillStyle='#ffffff';for(let i=0;i<16;i++){c.beginPath();c.ellipse(q(i)*W,H*(.68+q(i+3)*.25),90+q(i+6)*160,10+q(i+2)*14,-.05,0,7);c.fill()}c.globalAlpha=1;
  c.strokeStyle='#bfeaffaa';c.lineWidth=5;c.beginPath();c.arc(W/2,H*2.05,H*1.4,Math.PI*1.3,Math.PI*1.7);c.stroke();
  c.strokeStyle='#26365e';c.lineWidth=14;c.beginPath();c.ellipse(W*.5,H*.34,W*.3,H*.17,0,0,7);c.stroke();c.lineWidth=6;for(let i=0;i<8;i++){const a=i*.785;c.beginPath();c.moveTo(W*.5+Math.cos(a)*W*.3,H*.34+Math.sin(a)*H*.17);c.lineTo(W*.5,H*.34);c.stroke()}
  c.fillStyle='#2b3f6e';c.fillRect(W*.5-60,H*.34-26,120,52);c.fillStyle='#9fe8ff';for(let i=0;i<5;i++)c.fillRect(W*.5-50+i*22,H*.34-8,12,8);
  for(const sx of[.08,.92]){c.fillStyle='#1d2a4d';c.fillRect(W*sx-6,H*.2,12,H*.3);c.fillStyle='#3a62c9';for(let k=0;k<4;k++){c.fillRect(W*sx-70,H*.2+k*40,64,32);c.fillRect(W*sx+6,H*.2+k*40,64,32)}c.fillStyle='#ffffff22';for(let k=0;k<4;k++){c.fillRect(W*sx-70,H*.2+k*40,64,6);c.fillRect(W*sx+6,H*.2+k*40,64,6)}}}
 else if(s==12){bgStars(c,48,q,H*.34,.18);for(const x of[W*.18,W*.82]){c.fillStyle='#251b1b';c.fillRect(x-78,H*.12,156,H*.57);c.fillStyle='#4a3025';c.fillRect(x-64,H*.17,128,H*.49);c.fillStyle='#ff9a55';c.fillRect(x-52,H*.21,104,5);c.fillRect(x-52,H*.62,104,5);for(let k=0;k<5;k++){c.fillStyle=k%2?'#ff7a3c':'#e6b06b';c.fillRect(x-42+k*21,H*.27,8,7);c.fillRect(x-42+k*21,H*.53,8,7)}}
  const rx=W*.5,ry=H*.34;c.globalCompositeOperation='lighter';gdot(c,rx,ry,210,'#ff773d',92);c.globalCompositeOperation='source-over';c.fillStyle='#211a1b';c.fillRect(rx-112,ry-84,224,168);c.strokeStyle='#9a6241';c.lineWidth=10;c.strokeRect(rx-112,ry-84,224,168);c.fillStyle='#3c2925';c.fillRect(rx-78,ry-50,156,100);c.strokeStyle='#ffac61';c.lineWidth=5;c.beginPath();c.arc(rx,ry,58,0,7);c.stroke();c.strokeStyle='#ffe1a3';c.lineWidth=2;c.beginPath();c.arc(rx,ry,36,0,7);c.stroke();c.fillStyle='#fff0c2';c.beginPath();c.arc(rx,ry,13,0,7);c.fill();c.globalCompositeOperation='source-over';
  c.strokeStyle='#574035';c.lineWidth=18;for(const x of[W*.28,W*.72]){c.beginPath();c.moveTo(x,0);c.lineTo(x,H*.72);c.stroke();c.strokeStyle='#c17b4e';c.lineWidth=3;c.beginPath();c.moveTo(x-22,H*.18);c.lineTo(x+22,H*.18);c.moveTo(x-22,H*.56);c.lineTo(x+22,H*.56);c.stroke();c.strokeStyle='#574035';c.lineWidth=18}}
 else if(s==13){bgStars(c,280,q,H*.82,.9);const px=W*.75,py=H*.2;c.globalCompositeOperation='lighter';gdot(c,px,py,260,'#7d92ff',95);c.globalCompositeOperation='source-over';const pg=c.createRadialGradient(px-24,py-22,4,px,py,92);pg.addColorStop(0,'#d8e5ff');pg.addColorStop(.48,'#7188c8');pg.addColorStop(1,'#202d65');c.fillStyle=pg;c.beginPath();c.arc(px,py,92,0,7);c.fill();c.strokeStyle='#b8c8ff';c.lineWidth=7;c.beginPath();c.ellipse(px,py,150,30,-.32,0,7);c.stroke();c.strokeStyle='#9db9ff55';c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.arc(W*.36,H*.3,90+i*34,Math.PI*1.08,Math.PI*1.9);c.stroke()}
  c.strokeStyle='#34466f';c.lineWidth=18;c.beginPath();c.arc(W*.5,H*.28,190,Math.PI,0);c.stroke();c.lineWidth=5;c.strokeStyle='#9db9ff';c.beginPath();c.arc(W*.5,H*.28,190,Math.PI,0);c.stroke();c.fillStyle='#1a2446';c.fillRect(W*.5-190,H*.28,380,52);c.fillStyle='#50679c';for(let i=0;i<9;i++)c.fillRect(W*.5-174+i*39,H*.28+12,24,18);c.strokeStyle='#677eb5';c.lineWidth=8;for(const x of[W*.5-230,W*.5+230]){c.beginPath();c.moveTo(x,H*.35);c.lineTo(x,H*.72);c.stroke();c.fillStyle='#34466f';c.fillRect(x-48,H*.66,96,22)}}
 else if(s==10){c.fillStyle='#0b0805';c.fillRect(0,0,W,H*.12);for(let i=0;i<26;i++){const x=i*W/25+q(i)*30,h=40+q(i+2)*120;c.beginPath();c.moveTo(x-26,H*.1);c.lineTo(x,H*.1+h);c.lineTo(x+26,H*.1);c.fill()}
  for(const[x,y,col]of[[W*.12,H*.55,'#58b8ff'],[W*.9,H*.5,'#c06bff'],[W*.55,H*.6,'#58ffd0']]){gdot(c,x,y,160,col,110);c.fillStyle=col;for(let k=0;k<4;k++){c.beginPath();c.moveTo(x+(k-1.5)*16,y+50);c.lineTo(x+(k-1.5)*16+6,y-30-k%2*26);c.lineTo(x+(k-1.5)*16+16,y+50);c.fill()}}}}
function bgScene(c,s,q,Z){
 if(s==4){for(let x=-10,i=0;x<W;x+=46,i++){const h=(70+q(i)*150)*1.5;c.fillStyle='#0a1028';c.fillRect(x,GY-h,40,h);c.fillStyle='#ffd86b';for(let y=GY-h+8;y<GY-12;y+=16)for(let k=0;k<3;k++)if(q(i*9+y+k)>.55)c.fillRect(x+6+k*11,y,6,8);if(i%5==0){c.fillStyle='#ff3b3b';c.fillRect(x+19,GY-h-26,2,26);gdot(c,x+20,GY-h-26,14,'#ff3b3b',200)}}}
 else if(s==2){for(let x=20,i=0;x<W;x+=58,i++){const h=(60+q(i)*90)*1.5;c.fillStyle='#bfe4f5';c.beginPath();c.moveTo(x-22,GY);c.lineTo(x,GY-h);c.lineTo(x+22,GY);c.fill();c.fillStyle='#ffffffaa';c.beginPath();c.moveTo(x,GY-h);c.lineTo(x+22,GY);c.lineTo(x+6,GY);c.fill()}}
 else if(s==5||s==9){for(let x=20,i=0;x<W;x+=(s==5?66:96),i++){const h=(70+q(i)*80)*1.5;
   if(s==5){c.fillStyle='#4a2f1c';c.fillRect(x-4,GY-h*.3,8,h*.3);for(let k=0;k<4;k++){c.fillStyle=k%2?'#1f5c3a':'#2a6c46';c.beginPath();c.moveTo(x-(52-k*10),GY-h*.2-k*h*.18);c.lineTo(x,GY-h*.62-k*h*.2);c.lineTo(x+(52-k*10),GY-h*.2-k*h*.18);c.fill()}if(i%4==0){c.fillStyle='#e6425a';c.beginPath();c.arc(x+30,GY-10,9,Math.PI,0);c.fill();c.fillStyle='#f3e6c8';c.fillRect(x+28,GY-10,4,10)}}
   else{c.fillStyle='#2a1a10';c.fillRect(x-12,0,24,GY);c.strokeStyle='#2f7a3a';c.lineWidth=3;for(let k=0;k<3;k++){c.beginPath();c.moveTo(x+(k-1)*8,60);c.bezierCurveTo(x+14+k*6,200,x-16,300,x+(k-1)*10,140+k*120+q(i)*100);c.stroke()}c.fillStyle='#2f9a4a';c.beginPath();c.ellipse(x+36,GY-18,40,14,-.5,0,7);c.fill();c.beginPath();c.ellipse(x-34,GY-22,36,12,.5,0,7);c.fill()}}}
 else if(s==3){c.fillStyle='#120606';for(let x=0,i=0;x<W;x+=70,i++){const h=(80+q(i)*120)*1.5;c.beginPath();c.moveTo(x,GY);c.lineTo(x+35,GY-h);c.lineTo(x+70,GY);c.fill();c.strokeStyle='#ff5a1a88';c.lineWidth=2;c.beginPath();c.moveTo(x+35,GY-h);c.lineTo(x+30,GY-h*.5);c.stroke()}
  const lg=c.createLinearGradient(0,GY-70,0,GY);lg.addColorStop(0,'#ff4a1a00');lg.addColorStop(1,'#ff6a1acc');c.fillStyle=lg;c.fillRect(0,GY-70,W,70)}
 else if(s==7){for(let k=0;k<2;k++){c.fillStyle=k?'#b8793a':'#9a5f2c';c.beginPath();c.moveTo(0,GY);for(let x=0;x<=W;x+=20)c.lineTo(x,GY-60-k*40+Math.sin(x*.006+k*3)*40);c.lineTo(W,GY);c.fill()}
  c.fillStyle='#2f6b3a';for(let x=120,i=0;x<W;x+=240,i++){const h=70+q(i)*60;rr(x-9,GY-h,18,h,'#2f6b3a',c,8);rr(x-30,GY-h*.7,12,h*.35,'#2f6b3a',c,6);rr(x-30,GY-h*.5,30,10,'#2f6b3a',c,5);rr(x+18,GY-h*.8,12,h*.4,'#2f6b3a',c,6);rr(x,GY-h*.55,28,10,'#2f6b3a',c,5)}}
 else if(s==8||s==11){for(let x=80,i=0;x<W;x+=210,i++){const h=90+q(i)*130;c.fillStyle='#1a1440';c.fillRect(x-8,GY-h,16,h);c.fillStyle='#2a2060';c.beginPath();c.arc(x,GY-h,34,Math.PI,0);c.fill();c.strokeStyle='#7a6bff';c.lineWidth=2;c.beginPath();c.arc(x,GY-h,34,Math.PI,0);c.stroke();c.fillStyle='#59d6ff';c.fillRect(x-1,GY-h-52,2,24);gdot(c,x,GY-h-52,14,'#59d6ff',230)}}
 else if(s==10){for(let x=110,i=0;x<W;x+=300,i++){c.fillStyle='#3a2a1a';c.fillRect(x-64,GY-250,14,250);c.fillRect(x+50,GY-250,14,250);c.fillRect(x-74,GY-262,148,16);c.fillStyle='#5a4228';c.fillRect(x-74,GY-262,148,5);c.strokeStyle='#201710';c.lineWidth=3;c.beginPath();c.moveTo(x,GY-246);c.lineTo(x,GY-210);c.stroke();gdot(c,x,GY-200,90,'#ffb84a',140);c.fillStyle='#ffd98a';c.beginPath();c.arc(x,GY-204,9,0,7);c.fill()}
  c.strokeStyle='#3a2f24';c.lineWidth=4;c.beginPath();c.moveTo(0,GY-6);c.lineTo(W,GY-6);c.stroke();for(let x=10;x<W;x+=34){c.fillStyle='#2a2018';c.fillRect(x,GY-4,18,5)}}
 else if(s==12){for(let x=85,i=0;x<W;x+=260,i++){c.fillStyle='#271c1c';c.fillRect(x-44,GY-280,18,280);c.fillRect(x+26,GY-280,18,280);c.fillStyle='#684333';c.fillRect(x-58,GY-290,116,15);c.fillStyle='#ad6945';c.fillRect(x-52,GY-286,104,3);c.strokeStyle='#db8a54';c.lineWidth=5;c.beginPath();c.moveTo(x-16,GY-270);c.lineTo(x-16,GY-130);c.quadraticCurveTo(x-16,GY-90,x+8,GY-90);c.lineTo(x+8,GY-35);c.stroke();c.fillStyle='#ffc477';c.fillRect(x-4,GY-220,9,7)}c.fillStyle='#1c171a';c.fillRect(W*.5-150,GY-240,300,240);c.strokeStyle='#a96544';c.lineWidth=8;c.strokeRect(W*.5-150,GY-240,300,240);c.fillStyle='#ff9c5a';c.globalAlpha=.55;c.fillRect(W*.5-9,GY-228,18,212);c.globalAlpha=1;for(let i=0;i<8;i++){c.fillStyle=i%2?'#ffd08a':'#dc7548';c.fillRect(W*.5-128+i*36,GY-220,18,5)}}
 else if(s==13){for(let x=100,i=0;x<W;x+=300,i++){c.strokeStyle='#374b80';c.lineWidth=12;c.beginPath();c.moveTo(x,GY);c.lineTo(x,GY-230-(i%2)*35);c.stroke();c.strokeStyle='#718bc9';c.lineWidth=3;c.beginPath();c.moveTo(x-42,GY-180);c.lineTo(x+42,GY-180);c.stroke();c.fillStyle='#26365e';c.fillRect(x-68,GY-174,136,12);c.strokeStyle='#8da6e8';c.lineWidth=2;c.strokeRect(x-68,GY-174,136,12);c.fillStyle='#9db9ff';for(let k=0;k<4;k++)c.fillRect(x-54+k*34,GY-171,18,6)}c.strokeStyle='#526ca7';c.lineWidth=14;c.beginPath();c.moveTo(W*.5-260,GY-245);c.quadraticCurveTo(W*.5,GY-320,W*.5+260,GY-245);c.stroke();c.strokeStyle='#a8bcf3';c.lineWidth=3;c.stroke()}
 else{c.fillStyle='#3a2410';for(let x=60,i=0;x<W;x+=190,i++){const h=(110+q(i)*90)*1.5;c.fillRect(x,GY-h,26,h);c.fillRect(x-6,GY-h,38,10);c.fillStyle='#4a3018';c.fillRect(x+4,GY-h,5,h);c.fillStyle='#3a2410';if(i%3==0){c.fillRect(x-4,GY-h*.5,34,8)}}}}
function bgGround(c,s,q){let g=c.createLinearGradient(0,GY,0,H);g.addColorStop(0,M.p);g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(0,GY,W,H-GY);
 c.fillStyle=M.t;c.fillRect(0,GY,W,4);c.fillStyle='#ffffff22';c.fillRect(0,GY+4,W,2);
 if(s==5||s==9){c.strokeStyle=M.t;c.lineWidth=2;for(let x=0;x<W;x+=9){const h=5+q(x)*9;c.beginPath();c.moveTo(x,GY+1);c.lineTo(x+(q(x*2)-.5)*5,GY-h);c.stroke()}}
 else if(s==2){c.fillStyle='#e9f8ff';c.beginPath();c.moveTo(0,GY+8);for(let x=0;x<=W;x+=30)c.lineTo(x,GY-2-q(x)*9);c.lineTo(W,GY+8);c.fill()}
 else if(s==3){c.strokeStyle='#ff6a1a';c.lineWidth=3;for(let i=0;i<22;i++){const x=q(i)*W,y=GY+10+q(i+5)*(H-GY-20);c.beginPath();c.moveTo(x,y);c.lineTo(x+30+q(i)*40,y+8);c.lineTo(x+60+q(i)*30,y-4);c.stroke()}}
 else if(s==8||s==11){c.strokeStyle='#ffffff18';c.lineWidth=2;for(let x=0;x<W;x+=80){c.beginPath();c.moveTo(x,GY+4);c.lineTo(x,H);c.stroke()}c.fillStyle='#59d6ff';for(let x=40;x<W;x+=160)c.fillRect(x,GY+12,40,3)}
 else{c.fillStyle='#00000030';for(let i=0;i<120;i++){c.beginPath();c.arc(q(i)*W,GY+8+q(i+9)*(H-GY-10),1+q(i+3)*3,0,7);c.fill()}}}
function bgPlat(c,s,p){const x=p[0],y=p[1],w=p[2],q=i=>Math.abs(Math.sin(i*12.9898+x*.37));
 c.fillStyle='#0006';c.beginPath();c.roundRect(x+5,y+18,w-10,9,4);c.fill();
 rr(x,y,w,17,mix(M.p,0,.38),c,7);rr(x,y,w,12,M.p,c,6);rr(x+2,y,w-4,4,M.t,c,2);rr(x+4,y+4,w-8,2,'#ffffff22',c,1);
 c.fillStyle='#0003';for(let k=x+12;k<x+w-8;k+=22)c.fillRect(k,y+7,8,2);
 if(s==5||s==9){c.strokeStyle=M.t;c.lineWidth=2;for(let k=x+4;k<x+w-4;k+=7){c.beginPath();c.moveTo(k,y+1);c.lineTo(k+(q(k)-.5)*4,y-4-q(k*2)*6);c.stroke()}c.strokeStyle='#2f8a4a';c.lineWidth=2;for(let k=x+14;k<x+w-10;k+=30){c.beginPath();c.moveTo(k,y+16);c.quadraticCurveTo(k+4,y+30,k-2,y+40+q(k)*14);c.stroke()}}
 else if(s==2){c.fillStyle='#e6f7ff';for(let k=x+8;k<x+w-6;k+=16){const h=8+q(k)*14;c.beginPath();c.moveTo(k,y+16);c.lineTo(k+3,y+16+h);c.lineTo(k+6,y+16);c.fill()}c.fillStyle='#ffffffaa';c.beginPath();c.roundRect(x+3,y-3,w-6,5,3);c.fill()}
 else if(s==3){c.strokeStyle='#ff7a3c';c.lineWidth=2;for(let k=x+10;k<x+w-10;k+=24){c.beginPath();c.moveTo(k,y+4);c.lineTo(k+6,y+10);c.lineTo(k+2,y+15);c.stroke()}c.globalCompositeOperation='lighter';c.fillStyle='#ff6a1a33';c.fillRect(x,y+17,w,6);c.globalCompositeOperation='source-over'}
 else if(s==4||s==8||s==11){c.globalCompositeOperation='lighter';c.fillStyle=M.t+'aa';c.fillRect(x+3,y,w-6,2);c.fillStyle=M.t+'33';c.fillRect(x,y+14,w,5);c.globalCompositeOperation='source-over'}
 else if(s==6){c.fillStyle='#00000030';for(let k=x+w/6;k<x+w;k+=w/6)c.fillRect(k,y,2,17);c.fillStyle='#e6c9a0';c.fillRect(x+3,y+17,3,12);c.fillRect(x+w-6,y+17,3,12)}
 else if(s==7){c.fillStyle='#f7c98b';c.beginPath();c.moveTo(x+4,y);for(let k=x+4;k<x+w-4;k+=14)c.lineTo(k+7,y-3-q(k)*3);c.lineTo(x+w-4,y);c.fill();c.fillStyle='#0003';c.fillRect(x+6,y+10,w-12,2)}
 else if(s==10){c.fillStyle='#e6c27a';for(const k of[x+8,x+w-12])c.fillRect(k,y+3,4,4);c.fillStyle='#3a2a1a';c.fillRect(x+w*.3,y+17,6,16);c.fillRect(x+w*.7,y+17,6,16)}
 else{c.fillStyle='#00000033';for(let k=x+10;k<x+w-10;k+=28){c.beginPath();c.moveTo(k,y+17);c.lineTo(k+5,y+25);c.lineTo(k+10,y+17);c.fill()}}}
function mkbg(){const bs=Math.min(sc,1.25);bgS=bs;bgc=document.createElement('canvas');bgc.width=Math.max(1,Math.round(W*bs));bgc.height=Math.max(1,Math.round(H*bs));
 const c=bgc.getContext('2d');c.scale(bs,bs);const s=M.s,Z=W/1280,q=i=>Math.abs(Math.sin(i*12.9898+s*7.3));
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,M.g[0]);g.addColorStop(1,M.g[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
 bgSky(c,s,q,Z);
 for(let k=s==11?2:0;k<3;k++){c.fillStyle=k==0?M.h+'55':k==1?M.h+'99':M.h;c.beginPath();c.moveTo(0,H);const base=H*(.6+k*.07);for(let x=0;x<=W;x+=16)c.lineTo(x,base+Math.sin(x*.0085/Z*1+s*2+k*2)*38*Z+Math.sin(x*.021/Z+k)*13*Z);c.lineTo(W,H);c.fill()}
 bgScene(c,s,q,Z);bgGround(c,s,q);
 for(const p of M.pl){if(p[3])continue;bgPlat(c,s,p)}}

/* ---------- анимированная атмосфера (дёшево: один путь) ---------- */
function decor(){const t=G.t,s=M.s;
 if(s==1||s==5||s==6){cx.fillStyle=s==5?'#ffffff77':'#ffd2a055';cx.beginPath();for(let i=0;i<6;i++){const x=((i*260+t*(8+i*3))%(W+300))-150,y=140+i%3*110;cx.moveTo(x+70,y);cx.ellipse(x,y,70,16,0,0,7);cx.moveTo(x+84,y-8);cx.ellipse(x+40,y-8,44,14,0,0,7)}cx.fill()}
 const n=s==2?44:s==3?36:s==10?26:s==7?30:s==4||s==8||s==11?0:20;
 if(n){cx.fillStyle=s==3?'#ffb347':s==10?'#e9c98a':s==7?'#f7d9a8':s==2?'#fff':'#ffffffaa';cx.globalAlpha=.8;cx.beginPath();
  for(let i=0;i<n;i++){let x=(i*137.5)%W,y;
   if(s==2){x+=Math.sin(t+i)*20;y=(i*53+t*(30+i%5*12))%H}
   else if(s==3){y=H-(i*53+t*(40+i%7*14))%H;x+=Math.sin(t*2+i)*10}
   else if(s==7){x=(x+t*(60+i%5*14))%W;y=GY-30-(i*29)%260}
   else{x+=Math.sin(t*.6+i)*30;y=(i*47+t*(6+i%4*3))%(H*.9)}
   cx.rect(x,y,2,2)}cx.fill();cx.globalAlpha=1}
 if(s==4||s==8||s==11){cx.fillStyle='#fff';for(let i=0;i<28;i++){cx.globalAlpha=.35+.55*Math.abs(Math.sin(t*1.6+i*2.1));cx.fillRect((i*137.5)%W,(i*71)%(H*.5),2,2)}cx.globalAlpha=1}
 if(s==5||s==9){for(let i=0;i<9;i++){const x=(i*211+Math.sin(t*.5+i)*60)%W,y=GY-60-((i*97)%360)+Math.sin(t*1.3+i*2)*20;drawGlow(x,y,14,'#eaff7a',.45+.4*Math.sin(t*3+i))}}}

/* ===================== ОТРИСОВКА НОВЫХ СИСТЕМ ===================== */
function drawTurrets(){for(const t of TUR){const k=t.kind,col=k=='e'?'#63eaff':k=='r'?'#ffb347':'#8ce5ff';cx.save();cx.translate(t.x,t.y);
  cx.drawImage(shSpr(),-26,-4,52,8);
  cx.strokeStyle='#101522';cx.lineWidth=3;cx.lineCap='round';cx.lineJoin='round';cx.beginPath();cx.moveTo(-8,-4);cx.lineTo(-5,-13);cx.lineTo(5,-13);cx.lineTo(8,-4);cx.stroke();
  rr(-15,-8,30,7,t.fl>0?'#ffffff':'#44516a',cx,3);rr(-11,-17,22,12,t.fl>0?'#ffffff':'#283449',cx,4);rr(-8,-19,16,5,t.c||col,cx,2);
  if(k=='e'){cx.strokeStyle='#63eaff';cx.lineWidth=2;cx.beginPath();cx.moveTo(-10,-18);cx.lineTo(-14,-32);cx.moveTo(10,-18);cx.lineTo(14,-32);cx.stroke();cx.fillStyle='#d9ffff';cx.beginPath();cx.arc(-14,-33,3,0,7);cx.arc(14,-33,3,0,7);cx.fill();if(Math.sin(G.t*20)>.3){cx.strokeStyle='#bffaff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(-14,-33);cx.lineTo(-4+Math.sin(G.t*60)*3,-38);cx.lineTo(14,-33);cx.stroke()}}
  cx.save();cx.translate(0,-15);cx.rotate(t.angle||0);
  if(k=='r'){rr(-2,-6,26,12,'#5b4a38',cx,3);rr(14,-5,12,4,'#ffb347',cx,1);rr(14,1,12,4,'#ffb347',cx,1);rr(22,-6,5,12,'#2b2118',cx,1)}
  else{rr(-1,-4,24,8,'#39485d',cx,3);rr(15,-3,10,6,'#7b91a8',cx,2);rr(22,-2,5,4,col,cx,1)}
  cx.restore();drawGlow(Math.cos(t.angle||0)*27,-15+Math.sin(t.angle||0)*27,9,col,.35+.2*Math.sin(G.t*12));
  if(t.rep){cx.strokeStyle='#7ee08a';cx.lineWidth=2;cx.globalAlpha=.5+.3*Math.sin(G.t*8);cx.beginPath();cx.arc(0,-16,26,0,7);cx.stroke();cx.globalAlpha=1;cx.fillStyle='#7ee08a';cx.fillRect(-1.5,-46,3,9);cx.fillRect(-4.5,-43,9,3)}
  const r=cl(t.hp/t.mh,0,1);rr(-20,-32,40,5,'#101522',cx,2);rr(-19,-31,38*r,3,r>.5?'#7ee08a':r>.25?'#ffc94a':'#ff5a5a',cx,1);
  if(k!='g'){cx.fillStyle=col;cx.font='bold 9px system-ui';cx.textAlign='center';cx.fillText(k=='e'?'ЭЛЕКТРО':'РАКЕТЫ',0,-37)}
  cx.restore()}}
function drawWalls(){for(const w of WALLS){const l=w.x-96,r=w.x+96,top=w.y,bottom=w.bottom,k=Math.min(1,w.hp/2),hr=cl(w.hp/w.max,0,1);cx.save();cx.globalCompositeOperation='lighter';
  const grad=cx.createLinearGradient(l,top,r,bottom);grad.addColorStop(0,`rgba(255,174,82,${.11*k})`);grad.addColorStop(.5,`rgba(122,216,255,${.19*k})`);grad.addColorStop(1,`rgba(255,174,82,${.11*k})`);cx.fillStyle=grad;cx.fillRect(l,top,r-l,bottom-top);
  cx.strokeStyle=hr<.3?'#ff9a8a':'#8ee9ff';cx.globalAlpha=(.55+.3*hr)*k;cx.lineWidth=5;cx.beginPath();cx.moveTo(l,top);cx.lineTo(l,bottom);cx.moveTo(r,top);cx.lineTo(r,bottom);cx.moveTo(l,top);cx.lineTo(r,top);cx.stroke();
  cx.globalAlpha=.3*k;cx.lineWidth=1.5;for(let y=top+12;y<bottom;y+=22){cx.beginPath();cx.moveTo(l,y);cx.lineTo(r,y);cx.stroke()}for(let x=l+12;x<r;x+=24){cx.beginPath();cx.moveTo(x,top);cx.lineTo(x+10,bottom);cx.stroke()}
  if(hr<.4){cx.globalAlpha=.7*k;cx.strokeStyle='#ffd0c0';cx.lineWidth=2;for(let i=0;i<4;i++){const x=l+30+i*45;cx.beginPath();cx.moveTo(x,top+10);cx.lineTo(x+10,top+50);cx.lineTo(x-6,top+90);cx.stroke()}}
  cx.globalAlpha=1;cx.restore();cx.fillStyle='#101a2b';cx.fillRect(w.x-32,top-18,64,7);cx.fillStyle=hr<.3?'#ff6a5a':'#ffb45e';cx.fillRect(w.x-30,top-16,60*hr,3)}}
function drawHZx(h){if(h.k=='bolt'){const k=cl(h.t/h.wt,0,1),pu=.5+.5*Math.sin(G.t*30);cx.save();cx.strokeStyle='#9ad7ff';cx.globalAlpha=.4+.4*k;cx.lineWidth=2+k*3;cx.beginPath();cx.ellipse(h.x,h.y,70*(1.1-k*.4),14,0,0,7);cx.stroke();cx.setLineDash([8,10]);cx.globalAlpha=.25+.3*pu;cx.beginPath();cx.moveTo(h.x,-40);cx.lineTo(h.x,h.y);cx.stroke();cx.restore();return}
 if(h.ex==null)return;cx.save();cx.lineCap='round';
 if(h.t<h.wt){const k=h.t/h.wt;cx.globalAlpha=.25+.55*k*(.6+.4*Math.sin(G.t*40));cx.strokeStyle=h.c;cx.lineWidth=2+k*2;cx.setLineDash([14,10]);cx.beginPath();cx.moveTo(h.ox,h.oy);cx.lineTo(h.ex,h.ey);cx.stroke()}
 else{const k=cl(1-(h.t-h.wt)/h.dur,0,1),fl=h.blocked?.35:1;cx.globalCompositeOperation='lighter';cx.globalAlpha=.55*fl;cx.strokeStyle=h.c;cx.lineWidth=h.w*1.9;cx.beginPath();cx.moveTo(h.ox,h.oy);cx.lineTo(h.ex,h.ey);cx.stroke();cx.globalAlpha=.95*fl;cx.strokeStyle='#fff3e0';cx.lineWidth=h.w*.5*(h.sweep?1:.4+k*.6);cx.stroke();drawGlow(h.ex,h.ey,40,h.c,.7*fl)}
 cx.restore()}
function drawIX(){if(!DY.pl.length&&!DY.pads.length)return;const T=G.t;
 for(const c of DY.pads){if(c.k!='conv')continue;cx.save();rr(c.x,c.y-6,c.w,6,'#262c3a',cx,3);cx.fillStyle='#ffd24a';cx.beginPath();const off=(T*c.sp*c.dir)%28;for(let x=c.x-28;x<c.x+c.w+28;x+=28){const px=x+(off<0?off+28:off);if(px<c.x+4||px>c.x+c.w-10)continue;cx.moveTo(px,c.y-5.5);cx.lineTo(px+6*c.dir,c.y-3);cx.lineTo(px,c.y-.5)}cx.fill();cx.fillStyle='#44506a';cx.beginPath();cx.arc(c.x+2,c.y-3,4,0,7);cx.arc(c.x+c.w-2,c.y-3,4,0,7);cx.fill();cx.restore()}
 for(const q of DY.pads){if(q.k!='tramp')continue;const a=Math.max(0,q.a);cx.save();cx.translate(q.x,q.y);rr(-q.w/2,-5,q.w,5,'#2a3042',cx,2);cx.strokeStyle='#cfd6e6';cx.lineWidth=3;cx.beginPath();const top=-18+a*9;for(let i=0;i<=6;i++){const x=-q.w/2+10+i*(q.w-20)/6;cx.lineTo(x,i%2?top+3:-5)}cx.stroke();rr(-q.w/2-2,top-8,q.w+4,9,a>0?'#ff9aa8':'#ff4d6a',cx,4);rr(-q.w/2+4,top-7,q.w-8,3,'#ffffff55',cx,1);cx.restore()}
 for(const t of DY.tp){cx.save();cx.translate(t.x,t.y);rr(-28,-4,56,6,'#222a3c',cx,3);rr(-28,-4,56,2,t.c,cx,1);cx.drawImage(shSpr(),-24,-5,48,10);drawGlow(0,-34,44,t.c,.5);cx.strokeStyle=t.c;cx.lineWidth=4;cx.beginPath();cx.ellipse(0,-34,19,34,0,0,7);cx.stroke();cx.lineWidth=2;cx.globalAlpha=.8;for(let i=0;i<3;i++){const a=t.ph*(2+i)+i*2.1;cx.beginPath();cx.ellipse(0,-34,12-i*3,24-i*6,a*.3,a,a+2.2);cx.stroke()}cx.globalAlpha=.25;cx.fillStyle=t.c;cx.beginPath();cx.ellipse(0,-34,17,32,0,0,7);cx.fill();cx.restore()}
 for(const p of DY.pl){if(p.k=='move'){cx.save();const vert=p.ay>p.ax;rr(p.x,p.y+17,p.w,5,'#59d6ff55',cx,2);rr(p.x,p.y,p.w,17,'#2f4c78',cx,7);rr(p.x,p.y,p.w,12,'#4a74b0',cx,6);rr(p.x+2,p.y,p.w-4,4,'#9fd0ff',cx,2);cx.fillStyle='#e6f3ff';cx.beginPath();for(let i=0;i<3;i++){const x=p.x+p.w*(.25+i*.25);if(vert){cx.moveTo(x-5,p.y+9);cx.lineTo(x,p.y+3);cx.lineTo(x+5,p.y+9)}else{cx.moveTo(x-3,p.y+3);cx.lineTo(x+4,p.y+7);cx.lineTo(x-3,p.y+11)}}cx.fill();drawGlow(p.x+p.w/2,p.y+20,p.w*.45,'#59d6ff',.25);cx.restore()}
  else{if(p.st==3){cx.save();cx.globalAlpha=.2;cx.setLineDash([6,8]);cx.strokeStyle='#d8c7a8';cx.strokeRect(p.x,p.y0,p.w,17);cx.restore();continue}
   cx.save();const sh=p.st==1?p.shake||0:0,fa=p.st==2?cl(1-p.t/.9,0,1):1;cx.globalAlpha=fa;cx.translate(sh,0);if(p.pop>0)cx.translate(0,-p.pop*6);
   rr(p.x,p.y,p.w,17,'#5c4c3b',cx,6);rr(p.x,p.y,p.w,12,p.st==1?'#a07a58':'#8d7a63',cx,5);rr(p.x+2,p.y,p.w-4,4,'#c9b595',cx,2);cx.strokeStyle='#3a2d20';cx.lineWidth=2;cx.beginPath();for(let x=p.x+14;x<p.x+p.w-8;x+=26){cx.moveTo(x,p.y+2);cx.lineTo(x+6,p.y+8);cx.lineTo(x+1,p.y+14)}if(p.st==1){const n=1+Math.floor(p.t/1.3*5);for(let x=p.x+26,i=0;x<p.x+p.w-8&&i<n;x+=34,i++){cx.moveTo(x,p.y+1);cx.lineTo(x-8,p.y+9);cx.lineTo(x+4,p.y+16)}}cx.stroke();cx.restore()}}}
function propLandY(o){let best=GY;for(const p of M.pl)if(o.x>p[0]&&o.x<p[0]+p[2]&&p[1]>=o.y-4&&p[1]<best)best=p[1];for(const p of DY.pl)if(p.solid&&o.x>p.x&&o.x<p.x+p.w&&p.y>=o.y-4&&p.y<best)best=p.y;return best}
function drawOB(){for(const o of OB){cx.save();
  if(o.fell&&!o.og){const ly=propLandY(o),pu=.5+.5*Math.sin(G.t*14);cx.globalAlpha=.35+.35*pu;cx.strokeStyle='#ff4a4a';cx.lineWidth=3;cx.beginPath();cx.ellipse(o.x,ly,o.w*.9,6,0,0,7);cx.stroke();cx.setLineDash([6,10]);cx.globalAlpha=.2;cx.beginPath();cx.moveTo(o.x,Math.max(0,o.y));cx.lineTo(o.x,ly);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1}
  cx.translate(o.x,o.y);const fl=o.fl>0,rot=(o.fell&&!o.og)?Math.sin(o.age*5)*.12:0;cx.rotate(rot);cx.drawImage(shSpr(),-o.w*.8,-3,o.w*1.6,8);cx.lineJoin='round';cx.lineCap='round';
  if(o.k=='barrel'){const c=fl?'#fff':'#c2412b';rr(-15,-46,30,46,c,cx,6);rr(-15,-37,30,5,fl?'#fff':'#7a2418',cx,1);rr(-15,-14,30,5,fl?'#fff':'#7a2418',cx,1);rr(-11,-44,5,42,'#ffffff30',cx,2);rr(-9,-50,18,5,'#444b5a',cx,2);cx.fillStyle='#ffd24a';cx.beginPath();cx.moveTo(0,-32);cx.quadraticCurveTo(7,-26,2,-18);cx.quadraticCurveTo(0,-22,-3,-19);cx.quadraticCurveTo(-8,-26,0,-32);cx.fill();cx.strokeStyle='#0b0d17';cx.lineWidth=2.4;cx.beginPath();cx.roundRect(-15,-46,30,46,6);cx.stroke()}
  else if(o.k=='gen'){const c=fl?'#fff':'#e6c13a';rr(-27,-34,54,34,c,cx,5);cx.fillStyle='#1a1d27';for(let i=-27;i<20;i+=14){cx.beginPath();cx.moveTo(i,0);cx.lineTo(i+7,0);cx.lineTo(i+14,-8);cx.lineTo(i+7,-8);cx.fill()}rr(-20,-46,40,13,fl?'#fff':'#3a4156',cx,3);cx.fillStyle='#9ff0ff';cx.beginPath();cx.moveTo(2,-45);cx.lineTo(-5,-38);cx.lineTo(0,-38);cx.lineTo(-3,-31);cx.lineTo(6,-40);cx.lineTo(1,-40);cx.fill();rr(22,-56,3,24,'#6b7388',cx,1);const sp=Math.sin(G.t*18)>0;cx.fillStyle=sp?'#9ff0ff':'#3a6a78';cx.beginPath();cx.arc(23.5,-57,3.2,0,7);cx.fill();if(sp)drawGlow(23.5,-57,16,'#7fe8ff',.6);cx.strokeStyle='#0b0d17';cx.lineWidth=2.4;cx.beginPath();cx.roundRect(-27,-34,54,34,5);cx.stroke()}
  else if(o.k=='cryo'){const c=fl?'#fff':'#79d6ff';rr(-14,-48,28,48,c,cx,12);rr(-14,-34,28,4,'#e8f8ff',cx,1);rr(-14,-14,28,4,'#e8f8ff',cx,1);rr(-9,-54,18,8,'#5a6a80',cx,2);rr(-9,-44,4,38,'#ffffff55',cx,2);cx.strokeStyle='#fff';cx.lineWidth=2;cx.beginPath();for(let i=0;i<3;i++){const a=i*1.047;cx.moveTo(Math.cos(a)*7,-24+Math.sin(a)*7);cx.lineTo(-Math.cos(a)*7,-24-Math.sin(a)*7)}cx.stroke();cx.strokeStyle='#0b0d17';cx.lineWidth=2.4;cx.beginPath();cx.roundRect(-14,-48,28,48,12);cx.stroke();drawGlow(0,-26,34,'#9fe3ff',.25)}
  else{rr(-14,-8,28,8,'#4a5368',cx,4);rr(-10,-12,20,6,'#6b7690',cx,3);const arm=o.age>.9,on=arm?Math.sin(G.t*10)>0:true;cx.fillStyle=on?'#ff3b3b':'#511';cx.beginPath();cx.arc(0,-13,3,0,7);cx.fill();if(on)drawGlow(0,-13,14,'#ff3b3b',.6);cx.strokeStyle='#0b0d17';cx.lineWidth=2;cx.beginPath();cx.roundRect(-14,-8,28,8,4);cx.stroke()}
  if(o.hp<o.mh&&o.k!='mine'){const r=cl(o.hp/o.mh,0,1);cx.rotate(-rot);rr(-14,-o.h-14,28,4,'#101522',cx,2);rr(-13,-o.h-13,26*r,2,r>.5?'#7ee08a':'#ff9a5a',cx,1)}
  cx.restore()}}
function drawDR(){for(const d of DR){cx.save();cx.translate(d.x,d.y);const a=Math.atan2(d.vy,d.vx),k=d.life/3,bl=Math.sin(G.t*(8+(1-k)*30))>0;cx.rotate(cl(d.vx/900,-.4,.4));
  drawGlow(0,0,20,d.col,.35+(bl?.25:0));cx.fillStyle='#2a2f3d';cx.strokeStyle='#0b0d17';cx.lineWidth=2;cx.beginPath();cx.ellipse(0,0,11,7,0,0,7);cx.fill();cx.stroke();
  cx.fillStyle='#59647d';cx.beginPath();cx.ellipse(0,-2,8,4,0,Math.PI,0);cx.fill();cx.fillStyle=bl?'#ff4a3a':'#6a1a14';cx.beginPath();cx.arc(0,1,3,0,7);cx.fill();
  cx.strokeStyle='#9aa4b8';cx.lineWidth=2;cx.beginPath();cx.moveTo(-14,-7);cx.lineTo(-5,-5);cx.moveTo(14,-7);cx.lineTo(5,-5);cx.stroke();cx.globalAlpha=.5;cx.fillStyle='#cbd2df';cx.beginPath();cx.ellipse(-14,-8,9*Math.abs(Math.sin(G.t*50)),1.5,0,0,7);cx.ellipse(14,-8,9*Math.abs(Math.cos(G.t*50)),1.5,0,0,7);cx.fill();cx.globalAlpha=1;
  cx.strokeStyle=d.col;cx.lineWidth=2;cx.globalAlpha=.8;cx.beginPath();cx.arc(0,0,16,-Math.PI/2,-Math.PI/2+6.283*cl(k,0,1));cx.stroke();cx.restore()}}
