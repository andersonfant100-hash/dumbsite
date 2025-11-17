// Tilt effect for existing cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 15; // subtle tilt
        const rotateX = ((y / rect.height) - 0.5) * -15;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `0 10px 30px rgba(0,0,0,0.3)`; 
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
    });
});
