const ScrollController = (() => {
    let scrollTriggerInstance = null;

    function init() {
        gsap.registerPlugin(ScrollTrigger);
        setupBookScroll();
        setupLetterReveal();
        setupAskSection();
        setupProgressBar();
        setupHeroFade();
    }

    function setupHeroFade() {
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            opacity: 0,
            y: -50,
            ease: 'none'
        });
    }

    function setupBookScroll() {
        const totalPages = BookManager.getPageCount();
        const scrollPerPage = 800;
        const totalScroll = totalPages * scrollPerPage;

        scrollTriggerInstance = ScrollTrigger.create({
            trigger: '#book-viewport',
            start: 'top top',
            end: `+=${totalScroll}`,
            pin: true,
            scrub: 1.2,
            snap: {
                snapTo: 1 / totalPages,
                duration: { min: 0.3, max: 0.6 },
                delay: 0.1,
                ease: 'power2.inOut'
            },
            onUpdate: (self) => {
                BookManager.flipToProgress(self.progress);
            }
        });
    }

    function setupLetterReveal() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#letter-section',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.fromTo('#letter-container', {
            opacity: 0,
            y: 60,
            rotateX: 8,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.4,
            ease: 'power3.out'
        });

        tl.fromTo('.letter-paper', {
            rotateX: 5,
            rotateY: -3,
            y: 20
        }, {
            rotateX: 2,
            rotateY: -1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=1');

        tl.fromTo('.letter-greeting', {
            opacity: 0,
            x: -15
        }, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');

        tl.fromTo('.letter-body', {
            opacity: 0,
            y: 10
        }, {
            opacity: 0.9,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out'
        }, '-=0.3');

        tl.fromTo('.letter-signature', {
            opacity: 0,
            scale: 0.8
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(2)'
        }, '-=0.1');
    }

    function setupAskSection() {
        let bloomTriggered = false;

        ScrollTrigger.create({
            trigger: '#ask-section',
            start: 'top 60%',
            once: true,
            onEnter: () => {
                if (!bloomTriggered) {
                    bloomTriggered = true;
                    triggerBloomAnimation(() => {
                        ParticleSystem.burst(30, 'mixed');
                    });
                }
            }
        });
    }

    function triggerBloomAnimation(callback) {
        const sunflower = document.getElementById('bloom-sunflower');
        if (!sunflower) return;

        const tl = gsap.timeline({ onComplete: callback });

        tl.to(sunflower, { opacity: 1, duration: 0.5 });

        tl.fromTo('.bloom-center', {
            scale: 0,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(2)'
        });

        const petals = document.querySelectorAll('.bloom-petal');
        petals.forEach((petal, i) => {
            const angle = parseFloat(petal.dataset.angle);
            const rad = (angle * Math.PI) / 180;
            const dist = 75;
            const x = Math.cos(rad) * dist;
            const y = Math.sin(rad) * dist;
            petal.style.transform = `translate(calc(-50% + ${x}px), calc(-100% + ${y}px)) rotate(${angle + 90}deg)`;
        });

        tl.fromTo('.bloom-petal', {
            scale: 0,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            stagger: {
                each: 0.04,
                from: 'random'
            },
            ease: 'elastic.out(1, 0.6)'
        }, '-=0.4');

        tl.to('#ask-text', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.3');

        tl.to('.yes-btn', {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(3)',
            onComplete: () => {
                document.querySelector('.yes-btn').classList.add('pulse');
            }
        }, '-=0.2');

        return tl;
    }

    function setupProgressBar() {
        const bar = document.getElementById('scroll-bar');
        if (!bar) return;

        ScrollTrigger.create({
            trigger: '#scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                bar.style.width = `${self.progress * 100}%`;
            }
        });
    }

    return { init };
})();
