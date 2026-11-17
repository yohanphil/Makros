(function(){
/* Motion always plays. Visitors who ask their system for less motion keep normal scrolling instead of smooth scroll. */
var RMQ=window.matchMedia('(prefers-reduced-motion: reduce)').matches,RM=false;
var FINE=window.matchMedia('(pointer: fine)').matches;
var G=!!(window.gsap&&window.ScrollTrigger);
if(G)gsap.registerPlugin(ScrollTrigger);
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}

/* ---------- smooth scroll ---------- */
var lenis=null;
if(window.Lenis&&!RMQ){
  try{
    lenis=new Lenis({lerp:.09,smoothWheel:true});
    if(G){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
    else{(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0)}
  }catch(e){lenis=null}
}
function toTop(){if(lenis)lenis.scrollTo(0,{immediate:true,force:true});else window.scrollTo(0,0)}

/* ---------- header: hide on the way down, show on the way up ---------- */
var bar=$('#bar'),lastY=0;
function onScroll(){var y=window.scrollY;bar.classList.toggle('solid',y>10);if(y>lastY+4&&y>220&&!navOpen)bar.classList.add('hide');else if(y<lastY-4)bar.classList.remove('hide');lastY=y}
window.addEventListener('scroll',onScroll,{passive:true});
/* ---------- back to top: hidden until the visitor scrolls down ---------- */
var tt=$('#toTop');
if(tt){
  var ttSet=function(){var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;tt.classList.toggle('show',y>600);tt.style.setProperty('--off',String(100-Math.min(100,h>0?y/h*100:0)))};
  window.addEventListener('scroll',ttSet,{passive:true});ttSet();
  tt.addEventListener('click',function(){if(lenis)lenis.scrollTo(0,{duration:1.2});else window.scrollTo({top:0,behavior:'smooth'});var f=$('#bar a, #bar button');if(f)setTimeout(function(){f.focus({preventScroll:true})},900)});
}

/* ---------- menu ---------- */
var mb=$('#menuBtn'),nav=$('#nav'),navOpen=false;
function setMenu(o){navOpen=o;nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',String(o));mb.setAttribute('aria-label',o?'Close menu':'Open menu');if(lenis){o?lenis.stop():lenis.start()}}
mb.addEventListener('click',function(){setMenu(!navOpen)});

/* ---------- cursor + magnetic buttons ---------- */
var cur=$('#cursor');
if(FINE&&!RM){
  var cx=0,cy=0,tx=0,ty=0;
  window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;var t=e.target.closest&&e.target.closest('a,button,[data-hover]');cur.classList.toggle('big',!!t)},{passive:true});
  (function loop(){cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
  document.addEventListener('pointerover',function(e){var b=e.target.closest&&e.target.closest('.mag');if(!b||b._mag)return;b._mag=1;
    b.addEventListener('pointermove',function(ev){var r=b.getBoundingClientRect();b.style.transform='translate('+((ev.clientX-r.left-r.width/2)*.22)+'px,'+((ev.clientY-r.top-r.height/2)*.32)+'px)'});
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });
}else{cur.style.display='none'}

/* ---------- split headings into words ---------- */
$$('.split').forEach(function(h){
  var words=h.textContent.trim().split(/\s+/);h.setAttribute('aria-label',h.getAttribute('aria-label')||h.textContent.trim());h.textContent='';
  words.forEach(function(w,i){var o=document.createElement('span');o.className='w';o.setAttribute('aria-hidden','true');var n=document.createElement('span');n.className='wi';n.textContent=w;o.appendChild(n);h.appendChild(o);if(i<words.length-1)h.appendChild(document.createTextNode(' '))});
});

/* ---------- small SVG cubes for the process cards ---------- */
var TILE={T:['60.00,19.68 70.95,26.00 60.00,32.32 49.05,26.00','73.86,27.68 84.80,34.00 73.86,40.32 62.91,34.00','87.71,35.68 98.66,42.00 87.71,48.32 76.77,42.00','46.14,27.68 57.09,34.00 46.14,40.32 35.20,34.00','60.00,35.68 70.95,42.00 60.00,48.32 49.05,42.00','73.86,43.68 84.80,50.00 73.86,56.32 62.91,50.00','32.29,35.68 43.23,42.00 32.29,48.32 21.34,42.00','46.14,43.68 57.09,50.00 46.14,56.32 35.20,50.00','60.00,51.68 70.95,58.00 60.00,64.32 49.05,58.00'],
L:['19.88,44.52 30.83,50.84 30.83,63.48 19.88,57.16','33.74,52.52 44.69,58.84 44.69,71.48 33.74,65.16','47.60,60.52 58.55,66.84 58.55,79.48 47.60,73.16','19.88,60.52 30.83,66.84 30.83,79.48 19.88,73.16','33.74,68.52 44.69,74.84 44.69,87.48 33.74,81.16','47.60,76.52 58.55,82.84 58.55,95.48 47.60,89.16','19.88,76.52 30.83,82.84 30.83,95.48 19.88,89.16','33.74,84.52 44.69,90.84 44.69,103.48 33.74,97.16','47.60,92.52 58.55,98.84 58.55,111.48 47.60,105.16'],
R:['61.45,66.84 72.40,60.52 72.40,73.16 61.45,79.48','75.31,58.84 86.26,52.52 86.26,65.16 75.31,71.48','89.17,50.84 100.12,44.52 100.12,57.16 89.17,63.48','61.45,82.84 72.40,76.52 72.40,89.16 61.45,95.48','75.31,74.84 86.26,68.52 86.26,81.16 75.31,87.48','89.17,66.84 100.12,60.52 100.12,73.16 89.17,79.48','61.45,98.84 72.40,92.52 72.40,105.16 61.45,111.48','75.31,90.84 86.26,84.52 86.26,97.16 75.31,103.48','89.17,82.84 100.12,76.52 100.12,89.16 89.17,95.48']};
var COL={s:'#1E9BE6',v:'#7563EE',m:'#17A985'};
var STATES={scr:{T:'svmmsvvms',L:'msvvvsSmv',R:'vmssmmmvs'},top:{T:'sssssssss',L:'msvvvssmv',R:'vmmsmmmvm'},two:{T:'sssssssss',L:'vmvvvsvmv',R:'mmmmmmmmm'},solved:{T:'sssssssss',L:'vvvvvvvvv',R:'mmmmmmmmm'}};
$$('svg[data-cube]').forEach(function(svg){
  var st=STATES[svg.getAttribute('data-cube')],ns='http://www.w3.org/2000/svg';
  var b=document.createElementNS(ns,'polygon');b.setAttribute('points','60,18 101.57,42 101.57,90 60,114 18.43,90 18.43,42');b.setAttribute('fill','#0B1030');b.setAttribute('stroke','#0B1030');b.setAttribute('stroke-width','3');b.setAttribute('stroke-linejoin','round');svg.appendChild(b);
  ['T','L','R'].forEach(function(f){TILE[f].forEach(function(pts,i){var p=document.createElementNS(ns,'polygon');p.setAttribute('points',pts);var c=COL[st[f][i].toLowerCase()];p.setAttribute('fill',c);p.setAttribute('class','tl');svg.appendChild(p)})});
});

/* ---------- the cube engine ---------- */
var Cube=(function(){
  if(!window.THREE)return null;
  var AX={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0),z:new THREE.Vector3(0,0,1)};
  function solved(){var s=[];for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++)s.push({p:new THREE.Vector3(x,y,z),q:new THREE.Quaternion()});return s}
  function apply(state,m,f){var q=new THREE.Quaternion().setFromAxisAngle(AX[m.a],m.d*Math.PI/2*f);return state.map(function(c){return Math.round(c.p[m.a])===m.l?{p:c.p.clone().applyQuaternion(q),q:q.clone().multiply(c.q)}:c})}
  function snap(s){return s.map(function(c){return {p:new THREE.Vector3(Math.round(c.p.x),Math.round(c.p.y),Math.round(c.p.z)),q:c.q.clone().normalize()}})}
  function inverse(seq){return seq.slice().reverse().map(function(m){return {a:m.a,l:m.l,d:-m.d}})}
  var AXL=['x','y','z'];
  function rand(n){var out=[],last='';for(var i=0;i<n;i++){var a;do{a=AXL[Math.floor(Math.random()*3)]}while(a===last);last=a;out.push({a:a,l:[-1,1,1,-1,0][Math.floor(Math.random()*5)],d:Math.random()<.5?1:-1})}return out}
  function note(m){var map={x:{'1':'R','-1':'L','0':'M'},y:{'1':'U','-1':'D','0':'E'},z:{'1':'F','-1':'B','0':'S'}};var f=map[m.a][String(m.l)];var cw=m.l===1?m.d===-1:(m.l===-1?m.d===1:(m.a==='z'?m.d===-1:m.d===1));return f+(cw?'':'′')}
  function sequence(scr){var s=solved();scr.forEach(function(m){s=snap(apply(s,m,1))});var sol=inverse(scr),st=[s];sol.forEach(function(m){s=snap(apply(s,m,1));st.push(s)});return {solve:sol,states:st}}
  function at(seq,p){var N=seq.solve.length,x=Math.max(0,Math.min(1,p))*N,k=Math.floor(x);if(k>=N)return seq.states[N];var f=x-k;f=f*f*(3-2*f);return apply(seq.states[k],seq.solve[k],f)}
  /* a real perspective cube: lit, rounded cubies, slightly raised tiles in the Makros colours */
  var FACE={px:0x2FE3AE,nx:0x0A7F5C,py:0x2BB8FF,ny:0xF3F4FA,pz:0xC77DFF,nz:0x6A2FC0};
  function rrect(s,rad){var h=s/2,sh=new THREE.Shape();sh.moveTo(-h+rad,-h);sh.lineTo(h-rad,-h);sh.quadraticCurveTo(h,-h,h,-h+rad);sh.lineTo(h,h-rad);sh.quadraticCurveTo(h,h,h-rad,h);sh.lineTo(-h+rad,h);sh.quadraticCurveTo(-h,h,-h,h-rad);sh.lineTo(-h,-h+rad);sh.quadraticCurveTo(-h,-h,-h+rad,-h);return sh}
  var GEO=null;
  function geo(){if(GEO)return GEO;
    var b=new THREE.ExtrudeGeometry(rrect(.84,.16),{depth:.84,bevelEnabled:true,bevelThickness:.07,bevelSize:.07,bevelSegments:3,curveSegments:6});b.center();
    var t=new THREE.ExtrudeGeometry(rrect(.76,.15),{depth:.02,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2,curveSegments:6});t.center();
    GEO={body:b,tile:t};return GEO}
  function view(host,opts){
    opts=opts||{};
    var r;try{r=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return null}
    if(!r.getContext())return null;
    r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.setClearColor(0,0);host.appendChild(r.domElement);
    var cv=r.domElement;cv.style.display='block';
    var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(26,1,.1,100);
    var YAW=36*Math.PI/180,PIT=27*Math.PI/180,DIST=12;
    function placeCam(){cam.position.set(Math.sin(YAW)*Math.cos(PIT)*DIST,Math.sin(PIT)*DIST,Math.cos(YAW)*Math.cos(PIT)*DIST);cam.lookAt(0,0,0)}
    scene.add(new THREE.HemisphereLight(0xffffff,0x6d74b8,.75));
    var key=new THREE.DirectionalLight(0xffffff,.85);key.position.set(5,9,7);scene.add(key);
    var rim=new THREE.DirectionalLight(0xcfe9ff,.4);rim.position.set(-7,2,-3);scene.add(rim);
    var root=new THREE.Group();scene.add(root);
    var G2=geo(),body=new THREE.MeshStandardMaterial({color:0x0D0F1C,roughness:.42,metalness:.15});
    var MAT={};Object.keys(FACE).forEach(function(k){MAT[k]=new THREE.MeshStandardMaterial({color:FACE[k],roughness:.3,metalness:0,emissive:FACE[k],emissiveIntensity:.07})});
    var O=.5,cubies=[],tiles=[];
    function tile(g,k,n,rx,ry){var m=new THREE.Mesh(G2.tile,opts.uniqueTiles?MAT[k].clone():MAT[k]);m.rotation.set(rx,ry,0);m.position.copy(n).multiplyScalar(O+.01);m.userData={cubie:g,n:n.clone(),k:k};g.add(m);tiles.push(m)}
    for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++){
      var g=new THREE.Group();g.add(new THREE.Mesh(G2.body,body));
      if(x===1)tile(g,'px',new THREE.Vector3(1,0,0),0,Math.PI/2);
      if(x===-1)tile(g,'nx',new THREE.Vector3(-1,0,0),0,-Math.PI/2);
      if(y===1)tile(g,'py',new THREE.Vector3(0,1,0),-Math.PI/2,0);
      if(y===-1)tile(g,'ny',new THREE.Vector3(0,-1,0),Math.PI/2,0);
      if(z===1)tile(g,'pz',new THREE.Vector3(0,0,1),0,0);
      if(z===-1)tile(g,'nz',new THREE.Vector3(0,0,-1),0,Math.PI);
      g.position.set(x,y,z);root.add(g);cubies.push(g);
    }
    function fit(){var w=host.clientWidth,hh=host.clientHeight;if(!w||!hh)return;r.setSize(w,hh,false);cv.style.width='100%';cv.style.height='100%';var a=w/hh;cam.aspect=a;var R=opts.R||(w<700?3.3:2.75),t=Math.tan(cam.fov*Math.PI/360);DIST=a>=1?R/t:R/(t*a);placeCam();cam.updateProjectionMatrix()}
    fit();if(window.ResizeObserver)new ResizeObserver(fit).observe(host);else window.addEventListener('resize',fit);
    var tgx=0,tgy=0,rx=0,ry=0,ux=0,uy=0,vis=true,pop=-1,ex={spin:0,lift:0,scale:1,idle:0,scroll:0},ia=0;
    if(opts.tilt&&FINE&&!RM){var area=opts.tilt;area.addEventListener('pointermove',function(e){var b=area.getBoundingClientRect();tgy=((e.clientX-b.left)/b.width-.5)*.3;tgx=((e.clientY-b.top)/b.height-.5)*.16});area.addEventListener('pointerleave',function(){tgx=0;tgy=0})}
    if(window.IntersectionObserver)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(host);
    function draw(now){rx+=(tgx-rx)*.07;ry+=(tgy-ry)*.07;ia+=((ex.idle?1:0)-ia)*.03;var tt=now/1000;root.rotation.x=rx+ux+ex.scroll*.35+Math.sin(tt*.9)*.06*ia;root.rotation.y=ry+uy+ex.spin+ex.scroll*Math.PI*.5+Math.sin(tt*.6)*.28*ia;root.position.y=ex.lift+Math.sin(tt*1.5)*.14*ia;var s=1;if(pop>0){var t=(now-pop)/520;if(t<1)s=1+.07*Math.sin(Math.PI*t);else pop=-1}root.scale.setScalar(s*ex.scale);if(opts.tick)opts.tick(now);r.render(scene,cam)}
    (function loop(now){if(vis&&!document.hidden&&host.offsetParent!==null&&(!opts.active||opts.active()))draw(now);requestAnimationFrame(loop)})(0);
    /* turning rows by hand */
    var P=opts.play;
    if(P){
      cv.style.touchAction='none';cv.style.cursor='grab';
      var ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),drag=null,AXV={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0),z:new THREE.Vector3(0,0,1)};
      function toScreen(v){root.updateMatrixWorld();var w=root.localToWorld(v.clone()).project(cam),b=cv.getBoundingClientRect();return {x:(w.x+1)/2*b.width,y:(1-w.y)/2*b.height}}
      function axisOf(v){var a=Math.abs(v.x),b=Math.abs(v.y),c=Math.abs(v.z);return a>=b&&a>=c?'x':(b>=c?'y':'z')}
      cv.addEventListener('pointerenter',function(){P.hover&&P.hover(true)});
      cv.addEventListener('pointerleave',function(){if(!drag)P.hover&&P.hover(false)});
      cv.addEventListener('pointerdown',function(e){
        var b=cv.getBoundingClientRect();ndc.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height)*2+1);
        root.updateMatrixWorld();ray.setFromCamera(ndc,cam);var hit=ray.intersectObjects(tiles,false)[0];
        cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';
        if(hit&&P.canTurn()){var c=hit.object.userData.cubie,n=hit.object.userData.n.clone().applyQuaternion(c.quaternion);var na=axisOf(n);
          drag={x:e.clientX,y:e.clientY,na:na,p:root.worldToLocal(hit.point.clone()),c:c}}
        else drag={orbit:true,x:e.clientX,y:e.clientY,ux:ux,uy:uy};
        P.touched&&P.touched();e.preventDefault();
      });
      cv.addEventListener('pointermove',function(e){
        if(!drag||drag.done)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;
        if(drag.orbit){uy=drag.uy+dx*.008;ux=Math.max(-.7,Math.min(.7,drag.ux+dy*.006));return}
        if(Math.hypot(dx,dy)<12)return;
        var s0=toScreen(drag.p),best=null,bs=-1;
        ['x','y','z'].forEach(function(u){if(u===drag.na)return;var s1=toScreen(drag.p.clone().add(AXV[u].clone().multiplyScalar(.5))),vx=s1.x-s0.x,vy=s1.y-s0.y,l=Math.hypot(vx,vy)||1,sc=Math.abs((dx*vx+dy*vy)/l);if(sc>bs){bs=sc;best=u}});
        var A=['x','y','z'].filter(function(k){return k!==drag.na&&k!==best})[0],l=Math.round(drag.c.position[A]);
        var q=new THREE.Quaternion().setFromAxisAngle(AXV[A],.3),s2=toScreen(drag.p.clone().applyQuaternion(q)),d=((s2.x-s0.x)*dx+(s2.y-s0.y)*dy)>0?1:-1;
        drag.done=true;P.turn({a:A,l:l,d:d});
      });
      function end(e){if(drag&&cv.hasPointerCapture&&cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);drag=null;cv.style.cursor='grab'}
      cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
    }
    return {show:function(st){for(var i=0;i<27;i++){cubies[i].position.copy(st[i].p);cubies[i].quaternion.copy(st[i].q)}},pop:function(){pop=performance.now()},set:function(o){for(var k in o)ex[k]=o[k]},get:function(){var o={};for(var k in ex)o[k]=ex[k];return o},resetView:function(){ux=0;uy=0},parts:{scene:scene,root:root,cubies:cubies,tiles:tiles,cam:cam,geo:G2,face:FACE}};
  }
  return {solved:solved,apply:apply,snap:snap,inverse:inverse,rand:rand,note:note,sequence:sequence,at:at,view:view};
})();

/* ---------- hero: the cube arrives scrambled and solves itself ---------- */
function easeIO(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function easeOut(t){return 1-Math.pow(1-t,4)}
function easeSine(t){return -(Math.cos(Math.PI*t)-1)/2}
function tween(from,to,dur,ease,cb,done){var t0=performance.now();(function step(now){var t=Math.min(1,(now-t0)/dur);cb(from+(to-from)*ease(t));if(t<1)requestAnimationFrame(step);else if(done)done()})(t0)}
function animProps(v,to,ms,ease){return new Promise(function(res){var from=v.get(),t0=performance.now();(function step(now){var t=Math.max(0,Math.min(1,(now-t0)/ms)),e=ease(t),o={};for(var k in to)o[k]=from[k]+(to[k]-from[k])*e;v.set(o);if(t<1)requestAnimationFrame(step);else res()})(t0)})}
function playMoves(v,start,moves,per,spin){return new Promise(function(res){
  var st=[start];moves.forEach(function(m,i){st.push(Cube.snap(Cube.apply(st[i],m,1)))});
  var N=moves.length,D=per*N,t0=performance.now();
  (function step(now){var t=Math.max(0,Math.min(1,(now-t0)/D)),x=t*N,k=Math.min(N-1,Math.floor(x)),f=t>=1?1:x-k;
    v.show(Cube.apply(st[k],moves[k],easeIO(f)));
    if(spin)v.set({spin:spin[0]+(spin[1]-spin[0])*easeSine(t)});
    if(t<1)requestAnimationFrame(step);else{v.show(st[N]);res(st[N])}})(t0)})}
function scrambledBy(moves){var s=Cube.solved();moves.forEach(function(m){s=Cube.snap(Cube.apply(s,m,1))});return s}
/* a flat cube for browsers without WebGL: tiles flip to solve it, so it still moves */
function SvgCube(svg){
  var ns='http://www.w3.org/2000/svg',SOL={T:'#1E9BE6',L:'#7563EE',R:'#17A985'},ALL=['#1E9BE6','#7563EE','#17A985'];
  svg.textContent='';svg.style.overflow='visible';svg.style.opacity='1';
  function poly(pts,c,w){var p=document.createElementNS(ns,'polygon');p.setAttribute('points',pts);p.setAttribute('fill',c);p.setAttribute('stroke',c);p.setAttribute('stroke-width',w||'.6');p.setAttribute('stroke-linejoin','round');return p}
  svg.appendChild(poly('60,18 101.57,42 101.57,90 60,114 18.43,90 18.43,42','#0B1030','3'));
  var tiles=[];['T','R','L'].forEach(function(f){TILE[f].forEach(function(pts,i){var p=poly(pts,SOL[f]);svg.appendChild(p);tiles.push({el:p,f:f,c:SOL[f],centre:i===4})})});
  function setC(t,c){t.c=c;t.el.setAttribute('fill',c);t.el.setAttribute('stroke',c)}
  function other(c){var o=ALL.filter(function(x){return x!==c});return o[Math.floor(Math.random()*o.length)]}
  function flip(items,stag,dur){return new Promise(function(res){
    if(!items.length){res();return}
    if(!G){items.forEach(function(it){setC(it.t,it.c)});res();return}
    var tl=gsap.timeline({onComplete:res});
    items.forEach(function(it,i){tl.to(it.t.el,{scale:0,transformOrigin:'50% 50%',duration:dur*.45,ease:'power2.in',onComplete:function(){setC(it.t,it.c)}},i*stag).to(it.t.el,{scale:1,transformOrigin:'50% 50%',duration:dur*.55,ease:'back.out(2.6)'},i*stag+dur*.45)});
  })}
  function mess(k){var pool=tiles.filter(function(t){return !t.centre}).sort(function(){return Math.random()-.5});return pool.slice(0,k).map(function(t){return {t:t,c:other(t.c)}})}
  function solveAll(){
    var items=tiles.filter(function(t){return t.c!==SOL[t.f]}).map(function(t){return {t:t,c:SOL[t.f]}});
    if(G)gsap.fromTo(svg,{rotation:0},{keyframes:[{rotation:-7,duration:.5},{rotation:7,duration:1},{rotation:0,duration:.5}],ease:'sine.inOut',transformOrigin:'50% 50%'});
    return flip(items,.075,.34);
  }
  var floating=false;
  function float(){if(floating||!G)return;floating=true;gsap.to(svg,{y:-14,duration:2.4,ease:'sine.inOut',yoyo:true,repeat:-1})}
  return {
    intro:function(){
      mess(20).forEach(function(it){setC(it.t,it.c)});
      if(!G){tiles.forEach(function(t){setC(t,SOL[t.f])});return Promise.resolve()}
      return new Promise(function(res){gsap.fromTo(svg,{scale:.3,rotation:-150,transformOrigin:'50% 50%'},{scale:1,rotation:0,duration:1,ease:'power4.out',onComplete:res})})
        .then(function(){return wait(120)}).then(solveAll).then(float);
    },
    replay:function(){
      var m=mess(18);
      if(G)gsap.fromTo(svg,{rotation:0},{rotation:360,duration:.8,ease:'power2.inOut',transformOrigin:'50% 50%'});
      return flip(m,.02,.22).then(function(){return wait(260)}).then(solveAll);
    },
    scramble:function(k){return flip(mess(k),.03,.26)},
    solve:solveAll,
    pop:function(){if(G)gsap.fromTo(svg,{scale:1},{scale:1.08,duration:.18,yoyo:true,repeat:1,ease:'power2.out',transformOrigin:'50% 50%'})}
  };
}

var hero=null,heroSvg=null,heroState=null,heroBusy=false,heroVis=true,autoT=0,replayBtn=$('#replay'),solveCubeBtn=$('#solveCube'),sparks=$('#sparks'),heroFb=$('#heroFallback'),cubeHint=$('#cubeHint');
var heroHist=[],playing=false,hovering=false;
/* which colour each sticker carries, so we can tell when a visitor has solved it by hand */
var STICK=(function(){if(!window.THREE)return [];var o=[];var i=0;for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++){var l=[];if(x)l.push(new THREE.Vector3(x,0,0));if(y)l.push(new THREE.Vector3(0,y,0));if(z)l.push(new THREE.Vector3(0,0,z));o.push(l);i++}return o})();
function isSolved(st){var faces={};for(var i=0;i<27;i++){STICK[i].forEach(function(n){var w=n.clone().applyQuaternion(st[i].q);var k=(Math.round(w.x)+','+Math.round(w.y)+','+Math.round(w.z));var c=n.x+','+n.y+','+n.z;if(faces[k]&&faces[k]!==c)faces[k]='mixed';else if(!faces[k])faces[k]=c})}return Object.keys(faces).every(function(k){return faces[k]!=='mixed'})}
function tidy(seq){var out=[];seq.forEach(function(m){var p=out[out.length-1];if(p&&p.a===m.a&&p.l===m.l&&p.d===-m.d)out.pop();else out.push(m)});return out}
function updBtns(){if(!solveCubeBtn)return;var can=heroHist.length>0&&!heroBusy;solveCubeBtn.disabled=!can;solveCubeBtn.classList.toggle('ready',can)}
if(Cube&&$('#heroCube')){hero=Cube.view($('#heroCube'),{tilt:$('#hero'),play:{
  canTurn:function(){return !heroBusy},
  turn:function(m){heroTurn(m)},
  touched:function(){clearTimeout(autoT);if(hero)hero.set({idle:0})},
  hover:function(on){hovering=on;$('#heroR').classList.toggle('playing',on||playing);if(on){clearTimeout(autoT);if(hero)hero.set({idle:0})}else if(!playing&&!heroBusy){if(hero)hero.set({idle:1});scheduleAuto()}}
}})}
if(hero){heroFb.style.transition='none';heroFb.style.opacity='0'}
else if(heroFb){heroSvg=SvgCube(heroFb);if(cubeHint)cubeHint.hidden=true;if(solveCubeBtn)solveCubeBtn.hidden=true}
/* the loader hands over: it shrinks away as the 3D cube flies in (or the flat cube, where there is no 3D) */
(function(){var hc=$('#heroCube'),cl=$('#cubeLoad');if(hc){hc.classList.remove('flat');hc.classList.add(hero?'live':'flat')}
  if(cl){if(!hero)cl.style.display='none';else{cl.classList.add('out');setTimeout(function(){cl.remove()},700)}}})();
if($('#hero')&&window.IntersectionObserver)new IntersectionObserver(function(es){heroVis=es[0].isIntersecting}).observe($('#hero'));
function burst(){
  if(!sparks||!G)return;
  var cols=['#45D4FF','#DDABFF','#40FFC6','#2BB8FF','#D18CFF','#36EDB8','#0B1030'];
  for(var i=0;i<22;i++){(function(i){var s=document.createElement('i');s.style.background=cols[i%cols.length];sparks.appendChild(s);
    var a=Math.random()*Math.PI*2,d=180+Math.random()*240;
    gsap.fromTo(s,{x:0,y:0,scale:.5+Math.random()*.7,rotation:0},{x:Math.cos(a)*d,y:Math.sin(a)*d*.85,rotation:(Math.random()-.5)*540,scale:0,duration:1.1+Math.random()*.6,ease:'power3.out',onComplete:function(){s.remove()}})})(i)}
}
/* left alone, the cube rests a few seconds, then scrambles and solves again; a visitor playing with it pauses that */
function scheduleAuto(){clearTimeout(autoT);autoT=setTimeout(function auto(){if(heroBusy)return;if(playing||hovering||!heroVis||document.hidden){autoT=setTimeout(auto,1500);return}heroReplay()},6500)}
function say(t){if(cubeHint)cubeHint.textContent=t}
function solvedMoment(byHand){
  if(hero){hero.pop();hero.set({spin:hero.get().spin%(Math.PI*2),idle:hovering?0:1})}else if(heroSvg)heroSvg.pop();
  burst();heroBusy=false;heroHist=[];playing=false;$('#heroR')&&$('#heroR').classList.toggle('playing',hovering);
  say(byHand?'You solved it. Nicely done.':'Drag any row to turn it. Drag around the cube to look around.');
  if(replayBtn&&replayBtn.hidden){replayBtn.hidden=false;if(solveCubeBtn)solveCubeBtn.hidden=false;if(G)gsap.from([replayBtn,solveCubeBtn],{y:14,opacity:0,duration:.7,stagger:.08,ease:'power3.out',clearProps:'opacity,transform'})}
  updBtns();scheduleAuto();
}
function heroIntro(){
  heroBusy=true;
  if(!hero){heroSvg.intro().then(function(){solvedMoment()});return}
  var scr=Cube.rand(12);heroState=scrambledBy(scr);
  hero.show(heroState);hero.set({scale:.3,spin:-Math.PI*1.25,lift:1.1,idle:0});
  wait(200)
  .then(function(){return animProps(hero,{scale:1,spin:0,lift:0},1000,easeOut)})
  .then(function(){return wait(80)})
  .then(function(){return playMoves(hero,heroState,Cube.inverse(scr),190,[0,Math.PI*2])})
  .then(function(s){heroState=s;solvedMoment()});
}
/* the automatic show: scramble, pause, solve */
function heroReplay(){
  if(heroBusy||(!hero&&!heroSvg))return;clearTimeout(autoT);heroBusy=true;
  if(!hero){heroSvg.replay().then(function(){solvedMoment()});return}
  hero.set({idle:0});
  var mv=Cube.rand(11);
  animProps(hero,{lift:.3,scale:.92},260,easeIO)
  .then(function(){return playMoves(hero,heroState,mv,90,[0,Math.PI])})
  .then(function(s){heroState=s;return wait(240)})
  .then(function(){return Promise.all([playMoves(hero,heroState,Cube.inverse(mv),180,[Math.PI,Math.PI*3]),animProps(hero,{lift:0,scale:1},520,easeIO)])})
  .then(function(r){heroState=r[0];solvedMoment()});
}
/* the visitor's own game */
function heroTurn(m){
  if(heroBusy)return;clearTimeout(autoT);playing=true;heroBusy=true;$('#heroR').classList.add('playing');hero.set({idle:0});
  playMoves(hero,heroState,[m],230).then(function(s){heroState=s;heroHist.push(m);heroBusy=false;
    if(isSolved(heroState)){solvedMoment(true);return}
    say(heroHist.length+(heroHist.length===1?' turn.':' turns.')+' Stuck? Press Solve it.');updBtns()});
}
function heroScramble(){
  if(!hero){heroReplay();return}
  if(heroBusy)return;clearTimeout(autoT);playing=true;heroBusy=true;$('#heroR').classList.add('playing');hero.set({idle:0});updBtns();
  var mv=Cube.rand(14);
  playMoves(hero,heroState,mv,95,[0,Math.PI*2]).then(function(s){heroState=s;hero.set({spin:0});heroHist=heroHist.concat(mv);heroBusy=false;say('Your turn. Drag any row to turn it, or press Solve it.');updBtns()});
}
function heroSolve(){
  if(!hero||heroBusy)return;var mv=tidy(Cube.inverse(heroHist));
  if(!mv.length){solvedMoment();return}
  heroBusy=true;updBtns();say('Solving '+mv.length+' moves.');
  var per=Math.max(70,Math.min(200,4200/mv.length));
  playMoves(hero,heroState,mv,per,[0,Math.PI*2]).then(function(s){heroState=s;hero.set({spin:0});solvedMoment()});
}
if(hero||heroSvg){
  heroIntro();
  if(replayBtn)replayBtn.addEventListener('click',heroScramble);
  if(solveCubeBtn)solveCubeBtn.addEventListener('click',heroSolve);
}

/* ---------- process cards: one cube, four different things happening ----------
   Listen opens the cube into an exploded view while rings pulse out from a glowing core: a look inside at how things work today.
   Shape draws the plan as a wireframe, then builds the cube into it piece by piece, layer by layer, in order.
   Deliver solves a scrambled cube in four steps while a weekly progress bar fills underneath.
   Stay keeps the solved cube turning slowly while a year of small cubes orbits it, and a shine passes over it now and then.
   Each loop starts when its card comes into view, and a cube stops drawing once the next card covers it. */
(function(){
  var hosts=$$('.cardCube');if(!hosts.length)return;
  if(!Cube){hosts.forEach(function(h){h.classList.add('flat')});return}
  function cl(x){return x<0?0:x>1?1:x}
  function seg(t,a,b){return cl((t-a)/(b-a))}
  function eio(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  function eback(x){var c=1.6;x-=1;return 1+(c+1)*x*x*x+c*x*x}
  function scrambled(n){var s=Cube.solved();Cube.rand(n).forEach(function(m){s=Cube.snap(Cube.apply(s,m,1))});return s}

  var MODES=[
  /* Listen */
  function(){var P,base,rings=[],core;
    return {R:2.75,
      init:function(v){P=v.parts;v.show(scrambled(16));base=P.cubies.map(function(c){return c.position.clone()});
        for(var i=0;i<3;i++){var m=new THREE.Mesh(new THREE.RingGeometry(.93,1,96),new THREE.MeshBasicMaterial({color:0x2BB8FF,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));P.scene.add(m);rings.push(m)}
        core=new THREE.Mesh(new THREE.SphereGeometry(.3,32,16),new THREE.MeshBasicMaterial({color:0x45D4FF}));P.root.add(core)},
      tick:function(t){var T=t%8.4,e=eio(seg(T,.9,2.3))*(1-eio(seg(T,5.8,7.2)));
        P.cubies.forEach(function(c,i){var b=base[i],k=1+.62*e,w=Math.sin(t*2.2+i*1.9)*.06*e;c.position.set(b.x*k,b.y*k+w,b.z*k);c.scale.setScalar(i===13?1-.9*e:1)});
        P.root.scale.multiplyScalar(1-.2*e);P.root.rotation.y+=(Math.floor(t/8.4)+eio(seg(T,.9,7.2)))*Math.PI/2;
        core.scale.setScalar(Math.max(.001,e*(1+.18*Math.sin(t*7))));
        rings.forEach(function(m,k){var ph=((t-k*.6)%1.8+1.8)%1.8/1.8;m.position.copy(P.root.position);m.quaternion.copy(P.cam.quaternion);m.scale.setScalar(.4+ph*3.1);m.material.opacity=e*Math.pow(1-ph,1.3)*.85})}}},
  /* Shape */
  function(){var P,v0,base,order,mat,popped=false;
    return {R:2.5,
      init:function(v){v0=v;P=v.parts;v.show(Cube.solved());base=P.cubies.map(function(c){return c.position.clone()});
        var eg=new THREE.EdgesGeometry(new THREE.BoxGeometry(.94,.94,.94)),wire=new THREE.Group();mat=new THREE.LineBasicMaterial({color:0x4A4FE6,transparent:true,opacity:0});
        base.forEach(function(b){var l=new THREE.LineSegments(eg,mat);l.position.copy(b);wire.add(l)});P.root.add(wire);
        order=base.map(function(b,i){return i}).sort(function(a,b){var A=base[a],B=base[b];return (A.y-B.y)||(A.z-B.z)||(A.x-B.x)});},
      tick:function(t){var T=t%9.6;
        mat.opacity=.6*(T<4.3?1-seg(T,3.7,4.3):seg(T,7,7.6))*seg(t,0,.6);
        order.forEach(function(ci,k){var c=P.cubies[ci],b=base[ci],a=eback(seg(T,.7+k*.095,1.25+k*.095)),o=eio(seg(T,7.6+(26-k)*.045,8.1+(26-k)*.045));
          c.scale.setScalar(Math.max(.001,Math.min(1.08,a)*(1-o)));c.position.set(b.x,b.y+(1-cl(a))*1.4,b.z)});
        if(T>3.5&&T<3.7&&!popped){popped=true;v0.pop()}if(T<1)popped=false}}},
  /* Deliver */
  function(host){var P,v0,seq=Cube.sequence(Cube.rand(12)),fills=[],popped=false;
    var bar=document.createElement('div');bar.className='wkBar';bar.setAttribute('aria-hidden','true');
    bar.innerHTML=[1,2,3,4].map(function(n){return '<span><i><b></b></i>Week '+n+'</span>'}).join('');host.appendChild(bar);
    fills=[].slice.call(bar.querySelectorAll('b'));
    return {R:2.6,
      init:function(v){v0=v;P=v.parts;v.show(seq.states[0])},
      tick:function(t){var T=t%11.2,p=0,f=[0,0,0,0],spin=0;
        if(T>=.6&&T<7){var u=T-.6,k=Math.min(3,Math.floor(u/1.6)),q=cl((u-k*1.6)/1.1);p=(k*3+q*3)/12;for(var j=0;j<4;j++)f[j]=j<k?1:(j===k?q:0)}
        else if(T>=7&&T<9.6){p=1;f=[1,1,1,1]}
        else if(T>=9.6){var r=eio(seg(T,9.6,10.8));p=1-r;spin=r*Math.PI*2;f=[1-r,1-r,1-r,1-r]}
        v0.show(Cube.at(seq,p));P.root.rotation.y+=spin;
        fills.forEach(function(b,j){b.style.transform='scaleX('+f[j]+')'});
        if(T>=7&&T<7.3&&!popped){popped=true;v0.pop()}if(T<1)popped=false}}},
  /* Stay */
  function(){var P,v0,orbit,sats=[],shone=-1,W=new THREE.Color(0xffffff),wp=new THREE.Vector3(),D=new THREE.Vector3(1,-1,1).normalize();
    return {R:3.15,uniqueTiles:true,
      init:function(v){v0=v;P=v.parts;v.show(Cube.solved());
        orbit=new THREE.Group();orbit.rotation.set(.38,0,-.16);P.scene.add(orbit);
        var pts=[];for(var i=0;i<=160;i++){var a=i/160*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*2.4,0,Math.sin(a)*2.4))}
        orbit.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.38})));
        var cols=[0x45D4FF,0xDDABFF,0x40FFC6];
        for(var i=0;i<12;i++){var m=new THREE.Mesh(P.geo.body,new THREE.MeshStandardMaterial({color:cols[i%3],roughness:.35,emissive:cols[i%3],emissiveIntensity:.2}));m.scale.setScalar(.25);orbit.add(m);sats.push(m)}},
      tick:function(t){P.root.rotation.y+=t*.2;
        sats.forEach(function(m,i){var a=-t*.55+i/12*Math.PI*2;m.position.set(Math.cos(a)*2.4,Math.sin(t*1.4+i)*.06,Math.sin(a)*2.4);m.rotation.set(t*.9+i,t*.7+i*2,0)});
        var T=t%6.5,w=seg(T,.3,1.9),on=w>0&&w<1;
        if(on||shone>0){P.root.updateMatrixWorld();var front=-2.6+w*5.2;
          P.tiles.forEach(function(m){var I=0;if(on){m.getWorldPosition(wp);var d=wp.dot(D)-front;I=Math.exp(-d*d/.22)}
            m.material.emissive.setHex(P.face[m.userData.k]).multiplyScalar(.07*(1-I)).add(W.clone().multiplyScalar(.7*I));m.material.emissiveIntensity=1});
          shone=on?1:0}
        if(T>1.1&&T<1.25&&!sats.popped){sats.popped=true;v0.pop()}if(T<.5)sats.popped=false}}}
  ];

  var cards=$$('#stack .card');
  hosts.forEach(function(host){
    var k=+host.getAttribute('data-stage')||0,card=host.closest('.card'),next=cards[cards.indexOf(card)+1],mode=MODES[k](host),t0=0,v=null,ready=false;
    function active(){if(!next)return true;var a=card.getBoundingClientRect(),b=next.getBoundingClientRect();return b.top>a.top+a.height*.5}
    function build(){if(v)return;v=Cube.view(host,{R:mode.R,uniqueTiles:mode.uniqueTiles,active:active,tick:function(now){if(!ready)return;mode.tick(t0?(now-t0)/1000:0)}});
      if(!v){host.classList.add('flat');return}host.classList.add('live');mode.init(v);ready=true;v.set({idle:1})}
    if(window.IntersectionObserver){
      new IntersectionObserver(function(es){if(es[0].isIntersecting)build()},{rootMargin:'600px 0px'}).observe(host);
      var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();build();t0=performance.now()}},{threshold:.3});io.observe(host);
    }else{build();t0=performance.now()}
  });
})();

/* ---------- footer tile wall: scrambled until it scrolls into view, then it sorts itself to spell the name ----------
   Letter tiles take the bright brand colour of their part of the wall, every other tile a deep shade of the same colour.
   Wide walls spell MAKROS and MKS in turn, narrow walls spell MKS. Every few seconds part of the wall scrambles into
   random colours and sorts itself again, and tiles still flash under the pointer. */
(function(){
  var tw=$('#tileWall');if(!tw)return;
  var BRIGHT=['#45D4FF','#DDABFF','#40FFC6'],DEEP=['#1C4B6E','#4A3E6E','#1B585D'],
      MIX=['#45D4FF','#DDABFF','#40FFC6','#4A4FE6','#2BB8FF','#D18CFF','#1A2154','#36EDB8'];
  var FONT={M:['10001','11011','10101','10001','10001'],A:['0110','1001','1111','1001','1001'],K:['1001','1010','1100','1010','1001'],
            R:['1110','1001','1110','1010','1001'],O:['0110','1001','1001','1001','0110'],S:['0111','1000','0110','0001','1110']};
  var PART={MAKROS:[0,0,1,1,2,2],MKS:[0,1,2]};
  var tiles=[],cols=0,rows=7,seen=false,loopT=0,words=['MKS'],wi=0;
  function rnd(){return MIX[Math.floor(Math.random()*MIX.length)]}
  function wide(w){return w.split('').reduce(function(a,ch){return a+FONT[ch][0].length},0)+w.length-1}
  /* which colour each tile settles on for this word */
  function spell(word){
    var x=Math.floor((cols-wide(word))/2),y0=Math.floor((rows-5)/2),on={},cut=[];
    /* on a wide wall MKS spreads out, one letter centred in each third; MAKROS, and MKS on a narrow wall, run as one word */
    var spread=word.length===3&&cols>=32,b=[0,Math.round(cols/3),Math.round(cols*2/3),cols];
    if(spread)cut=[b[1]-1,b[2]-1];
    word.split('').forEach(function(ch,li){var f=FONT[ch],g=PART[word][li];
      if(spread)x=b[li]+Math.floor((b[li+1]-b[li]-f[0].length)/2);
      f.forEach(function(row,ry){for(var cx=0;cx<row.length;cx++)if(row[cx]==='1')on[(x+cx)+','+(y0+ry)]=g});
      x+=f[0].length;if(!spread&&li<word.length-1&&PART[word][li+1]!==g)cut.push(x);x+=1});
    tiles.forEach(function(t){var g=t.x<=cut[0]?0:(t.x<=cut[1]?1:2),k=on[t.x+','+t.y];t.goal=k===undefined?DEEP[g]:BRIGHT[k]});
    tw.setAttribute('aria-label','A wall of Makros tiles that scrambles, then sorts itself to spell '+word);
  }
  function build(){
    var w=tw.clientWidth||window.innerWidth,c=w>=1000?Math.max(32,Math.min(46,Math.round(w/42))):Math.max(17,Math.round(w/40));
    if(c===cols&&tiles.length)return;cols=c;tw.style.setProperty('--cols',cols);tw.textContent='';tiles=[];
    for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var i=document.createElement('i');tw.appendChild(i);tiles.push({el:i,x:x,y:y,goal:DEEP[0]})}
    words=cols>=32?['MAKROS','MKS']:['MKS'];wi=0;spell(words[0]);
    tiles.forEach(function(t){t.el.style.setProperty('--c',seen?t.goal:rnd())});
  }
  function solve(){tiles.forEach(function(t){t.el.style.setProperty('--dl',((t.x+t.y*2)*18)+'ms');t.el.style.setProperty('--c',t.goal)})}
  function scramble(p){tiles.forEach(function(t){if(Math.random()<p){t.el.style.setProperty('--dl',(Math.random()*300|0)+'ms');t.el.style.setProperty('--c',rnd())}})}
  function cycle(){clearTimeout(loopT);loopT=setTimeout(function(){if(!seen)return;scramble(.45);
    setTimeout(function(){if(words.length>1){wi=(wi+1)%words.length;spell(words[wi])}solve()},1300);cycle()},7000)}
  build();
  if(window.ResizeObserver)new ResizeObserver(function(){var c=cols;build();if(seen&&c!==cols)solve()}).observe(tw);
  if(window.IntersectionObserver)new IntersectionObserver(function(es){var on=es[0].isIntersecting;if(on&&!seen){seen=true;setTimeout(solve,250);cycle()}else if(on){cycle()}else clearTimeout(loopT)},{threshold:.3}).observe(tw);
  else{seen=true;solve()}
  tw.addEventListener('pointerover',function(e){var el=e.target;if(el.tagName!=='I')return;var k=tiles.findIndex(function(t){return t.el===el});if(k<0)return;var t=tiles[k];
    tiles.forEach(function(o){if(Math.abs(o.x-t.x)+Math.abs(o.y-t.y)<=1){o.el.style.setProperty('--dl','0ms');o.el.style.setProperty('--c',rnd());o.el.classList.add('hit');(function(o){setTimeout(function(){o.el.classList.remove('hit');o.el.style.setProperty('--c',o.goal)},650)})(o)}})});
})();

/* ---------- live tool ---------- */
var PROBS=[
 {t:'Our systems don’t talk to each other',team:'Makros Technology',svc:'Digital transformation and ERP implementations',href:'technology.html'},
 {t:'We worry about a cyber attack',team:'Makros Technology',svc:'Cyber security, with 24x7 monitoring from our Security Operations Centre',href:'technology.html'},
 {t:'We have an audit or ISO deadline',team:'Makros Technology',svc:'IT compliance and governance, ISO 27001 implementation',href:'technology.html'},
 {t:'Finance takes over our week',team:'Makros Operations',svc:'Managed finance, from receipts to monthly statements',href:'operations.html'},
 {t:'We need skilled people, fast',team:'Makros Operations',svc:'Augmented teams on our payroll, working as part of yours',href:'operations.html'},
 {t:'Our brand looks dated',team:'Makros Studio',svc:'Brand identity, company profile and a new website',href:'studio.html'},
 {t:'We need an app or a new website',team:'Makros Technology and Studio',svc:'Mobile and website development, designed by the Studio',href:'technology.html'},
 {t:'We are launching something soon',team:'Makros Studio',svc:'Launch film, 3D renders, photography and the campaign',href:'studio.html'}
];
var live=null,liveState=null,liveHist=[],liveBusy=false,picked={};
if(Cube&&$('#liveCube')){live=Cube.view($('#liveCube'),{});if(live){liveState=Cube.solved();live.show(liveState);$('#liveCube .fallback').style.opacity='0'}}
var liveSvg=(!live&&$('#liveCube .fallback'))?SvgCube($('#liveCube .fallback')):null;
function animMoves(moves,ms){return new Promise(function(res){var i=0;(function next(){if(i>=moves.length){res();return}var m=moves[i],base=liveState,t0=performance.now();(function step(now){var f=Math.min(1,(now-t0)/ms);live.show(Cube.apply(base,m,easeIO(f)));if(f<1)requestAnimationFrame(step);else{liveState=Cube.snap(Cube.apply(base,m,1));live.show(liveState);i++;next()}})(t0)})()})}
var solveBtn=$('#solveBtn'),hint=$('#toolHint'),resEl=$('#result'),liveTimer=$('#liveTimer'),liveLbl=$('#liveState');
function pickedCount(){return Object.keys(picked).filter(function(k){return picked[k]}).length}
function updHint(){var n=pickedCount();solveBtn.disabled=n===0||liveBusy;hint.textContent=n===0?'Pick at least one to start.':(n+(n===1?' thing':' things')+' tangled. Ready when you are.')}
$$('#probs button').forEach(function(b){b.addEventListener('click',function(){
  var i=b.getAttribute('data-p'),on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));picked[i]=on;updHint();
  if(on&&!live&&liveSvg&&!liveBusy){liveBusy=true;liveLbl.textContent='Scrambling';liveSvg.scramble(5).then(function(){liveBusy=false;liveLbl.textContent='Scrambled';updHint()})}
  if(on&&live&&!liveBusy){var mv=Cube.rand(3);liveHist=liveHist.concat(mv);liveBusy=true;liveLbl.textContent='Scrambling';animMoves(mv,170).then(function(){liveBusy=false;liveLbl.textContent='Scrambled';updHint()})}
})});
if(solveBtn)solveBtn.addEventListener('click',function(){
  if(liveBusy)return;var chosen=PROBS.filter(function(p,i){return picked[i]});if(!chosen.length)return;
  function showResult(sec){
    resEl.textContent='';
    chosen.forEach(function(p){var li=document.createElement('li');var b=document.createElement('b');b.textContent=p.t;var s=document.createElement('span');s.textContent=p.team+': '+p.svc;var a=document.createElement('a');a.className='link';a.href=p.href;a.innerHTML='See how <svg aria-hidden="true"><use href="#arrow"/></svg>';li.appendChild(b);li.appendChild(a);li.appendChild(s);resEl.appendChild(li)});
    if(G&&!RM)gsap.from(resEl.children,{y:24,opacity:0,duration:.6,stagger:.07,ease:'power3.out'});
    hint.textContent='Solved in '+sec+' seconds. Here is who handles what.';
  }
  if(!live&&!liveSvg){showResult('0.00');return}
  if(!live){liveBusy=true;solveBtn.disabled=true;liveLbl.textContent='Solving';var s0=performance.now(),go=true;
    (function tk(){if(!go)return;liveTimer.innerHTML=((performance.now()-s0)/1000).toFixed(2)+'<small>s</small>';requestAnimationFrame(tk)})();
    liveSvg.solve().then(function(){go=false;var sec=((performance.now()-s0)/1000).toFixed(2);liveTimer.innerHTML=sec+'<small>s</small>';liveLbl.textContent='Solved';liveSvg.pop();liveBusy=false;updHint();showResult(sec)});return}
  liveBusy=true;solveBtn.disabled=true;liveLbl.textContent='Solving';
  var mv=Cube.inverse(liveHist);liveHist=[];var t0=performance.now(),run=true;
  (function tick(){if(!run)return;liveTimer.innerHTML=((performance.now()-t0)/1000).toFixed(2)+'<small>s</small>';requestAnimationFrame(tick)})();
  animMoves(mv,RM?1:150).then(function(){run=false;var sec=((performance.now()-t0)/1000).toFixed(2);liveTimer.innerHTML=sec+'<small>s</small>';liveLbl.textContent='Solved';live.pop();liveBusy=false;updHint();showResult(sec)});
});

/* ---------- tabs, toggles, matcher ---------- */
function placePill(g){var p=$('.pill',g),a=$('[aria-selected="true"]',g);if(!p||!a)return;p.style.left=a.offsetLeft+'px';p.style.top=a.offsetTop+'px';p.style.width=a.offsetWidth+'px';p.style.height=a.offsetHeight+'px'}
window.addEventListener('resize',function(){$$('[role="tablist"]').forEach(placePill)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){$$('[role="tablist"]').forEach(placePill);if(G)ScrollTrigger.refresh()});
function tabset(g,onPick){if(!g)return;var tabs=$$('[role="tab"]',g);function pick(t,f){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1});placePill(g);if(f)t.focus();onPick(t.getAttribute('data-k'),t)}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(t)});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pick(tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length],true)}})});onPick(tabs[0].getAttribute('data-k'),tabs[0])}
var CY={assess:{t:'Know exactly where you stand.',p:'Independent testing and audits that show your real exposure, followed by a clear plan to close every gap.',c:['Vulnerability assessment and penetration testing','Compliance audits','Cloud security assessments','ISO 27001, ISO 22301 and ISO 20000 implementation','PCI DSS consultancy','Phishing simulation','Information security awareness','Personal data protection implementation']},
 soc:{t:'Eyes on your systems, day and night.',p:'Our Security Operations Centre watches your environment around the clock and moves fast when something looks wrong.',c:['24x7 monitoring','Incident response','Cyber threat intelligence']},
 red:{t:'Attacked by friends first.',p:'Our specialists think like real attackers, inside and outside your network, so you find the weak points before anyone else does.',c:['External red teaming','Internal red teaming','Outcome based engagements']},
 adopt:{t:'The right security technology, set up right.',p:'We select, deploy and run the tools that protect you, sized to your risk and budget.',c:['Next generation firewalls','SIEM and log management','Web application firewalls','EDR and XDR','Cloud security','CASB operations','WAN optimisation','Data loss prevention and classification','Vulnerability management','Privileged access management','Network access control','DDoS protection and assessment']}};
tabset($('#cyTabs'),function(k,t){var d=CY[k];$('#cyTitle').textContent=d.t;$('#cyText').textContent=d.p;$('#cyPanel').setAttribute('aria-labelledby',t.id);var box=$('#cyChips');box.textContent='';d.c.forEach(function(c,i){var s=document.createElement('span');s.style.setProperty('--i',i);s.textContent=c;box.appendChild(s)})});
var OPS={aug:{h:'Your team, extended.',p:'We recruit, employ and manage skilled people who work as part of your team. They follow your direction and use your tools, while salaries, benefits and HR stay on our payroll.',l:['Accountants, developers, analysts and support staff','Scale up for a project, scale down when it ends','No hiring costs, no HR overhead, no long notice periods','A Makros manager who keeps quality on track'],b:'Best for teams that know the work but need more hands, quickly and without adding permanent headcount.'},
 man:{h:'Hand over the whole process.',p:'We take responsibility for an entire function and deliver the finished output. You keep full visibility, in your own system or one we set up for you.',l:['Finance and accounting, from financial strategy to monthly statements','Agreed turnaround times and a named lead','We work in your system, or set one up if you rely on spreadsheets','Financial controls and a monthly review with you'],b:'Finance is one example. A client sends receipts, invoices and bank statements each month, and we deliver the profit and loss, balance sheet and cash flow, with a review of what they mean.'}};
tabset($('#opsToggle'),function(k,t){var d=OPS[k],P=$('#opsPanel');P.setAttribute('aria-labelledby',t.id);P.textContent='';var a=document.createElement('div');var h=document.createElement('h3');h.textContent=d.h;a.appendChild(h);var p=document.createElement('p');p.className='ink2';p.style.cssText='margin-top:16px;max-width:46ch';p.textContent=d.p;a.appendChild(p);var ul=document.createElement('ul');ul.className='ticks';d.l.forEach(function(x,i){var li=document.createElement('li');li.style.setProperty('--i',i);li.innerHTML='<svg aria-hidden="true"><use href="#tick"/></svg>';li.appendChild(document.createTextNode(x));ul.appendChild(li)});a.appendChild(ul);P.appendChild(a);var b=document.createElement('p');b.className='mid';b.style.cssText='background:var(--ground);border-radius:24px;padding:32px';b.textContent=d.b;P.appendChild(b)});
var IND={Retail:'stock, point of sale and multi channel sales',Manufacturing:'production planning, bills of materials and costing',Services:'projects, time tracking and billing',Healthcare:'patient billing, inventory and compliance',Hospitality:'bookings, food and beverage costing and purchasing',Distribution:'warehousing, routes and order management'};
var SIZE={'Growing team':['a growing team','85%','45%'],'Established SME':['an established SME','65%','70%'],'Multi site group':['a multi site group','45%','95%']},ind='Retail',size='Growing team';
function erp(){var s=SIZE[size];$('#erpTitle').textContent='A '+ind.toLowerCase()+' ERP for '+s[0];$('#erpText').textContent='We shortlist partner systems built for '+IND[ind]+', sized for '+s[0]+', then compare them with you side by side before anything is signed.';$('#bBudget').style.setProperty('--v',s[1]);$('#bScale').style.setProperty('--v',s[2])}
function opts(id,set){$$('#'+id+' button').forEach(function(b){b.addEventListener('click',function(){$$('#'+id+' button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});set(b.textContent);erp()})})}
opts('indOpts',function(v){ind=v});opts('sizeOpts',function(v){size=v});

/* ---------- contact ---------- */
var form=$('#cform');
if(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#f-name'),em=$('#f-email'),nv=n.value.trim(),ev=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
    $('#e-name').textContent=nv?'':'Please tell us your name.';
    $('#e-email').textContent=ev?'':'Enter an email like name@company.com so we can reply.';
    n.setAttribute('aria-invalid',String(!nv));em.setAttribute('aria-invalid',String(!ev));
    if(!nv||!ev){(nv?em:n).focus();return}
    var needs=$$('.need input:checked').map(function(c){return c.value}).join(', ')||'Not specified';
    var body='Name: '+nv+'\nCompany: '+($('#f-co').value.trim()||'Not given')+'\nEmail: '+em.value.trim()+'\nPhone: '+($('#f-phone').value.trim()||'Not given')+'\nHelp with: '+needs+'\n\n'+$('#f-msg').value.trim();
    location.href='mailto:hello@makrossolutions.com?subject='+encodeURIComponent('Website enquiry from '+nv)+'&body='+encodeURIComponent(body);
    $('#sName').textContent=nv.split(' ')[0];$('#formBody').hidden=true;$('#sent').hidden=false;
  });
  $('#again').addEventListener('click',function(){form.reset();$('#formBody').hidden=false;$('#sent').hidden=true;$('#f-name').focus()});
}
$$('.copyBtn').forEach(function(b){b.addEventListener('click',function(){var t=b.getAttribute('data-copy');function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}function sel(){var s=b.previousElementSibling,r=document.createRange();r.selectNodeContents(s);var g=getSelection();g.removeAllRanges();g.addRange(r);b.textContent='Selected'}try{navigator.clipboard.writeText(t).then(done,sel)}catch(err){sel()}})});

/* ---------- motion per page ---------- */
var ctx=null,mm=null;
function reveals(page){
  $$('.split',page).forEach(function(h){gsap.from($$('.wi',h),{yPercent:115,duration:1.05,ease:'power4.out',stagger:.06,scrollTrigger:{trigger:h,start:'top 88%',once:true}})});
  var groups={};$$('.r',page).forEach(function(el){var sec=el.closest('section,article,.tIntro')||page;var id=sec._rid||(sec._rid=Math.random());(groups[id]=groups[id]||{sec:sec,els:[]}).els.push(el)});
  Object.keys(groups).forEach(function(k){var g=groups[k];gsap.from(g.els,{y:30,opacity:0,duration:.9,ease:'power3.out',stagger:.08,delay:.12,scrollTrigger:{trigger:g.els[0],start:'top 90%',once:true}})});
}
function initHome(page){
  mm.add('(min-width: 901px)',function(){
    var track=$('#track');
    var hz=gsap.to(track,{x:function(){return -(track.scrollWidth-window.innerWidth)},ease:'none',scrollTrigger:{trigger:'#teams',start:'top top',end:function(){return '+='+(track.scrollWidth-window.innerWidth)},pin:true,scrub:.8,invalidateOnRefresh:true}});
    $$('.team',track).forEach(function(t){
      /* cards already on screen when the section arrives (wide screens) reveal as it scrolls in; the rest reveal as they slide past */
      var onScreen=t.offsetLeft<window.innerWidth*.8;
      function trig(at){return onScreen?{trigger:'#teams',start:'top 70%',once:true}:{trigger:t,containerAnimation:hz,start:'left '+at,once:true}}
      gsap.from($$('.scene',t),{y:70,scale:.94,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:trig('75%')});
      gsap.from($$('h3, .mid, .svcList li, .link, .tl',t),{y:24,opacity:0,duration:.8,ease:'power3.out',stagger:.04,scrollTrigger:trig('75%')});
    });
  });
  mm.add('(max-width: 900px)',function(){
    $$('.team .scene').forEach(function(s){gsap.from(s,{y:50,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 88%',once:true}})});
  });
  /* the hero cube turns and drifts as you scroll away from it */
  if(hero){
    ScrollTrigger.create({trigger:'#hero',start:'top top',end:'bottom top',scrub:.6,onUpdate:function(s){hero.set({scroll:s.progress})}});
    gsap.to('#heroR',{yPercent:16,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
  }
  /* flow lines draw with the scroll */
  $$('.drawLines path').forEach(function(p){var L=p.getTotalLength();gsap.fromTo(p,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.flowWrap',start:'top 80%',end:'bottom 55%',scrub:true}})});
  /* stacked process cards */
  var cards=$$('#stack .card');
  cards.forEach(function(c,i){if(i===cards.length-1)return;gsap.to(c,{scale:.93,ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top 30%',scrub:true}})});
  cards.forEach(function(c){gsap.from($$('.tl',c),{scale:0,transformOrigin:'50% 50%',duration:.5,ease:'back.out(2)',stagger:.012,scrollTrigger:{trigger:c,start:'top 70%',once:true}})});
  /* the name collapses as you scroll: Makários loses two letters and becomes Makros (a CSS variable keeps the width in em) */
  gsap.fromTo('#name .gone',{'--g':1},{'--g':0,ease:'none',scrollTrigger:{trigger:'#name .bigWord',start:'top 72%',end:'top 22%',scrub:true}});
  /* the Greek word drifts behind; the three meanings turn into place like a row of the cube */
  gsap.fromTo('#name .nameGhost span',{xPercent:6},{xPercent:-30,ease:'none',scrollTrigger:{trigger:'#name',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('#name .mTiles li',{rotationX:-100,opacity:0,transformOrigin:'50% 0%',duration:1,ease:'back.out(1.5)',stagger:.14,clearProps:'transform,opacity',scrollTrigger:{trigger:'#name .mTiles',start:'top 88%',once:true}});
}
function initPage(name){
  if(ctx){ctx.revert();ctx=null}
  if(mm){mm.revert();mm=null}
  var page=$('main');
  if(!G||RM)return;
  mm=gsap.matchMedia();
  ctx=gsap.context(function(){
    reveals(page);
    if(name==='home')initHome(page);
    $$('.kin [data-drift]',page).forEach(function(rw){var d=+rw.getAttribute('data-drift');gsap.fromTo(rw,{xPercent:d<0?0:-18},{xPercent:d<0?-18:0,ease:'none',scrollTrigger:{trigger:rw,start:'top bottom',end:'bottom top',scrub:true}})});
    $$('.loopGone',page).forEach(function(g){gsap.fromTo(g,{'--g':1},{'--g':0,duration:.9,ease:'power3.inOut',repeat:-1,yoyo:true,repeatDelay:1.6,delay:1})});
    var spans=$$('.giant span');gsap.from(spans,{yPercent:100,duration:1.1,ease:'power4.out',stagger:.06,scrollTrigger:{trigger:'#foot',start:'top 70%',once:true}});
  },document.body);
  requestAnimationFrame(function(){ScrollTrigger.refresh()});
}

/* ---------- pages, with the tile wipe carried between them ---------- */
var PAGE=document.body.getAttribute('data-page')||'home',wipe=$('#wipe'),root=document.documentElement,leaving=false;
function arrive(){
  if(!root.classList.contains('arriving'))return;
  wipe.className='in';void wipe.offsetWidth;root.classList.remove('arriving');
  requestAnimationFrame(function(){requestAnimationFrame(function(){wipe.className='out';setTimeout(function(){wipe.className=''},560)})});
}
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||(a.target&&a.target!=='_self')||a.hasAttribute('download'))return;
  if(a.origin!==location.origin||!/\.html$/.test(a.pathname))return;
  e.preventDefault();
  if(navOpen)setMenu(false);
  if(a.pathname===location.pathname){toTop();return}
  if(RM||leaving){location.href=a.href;return}
  leaving=true;try{sessionStorage.setItem('mkw','1')}catch(err){}
  wipe.className='in';setTimeout(function(){location.href=a.href},480);
});
window.addEventListener('pageshow',function(e){if(e.persisted){leaving=false;wipe.className='';root.classList.remove('arriving')}});
initPage(PAGE);
requestAnimationFrame(function(){$$('[role="tablist"]').forEach(placePill)});
arrive();

  // trailer: plays muted while on screen, sound on restarts it from the top
  (function(){var v=document.getElementById('reelVid'),b=document.getElementById('reelSound');if(!v||!b)return;
    var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,seen=false;
    function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
    if('IntersectionObserver'in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!calm||!v.muted||seen)play();}else v.pause()})},{threshold:.35}).observe(v)}else if(!calm)play();
    b.addEventListener('click',function(){var on=v.muted;v.muted=!on;if(on){v.currentTime=0;seen=true;play()}b.setAttribute('aria-pressed',on?'true':'false');b.querySelector('span').textContent=on?'Sound off':'Sound on'});
  })();
})();
