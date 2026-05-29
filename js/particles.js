const ParticleSystem = (() => {
    let canvas, ctx;
    let particles = [];
    let animationId;
    let mood = 'default'; // default, playful, deep, romantic, celebration
    let maxParticles = 60;

    const PETAL_COLORS = ['#F4A300', '#FFD54F', '#FFCC02', '#E6A817', '#FFB347'];
    const HEART_COLOR = '#FF8A8A';

    function init() {
        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);

        maxParticles = DeviceProfile.isMobile ? 30 : 60;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createPetal(x, y) {
        return {
            type: 'petal',
            x: x || Math.random() * canvas.width,
            y: y || -20,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 0.5 + Math.random() * 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            size: 8 + Math.random() * 10,
            color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
            opacity: 0.6 + Math.random() * 0.4,
            life: 1,
            decay: 0.001 + Math.random() * 0.002,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.02
        };
    }

    function createHeart(x, y) {
        return {
            type: 'heart',
            x: x || Math.random() * canvas.width,
            y: y || canvas.height + 20,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(1 + Math.random() * 1.5),
            size: 6 + Math.random() * 8,
            color: HEART_COLOR,
            opacity: 0.7 + Math.random() * 0.3,
            life: 1,
            decay: 0.003 + Math.random() * 0.003,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03
        };
    }

    function createSparkle(x, y) {
        return {
            type: 'sparkle',
            x: x || Math.random() * canvas.width,
            y: y || Math.random() * canvas.height,
            size: 2 + Math.random() * 3,
            color: '#FFD700',
            opacity: 0,
            maxOpacity: 0.5 + Math.random() * 0.5,
            life: 1,
            decay: 0.01 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.05 + Math.random() * 0.03
        };
    }

    function spawnParticles() {
        const count = particles.length;
        if (count >= maxParticles) return;

        const spawnRate = getSpawnRate();
        if (Math.random() > spawnRate) return;

        switch (mood) {
            case 'celebration':
                particles.push(createHeart());
                particles.push(createPetal());
                particles.push(createSparkle());
                break;
            case 'romantic':
                if (Math.random() > 0.4) particles.push(createHeart());
                else particles.push(createSparkle());
                break;
            case 'deep':
                if (Math.random() > 0.6) particles.push(createSparkle());
                else particles.push(createPetal());
                break;
            case 'playful':
                particles.push(createPetal());
                if (Math.random() > 0.8) particles.push(createSparkle());
                break;
            default:
                if (Math.random() > 0.5) particles.push(createPetal());
                else particles.push(createSparkle());
        }
    }

    function getSpawnRate() {
        switch (mood) {
            case 'celebration': return 0.8;
            case 'romantic': return 0.3;
            case 'deep': return 0.15;
            case 'playful': return 0.4;
            default: return 0.2;
        }
    }

    function update() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.life -= p.decay;
            if (p.life <= 0 || p.y > canvas.height + 30 || p.y < -30) {
                particles.splice(i, 1);
                continue;
            }

            if (p.type === 'petal') {
                p.wobble += p.wobbleSpeed;
                p.x += p.vx + Math.sin(p.wobble) * 0.5;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.opacity = Math.min(p.opacity, p.life);
            } else if (p.type === 'heart') {
                p.wobble += p.wobbleSpeed;
                p.x += p.vx + Math.sin(p.wobble) * 0.3;
                p.y += p.vy;
                p.vy *= 0.99;
                p.opacity = Math.min(p.opacity, p.life);
            } else if (p.type === 'sparkle') {
                p.phase += p.pulseSpeed;
                p.opacity = p.maxOpacity * Math.abs(Math.sin(p.phase)) * p.life;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;

            if (p.type === 'petal') {
                drawPetal(p);
            } else if (p.type === 'heart') {
                drawHeart(p);
            } else if (p.type === 'sparkle') {
                drawSparkle(p);
            }

            ctx.restore();
        }
    }

    function drawPetal(p) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    }

    function drawHeart(p) {
        const s = p.size;
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
        ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
        ctx.fillStyle = p.color;
        ctx.fill();
    }

    function drawSparkle(p) {
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.fill();
    }

    function loop() {
        animationId = requestAnimationFrame(loop);
        spawnParticles();
        update();
        draw();
    }

    function start() {
        if (!canvas) return;
        loop();
    }

    function stop() {
        if (animationId) cancelAnimationFrame(animationId);
    }

    function setMood(newMood) {
        mood = newMood;
    }

    function burst(count, type) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const tempMax = maxParticles;
        maxParticles = 200;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 100;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;

            if (type === 'mixed' || type === 'hearts') {
                const heart = createHeart(x, y);
                heart.vx = (Math.random() - 0.5) * 4;
                heart.vy = -(2 + Math.random() * 4);
                particles.push(heart);
            }
            if (type === 'mixed' || type === 'petals') {
                const petal = createPetal(x, y);
                petal.vx = (Math.random() - 0.5) * 5;
                petal.vy = -(1 + Math.random() * 3);
                particles.push(petal);
            }
            if (type === 'mixed') {
                particles.push(createSparkle(x, y));
            }
        }

        setTimeout(() => { maxParticles = tempMax; }, 3000);
    }

    return { init, start, stop, setMood, burst };
})();
