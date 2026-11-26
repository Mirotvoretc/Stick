try{
 loadS();
 MP.forEach(bigMap);
 fit();
 tcBuild();
 if(IS_TOUCH){
  const mn=document.querySelector('#menu .mn');
  if(mn)mn.insertAdjacentHTML('beforeend','<button class="bt" onclick="show(\'setup\');rs();tcEdit(1)">Настроить сенсор</button><button class="bt" onclick="goFull()">Полный экран</button>')
 }
 addEventListener('orientationchange',()=>setTimeout(fit,250));
 if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(fit,120));
 startMatch(1);
 show('menu');
 requestAnimationFrame(loop);
 window.__SA_BOOTED=true;
 const bootError=document.getElementById('sa-boot-error');
 if(bootError)bootError.remove();
}catch(error){
 console.error('Stick Arena startup failed:',error);
 if(window.__SA_SHOW_BOOT_ERROR)window.__SA_SHOW_BOOT_ERROR(error);
 else throw error;
}
