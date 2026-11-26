const $=id=>document.getElementById(id);const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

document.body.appendChild($('tour')); ['name','projects','done'].forEach(id=>document.body.appendChild($(id))); /* intro layer: full screen, not inside the scaled phone canvas */
function satTop(){let p=document.getElementById('sat-probe');if(!p){p=document.createElement('div');p.id='sat-probe';p.style.cssText='position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;padding-top:env(safe-area-inset-top,0px)';document.body.appendChild(p)}return parseFloat(getComputedStyle(p).paddingTop)||0}
function fit(){const H=(navigator.standalone||matchMedia('(display-mode: standalone)').matches)?Math.max(innerHeight,screen.height):innerHeight;/* fill the real screen: width fits 402 design px, height follows the device */const s=innerWidth<700?innerWidth/402:Math.min(innerWidth/402,H/874);const T=satTop();$('canvas').style.top=T+'px';$('canvas').style.height=(H-T)/s+'px';$('canvas').style.transform=`scale(${s})`;$('canvas').style.left=(innerWidth-402*s)/2+'px';}let fitQ=0;addEventListener('resize',()=>{if(fitQ)return;fitQ=requestAnimationFrame(()=>{fitQ=0;fit();});});fit();document.body.dataset.page='launcher';
let current='launcher',timer,tourReady=false,splashElapsed=false,preloaded=false,assetsReady=false,iframeReady=false;
/* ONB_FILES: every onboarding file is fetched BEFORE the tour is shown, so nothing loads while the visitor looks at it */
const ONB_FILES=["/onboarding/assets/01_card_color1.png", "/onboarding/assets/01_card_color2.png", "/onboarding/assets/01_card_gray.png", "/onboarding/assets/01_mascot.png", "/onboarding/assets/01_ring.png", "/onboarding/assets/02_card_back.png", "/onboarding/assets/02_card_back_canvas.png", "/onboarding/assets/02_card_front.png", "/onboarding/assets/02_card_front_canvas.png", "/onboarding/assets/02_card_middle.png", "/onboarding/assets/02_card_middle_canvas.png", "/onboarding/assets/02_decorations.png", "/onboarding/assets/02_decorations_canvas.png", "/onboarding/assets/02_mascot.png", "/onboarding/assets/02_mascot_canvas.png", "/onboarding/assets/02_preview_transparency.png", "/onboarding/assets/02_preview_white.png", "/onboarding/assets/02_wand.png", "/onboarding/assets/02_wand_canvas.png", "/onboarding/assets/03_connection_lines.png", "/onboarding/assets/03_connection_lines_canvas.png", "/onboarding/assets/03_mascot.png", "/onboarding/assets/03_mascot_canvas.png", "/onboarding/assets/03_preview_transparency.png", "/onboarding/assets/03_preview_white.png", "/onboarding/assets/03_profile_left.png", "/onboarding/assets/03_profile_left_canvas.png", "/onboarding/assets/03_profile_right.png", "/onboarding/assets/03_profile_right_canvas.png", "/onboarding/assets/03_session_card.png", "/onboarding/assets/03_session_card_canvas.png", "/onboarding/assets/bg.png", "/onboarding/assets/build/01_card_color1_t.png", "/onboarding/assets/build/01_card_color2_t.png", "/onboarding/assets/build/01_card_gray_t.png", "/onboarding/assets/build/01_card_violet_t.png", "/onboarding/assets/build/01_eye_0.png", "/onboarding/assets/build/01_eye_1.png", "/onboarding/assets/build/01_mascot_base.png", "/onboarding/assets/build/02_arrow.png", "/onboarding/assets/build/02_card_base.png", "/onboarding/assets/build/02_eye_0.png", "/onboarding/assets/build/02_eye_1.png", "/onboarding/assets/build/02_mascot_base.png", "/onboarding/assets/build/02_panel_blue.png", "/onboarding/assets/build/02_panel_lavender.png", "/onboarding/assets/build/03_profile_left_clean.png", "/onboarding/assets/build/03_profile_right_clean.png", "/onboarding/assets/build/03_session_card_clean.png", "/onboarding/assets/build/03_static.png", "/onboarding/assets/build/meta.js", "/onboarding/assets/build/meta.json", "/onboarding/index.html", "/onboarding/korean.css", "/onboarding/launch.css", "/onboarding/launch.html", "/onboarding/launch.js", "/onboarding/onboarding.css", "/onboarding/onboarding.js", "/onboarding/tools/prep_assets.py", "/onboarding/tools/render.py", "/onboarding/ui/app-icon.png", "/onboarding/ui/character.png", "/onboarding/ui/home.png", "/onboarding/ui/levels.svg", "/onboarding/ui/logo-black.svg", "/onboarding/ui/logo-gray.svg", "/onboarding/ui/logo-small-blue.svg", "/onboarding/ui/logo.svg", "/onboarding/ui/mask.png", "/onboarding/ui/messages.png", "/onboarding/ui/music.png", "/onboarding/ui/phone.png", "/onboarding/ui/safari.png", "/onboarding/ui/settings.png", "/onboarding/ui/splash-body.png", "/onboarding/ui/splash-tail-back.png", "/onboarding/ui/splash-tail-front.png", "/onboarding/ui/splash.png", "/onboarding/ui/wallpaper.png"];
(function(){
  var fin=false,total=ONB_FILES.length,done=0,list=ONB_FILES.slice(),bar=null;
  function setBar(){}
  function end(){if(fin)return;fin=true;assetsReady=true;enterTour();}
  /* the splash waits for all onboarding files; safety cap 15 s so a bad network cannot trap the visitor */
  setTimeout(end,15000);
  var i=0;
  function next(){if(fin)return;if(i>=list.length){return;}var f=list[i++];fetch(f,{cache:'force-cache'}).then(function(r){return r.arrayBuffer();}).catch(function(){}).then(function(){done++;setBar();if(done>=total)end();else next();});}
  function start(){for(var k=0;k<6;k++)next();}
  total=list.length;setBar();start();
})();
function enterTour(){if(current==='splash'&&tourReady&&splashElapsed&&assetsReady){show('tour');$('tour').contentWindow.postMessage({type:'plotto:start'},location.origin);}}
function show(id){clearTimeout(timer);$(current).getAnimations().forEach(a=>a.cancel());$(current).hidden=true;$(id).getAnimations().forEach(a=>a.cancel());$(id).hidden=false;current=id;document.body.dataset.page=id;try{sessionStorage.setItem('plotto-launch-page',id);}catch(e){}if(!reduced)$(id).animate([{opacity:0},{opacity:1}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});}
$('open').onclick=()=>{if(current!=='launcher')return;show('splash');splashElapsed=false;if(!preloaded){tourReady=false;$('tour').src='index.html';}timer=setTimeout(()=>{splashElapsed=true;enterTour();},reduced?300:2400);};
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('tour').contentWindow)return;if(e.data?.type==='plotto:ready'){tourReady=true;enterTour();}if(e.data?.type==='plotto:name'){show('name');}});
$('name-back').onclick=()=>show('tour');$('nickname').oninput=()=>{$('name-next').disabled=!$('nickname').value.trim();};
$('name-form').onsubmit=e=>{e.preventDefault();const name=$('nickname').value.trim();if(!name)return;try{localStorage.setItem('plotto-nickname',name);}catch{}document.getElementById("done-name").textContent=name;$('projects-name').textContent=name;show('projects');};
$('projects-next').onclick=()=>{try{localStorage.setItem('plotto-projects',JSON.stringify([...document.querySelectorAll('.project-choice[aria-pressed="true"]')].map(b=>b.dataset.name)));}catch{}show('done');if(reduced){$('spin').hidden=true;$('spin-fallback').hidden=false;$('spin-fallback').src='spin/spin.html?alpha&record';$('spin-fallback').onload=()=>{const w=$('spin-fallback').contentWindow;w.PlottoSpin.ready.then(()=>w.PlottoSpin.renderAt(3));};}else { const v=$('spin'); if (v.play) v.play().catch(()=>{$('spin').hidden=true;$('spin-fallback').hidden=false;$('spin-fallback').src='spin/spin.html?alpha';}); }};
$('start').onclick=()=>{
  /* onboarding is finished: remember the app route first, so if iPhone reloads the page during the switch it opens the app home, not the first onboarding screen */
  const route='flow=briefing&entry=';
  try{sessionStorage.setItem('plotto-route',route);}catch(e){}
  try{if(parent!==window)parent.history.replaceState(null,'',parent.location.pathname+parent.location.search+'#'+route);}catch(e){}
  /* free memory before the app loads: stop the tour animation and the big spin animation */
  try{$('tour').src='about:blank';}catch(e){}
  try{const sp=$('spin');if(sp){if(sp.pause)sp.pause();sp.removeAttribute('src');}}catch(e){}
  location.replace('../mobile.html?flow=briefing');
};



const projects=[['마케팅 프로젝트',3,'2026.01.01'],['청년 도움 프로젝트',6,'2025.02.17'],['자원순환프로젝트',11,'2026.05.24'],['아동자립캠프',5,'2026.07.14'],['한국어 교육 봉사',2,'2025.01.01'],['바롬프로젝트',6,'2025.07.06']];
projects.forEach(([name,count,date],i)=>{const b=document.createElement('button');b.type='button';b.className='project-choice';b.dataset.name=name;b.setAttribute('aria-pressed',String(i<4));const title=document.createElement('strong');title.textContent=name;const detail=document.createElement('span');detail.textContent=`인원: ${count}명 | 시작일: ${date}`;b.append(title,detail);b.onclick=()=>{b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));$('projects-next').disabled=!document.querySelector('.project-choice[aria-pressed="true"]');};$('project-list').append(b);});
$('projects-back').onclick=()=>show('name');

/* iPhone: WebM with transparency shows a black box, so use the transparent animated PNG there */
if (/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)) {
  const v=document.getElementById('spin'); const im=document.createElement('img'); im.id='spin'; im.alt=''; if (v) v.replaceWith(im); /* decode the big animation only once the done page is shown (iOS memory) */ const loadSpin=()=>{ if(document.body.dataset.page==='done'&&!im.src){im.src='spin.png';} }; new MutationObserver(loadSpin).observe(document.body,{attributes:true,attributeFilter:['data-page']}); loadSpin();
}
/* Resume on the name or project step after a reload instead of restarting the splash. */
/* no resume: always start from the first screen */try{sessionStorage.removeItem('plotto-launch-page');sessionStorage.removeItem('plotto-tour-step');localStorage.removeItem('plotto-ss-plotto-launch-page');localStorage.removeItem('plotto-ss-plotto-tour-step');}catch(e){}
/* no fake iPhone home screen: go straight into the app splash */
if(current==='launcher'){try{$('open').click();}catch(e){}}

/* Warm the browser cache for the home screen while the visitor is still on onboarding (no decoding, so no extra memory). */
(function(){
  var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var files=['/assets/mobile-FASNG4QK-r3.js','/assets/c-A7G4KRAT.js','/assets/c-23GKFKRE-r3.js','/assets/c-7VYKZJCW.js','/assets/briefing-BMr55n-q.css','/assets/mobile-FEwyttW3.css','/assets/c-2GCOA6CK.js','/assets/c-ZLHLAVS7.js','/assets/c-WEHOAYWQ.js','/assets/c-TEWZAEPA.js','/assets/jsx-runtime-B7w6RmXF.js','/responsive.css',ios?'/assets/briefing/home-walk.png':'/assets/briefing/home-walk.webm'];
  var i=0;
  function next(){ if(i>=files.length) return; var f=files[i++]; fetch(f,{cache:'force-cache'}).then(function(r){return r.arrayBuffer();}).catch(function(){}).then(next); }
  /* only these few files: downloading every file of the prototype (890 files, ~187 MB) during onboarding used so much memory
     that iPhone closed and reloaded the page, which sent people back to the first onboarding screen */
  function start(){ setTimeout(function(){ next(); next(); },1200); }
  if(document.readyState==='complete') start(); else addEventListener('load',start);
})();

/* Diagnostics: why did the launcher come back? Events are kept in localStorage; tap the Search pill 5 times on the launcher to read them. */
(function(){
  var K='plotto-trace';
  function get(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}}
  function log(m){try{var a=get();a.push(new Date().toTimeString().slice(0,8)+' '+m);localStorage.setItem(K,JSON.stringify(a.slice(-40)))}catch(e){}}
  var nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
  log('LOAD launch type='+(nav&&nav.type)+' discarded='+(document.wasDiscarded||false)+' page='+(sessionStorage.getItem('plotto-launch-page')||'-')+' step='+(sessionStorage.getItem('plotto-tour-step')||'-'));
  document.addEventListener('visibilitychange',function(){log('visibility '+document.visibilityState)});
  addEventListener('pagehide',function(e){log('pagehide persisted='+e.persisted)});
  addEventListener('pageshow',function(e){log('pageshow persisted='+e.persisted)});
  addEventListener('message',function(e){if(e.data&&e.data.type)log('msg '+e.data.type)});
  var s=window.show; if(typeof s==='function'){window.show=function(id){log('show '+id);return s.apply(this,arguments)}}
  var n=0,t0=0;
  document.addEventListener('click',function(e){
    var el=document.querySelector('.search'); if(!el||!el.contains(e.target))return;
    var now=Date.now(); n=now-t0<1500?n+1:1; t0=now;
    if(n>=5){n=0;var d=document.createElement('pre');d.style.cssText='position:fixed;inset:0;z-index:9999;margin:0;padding:50px 12px 12px;background:#000d;color:#9f9;font:11px/1.4 monospace;white-space:pre-wrap;overflow:auto';d.textContent=get().join('\n');d.onclick=function(){d.remove()};document.body.appendChild(d)}
  });
})();
