/* multiplayer.js — classmates & teacher walk together using the claude.ai "room" capability (presence). Works on the PUBLISHED page for signed-in invited people. */
let ROOM=null,PEERS=[],AV={},lastSend=0,MYSAY=null,SAYTS={};const LOG=[];
const hueOf=n=>[...String(n||'?')].reduce((a,c)=>a+c.charCodeAt(0),0)*37%360;
function tagTex(txt,bg,fg,w,h,fs){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font=`bold ${fs}px sans-serif`;g.textAlign='center';g.textBaseline='middle';let f=fs;while(g.measureText(txt).width>w-16&&f>8){f-=2;g.font=`bold ${f}px sans-serif`}g.fillText(txt,w/2,h/2);return new T.CanvasTexture(c)}
function spr(txt,bg,fg,sx,sy,y){const s=new T.Sprite(new T.SpriteMaterial({map:tagTex(txt,bg,fg,256,64,28),depthTest:false,fog:false}));s.scale.set(sx,sy,1);s.position.y=y;s.renderOrder=9;return s}
function mkAv(p){const g=new T.Group(),M=(c)=>new T.MeshStandardMaterial({color:c}),m=(G0,c,x,y,z)=>{const o=new T.Mesh(G0,M(c));o.position.set(x,y,z);o.castShadow=true;g.add(o);return o},col=new T.Color().setHSL((p.h||200)/360,.65,.5).getHex();
 [-.1,.1].forEach(x=>m(new T.CylinderGeometry(.07,.07,.8,6),0x2a3a5a,x,.4,0));m(new T.CylinderGeometry(.21,.17,.72,8),col,0,1.15,0);m(new T.SphereGeometry(.16,8,6),0xd9a678,0,1.68,0);m(new T.SphereGeometry(.17,8,6,0,7,0,1.4),0x1a1208,0,1.71,0);m(new T.BoxGeometry(.05,.05,.06),0xb88860,0,1.66,.16);
 if(p.r==1){m(new T.BoxGeometry(.4,.05,.4),0x111111,0,1.9,0);m(new T.BoxGeometry(.24,.1,.24),0x111111,0,1.84,0)}
 g.userData={n:p.n,r:p.r};g.add(spr((p.r==1?'👩‍🏫 ':'')+String(p.n||'Bisita'),p.r==1?'#b8860b':'#0b3d91','#fff',1.6,.4,2.35));return g}
function mpInit(){if(window.claude&&claude.use)claude.use('room').then(r=>{if(!r||ROOM)return;ROOM=r;r.onPeers(()=>{});tst('👥 Multiplayer connected')}).catch(()=>{});(function lp(){requestAnimationFrame(lp);mpTick()})()}
function mpTick(){if(!ROOM||!R)return;const now=performance.now(),p=cam.position;if(now-lastSend>100){lastSend=now;if(MYSAY&&Date.now()-MYSAY.ts>10000)MYSAY=null;ROOM.presence({x:+p.x.toFixed(2),z:+p.z.toFixed(2),y:+yaw.toFixed(2),n:(S.pname||'Bisita').slice(0,20),h:hueOf(S.pname),r:S.role||0,s:MYSAY}).catch(()=>{})}
 PEERS=ROOM.peers().filter(q=>!q.isMe&&q.presence&&q.presence.x!=null).map(q=>({id:q.peer,...q.presence}));const seen={};
 PEERS.forEach(q=>{seen[q.id]=1;let a=AV[q.id];if(!a||a.userData.n!=q.n||a.userData.r!=q.r){if(a)scene.remove(a);a=AV[q.id]=mkAv(q);a.position.set(q.x,0,q.z);scene.add(a)}
  const dx=q.x-a.position.x,dz=q.z-a.position.z;a.position.x+=dx*.25;a.position.z+=dz*.25;a.rotation.y=q.y+PI;a.position.y=Math.hypot(dx,dz)>.03?Math.abs(Math.sin(now/110))*.05:0;
  const sy=q.s&&q.s.t?q.s:null;if(sy&&SAYTS[q.id]!=sy.ts){SAYTS[q.id]=sy.ts;LOG.push({n:q.n,t:String(sy.t)});if(LOG.length>30)LOG.shift();if(a.bub)a.remove(a.bub);a.bub=spr(String(sy.t).slice(0,60),'#fff','#111',2.6,.5,2.85);a.add(a.bub);a.bubT=now}
  if(a.bub&&now-a.bubT>9000){a.remove(a.bub);a.bub=null}});
 Object.keys(AV).forEach(k=>{if(!seen[k]){scene.remove(AV[k]);delete AV[k]}})}
function saySend(){const i=$('mpsay'),t=(i.value||'').trim().slice(0,60);if(!t||!ROOM)return;MYSAY={t,ts:Date.now()};LOG.push({n:(S.pname||'Ako')+' (you)',t});i.value='';cls()}
function cls(){op(`<h2>👥 CLASS / MULTIPLAYER</h2><label class="f">Your name<input id="mpn" value="${esc(S.pname||'')}" maxlength="20" placeholder="e.g. Juan – Grade 8" onchange="S.pname=this.value.trim();persist()"></label>
 <label class="f">I am a<select onchange="S.role=+this.value;persist()"><option value="0" ${S.role?'':'selected'}>Student</option><option value="1" ${S.role==1?'selected':''}>Teacher</option></select></label>
 ${ROOM?`<p><b>Online now:</b> ${PEERS.length+1} (including you)</p>${PEERS.map(p=>`<button class="li" onclick="tp(${p.x},${p.z+2},PI);cl()">${p.r==1?'👩‍🏫':'🧑‍🎓'} ${esc(p.n||'Bisita')} — go to them</button>`).join('')||'<p><small>Nobody else is here yet.</small></p>'}
 <h3>Chat</h3><div style="max-height:150px;overflow:auto;background:#fff;padding:6px;border:1px solid #999">${LOG.map(l=>`<div><b>${esc(l.n)}:</b> ${esc(l.t)}</div>`).join('')||'<small>No messages yet.</small>'}</div><div class="row"><input id="mpsay" maxlength="60" placeholder="Type a message…" style="flex:1" onkeydown="if(event.key=='Enter')saySend()"><button onclick="saySend()">Send</button></div>`
 :`<p><b>Not connected.</b> Tap <b>🌐 Online</b> in the top bar to create or join a room.</p>`}
 <div class="row"><button onclick="cl()">Close</button></div>`)}
