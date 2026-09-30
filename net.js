/* net.js — real-time multiplayer + moderator control.
   Star topology over WebRTC (PeerJS): the MODERATOR's browser is the authoritative host.
   Every shared change: client -> host (validated) -> broadcast to everyone. Nothing here needs your own server. */
const NET={on:0,host:0,code:'',id:'',off:0,conns:{},pres:{},psa:[],me:{},tbuf:{},send:null,T:null,want:0,tries:0};
let W=defW(),MA=null;
function defW(){const d=MUSEUM.world||{};return{time:{v:d.tod==null?.33:d.tod,lock:0},wx:{v:d.wx||0,lock:0},fx:{v:1,lock:0},cyc:0,edits:0,music:{id:'',playing:0,pos:0,at:0,open:0},tracks:(MUSEUM.music||[]).map(t=>({id:String(t.id),name:String(t.name),url:t.url}))}}
const hostNow=()=>Date.now()+NET.off,cs=(s,n)=>String(s==null?'':s).slice(0,n),okUrl=s=>s===''||/^(data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+|https?:\/\/[^\s"'<>]+|[\w.\/-]+)$/.test(s);
function wPub(){return JSON.parse(JSON.stringify(W,(k,v)=>k=='url'&&typeof v=='string'&&v.startsWith('blob:')?undefined:v))}
function wpath(k,v){const p=k.split('.');let o=W;while(p.length>1)o=o[p.shift()];o[p[0]]=v}
function NETforce(){if(!NET.on)return;if(W.time.lock)S.tod=W.time.v;if(W.wx.lock)S.wx=W.wx.v;if(W.fx.lock)S.fx=W.fx.v;if(W.cyc)S.cyc=0}
const _ap=apply;apply=function(){NETforce();_ap()};
const netNote=()=>NET.on?`<p><small>🌐 Online${W.time.lock?' · ⏱ time set by moderator':''}${W.wx.lock?' · 🌦 weather set by moderator':''}${W.fx.lock?' · ✨ effects set by moderator':''}</small></p>`:'';
function cleanEx(d,old){const o={...old};['title','year','cat','desc','ctx','why','src','audio','video'].forEach(k=>{if(k in d)o[k]=cs(d[k],'desc ctx why'.includes(k)?2000:300)});
 if('img' in d&&typeof d.img=='string'&&d.img.length<2.5e6&&okUrl(d.img))o.img=d.img;
 if('color' in d)o.color=/^#[0-9a-f]{6}$/i.test(d.color)?d.color:'';if('fx3d' in d)o.fx3d=[0,1,2].includes(+d.fx3d)?+d.fx3d:0;
 if('room' in d)o.room=Math.max(0,Math.min(6,+d.room|0));if('disp' in d)o.disp=Math.max(0,Math.min(7,+d.disp|0));return o}
/* ---------- host side ---------- */
function hsend(pid,m){const s=NET.conns[pid];if(s)try{s(m)}catch(e){}}
function bcast(m,except){for(const k in NET.conns)if(k!=except)hsend(k,m)}
const pname=pid=>pid=='host'?cs(S.pname||'Moderator',20):cs((NET.pres[pid]||{}).n||'Bisita',20);
function wsave(){if(NET.host)try{localStorage.setItem('museum_world',JSON.stringify(wPub()))}catch(e){}}
function exApply(pid,d){const id=+(d&&d.id);if(!(id>=1&&id<=30))return;const e=ex[id-1],ok=pid=='host'||(!W.edits&&(!e.lockId||e.lockId==pid));
 if(ok){ex[id-1]=cleanEx(d,e);ex[id-1].id=id;layout();buildAll();persist();bcast({t:'ex',d:ex[id-1]})}else if(pid!='host')hsend(pid,{t:'ex',d:e,nack:1})}
function exLock(pid,id,on){const e=ex[id-1];if(!e)return;if(on&&!e.lockId){e.lockId=pid;e.lockedBy=pname(pid)}else if(!on&&(e.lockId==pid||pid=='host')){e.lockId='';e.lockedBy=''}else{if(pid!='host')hsend(pid,{t:'ex',d:e,nack:1});return}bcast({t:'ex',d:e});persist()}
function hmsg(pid,m){if(!m||typeof m!='object')return;switch(m.t){
 case'hello':hsend(pid,{t:'welcome',id:pid,W:wPub(),ex,hn:Date.now()});Object.keys(NET.tbuf).forEach(id=>{const t=W.tracks.find(x=>x.id==id);if(t)hsend(pid,{t:'track',id,name:t.name,buf:NET.tbuf[id]})});break;
 case'p':{const p=m.p||{};NET.pres[pid]={x:+p.x||0,z:+p.z||0,y:+p.y||0,n:cs(p.n,20),h:(+p.h||0)%360,r:p.r==1?1:0,s:p.s&&p.s.t?{t:cs(p.s.t,60),ts:+p.s.ts||0}:null};break}
 case'ping':hsend(pid,{t:'pong',c:+m.c||0,hn:Date.now()});break;
 case'ex':exApply(pid,m.d);break;case'lock':exLock(pid,+m.id,!!m.on);break;
 case'mus':if(W.music.open&&m.c)musCmd(m.c);break}}
function wset(k,v){if(NET.on&&!NET.host)return;wpath(k,v);if(NET.host){bcast({t:'w',k,v});wsave()}NETforce();apply();if(k.indexOf('music')==0)musApply()}
function musCmd(c){const m=W.music;if(c.a=='play'&&W.tracks.some(t=>t.id==c.id)){m.id=c.id;m.playing=1;m.pos=0;m.at=Date.now()}else if(c.a=='pause'&&m.playing){m.pos=m.pos+(Date.now()-m.at)/1000;m.playing=0}else if(c.a=='resume'&&!m.playing&&m.id){m.playing=1;m.at=Date.now()}else if(c.a=='next')return musNext();else if(c.a=='seek'){m.pos=Math.max(0,+c.pos||0);m.at=Date.now()}else return;bcast({t:'w',k:'music',v:{...m}});musApply();wsave()}
function musNext(){const L=W.tracks.filter(t=>t.url||NET.tbuf[t.id]);if(!L.length)return;const i=L.findIndex(t=>t.id==W.music.id);musCmd({a:'play',id:L[(i+1)%L.length].id})}
function musReq(c){if(NET.host||!NET.on)musCmd(c);else if(W.music.open)NET.send({t:'mus',c})}
function addTrack(id,name,buf){let t=W.tracks.find(x=>x.id==id);if(!t){t={id,name:cs(name,60),up:1};W.tracks.push(t)}t.url=URL.createObjectURL(new Blob([buf]));return t}
function upTrack(inp){const f=inp.files[0];if(!f||!NET.host){tst('Only the moderator can upload songs');return}if(f.size>12e6){tst('Song too big (max 12 MB)');return}f.arrayBuffer().then(buf=>{const id='up'+Date.now();NET.tbuf[id]=buf;addTrack(id,f.name.replace(/\.[^.]+$/,''),buf);bcast({t:'track',id,name:f.name.replace(/\.[^.]+$/,''),buf});tst('Song added ✔');modp()})}
function musVol(){if(MA)MA.volume=Math.min(1,S.mu*S.mas*1.6)}
function musApply(){const m=W.music,tr=W.tracks.find(t=>t.id==m.id);if(!tr||!tr.url||typeof Audio=='undefined'){if(MA)MA.pause();return}
 if(typeof BG!='undefined'&&BG&&NET.on)BG.pause();if(!MA){MA=new Audio();MA.onended=()=>{if(NET.host)musNext()}}
 if(MA.dataset.id!=m.id){MA.src=tr.url;MA.dataset.id=m.id}musVol();const tgt=m.playing?m.pos+(hostNow()-m.at)/1000:m.pos;
 if(m.playing){if(Math.abs(MA.currentTime-tgt)>.6)try{MA.currentTime=tgt}catch(e){}MA.play().catch(()=>tst('Tap the screen once to start the shared music'))}else{MA.pause();try{MA.currentTime=tgt}catch(e){}}}
/* ---------- client side ---------- */
function cmsg(m){if(!m||typeof m!='object')return;switch(m.t){
 case'welcome':NET.id=m.id;NET.off=m.hn-Date.now();W=m.W;ex=m.ex;layout();buildAll();cnt();NETforce();apply();musApply();tst('🌐 Joined room '+NET.code);break;
 case'ex':if(m.d&&m.d.id>=1&&m.d.id<=30){ex[m.d.id-1]=m.d;layout();buildAll();persist();if(m.nack)tst('🔒 Not allowed: exhibit locked or editing is off')}break;
 case'w':wpath(m.k,m.v);NETforce();apply();if(m.k.indexOf('music')==0)musApply();break;
 case'track':addTrack(m.id,m.name,m.buf);musApply();break;
 case'ps':NET.psa=m.a||[];break;
 case'pong':{const rtt=Date.now()-m.c;const o=m.hn+rtt/2-Date.now();NET.off=NET.pinged?NET.off*.6+o*.4:o;NET.pinged=1;musApply();break}}}
function netEx(id){if(!NET.on)return;if(NET.host)exApply('host',ex[id-1]);else NET.send({t:'ex',d:ex[id-1]})}
function netCan(id){if(!NET.on||NET.host)return true;const e=ex[id-1];return !W.edits&&(!e.lockId||e.lockId==NET.id)}
function netLock(id){if(NET.host)exLock('host',id,!ex[id-1].lockId);else NET.send({t:'lock',id,on:!ex[id-1].lockId});setTimeout(()=>ed(id),250)}
NET.room={presence(p){NET.me={...NET.me,...p};if(NET.on&&NET.host)NET.pres.host=NET.me;else if(NET.on&&NET.send)NET.send({t:'p',p:NET.me});return Promise.resolve()},
 peers(){return (NET.psa||[]).map(q=>({peer:q.id,isMe:q.id==NET.id,presence:q}))}};
const PFX=()=>((MUSEUM.room&&MUSEUM.room.prefix)||'brgy-museum')+'-',popt=()=>MUSEUM.room&&MUSEUM.room.ice?{config:{iceServers:MUSEUM.room.ice}}:{};
NET.T={host(code,h){const p=new Peer(PFX()+code,popt());p.on('open',()=>h.open());p.on('error',h.err);p.on('connection',c=>{c.on('open',()=>h.conn(c.peer,m=>c.send(m)));c.on('data',d=>h.msg(c.peer,d));c.on('close',()=>h.close(c.peer));c.on('error',()=>h.close(c.peer))})},
 join(code,h){const p=new Peer(undefined,popt());p.on('error',h.err);p.on('open',()=>{const c=p.connect(PFX()+code,{reliable:true});c.on('open',()=>h.open(null,m=>c.send(m)));c.on('data',d=>h.msg(null,d));c.on('close',()=>h.close());c.on('error',h.err)})}};
function netErr(e){const t=e&&e.type;tst(t=='unavailable-id'?'That room code is already in use — pick another':t=='peer-unavailable'?'Room not found — is the moderator online?':'Connection problem: '+(t||e))}
function netReady(){ROOM=NET.room;if(typeof BG!='undefined'&&BG)BG.pause();clearInterval(NET.iv);clearInterval(NET.iv2);NET.iv=setInterval(()=>{if(!NET.on)return;if(NET.host){NET.pres.host=NET.me;NET.psa=Object.keys(NET.pres).map(k=>({id:k,...NET.pres[k]}));bcast({t:'ps',a:NET.psa})}else NET.send({t:'ping',c:Date.now()})},NET.host?100:5000);
 NET.iv2=setInterval(()=>{if(!NET.on||!NET.host)return;if(W.cyc)wset('time.v',(W.time.v+.0024)%1);else if(W.music.playing)bcast({t:'w',k:'music',v:{...W.music}})},1000)}
function netHost(code){NET.host=1;NET.code=code;try{const s=JSON.parse(localStorage.getItem('museum_world'));if(s&&s.time)W={...defW(),...s,tracks:defW().tracks}}catch(e){}
 if(typeof Peer=='undefined'&&NET.T.name!='sim'){tst('PeerJS did not load — check your internet');return}
 NET.T.host(code,{open(){NET.on=1;NET.id='host';netReady();wset('time.v',W.time.v);tst('🛡 Room ready: '+code);netp()},err:netErr,conn(pid,s){NET.conns[pid]=s},msg:hmsg,close(pid){delete NET.conns[pid];delete NET.pres[pid]}})}
function netJoin(code){NET.host=0;NET.code=code;NET.want=1;if(typeof Peer=='undefined'&&NET.T.name!='sim'){tst('PeerJS did not load — check your internet');return}
 NET.T.join(code,{open(id,send){NET.send=send;NET.on=1;NET.tries=0;netReady();send({t:'hello'});send({t:'ping',c:Date.now()})},err:netErr,msg:(_,m)=>cmsg(m),close(){NET.on=0;NET.send=null;if(NET.want&&NET.tries++<6){tst('Disconnected — reconnecting…');setTimeout(()=>netJoin(code),2000)}}})}
function netLeave(){NET.want=0;NET.on=0;ROOM=null;location.reload()}
function netGo(h){const n=($('nn').value.trim()||'Bisita').slice(0,20),c=($('nc').value.trim()||Math.random().toString(36).slice(2,8)).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,16);if(!c){tst('Enter a room code');return}S.pname=n;persist();cl();h?netHost(c):netJoin(c)}
function netInit(){const q=new URLSearchParams(location.search).get('room');if(q)netp(q.toUpperCase().replace(/[^A-Z0-9]/g,''))}
function netp(pre){op(`<h2>🌐 ONLINE MUSEUM</h2>${NET.on?`<p><b>Connected</b> — room <b>${esc(NET.code)}</b> ${NET.host?'· you are the <b>Moderator</b>':''}</p><p><input readonly style="width:100%" value="${esc(location.origin+location.pathname+'?room='+NET.code)}" onclick="this.select()"><small>Send this link to your groupmates.</small></p><div class="row">${NET.host?'<button onclick="modp()">🛡 Moderator panel</button>':''}<button onclick="cls()">👥 Class &amp; chat</button>${NET.host?'':'<button onclick="netLeave()">Leave</button>'}</div>`
 :`<label class="f">Your name<input id="nn" maxlength="20" value="${esc(S.pname||'')}"></label><h3>Join</h3><label class="f">Room code<input id="nc" value="${esc(pre||'')}" placeholder="e.g. AB12CD"></label><div class="row"><button onclick="netGo(0)">Join room</button></div><h3>Moderator</h3><div class="row"><button onclick="netGo(1)">Create room (I am the Moderator)</button></div><small>Leave the code empty to get a random one. The moderator must keep this page open — the moderator's browser is the host.</small>`}<div class="row"><button onclick="cl()">Close</button></div>`)}
function modp(){if(!NET.host)return;const T_=[['🌅 Sunrise',0],['🌤 Morning',.17],['☀ Noon',.33],['🌇 Afternoon',.5],['🌆 Sunset',.67],['🌃 Evening',.83],['🌙 Night',1]],ck=(p,v,l)=>`<label class="f"><input type="checkbox" style="width:auto" ${v?'checked':''} onchange="wset('${p}',+this.checked);modp()"> ${l}</label>`;
 op(`<h2>🛡 MODERATOR</h2><p>Room <b>${esc(NET.code)}</b> · players online: <b>${Object.keys(NET.conns).length}</b></p>
 <h3>Time of day</h3><div class="row">${T_.map(a=>`<button onclick="wset('time.v',${a[1]});modp()">${a[0]}</button>`).join('')}</div><label class="f">Time<input type="range" min="0" max="1" step=".01" value="${W.time.v}" oninput="wset('time.v',+this.value)"></label>${ck('time.lock',W.time.lock,'Force this time on EVERY player (untick = players choose their own)')}${ck('cyc',W.cyc,'Run automatic day/night cycle for everyone')}
 <h3>Weather</h3><label class="f"><select onchange="wset('wx.v',+this.value);modp()">${['Clear','Partly cloudy','Foggy','Rain','Thunderstorm'].map((w,i)=>`<option value="${i}" ${W.wx.v==i?'selected':''}>${w}</option>`).join('')}</select></label>${ck('wx.lock',W.wx.lock,'Force this weather on EVERY player')}
 <h3>Environment</h3>${ck('fx.v',W.fx.v,'Environment effects (butterflies, water, stars…)')}${ck('fx.lock',W.fx.lock,'Force effects setting on EVERY player')}
 <h3>Exhibits</h3>${ck('edits',W.edits,'Lock ALL editing for players (only I can edit)')}<div class="row"><button onclick="ex.forEach(e=>e.lockId&&exLock('host',e.id,false));modp()">Unlock every exhibit</button></div>
 <h3>Shared music</h3><div class="row"><button onclick="musReq({a:'pause'});modp()">⏸ Pause</button><button onclick="musReq({a:'resume'});modp()">▶ Resume</button><button onclick="musReq({a:'next'});modp()">⏭ Next</button></div>${W.tracks.map(t=>`<button class="li" onclick="musReq({a:'play',id:'${esc(t.id)}'});modp()" style="${W.music.id==t.id?'background:#cfc':''}">${W.music.id==t.id&&W.music.playing?'🔊':'▶'} ${esc(t.name)}</button>`).join('')||'<small>No songs yet. Add files to config/museum.config.js or upload one below.</small>'}
 <label class="f">Upload a song (MP3/OGG/WAV, max 12 MB — sent live to everyone)<input type="file" accept="audio/*" onchange="upTrack(this)"></label>${ck('music.open',W.music.open,'Let players choose / pause songs too')}
 <div class="row"><button onclick="netp()">Room link</button><button onclick="cl()">Close</button></div>`)}
