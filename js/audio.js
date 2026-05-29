const AudioManager = (() => {
    let audio = null;
    let isPlaying = false;

    function init() {
        audio = document.createElement('audio');
        audio.src = 'audio/song.mp3';
        audio.loop = true;
        audio.volume = 0.3;
        document.body.appendChild(audio);

        // Play immediately — this is called inside a click handler so browser allows it
        audio.play();
        isPlaying = true;
        document.body.classList.add('music-playing');

        const toggle = document.getElementById('audio-toggle');
        if (toggle) toggle.addEventListener('click', toggleMusic);
    }

    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            document.body.classList.remove('music-playing');
        } else {
            audio.play();
            isPlaying = true;
            document.body.classList.add('music-playing');
        }
    }

    return { init, toggleMusic };
})();
