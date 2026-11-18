if(typeof CanvasRenderingContext2D!='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(+r||0,Math.abs(w)/2,Math.abs(h)/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const $=i=>document.getElementById(i),cv=$('c'),W=1600,H=900,GY=825,R=Math.random,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),
rr=(x,y,w,h,c,k=cx,r=1.5)=>{k.fillStyle=c;k.beginPath();k.roundRect(x,y,w,h,r);k.fill();if(OL){k.lineWidth=1.2;k.strokeStyle='#0b0d17';k.stroke()}};
let cx=cv.getContext('2d'),OL=0;
const COL=['#ff5a5f','#3ec1ff','#7be04a','#ffd23f','#c77dff','#ff9f1c','#2ee6c8','#f2f2f2'];
const CH=[{n:'Классик',hp:250,d:'Обычный стикмен без способностей'},{n:'Танк',hp:400,sp:.8,sz:1.18,fg:1.9,slam:1,d:'400 HP, крупный, падает быстро, при приземлении бьёт ударной волной'},{n:'Берсерк',hp:250,sp:1.05,dm:1.3,rage:1,d:'Обычно урон ×1.3. При HP ниже 45% включается ярость: урон ×2, защита ×1.5; теряет 2 HP/с до 20% здоровья'},{n:'Призрак',hp:220,sp:1.7,dj:1,sf:1,fg:.3,d:'Очень быстрый, дополнительный прыжок, плавное падение и 7% шанс уклониться от атаки'},{n:'Двойник',hp:250,cl:1,d:'Создаёт клона с меньшим запасом здоровья и уроном; гибель клона восстанавливает владельцу 45 HP'},{n:'Медик',hp:250,med:1,d:'Может бросить аптечку: она падает на землю и остаётся доступной для подбора. Сам восстанавливает 10 HP каждые 20 с'},{n:'Вампир',hp:150,sp:1.3,jm:1.14,vampire:1,d:'150 HP, восстанавливает 32% нанесённого урона; превращается в летучую мышь на 3 секунды и летает медленнее обычного бега. Во время превращения неуязвим. Перезарядка — 15 секунд'},{n:'Инженер',hp:270,sp:.96,engineer:1,d:'Ставит усиленную автоматическую турель на 8,5 секунд: большой радиус, быстрые электрические выстрелы и высокий урон'},{n:'Дуэлянт',hp:235,sp:1.12,duelist:1,dm:1.08,d:'Парирует снаряды и помечает до трёх сильнейших врагов поблизости на 4 секунды. Помеченные враги получают на 50% больше урона'},{n:'Штурмовик',hp:280,sp:1.02,assault:1,d:'Создаёт защитные стены по бокам и сверху на 5 секунд. Они останавливают монстров и их снаряды, имеют 50 прочности, но пропускают игроков и их пули'},{n:'Акробат',hp:220,sp:1.18,fg:.84,acrobat:1,d:'Лёгкий и быстрый. Отталкивается от боковых стен и краёв платформ, выполняя мощные акробатические прыжки'},{n:'Рукопашник',hp:350,sp:1.08,brawler:1,d:'350 HP. Не может подбирать оружие. Кулаки имеют 10% шанс нанести критический урон ×3. Таран: прямой рывок, отбрасывает и оглушает противника, нанося 20 урона. Перезарядка — 17 секунд. После 15 секунд без полученного урона восстанавливает 1 HP каждые 1.5 секунды'}];
const WP={
fist:{n:'Кулаки',c:'#e8c9a0',cd:.38,am:1e9,dm:9,t:'k',cx:22,rn:30,d:'Базовая атака без патронов'},
pistol:{n:'Пистолет',c:'#aab2c5',cd:.32,am:14,dm:14,v:900,t:'b',d:'14 патронов'},
ak:{n:'Калаш',c:'#ffd166',cd:.085,am:29,dm:9,v:1000,sp:.05,t:'b',d:'29 патронов, быстрая очередь'},
shot:{n:'Дробовик',c:'#ff8c42',cd:.8,am:6,dm:11,v:820,pel:8,sp:.2,life:.32,t:'b',d:'6 выстрелов, веер из 8 дробин'},
bazo:{n:'Базука',c:'#8bd450',cd:1.2,am:3,dm:55,v:340,t:'r',d:'3 самонаводящиеся ракеты со взрывом'},
snow:{n:'Снежки',c:'#9fe3ff',cd:.38,am:13,dm:5,v:640,fz:1.5,t:'s',d:'13 снежков, замораживают цель'},
katana:{n:'Катана',c:'#ff5a5f',cd:.45,am:10,dm:45,t:'k',d:'Ломается после 10 физических ударов или 5 отражений'},
laser:{n:'Лазер',c:'#d46bff',cd:1.5,am:4,dm:65,ch:.55,t:'l',d:'4 заряда, пробивает всех на линии'},
mini:{n:'Миниган',c:'#ff6b4a',cd:.05,am:90,dm:6,v:1000,sp:.13,t:'b',d:'90 патронов, шквал свинца'},
snip:{n:'Снайперка',c:'#58e0b5',cd:1.1,am:5,dm:95,v:2400,life:.9,t:'b',d:'5 мощных и точных выстрелов'},
gren:{n:'Граната',c:'#9ac24a',cd:.7,am:5,dm:80,v:560,t:'g',d:'5 гранат со взрывом'},
fire:{n:'Огнемёт',c:'#ff9a2e',cd:.045,am:64,dm:4,v:520,sp:.1,life:.38,t:'f',d:'64 единицы топлива'},
hamm:{n:'Молот',c:'#c0a060',cd:.9,am:4,dm:85,t:'k',d:'Воздушный удар наносит на 10% больше урона'},
knife:{n:'Ножи',c:'#e8eef8',cd:.32,am:4,dm:16,v:880,t:'n',d:'4 метательных ножа с кровотечением'},
rain:{n:'Радужная пушка',c:'#ff66cc',cd:.5,am:1,dm:35,v:270,life:6.5,t:'x',d:'Призывает большую радужную сферу над головой; из сферы вырывается луч, который медленно наводится на ближайшего противника'},
tesla:{n:'Тесла',c:'#63eaff',cd:.72,am:5,dm:42,t:'e',d:'5 электрических разрядов; цепляет ближайшего второго врага'},
harpoon:{n:'Гарпун',c:'#e4c47a',cd:.8,am:1,dm:48,v:1050,t:'p',life:1.8,d:'Одноразовый выстрел, притягивает поражённую цель'},
boomerang:{n:'Бумеранг',c:'#ffa85c',cd:.55,am:5,dm:28,v:760,t:'q',life:3.2,d:'5 бросков; возвращается к владельцу и может задеть врагов'},
mirror:{n:'Зеркало',c:'#a8e9ff',cd:.45,am:1,dm:0,t:'m',d:'Одно использование; отражает снаряды в течение 15 секунд'},
time:{n:'Временной излучатель',c:'#8b91ff',cd:.55,am:1,dm:0,t:'u',d:'Одно использование; замедляет врагов в зоне на 10 секунд'},
gravity:{n:'Гравитационный коллапс',c:'#b98cff',cd:.8,am:1,dm:90,t:'v',d:'Одно использование; постепенно создаёт массивную чёрную дыру, притягивает противников и снаряды, а затем наносит 9000 урона всем противникам на карте'}
};
const BOSS_TYPES=[
{id:'warlord',n:'Теневой владыка',hp:980,size:2.2,speed:.55},
{id:'colossus',n:'Колосс',hp:1450,size:2.65,speed:.36},
{id:'necromancer',n:'Некромант',hp:1120,size:2.15,speed:.43},
{id:'electric',n:'Электрический гигант',hp:1280,size:2.35,speed:.5}
];
const DROP_WEIGHTS={pistol:16,ak:12,shot:10,snow:9,boomerang:10,knife:7,katana:6,fire:6,gren:5,laser:4,snip:4,bazo:4,hamm:4,tesla:4,harpoon:3.5,mirror:3,time:2.5,mini:2};
const MAP_EVENTS=[
{type:'meteor',name:'Метеоритный дождь',c:'#ff9b55'},
{type:'icegust',name:'Ледяной шквал',c:'#8feaff'},
{type:'eruption',name:'Извержение лавы',c:'#ff623d'},
{type:'dark',name:'Затмение',c:'#a6aaff'},
{type:'roots',name:'Живые корни',c:'#8ee27b'},
{type:'bridge',name:'Сотрясение моста',c:'#e3b37c'},
{type:'sandstorm',name:'Песчаная буря',c:'#f0c27a'},
{type:'gravity',name:'Сбой гравитации',c:'#c89aff'},
{type:'vines',name:'Наступление лиан',c:'#7bdc83'},
{type:'rockfall',name:'Обвал шахты',c:'#d1b28c'}
];
const MP=[
{n:'Закат',event:false,g:['#2a1747','#ff8f4d'],h:'#3b2160',d:'o',s:1,p:'#4a2d6e',t:'#ffb27a',pl:[[110,540,150],[1020,540,150],[560,560,160],[300,430,140],[840,430,140],[570,320,140],[160,300,120],[1000,300,120],[570,190,140]]},
{n:'Ледник',g:['#12304f','#8fd3f0'],h:'#1c4a72',d:'n',s:2,p:'#2d6a96',t:'#d9f4ff',ic:1,pl:[[60,520,130],[1090,520,130],[300,560,130],[850,560,130],[575,450,130],[250,340,120],[910,340,120],[575,230,130],[110,215,110],[1060,215,110]]},
{n:'Лава',g:['#1c0a0a','#8a2410'],h:'#2e100c',d:'e',s:3,p:'#4a1f18',t:'#ff7a3c',pl:[[80,560,160],[1040,560,160],[400,510,110],[770,510,110],[585,400,110],[260,340,110],[910,340,110],[585,235,110],[120,215,110],[1050,215,110]]},
{n:'Ночь',g:['#060a1c','#1f2f66'],h:'#0d1431',d:'s',s:4,p:'#26305c',t:'#7f94e0',pl:[[0,520,170],[1110,520,170],[330,560,120],[830,560,120],[580,450,120],[240,340,130],[910,340,130],[580,235,130],[40,215,110],[1130,215,110]]},
{n:'Лес',event:false,g:['#8fd6c4','#eaf6c8'],h:'#3f8a62',d:'l',s:5,p:'#2f6b4a',t:'#9be36a',pl:[[130,540,140],[1010,540,140],[570,570,140],[350,440,120],[810,440,120],[130,330,120],[1030,330,120],[570,330,140],[350,225,110],[820,225,110]]},
{n:'Мост',event:false,g:['#3a2a20','#d19a5a'],h:'#55392a',d:'o',s:6,p:'#6b4a35',t:'#f0c78a',pl:[[60,510,150],[1070,510,150],[290,550,110],[880,550,110],[500,430,110],[670,430,110],[380,310,110],[790,310,110],[585,195,110]]},
{n:'Пустыня',g:['#3d1f0f','#f4a259'],h:'#6b3a1e',d:'o',s:7,p:'#8a5a2b',t:'#f7c98b',pl:[[200,540,130],[950,540,130],[575,560,130],[80,430,100],[1100,430,100],[380,425,110],[790,425,110],[575,315,130],[230,205,110],[930,205,110]]},
{n:'Космос',g:['#04030c','#2a1450'],h:'#120a2a',d:'s',s:8,p:'#33276b',t:'#9d7bff',gv:.62,pl:[[100,560,130],[1050,560,130],[420,520,120],[740,520,120],[585,410,110],[250,400,110],[920,400,110],[430,290,110],[740,290,110],[585,185,110],[90,265,100],[1090,265,100]]},
{n:'Джунгли',g:['#0f3d2e','#7bd88f'],h:'#1d5a3a',d:'l',s:9,p:'#3b2a1a',t:'#6edc5a',pl:[[60,520,120],[1100,520,120],[300,600,110],[850,600,110],[580,500,120],[380,400,110],[790,400,110],[100,330,110],[1070,330,110],[580,290,120],[300,205,110],[850,205,110]]},
{n:'Шахта',g:['#17120e','#4a3d30'],h:'#2a2018',d:'e',s:10,p:'#5a4632',t:'#c9a77a',pl:[[150,540,150],[980,540,150],[565,540,150],[40,420,100],[1140,420,100],[360,430,110],[810,430,110],[565,320,150],[200,305,110],[960,305,110],[565,205,110]]}].map(m=>({...m,pl:m.pl.map(p=>p.map(v=>v*1.25))}));
const MPo=[{n:'Закат',g:['#2a1747','#ff8f4d'],h:'#3b2160',d:'o',s:1,p:'#4a2d6e',t:'#ffb27a',pl:[[170,390,220],[570,390,220],[370,275,220]]},
{n:'Ледник',g:['#12304f','#8fd3f0'],h:'#1c4a72',d:'n',s:2,p:'#2d6a96',t:'#d9f4ff',pl:[[50,400,170],[740,400,170],[395,320,170],[190,215,150],[620,215,150]]},
{n:'Лава',g:['#1c0a0a','#8a2410'],h:'#2e100c',d:'e',s:3,p:'#4a1f18',t:'#ff7a3c',pl:[[70,380,200],[690,380,200],[380,290,200],[240,190,140],[580,190,140]]},
{n:'Ночь',g:['#060a1c','#1f2f66'],h:'#0d1431',d:'s',s:4,p:'#26305c',t:'#7f94e0',pl:[[0,380,230],[730,380,230],[330,300,300],[130,200,140],[690,200,140]]},
{n:'Лес',g:['#8fd6c4','#eaf6c8'],h:'#3f8a62',d:'l',s:5,p:'#2f6b4a',t:'#9be36a',pl:[[100,400,180],[680,400,180],[390,340,180],[250,240,160],[550,240,160],[400,140,160]]},
{n:'Мост',g:['#3a2a20','#d19a5a'],h:'#55392a',d:'o',s:6,p:'#6b4a35',t:'#f0c78a',pl:[[60,370,840],[260,235,440]]}];
const MD={solo:'Соло против бота',duel:'1 на 1',v12:'1 на 2 (бот помогает одному)',v22:'2 на 2 (с ботами)',zomb:'Зомби-волны',boss:'Босс'};
const ACT=[['l','Влево'],['r','Вправо'],['j','Прыжок'],['d','Вниз'],['s','Огонь'],['m','Способность']];
const S={mode:'duel',rounds:3,maps:[0,4,5],p:[{c:0,ch:0,k:{l:'KeyA',r:'KeyD',j:'KeyW',d:'KeyS',s:'KeyF',m:'KeyG'}},{c:1,ch:0,k:{l:'ArrowLeft',r:'ArrowRight',j:'ArrowUp',d:'ArrowDown',s:'Enter',m:'ShiftRight'}},{c:2,ch:0,k:{l:'KeyJ',r:'KeyL',j:'KeyI',d:'KeyK',s:'KeyH',m:'KeyU'}}],t3:0};
let NET={role:null,ws:null,conn:null,conns:[],slot:0,lastSend:0,lastInput:0,lastStateAt:0,stateAt:0,stateDuration:80,entitySeq:0,remote:{},ready:false,lastMi:-1,lobby:null,roomCode:null},M,G,ents=[],P=[],IT=[],PT=[],TX=[],RG=[],BM=[],ZP=[],TUR=[],WALLS=[],bgc,K={},TOUCH={l:0,r:0,j:0,d:0,s:0,m:0},rb=null,cur='menu',lt=0;
const kn=c=>({ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',Space:'Пробел'})[c]||c.replace(/^(Key|Digit|Numpad)/,'');
const tn=t=>G.mode=='solo'?(t==0?'ИГРОК':'БОТ'):G.mode=='duel'||G.mode=='v12'?'ИГРОК '+(t+1):'КОМАНДА '+(t+1);
function fit(){const r=Math.max(.2,Math.min(innerWidth/W,innerHeight/H)*.97),touch=(navigator.maxTouchPoints||0)>0||(typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches),online=!!(NET&&NET.role),cap=touch?(online?1:1.25):1.5,d=Math.min(devicePixelRatio||1,cap);cv.style.width=W*r+'px';cv.style.height=H*r+'px';cv.width=Math.round(W*r*d);cv.height=Math.round(H*r*d);sc=r*d;if(M)mkbg()}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{fit();syncTouchUi()},150)});
function mkbg(){
 bgc=document.createElement('canvas');bgc.width=cv.width;bgc.height=cv.height;const c=bgc.getContext('2d');c.scale(sc,sc);
 let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,M.g[0]);g.addColorStop(1,M.g[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
 if(M.d=='o'||M.d=='s'){const o=M.d=='o';g=c.createRadialGradient(960,190,0,960,190,270);g.addColorStop(0,o?'#fff4cb':'#ffffff');g.addColorStop(.22,o?'#ffc46bcc':'#cfe0ff66');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(650,0,650,520)}
 for(let k=0;k<2;k++){c.fillStyle=k?M.h:M.h+'77';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=12)c.lineTo(x,(k?565:510)+Math.sin(x*.011+M.s*2+k*2)*36+Math.sin(x*.027+k)*12+Math.sin(x*.004+M.s)*16);c.lineTo(W,H);c.fill()}
 props(c);
 const textureColor=M.d=='n'?'#d9f6ff':M.d=='e'?'#ff9b66':M.d=='l'?'#c4f3b0':M.d=='s'?'#c9d6ff':M.d=='o'?'#ffd49a':M.d=='d'?'#f5d09a':'#d7c0a3';
 c.save();
 for(let i=0;i<280;i++){
  const x=(i*197.37+M.s*71.1)%W,y=(i*89.17+M.s*37.3)%(GY-28),q=Math.abs(Math.sin(i*12.9898+M.s*7.3));
  c.globalAlpha=.045+q*.12;c.strokeStyle=textureColor;c.fillStyle=textureColor;c.lineWidth=.7+q*1.1;
  if(M.d=='n'){c.beginPath();c.moveTo(x-5,y-4);c.lineTo(x,y+4);c.lineTo(x+5,y-4);c.moveTo(x,y-8);c.lineTo(x,y+8);c.stroke()}
  else if(M.d=='e'){c.beginPath();c.moveTo(x,y);c.lineTo(x+5+q*10,y-3-q*9);c.lineTo(x+9+q*13,y-1);c.stroke()}
  else if(M.d=='l'){c.beginPath();c.ellipse(x,y,3+q*5,1.4+q*2,q*3,0,7);c.fill()}
  else if(M.d=='s'){c.fillRect(x,y,1+q*2,1+q*2);if(i%8==0){c.beginPath();c.moveTo(x-5,y);c.lineTo(x+5,y);c.moveTo(x,y-5);c.lineTo(x,y+5);c.stroke()}}
  else if(M.d=='o'){c.beginPath();c.moveTo(x-7,y+2);c.quadraticCurveTo(x,y-4,x+8,y+1);c.stroke()}
  else{c.beginPath();c.moveTo(x,y);c.lineTo(x+8+q*12,y+q*3);c.stroke()}
 }
 c.restore();
 g=c.createLinearGradient(0,GY,0,H);g.addColorStop(0,M.p);g.addColorStop(.45,mix(M.p,0,.35));g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(0,GY,W,H-GY);
 c.fillStyle=M.t;c.fillRect(0,GY,W,4);
 for(const p of M.pl){
  c.fillStyle='#0006';c.beginPath();c.roundRect(p[0]+6,p[1]+18,p[2]-12,9,5);c.fill();
  const pg=c.createLinearGradient(p[0],p[1],p[0],p[1]+18);pg.addColorStop(0,mix(M.p,1,.25));pg.addColorStop(.36,M.p);pg.addColorStop(1,mix(M.p,0,.48));
  rr(p[0],p[1],p[2],17,pg,c,7);rr(p[0]+2,p[1]+2,p[2]-4,10,mix(M.p,1,.08),c,5);rr(p[0]+2,p[1],p[2]-4,3,M.t,c,2);
  c.save();c.beginPath();c.roundRect(p[0]+4,p[1]+4,p[2]-8,10,4);c.clip();
  for(let j=0;j<Math.floor(p[2]/13);j++){const x=p[0]+8+j*13,q=Math.abs(Math.sin(j*17.7+M.s));c.globalAlpha=.08+q*.1;c.fillStyle=j%2?M.t:'#ffffff';c.fillRect(x,p[1]+5,1+q*2,7)}
  c.restore();c.globalAlpha=.32;c.strokeStyle=mix(M.p,1,.55);c.lineWidth=1;c.beginPath();c.moveTo(p[0]+12,p[1]+15);c.lineTo(p[0]+p[2]-12,p[1]+15);c.stroke();
  for(let x=p[0]+16;x<p[0]+p[2]-10;x+=54){c.fillStyle='#ffffff88';c.beginPath();c.arc(x,p[1]+8,1.35,0,7);c.fill()}
  c.globalAlpha=1;
 }
}
function props(c){const d=M.d,q=i=>Math.abs(Math.sin(i*12.9898+M.s*7.3));
 if(d=='s'){for(let x=-10,i=0;x<W;x+=46,i++){const h=70+q(i)*150;c.fillStyle='#0a1028';c.fillRect(x,GY-h,40,h);c.fillStyle='#ffd86b';for(let y=GY-h+8;y<GY-12;y+=16)for(let k=0;k<3;k++)if(q(i*9+y+k)>.55)c.fillRect(x+6+k*11,y,6,8)}}
 else if(d=='n'||d=='l'){for(let x=20,i=0;x<W;x+=58,i++){const h=60+q(i)*70;c.fillStyle=d=='n'?'#cfeaf7':'#2a5c40';if(d=='n'){c.beginPath();c.moveTo(x-22,GY);c.lineTo(x,GY-h);c.lineTo(x+22,GY);c.fill()}else{c.fillRect(x-3,GY-h*.4,6,h*.4);c.beginPath();c.arc(x,GY-h*.6,h*.38,0,7);c.fill()}}}
 else if(d=='e'){c.fillStyle='#120606';for(let x=0,i=0;x<W;x+=70,i++){const h=80+q(i)*120;c.beginPath();c.moveTo(x,GY);c.lineTo(x+35,GY-h);c.lineTo(x+70,GY);c.fill()}}
 else{c.fillStyle='#3a2410';for(let x=60,i=0;x<W;x+=190,i++){const h=110+q(i)*90;c.fillRect(x,GY-h,26,h);c.fillRect(x-6,GY-h,38,10)}}}
function decor(){const t=G.t,d=M.d;if(d=='l'||d=='o'){cx.fillStyle=d=='o'?'#ffd2a066':'#ffffff88';for(let i=0;i<6;i++){const x=((i*260+t*(8+i*3))%(W+300))-150,y=90+i%3*70;cx.beginPath();cx.ellipse(x,y,70,16,0,0,7);cx.fill();cx.beginPath();cx.ellipse(x+40,y-8,44,14,0,0,7);cx.fill()}return}cx.fillStyle=d=='e'?'#ffb347':'#fff';for(let i=0;i<90;i++){let x=(i*137.5)%W,y,a=1,r=1.4;
 if(d=='s'){y=(i*61)%300;a=.5+.5*Math.sin(t*2+i)}else if(d=='n'){x+=Math.sin(t+i)*20;y=(i*53+t*(30+i%5*12))%H;r=2}else{y=H-(i*53+t*(40+i%7*14))%H;x+=Math.sin(t*2+i)*10}
 cx.globalAlpha=a*.8;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}cx.globalAlpha=1}
function mk(o){const c=CH[o.ch||0],s=(o.sz||c.sz||1)*(o.B?1:.931),h=o.hp||c.hp;NET.entitySeq=(NET.entitySeq||0)+1;return Object.assign({nid:NET.entitySeq,ch:0,x:0,y:GY,vx:0,vy:0,f:1,sz:s,w:20*s,h:58*s,wp:'fist',am:1e9,katHits:0,katRefs:0,mirror:0,tslow:0,mark:0,damageClock:0,regenClock:0,wallKick:0,elTimer:0,elX:0,elY:0,zJumpCd:0,zDropCd:0,zRecoil:0,cd:0,fz:0,fl:0,sw:0,rc:0,rf:0,chg:0,dr:0,sl:0,bn:0,br:0,bl:0,kc:0,dd:0,ph:0,og:1,dj:0,tm:0,in:{}},o,{hp:h,mh:h,sz:s})}
function pr(o){P.push(Object.assign({life:1.6,vx:0,vy:0,g:0,age:0,t:'b',dm:10},o))}
function fx(x,y,n,c,sp){for(let i=0;i<n;i++){const a=R()*6.3,v=R()*sp;PT.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.3,l:.3+R()*.5,c,r:1.5+R()*3})}}
function hit(o,d,s,kx,fz,np){if(o.hp<=0)return;if(o.batTimer>0){if((o.batFlash||0)<=0){TX.push({x:o.x,y:o.y-o.h-18,t:'НЕУЯЗВИМОСТЬ',l:.55,c:'#cba8ff'});o.batFlash=.35;fx(o.x,o.y-o.h*.5,7,'#cba8ff',170)}return;}if(o.ch==3&&!o.cl&&!np&&R()<.07){TX.push({x:o.x,y:o.y-o.h-18,t:'СКВОЗЬ',l:.8,c:'#bfeaff'});fx(o.x,o.y-o.h/2,10,'#bfeaff',200);return}d=Math.round(d/(o.rg?1.5:1));if(o.mark>0&&s&&s.tm==o.markTeam)d=Math.round(d*1.5);o.hp-=d;if(o.B&&o.hp>0)bossPhaseCheck(o);o.fl=.09;o.damageClock=0;o.regenClock=0;if(s&&s.ch==6&&s.hp>0&&s!==o){const h=Math.round(d*.32);s.hp=Math.min(s.mh,s.hp+h);TX.push({x:s.x,y:s.y-s.h-8,t:'+'+h,l:.7,c:'#7ee08a'});fx(s.x,s.y-s.h*.5,5,'#c1121f',120)}o.vx+=o.B?cl((kx||0)*.16,-115,115):(kx||0);if(!o.B)o.vy-=Math.min(260,d*4);if(fz&&!o.B)o.fz=Math.max(o.fz,fz);
 fx(o.x,o.y-o.h*.6,Math.min(10,3+d/8|0),o.z?'#8fd16a':o.c,170);spark(o.x,o.y-o.h*.6,Math.min(9,3+d/9|0),'#fff3b0');if(d>=40&&!G.demo&&!o.B)G.hs=.05;TX.push({x:o.x+(R()-.5)*20,y:o.y-o.h-8,t:'-'+d,l:.8,c:fz?'#9fe3ff':'#fff'});if(o.hp<=0)die(o)}
function phase(p,o){p.rl=p.rl||[];if(!p.rl.includes(o)){p.rl.push(o);if(R()<.07){p.gp=(p.gp||[]).concat(o);TX.push({x:o.x,y:o.y-o.h-18,t:'СКВОЗЬ',l:.8,c:'#bfeaff'});fx(o.x,o.y-o.h/2,10,'#bfeaff',200)}}return !!(p.gp&&p.gp.includes(o))}
function brk(e){e.wp='fist';e.am=1e9;e.katHits=0;e.katRefs=0;fx(e.x,e.y-40,16,'#e8f1ff',300);TX.push({x:e.x,y:e.y-e.h-20,t:'КАТАНА СЛОМАНА',l:1,c:'#ff8c8c'})}
function rbO(e){return[e.x,e.y-e.h-52]}
function rbUpd(e,dt){const b=e.rb,O0=rbO(e);b.t+=dt;if(e.hp<=0||b.t>6.5){e.rb=null;return}if(b.t<1.5&&R()<dt*110){const a=R()*6.3,d=80+R()*70;PT.push({x:O0[0]+Math.cos(a)*d,y:O0[1]+Math.sin(a)*d,vx:-Math.cos(a)*d*1.8,vy:-Math.sin(a)*d*1.8,g:0,l:.5,c:`hsl(${R()*360},100%,65%)`,r:2.5})}
 if(b.t>1.5){const t=near(e),O=rbO(e);if(t){const ta=Math.atan2(t.y-t.h/2-O[1],t.x-O[0]);if(b.a==null)b.a=ta;else{let da=ta-b.a;da=Math.atan2(Math.sin(da),Math.cos(da));b.a+=cl(da,-1.7*dt,1.7*dt)}}if(b.a==null)b.a=e.f>0?0:Math.PI;if(R()<dt*100){const u=R()*1100,s2=(R()-.5)*70;PT.push({x:O[0]+Math.cos(b.a)*u-Math.sin(b.a)*s2,y:O[1]+Math.sin(b.a)*u+Math.cos(b.a)*s2,vx:(R()-.5)*60,vy:(R()-.5)*60-30,g:0,l:.45,c:`hsl(${R()*360},100%,65%)`,r:2+R()*2})}
  b.tk+=dt;if(b.tk>=.2){b.tk-=.2;const ux=Math.cos(b.a),uy=Math.sin(b.a);for(const o of ents)if(o.hp>0&&o.tm!=e.tm){const dx=o.x-O[0],dy=o.y-o.h/2-O[1];if(dx*ux+dy*uy>0&&Math.abs(dx*uy-dy*ux)<96+o.w/2+o.h/6){hit(o,7,e,0);fx(o.x,o.y-o.h/2,3,`hsl(${R()*360},95%,65%)`,160)}}}G.sh=Math.max(G.sh,3)}}
function rbowUpd(e,dt){const b=e.rbow;b.t+=dt;if(e.hp<=0||b.t>b.dur){e.rbow=null;return}
 b.r=Math.min(74,b.r+dt*135);
 const sx=e.x,sy=e.y-e.h-52;
 let tg=null,bd=1e9;for(const o of ents){if(o.hp<=0||o.tm===e.tm)continue;const d=Math.hypot(o.x-sx,o.y-o.h*.5-sy);if(d<bd){bd=d;tg=o}}
 b.hasTarget=!!tg;
 if(tg){const ta=Math.atan2(tg.y-tg.h*.5-sy,tg.x-sx);if(b.a==null)b.a=ta;else{let da=ta-b.a;da=Math.atan2(Math.sin(da),Math.cos(da));b.a+=cl(da,-1.05*dt,1.05*dt)}}
 if(tg&&b.t>.85){b.tk=(b.tk||0)+dt;if(b.tk>=.24){b.tk-=.24;const ux=Math.cos(b.a),uy=Math.sin(b.a);for(const o of ents)if(o.hp>0&&o.tm!==e.tm){const dx=o.x-sx,dy=o.y-o.h*.5-sy;if(dx*ux+dy*uy>0&&Math.abs(dx*uy-dy*ux)<48+o.w/2+o.h/6){hit(o,9,e,0);fx(o.x,o.y-o.h*.5,3,`hsl(${R()*360},95%,65%)`,150)}}}
  b.ak=(b.ak||0)+dt;if(b.ak>=.38){b.ak-=.38;for(const o of ents)if(o.hp>0&&o.tm!==e.tm&&Math.hypot(o.x-sx,o.y-o.h*.5-sy)<b.r+o.w/2+16){hit(o,6,e,Math.sign(o.x-sx||1)*60);fx(o.x,o.y-o.h*.5,4,`hsl(${R()*360},95%,65%)`,140)}}}
 if(R()<dt*90){const a=R()*6.3,d=b.r*(0.9+R()*.6);PT.push({x:sx+Math.cos(a)*d,y:sy+Math.sin(a)*d,vx:-Math.cos(a)*d*1.6,vy:-Math.sin(a)*d*1.6,g:0,l:.4,c:`hsl(${R()*360},100%,65%)`,r:2+R()*2})}
 G.sh=Math.max(G.sh,2.2)}
function drawRBow(e){const b=e.rbow,t=b.t,sx=e.x,sy=e.y-e.h-52,T=G.t,fo=b.t>b.dur-.4?Math.max(0,(b.dur-b.t)/.4):1,q=Math.min(1,t/.7),hc=(v,a=1)=>`hsla(${v%360},100%,62%,${a})`;
 cx.save();cx.lineCap='round';cx.globalCompositeOperation='lighter';
 const r=b.r*fo;
 for(let i=0;i<20;i++){const a=T*.55+i*Math.PI/10,len=r*(1.7+.4*Math.sin(T*3+i));cx.strokeStyle=hc(i*18+T*260,.5*q*fo);cx.lineWidth=3.2;cx.beginPath();cx.moveTo(sx+Math.cos(a)*r*.7,sy+Math.sin(a)*r*.7);cx.lineTo(sx+Math.cos(a)*len,sy+Math.sin(a)*len);cx.stroke()}
 let g=cx.createRadialGradient(sx,sy,1,sx,sy,r*1.4);g.addColorStop(0,'#ffffff');g.addColorStop(.25,hc(T*300));g.addColorStop(.55,hc(T*300+140,.75));g.addColorStop(1,hc(T*300+280,0));cx.fillStyle=g;cx.beginPath();cx.arc(sx,sy,r*1.4,0,7);cx.fill();
 for(let i=0;i<12;i++){const a=T*2.2+i*.524;cx.fillStyle=hc(i*30+T*340);cx.beginPath();cx.arc(sx+Math.cos(a)*r,sy+Math.sin(a)*r,3,0,7);cx.fill()}
 if(t>.85&&b.hasTarget){const k=Math.min(1,(t-.85)/.35)*fo,L=1900,w=30;cx.translate(sx,sy);cx.rotate(b.a);
  let bg=cx.createLinearGradient(0,-w*2.2,0,w*2.2);bg.addColorStop(0,'#0000');bg.addColorStop(.5,hc(T*320,.28*k));bg.addColorStop(1,'#0000');cx.fillStyle=bg;cx.fillRect(0,-w*2.2,L,w*4.4);
  for(let i=0;i<7;i++){cx.fillStyle=hc(i*52+T*420);cx.globalAlpha=.85*k;cx.fillRect(0,-w+(i+.5)*w*2/7-2,L,w*2/7-1)}
  cx.globalAlpha=k;const cg=cx.createLinearGradient(0,-w*.5,0,w*.5);cg.addColorStop(0,'#0000');cg.addColorStop(.5,'#ffffff');cg.addColorStop(1,'#0000');cx.fillStyle=cg;cx.fillRect(0,-w*.5,L,w);cx.globalAlpha=1;cx.fillStyle='#ffffff';cx.fillRect(0,-2,L,4);
  for(let i=0;i<6;i++){const x=(T*520+i*260)%L;cx.strokeStyle=hc(i*60+T*480,.7*k*(1-x/L));cx.lineWidth=2.5;cx.beginPath();cx.arc(x,0,w*(1.1-x/L*.4),-1.2,1.2);cx.stroke()}}
 cx.restore()}
function drawRB(e){const b=e.rb,t=b.t,mx=e.x+e.f*22*e.sz,my=e.y-38*e.sz,O=rbO(e),T=G.t,fo=t>6?Math.max(0,(6.5-t)/.5):1,q=Math.min(1,t/1.5),hc=(v,a=1)=>`hsla(${v%360},100%,62%,${a})`,on=t>1.5&&b.a!=null;
 cx.save();cx.lineCap='round';cx.globalCompositeOperation='lighter';
 if(on){cx.globalAlpha=.07*fo;cx.fillStyle=hc(T*300);cx.fillRect(0,0,W,H);cx.globalAlpha=1}
 if(t<1.5)for(let i=0;i<10;i++){const a=-Math.PI/2+(i-4.5)*.13,L=190*Math.min(1,t/.5),k=Math.max(0,Math.min(1,(t-.5)/1)),s=k*k*(3-2*k),tx=(mx+Math.cos(a)*L)*(1-s)+O[0]*s,ty=(my+Math.sin(a)*L)*(1-s)+O[1]*s,qx=(mx+tx)/2+Math.sin(T*14+i)*14*(1-s),qy=(my+ty)/2;cx.strokeStyle=hc(i*36+T*220);for(const[w,al]of[[16,.16],[7,.45],[2.4,1]]){cx.globalAlpha=al;cx.lineWidth=w;cx.beginPath();cx.moveTo(mx,my);cx.quadraticCurveTo(qx,qy,tx,ty);cx.stroke()}}
 cx.globalAlpha=1;
 const r=(8+q*38)*fo*(1+Math.sin(T*18)*.06),hu=T*260;
 if(r>1){for(const[m,al]of[[4.5,.1],[3,.16],[2,.28]]){const g=cx.createRadialGradient(O[0],O[1],0,O[0],O[1],r*m);g.addColorStop(0,hc(hu,al*2));g.addColorStop(.5,hc(hu+140,al));g.addColorStop(1,hc(hu+280,0));cx.fillStyle=g;cx.beginPath();cx.arc(O[0],O[1],r*m,0,7);cx.fill()}
  for(let k=0;k<3;k++){cx.save();cx.translate(O[0],O[1]);cx.rotate(T*(1.6+k*.7)+k*1.2);cx.scale(1,.3+k*.12);cx.strokeStyle=hc(k*120+T*320,.9*q*fo);cx.lineWidth=3.5;cx.beginPath();cx.arc(0,0,r*(1.55+k*.3),0,7);cx.stroke();cx.restore()}
  for(let i=0;i<14;i++){const a=T*5+i*.45,d=r*(1.15+.35*Math.sin(T*3+i));cx.strokeStyle=hc(i*26+T*300);cx.lineWidth=3;cx.globalAlpha=.9;cx.beginPath();cx.moveTo(O[0]+Math.cos(a-.4)*d,O[1]+Math.sin(a-.4)*d*.8);cx.lineTo(O[0]+Math.cos(a)*d,O[1]+Math.sin(a)*d*.8);cx.stroke()}
  cx.globalAlpha=1;const g2=cx.createRadialGradient(O[0],O[1],0,O[0],O[1],r);g2.addColorStop(0,'#ffffff');g2.addColorStop(.6,hc(hu,.9));g2.addColorStop(1,hc(hu+120,0));cx.fillStyle=g2;cx.beginPath();cx.arc(O[0],O[1],r,0,7);cx.fill()}
 if(on){const ux=Math.cos(b.a),uy=Math.sin(b.a);for(const o of ents)if(o.hp>0&&o.tm!=e.tm){const dx=o.x-O[0],dy=o.y-o.h/2-O[1];if(dx*ux+dy*uy>0&&Math.abs(dx*uy-dy*ux)<45+o.w/2+o.h/6){const px=o.x,py=o.y-o.h/2,g=cx.createRadialGradient(px,py,0,px,py,70);g.addColorStop(0,'#ffffffcc');g.addColorStop(.4,hc(T*500,.5));g.addColorStop(1,hc(T*500+90,0));cx.fillStyle=g;cx.fillRect(px-70,py-70,140,140)}}}
 if(on){const k=Math.min(1,(t-1.5)/.25)*fo,hw=96*k*(1+Math.sin(T*30)*.05),L=2300;cx.translate(O[0],O[1]);cx.rotate(b.a);
  let g=cx.createLinearGradient(0,-hw*2.4,0,hw*2.4);g.addColorStop(0,'#0000');g.addColorStop(.5,hc(T*300,.22*k));g.addColorStop(1,'#0000');cx.fillStyle=g;cx.fillRect(0,-hw*2.4,L,hw*4.8);
  for(let i=0;i<68;i++){cx.fillStyle=hc(i*14-T*800,.6*k);cx.fillRect(i*28,-hw,29,hw*2)}
  g=cx.createLinearGradient(0,-hw,0,hw);g.addColorStop(0,'#0000');g.addColorStop(.5,'#ffffffee');g.addColorStop(1,'#0000');cx.globalAlpha=k;cx.fillStyle=g;cx.fillRect(0,-hw,L,hw*2);
  cx.globalAlpha=.9*k;cx.fillStyle='#ffffff';cx.fillRect(0,-hw*.12,L,hw*.24);
  cx.lineWidth=3;for(let i=0;i<9;i++){const x=(T*700+i*210)%L;cx.strokeStyle=hc(i*40+T*400,.7*k*(1-x/L));cx.globalAlpha=1;cx.beginPath();cx.arc(x,0,hw*1.05,-1.15,1.15);cx.stroke()}}
 cx.restore()}
function drawRBo(e){const b=e.rb,t=b.t,mx=e.x+e.f*22*e.sz,my=e.y-38*e.sz,O=rbO(e);cx.save();cx.lineCap='round';
 if(t<1.5){for(let i=0;i<10;i++){const a=-Math.PI/2+(i-4.5)*.13,L=170*Math.min(1,t/.5),k=Math.max(0,Math.min(1,(t-.5)/1)),s=k*k*(3-2*k),tx=(mx+Math.cos(a)*L)*(1-s)+O[0]*s,ty=(my+Math.sin(a)*L)*(1-s)+O[1]*s;cx.strokeStyle=`hsl(${i*36+G.t*200},95%,62%)`;cx.globalAlpha=.35;cx.lineWidth=11;cx.beginPath();cx.moveTo(mx,my);cx.lineTo(tx,ty);cx.stroke();cx.globalAlpha=1;cx.lineWidth=4;cx.stroke();cx.strokeStyle='#ffffffcc';cx.lineWidth=1.5;cx.stroke()}}
 const fo=t>8?Math.max(0,(8.5-t)/.5):1,r=Math.min(1,t/1.5)*42*fo+Math.sin(G.t*20)*1.5,g=cx.createRadialGradient(O[0],O[1],2,O[0],O[1],r*1.8);g.addColorStop(0,'#ffffff');g.addColorStop(.35,`hsl(${G.t*300%360},95%,70%)`);g.addColorStop(1,'#0000');cx.fillStyle=g;cx.beginPath();cx.arc(O[0],O[1],r*1.8,0,7);cx.fill();
 for(let i=0;i<7;i++){const a=G.t*6+i*.9;cx.fillStyle=`hsl(${i*52+G.t*300},95%,65%)`;cx.beginPath();cx.arc(O[0]+Math.cos(a)*r,O[1]+Math.sin(a)*r,4,0,7);cx.fill()}
 if(t>1.5&&b.a!=null){const k=Math.min(1,(t-1.5)/.25)*fo;cx.translate(O[0],O[1]);cx.rotate(b.a);cx.globalAlpha=.28*k;cx.fillStyle='#ffffff';cx.fillRect(0,-50*k,1900,100*k);cx.globalAlpha=.9*k;for(let i=0;i<7;i++){cx.fillStyle=`hsl(${(i*52+G.t*500)%360},95%,60%)`;cx.fillRect(0,(i-3.5)*10*k,1900,10*k)}cx.globalAlpha=k;cx.fillStyle='#ffffffcc';cx.fillRect(0,-4*k,1900,8*k)}
 cx.restore()}
function tslam(e){RG.push({x:e.x,y:e.y,l:.35});fx(e.x,e.y,20,'#d8c7a8',280);G.sh=Math.max(G.sh,9);for(const o of ents)if(o.hp>0&&o.tm!=e.tm&&Math.abs(o.x-e.x)<130&&Math.abs(o.y-e.y)<70){const dx=o.x-e.x;hit(o,Math.abs(dx)<e.w/2+o.w/2?25:10,e,(Math.sign(dx)||1)*(420-Math.abs(dx)*2))}}
function dot(e,d,c){if(e.hp<=0||e.batTimer>0)return;e.da=(e.da||0)+d;if(e.da>=3){const v=Math.floor(e.da);e.da-=v;e.hp-=v;e.fl=.05;e.damageClock=0;e.regenClock=0;TX.push({x:e.x+(R()-.5)*16,y:e.y-e.h-6,t:'-'+v,l:.6,c});if(e.hp<=0)die(e)}}
function st(o,k,t){if(!o.B||k=='bn')o[k]=Math.max(o[k]||0,t)}
function bleed(o){o.bl=Math.min(5,(o.bl||0)+1);o.br=4;TX.push({x:o.x,y:o.y-o.h-22,t:'КРОВОТЕЧЕНИЕ '+o.bl,l:1,c:'#ff5a6a'});fx(o.x,o.y-o.h*.6,10,'#c1121f',220)}
function pf(e,c,g,v){PT.push({x:e.x+(R()-.5)*14*e.sz,y:e.y-R()*e.h,vx:(R()-.5)*20,vy:v,g,l:.5,c,r:2+R()*2})}
function spark(x,y,n,c){for(let i=0;i<n;i++){const a=R()*6.3,v=200+R()*500;PT.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.15+R()*.2,c,r:1.2,k:1})}}
function die(o){o.hp=0;o.dd=o.B?1.3:.9;if(o.cl&&o.own&&o.own.hp>0){o.own.hp=Math.min(o.own.mh,o.own.hp+45);TX.push({x:o.own.x,y:o.own.y-o.own.h-10,t:'+45',l:.9,c:'#7ee08a'});fx(o.own.x,o.own.y-o.own.h/2,10,'#7ee08a',180)}o.dk=Math.sign(o.vx)||-o.f;o.fo=0;o.chg=0;o.vy=Math.min(o.vy,-240);if(!G.demo&&!o.z)G.slow=.5;fx(o.x,o.y-o.h/2,o.B?40:14,'#d93a3f',o.B?500:260);G.sh=Math.max(G.sh,o.B?22:7)}
function dieO(o){fx(o.x,o.y-o.h/2,o.B?60:26,o.c,o.B?600:340);G.sh=Math.max(G.sh,o.B?22:7)}
function use(e){const w=WP[e.wp],single=['harpoon','mirror','time','gravity'].includes(e.wp);if(w.am<1e8&&!(e.rg&&!single&&R()<.5)&&--e.am<=0){e.wp='fist';e.am=1e9;fx(e.x,e.y-30,10,w.c,220)}}
