

if(typeof CanvasRenderingContext2D!='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(+r||0,Math.abs(w)/2,Math.abs(h)/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const $=i=>document.getElementById(i),cv=$('c'),W=1920,H=1080,GY=1020,VW=1280,VH=720,R=Math.random,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),
rr=(x,y,w,h,c,k=cx,r=1.5)=>{k.fillStyle=c;k.beginPath();k.roundRect(x,y,w,h,r);k.fill();if(OL){k.lineWidth=1.2;k.strokeStyle='#0b0d17';k.stroke()}};
let cx=cv.getContext('2d'),OL=0;
const COL=['#ff5a5f','#3ec1ff','#7be04a','#ffd23f','#c77dff','#ff9f1c','#2ee6c8','#f2f2f2'];
const CH=[{n:'Классик',hp:300,d:'Обычный стикмен без способностей'},{n:'Танк',hide:1,hp:450,sp:.8,sz:1.18,fg:1.9,slam:1,d:'450 HP, крупный, падает быстро, при приземлении бьёт ударной волной'},{n:'Берсерк',hp:300,sp:1.05,dm:1.3,rage:1,d:'Обычно урон ×1.3. При HP ниже 45% включается ярость: урон ×2, защита ×1.5; теряет 1 HP/с до 20% здоровья'},{n:'Призрак',hp:270,sp:1.7,dj:1,sf:1,fg:.3,d:'Очень быстрый, дополнительный прыжок, плавное падение и 15% шанс пройти сквозь снаряд'},{n:'Двойник',hp:300,cl:1,d:'Создаёт клона; при смерти оригинал появляется на месте клона с 50% HP, а клон погибает'},{n:'Медик',hp:300,med:1,d:'Может бросить аптечку. Сам восстанавливает 10 HP каждые 12 с'},{n:'Вампир',hp:200,sp:1.3,jm:1.14,vamp:1,d:'200 HP, лечится на 25% нанесённого урона. Способность: летучая мышь на 3 с, перезарядка 20 с'},{n:'Инженер',hp:320,sp:.96,engineer:1,d:'Ставит усиленную автоматическую турель на 8,5 секунд'},{n:'Дуэлянт',hp:285,sp:1.12,duelist:1,dm:1.08,d:'Отражает снаряды в течение 1,35 секунды и помечает до трёх сильнейших врагов на 4 секунды; метка увеличивает получаемый урон на 50%'},{n:'Штурмовик',hp:330,sp:1.02,assault:1,d:'Создаёт защитные стены на 5 секунд. Они останавливают монстров и их снаряды, имеют 7 прочности'},{n:'Акробат',hp:270,sp:1.18,fg:.84,acrobat:1,d:'Лёгкий и быстрый. Отталкивается от стен и пружинит при приземлении с зажатым прыжком'},{n:'Рукопашник',hp:400,sp:1.08,brawler:1,d:'Не подбирает оружие. Кулаки: 25% шанс нанести критический удар ×3 и 15% шанс восстановить 3 HP при попадании. Регенерация начинается через 11 секунд без урона'}];
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
rain:{n:'Радужная пушка',c:'#ff66cc',cd:.5,am:1,dm:75,t:'x',d:'Шанс выпадения 3%. 5 секунд наносит 30 урона/с по врагам; луч медленно сам доворачивает на ближайшего врага'},
tesla:{n:'Тесла',c:'#63eaff',cd:.72,am:5,dm:42,t:'e',d:'5 электрических разрядов; цепляет ближайшего второго врага'},
harpoon:{n:'Гарпун',c:'#e4c47a',cd:.8,am:1,dm:48,v:1050,t:'p',life:1.8,d:'Одноразовый выстрел, притягивает поражённую цель'},
boomerang:{n:'Бумеранг',c:'#ffa85c',cd:.55,am:5,dm:28,v:760,t:'q',life:3.2,d:'5 бросков; возвращается к владельцу и может задеть врагов'},
mirror:{n:'Зеркало',c:'#a8e9ff',cd:.45,am:1,dm:0,t:'m',d:'Одно использование; отражает снаряды в течение 15 секунд'},
time:{n:'Временной излучатель',c:'#8b91ff',cd:.55,am:1,dm:0,t:'u',d:'Одно использование; замедляет врагов в зоне на 10 секунд'},
gravity:{n:'Гравитационный коллапс',c:'#b98cff',cd:.8,am:1,dm:90,t:'v',d:'Одно использование; стягивает врагов и наносит урон при схлопывании'}
};
const BOSS_TYPES=[
{id:'warlord',n:'Теневой владыка',hp:980,size:2.2,speed:.55,near:230,far:400,first:4.5,atk:['nova','rift','blink']},
{id:'colossus',n:'Колосс',hp:1450,size:2.65,speed:.4,near:110,far:210,first:3,atk:['leap','stomp','rocks','throw']},
{id:'necromancer',n:'Некромант',hp:1120,size:2.15,speed:.45,near:340,far:480,first:3.5,atk:['souls','circles','step']},
{id:'electric',n:'Электрический гигант',hp:1280,size:2.35,speed:.5,near:170,far:320,first:3,atk:['strike','chain','field','wave']}
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
{n:'Закат',g:['#2a1747','#ff8f4d'],h:'#3b2160',d:'o',s:1,p:'#4a2d6e',t:'#ffb27a',pl:[[110,540,150],[1020,540,150],[560,560,160],[300,430,140],[840,430,140],[570,320,140],[160,300,120],[1000,300,120],[570,190,140]]},
{n:'Ледник',g:['#12304f','#8fd3f0'],h:'#1c4a72',d:'n',s:2,p:'#2d6a96',t:'#d9f4ff',ic:1,pl:[[60,520,130],[1090,520,130],[300,560,130],[850,560,130],[575,450,130],[250,340,120],[910,340,120],[575,230,130],[110,215,110],[1060,215,110]]},
{n:'Лава',g:['#1c0a0a','#8a2410'],h:'#2e100c',d:'e',s:3,p:'#4a1f18',t:'#ff7a3c',pl:[[80,560,160],[1040,560,160],[400,510,110],[770,510,110],[585,400,110],[260,340,110],[910,340,110],[585,235,110],[120,215,110],[1050,215,110]]},
{n:'Ночь',g:['#060a1c','#1f2f66'],h:'#0d1431',d:'s',s:4,p:'#26305c',t:'#7f94e0',pl:[[0,520,170],[1110,520,170],[330,560,120],[830,560,120],[580,450,120],[240,340,130],[910,340,130],[580,235,130],[40,215,110],[1130,215,110]]},
{n:'Лес',g:['#8fd6c4','#eaf6c8'],h:'#3f8a62',d:'l',s:5,p:'#2f6b4a',t:'#9be36a',pl:[[130,540,140],[1010,540,140],[570,570,140],[350,440,120],[810,440,120],[130,330,120],[1030,330,120],[570,330,140],[350,225,110],[820,225,110]]},
{n:'Мост',g:['#3a2a20','#d19a5a'],h:'#55392a',d:'o',s:6,p:'#6b4a35',t:'#f0c78a',pl:[[60,510,150],[1070,510,150],[290,550,110],[880,550,110],[500,430,110],[670,430,110],[380,310,110],[790,310,110],[585,195,110]]},
{n:'Пустыня',g:['#3d1f0f','#f4a259'],h:'#6b3a1e',d:'o',s:7,p:'#8a5a2b',t:'#f7c98b',pl:[[200,540,130],[950,540,130],[575,560,130],[80,430,100],[1100,430,100],[380,425,110],[790,425,110],[575,315,130],[230,205,110],[930,205,110]]},
{n:'Космос',g:['#04030c','#2a1450'],h:'#120a2a',d:'s',s:8,p:'#33276b',t:'#9d7bff',gv:.62,pl:[[100,560,130],[1050,560,130],[420,520,120],[740,520,120],[585,410,110],[250,400,110],[920,400,110],[430,290,110],[740,290,110],[585,185,110],[90,265,100],[1090,265,100]]},
{n:'Джунгли',g:['#0f3d2e','#7bd88f'],h:'#1d5a3a',d:'l',s:9,p:'#3b2a1a',t:'#6edc5a',pl:[[60,520,120],[1100,520,120],[300,600,110],[850,600,110],[580,500,120],[380,400,110],[790,400,110],[100,330,110],[1070,330,110],[580,290,120],[300,205,110],[850,205,110]]},
{n:'Шахта',g:['#17120e','#4a3d30'],h:'#2a2018',d:'e',s:10,p:'#5a4632',t:'#c9a77a',pl:[[150,540,150],[980,540,150],[565,540,150],[40,420,100],[1140,420,100],[360,430,110],[810,430,110],[565,320,150],[200,305,110],[960,305,110],[565,205,110]]}];
const MPo=[{n:'Закат',g:['#2a1747','#ff8f4d'],h:'#3b2160',d:'o',s:1,p:'#4a2d6e',t:'#ffb27a',pl:[[170,390,220],[570,390,220],[370,275,220]]},
{n:'Ледник',g:['#12304f','#8fd3f0'],h:'#1c4a72',d:'n',s:2,p:'#2d6a96',t:'#d9f4ff',pl:[[50,400,170],[740,400,170],[395,320,170],[190,215,150],[620,215,150]]},
{n:'Лава',g:['#1c0a0a','#8a2410'],h:'#2e100c',d:'e',s:3,p:'#4a1f18',t:'#ff7a3c',pl:[[70,380,200],[690,380,200],[380,290,200],[240,190,140],[580,190,140]]},
{n:'Ночь',g:['#060a1c','#1f2f66'],h:'#0d1431',d:'s',s:4,p:'#26305c',t:'#7f94e0',pl:[[0,380,230],[730,380,230],[330,300,300],[130,200,140],[690,200,140]]},
{n:'Лес',g:['#8fd6c4','#eaf6c8'],h:'#3f8a62',d:'l',s:5,p:'#2f6b4a',t:'#9be36a',pl:[[100,400,180],[680,400,180],[390,340,180],[250,240,160],[550,240,160],[400,140,160]]},
{n:'Мост',g:['#3a2a20','#d19a5a'],h:'#55392a',d:'o',s:6,p:'#6b4a35',t:'#f0c78a',pl:[[60,370,840],[260,235,440]]}];

const MD={duel:'1 на 1',v12:'1 на 2 (бот помогает одному)',v22:'2 на 2 (с ботами)',zomb:'Зомби-волны',boss:'Босс'};
const ACT=[['l','Влево'],['r','Вправо'],['j','Прыжок'],['d','Вниз'],['s','Огонь'],['m','Способность']];
const S={mode:'duel',rounds:3,maps:[0,1,2,3,4,5,6,7,8,9],p:[{c:0,ch:0,k:{l:'KeyA',r:'KeyD',j:'KeyW',d:'KeyS',s:'KeyF',m:'KeyG'}},{c:1,ch:0,k:{l:'ArrowLeft',r:'ArrowRight',j:'ArrowUp',d:'ArrowDown',s:'Enter',m:'ShiftRight'}},{c:2,ch:0,k:{l:'KeyJ',r:'KeyL',j:'KeyI',d:'KeyK',s:'KeyH',m:'KeyU'}}],t3:0,phone:(typeof matchMedia!='undefined'&&matchMedia('(pointer:coarse)').matches)?1:0,soft:0};
let sc=1,M,G,ents=[],P=[],IT=[],PT=[],TX=[],RG=[],BM=[],ZP=[],TUR=[],WALLS=[],HZ=[],bgc,K={},rb=null,cur='menu',lt=0;
const kn=c=>({ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',Space:'Пробел'})[c]||c.replace(/^(Key|Digit|Numpad)/,'');
const tn=t=>G.mode=='duel'||G.mode=='v12'?'ИГРОК '+(t+1):'КОМАНДА '+(t+1);
function fit(){const r=Math.max(.2,Math.min(innerWidth/VW,innerHeight/VH)*(S.phone?1:.97)),d=Math.min(devicePixelRatio||1,2);cv.style.width=VW*r+'px';cv.style.height=VH*r+'px';cv.width=Math.round(VW*r*d);cv.height=Math.round(VH*r*d);sc=r*d;if(M)mkbg()}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fit,150)});
function mkbg(){const bs=Math.min(sc,1.25);bgc=document.createElement('canvas');bgc.width=Math.max(1,Math.round(W*bs));bgc.height=Math.max(1,Math.round(H*bs));const c=bgc.getContext('2d');c.scale(bs,bs);const Z=W/1280;
 let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,M.g[0]);g.addColorStop(1,M.g[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
 if(M.d=='o'||M.d=='s'){const o=M.d=='o',sx=W*.75,sy=H*.26;g=c.createRadialGradient(sx,sy,0,sx,sy,300);g.addColorStop(0,o?'#fff2c0':'#fffffff0');g.addColorStop(.25,o?'#ffc46bcc':'#cfe0ff55');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(W*.45,0,W*.55,H*.7)}
 for(let k=0;k<2;k++){c.fillStyle=k?M.h:M.h+'77';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H*(k?.785:.708)+Math.sin(x*.011/Z+M.s*2+k*2)*36*Z+Math.sin(x*.027/Z+k)*12*Z);c.lineTo(W,H);c.fill()}
 props(c);g=c.createLinearGradient(0,GY,0,H);g.addColorStop(0,M.p);g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(0,GY,W,H-GY);c.fillStyle=M.t;c.fillRect(0,GY,W,4);
 for(const p of M.pl){if(p[3])continue;c.fillStyle='#0005';c.beginPath();c.roundRect(p[0]+5,p[1]+17,p[2]-10,8,4);c.fill();rr(p[0],p[1],p[2],17,mix(M.p,0,.3),c,7);rr(p[0],p[1],p[2],12,M.p,c,6);rr(p[0]+2,p[1],p[2]-4,4,M.t,c,2);c.fillStyle='#0003';for(let x=p[0]+12;x<p[0]+p[2]-8;x+=22)c.fillRect(x,p[1]+7,8,2)}}
function props(c){const d=M.d,q=i=>Math.abs(Math.sin(i*12.9898+M.s*7.3));
 if(d=='s'){for(let x=-10,i=0;x<W;x+=46,i++){const h=(70+q(i)*150)*1.5;c.fillStyle='#0a1028';c.fillRect(x,GY-h,40,h);c.fillStyle='#ffd86b';for(let y=GY-h+8;y<GY-12;y+=16)for(let k=0;k<3;k++)if(q(i*9+y+k)>.55)c.fillRect(x+6+k*11,y,6,8)}}
 else if(d=='n'||d=='l'){for(let x=20,i=0;x<W;x+=58,i++){const h=(60+q(i)*70)*1.5;c.fillStyle=d=='n'?'#cfeaf7':'#2a5c40';if(d=='n'){c.beginPath();c.moveTo(x-22,GY);c.lineTo(x,GY-h);c.lineTo(x+22,GY);c.fill()}else{c.fillRect(x-3,GY-h*.4,6,h*.4);c.beginPath();c.arc(x,GY-h*.6,h*.38,0,7);c.fill()}}}
 else if(d=='e'){c.fillStyle='#120606';for(let x=0,i=0;x<W;x+=70,i++){const h=(80+q(i)*120)*1.5;c.beginPath();c.moveTo(x,GY);c.lineTo(x+35,GY-h);c.lineTo(x+70,GY);c.fill()}}
 else{c.fillStyle='#3a2410';for(let x=60,i=0;x<W;x+=190,i++){const h=(110+q(i)*90)*1.5;c.fillRect(x,GY-h,26,h);c.fillRect(x-6,GY-h,38,10)}}}
function decor(){const t=G.t,d=M.d;if(d=='l'||d=='o'){cx.fillStyle=d=='o'?'#ffd2a066':'#ffffff88';for(let i=0;i<6;i++){const x=((i*260+t*(8+i*3))%(W+300))-150,y=140+i%3*110;cx.beginPath();cx.ellipse(x,y,70,16,0,0,7);cx.fill();cx.beginPath();cx.ellipse(x+40,y-8,44,14,0,0,7);cx.fill()}return}cx.fillStyle=d=='e'?'#ffb347':'#fff';for(let i=0;i<140;i++){let x=(i*137.5)%W,y,a=1,r=1.4;
 if(d=='s'){y=(i*61)%(H*.42);a=.5+.5*Math.sin(t*2+i)}else if(d=='n'){x+=Math.sin(t+i)*20;y=(i*53+t*(30+i%5*12))%H;r=2}else{y=H-(i*53+t*(40+i%7*14))%H;x+=Math.sin(t*2+i)*10}
 cx.globalAlpha=a*.8;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}cx.globalAlpha=1}
