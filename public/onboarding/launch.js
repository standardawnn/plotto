const $=id=>document.getElementById(id);const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

document.body.appendChild($('tour')); ['consent','login','signup','name','source','projects','done'].forEach(id=>document.body.appendChild($(id))); /* intro layer: full screen, not inside the scaled phone canvas */
function fit(){/* fill the real screen: width fits 402 design px, height follows the device */const s=innerWidth<700?innerWidth/402:Math.min(innerWidth/402,innerHeight/874);$('canvas').style.height=innerHeight/s+'px';$('canvas').style.transform=`scale(${s})`;$('canvas').style.left=(innerWidth-402*s)/2+'px';}addEventListener('resize',fit);fit();document.body.dataset.page='launcher';
let current='launcher',timer,tourReady=false,splashElapsed=false;
function enterTour(){if(current==='splash'&&tourReady&&splashElapsed){show('tour');$('tour').contentWindow.postMessage({type:'plotto:start'},location.origin);}}
function show(id){clearTimeout(timer);$(current).getAnimations().forEach(a=>a.cancel());$(current).hidden=true;$(id).getAnimations().forEach(a=>a.cancel());$(id).hidden=false;current=id;document.body.dataset.page=id;try{sessionStorage.setItem('plotto-launch-page',id);}catch(e){}if(!reduced)$(id).animate([{opacity:0},{opacity:1}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});}
$('open').onclick=()=>{if(current!=='launcher')return;show('splash');tourReady=false;splashElapsed=false;$('tour').src='index.html';timer=setTimeout(()=>{splashElapsed=true;enterTour();},reduced?300:2400);};
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('tour').contentWindow)return;if(e.data?.type==='plotto:ready'){tourReady=true;enterTour();}if(e.data?.type==='plotto:name'){show('consent');}if(e.data?.type==='plotto:launcher')show('launcher');});
$('name-back').onclick=()=>show('login');$('nickname').oninput=()=>{$('name-next').disabled=!$('nickname').value.trim();};
$('name-form').onsubmit=e=>{e.preventDefault();const name=$('nickname').value.trim();if(!name)return;try{localStorage.setItem('plotto-nickname',name);}catch{}document.getElementById("done-name").textContent=name;$('projects').querySelector('h1').innerHTML='<span id="projects-name"></span>님을 위한<br>예시 프로젝트를 준비했어요.';$('projects-name').textContent=name;show('source');};
$('projects-next').onclick=()=>{try{localStorage.setItem('plotto-projects',JSON.stringify([...document.querySelectorAll('.project-choice[aria-pressed="true"]')].map(b=>b.dataset.name)));}catch{}show('done');if(reduced){$('spin').hidden=true;$('spin-fallback').hidden=false;$('spin-fallback').src='spin/spin.html?alpha&record';$('spin-fallback').onload=()=>{const w=$('spin-fallback').contentWindow;w.PlottoSpin.ready.then(()=>w.PlottoSpin.renderAt(3));};}else { const v=$('spin'); if (v.play) v.play().catch(()=>{$('spin').hidden=true;$('spin-fallback').hidden=false;$('spin-fallback').src='spin/spin.html?alpha';}); }};
$('start').onclick=()=>location.replace('../mobile.html?flow=briefing');



const projects=[['마케팅 프로젝트',3,'2026.01.01'],['청년 도움 프로젝트',6,'2025.02.17'],['자원순환프로젝트',11,'2026.05.24'],['아동자립캠프',5,'2026.07.14'],['한국어 교육 봉사',2,'2025.01.01'],['바롬프로젝트',6,'2025.07.06']];
projects.forEach(([name,count,date],i)=>{const b=document.createElement('button');b.type='button';b.className='project-choice';b.dataset.name=name;b.setAttribute('aria-pressed',String(i<4));const title=document.createElement('strong');title.textContent=name;const detail=document.createElement('span');detail.textContent=`인원: ${count}명 | 시작일: ${date}`;b.append(title,detail);b.onclick=()=>{b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));$('projects-next').disabled=!document.querySelector('.project-choice[aria-pressed="true"]');};$('project-list').append(b);});
$('projects-back').setAttribute('aria-label','프로젝트 출처 선택으로 돌아가기');
$('projects-back').onclick=()=>show('source');

/* iPhone: WebM with transparency shows a black box, so use the transparent animated PNG there */
if (/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)) {
  const v=document.getElementById('spin'); const im=document.createElement('img'); im.id='spin'; im.alt=''; im.src='spin.png'; if (v) v.replaceWith(im);
}
/* Resume on the name or project step after a reload instead of restarting the splash. */
try{const savedPage=sessionStorage.getItem('plotto-launch-page');if(savedPage==='name'||savedPage==='projects')show(savedPage);}catch(e){}

/* Warm the browser cache for the home screen while the visitor is still on onboarding (no decoding, so no extra memory). */
(function(){
  var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var files=['/assets/mobile-FASNG4QK.js','/assets/c-A7G4KRAT.js','/assets/c-23GKFKRE.js','/assets/c-7VYKZJCW.js','/assets/briefing-BMr55n-q.css','/assets/mobile-FEwyttW3.css','/assets/c-2GCOA6CK.js','/assets/c-ZLHLAVS7.js','/assets/c-WEHOAYWQ.js','/assets/c-TEWZAEPA.js','/assets/jsx-runtime-B7w6RmXF.js','/responsive.css',ios?'/assets/briefing/home-walk.png':'/assets/briefing/home-walk.webm'];
  var i=0;
  function next(){ if(i>=files.length) return; var f=files[i++]; fetch(f,{cache:'force-cache'}).then(function(r){return r.arrayBuffer();}).catch(function(){}).then(next); }
  function start(){ setTimeout(function(){ next(); next(); },1200); }
  if(document.readyState==='complete') start(); else addEventListener('load',start);
})();
