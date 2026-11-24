function gun(w,e){OL=1;gunB(w,e);OL=0}
function gunB(w,e){const c=WP[w].c;const hi='#f7f8ff',dark='#252b3b',metal='#737d95',wood='#805638';const rivet=(x,y)=>{cx.fillStyle='#cbd2df';cx.beginPath();cx.arc(x,y,1.15,0,7);cx.fill()};const shine=(x,y,w,h)=>{cx.globalAlpha=.48;rr(x,y,w,h,'#ffffff',cx,1);cx.globalAlpha=1};const barrel=(x,y,w=20)=>{rr(x,y,w,3.2,'#34394b',cx,1);shine(x,y,w,1)};cx.lineCap='round';cx.lineJoin='round';
 switch(w){
 case'rail':rr(-15,-7,43,13,'#263e58',cx,3);rr(-9,-10,38,5,'#8298b5',cx,2);rr(18,-5,28,4,'#344b66',cx,2);rr(40,-6,12,6,'#9eefff',cx,2);cx.shadowColor='#8deaff';cx.shadowBlur=10;cx.fillStyle='#8deaff';cx.fillRect(34,-3,18,2);cx.shadowBlur=0;rivet(0,0);rivet(16,-1);break;
 case'acid':rr(-14,-8,38,15,'#315c3d',cx,4);rr(-8,-11,25,4,'#75b95e',cx,2);rr(18,-5,22,7,'#5e8c4c',cx,3);cx.fillStyle='#b8ff73';cx.shadowColor='#91ff5a';cx.shadowBlur=9;cx.beginPath();cx.arc(31,-1,4,0,7);cx.fill();cx.shadowBlur=0;rr(0,7,8,5,'#263a2a',cx,2);rivet(-4,-2);rivet(11,-3);break;
 case'pistol':rr(-8,-5,11,8,wood,cx,2);rr(-2,-7,22,9,'#aab2c5',cx,2);rr(14,-6,13,5,metal,cx,1);rr(20,-5,8,2,dark,cx,1);rr(0,1,6,9,dark,cx,1);rr(2,2,2,5,metal,cx,1);shine(0,-6,13,1.5);rivet(5,-1);rivet(13,-1);break;
 case'ak':rr(-10,-4,14,7,wood,cx,2);rr(1,-6,24,7,'#41495d',cx,1.5);rr(19,-7,14,3,metal,cx,1);barrel(30,-5,12);rr(9,0,6,12,dark,cx,2);rr(12,1,2,7,metal,cx,1);rr(1,1,5,7,wood,cx,1);rr(26,-8,4,3,'#d9b45b',cx,1);shine(4,-5,17,1.3);rivet(3,-1);rivet(21,-2);break;
 case'shot':rr(-12,-5,16,8,wood,cx,2);rr(2,-7,29,5,'#4b5368',cx,1.5);rr(5,-1,29,4,'#727d91',cx,1.5);barrel(29,-6,12);rr(7,2,7,9,dark,cx,2);shine(6,-6,20,1.3);rivet(12,-1);rivet(25,-1);break;
 case'bazo':rr(-16,-9,43,13,'#5b8050',cx,4);rr(-19,-6,6,8,dark,cx,2);rr(-10,-11,30,3,'#a4c27f',cx,2);rr(25,-10,8,15,'#3d4f42',cx,2);rr(30,-8,5,11,'#a7b8a2',cx,1);rr(-3,3,7,9,dark,cx,2);rr(7,4,7,6,wood,cx,2);rr(2,-2,17,3,'#a1b47b',cx,1);rivet(3,-5);rivet(18,-5);break;
 case'snow':cx.fillStyle='#eaf8ff';cx.beginPath();cx.arc(8,-2,7,0,7);cx.fill();cx.strokeStyle='#8fd3ff';cx.lineWidth=2;cx.stroke();cx.strokeStyle='#ffffff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(4,-3);cx.lineTo(10,3);cx.moveTo(10,-5);cx.lineTo(5,1);cx.stroke();break;
 case'katana':cx.rotate(e.sw>0?-1.3+(1-e.sw/.3)*2.6:-.5);rr(-5,-3,14,5,'#5a3a2a',cx,2);cx.strokeStyle='#e6c46c';cx.lineWidth=2;cx.beginPath();cx.moveTo(7,-7);cx.lineTo(7,5);cx.stroke();rr(8,-2,40,3.6,'#cbd7e8',cx,1);cx.fillStyle='#ffffff';cx.beginPath();cx.moveTo(8,-2);cx.lineTo(49,-1.5);cx.lineTo(56,-.5);cx.lineTo(49,1);cx.lineTo(8,1);cx.closePath();cx.fill();cx.strokeStyle='#72839a';cx.lineWidth=.8;cx.stroke();shine(12,-2,30,1);break;
 case'mini':rr(-11,-6,17,12,'#343b50',cx,2);rr(-4,-9,25,4,'#6c768d',cx,1);rr(-4,-2,25,4,'#8893a8',cx,1);rr(-4,5,25,4,'#6c768d',cx,1);for(let i=0;i<3;i++){rr(18,-8+i*6,21,3,metal,cx,1);barrel(38,-8+i*6,7)}rr(4,1,8,10,dark,cx,2);rr(2,-10,6,3,c,cx,1);shine(0,-5,11,1);break;
 case'snip':rr(-12,-5,17,8,dark,cx,2);rr(2,-7,39,4,'#56627a',cx,1.5);rr(11,-11,16,5,dark,cx,1.5);rr(16,-13,6,3,c,cx,1);rr(4,-2,38,3,metal,cx,1);rr(7,0,6,10,dark,cx,1.5);rr(28,-9,8,4,'#9ea8ba',cx,1);cx.strokeStyle='#b5f7e4';cx.lineWidth=1.5;cx.beginPath();cx.arc(20,-9,4,0,7);cx.stroke();shine(6,-6,26,1);break;
 case'gren':cx.fillStyle='#6f8f3a';cx.beginPath();cx.ellipse(8,0,7,8,.2,0,7);cx.fill();cx.strokeStyle='#263a25';cx.lineWidth=2;cx.stroke();rr(5,-10,7,4,'#cfd6e6',cx,1);cx.strokeStyle=c;cx.lineWidth=2;cx.beginPath();cx.moveTo(8,-10);cx.quadraticCurveTo(18,-17,20,-9);cx.stroke();rivet(5,1);break;
 case'fire':rr(-10,-5,13,9,'#b23e2c',cx,2);rr(1,-7,27,10,'#4f586d',cx,2);rr(6,-9,15,3,'#8f9aad',cx,1);rr(24,-5,9,6,'#303747',cx,1);rr(30,-7,5,10,'#333b50',cx,1);cx.fillStyle=c;cx.beginPath();cx.arc(37,-2,3+Math.sin(G.t*30),0,7);cx.fill();cx.fillStyle='#ffe7a0';cx.beginPath();cx.arc(38,-2,1.2,0,7);cx.fill();shine(5,-6,14,1);break;
 case'hamm':cx.rotate(e.sw>0?-1.5+(1-e.sw/.3)*2.7:-.6);rr(-4,-1.5,31,4,'#8a6a40',cx,2);rr(22,-10,14,20,'#778397',cx,3);rr(22,-10,14,5,c,cx,2);rr(22,5,14,5,'#5b6579',cx,2);shine(25,-8,8,1.5);break;
 case'rain':rr(-8,-7,26,14,'#29213e',cx,3);for(let k=0;k<6;k++){rr(-5+k*4.5,-5,3.5,10,`hsl(${k*60+G.t*200},90%,62%)`,cx,1)}rr(17,-5,11,10,'#6551b7',cx,2);cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(-5,-9);cx.lineTo(15,-9);cx.stroke();cx.fillStyle='#ffffffcc';cx.beginPath();cx.arc(30,0,3.5,0,7);cx.fill();break;
 case'tesla':rr(-10,-6,20,12,'#174b5a',cx,3);rr(5,-9,15,18,'#327d91',cx,3);rr(8,-7,8,3,'#8ceeff',cx,1);cx.strokeStyle='#d9ffff';cx.lineWidth=2.4;cx.beginPath();cx.moveTo(20,-8);cx.lineTo(26,-2);cx.lineTo(21,2);cx.lineTo(28,8);cx.stroke();cx.shadowColor='#63eaff';cx.shadowBlur=8;cx.strokeStyle='#63eaff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(18,0);cx.lineTo(25,0);cx.stroke();cx.shadowBlur=0;break;
 case'harpoon':rr(-10,-5,23,10,'#594c38',cx,3);rr(10,-3,19,6,'#b9a477',cx,2);rr(17,-5,8,10,'#66553b',cx,2);cx.fillStyle='#e4c47a';cx.beginPath();cx.moveTo(29,-6);cx.lineTo(42,0);cx.lineTo(29,6);cx.lineTo(32,0);cx.closePath();cx.fill();cx.strokeStyle='#fff0bd';cx.lineWidth=1.2;cx.stroke();break;
 case'boomerang':cx.save();cx.rotate(Math.sin(G.t*5)*.08);cx.lineWidth=8;cx.strokeStyle='#784e30';cx.beginPath();cx.moveTo(-7,-10);cx.quadraticCurveTo(5,-2,12,0);cx.quadraticCurveTo(5,2,-7,10);cx.stroke();cx.lineWidth=5;cx.strokeStyle='#ffa85c';cx.stroke();cx.strokeStyle='#ffe0ad';cx.lineWidth=1.4;cx.beginPath();cx.moveTo(-6,-7);cx.lineTo(9,0);cx.lineTo(-6,7);cx.stroke();cx.restore();break;
 case'mirror':rr(-7,-12,24,24,'#567e92',cx,3);rr(-4,-9,18,18,'#b9f2ff',cx,2);cx.fillStyle='#f5ffff';cx.beginPath();cx.moveTo(-2,6);cx.lineTo(1,-5);cx.lineTo(8,-8);cx.lineTo(4,3);cx.closePath();cx.fill();cx.strokeStyle='#ffffff';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(-3,7);cx.lineTo(8,-7);cx.stroke();break;
 case'time':rr(-9,-10,28,20,'#30376f',cx,4);rr(-5,-7,20,14,'#565da1',cx,3);cx.strokeStyle='#d8dcff';cx.lineWidth=2;cx.beginPath();cx.arc(5,0,6,0,7);cx.moveTo(5,0);cx.lineTo(5,-4);cx.moveTo(5,0);cx.lineTo(9,3);cx.stroke();cx.fillStyle='#aeb2ff';cx.beginPath();cx.arc(-6,-5,2,0,7);cx.fill();break;
 case'gravity':cx.fillStyle='#170d28';cx.beginPath();cx.arc(7,0,11,0,7);cx.fill();cx.strokeStyle='#cdaaff';cx.lineWidth=3;cx.beginPath();cx.ellipse(7,0,17,6,G.t,0,7);cx.stroke();cx.strokeStyle='#f0d9ff';cx.lineWidth=1.2;cx.beginPath();cx.ellipse(7,0,12,3,G.t*-.7,0,7);cx.stroke();cx.fillStyle='#ffffff';cx.beginPath();cx.arc(7,0,2.2,0,7);cx.fill();break;
 case'knife':rr(-8,-2.5,9,5,'#69472f',cx,1.5);rr(0,-2,20,4,'#b7c3d5',cx,1);cx.fillStyle='#eef5ff';cx.beginPath();cx.moveTo(1,-2);cx.lineTo(21,0);cx.lineTo(1,2);cx.closePath();cx.fill();cx.strokeStyle='#fff';cx.lineWidth=1;cx.beginPath();cx.moveTo(2,-1);cx.lineTo(17,0);cx.stroke();rr(-1,-5,3,10,'#d4af37',cx,1);break;
 case'laser':rr(-8,-7,24,14,'#302047',cx,3);rr(10,-5,13,10,'#5a3679',cx,2);rr(-4,-9,12,3,'#9970bd',cx,1);cx.shadowColor=c;cx.shadowBlur=12;cx.fillStyle=c;cx.beginPath();cx.arc(26,0,4+(e.chg>0?(1-e.chg/.55)*16:0),0,7);cx.fill();cx.shadowBlur=0;cx.fillStyle='#fff';cx.beginPath();cx.arc(26,0,1.8,0,7);cx.fill();break;
 }}
const mix=(c,t,a)=>{const n=parseInt(c.slice(1),16),T=t?255:0,f=v=>v+(T-v)*a|0;return '#'+((1<<24)+(f(n>>16)<<16)+(f(n>>8&255)<<8)+f(n&255)).toString(16).slice(1)};
const TW=['ak','shot','bazo','mini','snip','fire','laser'];
function drawE(e){if(e.bat>0&&e.hp>0)return drawBat(e);if(e.B&&e.btype)return drawBoss(e);const s=e.sz,dead=e.hp<=0,mv=e.og&&Math.abs(e.vx)>30,sw=mv?Math.sin(e.ph)*12.5:0,lf=mv?Math.max(0,Math.cos(e.ph)):0,lb=mv?Math.max(0,-Math.cos(e.ph)):0,bob=mv?Math.abs(Math.sin(e.ph))*1.5:0,
 base=dead?'#d93a3f':e.fl>0?'#ffffff':e.fz>0?'#bfeaff':e.bn>0&&Math.sin(G.t*30)>0?'#ffb066':e.sl>0?'#8fc8ff':e.rg&&Math.sin(G.t*12)>0?'#ff6a5a':e.ch==12?'#258cff':e.c,dk=mix(base,0,.28),lw=e.ch==1&&!e.cl?7.5:5.8,
 tw=!e.z&&!e.B&&TW.includes(e.wp),hx=17-(e.rc>0?4:0),hy=-34,hip=[0,-26],sh=[0,-41-bob*.6],hh=-53-bob*.6,
 fa=e.og?[3+sw,-lf*6]:[9,-9],fb=e.og?[-3-sw,-lb*6]:[-6,-3],bh=e.z?[16,-35]:tw?[hx+9,hy+1]:[-sw*.5-3,-30],fh=e.z?[20,-40]:e.wp=='fist'&&e.sw>0?[hx+Math.sin((1-e.sw/.3)*Math.PI)*18,hy-2]:[hx,hy],
 L=(p,w,c)=>{for(const[o,l,k]of[[0,w+3.5,'#0b0d17'],[0,w,c],[-w*.2,w*.3,mix(c,1,.45)]]){cx.beginPath();p.forEach((q,i)=>i?cx.lineTo(q[0]+o,q[1]+o):cx.moveTo(q[0]+o,q[1]+o));cx.lineWidth=l;cx.strokeStyle=k;cx.stroke()}},
 kn=(a,b)=>[(a[0]+b[0])/2+3.5,(a[1]+b[1])/2],el=(a,b)=>[(a[0]+b[0])/2-1,(a[1]+b[1])/2+4];
 cx.save();cx.translate(e.x,e.y);
 if(dead){cx.rotate(e.dk*Math.min(1,(1-e.dd/(e.B?1.3:.9))*2.6)*1.5);cx.globalAlpha=Math.min(1,e.dd*3)}
 else{const sg=cx.createRadialGradient(0,1,1,0,1,17*s);sg.addColorStop(0,'#0008');sg.addColorStop(1,'#0000');cx.fillStyle=sg;cx.beginPath();cx.ellipse(0,1,17*s,4.2*s,0,0,7);cx.fill()}
 cx.scale(e.f*s,s);cx.lineCap=cx.lineJoin='round';const spd=Math.abs(e.vx),md=e.vx*e.f>=0?1:-1;if(!dead&&spd>150){cx.globalAlpha=Math.min(.5,(spd-150)/450);cx.strokeStyle=base;cx.lineWidth=2.2;for(const q of[[-10,24],[-26,38],[-42,28]]){cx.beginPath();cx.moveTo(-md*12,q[0]);cx.lineTo(-md*(12+q[1]*spd/320),q[0]);cx.stroke()}cx.globalAlpha=1}
 if(!dead)cx.rotate(Math.sign(e.vx*e.f)*Math.min(.2,spd/1500));
 if(e.cl||e.ch==3)cx.globalAlpha*=.74;
 if(e.ch==6&&!e.cl){cx.beginPath();cx.moveTo(0,-42);cx.quadraticCurveTo(-20+sw*.4,-28,-14+sw,-6+Math.sin(G.t*6)*2);cx.lineTo(0,-26);cx.closePath();cx.fillStyle='#8a1126';cx.fill();cx.lineWidth=2;cx.strokeStyle='#0b0d17';cx.stroke()}
 L([sh,el(sh,bh),bh],lw*.9,dk);L([hip,kn(hip,fb),fb],lw,dk);
 L([hip,[0,-43-bob*.6]],lw*1.15,base);
 if(e.ch==1&&!e.cl){rr(-7.5,-42,15,14,'#8e97ad',cx,3);rr(-7.5,-42,15,4,'#c3cbe0',cx,2);rr(-7.5,-30,15,3,'#5d6579',cx,1)}
 if(e.ch==2&&!e.cl)L([[-6,-43],[6,-29]],2.4,'#3b2a1a');
 if(e.ch==5){rr(-4.5,-39,9,9,'#ffffff',cx,2);rr(-1,-38,2,7,'#e63946',cx,.6);rr(-3.5,-35,7,2,'#e63946',cx,.6)}
 L([hip,kn(hip,fa),fa],lw,base);
 L([fb,[fb[0]+5.5,fb[1]]],lw*.9,dk);L([fa,[fa[0]+5.5,fa[1]]],lw*.9,base);
 if(!e.z&&!e.B&&(e.ch==0||e.ch==3||e.ch==4)){const w=Math.sin(G.t*8)*2;cx.beginPath();cx.moveTo(-5,-43);cx.lineTo(-17,-40+w);cx.lineTo(-15,-35+w*.6);cx.lineTo(-5,-39);cx.fillStyle=e.ch==3?'#6ee7ff':'#e63946';cx.fill();cx.lineWidth=1.8;cx.strokeStyle='#0b0d17';cx.stroke();rr(-6.5,-45,13,4.5,e.ch==3?'#6ee7ff':'#e63946',cx,2)}
 cx.save();if(e.z)cx.rotate(.18);
 const g=cx.createRadialGradient(-3,hh-4,1,0,hh,12);g.addColorStop(0,mix(base,1,.5));g.addColorStop(.6,base);g.addColorStop(1,dk);
 cx.beginPath();cx.arc(0,hh,9.5,0,7);cx.fillStyle=g;cx.fill();cx.lineWidth=2.8;cx.strokeStyle='#0b0d17';cx.stroke();
 if(dead){cx.lineWidth=1.8;for(const x of[2,6]){cx.beginPath();cx.moveTo(x-1.8,hh-4.5);cx.lineTo(x+1.8,hh-1);cx.moveTo(x+1.8,hh-4.5);cx.lineTo(x-1.8,hh-1);cx.stroke()}}
 else{cx.fillStyle=e.z?'#ff3b3b':'#ffffff';cx.beginPath();cx.ellipse(4.2,hh-1.6,2.7,3.1,0,0,7);cx.fill();if(!e.z){cx.fillStyle='#0b0d17';cx.beginPath();cx.arc(5.2,hh-1.4,1.3,0,7);cx.fill();cx.fillStyle='#ffffff';cx.beginPath();cx.arc(5.7,hh-2,.5,0,7);cx.fill()}
  cx.lineWidth=1.6;cx.strokeStyle='#0b0d17';cx.beginPath();cx.moveTo(1.5,hh-6);cx.lineTo(7,hh-(e.fl>0?7.5:4.6));cx.stroke();cx.beginPath();if(e.fl>0)cx.arc(5,hh+4.5,1.8,0,7);else{cx.moveTo(2.5,hh+4.5);cx.lineTo(7,hh+4)}cx.stroke();
  if(e.ch==6){cx.fillStyle='#ffffff';cx.beginPath();cx.moveTo(3,hh+4.3);cx.lineTo(4,hh+7.6);cx.lineTo(5,hh+4.2);cx.fill()}}
 if(e.ch==1&&!e.cl){cx.beginPath();cx.arc(0,hh-1,10.8,Math.PI,0);cx.closePath();cx.fillStyle='#8e97ad';cx.fill();cx.lineWidth=2.5;cx.strokeStyle='#0b0d17';cx.stroke();rr(-1.5,hh-11,3,9,'#c3cbe0',cx,1)}
 if(e.ch==2&&!e.cl){rr(-10,hh-6,20,4,'#e63946',cx,1.5);cx.beginPath();cx.moveTo(-9,hh-5);cx.lineTo(-17,hh-1+Math.sin(G.t*9)*2);cx.lineTo(-9,hh-2);cx.fillStyle='#e63946';cx.fill()}
 if(e.ch==3){cx.strokeStyle='#ffffffcc';cx.lineWidth=1.8;cx.beginPath();cx.ellipse(0,hh-15,7,2,0,0,7);cx.stroke()}
 if(e.ch==5){rr(-10,hh-10,20,6,'#ffffff',cx,3);rr(-1,hh-9.5,2,5,'#e63946',cx,.5);rr(-2.8,hh-8,5.6,2,'#e63946',cx,.5)}
 if(e.ch==6){cx.beginPath();cx.arc(0,hh,9.8,Math.PI*1.1,Math.PI*1.95);cx.lineTo(3,hh-4);cx.closePath();cx.fillStyle='#2a0f1c';cx.fill()}
 if(e.zk=='i'){cx.fillStyle='#e6f8ff';for(const i of[-5,0,5]){cx.beginPath();cx.moveTo(i-2.5,hh-8.5);cx.lineTo(i,hh-17);cx.lineTo(i+2.5,hh-8.5);cx.fill()}}
 if(e.B){cx.fillStyle='#ffc93c';cx.beginPath();cx.moveTo(-9,hh-8);cx.lineTo(-9,hh-19);cx.lineTo(-4,hh-13);cx.lineTo(0,hh-21);cx.lineTo(4,hh-13);cx.lineTo(9,hh-19);cx.lineTo(9,hh-8);cx.closePath();cx.fill();cx.lineWidth=2;cx.strokeStyle='#0b0d17';cx.stroke()}
 cx.restore();
 L([sh,el(sh,fh),fh],lw*.9,base);
 if(!e.z&&!e.B){cx.save();cx.translate(hx,hy);gun(e.wp,e);cx.restore()}
 for(const[h,c]of[[fh,base],[bh,dk]]){cx.beginPath();cx.arc(h[0],h[1],lw*.62,0,7);cx.fillStyle=c;cx.fill();cx.lineWidth=2;cx.strokeStyle='#0b0d17';cx.stroke()}
 if(e.fz>0){rr(-15,-68,30,70,'#9fe3ff55',cx,9);cx.fillStyle='#e6f8ff';for(const q of[[-14,-22],[14,-42],[-12,-52],[13,-8]]){cx.beginPath();cx.moveTo(q[0],q[1]);cx.lineTo(q[0]+4,q[1]-14);cx.lineTo(q[0]+8,q[1]);cx.fill()}}
 cx.restore();if(dead)return;if(e.mirror>0){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=.38+.18*Math.sin(G.t*12);cx.strokeStyle='#a8e9ff';cx.lineWidth=4;cx.beginPath();cx.arc(e.x,e.y-e.h*.5,34+Math.sin(G.t*8)*3,0,7);cx.stroke();cx.restore()}if(e.mark>0){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=.65+.25*Math.sin(G.t*14);cx.strokeStyle='#ffd166';cx.lineWidth=3;cx.beginPath();cx.ellipse(e.x,e.y-e.h*.5,24+Math.sin(G.t*10)*3,34+Math.cos(G.t*9)*3,0,0,7);cx.stroke();for(let i=0;i<4;i++){const a=G.t*1.4+i*Math.PI/2;cx.beginPath();cx.moveTo(e.x+Math.cos(a)*31,e.y-e.h*.5+Math.sin(a)*42);cx.lineTo(e.x+Math.cos(a)*39,e.y-e.h*.5+Math.sin(a)*50);cx.stroke()}cx.restore()}if(e.B&&e.btype=='electric'&&e.elTimer>0){cx.save();cx.globalCompositeOperation='lighter';cx.strokeStyle='#8eeeff';cx.globalAlpha=.45+.35*Math.sin(G.t*38);cx.lineWidth=4;cx.setLineDash([12,9]);cx.beginPath();cx.moveTo(e.x,e.y-70);cx.lineTo(e.elX,e.elY);cx.stroke();cx.setLineDash([]);cx.beginPath();cx.arc(e.elX,e.elY,20+Math.sin(G.t*25)*6,0,7);cx.stroke();cx.restore()}
 const y=e.y-e.h-20;zExtra(e,y);
 if(e.pi!=null){cx.fillStyle=e.c;cx.strokeStyle='#0b0d17';cx.lineWidth=2;cx.beginPath();cx.moveTo(e.x-6,y);cx.lineTo(e.x+6,y);cx.lineTo(e.x,y+8);cx.closePath();cx.fill();cx.stroke()}
 else if(!e.B&&(!e.z||e.hp<e.mh)){const w=34*Math.max(1,s*.9);rr(e.x-w/2-1.5,y-1.5,w+3,7,'#0b0d17',cx,3);rr(e.x-w/2,y,w*Math.max(0,e.hp/e.mh),4,e.c,cx,2)}}
function drawEo(e){const s=e.sz,mv=e.og&&Math.abs(e.vx)>30,sw=mv?Math.sin(e.ph)*10:0,l1=mv?Math.max(0,Math.cos(e.ph))*5:0,l2=mv?Math.max(0,-Math.cos(e.ph))*5:0;
 cx.save();cx.translate(e.x,e.y);cx.fillStyle='#0003';cx.beginPath();cx.ellipse(0,1,14*s,3.5*s,0,0,7);cx.fill();
 cx.scale(e.f*s,s);cx.lineCap=cx.lineJoin='round';if(e.cl||e.ch==3)cx.globalAlpha=.72;
 const col=e.fl>0?'#fff':e.fz>0?'#bfeaff':e.c,lw=e.ch==1&&!e.cl?7:5.5,hx=17-(e.rc>0?4:0),A=e.z?[[18,-40],[14,-33]]:[[-sw*.6-3,-30],[hx,-34]];
 cx.beginPath();cx.moveTo(0,-26);cx.lineTo(e.og?3+sw:7,-(e.og?l1:10));cx.moveTo(0,-26);cx.lineTo(e.og?-3-sw:-6,-(e.og?l2:4));cx.moveTo(0,-26);cx.lineTo(0,-44);
 for(const a of A){cx.moveTo(0,-41);cx.lineTo(a[0],a[1])}
 cx.strokeStyle='#0a0d18';cx.lineWidth=lw+3;cx.stroke();cx.strokeStyle=col;cx.lineWidth=lw;cx.stroke();
 cx.fillStyle='#0a0d18';for(const f of [[e.og?3+sw:7,-(e.og?l1:10)],[e.og?-3-sw:-6,-(e.og?l2:4)]]){cx.beginPath();cx.ellipse(f[0]+2,f[1]-1,5,2.6,0,0,7);cx.fill()}
 for(const a of A){cx.beginPath();cx.arc(a[0],a[1],lw*.62,0,7);cx.fillStyle=col;cx.fill();cx.lineWidth=2;cx.strokeStyle='#0a0d18';cx.stroke()}
 cx.beginPath();cx.arc(0,-53,9.5,0,7);cx.fillStyle=col;cx.fill();cx.lineWidth=2.5;cx.strokeStyle='#0a0d18';cx.stroke();
 cx.fillStyle=e.z?'#f33':'#fff';cx.beginPath();cx.arc(4,-55,2.4,0,7);cx.fill();if(!e.z){cx.fillStyle='#0a0d18';cx.beginPath();cx.arc(5,-55,1.1,0,7);cx.fill()}
 if(e.ch==1&&!e.cl){cx.fillStyle='#8e97ad';cx.beginPath();cx.arc(0,-54,10.5,Math.PI,0);cx.fill()}
 if(e.ch==2&&!e.cl){rr(-10,-59,20,4,'#e63946');rr(-18,-58,9,2.5,'#e63946')}
 if(e.ch==3){cx.strokeStyle='#fff';cx.lineWidth=1.6;cx.beginPath();cx.ellipse(0,-68,7,2,0,0,7);cx.stroke()}
 if(e.B){cx.fillStyle='#ffc93c';cx.beginPath();cx.moveTo(-9,-61);cx.lineTo(-9,-72);cx.lineTo(-4,-66);cx.lineTo(0,-74);cx.lineTo(4,-66);cx.lineTo(9,-72);cx.lineTo(9,-61);cx.fill()}
 if(!e.z&&!e.B){cx.save();cx.translate(hx,-34);gun(e.wp,e);cx.restore()}
 if(e.fz>0){rr(-14,-66,28,68,'#9fe3ff55',cx,7)}
 cx.restore();const y=e.y-e.h-20;
 if(e.pi!=null){cx.fillStyle=e.c;cx.beginPath();cx.moveTo(e.x-5,y);cx.lineTo(e.x+5,y);cx.lineTo(e.x,y+7);cx.fill()}
 else if(!e.B&&(!e.z||e.hp<e.mh)){const w=30*Math.max(1,s);rr(e.x-w/2,y,w,4,'#0009',cx,2);rr(e.x-w/2,y,w*e.hp/e.mh,4,e.z?'#9be36a':e.tm?'#ff4d5e':'#4cc9f0',cx,2)}}
function drawP(p){cx.save();cx.translate(p.x,p.y);
 if(p.t=='a'){const g=cx.createRadialGradient(-2,-2,1,0,0,10);g.addColorStop(0,'#eaffb0');g.addColorStop(.4,'#8ce35b');g.addColorStop(1,'#2d8a55');cx.shadowColor='#8fff66';cx.shadowBlur=11;cx.fillStyle=g;cx.beginPath();cx.ellipse(0,0,8,5,Math.sin(p.age*12)*.2,0,7);cx.fill();cx.shadowBlur=0;cx.strokeStyle='#ddffb9';cx.lineWidth=1.5;cx.beginPath();cx.arc(-2,-1,3,0,7);cx.stroke()}
 else if(p.t=='r'){cx.rotate(Math.atan2(p.vy,p.vx));rr(-9,-3,16,6,'#e4e4e4');rr(6,-3,5,6,'#ff5a5f',cx,2);cx.fillStyle='#ffa53a';cx.beginPath();cx.moveTo(-9,-3);cx.lineTo(-18-R()*6,0);cx.lineTo(-9,3);cx.fill()}
 else if(p.t=='n'){cx.rotate(p.age*24);rr(-3,-1.6,16,3.2,'#e8eef8');rr(-10,-2.5,8,5,'#6b4a2a')}
 else if(p.t=='h'){cx.rotate(p.age*3);rr(-9,-7,18,14,'#ffffff',cx,3);rr(-2,-5,4,10,'#e63946',cx,1);rr(-5,-2,10,4,'#e63946',cx,1);cx.strokeStyle='#0b0d17';cx.lineWidth=2;cx.beginPath();cx.roundRect(-9,-7,18,14,3);cx.stroke()}
 else if(p.t=='p'){cx.rotate(Math.atan2(p.vy,p.vx));rr(-13,-2.5,24,5,'#b4a27b');cx.fillStyle='#e4c47a';cx.beginPath();cx.moveTo(12,-5);cx.lineTo(23,0);cx.lineTo(12,5);cx.closePath();cx.fill();cx.strokeStyle='#30291d';cx.lineWidth=1.5;cx.stroke()}
 else if(p.t=='q'){cx.rotate(p.age*18);const metal=cx.createLinearGradient(-15,-13,16,13);metal.addColorStop(0,'#fff0c2');metal.addColorStop(.22,'#ffd18b');metal.addColorStop(.52,'#c8793e');metal.addColorStop(.78,'#8e4d2a');metal.addColorStop(1,'#ffe2a2');cx.shadowColor='#ffad5c';cx.shadowBlur=10;cx.beginPath();cx.moveTo(-17,-13);cx.quadraticCurveTo(-6,-9,0,-2);cx.quadraticCurveTo(7,6,18,12);cx.quadraticCurveTo(5,8,-2,3);cx.quadraticCurveTo(-9,-2,-17,-13);cx.closePath();cx.fillStyle=metal;cx.fill();cx.lineWidth=2.2;cx.strokeStyle='#59351f';cx.stroke();cx.shadowBlur=0;cx.strokeStyle='#fff0c8';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(-12,-10);cx.quadraticCurveTo(-2,-5,3,1);cx.stroke();cx.fillStyle='#5a3421';for(const q of[[-7,-7],[10,7]]){cx.beginPath();cx.arc(q[0],q[1],1.5,0,7);cx.fill()} }
 else if(p.t=='c'){const g=cx.createRadialGradient(-2,-3,1,0,0,13);g.addColorStop(0,'#fff');g.addColorStop(.25,p.col||'#d9b5ff');g.addColorStop(.72,'#572b82');g.addColorStop(1,'#160d2d');cx.shadowColor=p.col||'#bd83ff';cx.shadowBlur=14;cx.fillStyle=g;cx.beginPath();cx.arc(0,0,12,0,7);cx.fill();cx.shadowBlur=0;cx.fillStyle='#fff';cx.beginPath();cx.arc(-4,-2,2,0,7);cx.arc(4,-2,2,0,7);cx.fill();cx.strokeStyle='#f5d9ff';cx.lineWidth=1.5;cx.beginPath();cx.arc(0,3,4,.15,Math.PI-.15);cx.stroke()}
 else if(p.t=='w'){cx.rotate(Math.atan2(p.vy,p.vx)+Math.sin(p.age*8)*.12);const g=cx.createLinearGradient(-16,-13,17,13);g.addColorStop(0,'#e7d4ff');g.addColorStop(.35,p.col||'#a16aff');g.addColorStop(1,'#31134e');cx.shadowColor=p.col||'#a16aff';cx.shadowBlur=12;cx.beginPath();cx.moveTo(-19,-12);cx.quadraticCurveTo(-2,-19,16,-2);cx.quadraticCurveTo(5,-5,0,10);cx.quadraticCurveTo(2,-1,-8,-5);cx.quadraticCurveTo(-14,-7,-19,-12);cx.closePath();cx.fillStyle=g;cx.fill();cx.shadowBlur=0;cx.strokeStyle='#f1e4ff';cx.lineWidth=1.4;cx.stroke();cx.fillStyle='#fff';cx.beginPath();cx.arc(5,-3,2,0,7);cx.fill()}
 else if(p.t=='g'&&p.big){cx.fillStyle='#8a7a66';cx.strokeStyle='#2a2218';cx.lineWidth=3;cx.beginPath();cx.moveTo(-18,4);cx.lineTo(-12,-14);cx.lineTo(4,-18);cx.lineTo(18,-6);cx.lineTo(12,12);cx.lineTo(-6,16);cx.closePath();cx.fill();cx.stroke()}else if(p.t=='g'){cx.fillStyle='#6f8f3a';cx.beginPath();cx.arc(0,0,6,0,7);cx.fill();cx.strokeStyle='#1b240e';cx.lineWidth=2;cx.stroke();cx.fillStyle=Math.sin(p.age*30)>0?'#ff5a5f':'#ffd0d0';cx.beginPath();cx.arc(0,-6,2,0,7);cx.fill()}
 else if(p.t=='f'){const k=p.age/.38;cx.globalAlpha=Math.max(0,1-k);cx.fillStyle=k<.4?'#ffe27a':k<.7?'#ff9a2e':'#e8452c';cx.beginPath();cx.arc(0,0,5+k*22,0,7);cx.fill();cx.globalAlpha=1}
 else if(p.t=='s'){cx.fillStyle='#fff';cx.beginPath();cx.arc(0,0,5,0,7);cx.fill();cx.strokeStyle='#8fd3ff';cx.lineWidth=2;cx.stroke()}
 else{cx.strokeStyle=p.col||'#fff';cx.lineWidth=3;cx.lineCap='round';cx.beginPath();cx.moveTo(0,0);cx.lineTo(-p.vx*.025,-p.vy*.025);cx.stroke()}
 cx.restore()}
function drawIT(i){const w=i.kit?{c:'#4ade80'}:WP[i.wp];cx.save();cx.translate(i.x,i.y-16+Math.sin(G.t*4+i.x)*2.5);if(i.life<4)cx.globalAlpha=.5+.5*Math.sin(G.t*14);
 const g=cx.createRadialGradient(0,0,2,0,0,34);g.addColorStop(0,w.c+'88');g.addColorStop(1,w.c+'00');cx.fillStyle=g;cx.fillRect(-36,-36,72,72);
 if(i.air){cx.fillStyle='#ffffffe6';cx.beginPath();cx.arc(0,-34,26,Math.PI,0);cx.closePath();cx.fill();cx.strokeStyle='#0b0d17';cx.lineWidth=2;cx.stroke();cx.beginPath();cx.moveTo(-26,-34);cx.lineTo(-14,-12);cx.moveTo(26,-34);cx.lineTo(14,-12);cx.moveTo(0,-34);cx.lineTo(0,-12);cx.stroke()}
 rr(-18,-12,36,24,'#0b0e1ae6',cx,7);cx.strokeStyle=i.wp=='rain'&&!i.kit?`hsl(${G.t*300%360},90%,60%)`:w.c;cx.lineWidth=2;cx.beginPath();cx.roundRect(-18,-12,36,24,7);cx.stroke();
 if(i.kit){rr(-3,-9,6,18,'#ffffff',cx,1.5);rr(-9,-3,18,6,'#ffffff',cx,1.5);rr(-2,-7,4,14,'#e63946',cx,1);rr(-7,-2,14,4,'#e63946',cx,1)}else{cx.scale(.7,.7);cx.translate(-8,0);gun(i.wp,{sw:0,chg:0})}cx.restore()}
function drawTurrets(){for(const t of TUR){cx.save();cx.translate(t.x,t.y);cx.fillStyle='#0005';cx.beginPath();cx.ellipse(0,1,20,4,0,0,7);cx.fill();cx.strokeStyle='#101522';cx.lineWidth=3;cx.lineCap='round';cx.lineJoin='round';cx.beginPath();cx.moveTo(-8,-4);cx.lineTo(-5,-13);cx.lineTo(5,-13);cx.lineTo(8,-4);cx.stroke();rr(-15,-8,30,7,'#44516a',cx,3);rr(-11,-17,22,12,'#283449',cx,4);rr(-8,-19,16,5,t.c,cx,2);cx.save();cx.translate(0,-15);cx.rotate(t.angle||0);rr(-1,-4,24,8,'#39485d',cx,3);rr(15,-3,10,6,'#7b91a8',cx,2);rr(22,-2,5,4,'#8ce5ff',cx,1);cx.globalAlpha=.35+.2*Math.sin(G.t*12);cx.fillStyle='#8ce5ff';cx.beginPath();cx.arc(27,0,5,0,7);cx.fill();cx.restore();rr(-18,-28,36,4,'#101522',cx,2);rr(-17,-27,34*cl(t.life/(t.maxLife||8.5),0,1),2,'#8ce5ff',cx,1);cx.restore()}}
function draw(){cx.setTransform(sc,0,0,sc,0,0);cx.globalAlpha=1;cx.globalCompositeOperation='source-over';cx.clearRect(0,0,VW,VH);cx.save();cx.scale(CAM.z,CAM.z);cx.translate(-CAM.x,-CAM.y);if(G.sh>0){const sk=S.soft?.35:1;cx.translate((R()-.5)*G.sh*sk,(R()-.5)*G.sh*sk)}
 cx.drawImage(bgc,0,0,W,H);decor();drawEventBack();for(const i of IT)drawIT(i);for(const e of ents)if((e.hp>0||e.dd>0)&&isWorldVisible27(e.x,e.y,e.w/2+100,e.h+120))drawE(e);for(const e of ents)if(e.rb&&e.hp>0)drawRB(e);drawHZ();drawTurrets();drawWalls();drawArenaFeatures27();for(const p of P)if(isWorldVisible27(p.x,p.y,40,40))drawP(p);drawFields();
 for(const b of BM){const k=b.l/.25;cx.globalAlpha=k;cx.lineCap='round';cx.strokeStyle=b.c||'#d46bff';cx.lineWidth=18*k+4;cx.beginPath();cx.moveTo(b.x,b.y);cx.lineTo(b.f>0?W:0,b.y);cx.stroke();cx.strokeStyle='#fff';cx.lineWidth=5*k;cx.stroke()}cx.globalAlpha=1;
 for(const r of RG){const k=Math.max(0,Math.min(1,1-r.l/(r.big?.5:.3)));cx.strokeStyle=`rgba(255,200,120,${1-k})`;cx.lineWidth=6*(1-k)+1;cx.beginPath();cx.arc(r.x,r.y,(r.big?190:100)*k,0,7);cx.stroke()}
 for(const p of PT){if(!isWorldVisible27(p.x,p.y,35,35))continue;if(p.k){cx.globalAlpha=Math.min(1,p.l*5);cx.strokeStyle=p.c;cx.lineWidth=2;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*.04,p.y-p.vy*.04);cx.stroke();continue}cx.globalAlpha=Math.min(1,p.l*2.5);cx.fillStyle=p.c;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}cx.globalAlpha=1;
 cx.font='bold 15px system-ui,sans-serif';cx.textAlign='center';cx.lineWidth=3;cx.lineJoin='round';for(const t of TX){cx.globalAlpha=Math.min(1,t.l*2);cx.strokeStyle='#000';cx.strokeText(t.t,t.x,t.y);cx.fillStyle=t.c;cx.fillText(t.t,t.x,t.y)}cx.globalAlpha=1;
 drawEvent();cx.restore();drawEventScreen();const vg=cx.createRadialGradient(VW/2,VH/2,VH*.45,VW/2,VH/2,VH*.95);vg.addColorStop(0,'#0000');vg.addColorStop(1,'#000a');cx.fillStyle=vg;cx.fillRect(0,0,VW,VH);if(G.fl>0){cx.globalAlpha=Math.min(1,G.fl)*(S.soft?.4:1);cx.fillStyle='#fff';cx.fillRect(0,0,VW,VH);cx.globalAlpha=1}if(!G.demo)hud()}
function hud(){
 const HS=S.phone?1.3:1,W=VW/HS,H=VH/HS,F='"Russo One",Impact,sans-serif';
 const players=ents.filter(e=>e.pi!=null),hasThree=players.length>=3;
 const panelW=hasThree?Math.min(320,(W-40)/3):320;
 cx.save();cx.scale(HS,HS);
 for(const e of players){
  const x=hasThree?(e.pi===0?12:e.pi===1?W-panelW-12:(W-panelW)/2):(e.pi===2?W/2-160:e.pi?W-352:32);
  const y=hasThree?12:(e.pi===2?H-98:22),w=panelW,r=Math.max(0,e.hp/e.mh),q=WP[e.wp],bw=w-72;
  e.hv=e.hv==null?e.hp:e.hv+(e.hp-e.hv)*.1;
  rr(x,y,w,76,'#0a0c15de',cx,14);cx.strokeStyle='#000';cx.lineWidth=3;cx.beginPath();cx.roundRect(x,y,w,76,14);cx.stroke();
  cx.fillStyle=e.c;cx.beginPath();cx.arc(x+30,y+30,19,0,7);cx.fill();cx.stroke();cx.fillStyle='#0b0d17';cx.font='20px '+F;cx.textAlign='center';cx.fillText(e.pi+1,x+30,y+37);
  cx.textAlign='left';cx.fillStyle='#fff';cx.font=(hasThree?'12px ':'14px ')+F;cx.fillText(CH[e.ch].n.toUpperCase(),x+58,y+22);cx.textAlign='right';cx.fillText(Math.ceil(e.hp)+' / '+e.mh,x+w-14,y+22);
  rr(x+58,y+30,bw,12,'#ffffff1c',cx,6);rr(x+58,y+30,bw*Math.max(0,e.hv/e.mh),12,'#ffffff80',cx,6);if(r>0)rr(x+58,y+30,bw*r,12,`hsl(${r*125},78%,52%)`,cx,6);
  cx.fillStyle='#0a0c1599';for(let k=50;k<e.mh;k+=50)cx.fillRect(x+58+bw*k/e.mh-1,y+30,2,12);
  cx.save();cx.translate(x+64,y+62);cx.scale(.62,.62);gun(e.wp,{sw:0,chg:0});cx.restore();
  cx.textAlign='left';cx.font=(hasThree?'10px ':'12px ')+F;cx.fillStyle=q.c;const slimeLabel=CH[e.ch].slime?' · ×'+slimeAttackMultiplier(e).toFixed(2):'';const ammoLabel=e.am<1e8?(e.wp=='katana'?' · уд. '+Math.max(0,10-(e.katHits||0))+' / отр. '+Math.max(0,5-(e.katRefs||0)):' · ×'+e.am):'';cx.fillText(q.n+slimeLabel+ammoLabel,x+98,y+66);
  const ts=[[e.fz>0,'ЛЁД','#9fe3ff'],[e.bn>0,'ОГОНЬ','#ff9a2e'],[e.br>0,'КРОВЬ '+e.bl,'#ff5a6a'],[e.sl>0,'СЛОУ','#7fb8ff'],[e.rg,'ЯРОСТЬ','#ff6b4a'],[e.bat>0,'ЛЕТ. МЫШЬ','#ff7a8a'],[e.mirror>0,'ЗЕРКАЛО','#a8e9ff'],[e.tslow>0,'ЗАМЕДЛЕН','#aeb2ff'],[e.killerAim,'ПРИЦЕЛИВАНИЕ','#ff6478'],[e.fz>0&&CH[e.ch].killer,'ОГЛУШЁН','#ff7b8a']].filter(t=>t[0]);let tx=x+w-14;cx.textAlign='right';for(const t of ts){cx.fillStyle=t[2];cx.fillText(t[1],tx,y+66);tx-=cx.measureText(t[1]).width+10}
  if(CH[e.ch].med||CH[e.ch].engineer||CH[e.ch].duelist||CH[e.ch].assault||CH[e.ch].vamp||CH[e.ch].slime||CH[e.ch].killer){const cd=CH[e.ch].slime?(e.kcMax||5):CH[e.ch].killer?15:CH[e.ch].med?12:CH[e.ch].engineer?13:CH[e.ch].duelist?12:CH[e.ch].vamp?20:16;rr(x+58,y+47,bw,5,'#ffffff1c',cx,2);rr(x+58,y+47,bw*(1-Math.max(0,e.kc)/cd),5,e.kc>0?'#7a7f8f':'#4ade80',cx,2)}
 }
 cx.textAlign='center';
 const statusY=hasThree?98:20;
 if(G.mode=='boss'){const b=G.bo,r=Math.max(0,b.hp/b.mh);rr(W/2-210,statusY,420,54,'#0a0c15de',cx,14);cx.font='14px '+F;cx.fillStyle='#d9a0ff';cx.fillText((G.bossSpec?.n||'БОСС')+' · УРОВЕНЬ '+G.lv,W/2,statusY+22);rr(W/2-192,statusY+30,384,14,'#ffffff1c',cx,7);rr(W/2-192,statusY+30,384*r,14,'#b44dff',cx,7)}
 else{rr(W/2-100,statusY,200,62,'#0a0c15de',cx,14);cx.fillStyle='#fff';
  if(G.mode=='zomb'){cx.font='24px '+F;cx.fillText('ВОЛНА '+G.wv,W/2,statusY+30);cx.font='13px '+F;cx.fillStyle='#9fb0d8';cx.fillText('Осталось: '+(G.q+ents.filter(e=>e.z&&e.hp>0).length),W/2,statusY+50)}
  else{cx.font='36px '+F;cx.fillText(G.sc.slice(0,G.mode=='duel'&&G.n3?3:2).join(' : '),W/2,statusY+36);cx.font='12px '+F;cx.fillStyle='#9fb0d8';cx.fillText('РАУНД '+G.rd+' · до '+G.need+' побед',W/2,statusY+54)}}
 {const ev=G.ev;if(ev&&!G.demo&&(ev.warning>0||ev.active>0)){const wn=ev.warning>0,p=wn?1-ev.warning/1.8:1-ev.active/ev.max,bw=400,x=W/2-bw/2,y=hasThree?168:100;cx.save();cx.textAlign='center';rr(x,y,bw,42,'#0a0c15de',cx,12);cx.strokeStyle=ev.c;cx.lineWidth=3;cx.beginPath();cx.roundRect(x,y,bw,42,12);cx.stroke();cx.font='15px '+F;cx.fillStyle=wn?(Math.sin(G.t*18)>0?'#fff':ev.c):ev.c;cx.fillText((wn?'ВНИМАНИЕ! ':'')+ev.name.toUpperCase(),W/2,y+20);rr(x+14,y+29,bw-28,5,'#ffffff22',cx,2);rr(x+14,y+29,(bw-28)*p,5,ev.c,cx,2);cx.restore()}}
 if(G.bt>0&&G.bn){cx.globalAlpha=Math.min(1,G.bt*2);cx.font='84px '+F;cx.lineWidth=10;cx.lineJoin='round';cx.strokeStyle='#000';cx.strokeText(G.bn,W/2,H/2-20);cx.fillStyle='#ffcf3a';cx.fillText(G.bn,W/2,H/2-20)}
 cx.restore()}
function hudo(){cx.save();const F='"Russo One",Impact,sans-serif';
 for(const e of ents)if(e.pi!=null){const x=e.pi?W-324:24,y=16,r=Math.max(0,e.hp/e.mh),w=WP[e.wp];rr(x,y,300,52,'#080b16b8',cx,10);
  cx.font='14px '+F;cx.textAlign='left';cx.fillStyle=e.c;cx.fillText('ИГРОК '+(e.pi+1)+' · '+CH[e.ch].n,x+12,y+20);cx.fillStyle='#fff';cx.textAlign='right';cx.fillText(Math.ceil(e.hp),x+288,y+20);
  rr(x+12,y+27,276,8,'#ffffff22',cx,4);if(r>0)rr(x+12,y+27,276*r,8,`hsl(${r*120},75%,52%)`,cx,4);
  cx.font='11px '+F;cx.textAlign='left';cx.fillStyle=w.c;cx.fillText(w.n+(e.am<1e8?(e.wp=='katana'?' · отражений ':' · ')+e.am:''),x+12,y+47)}
 cx.textAlign='center';cx.fillStyle='#fff';
 if(G.mode=='zomb'){cx.font='20px '+F;cx.fillText('ВОЛНА '+G.wv,W/2,36);cx.font='12px '+F;cx.fillStyle='#9fb0d8';cx.fillText('Осталось: '+(G.q+ents.filter(e=>e.z&&e.hp>0).length),W/2,54)}
 else if(G.mode=='boss'){const b=G.bo;rr(W/2-190,16,380,14,'#080b16b8',cx,7);rr(W/2-188,18,376*Math.max(0,b.hp/b.mh),10,'#b44dff',cx,5);cx.font='12px '+F;cx.fillText('БОСС · уровень '+G.lv,W/2,48)}
 else{cx.font='34px '+F;cx.fillText(G.sc[0]+' : '+G.sc[1],W/2,44);cx.font='12px '+F;cx.fillStyle='#9fb0d8';cx.fillText('РАУНД '+G.rd+' · до '+G.need+' побед',W/2,62)}
 if(G.bt>0&&G.bn){cx.globalAlpha=Math.min(1,G.bt*2);cx.font='60px '+F;cx.lineWidth=8;cx.lineJoin='round';cx.strokeStyle='#000';cx.strokeText(G.bn,W/2,H/2-20);cx.fillStyle='#ffb62e';cx.fillText(G.bn,W/2,H/2-20)}
 cx.restore()}



let er=0;
