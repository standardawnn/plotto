export function installCarousels(){
 let active:HTMLElement|null=null,startX=0,startY=0,startScroll=0,dragged=false,suppress=false;
 const find=(target:EventTarget|null)=>{let el=target instanceof Element?target:null;while(el){if(el instanceof HTMLElement&&el.scrollWidth>el.clientWidth+4&&/auto|scroll/.test(getComputedStyle(el).overflowX))return el;el=el.parentElement;}return null;};
 document.addEventListener('pointerdown',e=>{if(e.button!==0)return;active=find(e.target);if(!active)return;startX=e.clientX;startY=e.clientY;startScroll=active.scrollLeft;dragged=false;suppress=false;},true);
 document.addEventListener('pointermove',e=>{if(!active||e.pointerType==='touch')return;const dx=e.clientX-startX;if(!dragged&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(e.clientY-startY)){dragged=true;active.style.cursor='grabbing';}if(dragged){e.preventDefault();active.scrollLeft=startScroll-dx;}},{capture:true,passive:false});
 const end=()=>{if(!active)return;suppress=dragged;active.style.cursor='';active=null;};document.addEventListener('pointerup',end,true);document.addEventListener('pointercancel',end,true);
 document.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false;}},true);
 document.addEventListener('dragstart',e=>{if(find(e.target))e.preventDefault();},true);
 document.addEventListener('wheel',e=>{const el=find(e.target);if(!el||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const before=el.scrollLeft;el.scrollLeft+=e.deltaY;if(el.scrollLeft!==before)e.preventDefault();},{passive:false});
}
