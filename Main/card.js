document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 25; // stronger tilt
        const rotateX = ((y / rect.height) - 0.5) * -25;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', ()=>{
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
});
