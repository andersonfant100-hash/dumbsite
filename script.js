// ---------- Background particle network ----------
const bgCanvas = document.getElementById('bg');
const bgCtx = bgCanvas.getContext('2d');

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

let numParticles = 80;
let particles = [];
let bgColor = { r:0, g:0, b:0 };
let particleColor = { r:127, g:255, b:212 };

function createParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random()*bgCanvas.width,
      y: Math.random()*bgCanvas.height,
      vx: (Math.random()-0.5)*0.5,
      vy: (Math.random()-0.5)*0.5
    });
  }
}
createParticles();

function updateParticles() {
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
  }
}

function drawParticles() {
  bgCtx.fillStyle = `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`;
  bgCtx.fillRect(0,0,bgCanvas.width,bgCanvas.height);

  for(const p of particles){
    bgCtx.beginPath();
    bgCtx.arc(p.x,p.y,2,0,Math.PI*2);
    bgCtx.fillStyle = `rgb(${particleColor.r},${particleColor.g},${particleColor.b})`;
    bgCtx.fill();
  }

  // Lines
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 120){
        bgCtx.strokeStyle = `rgba(${particleColor.r},${particleColor.g},${particleColor.b},${1-dist/120})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.beginPath();
        bgCtx.moveTo(a.x,a.y);
        bgCtx.lineTo(b.x,b.y);
        bgCtx.stroke();
      }
    }
  }
}

function animateBg() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animateBg);
}
animateBg();

// ---------- Settings menu ----------
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
settingsButton.addEventListener('click', ()=> settingsMenu.classList.toggle('open'));

// Background RGB sliders
document.getElementById('bgR').addEventListener('input', e => bgColor.r = e.target.value);
document.getElementById('bgG').addEventListener('input', e => bgColor.g = e.target.value);
document.getElementById('bgB').addEventListener('input', e => bgColor.b = e.target.value);

// Particle RGB sliders
document.getElementById('pR').addEventListener('input', e => particleColor.r = e.target.value);
document.getElementById('pG').addEventListener('input', e => particleColor.g = e.target.value);
document.getElementById('pB').addEventListener('input', e => particleColor.b = e.target.value);

// Particle count
document.getElementById('particleCount').addEventListener('input', e=>{
  numParticles = parseInt(e.target.value);
  createParticles();
});
