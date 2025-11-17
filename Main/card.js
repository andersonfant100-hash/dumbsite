document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Strong Steam-style tilt
        const rotateY = ((x / rect.width) - 0.5) * 25;
        const rotateX = ((y / rect.height) - 0.5) * -25;

        // Dynamic green shadow
        const shadowX = ((x / rect.width) - 0.5) * -30;
        const shadowY = ((y / rect.height) - 0.5) * -30;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(29,185,84,0.5)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.4)";
    });
});
