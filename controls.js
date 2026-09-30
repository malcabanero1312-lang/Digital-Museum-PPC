addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;keys[e.key.toLowerCase()]=1;if(e.key=='Escape')cl();if(e.key.toLowerCase()=='e'&&near)view(near);aud()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
let drag=0,mx=0,my=0,mv=0;const cv=$('cv'),lk=()=>document.pointerLockElement==cv;
cv.onpointerdown=e=>{aud();drag=1;mv=0;mx=e.clientX;my=e.clientY};
addEventListener('pointermove',e=>{if(lk()){yaw-=e.movementX*.0022*S.sens;pitch-=e.movementY*.0022*S.sens}else if(drag){const dx=e.clientX-mx,dy=e.clientY-my;mv+=Math.abs(dx)+Math.abs(dy);yaw-=dx*.005*S.sens;pitch-=dy*.005*S.sens;mx=e.clientX;my=e.clientY}pitch=Math.max(-1.5,Math.min(1.5,pitch))});
addEventListener('pointerup',e=>{if(!drag)return;drag=0;if(mv<6){let id=lk()?pick(0,0):pick(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);if(id)view(id);else if(e.pointerType=='mouse'&&!lk())cv.requestPointerLock?.()}});
const jo=$('joy'),kn=$('kn');let jp=0;const jm=e=>{const b=jo.getBoundingClientRect();let x=(e.clientX-b.left-55)/40,y=(e.clientY-b.top-55)/40,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}jx=x;jy=-y;kn.style.left=35+x*35+'px';kn.style.top=35+y*35+'px'};
jo.onpointerdown=e=>{jp=1;jo.setPointerCapture(e.pointerId);jm(e);aud()};jo.onpointermove=e=>jp&&jm(e);jo.onpointerup=()=>{jp=0;jx=jy=0;kn.style.left=kn.style.top='35px'};
