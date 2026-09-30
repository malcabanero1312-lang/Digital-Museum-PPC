/* 3D */
let R,scene,cam,sun,G={},COL=[],BFS=[],TRS=[],pond,T=THREE;
const MT=(c,o)=>new T.MeshStandardMaterial({color:c,...o});
function box(x,y,z,w,h,d,c,p,o){const m=new T.Mesh(new T.BoxGeometry(w,h,d),MT(c,o));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||scene).add(m);return m}
const hw=(z,a,b)=>{box((a+b)/2,2,z,b-a,4,.3,0xe2d6ba);COL.push([a,z-.15,b,z+.15])},vw=(x,a,b)=>{box(x,2,(a+b)/2,.3,4,b-a,0xe2d6ba);COL.push([x-.15,a,x+.15,b])};
function seg(f,k,a,b,g){let s=a;for(const[x,y]of[...g,[b,b]]){if(x>s)f(k,s,x);s=y}}
function tex(e){const c=document.createElement('canvas');c.width=512;c.height=384;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,512,384);x.fillStyle='#777';x.font='30px sans-serif';x.textAlign='center';x.fillText('[IMAGE PLACEHOLDER]',256,180);x.fillText('EXHIBIT '+pad(e.id),256,225);const t=new T.CanvasTexture(c);
 if(e.img){const i=new Image();i.onload=()=>{const k=Math.min(512/i.width,384/i.height);x.fillStyle='#222';x.fillRect(0,0,512,384);x.drawImage(i,(512-i.width*k)/2,(384-i.height*k)/2,i.width*k,i.height*k);t.needsUpdate=true};i.src=e.img}return t}
function build(e){if(G[e.id]){scene.remove(G[e.id])}const g=new T.Group(),t=tex(e),b=(w,h,d,c,x,y,z,o)=>box(x,y,z,w,h,d,c,g,o),im=(w,h,x,y,z,rx)=>{const m=new T.Mesh(e.fx3d==2?new T.PlaneGeometry(w,h,64,48):new T.PlaneGeometry(w,h),e.fx3d==2?new T.MeshStandardMaterial({map:t,displacementMap:t,displacementScale:.16,displacementBias:-.06,emissive:0x999999,emissiveMap:t,roughness:.55}):new T.MeshBasicMaterial({map:t}));m.position.set(x,y,z);m.rotation.x=rx||0;if(e.fx3d==1){m.userData.par=1;m.userData.z0=z}g.add(m)};
 switch(e.disp){case 0:b(1.5,1.1,.08,0x6b4a2b,0,1.7,0);b(.06,1.2,.06,0x8a6a3a,-.65,.6,-.03);b(.06,1.2,.06,0x8a6a3a,.65,.6,-.03);im(1.3,.9,0,1.7,.05);break;
 case 1:b(1,.9,1,0x7a5230,0,.45,0);b(1,.6,1,0xbfe3f0,0,1.2,0,{transparent:true,opacity:.25});im(.7,.5,0,1.2,0);break;
 case 2:b(1.8,.08,.9,0x7a5230,0,.85,0);[[-.8,-.35],[.8,-.35],[-.8,.35],[.8,.35]].forEach(p=>b(.08,.85,.08,0x4a3018,p[0],.42,p[1]));im(.9,.65,0,1.2,.1,-.25);break;
 case 3:b(.8,1.1,.8,0x999999,0,.55,0);b(.9,.1,.9,0x888888,0,1.15,0);im(.8,.6,0,1.55,.1);break;
 case 4:b(1.4,1,.6,0x8a8a80,0,.5,0);im(1.1,.75,0,1.15,.1,-.9);break;
 case 5:b(.06,3,.06,0x6b4a2b,-.6,1.5,0);b(.06,3,.06,0x6b4a2b,.6,1.5,0);b(1.3,.06,.06,0x6b4a2b,0,3,0);im(1,1.3,0,2.05,0);break;
 case 6:b(.2,.9,.2,0x222222,0,.45,-.05);b(1.7,1,.1,0x111111,0,1.5,0);im(1.55,.87,0,1.5,.06);break;
 default:b(1.2,1.1,.6,0x8b6b3e,0,.55,0);[.2,.55,.9].forEach(y=>b(.3,.05,.05,0xccbb88,0,y,.32));im(.9,.65,0,1.45,.1,-.3)}
 if(hl&&yc(e)==hl){const r=new T.Mesh(new T.RingGeometry(1,1.3,32),new T.MeshBasicMaterial({color:0xffdd00,side:2}));r.rotation.x=-Math.PI/2;r.position.set(0,.05,0);g.add(r)}
 if(viewed.includes(e.id)){const d=new T.Mesh(new T.SphereGeometry(.07),new T.MeshBasicMaterial({color:0x44cc44}));d.position.set(.6,.08,.6);g.add(d)}
 if(e.color)g.traverse(o=>{if(o.isMesh&&o.material&&o.material.type=='MeshStandardMaterial'&&!o.material.map&&!o.material.transparent&&!o.material.emissive.getHex())o.material.color.set(e.color)});g.position.set(e.x,0,e.z);g.rotation.y=e.ry;g.userData.id=e.id;scene.add(g);G[e.id]=g}
const buildAll=()=>{if(R)ex.forEach(build)};
function init(){R=new T.WebGLRenderer({canvas:$('cv'),antialias:true});scene=new T.Scene();scene.background=new T.Color(0x87b6e0);scene.fog=new T.Fog(0x87b6e0,30,110);
 cam=new T.PerspectiveCamera(70,1,.1,300);cam.rotation.order='YXZ';tp(15,24,0);
 scene.add(new T.HemisphereLight(0xffffff,0x556644,.75));sun=new T.DirectionalLight(0xfff2d0,.8);sun.position.set(40,60,20);sun.shadow.camera.left=sun.shadow.camera.bottom=-40;sun.shadow.camera.right=sun.shadow.camera.top=40;sun.shadow.camera.far=150;sun.shadow.mapSize.set(4096,4096);scene.add(sun);
 const gr=new T.Mesh(new T.PlaneGeometry(300,300),MT(0x5f9a48));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;scene.add(gr);
 for(let i=0;i<6;i++){const ox=(i%3)*10,oz=i>=3?10:0;const f=new T.Mesh(new T.PlaneGeometry(10,10),MT([0xcdb98a,0xb9c4cc,0xc9a48f,0xa9c3a3,0xb4aacc,0xd2b596][i]));f.rotation.x=-Math.PI/2;f.position.set(ox+5,.02,oz+5);f.receiveShadow=true;scene.add(f);
  const l=new T.PointLight(0xfff0d0,.7,14);l.position.set(ox+5,3.4,oz+5);scene.add(l);box(ox+5,3.9,oz+5,.6,.3,.6,0xffeeaa,null,{emissive:0xffeeaa})}
 seg(hw,0,0,30,[]);seg(hw,20,0,30,[[13.5,16.5]]);seg(hw,10,0,30,[[4,6],[14,16],[24,26]]);[0,30].forEach(x=>seg(vw,x,0,20,[]));[10,20].forEach(x=>seg(vw,x,0,20,[[4,6],[14,16]]));
 box(15,4.15,10,30.6,.3,20.6,0x8a5a3c);for(let x=2.5;x<30;x+=5)box(x,3.85,10,.3,.3,20,0x4a3018);
 for(let x=0;x<=30;x+=2){box(x,4.7,0,1,.7,.4,0x9a8e78);box(x,4.7,20,1,.7,.4,0x9a8e78)}for(let z=0;z<=20;z+=2){box(0,4.7,z,.4,.7,1,0x9a8e78);box(30,4.7,z,.4,.7,1,0x9a8e78)}
 [[0,0],[30,0],[0,20],[30,20]].forEach(p=>{const c=new T.Mesh(new T.CylinderGeometry(1.8,2,8,16),MT(0xb8ac94));c.position.set(p[0],4,p[1]);c.castShadow=true;scene.add(c);const k=new T.Mesh(new T.ConeGeometry(2.3,2.6,16),MT(0x7a3a2a));k.position.set(p[0],9.3,p[1]);scene.add(k);COL.push([p[0]-1.9,p[1]-1.9,p[0]+1.9,p[1]+1.9])});
 const pa=new T.Mesh(new T.PlaneGeometry(3,15),MT(0xa89f8c));pa.rotation.x=-Math.PI/2;pa.position.set(15,.03,27.5);scene.add(pa);
 pond=new T.Mesh(new T.CircleGeometry(4.5,32),MT(0x3a86c0,{metalness:.3,roughness:.2}));pond.rotation.x=-Math.PI/2;pond.position.set(5,.05,36);scene.add(pond);
 box(5,.25,36,1.6,.12,11,0x8a5a3a);[-.75,.75].forEach(z=>box(5,.7,36+z*5.2,.08,.6,.08,0x5a3a20));
 for(let i=0;i<9;i++){const a=i*.7,r=new T.Mesh(new T.DodecahedronGeometry(.45),MT(0x888888));r.position.set(5+Math.cos(a)*4.9,.2,36+Math.sin(a)*4.9);scene.add(r)}
 for(let i=0;i<16;i++){const x=[-8,-3,22,32,38,-6,12,40,20,-10,36,28,3,18,-12,42][i],z=[24,45,45,48,30,33,50,22,52,40,44,36,52,38,55,26][i],tr=new T.Group();const tk=new T.Mesh(new T.CylinderGeometry(.25,.35,2.4),MT(0x5a3a1e));tk.position.y=1.2;tr.add(tk);const l=new T.Mesh(new T.SphereGeometry(1.7,10,8),MT(0x2f7a34));l.position.y=3.6;l.castShadow=true;tr.add(l);tr.position.set(x,0,z);scene.add(tr);TRS.push(tr);COL.push([x-.4,z-.4,x+.4,z+.4])}
 for(let i=0;i<70;i++){const f=new T.Mesh(new T.SphereGeometry(.08,6,5),new T.MeshBasicMaterial({color:[0xff77aa,0xffdd44,0xffffff,0xaa77ff][i%4]}));f.position.set(-5+(i*7.3)%45,.1,22+(i*5.1)%30);scene.add(f)}
 [[9,29],[21,31]].forEach(p=>{box(p[0],.4,p[1],1.6,.1,.5,0x6b4a2b);box(p[0],.75,p[1]+.25,1.6,.4,.08,0x6b4a2b);box(p[0]-.6,.2,p[1],.1,.4,.4,0x4a3018);box(p[0]+.6,.2,p[1],.1,.4,.4,0x4a3018)});
 for(let i=0;i<8;i++){const m=new T.Mesh(new T.PlaneGeometry(.2,.12),new T.MeshBasicMaterial({color:[0xff88bb,0xffcc44,0x88ddff][i%3],side:2}));m.userData={a:i*.8,r:4+i*2,cx:8+i*3,cz:33+i*2};scene.add(m);BFS.push(m)}
 layout();buildAll();try{decor()}catch(e){console.error(e);tst('Decor error: '+e.message)}apply();cnt();rsz();loop()}
function apply(){if(!R)return;R.setPixelRatio({Low:1,Medium:Math.min(devicePixelRatio||1,2),High:Math.min(Math.max(devicePixelRatio||1,1.75),2.5)}[S.q]);const s=!!S.sh;if(R.shadowMap.enabled!=s){R.shadowMap.enabled=s;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true})}sun.castShadow=s;R.shadowMap.type=T.PCFSoftShadowMap;
 document.body.classList.toggle('big',!!S.big);document.body.classList.toggle('hc',!!S.hc);$('joy').style.display=S.touch?'':'none';$('hint').style.display=S.hints?'':'none';ap();rsz()}
function rsz(){if(!R)return;R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rsz);
const blk=(x,z)=>{const r=.35;if(x<-88||x>88||z<-62||z>93)return 1;return COL.some(c=>x>c[0]-r&&x<c[2]+r&&z>c[1]-r&&z<c[3]+r)};
const rc=new T.Raycaster();rc.far=9;let last=0,near=null,fr=0;
function pick(nx,ny){rc.setFromCamera({x:nx,y:ny},cam);const h=rc.intersectObjects(Object.values(G),true);for(const i of h){let o=i.object;while(o&&!o.userData.id)o=o.parent;if(o)return o.userData.id}return 0}
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000||.016,.05);last=t;
 const f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-jy,r=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+jx,sp=3.2*S.mv*dt*((keys.shift)?1.8:1);let dx=(-Math.sin(yaw)*f+Math.cos(yaw)*r),dz=(-Math.cos(yaw)*f-Math.sin(yaw)*r);const l=Math.hypot(dx,dz);if(l>1){dx/=l;dz/=l}
 const nx=cam.position.x+dx*sp,nz=cam.position.z+dz*sp;if(!blk(nx,cam.position.z))cam.position.x=nx;if(!blk(cam.position.x,nz))cam.position.z=nz;
 cam.rotation.set(pitch,yaw,0);const p=cam.position,ri=area(p.x,p.z);if(ri>=0&&!vr.includes(ri)){vr.push(ri);sv()}
 if(S.fx&&!S.rm){const s=t/1000;pond.material.color.setHSL(.57,.55,.42+Math.sin(s*2)*.03);TRS.forEach((k,i)=>k.rotation.z=Math.sin(s+i)*.015);BFS.forEach(b=>{const u=b.userData;u.a+=dt*.5;b.position.set(u.cx+Math.cos(u.a)*u.r*.4,1+Math.sin(u.a*2)*.4,u.cz+Math.sin(u.a)*u.r*.4);b.rotation.y=u.a;b.scale.x=Math.abs(Math.sin(s*14+u.a))+.2;b.visible=true})}else BFS.forEach(b=>b.visible=false);
 if(++fr%6==0){const id=pick(0,0);near=id||null;$('hint').textContent=id?`${nm(ex[id-1])} — click / E / tap to open`:`${ri>=0?RM[ri]:'Outside'} · WASD move, drag/mouse to look up & around · ${vr.length}/7 areas visited`}
 R.render(scene,cam)}
