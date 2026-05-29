const AudioManager = (() => {
    let bgMusic = null;
    let isPlaying = false;
    let isInitialized = false;

    function init() {
        const toggle = document.getElementById('audio-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', toggleMusic);

        document.addEventListener('scroll', startOnInteraction, { once: true });
        document.addEventListener('click', startOnInteraction, { once: true });
    }

    function loadMusic() {
        if (isInitialized) return;
        isInitialized = true;

        bgMusic = new Howl({
            src: ['audio/song.mp3'],
            loop: true,
            volume: 0,
            html5: true,
            onloaderror: () => {
                console.log('No audio file found — music disabled');
                isInitialized = false;
            }
        });
    }

    function startOnInteraction() {
        loadMusic();
        if (bgMusic && !isPlaying) {
            playMusic();
        }
    }

    function toggleMusic() {
        if (!isInitialized) loadMusic();

        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.play();
        bgMusic.fade(0, 0.3, 1000);
        isPlaying = true;
        document.body.classList.add('music-playing');
    }

    function pauseMusic() {
        if (!bgMusic) return;
        bgMusic.fade(bgMusic.volume(), 0, 500);
        setTimeout(() => bgMusic.pause(), 500);
        isPlaying = false;
        document.body.classList.remove('music-playing');
    }

    function setVolume(vol) {
        if (!bgMusic || !isPlaying) return;
        bgMusic.fade(bgMusic.volume(), vol, 800);
    }

    return { init, toggleMusic, setVolume, playMusic, pauseMusic };
})();
