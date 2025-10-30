// ---------- Particle Background ----------
const bgCanvas = document.getElementById('bg');
const ctx = bgCanvas.getContext('2d');

function resize() { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

let numParticles = 80;
let particles = [];
let bgColor = {r:0,g:0,b:0};
let particleColor = {r:127,g:255,b:212};

function createParticles() {
  particles = [];
  for(let i=0;i<numParticles;i++){
    particles.push({x:Math.random()*bgCanvas.width, y:Math.random()*bgCanvas.height, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5});
  }
}
createParticles();

function updateParticles(){
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>bgCanvas.width)p.vx*=-1;
    if(p.y<0||p.y>bgCanvas.height)p.vy*=-1;
  }
}

function drawParticles(){
  ctx.fillStyle=`rgb(${bgColor.r},${bgColor.g},${bgColor.b})`;
  ctx.fillRect(0,0,bgCanvas.width,bgCanvas.height);

  for(const p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,2,0,Math.PI*2);
    ctx.fillStyle=`rgb(${particleColor.r},${particleColor.g},${particleColor.b})`;
    ctx.fill();
  }

  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        ctx.strokeStyle=`rgba(${particleColor.r},${particleColor.g},${particleColor.b},${1-dist/120})`;
        ctx.lineWidth=0.5;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
  }
}

function animate(){
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}
animate();

// ---------- Settings ----------
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
settingsButton.addEventListener('click', ()=>settingsMenu.classList.toggle('open'));

// Background sliders
document.getElementById('bgR').addEventListener('input', e=>bgColor.r=e.target.value);
document.getElementById('bgG').addEventListener('input', e=>bgColor.g=e.target.value);
document.getElementById('bgB').addEventListener('input', e=>bgColor.b=e.target.value);

// Particle sliders
document.getElementById('pR').addEventListener('input', e=>particleColor.r=e.target.value);
document.getElementById('pG').addEventListener('input', e=>particleColor.g=e.target.value);
document.getElementById('pB').addEventListener('input', e=>particleColor.b=e.target.value);

// Particle count
document.getElementById('particleCount').addEventListener('input', e=>{
  numParticles=parseInt(e.target.value);
  createParticles();
});

// ---------- Games Section ----------
const games = [
  {name:"Game 1", file:"games/game1.html", img:"games/game1.png"},
  {name:"Game 2", file:"games/game2.html", img:"games/game2.png"},
  {name:"Game 3", file:"games/game3.html", img:"games/game3.png"}
];

const gamesSection = document.getElementById('gamesSection');
games.forEach(g=>{
  const card = document.createElement('div');
  card.className='game-card';
  card.innerHTML=`<img src="${g.img}" alt="${g.name}"><div>${g.name}</div>`;
  card.onclick = ()=>window.location.href=g.file;
  gamesSection.appendChild(card);
});
