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
    const count = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 12;
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


// ===== CURSOR-REACTIVE CANOPY V7 =====
// Add small leaves to the existing branch clusters. The central content stays clear.
(() => {
    const clusters = [...document.querySelectorAll('.foliage-cluster')];
    if (!clusters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const foliagePalette = [
        ['#75a86f', '#315f43'], ['#568c60', '#1d4a36'],
        ['#80ad78', '#38684a'], ['#4b8061', '#1b4938'],
        ['#69a18e', '#285c4a'], ['#426d4b', '#163a2b']
    ];
    const leaves = [];

    clusters.forEach((cluster, clusterIndex) => {
        // Existing leaves stay in place; 30 extra small silhouettes thicken each cluster.
        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('i');
            leaf.className = 'canopy-extra-leaf';
            const right = /right/.test(cluster.className);
            const middle = /mid/.test(cluster.className);
            const bottom = /bottom/.test(cluster.className);
            const xMin = middle ? 148 : 118;
            const xMax = 276;
            const yMin = bottom ? 4 : (middle ? 8 : 0);
            const yMax = bottom ? 260 : 276;
            const width = 17 + Math.random() * 9;
            const height = 8 + Math.random() * 5;
            const palette = foliagePalette[Math.floor(Math.random() * foliagePalette.length)];

            leaf.style.left = `${xMin + Math.random() * (xMax - xMin)}px`;
            leaf.style.top = `${yMin + Math.random() * (yMax - yMin)}px`;
            leaf.style.width = `${width}px`;
            leaf.style.height = `${height}px`;
            leaf.style.setProperty('--leaf-angle', `${Math.random() * 150 - 75}deg`);
            leaf.style.setProperty('--leaf-colour-a', palette[0]);
            leaf.style.setProperty('--leaf-colour-b', palette[1]);
            leaf.style.animationDelay = `${-Math.random() * 8}s`;
            leaf.style.setProperty('--leaf-duration', `${6 + Math.random() * 6}s`);
            leaf.style.opacity = `${0.54 + Math.random() * 0.38}`;
            // Alternate shapes: pointed, rounded, narrow and softly lobed.
            leaf.dataset.leafShape = ['point','round','narrow','soft'][i % 4];
            cluster.appendChild(leaf);
            leaves.push(leaf);
        }

        // Also add a subtle depth variation to the original leaves.
        cluster.querySelectorAll('i:not(.canopy-extra-leaf)').forEach((leaf, index) => {
            if (index % 5 === 0) leaf.classList.add('leaf-highlight');
            leaves.push(leaf);
        });
    });

    if (reducedMotion || !finePointer) return;

    let frame = 0;
    const radius = 205;
    const maxPush = 43;
    const resetLeaves = () => {
        leaves.forEach(leaf => {
            leaf.style.translate = '0px 0px';
        });
    };

    window.addEventListener('pointermove', event => {
        if (frame) cancelAnimationFrame(frame);
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        frame = requestAnimationFrame(() => {
            leaves.forEach(leaf => {
                const rect = leaf.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = centerX - mouseX;
                const dy = centerY - mouseY;
                const distance = Math.hypot(dx, dy);
                const influence = Math.max(0, 1 - distance / radius);
                if (influence <= 0) {
                    leaf.style.translate = '0px 0px';
                    return;
                }
                const force = influence * influence * maxPush;
                const safeDistance = Math.max(distance, 1);
                const shiftX = (dx / safeDistance) * force;
                const shiftY = (dy / safeDistance) * force;
                leaf.style.translate = `${shiftX.toFixed(1)}px ${shiftY.toFixed(1)}px`;
            });
        });
    }, { passive: true });

    document.addEventListener('mouseleave', resetLeaves);
    window.addEventListener('blur', resetLeaves);
})();


// ===== V8.1: irregular sunlight pulses through the trees =====
(() => {
    const layer = document.querySelector('.sun-rays');
    if (!layer) return;

    const beams = [...layer.querySelectorAll('.sun-ray')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || beams.length === 0) return;

    const randomBetween = (min, max) => min + Math.random() * (max - min);

    // Each shaft follows its own loose rhythm, so the light never feels mechanical.
    const scheduleBeam = (beam, delay) => {
        window.setTimeout(() => {
            if (document.hidden) {
                scheduleBeam(beam, randomBetween(5000, 11000));
                return;
            }

            beam.classList.add('is-visible');
            layer.classList.add('has-light');

            const visibleFor = randomBetween(4300, 7600);
            window.setTimeout(() => {
                beam.classList.remove('is-visible');

                if (!beams.some(item => item.classList.contains('is-visible'))) {
                    layer.classList.remove('has-light');
                }

                scheduleBeam(beam, randomBetween(15000, 29000));
            }, visibleFor);
        }, delay);
    };

    beams.forEach((beam, index) => {
        scheduleBeam(beam, randomBetween(2500, 8500) + index * randomBetween(2500, 5200));
    });
})();
