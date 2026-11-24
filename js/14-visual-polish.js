const oldUpdAnime14=upd;
const ANIME_FX14=[];
function animeSkillColor14(e){if(CH[e.ch]?.vamp)return '#ff4b66';if(CH[e.ch]?.med)return '#79e6a2';if(CH[e.ch]?.engineer)return '#66dfff';if(CH[e.ch]?.duelist)return '#ffd166';if(CH[e.ch]?.slime)return '#69cfff';if(CH[e.ch]?.assault)return '#ffad62';if(CH[e.ch]?.killer)return '#ff6179';if(CH[e.ch]?.acrobat)return '#a8edff';return '#e6eaff'}
function animeSkillGlyph14(e){if(CH[e.ch]?.vamp)return '夜';if(CH[e.ch]?.med)return '癒';if(CH[e.ch]?.engineer)return '機';if(CH[e.ch]?.duelist)return '閃';if(CH[e.ch]?.slime)return '変';if(CH[e.ch]?.assault)return '守';if(CH[e.ch]?.killer)return '斬';if(CH[e.ch]?.acrobat)return '跳';return '覚'}
function animeSkillBurst14(e){if(ANIME_FX14.length>=18)ANIME_FX14.shift();ANIME_FX14.push({x:e.x,y:e.y-e.h*.55,c:animeSkillColor14(e),g:animeSkillGlyph14(e),life:.52,max:.52,seed:R()*6.28});}
upd=function(e,dt){
 const before=e&&{kc:e.kc||0,bat:e.bat||0,mirror:e.mirror||0,boost:e.boost||0,mark:e.mark||0,killerAim:!!e.killerAim};
 const result=oldUpdAnime14(e,dt);
 if(before&&e.pi!=null&&e.hp>0){
  const used=(before.kc<=0&&(e.kc||0)>0)||(!before.bat&&(e.bat||0)>0)||(!before.mirror&&(e.mirror||0)>0)||(!before.boost&&(e.boost||0)>0)||(!before.killerAim&&!!e.killerAim);
  if(used)animeSkillBurst14(e);
 }
 return result;
};
function drawAnimeSkills14(){
 if(!ANIME_FX14.length)return;
 for(let i=ANIME_FX14.length-1;i>=0;i--){
  const f=ANIME_FX14[i];f.life-=1/60;if(f.life<=0){ANIME_FX14.splice(i,1);continue}
  const p=1-f.life/f.max,r=20+p*76,a=(1-p)*.78;
  cx.save();cx.translate(f.x,f.y);cx.globalCompositeOperation='lighter';cx.globalAlpha=a;cx.strokeStyle=f.c;cx.lineWidth=3.5*(1-p)+.7;cx.setLineDash([10,6]);cx.beginPath();cx.arc(0,0,r,f.seed,f.seed+Math.PI*(1.15+p*.65));cx.stroke();cx.setLineDash([]);
  cx.globalAlpha=a*.72;for(let k=0;k<6;k++){const q=f.seed+k*Math.PI/3,inner=r*.48,outer=r+12;cx.beginPath();cx.moveTo(Math.cos(q)*inner,Math.sin(q)*inner);cx.lineTo(Math.cos(q)*outer,Math.sin(q)*outer);cx.stroke()}
  cx.globalAlpha=a;cx.textAlign='center';cx.textBaseline='middle';cx.font=`900 ${Math.max(15,34-p*10)}px system-ui,sans-serif`;cx.lineWidth=3;cx.strokeStyle='#101426';cx.strokeText(f.g,0,-r*.68);cx.fillStyle=f.c;cx.fillText(f.g,0,-r*.68);cx.restore();
 }
}
const oldDrawEventAnime14=drawEvent;
drawEvent=function(){oldDrawEventAnime14();drawAnimeSkills14()};
window.drawAnimeSkills14=drawAnimeSkills14;
window.animeSkillBurst14=animeSkillBurst14;
window.ANIME_FX14=ANIME_FX14;
