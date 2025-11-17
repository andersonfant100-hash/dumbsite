// Steam-style card tilt effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 15; // horizontal tilt
        const rotateX = ((y / rect.height) - 0.5) * -15; // vertical tilt

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        card.style.boxShadow = `0 20px 50px rgba(29,185,84,0.5)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.4)";
    });
});
