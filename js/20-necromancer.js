CH.push({n:'Некромант',hp:285,sp:.94,dm:.92,necromancer:1,d:'285 HP, урон ×0.92. Поднимает костяного стража и скелета-стрелка. За убийства получает души; потратив 3 души, призывает Рыцаря склепа — временного мини-босса с ударной волной. Прислужники живут 13 секунд; базовый лимит — 3.'});

let NECRO_RUN_SOULS=[0,0,0];
const necroBaseMk20=mk;
mk=function(o){const e=necroBaseMk20(o);if(e.ch===14&&e.pi!=null){const slot=e.pi|0;if(slot>=0&&slot<3)e.necroSouls=Math.max(e.necroSouls||0,NECRO_RUN_SOULS[slot]||0)}return e};
function necroStoreSouls(e){if(!e||e.ch!==14||e.pi==null)return;const slot=e.pi|0;if(slot>=0&&slot<3)NECRO_RUN_SOULS[slot]=Math.max(0,Math.min(3,e.necroSouls||0))}
function necroActive(e){return ents.filter(o=>o.minion&&o.hp>0&&o.minionOwner===e)}
function necroSlotBonus(ev){return Math.min(2,Math.max(0,Math.floor((ev&&ev.necroCount)||0)))}
function necroCapacity(e){return 3+necroSlotBonus(e&&e.ev)}
function necroSoulAdd(e,n){if(!e||e.hp<=0&&e.dd<=0)return;const old=e.necroSouls||0;e.necroSouls=Math.min(3,old+Math.max(0,n|0));if(e.necroSouls>old){necroStoreSouls(e);TX.push({x:e.x,y:e.y-e.h-20,t:'ДУША +'+(e.necroSouls-old)+' · '+e.necroSouls+'/3',l:1.05,c:'#c59aff'});fx(e.x,e.y-e.h*.55,8,'#b78aff',190)}}
function necroSpawnUnit(owner,kind,life=13,power=1){
 const ev=owner.ev||{},cfg={guard:{n:'Костяной страж',hp:.17,dm:.52,sp:1,wp:'fist',c:'#c4b7a2',sz:.91},archer:{n:'Скелет-стрелок',hp:.135,dm:.43,sp:.94,wp:'pistol',c:'#bbaed0',sz:.86},hound:{n:'Костяной пёс',hp:.12,dm:.4,sp:1.18,wp:'fist',c:'#c8a9df',sz:.78},knight:{n:'Рыцарь склепа',hp:.58,dm:.62,sp:1.02,wp:'katana',c:'#8d65bd',sz:1.2}}[kind];
 if(!cfg)return null;
 const boss=kind==='knight',hpScale=(boss?(ev.necroBossHp||1):(ev.necroMinionHp||1)),dmScale=(boss?(ev.necroBossDm||1):(ev.necroMinionDm||1)),lifeScale=(boss?(ev.necroBossLife||1):(ev.necroMinionLife||1));
 const hp=Math.max(boss?135:38,Math.round(owner.mh*cfg.hp*hpScale)),m=mk({ch:0,tm:owner.tm,x:cl(owner.x+(R()-.5)*(boss?42:96),30,W-30),y:Math.min(GY,owner.y),f:Math.sign(owner.f||1),c:cfg.c,hp,sz:cfg.sz,dm:cfg.dm*dmScale*power,spm:cfg.sp*(ev.necroMinionSp||1),wp:cfg.wp,am:1e9,ai:'aggressive'});
 m.minion=1;m.minionOwner=owner;m.minionLife=life*lifeScale;m.necroRole=kind;m.minionBoss=boss?1:0;m.necroEv=ev;m.necroPulseCd=boss?3.2:0;m.necroPulseWind=0;ents.push(m);
 fx(m.x,m.y-m.h*.55,boss?34:17,cfg.c,boss?380:240);animeT('ring',m.x,m.y-m.h*.5,boss?'#c99aff':'#b7a0d0',{r:boss?112:62,d:.48});return m
}
function necroDismissOrdinary(e){for(const m of necroActive(e))if(!m.minionBoss){m.hp=0;m.dd=.45;fx(m.x,m.y-m.h*.5,9,'#9d7ac3',150)}}
function necroCast(e,copiedPower){if(!e||e.hp<=0)return false;const ev=e.ev||{},active=necroActive(e),boss=active.some(m=>m.minionBoss),bossCost=Math.max(2,3-Math.floor(ev.necroBossDiscount||0));
 if(!copiedPower&&(e.necroSouls||0)>=bossCost&&!boss){
  necroDismissOrdinary(e);e.necroSouls=Math.max(0,(e.necroSouls||0)-bossCost);necroStoreSouls(e);
  const knight=necroSpawnUnit(e,'knight',17.5,1);if(!knight)return false;e.kc=32*(ev.necroBossCd||1);e.kcMax=e.kc;slimeRecordAbility(e,'necromancer',e.kc);TX.push({x:e.x,y:e.y-e.h-30,t:'ВОССТАВШИЙ РЫЦАРЬ · '+e.necroSouls+'/3 ДУШИ',l:1.7,c:'#d5a8ff'});cutIn('РЫЦАРЬ СКЛЕПА','ТРИ ДУШИ ПРИНЕСЕНЫ В ЖЕРТВУ','#bd8cff');G.sh=Math.max(G.sh,10);return true
 }
 if(boss){TX.push({x:e.x,y:e.y-e.h-18,t:'РЫЦАРЬ СКЛЕПА УЖЕ ПРИЗВАН',l:.9,c:'#c5a4e8'});return false}
 const cap=necroCapacity(e),used=active.length,free=cap-used;if(free<=0){TX.push({x:e.x,y:e.y-e.h-18,t:'ПРИСЛУЖНИКИ УЖЕ СОБРАНЫ',l:.9,c:'#c5a4e8'});return false}
 const types=ev.necroHound?['guard','archer','hound']:['guard','archer'],wanted=Math.min(types.length,free);let made=0;
 for(let i=0;i<wanted;i++){const kind=types[i];if(necroSpawnUnit(e,kind,13,copiedPower||1))made++}
 if(!made)return false;e.kc=18*(ev.necroCd||1);e.kcMax=e.kc;slimeRecordAbility(e,'necromancer',e.kc);TX.push({x:e.x,y:e.y-e.h-25,t:'ПОДНЯТЬ МЁРТВЫХ · '+(used+made)+'/'+cap,l:1.25,c:'#c5a0ed'});fx(e.x,e.y-e.h*.5,25,'#a775d8',300);return true
}

const necroBaseCredOf20=credOf;
credOf=function(s){if(s&&s.minionOwner)return s.minionOwner;return necroBaseCredOf20(s)};
const necroBaseDie20=die;
die=function(o){const source=o&&o.lastHitSource,owner=source&&(source.minionOwner||source.ownerSlime||source),eligible=owner&&owner.ch===14&&owner.tm!==o.tm&&!o.minion&&!o.cl&&!o.souled&&o.hp<=0;let souls=0;if(eligible){const ev=owner.ev||{};if(o.B)souls=2+(ev.necroSoulBonus||0);else if(o.elite||o.mini)souls=1+(ev.necroEliteSoul||0);else souls=1;if(!o.B&&!o.elite&&!o.mini&&ev.necroSoulChance>0&&R()<ev.necroSoulChance)souls++}necroBaseDie20(o);if(eligible&&souls>0)necroSoulAdd(owner,souls)};

const necroBaseBot20=bot;
bot=function(e,dt){necroBaseBot20(e,dt);
 if(e.minionBoss&&e.hp>0){const target=near(e),ev=e.necroEv||{},cool=6*(ev.necroPulseCd||1);e.necroPulseCd=(e.necroPulseCd??3.2)-dt;
  if(e.necroPulseWind>0){e.necroPulseWind-=dt;e.in={};e.vx*=Math.max(0,1-dt*5);if(e.necroPulseWind<=0){e.necroPulseWind=0;const dm=16*(ev.necroPulseDm||1)*(ev.necroBossDm||1);for(const d of[-1,1])hwave(e.x+d*22,e.y-5,d,500,1.15,e.tm,e,dm,'#b98aff');fx(e.x,e.y-e.h*.52,34,'#c69aff',420);animeT('ring',e.x,e.y-10,'#d7b5ff',{r:230,d:.54});G.sh=Math.max(G.sh,6);TX.push({x:e.x,y:e.y-e.h-28,t:'ВОЛНА СКЛЕПА',l:.9,c:'#d6b4ff'})}}
  else if(e.necroPulseCd<=0&&target&&Math.hypot(target.x-e.x,target.y-e.y)<350){e.necroPulseWind=.62;e.necroPulseCd=cool;e.in={};e.vx*=.5;TX.push({x:e.x,y:e.y-e.h-22,t:'ЗАРЯД ДУШ',l:.55,c:'#c89bff'});animeT('ring',e.x,e.y-8,'#b98aff',{r:150,d:.6})}
 }
 if(e.ch===14&&e.pi==null&&e.hp>0&&e.kc<=0){e.necroAIWait=(e.necroAIWait||0)-dt;if(e.necroAIWait<=0){e.necroAIWait=.85;const activeNow=necroActive(e),hasKnight=activeNow.some(m=>m.minionBoss),bossCost=Math.max(2,3-Math.floor((e.ev&&e.ev.necroBossDiscount)||0));if(!hasKnight&&near(e)&&((e.necroSouls||0)>=bossCost||activeNow.length<necroCapacity(e)))e.in.m=1}}
};

const necroBaseDrawKiller20=drawKiller;
drawKiller=function(){necroBaseDrawKiller20();for(const e of ents){if(!e.minion||!e.minionBoss||e.hp<=0)continue;const w=76,x=cl(e.x-w*.5,8,W-w-8),y=Math.max(18,e.y-e.h-30),r=cl(e.hp/e.mh,0,1);cx.save();cx.globalAlpha=.96;rr(x-3,y-17,w+6,16,'#100d1bde',cx,5);cx.textAlign='center';cx.font='9px system-ui,sans-serif';cx.fillStyle='#d8baff';cx.fillText('РЫЦАРЬ СКЛЕПА',e.x,y-6);rr(x,y,w,4,'#3b304d',cx,2);rr(x,y,w*r,4,'#b98aff',cx,2);cx.restore()}}

const necroBaseSlimeAbility20=slimeExecuteClassAbility;
slimeExecuteClassAbility=function(e,id,target,power,aid){if(id==='necromancer'){const m=necroSpawnUnit(e,'guard',9,Math.max(.55,Math.min(1.1,power||1)));if(m){TX.push({x:e.x,y:e.y-e.h-18,t:'СКОПИРОВАН ПРИЗЫВ',l:.9,c:'#9cddff'});return}}return necroBaseSlimeAbility20(e,id,target,power,aid)};

const necroBaseMenu20=menu;
menu=function(){NECRO_RUN_SOULS=[0,0,0];return necroBaseMenu20.apply(this,arguments)};

const necroBaseHlp20=hlp;
hlp=function(){necroBaseHlp20.apply(this,arguments);const box=$('hb');if(box&&!box.innerHTML.includes('Некромант'))box.innerHTML=box.innerHTML.replace('<h2>Новое в арене</h2>','<p><b>Некромант (285 HP):</b> способность призывает костяного стража и скелета-стрелка. Прислужники живут 13 секунд, максимум 3. Их убийства приносят души; за 3 души можно вызвать Рыцаря склепа — временного мини-босса с ударной волной. Души сохраняются между волнами и боссами до выхода в меню.</p><h2>Новое в арене</h2>')};
