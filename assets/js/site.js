(function(){
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=window.matchMedia('(pointer: fine)').matches;
var G=!!(window.gsap&&window.ScrollTrigger);
if(G)gsap.registerPlugin(ScrollTrigger);
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}

/* ---------- smooth scroll ---------- */
var lenis=null;
if(window.Lenis&&!RM){
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
  function view(host,opts){
    opts=opts||{};
    var r;try{r=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return null}
    if(!r.getContext())return null;
    r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.setClearColor(0,0);host.appendChild(r.domElement);
    var scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-3,3,3,-3,.1,100);cam.position.set(10,10,10);cam.lookAt(0,0,0);
    var root=new THREE.Group();scene.add(root);
    var body=new THREE.MeshBasicMaterial({color:0x0B1030}),box=new THREE.BoxGeometry(1,1,1);
    var h=.42,rr=.09,sh=new THREE.Shape();sh.moveTo(-h+rr,-h);sh.lineTo(h-rr,-h);sh.quadraticCurveTo(h,-h,h,-h+rr);sh.lineTo(h,h-rr);sh.quadraticCurveTo(h,h,h-rr,h);sh.lineTo(-h+rr,h);sh.quadraticCurveTo(-h,h,-h,h-rr);sh.lineTo(-h,-h+rr);sh.quadraticCurveTo(-h,-h,-h+rr,-h);
    var sg=new THREE.ShapeGeometry(sh,6),SK=new THREE.MeshBasicMaterial({color:0x1E9BE6}),VI=new THREE.MeshBasicMaterial({color:0x7563EE}),MI=new THREE.MeshBasicMaterial({color:0x17A985}),O=.503,cubies=[];
    for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++){
      var g=new THREE.Group();g.add(new THREE.Mesh(box,body));var m;
      if(x===1){m=new THREE.Mesh(sg,MI);m.rotation.y=Math.PI/2;m.position.x=O;g.add(m)}
      if(x===-1){m=new THREE.Mesh(sg,MI);m.rotation.y=-Math.PI/2;m.position.x=-O;g.add(m)}
      if(y===1){m=new THREE.Mesh(sg,SK);m.rotation.x=-Math.PI/2;m.position.y=O;g.add(m)}
      if(y===-1){m=new THREE.Mesh(sg,SK);m.rotation.x=Math.PI/2;m.position.y=-O;g.add(m)}
      if(z===1){m=new THREE.Mesh(sg,VI);m.position.z=O;g.add(m)}
      if(z===-1){m=new THREE.Mesh(sg,VI);m.rotation.y=Math.PI;m.position.z=-O;g.add(m)}
      g.position.set(x,y,z);root.add(g);cubies.push(g);
    }
    function fit(){var w=host.clientWidth,hh=host.clientHeight;if(!w||!hh)return;r.setSize(w,hh,false);r.domElement.style.width='100%';r.domElement.style.height='100%';var a=w/hh,top=3,right=3*a;if(right<2.75){right=2.75;top=right/a}cam.left=-right;cam.right=right;cam.top=top;cam.bottom=-top;cam.updateProjectionMatrix()}
    fit();if(window.ResizeObserver)new ResizeObserver(fit).observe(host);else window.addEventListener('resize',fit);
    var tgx=0,tgy=0,rx=0,ry=0,vis=true,pop=-1;
    if(opts.tilt&&FINE&&!RM){var area=opts.tilt;area.addEventListener('pointermove',function(e){var b=area.getBoundingClientRect();tgy=((e.clientX-b.left)/b.width-.5)*.34;tgx=((e.clientY-b.top)/b.height-.5)*.2});area.addEventListener('pointerleave',function(){tgx=0;tgy=0})}
    if(window.IntersectionObserver)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(host);
    (function loop(now){if(vis&&!document.hidden&&host.offsetParent!==null){rx+=(tgx-rx)*.07;ry+=(tgy-ry)*.07;root.rotation.x=rx;root.rotation.y=ry;var s=1;if(pop>0){var t=(now-pop)/480;if(t<1)s=1+.05*Math.sin(Math.PI*t);else pop=-1}root.scale.setScalar(s);r.render(scene,cam)}requestAnimationFrame(loop)})(0);
    return {show:function(st){for(var i=0;i<27;i++){cubies[i].position.copy(st[i].p);cubies[i].quaternion.copy(st[i].q)}},pop:function(){pop=performance.now()}};
  }
  return {solved:solved,apply:apply,snap:snap,inverse:inverse,rand:rand,note:note,sequence:sequence,at:at,view:view};
})();

/* ---------- hero: scroll solves the cube ---------- */
var HERO_SCR=[{a:'x',l:1,d:-1},{a:'y',l:1,d:1},{a:'z',l:1,d:-1},{a:'x',l:-1,d:1},{a:'y',l:-1,d:-1},{a:'z',l:-1,d:1},{a:'x',l:1,d:1},{a:'y',l:1,d:-1},{a:'z',l:0,d:1},{a:'x',l:-1,d:-1},{a:'y',l:1,d:1},{a:'z',l:1,d:1},{a:'x',l:0,d:-1}];
var hero=null,heroSeq=null,heroP=1,heroTween=null;
if(Cube&&$('#heroCube')){heroSeq=Cube.sequence(HERO_SCR);hero=Cube.view($('#heroCube'),{tilt:$('#hero')})}
if(hero){$('#heroFallback').style.opacity='0'}
var movesEl=$('#moves'),moveSpans=[];
if(heroSeq){heroSeq.solve.forEach(function(m){var s=document.createElement('span');s.textContent=Cube.note(m);movesEl.appendChild(s);moveSpans.push(s)})}
var tangles=$$('#tangles li'),timerEl=$('#timer');
function drawHero(p){
  heroP=p;
  if(hero)hero.show(Cube.at(heroSeq,p));
  timerEl.innerHTML=(p*3.42).toFixed(2)+'<small>s</small>';
  var N=moveSpans.length,k=Math.min(N-1,Math.floor(p*N));
  moveSpans.forEach(function(s,i){s.className=p>=1?'gone':(i<k?'gone':(i===k&&p>0?'now':''))});
  var stage=p>=.995?3:Math.min(2,Math.floor(p*3));
  tangles.forEach(function(li,i){li.className=i<stage?'done':(i===stage?'on':'')});
}
var poppedOnce=false;
function heroSolvedCheck(p){if(p>=.995&&!poppedOnce&&hero){hero.pop();poppedOnce=true}if(p<.9)poppedOnce=false}
function tween(from,to,dur,ease,cb,done){var t0=performance.now();(function step(now){var t=Math.min(1,(now-t0)/dur);cb(from+(to-from)*ease(t));if(t<1)requestAnimationFrame(step);else if(done)done()})(t0)}
function easeIO(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

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
function animMoves(moves,ms){return new Promise(function(res){var i=0;(function next(){if(i>=moves.length){res();return}var m=moves[i],base=liveState,t0=performance.now();(function step(now){var f=Math.min(1,(now-t0)/ms);live.show(Cube.apply(base,m,easeIO(f)));if(f<1)requestAnimationFrame(step);else{liveState=Cube.snap(Cube.apply(base,m,1));live.show(liveState);i++;next()}})(t0)})()})}
var solveBtn=$('#solveBtn'),hint=$('#toolHint'),resEl=$('#result'),liveTimer=$('#liveTimer'),liveLbl=$('#liveState');
function pickedCount(){return Object.keys(picked).filter(function(k){return picked[k]}).length}
function updHint(){var n=pickedCount();solveBtn.disabled=n===0||liveBusy;hint.textContent=n===0?'Pick at least one to start.':(n+(n===1?' thing':' things')+' tangled. Ready when you are.')}
$$('#probs button').forEach(function(b){b.addEventListener('click',function(){
  var i=b.getAttribute('data-p'),on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));picked[i]=on;updHint();
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
  if(!live){showResult('0.00');return}
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
 man:{h:'Hand over the whole process.',p:'We take responsibility for an entire function and deliver the finished output. You keep full visibility, with access to your own system at any time.',l:['Finance and accounting from receipts to reports','Agreed turnaround times and a named lead','Your data stays in your own system','Reports shaped to your industry and needs'],b:'For example, a client sends receipts, invoices and bank statements each month. We deliver the profit and loss, balance sheet, cash flow and age analysis.'}};
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
  var heroEl=$('#hero');
  mm.add('(min-width: 901px)',function(){
    var st=ScrollTrigger.create({trigger:heroEl,start:'top top+=76',end:'+=170%',pin:true,scrub:.6,onUpdate:function(self){if(heroTween&&self.progress<0.002)return;if(heroTween){heroTween.kill();heroTween=null}drawHero(self.progress);heroSolvedCheck(self.progress)}});
    if(st.progress<0.01){drawHero(1);heroTween=gsap.to({p:1},{p:0,duration:2,delay:.5,ease:'power2.inOut',onUpdate:function(){drawHero(this.targets()[0].p)}})}
    var track=$('#track');
    var hz=gsap.to(track,{x:function(){return -(track.scrollWidth-window.innerWidth)},ease:'none',scrollTrigger:{trigger:'#teams',start:'top top',end:function(){return '+='+(track.scrollWidth-window.innerWidth)},pin:true,scrub:.8,invalidateOnRefresh:true}});
    $$('.team',track).forEach(function(t){
      gsap.from($$('.ubars i',t),{scaleY:0,duration:.9,ease:'power3.out',stagger:.05,scrollTrigger:{trigger:t,containerAnimation:hz,start:'left 70%',once:true}});
      gsap.from($$('.age em',t),{scaleX:0,transformOrigin:'left',duration:1,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:t,containerAnimation:hz,start:'left 70%',once:true}});
      gsap.from($$('[data-ui]',t),{y:60,rotate:2,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:t,containerAnimation:hz,start:'left 75%',once:true}});
      gsap.from($$('h3, .mid, .svcList li, .link, .tl',t),{y:24,opacity:0,duration:.8,ease:'power3.out',stagger:.04,scrollTrigger:{trigger:t,containerAnimation:hz,start:'left 75%',once:true}});
    });
  });
  mm.add('(max-width: 900px)',function(){
    drawHero(1);heroTween=gsap.timeline({delay:.6}).to({p:1},{p:0,duration:1.6,ease:'power2.inOut',onUpdate:function(){drawHero(this.targets()[0].p)}}).to({p:0},{p:1,duration:3.4,ease:'none',delay:.5,onUpdate:function(){var p=this.targets()[0].p;drawHero(p);heroSolvedCheck(p)}});
  });
  /* marquee skew from scroll speed */
  var sk=gsap.quickTo('.skewer','skewX',{duration:.4,ease:'power3'});
  ScrollTrigger.create({trigger:'.band',start:'top bottom',end:'bottom top',onUpdate:function(self){sk(Math.max(-8,Math.min(8,self.getVelocity()/-260)))}});
  /* flow lines draw with the scroll */
  $$('.drawLines path').forEach(function(p){var L=p.getTotalLength();gsap.fromTo(p,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.flowWrap',start:'top 80%',end:'bottom 55%',scrub:true}})});
  /* stacked process cards */
  var cards=$$('#stack .card');
  cards.forEach(function(c,i){if(i===cards.length-1)return;gsap.to(c,{scale:.93,ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top 30%',scrub:true}})});
  cards.forEach(function(c){gsap.from($$('.tl',c),{scale:0,transformOrigin:'50% 50%',duration:.5,ease:'back.out(2)',stagger:.012,scrollTrigger:{trigger:c,start:'top 70%',once:true}})});
  /* the name collapses as you scroll */
  gsap.fromTo('#name .gone',{maxWidth:'.62em',opacity:1},{maxWidth:0,opacity:0,ease:'none',scrollTrigger:{trigger:'#name',start:'top 75%',end:'top 15%',scrub:true}});
}
function initPage(name){
  if(ctx){ctx.revert();ctx=null}
  if(mm){mm.revert();mm=null}
  var page=$('main');
  if(!G||RM){if(name==='home'){drawHero(1)}return}
  mm=gsap.matchMedia();
  ctx=gsap.context(function(){
    reveals(page);
    if(name==='home')initHome(page);
    $$('.kin [data-drift]',page).forEach(function(rw){var d=+rw.getAttribute('data-drift');gsap.fromTo(rw,{xPercent:d<0?0:-18},{xPercent:d<0?-18:0,ease:'none',scrollTrigger:{trigger:rw,start:'top bottom',end:'bottom top',scrub:true}})});
    $$('.loopGone',page).forEach(function(g){gsap.fromTo(g,{maxWidth:'.62em',opacity:1},{maxWidth:0,opacity:0,duration:.9,ease:'power3.inOut',repeat:-1,yoyo:true,repeatDelay:1.6,delay:1})});
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
if(!G&&!RM&&hero){drawHero(1);setTimeout(function(){tween(1,0,1600,easeIO,drawHero,function(){setTimeout(function(){tween(0,1,3400,function(t){return t},function(p){drawHero(p);heroSolvedCheck(p)})},500)})},600)}
if(RM&&hero)drawHero(1);
initPage(PAGE);
requestAnimationFrame(function(){$$('[role="tablist"]').forEach(placePill)});
arrive();
})();
