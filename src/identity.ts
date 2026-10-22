const savedName=()=>{try{return localStorage.getItem('plotto-nickname')?.trim()||'서연';}catch{return '서연';}};
export function installIdentity(){
 const update=()=>{const name=savedName();const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement?.closest('script,style,textarea'))continue;if(node.textContent?.includes('서연'))node.textContent=node.textContent.split('서연').join(name);}
 for(const el of document.querySelectorAll<HTMLElement>('[aria-label],[title]'))for(const attr of ['aria-label','title']){const v=el.getAttribute(attr);if(v?.includes('서연'))el.setAttribute(attr,v.split('서연').join(name));}
 for(const img of document.querySelectorAll<HTMLImageElement>('button img,.edit img,.back-button img')){const parent=img.closest('button,.edit,.back-button');const label=parent?.getAttribute('aria-label')||'';const cls=parent?.className||'';const type=/뒤로|이전 화면|돌아가기/.test(label)||/back-button/.test(cls)?'back':/수정/.test(label)&&/edit/.test(cls)?'edit':null;if(type&&img.getAttribute('src')!==`/brand/icon-${type}.svg`){img.src=`/brand/icon-${type}.svg`;img.style.objectFit='contain';}}
 };
 const observer=new MutationObserver(()=>{observer.disconnect();update();observer.observe(document.body,{childList:true,subtree:true,characterData:true});});observer.observe(document.body,{childList:true,subtree:true,characterData:true});update();
}

