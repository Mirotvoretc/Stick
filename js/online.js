function netStatus(t){const el=$('netStatus');if(el)el.textContent=t}
function setNetNotice(message,visible=true){const el=$('netNotice');if(!el)return;el.textContent=message||'';el.classList.toggle('show',!!visible&&!!message)}
function defaultServerUrl(){if(location.protocol!=='http:'&&location.protocol!=='https:')return '';const host=(location.hostname||'').toLowerCase();if(host.endsWith('github.io')||host.endsWith('githubusercontent.com'))return '';return location.origin}
function loadServerUrl(){try{return localStorage.getItem('stickArenaServerUrl')||defaultServerUrl()}catch(e){return defaultServerUrl()}}
function normalizeServerUrl(value){const u=new URL(value);if(u.protocol==='https:')u.protocol='wss:';else if(u.protocol==='http:')u.protocol='ws:';if(!['wss:','ws:'].includes(u.protocol))throw new Error('protocol');if(!u.pathname||u.pathname==='/')u.pathname='/ws';else if(!u.pathname.endsWith('/ws'))u.pathname=u.pathname.replace(/\/$/,'')+'/ws';if(location.protocol==='https:'&&u.protocol!=='wss:')throw new Error('secure');return u.href}
function saveServerUrl(){const field=$('serverUrl'),value=field?field.value.trim():'';if(!value){lobbyStatus('Вставь HTTPS-адрес игрового сервера.');return}try{const address=normalizeServerUrl(value);localStorage.setItem('stickArenaServerUrl',address);if(field)field.value=address;lobbyStatus('Адрес сохранён.')}catch(e){lobbyStatus(e.message==='secure'?'На HTTPS-странице нужен защищённый адрес HTTPS/WSS.':'Некорректный адрес сервера. Вставь ссылку вида https://game.example.ru')}}
function getServerUrl(){const field=$('serverUrl'),value=(field&&field.value.trim())||loadServerUrl();if(!value){lobbyStatus('Сначала вставь HTTPS-адрес сервера из хостинга.');return null}try{const address=normalizeServerUrl(value);try{localStorage.setItem('stickArenaServerUrl',address)}catch(e){}if(field)field.value=address;return address}catch(e){lobbyStatus(e.message==='secure'?'Для HTTPS-страницы нужен HTTPS/WSS-адрес.':'Адрес сервера некорректен. Проверь ссылку.');return null}}
function testServer(){const url=getServerUrl();if(!url)return;let ws;try{ws=new WebSocket(url)}catch(e){lobbyStatus('Не удалось открыть соединение. Проверь адрес сервера.');return}lobbyStatus('Проверяем задержку до игрового сервера…');let finished=false,pingAt=0;const timer=setTimeout(()=>{if(finished)return;finished=true;try{ws.close()}catch(e){}lobbyStatus('Сервер не ответил за 8 секунд. Проверь адрес и доступность хостинга.')},8000);ws.onopen=()=>{if(finished)return;pingAt=performance.now();try{ws.send(JSON.stringify({type:'ping'}))}catch(e){finished=true;clearTimeout(timer);lobbyStatus('Не удалось отправить проверочный пакет.');try{ws.close()}catch(x){}}};ws.onmessage=event=>{if(finished)return;let data;try{data=JSON.parse(event.data)}catch(e){return}if(data.type!=='pong')return;finished=true;clearTimeout(timer);const elapsed=Math.round(performance.now()-pingAt);try{ws.close(1000,'Connection test')}catch(e){}lobbyStatus('Задержка до сервера: примерно '+elapsed+' мс (RTT). Это замер до сервера, а не гарантия такой же задержки в каждом матче.')};ws.onerror=()=>{if(finished)return;finished=true;clearTimeout(timer);lobbyStatus('Не удалось подключиться. Сервер может быть выключен или адрес неверный.')};ws.onclose=()=>{if(!finished){finished=true;clearTimeout(timer);lobbyStatus('Сервер закрыл соединение до проверки. Проверь хостинг.')}}}
function openOnline(){show('online');const field=$('serverUrl');if(field&&!field.value)field.value=loadServerUrl();netStatus(NET.ready?'Подключено к игровому серверу.':(field&&field.value?'Адрес сервера заполнен. Создай комнату или введи код.':'Вставь HTTPS-адрес сервера. Если страница открыта с самого сервера, адрес подставится автоматически.'))}
function closeOnline(){if(NET.ws||NET.role)disconnectOnline(false);show('menu')}
function lobbyStatus(t){netStatus(t);const el=$('lobbyStatus');if(el)el.textContent=t;const c2=$('netCode2');if(c2&&$('netCode'))c2.textContent=$('netCode').textContent}
function netSocketOpen(c){const ws=c&&(c.ws||c);return !!ws&&ws.readyState===WebSocket.OPEN}
function sendNet(c,msg){const ws=c&&(c.ws||c)||NET.ws;if(!netSocketOpen(ws)||ws.bufferedAmount>45000)return false;try{ws.send(JSON.stringify(msg));return true}catch(e){return false}}
function sendHostBroadcast(msg){return sendNet(NET.ws,msg)}
function lobbyPayload(){const players=[{slot:0,c:S.p[0].c,ch:S.p[0].ch}];(NET.conns||[]).forEach(c=>{const p=S.p[c.slot]||{};players.push({slot:c.slot,c:p.c||0,ch:p.ch||0})});return {type:'lobby',players,mode:S.mode,maps:S.maps,rounds:S.rounds,t3:false,swap:S.swap|0}}
function sendLobby(){if(NET.role!=='host'||!NET.ready)return false;const msg=lobbyPayload();NET.lobby=msg;return sendNet(NET.ws,msg)}
function sendConfig(){if(NET.role!=='guest'||!NET.ws||!NET.ready||NET.started)return false;const s=NET.slot||1,p=S.p[s];if(!p)return false;return sendNet(NET.ws,{type:'config',c:p.c,ch:p.ch})}
function setPC(i,k,v){S.p[i][k]=v;sendConfig();rs()}
function clearReconnectTimer(){if(NET.reconnectTimer){clearTimeout(NET.reconnectTimer);NET.reconnectTimer=null}}
function onGuestData(d){if(!d)return;if(d.type==='welcome'){NET.slot=d.slot||1;lobbyStatus('Вы — игрок '+(NET.slot+1)+'. Настройте персонажа.')}else if(d.type==='lobby'){const previousSuppress=NET.suppressLobby;NET.suppressLobby=true;NET.lobby=d;(d.players||[]).forEach(p=>{if(S.p[p.slot]&&p.slot!==(NET.slot||0)){S.p[p.slot].c=p.c;S.p[p.slot].ch=p.ch}});if(d.mode)S.mode=d.mode;if(d.maps&&d.maps.length)S.maps=d.maps;if(d.rounds)S.rounds=d.rounds;if(typeof d.swap!=='undefined')S.swap=d.swap|0;if(cur==='setup')rs();NET.suppressLobby=previousSuppress}else if(d.type==='start'){NET.started=true;NET.sessionActive=true;NET.connectionLost=false;setNetNotice('',false);show('');syncTouchUi()}else if(d.type==='state')applyNetState(d.state,d.seq)}
function handleServerMessage(d){if(!d||typeof d!=='object')return;
 if(d.type==='error'){
  lobbyStatus(d.message||'Ошибка игрового сервера.');
  if(NET.connectionLost){clearReconnectTimer();NET.manualClose=true;NET.started=false;NET.sessionActive=false;NET.connectionLost=false;setNetNotice('',false);try{if(NET.ws&&NET.ws.readyState<2)NET.ws.close(4002,'Resume failed')}catch(e){}show('online')}
  return
 }
 if(d.type==='room-closed'){
  clearReconnectTimer();NET.roomClosed=true;NET.manualClose=true;NET.ready=false;NET.conns=[];NET.remote={};NET.started=false;NET.sessionActive=false;NET.connectionLost=false;setNetNotice('',false);lobbyStatus(d.message||'Хост закрыл комнату.');show('online');return
 }
 if(d.type==='host-disconnected'){
  NET.hostUnavailable=true;setNetNotice('Хост временно потерял связь. Комната пытается восстановиться.',true);return
 }
 if(d.type==='created'&&NET.role==='host'){
  clearReconnectTimer();NET.ready=true;NET.token=d.token||NET.token;NET.roomCode=d.code;NET.connectionLost=false;NET.hostUnavailable=false;NET.sessionActive=!!(d.started||NET.sessionActive);NET.started=!!d.started;NET.reconnectAttempts=0;NET.lastSeq=0;setNetNotice('',false);
  if($('netCode'))$('netCode').textContent=d.code;
  lobbyStatus(d.resumed?'Связь восстановлена. Комната снова доступна.':'Комната создана: '+d.code+'. Передай код друзьям.');
  if(d.resumed&&d.started)show('');else{show('setup');rs()}
  return
 }
 if(d.type==='welcome'&&NET.role==='guest'){
  clearReconnectTimer();NET.ready=true;NET.slot=d.slot||1;NET.token=d.token||NET.token;NET.roomCode=d.code||NET.roomCode;NET.connectionLost=false;NET.hostUnavailable=false;NET.sessionActive=true;NET.started=!!d.started;NET.reconnectAttempts=0;NET.lastSeq=0;NET.conn=NET.ws;setNetNotice('',false);
  onGuestData({type:'welcome',slot:NET.slot});
  if(!NET.started)sendConfig();
  lobbyStatus(d.resumed?'Связь восстановлена. Ты вернулся в матч.':'Подключено к комнате. Вы — игрок '+(NET.slot+1)+'.');
  if(d.started)show('');else{show('setup');rs()}
  syncTouchUi();return
 }
 if(d.type==='peer-joined'&&NET.role==='host'){
  if(!NET.conns.some(c=>c.slot===d.slot))NET.conns.push({slot:d.slot,ws:NET.ws});
  NET.conns.sort((a,b)=>a.slot-b.slot);sendLobby();lobbyStatus('Подключился игрок '+(d.slot+1)+'. Всего игроков: '+(NET.conns.length+1)+'/3.');if(cur==='online'){show('setup');rs()}return
 }
 if(d.type==='peer-left'&&NET.role==='host'){
  NET.conns=NET.conns.filter(c=>c.slot!==d.slot);delete NET.remote[d.slot];sendLobby();lobbyStatus('Игрок '+(d.slot+1)+' отключился.');if(cur==='setup')rs();return
 }
 if(d.type==='peer-disconnected'){
  lobbyStatus('Игрок '+(d.slot+1)+' потерял связь. Даём ему 45 секунд на возврат.');return
 }
 if(d.type==='lobby'){onGuestData(d);return}
 if(d.type==='start'){NET.started=true;NET.sessionActive=true;NET.connectionLost=false;NET.hostUnavailable=false;onGuestData(d);return}
 if(d.type==='state'){NET.connectionLost=false;NET.hostUnavailable=false;setNetNotice('',false);applyNetState(d.state,d.seq);return}
 if(d.type==='paused'){G.pause=!!d.paused;if(G.pause)show('pause');else if(cur==='pause')show('');return}
 if(d.type==='pong')return
}
function openGameSocket(resume=false){
 if(!NET.role||NET.manualClose)return;
 const wsUrl=NET.serverUrl||getServerUrl();if(!wsUrl)return;
 let ws;try{ws=new WebSocket(wsUrl)}catch(e){lobbyStatus('Не удалось открыть WebSocket. Проверь адрес сервера.');return}
 NET.ws=ws;NET.conn=ws;NET.ready=false;
 ws.onopen=()=>{
  if(NET.ws!==ws)return;
  const message=resume&&NET.token?(NET.role==='host'?{type:'resume',role:'host',code:NET.roomCode,token:NET.token}:{type:'join',code:NET.roomCode,token:NET.token}):(NET.role==='host'?{type:'create'}:{type:'join',code:NET.roomCode});
  try{ws.send(JSON.stringify(message))}catch(e){lobbyStatus('Не удалось отправить запрос серверу.');try{ws.close()}catch(x){}}
  lobbyStatus(resume?'Повторное подключение…':(NET.role==='host'?'Подключаемся к серверу и создаём комнату…':'Подключаемся к серверу и ищем комнату…'))
 };
 ws.onmessage=event=>{if(NET.ws!==ws)return;let data;try{data=JSON.parse(event.data)}catch(e){return}handleServerMessage(data)};
 ws.onerror=()=>{if(NET.ws===ws)lobbyStatus('Проблема сетевого соединения. Пробуем восстановить связь…')};
 ws.onclose=()=>{
  if(NET.ws!==ws)return;
  NET.ws=null;NET.conn=null;NET.ready=false;
  if(NET.manualClose||NET.roomClosed)return;
  if(NET.token&&NET.role&&(NET.sessionActive||NET.started||NET.stateAt>0)){
   NET.connectionLost=true;setNetNotice('Связь потеряна. Восстанавливаем соединение…',true);syncTouchUi();
   const delay=NET.reconnectAttempts<12?Math.min(8000,500*Math.pow(1.55,NET.reconnectAttempts)):15000;NET.reconnectAttempts=Math.min(12,NET.reconnectAttempts+1);clearReconnectTimer();NET.reconnectTimer=setTimeout(()=>openGameSocket(true),delay);if(NET.reconnectAttempts>=12)lobbyStatus('Связь ещё не восстановлена. Продолжаем попытки подключения…')
  }else{
   NET.conns=[];NET.remote={};NET.started=false;NET.sessionActive=false;setNetNotice('',false);
   lobbyStatus('Соединение с сервером потеряно. Проверь ссылку и интернет.');if(cur==='setup')show('online')
  }
 }
}
function connectGameServer(role,code){const url=getServerUrl();if(!url)return;disconnectOnline(false);NET.role=role;NET.roomCode=code||null;NET.serverUrl=url;NET.manualClose=false;NET.roomClosed=false;NET.connectionLost=false;NET.reconnectAttempts=0;fit();openGameSocket(false)}
function hostOnline(){connectGameServer('host')}
function joinOnline(){const code=((($('joinCode')&&$('joinCode').value.trim())||($('joinCode2')&&$('joinCode2').value.trim())||'').toUpperCase().replace(/[^A-Z0-9]/g,''));if(!code){lobbyStatus('Введите код комнаты.');return}if(code.length!==6){lobbyStatus('Код комнаты должен содержать 6 символов.');return}if(!getServerUrl())return;connectGameServer('guest',code)}
function disconnectOnline(update=true){const old=NET;old.manualClose=true;if(old.reconnectTimer)clearTimeout(old.reconnectTimer);old.ready=false;try{if(old.ws&&old.ws.readyState<2)old.ws.close(1000,'Client disconnect')}catch(e){}NET={role:null,ws:null,conn:null,conns:[],slot:0,lastSend:0,lastInput:0,lastStateAt:0,stateAt:0,stateDuration:55,entitySeq:0,remote:{},ready:false,lastMi:-1,lobby:null,roomCode:null,token:null,serverUrl:null,started:false,sessionActive:false,connectionLost:false,manualClose:false,roomClosed:false,reconnectTimer:null,reconnectAttempts:0,lastSeq:0};for(const a of Object.keys(TOUCH))TOUCH[a]=0;if(typeof fit==='function')fit();syncTouchUi();if(update)lobbyStatus('Отключено от игрового сервера.')}
function applyNetState(d,seq=0){if(!d||!d.g)return;if(seq&&seq<=NET.lastSeq)return;if(seq)NET.lastSeq=seq;const now=performance.now(),previous=new Map((ents||[]).map(e=>[e.nid,e]));G=Object.assign({},d.g);if(NET.lastMi!==d.mi){NET.lastMi=d.mi;M=MP[d.mi]||MP[0];mkbg()}else M=MP[d.mi]||M;ents=d.ents||[];for(const e of ents){const old=previous.get(e.nid);e.netFromX=old?(old.netTargetX??old.x):e.x;e.netFromY=old?(old.netTargetY??old.y):e.y;e.netTargetX=e.x;e.netTargetY=e.y}NET.stateDuration=NET.lastStateAt?cl(now-NET.lastStateAt,40,110):50;NET.lastStateAt=now;NET.stateAt=now;NET.sessionActive=true;NET.started=true;G.bo=ents.find(e=>e.B)||null;P=d.P||[];IT=d.IT||[];PT=d.PT||[];TX=d.TX||[];RG=d.RG||[];BM=d.BM||[];ZP=d.ZP||[];TUR=d.TUR||[];WALLS=d.WALLS||[];if(G.end&&!$('end').classList.contains('on'))endMatch();syncTouchUi()}
function netTick(){if(!NET.ready||!NET.ws||NET.ws.readyState!==WebSocket.OPEN)return;const now=performance.now();if(now-NET.lastInput<25||NET.ws.bufferedAmount>30000)return;NET.lastInput=now;const slot=NET.role==='host'?0:(NET.slot||1),player=S.p[slot]||S.p[0],k=player.k;const input={l:!!(K[k.l]||TOUCH.l),r:!!(K[k.r]||TOUCH.r),j:!!(K[k.j]||TOUCH.j),d:!!(K[k.d]||TOUCH.d),s:!!(K[k.s]||TOUCH.s),m:!!(K[k.m]||TOUCH.m)};sendNet(NET.ws,{type:'input',input})}

let er=0,lastDrawAt=0;
function loop(t){requestAnimationFrame(loop);let dt=Math.min(.033,(t-lt)/1000||0);lt=t;
 try{if(NET.role){netTick()}else{if(G.hs>0){G.hs-=dt;dt=0}else if(G.slow>0){G.slow-=dt;dt*=.35}step(dt)}}catch(x){console.error(x);if(++er>3){er=0;try{G.hs=0;G.slow=0;nextRound()}catch(y){startMatch(1)}}}
 const drawInterval=phoneDevice?(NET.role?1000/30:1000/42):1000/60;if(t-lastDrawAt<drawInterval)return;lastDrawAt=t;
 try{draw()}catch(x){console.error(x);cv.width=cv.width;PT=[];TX=[];RG=[];BM=[]}}
function show(id){cur=id;document.querySelectorAll('.sc').forEach(s=>s.classList.toggle('on',s.id==id));syncTouchUi()}
function menu(){if(NET.role)disconnectOnline(false);show('menu');startMatch(1)}
function play(){if(NET.role==='guest'){show('');return}if(NET.role==='host'){if(!NET.ready){lobbyStatus('Сначала дождись подключения к серверу.');return}sendNet(NET.ws,{type:'start',config:currentStartConfig()});lobbyStatus('Запускаем серверный матч…');return}show('');startMatch(0);syncTouchUi()}
function pause(){if(NET.role==='guest'){lobbyStatus('Поставить или снять паузу может хост.');return}if(NET.role==='host'){sendNet(NET.ws,{type:'pause',paused:!G.pause});return}G.pause=!G.pause;show(G.pause?'pause':'')}
function endMatch(){G.end=1;const v=['solo','duel','v12','v22'].includes(G.mode),w=G.sc.indexOf(Math.max(...G.sc));$('et').textContent=v?'ПОБЕДА: '+tn(w):'ИГРА ОКОНЧЕНА';
 $('es').textContent=v?`Счёт ${G.sc.slice(0,G.mode=='duel'&&G.n3?3:2).join(' : ')}`:G.mode=='zomb'?'Пройдено волн: '+(G.wv-1):'Побеждено боссов: '+(G.lv-1);show('end')}
function rebind(i,a){rb=[i,a];cur=='help'?hlp():rs()}
function tg(j){const a=S.maps,i=a.indexOf(j);i<0?a.push(j):a.length>1&&a.splice(i,1);rs()}
let TH=[],hf='menu';
function thumbs(){if(TH.length)return;const m0=M;MP.forEach((m,j)=>{M=m;mkbg();const t=document.createElement('canvas');t.width=320;t.height=180;t.getContext('2d').drawImage(bgc,0,0,320,180);TH[j]=t.toDataURL()});M=m0;mkbg()}
function pv(i){const p=S.p[i],c=document.createElement('canvas'),o=cx;c.width=180;c.height=220;cx=c.getContext('2d');cx.scale(1.9,1.9);try{drawE(mk({pi:i,x:47,y:108,f:i?-1:1,c:COL[p.c],ch:p.ch,wp:['ak','bazo','snip'][i]}))}catch(x){}cx=o;return c.toDataURL()}
function kb(i){const p=S.p[i];return `<div class="ks">${ACT.map(a=>{const on=rb&&rb[0]==i&&rb[1]==a[0];return `<button class="${on?'on':''}" onclick="rebind(${i},'${a[0]}')">${a[1]}<b>${on?'нажми…':kn(p.k[a[0]])}</b></button>`}).join('')}</div>`}
function rs(){thumbs();const online=!!NET.role,guest=NET.role==='guest';
 const pn=(i,ed)=>{const p=S.p[i];return `<div class="pn"><img class="pv" src="${pv(i)}"><div><h3>Игрок ${i+1}${NET.role==='host'&&i===0?' · хост':(guest&&i===(NET.slot||0)?' · вы':'')}</h3>${ed?`<div class="sw">${COL.map((c,j)=>`<i class="${p.c==j?'on':''}" style="background:${c}" onclick="setPC(${i},'c',${j})"></i>`).join('')}</div><div class="row">${CH.map((c,j)=>j===1?'':`<button class="ch s ${p.ch==j?'on':''}" onclick="setPC(${i},'ch',${j})">${c.n}</button>`).join('')}</div>`:`<div class="sw">${COL.map((c,j)=>`<i class="${p.c==j?'on':''}" style="background:${c}"></i>`).join('')}</div><b style="font-family:'Russo One',Impact,sans-serif">${CH[p.ch].n}</b>`}<small>${CH[p.ch].d}</small>${ed?kb(i):''}</div></div>`};
 const edOK=i=>guest?i===(NET.slot||0):i===0;
 const visibleSlots=guest?((NET.lobby&&NET.lobby.players?NET.lobby.players:[{slot:0},{slot:NET.slot||1}]).map(p=>p.slot)):(online?[0,...(NET.conns||[]).map(c=>c.slot)]:[]);const nSlots=visibleSlots.length;
 const lobby=`<h2><b>0</b> Онлайн — до 3 игроков, каждый настраивает своего персонажа</h2><div class="pn" style="display:block">${guest?`<p><b>Вы — Игрок ${(NET.slot||0)+1}</b>. Режим, карты и старт определяет хост.</p>`:`<div class="row"><button class="bt" onclick="hostOnline()">Создать комнату</button><input id="joinCode2" autocomplete="off" placeholder="Код комнаты" style="padding:9px 12px;border:3px solid var(--ink);border-radius:10px;font:inherit;min-width:160px"><button class="bt" onclick="joinOnline()">Подключиться</button><button class="bt" onclick="openOnline()">Сетевой сервер</button></div><p style="margin:8px 0 0">Код комнаты: <b id="netCode2" style="font-size:19px;letter-spacing:1px;overflow-wrap:anywhere">${($('netCode')||{}).textContent||'—'}</b></p>`}<p id="lobbyStatus" style="margin:6px 0 0">${online?(guest?'Подключено к комнате. Ожидайте старта от хоста.':'Подключено игроков: '+(nSlots-1)+' из 2. Настройте персонажей и жмите «В БОЙ!».'):'Создайте комнату и передайте код друзьям — поддерживается до двух подключений (трое вместе с вами).'}</p>${online?`<div class="row" style="margin-top:10px">${[0,1,2].map(i=>visibleSlots.includes(i)?pn(i,edOK(i)):'<div class="pn" style="opacity:.55;align-items:center;justify-content:center;min-height:120px">Слот '+(i+1)+' — ожидание игрока…</div>').join('')}</div>`:''}</div>`;
 const v=['solo','duel','v12','v22'].includes(S.mode);
 const mapSec=guest?`<h2><b>1</b> Карты (выбирает хост): ${S.maps.map(j=>MP[j].n).join(', ')}</h2>`:`<h2><b>1</b> Карты — выбери несколько, они будут меняться случайно</h2><div class="mg">${MP.map((m,j)=>`<div class="mc ${S.maps.includes(j)?'on':''}" onclick="tg(${j})"><img src="${TH[j]}"><span>${m.n}${m.ic?' · скользко':m.gv?' · лёгкая гравитация':''}</span></div>`).join('')}</div>`;
 const modeSec=guest?`<h2><b>2</b> Режим (выбирает хост): ${MD[S.mode]||S.mode}</h2>`:`<h2><b>2</b> Режим</h2><div class="row">${Object.entries(MD).map(([k,n])=>`<button class="ch ${S.mode==k?'on':''}" onclick="S.mode='${k}';rs()">${n}</button>`).join('')}</div>${v?`<div class="row" style="margin-top:12px;align-items:center"><span>Раундов:</span>${[1,3,5,7].map(n=>`<button class="ch s ${S.rounds==n?'on':''}" onclick="S.rounds=${n};rs()">${n}</button>`).join('')}</div>`:''}${S.mode=='v12'?`<div class="row" style="margin-top:12px;align-items:center"><span>Бот помогает:</span>${[0,1].map(i=>`<button class="ch s ${(S.swap|0)==i?'on':''}" onclick="S.swap=${i};rs()">Игроку ${i+1}</button>`).join('')}</div>`:''}${['duel','zomb','boss'].includes(S.mode)?(online?`<small style="display:block;margin-top:12px">Третий персонаж появится только после подключения второго гостя (всего 3 игрока).</small>`:`<div class="row" style="margin-top:12px;align-items:center"><span>Третий игрок:</span><button class="ch s ${S.t3?'on':''}" onclick="S.t3=1;rs()">Вкл</button><button class="ch s ${S.t3?'':'on'}" onclick="S.t3=0;rs()">Выкл</button><small style="margin:0 0 0 6px">1 на 1 на 1; в зомби и боссе третий стоит в центре</small></div>`):''}`;
 $('sb').innerHTML=lobby+mapSec+modeSec+(online?'':`<h2><b>3</b> Классы стикменов и клавиши</h2><div class="pg">${pn(0,true)}${pn(1,true)}${S.t3&&['duel','zomb','boss'].includes(S.mode)?pn(2,true):''}</div>`)+`<div class="bar"><button class="bt" onclick="show('menu')">Назад</button>${guest?'<span style="align-self:center;color:var(--mu)">Ожидайте начала от хоста…</span>':'<button class="bt big" onclick="play()">В БОЙ!</button>'}</div>`;if(NET.role==='host'&&NET.ready&&!NET.suppressLobby)sendLobby();}
function hlp(){if(cur!='help')hf=cur;$('hb').innerHTML=`<h2>Клавиши: нажми на кнопку, потом на нужную клавишу</h2><div class="pg">${[0,1,2].map(i=>`<div class="pn" style="display:block"><h3>Игрок ${i+1}</h3>${kb(i)}</div>`).join('')}</div><h2>Оружие и способности</h2><p>У Вампира способность превращает его в летучую мышь на 3 секунды: он медленно летает и не получает урон, перезарядка 15 секунд. Акробат может отталкиваться от стен и платформ. У Инженера способность ставит турель, у Дуэлянта включает парирование и метки, у Штурмовика создаёт усиленные стены с 50 прочности, а Медик бросает аптечку. Рукопашник использует таран: прямой рывок без прыжков, 20 урона, отталкивание и оглушение противника; перезарядка 17 секунд.</p><small>На телефоне доступны сенсорные кнопки. Для нормального размера арены поверните устройство горизонтально и выберите режим «Соло против бота».</small><h2>Оружие падает с неба — подбирай касанием</h2><small>Редкие предметы выпадают реже: радужная пушка — 3%, аптечка — 10%; миниган выпадает заметно реже бумеранга; Гравитационный коллапс — ровно 1% шанс. Клавиша способности указана в настройках; по умолчанию это G для первого, Shift для второго и U для третьего игрока.</small><div class="wg">${Object.values(WP).map(w=>`<div class="wc"><i class="dt" style="background:${w.c}"></i><b>${w.n}</b><small>${w.d}</small></div>`).join('')}</div><div class="bar"><span></span><button class="bt big" onclick="show('${hf}')">Готово</button></div>`;show('help')}
function rsOld(){const v=['solo','duel','v12','v22'].includes(S.mode),
 pn=i=>{const p=S.p[i];return `<div class="pn"><h3>Игрок ${i+1} · ${i?'стрелки':'WASD'}</h3><div class="sw">${COL.map((c,j)=>`<i class="${p.c==j?'on':''}" style="background:${c}" onclick="S.p[${i}].c=${j};rs()"></i>`).join('')}</div><select onchange="S.p[${i}].ch=+this.value;rs()">${CH.map((c,j)=>`<option value="${j}" ${p.ch==j?'selected':''}>${c.n}</option>`).join('')}</select><small>${CH[p.ch].d}</small><div class="ks">${ACT.map(a=>{const on=rb&&rb[0]==i&&rb[1]==a[0];return `<button class="${on?'on':''}" onclick="rebind(${i},'${a[0]}')">${a[1]}: <b>${on?'нажми…':kn(p.k[a[0]])}</b></button>`}).join('')}</div></div>`};
 $('sb').innerHTML=`<h2>Режим</h2><div class="row">${Object.entries(MD).map(([k,n])=>`<button class="ch ${S.mode==k?'on':''}" onclick="S.mode='${k}';rs()">${n}</button>`).join('')}</div>${v?`<h2>Раундов (выигрывает большинство)</h2><div class="row">${[1,3,5,7].map(n=>`<button class="ch ${S.rounds==n?'on':''}" onclick="S.rounds=${n};rs()">${n}</button>`).join('')}</div>`:''}<h2>Карты: выбери несколько, они сменяются случайно</h2><div class="row">${MP.map((m,j)=>`<button class="ch ${S.maps.includes(j)?'on':''}" onclick="tg(${j})">${m.n}</button>`).join('')}</div><h2>Стикмены</h2><div class="row">${pn(0)}${pn(1)}</div><p class="row"><button class="bt" onclick="show('menu')">Назад</button><button class="bt" onclick="hlp()">Управление</button><button class="bt big" onclick="play()">В БОЙ</button></p>`}
function hlpOld(){const f=cur,kt=i=>ACT.map(a=>`<td>${kn(S.p[i].k[a[0]])}</td>`).join('');
 $('hb').innerHTML=`<h2>Управление</h2><table><tr><td></td>${ACT.map(a=>`<td><b>${a[1]}</b></td>`).join('')}</tr><tr><td>Игрок 1</td>${kt(0)}</tr><tr><td>Игрок 2</td>${kt(1)}</tr></table><small>Клавиши меняются в настройках перед боем. Esc — пауза. Оружие падает с неба — подбери касанием. Пистолет бесконечный.</small><h2>Оружие</h2><table>${Object.values(WP).map(w=>`<tr><td><i class="dt" style="background:${w.c}"></i>${w.n}</td><td>${w.d}</td></tr>`).join('')}</table><h2>Персонажи</h2><table>${CH.filter((c,j)=>j!==1).map(c=>`<tr><td>${c.n}</td><td>${c.d}</td></tr>`).join('')}</table><p><button class="bt" onclick="show('${f}')">Назад</button></p>`;show('help')}
addEventListener('keydown',e=>{if(rb){e.preventDefault();if(e.code!='Escape')S.p[rb[0]].k[rb[1]]=e.code;rb=null;cur=='help'?hlp():rs();return}
 if(!cur&&/^(Arrow|Space)/.test(e.code))e.preventDefault();K[e.code]=1;if(e.code=='Escape'&&(!cur||cur=='pause')&&!G.demo&&!G.end)pause()});
addEventListener('keyup',e=>delete K[e.code]);addEventListener('blur',()=>{K={};for(const a of Object.keys(TOUCH))TOUCH[a]=0});
function isPhoneDevice(){
 const ua=String(navigator.userAgent||'');
 const mobileAgent=!!(navigator.userAgentData&&navigator.userAgentData.mobile)||/iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini/i.test(ua);
 const shortSide=Math.min(Number(screen.width)||innerWidth,Number(screen.height)||innerHeight);
 const coarse=!!((window.matchMedia&&window.matchMedia('(any-pointer: coarse)').matches)||(navigator.maxTouchPoints||0)>0);
 return mobileAgent&&coarse&&shortSide<=950;
}
let phoneDevice=false;
function syncTouchUi(){
 const phone=isPhoneDevice();
 phoneDevice=phone;
 document.documentElement.classList.toggle('phone-device',phone);
 const onlinePlaying=!!(NET&&NET.role&&(NET.started||NET.stateAt>0)&&cur!=='pause'&&cur!=='end');
 const localPlaying=!!(!NET.role&&G&&!G.demo&&!G.end&&!G.pause&&!cur);
 const active=phone&&(onlinePlaying||localPlaying);
 const controls=$('touchControls');
 if(controls){
  controls.classList.toggle('show',active);
  controls.style.visibility=active?'visible':'hidden';
  controls.style.opacity=active?'1':'0';
  controls.setAttribute('aria-hidden',active?'false':'true');
 }
 const hint=$('rotateHint');
 if(hint){
  const showHint=active&&innerWidth<innerHeight;
  hint.classList.toggle('show',showHint);
  hint.style.display=showHint?'flex':'none';
 }
 if(NET&&NET.connectionLost&&active)setNetNotice('СВЯЗЬ ПОТЕРЯНА · ВОССТАНАВЛИВАЕМ ПОДКЛЮЧЕНИЕ',true);
}
const touchHeld=new Map();
const joyBase=$('joyBase'),joyKnob=$('joyKnob');let joyPointer=null;
function joyUpdate(e){const r=joyBase.getBoundingClientRect(),cx0=r.left+r.width/2,cy0=r.top+r.height/2,dx=e.clientX-cx0,dy=e.clientY-cy0,max=r.width*.34,d=Math.hypot(dx,dy),k=d>max?max/d:1,x=dx*k,y=dy*k;joyKnob.style.left=`calc(50% + ${x}px)`;joyKnob.style.top=`calc(50% + ${y}px)`;TOUCH.l=x<-max*.25?1:0;TOUCH.r=x>max*.25?1:0;TOUCH.d=y>max*.38?1:0}
joyBase.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;try{joyBase.setPointerCapture(e.pointerId)}catch(x){}joyUpdate(e)});
joyBase.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)joyUpdate(e)});
function joyRelease(e){if(e.pointerId!==joyPointer)return;joyPointer=null;for(const a of ['l','r','d'])TOUCH[a]=0;joyKnob.style.left='50%';joyKnob.style.top='50%'}
joyBase.addEventListener('pointerup',joyRelease);joyBase.addEventListener('pointercancel',joyRelease);joyBase.addEventListener('lostpointercapture',joyRelease);
for(const b of document.querySelectorAll('[data-act]')){const a=b.dataset.act;b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(x){}touchHeld.set(e.pointerId,a);TOUCH[a]=1});const release=e=>{if(!touchHeld.has(e.pointerId))return;touchHeld.delete(e.pointerId);TOUCH[a]=[...touchHeld.values()].includes(a)?1:0};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release)}
window.addEventListener('pointerup',e=>{if(touchHeld.has(e.pointerId)){const a=touchHeld.get(e.pointerId);touchHeld.delete(e.pointerId);TOUCH[a]=[...touchHeld.values()].includes(a)?1:0}joyRelease(e)},true);
window.addEventListener('pointercancel',e=>{if(touchHeld.has(e.pointerId)){const a=touchHeld.get(e.pointerId);touchHeld.delete(e.pointerId);TOUCH[a]=[...touchHeld.values()].includes(a)?1:0}joyRelease(e)},true);
const touchControlsElement=$('touchControls'),rotateHintElement=$('rotateHint'),netNoticeElement=$('netNotice');if(touchControlsElement)document.body.appendChild(touchControlsElement);if(rotateHintElement)document.body.appendChild(rotateHintElement);if(netNoticeElement)document.body.appendChild(netNoticeElement);addEventListener('orientationchange',()=>setTimeout(syncTouchUi,80));addEventListener('pageshow',syncTouchUi);addEventListener('resize',()=>setTimeout(syncTouchUi,120));if(window.matchMedia){const coarseQuery=matchMedia('(any-pointer: coarse)');coarseQuery.addEventListener?.('change',syncTouchUi)}fit();startMatch(1);show('menu');requestAnimationFrame(loop);
