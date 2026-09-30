/* ============================================================
   MUSEUM CONFIG — edit THIS file to customise content.
   No need to touch the code in /js. Save, then refresh.
   ============================================================ */
const MUSEUM={
  title:'Digital Museum 2000–2010 · Barangay',

  /* Names of the 7 places (order matters: 0..6). Shown in editor, map and hints. */
  places:['Barangay Hall','Covered Court & Stage','Kubo ng Purok','Sari-Sari Store','Simbahan (Chapel)','Paaralan (School)','Palayan, Ilog & Tulay'],

  /* Online room settings. `prefix` makes your room codes unique on the free PeerJS broker.
     `ice`: optional TURN servers for strict school/office networks, e.g.
     [{urls:'stun:stun.l.google.com:19302'},{urls:'turn:YOUR_SERVER',username:'u',credential:'p'}] */
  room:{prefix:'brgy-museum-2000s',ice:null},

  /* Starting values for every new visitor. tod: 0 sunrise … .33 noon … .67 sunset … 1 night.
     wx: 0 clear, 1 cloudy, 2 fog, 3 rain, 4 storm */
  defaults:{tod:.33,wx:0,fx:1,mu:.4,am:.4,sf:.6,mas:.7},
  world:{tod:.33,wx:0},

  /* Music album. Upload the song files next to this file on GitHub and list them here (mp3/ogg/wav).
     The moderator can also upload extra songs live inside the museum. */
  music:[
    // {id:'m1',name:'Kundiman (sample)',url:'song1.mp3'},
  ],

  /* The 30 exhibits. Fill any field; leave {} for an empty slot.
     img: 'ex01.jpg' (file uploaded next to index.html) or full https:// URL.
     room: 0..6 (index in `places`)   disp: 0 frame,1 case,2 table,3 pedestal,4 outdoor stand,5 hanging banner,6 screen,7 archive drawer
     color: '#8b5a2b' (frame/table colour)   fx3d: 0 flat, 1 floating, 2 3D relief   audio/video: URLs */
  exhibits:[
    // {title:'Nokia 3310',year:'2001',cat:'Technology',img:'ex01.jpg',desc:'…',ctx:'…',why:'…',src:'https://…',room:1,color:'#6b4a2b',fx3d:1},
    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}
  ]
};
