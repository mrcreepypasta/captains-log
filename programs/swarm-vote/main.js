const c=document.getElementById('c'),x=c.getContext('2d'),log=document.getElementById('log');
const H={x:300,y:210};const COLS=['#e85d3a','#4fb3a9','#b07ce8','#7cc84a','#e8d84a','#e87cb0'];
const QUORUM=22;let bees,sites,t,done,stopOn=true;
function rnd(a,b){return a+Math.random()*(b-a)}
function reset(){t=0;done=null;sites=[];
for(let i=0;i<6;i++){let a=i/6*Math.PI*2+rnd(-.3,.3),r=rnd(140,190);
sites.push({x:H.x+Math.cos(a)*r*1.35,y:H.y+Math.sin(a)*r*.95,q:Math.floor(rnd(2,10)),col:COLS[i],n:0})}
bees=[];for(let i=0;i<160;i++){let a=rnd(0,7),r=rnd(0,18);
bees.push({x:H.x+Math.cos(a)*r,y:H.y+Math.sin(a)*r,site:null,state:i<14?'scout':'rest',dance:0,tx:0,ty:0,tw:0})}
for(const b of bees)if(b.state==='scout'){b.tx=rnd(20,580);b.ty=rnd(20,400)}
log.textContent='Scouts heading out...'}
function toward(b,tx,ty,sp){let dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy);if(d<sp){b.x=tx;b.y=ty;return true}b.x+=dx/d*sp+rnd(-.4,.4);b.y+=dy/d*sp+rnd(-.4,.4);return false}
function step(){if(done){for(const b of bees)toward(b,done.x,done.y,1.6);return}t++;
for(const b of bees){
if(b.state==='scout'){ // searching at random
if(toward(b,b.tx,b.ty,1.4)){b.tx=rnd(20,580);b.ty=rnd(20,400)}
for(const s of sites)if(Math.hypot(s.x-b.x,s.y-b.y)<20){b.site=s;b.dance=s.q*10;b.state='home'}}
else if(b.state==='home'){if(toward(b,H.x+rnd(-15,15),H.y+rnd(-15,15),1.6)){b.state='dancing';b.tw=b.dance}}
else if(b.state==='dancing'){b.x=H.x+Math.cos(t*.3+b.dance)*14;b.y=H.y+Math.sin(t*.3+b.dance)*14;b.tw--;
if(Math.random()<.04){let r=bees[Math.floor(Math.random()*bees.length)];if(r.state==='rest'){r.site=b.site;r.dance=r.site.q*10;r.state='going'}}
if(stopOn&&Math.random()<.03){let o=bees[Math.floor(Math.random()*bees.length)];if(o.state==='dancing'&&o.site!==b.site){o.tw-=25}}
if(b.tw<=0){b.dance-=12;if(b.dance<=0){b.site=null;b.state='rest'}else b.state='going'}}
else if(b.state==='going'){if(toward(b,b.site.x+rnd(-10,10),b.site.y+rnd(-10,10),1.5)){b.state='at';b.tw=Math.floor(rnd(40,90))}}
else if(b.state==='at'){b.tw--;b.x+=rnd(-.5,.5);b.y+=rnd(-.5,.5);if(b.tw<=0)b.state='home'}
else if(b.state==='rest'){if(Math.random()<.0008){b.state='scout';b.tx=rnd(20,580);b.ty=rnd(20,400)}}}
for(const s of sites){let n=bees.filter(b=>b.site===s&&b.state==='at').length;s.n=n;
if(n>=QUORUM&&!done){done=s;let best=Math.max(...sites.map(z=>z.q));
log.textContent='Quorum at the q'+s.q+' site after '+t+' ticks'+(s.q===best?' (the best site).':' (not the best one this time).')+' The swarm lifts.'}}
if(!done&&t%60===0){let counts=sites.map(s=>bees.filter(b=>b.site===s).length);log.textContent='Committed bees: '+sites.map((s,i)=>'q'+s.q+': '+counts[i]).join('   ')}}
function draw(){x.fillStyle='#1d160c';x.fillRect(0,0,600,420);
for(const s of sites){x.strokeStyle=s.col;x.lineWidth=s===done?4:1.5;x.beginPath();for(let k=0;k<6;k++){let a=k/6*Math.PI*2;x.lineTo(s.x+Math.cos(a)*18,s.y+Math.sin(a)*18)}x.closePath();x.stroke();
let f=Math.min(1,s.n/QUORUM);x.fillStyle=s.col;x.globalAlpha=.25;x.fillRect(s.x-18,s.y+22,36*f,4);x.globalAlpha=1;x.strokeRect(s.x-18,s.y+22,36,4);
x.font='11px Georgia';x.fillText('q'+s.q,s.x-7,s.y+40)}
x.fillStyle='#5a4320';x.beginPath();x.arc(H.x,H.y,22,0,7);x.fill();
for(const b of bees){x.fillStyle=b.site?b.site.col:'#e8a317';x.beginPath();x.arc(b.x,b.y,2.4,0,7);x.fill()}
if(done){x.fillStyle='rgba(232,163,23,.12)';x.fillRect(0,0,600,420)}}
function loop(){step();step();draw();requestAnimationFrame(loop)}
document.getElementById('r').onclick=reset;
document.getElementById('s').onclick=e=>{stopOn=!stopOn;e.target.textContent='Stop signals: '+(stopOn?'on':'off')};
reset();loop();