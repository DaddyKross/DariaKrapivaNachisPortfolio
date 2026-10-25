const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });
}

document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    });
});

document.querySelector('#year').textContent = new Date().getFullYear();


// Ambient fireflies: decorative only, never intercepting clicks.
(() => {
    const layer = document.createElement('div');
    layer.className = 'firefly-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    const count = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 16;
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'firefly';
        dot.style.left = `${4 + Math.random() * 92}%`;
        dot.style.top = `${22 + Math.random() * 72}%`;
        dot.style.setProperty('--duration', `${9 + Math.random() * 10}s`);
        dot.style.setProperty('--delay', `${-Math.random() * 18}s`);
        const size = 2 + Math.random() * 3;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        layer.appendChild(dot);
    }
})();
