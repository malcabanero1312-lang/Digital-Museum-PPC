onerror=(m)=>{const e=document.getElementById('er');e.style.display='block';e.textContent='Error: '+m};
const $=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0'),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=MUSEUM.places;
const DT=['Wall Frame','Glass Case','Wooden Table','Stone Pedestal','Outdoor Stone Stand','Hanging Display','Digital Screen','Archive Drawer'];
const OUT=[[4,27],[15,29],[26,27],[14,42],[25,40],[30,33]];
const DS={mv:1,sens:1,mas:.7,mu:.4,am:.4,sf:.6,q:matchMedia('(pointer:coarse)').matches?'Medium':'High',sh:matchMedia('(pointer:coarse)').matches?0:1,fx:1,touch:1,rm:0,big:0,hc:0,hints:1,tod:.33,wx:0,cyc:0,bgOn:0,bgurl:''};
let ex=[],viewed=[],vr=[],S={...DS},hl=null,cur=0,yaw=0,pitch=0,keys={},jx=0,jy=0;
const DEF=i=>({id:i,color:'',fx3d:0,lockId:'',lockedBy:'',title:'',year:'',cat:'',img:'',desc:'',ctx:'',why:'',src:'',audio:'',video:'',room:i<=24?(i-1)>>2:6,disp:i<=24?[0,1,2,3,5,6,7][(i-1)%7]:[4,1,3,4,3,4][i-25]});
Object.assign(DS,MUSEUM.defaults||{});
const fresh=()=>{ex=Array.from({length:30},(_,i)=>({...DEF(i+1),...((MUSEUM.exhibits||[])[i]||{}),id:i+1}))};
function layout(){const c={};ex.forEach(e=>{const n=c[e.room]=(c[e.room]||0)+1,k=n-1;
 if(e.room<6){const ox=(e.room%3)*10,oz=(e.room>>1>=1&&e.room>=3?10:0),wl=e.disp==0||e.disp==5,o=(wl?.3:1.3)+Math.floor(k/4)*2.2,sx=[2.5,7.5][k%2],s=(k%4)<2;e.x=ox+sx;e.z=s?oz+o:oz+10-o;e.ry=s?0:Math.PI}
 else{const s=OUT[k%6];e.x=s[0]+Math.floor(k/6);e.z=s[1];e.ry=Math.atan2(15-e.x,35-e.z)}})}
const nm=e=>e.title||('Exhibit '+pad(e.id)),yc=e=>e.year||'YEAR NOT SET';
function tst(s){const t=$('tt');t.textContent=s;t.style.display='block';clearTimeout(tst.t);tst.t=setTimeout(()=>t.style.display='none',2200)}
function persist(){try{localStorage.setItem((typeof NET!='undefined'&&NET.on)?'museum3d_online':'museum3d',JSON.stringify({ex,viewed,vr,S}));return 1}catch(e){tst('Save failed (storage blocked/full)');return 0}}
const sv=m=>{if(persist()&&m)tst('Saved ✔')};
function ld(q){try{const d=JSON.parse(localStorage.getItem('museum3d'));if(!d){if(!q)tst('Nothing saved yet');return}ex=d.ex;viewed=d.viewed||[];vr=d.vr||[];S={...DS,...d.S};layout();if(R)buildAll();apply();cnt();if(!q)tst('Loaded ✔')}catch(e){if(!q)tst('Load failed')}}
function rs(){if(confirm('Reset ALL edits, progress and settings?')){try{localStorage.removeItem('museum3d')}catch(e){}fresh();viewed=[];vr=[];S={...DS};layout();buildAll();apply();cnt();cl();tst('Reset')}}
const cnt=()=>{$('cnt').textContent=`${viewed.length} / 30 EXPLORED`};
