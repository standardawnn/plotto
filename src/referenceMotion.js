const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)); const lerp=(a,b,t)=>a+(b-a)*t; const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)}; const DEG=Math.PI/180; const DPR=()=>Math.min(devicePixelRatio||1,2); const A=f=>'/assets/reference-motion/'+f; const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.decoding='async';i.onload=()=>res(i);i.onerror=rej;i.src=src;});}

class Warp{
  constructor(canvas,img,natW,natH,scale,ox,oy,margin,cols,rows){
    this.c=canvas;this.natW=natW;this.natH=natH;this.s=scale;this.m=margin;
    this.cw=natW*scale+2*margin;this.ch=natH*scale+2*margin;
    canvas.style.left=(ox-margin)+'px';canvas.style.top=(oy-margin)+'px';
    canvas.style.width=this.cw+'px';canvas.style.height=this.ch+'px';
    const d=DPR();canvas.width=Math.round(this.cw*d);canvas.height=Math.round(this.ch*d);
    const gl=this.gl=canvas.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:true});
    const vs=`attribute vec2 p;attribute vec2 uv;varying vec2 v;void main(){v=uv;gl_Position=vec4(p,0.,1.);}`;
    const fs=`precision mediump float;varying vec2 v;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,v);}`;
    const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
    this.cols=cols;this.rows=rows;const n=(cols+1)*(rows+1);
    this.rest=new Float32Array(n*2);const uv=new Float32Array(n*2);
    for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const k=j*(cols+1)+i;
      this.rest[2*k]=i/cols*natW;this.rest[2*k+1]=j/rows*natH;uv[2*k]=i/cols;uv[2*k+1]=j/rows;}
    const idx=[];for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+1,c=a+cols+1,dd=c+1;idx.push(a,b,c,b,dd,c);}
    this.nIdx=idx.length;
    this.pos=new Float32Array(n*2);
    this.pb=gl.createBuffer();
    const ub=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,ub);gl.bufferData(gl.ARRAY_BUFFER,uv,gl.STATIC_DRAW);
    const ul=gl.getAttribLocation(pr,'uv');gl.enableVertexAttribArray(ul);gl.vertexAttribPointer(ul,2,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.pb);gl.bufferData(gl.ARRAY_BUFFER,this.pos,gl.DYNAMIC_DRAW);
    this.pl=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(this.pl);gl.vertexAttribPointer(this.pl,2,gl.FLOAT,false,0,0);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);
    const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    const pot=v=>(v&(v-1))===0;
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  draw(deform){
    const {gl,rest,pos,s,m,cw,ch}=this,n=rest.length/2,out=[0,0];
    for(let k=0;k<n;k++){deform(rest[2*k],rest[2*k+1],out);
      pos[2*k]=((out[0]*s+m)/cw)*2-1;pos[2*k+1]=1-((out[1]*s+m)/ch)*2;}
    gl.bindBuffer(gl.ARRAY_BUFFER,this.pb);gl.bufferSubData(gl.ARRAY_BUFFER,0,pos);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,this.nIdx,gl.UNSIGNED_SHORT,0);
  }
}
const rot=(x,y,cx,cy,a)=>{const c=Math.cos(a),s=Math.sin(a),dx=x-cx,dy=y-cy;return [cx+dx*c-dy*s,cy+dx*s+dy*c];};
function segDist(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-ax-t*dx,y-ay-t*dy);}


export async function mountTyping(canvas){
const Type={warp:null,taps:[],next:0,rng:null,
  async init(){
    const img=await loadImg(A('char_laptop.webp'));
    this.warp=new Warp(canvas,img,1151,919,0.118,253,146,12,44,36);
    let seed=7;this.rng=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  },
  schedule(t){ // keep a rolling list of taps with human-like bursts and pauses
    while(this.next<t+3){
      const r=this.rng;
      const burst=3+Math.floor(r()*6);
      let tt=this.next;
      for(let i=0;i<burst;i++){
        this.taps.push({t:tt,amp:7+r()*6,dur:0.15+r()*0.05,x:(r()-0.5)*16});
        tt+=0.13+r()*0.12+(r()<0.15?0.18:0);
      }
      this.next=tt+(r()<0.25?1.3+r()*0.9:0.35+r()*0.55); // occasional longer "reading" pause
    }
    while(this.taps.length&&this.taps[0].t<t-2)this.taps.shift();
  },
  state(t){
    let lift=0,press=0,x=0,xw=0;
    for(const k of this.taps){
      const u=(t-k.t)/k.dur;
      if(u>-1.5&&u<2.5){const w=Math.exp(-((t-k.t-k.dur*.5)**2)/(2*0.12*0.12));x+=k.x*w;xw+=w;}
      if(u<0||u>1)continue;
      // quick rise, soft press-down: hand stays close to the keys
      const up=u<0.42?Math.sin(u/0.42*Math.PI/2):Math.cos((u-0.42)/0.58*Math.PI/2);
      lift=Math.max(lift,k.amp*Math.pow(Math.max(up,0),1.4));
      if(u>0.7)press=Math.max(press,Math.sin((u-0.7)/0.3*Math.PI));
    }
    return {lift,press,x:xw>0.05?x/xw:x};
  },
  frame(t){
    if(!this.warp)return;
    this.schedule(t);
    let {lift,press,x}=reduceMotion?{lift:0,press:0,x:0}:this.state(t);
    // slow wander of the hand across the keyboard, very small
    x+=Math.sin(t*0.6)*3;
    const breath=reduceMotion?0:Math.sin(t*2*Math.PI/4.2)*0.003;
    const SH=[905,742];
    const lidPoly=[[24,540],[478,548],[566,835],[566,880],[96,880]];
    const inLid=(x0,y0)=>{let c=false;for(let i=0,j=lidPoly.length-1;i<lidPoly.length;j=i++){const[a,b]=lidPoly[i],[cX,dY]=lidPoly[j];
      if(((b>y0)!==(dY>y0))&&(x0<(cX-a)*(y0-b)/(dY-b)+a))c=!c;}return c;};
    const nod=(press*0.9+lift*0.05)*DEG*0.35;
    this.warp.draw((px,py,o)=>{
      // hand / forearm: weight 1 at the paw, 0 at the shoulder
      const ex=(px-752)/158, ey=(py-768)/92, er=Math.sqrt(ex*ex+ey*ey);
      let wh=(1-smooth(0.92,1.18,er))*(1-smooth(800,912,px));
      wh*=1-smooth(842,858,py)*0.85; // keep the keyboard edge under the paw still
      let X=px+x*wh, Y=py-lift*wh+press*1.6*wh;
      // tiny body response (head dips on key press); laptop stays still
      const lid=inLid(px,py)?1:0;
      const wb=(1-lid)*(1-smooth(640,760,py));
      const r=rot(X,Y,640,760,nod*wb);
      X=r[0];Y=r[1]+press*1.2*wb;
      o[0]=X;o[1]=880+(Y-880)*(1-breath*(1-lid));
    });
  }
};


await Type.init();let raf=0,stopped=false;const start=performance.now();const tick=now=>{if(stopped)return;Type.frame((now-start)/1000);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return ()=>{stopped=true;cancelAnimationFrame(raf);Type.warp?.gl.getExtension('WEBGL_lose_context')?.loseContext()};}
const RIG={
  place:{s:0.12596,x:243.91,y:372.09},       // same placement as the character in the provided screens
  S:[600,815],                               // shoulder pivot (hidden inside the torso)
  F:[665,1150],                              // standing foot — body balance pivot
  O0:[460,772],U0:-200,V0:-70,uc:-20,handW:181,handH:141,
  G0:[333,715],star0:[105,612],Gl:[-138.1159,-17.3782],
  wandBox:[50,556,290,174],bodyBox:[372,99,850,1065],
  // keys at a=-1 (아래), 0 (중간), +1 (위): grip distance from shoulder, grip elevation, wand elevation (deg)
  keys:{dist:[285.1,285.1,422.0],eG:[-13.8,20.53,49.4],eW:[-27.0,24.31,49.3]},
  lean:0.9                                   // body lean (deg) at a=±1 — counterbalance on one foot
};
function quad3(v,a){ // smooth quadratic through (-1,v0),(0,v1),(1,v2)
  const [v0,v1,v2]=v;return v1+a*(v2-v0)/2+a*a*((v2+v0)/2-v1);}


export async function mountWand(canvas,getProgress){const List={  armParam(s){
    const a=s/1.5-1;                         // s∈[0,3] (Before…Extra) → a∈[-1,1]
    return clamp(a,-1.12,1.12);              // rubber-band overscroll keeps following a little
  },
  pose(a){
    const k=RIG.keys,ac=clamp(a,-1,1),ex=a-ac;
    const dist=k.dist[1]+Math.max(ac,0)**2*(k.dist[2]-k.dist[1])+ex*(ac>0?137:0); // never shorter than the approved length
    const eG=(quad3(k.eG,ac)+ex*32)*DEG, eW=(quad3(k.eW,ac)+ex*40)*DEG;
    const S=RIG.S,G=[S[0]-dist*Math.cos(eG),S[1]-dist*Math.sin(eG)];
    const D=[G[0]-S[0],G[1]-S[1]],Dl=Math.hypot(D[0],D[1]),vG=RIG.Gl[1],uG=RIG.Gl[0];
    const kk=Math.sqrt(Math.max(Dl*Dl-vG*vG,1));
    const psi=Math.atan2(D[1],D[0])-Math.atan2(vG,-kk);
    const uS=kk+uG,O=[S[0]-uS*Math.cos(psi),S[1]-uS*Math.sin(psi)];
    const thN=Math.atan2(RIG.star0[1]-RIG.G0[1],RIG.star0[0]-RIG.G0[0]);
    const thW=Math.atan2(-Math.sin(eW),-Math.cos(eW));
    const lean=RIG.lean*a*DEG;
    const st=rot(G[0]+(RIG.star0[0]-RIG.G0[0]),G[1]+(RIG.star0[1]-RIG.G0[1]),G[0],G[1],thW-thN);
    return {G,O,psi,uS,thW,thN,lean,star:st,eW};
  },
  drawWand(t,dt){
    if(!this.ready)return;
    const ctx=this.ctx,d=DPR(),R=RIG,P=R.place;
    const a=this.armParam(this.s),p=this.pose(a);this.lastPose=p;this.lastA=a;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,this.cv.width,this.cv.height);
    // logical -> canvas, then pose px -> logical
    ctx.setTransform(d*P.s,0,0,d*P.s,d*(P.x-this.box[0]),d*(P.y-this.box[1]));
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    this.drawRig(ctx,p);
    const sp=Math.abs(this.v)+(this.dragging?Math.abs(this.dragV||0):0);
    this.drawSpark(ctx,p,sp,dt);
  },
  drawRig(ctx,p){
    const R=RIG;
    // body balance: lean around the standing foot (everything below is attached to it)
    ctx.translate(R.F[0],R.F[1]);ctx.rotate(p.lean);ctx.translate(-R.F[0],-R.F[1]);
    // arm: sleeve (cross-section of the real arm, stretched along its axis) + hand
    ctx.save();ctx.translate(p.O[0],p.O[1]);ctx.rotate(p.psi);
    ctx.drawImage(this.strip,0,0,1,R.handH,R.uc-0.5,R.V0,p.uS+60-R.uc,R.handH);
    ctx.drawImage(this.hand,R.U0,R.V0,R.handW,R.handH);
    ctx.restore();
    // wand: pinned at the grip point in the hand
    ctx.save();ctx.translate(p.G[0],p.G[1]);ctx.rotate(p.thW-p.thN);ctx.translate(-R.G0[0],-R.G0[1]);
    const wb=R.wandBox;ctx.drawImage(this.wand,wb[0],wb[1],wb[2],wb[3]);ctx.restore();
    // body on top (head + torso + legs), hides the shoulder joint
    const bb=R.bodyBox;ctx.drawImage(this.body,bb[0],bb[1],bb[2],bb[3]);
  },
  drawSpark(ctx,p,sp,dt){
    // star tip = conducting point: glows with the card speed
    const sx=p.star[0],sy=p.star[1];
    const glow=clamp(sp*0.55,0,1);
    if(glow>0.01){
      ctx.save();ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(sx,sy,0,sx,sy,120);
      g.addColorStop(0,`rgba(214,200,255,${0.55*glow})`);g.addColorStop(.35,`rgba(150,130,255,${0.22*glow})`);g.addColorStop(1,'rgba(120,100,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,120,0,7);ctx.fill();ctx.restore();
    }
    // tiny sparkles trail from the tip while cards move
    if(!reduceMotion&&sp>0.25&&Math.random()<clamp(sp*0.35,0,0.9)){
      const dir=Math.sign(this.dragging?(this.dragV||0):this.v)||1;
      this.sparks.push({x:sx+(Math.random()-.5)*40,y:sy+(Math.random()-.5)*40,vx:-30-Math.random()*40,vy:dir*(60+Math.random()*60),life:0,max:.55+Math.random()*.3,r:10+Math.random()*10});
    }
    ctx.save();ctx.globalCompositeOperation='lighter';
    this.sparks=this.sparks.filter(k=>{k.life+=dt;k.x+=k.vx*dt;k.y+=k.vy*dt;const u=k.life/k.max;if(u>=1)return false;
      const al=Math.sin(u*Math.PI)*0.8;ctx.fillStyle=`rgba(230,222,255,${al})`;const r=k.r*(1-u*0.4);
      ctx.beginPath();ctx.moveTo(k.x,k.y-r);ctx.quadraticCurveTo(k.x,k.y,k.x+r,k.y);ctx.quadraticCurveTo(k.x,k.y,k.x,k.y+r);
      ctx.quadraticCurveTo(k.x,k.y,k.x-r,k.y);ctx.quadraticCurveTo(k.x,k.y,k.x,k.y-r);ctx.fill();return true;});
    ctx.restore();
  }
};const images=await Promise.all(['wand_body.webp','wand_hand.png','wand_strip.png','wand_stick.webp'].map(f=>loadImg(A(f))));Object.assign(List,{body:images[0],hand:images[1],strip:images[2],wand:images[3],s:0,v:0,sparks:[]});const d=DPR();canvas.width=180*d;canvas.height=200*d;const ctx=canvas.getContext('2d');let raf=0,stopped=false;const tick=()=>{if(stopped)return;List.s=getProgress();const p=List.pose(List.armParam(List.s));ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.setTransform(d*RIG.place.s,0,0,d*RIG.place.s,d*(RIG.place.x-222),d*(RIG.place.y-346));List.drawRig(ctx,p);canvas.dataset.progress=String(List.s);raf=requestAnimationFrame(tick)};tick();return ()=>{stopped=true;cancelAnimationFrame(raf)}};
