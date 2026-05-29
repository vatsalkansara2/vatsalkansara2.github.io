const DeviceProfile = (() => {
    const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tier = isMobile ? 'medium' : 'high';
    if (prefersReduced) tier = 'low';

    return { isMobile, tier, prefersReduced };
})();

const App = (() => {
    function init() {
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', startExperience);
        }
    }

    function startExperience() {
        // Start music immediately on this click (user gesture)
        AudioManager.init();

        // Hide loader
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');

        // Init everything
        BookManager.init();
        createBloomPetals();
        ParticleSystem.init();
        ParticleSystem.start();
        ScrollController.init();
        setupYesButton();
    }

    function createBloomPetals() {
        const container = document.getElementById('bloom-petals');
        if (!container) return;

        const petalCount = 18;
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'bloom-petal';
            const angle = (i / petalCount) * 360;
            petal.dataset.angle = angle;
            container.appendChild(petal);
        }
    }

    function setupYesButton() {
        const btn = document.getElementById('yes-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            ParticleSystem.setMood('celebration');
            ParticleSystem.burst(80, 'mixed');

            gsap.to('.ask-container', {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    const celebration = document.getElementById('celebration');
                    if (celebration) {
                        celebration.style.display = 'flex';
                        gsap.fromTo(celebration, { opacity: 0 }, { opacity: 1, duration: 1 });
                        gsap.fromTo('.celebration-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3 });
                        gsap.fromTo('.celebration-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6 });
                        gsap.fromTo('.celebration-emoji', { scale: 0 }, { scale: 1, duration: 0.8, delay: 0.9, ease: 'back.out(3)' });
                    }

                    setTimeout(() => ParticleSystem.burst(50, 'hearts'), 500);
                    setTimeout(() => ParticleSystem.burst(30, 'mixed'), 1500);
                }
            });
        });
    }

    return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
