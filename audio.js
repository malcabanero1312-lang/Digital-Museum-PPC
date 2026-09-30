/* audio */
let A;function aud(){if(A)return;try{const c=new AudioContext(),m=c.createGain(),mu=c.createGain(),am=c.createGain();[mu,am].forEach(g=>g.connect(m));m.connect(c.destination);
 [110,165,220].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.value=.05/(i+1);o.connect(g);g.connect(mu);o.start()});
 const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const n=c.createBufferSource();n.buffer=b;n.loop=1;const f=c.createBiquadFilter();f.frequency.value=500;n.connect(f);f.connect(am);n.start();A={c,m,mu,am};ap()}catch(e){}}
const ap=()=>{if(typeof bgVol=='function')bgVol();if(A){A.m.gain.value=S.mas;A.mu.gain.value=S.mu;A.am.gain.value=S.am*.15}};
function beep(){if(!A)return;const o=A.c.createOscillator(),g=A.c.createGain();o.frequency.value=660;g.gain.value=S.sf*.3;g.gain.exponentialRampToValueAtTime(.001,A.c.currentTime+.2);o.connect(g);g.connect(A.m);o.start();o.stop(A.c.currentTime+.2)}
