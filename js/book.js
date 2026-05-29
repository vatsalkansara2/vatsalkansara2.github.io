const BookManager = (() => {
    let pages = [];
    let currentPage = -1; // -1 = cover closed
    let totalPages = 0;
    let isOpen = false;

    function init() {
        pages = document.querySelectorAll('#book-3d .page-group');
        totalPages = pages.length;

        pages.forEach((page, i) => {
            page.style.zIndex = totalPages - i;
            page.style.transform = 'rotateY(0deg)';
        });
    }

    function flipToProgress(progress) {
        const pageProgress = progress * totalPages;

        pages.forEach((page, i) => {
            const flip = Math.max(0, Math.min(1, pageProgress - i));
            const angle = flip * -180;

            page.style.transform = `rotateY(${angle}deg)`;

            const zBase = totalPages - i;
            page.style.zIndex = flip > 0.5 ? i : zBase;

            const shadowIntensity = Math.sin(flip * Math.PI);
            const shadow = page.querySelector('.page-flip-shadow');
            if (shadow) {
                shadow.style.opacity = shadowIntensity * 0.3;
            }
            page.style.setProperty('--flip-shadow', shadowIntensity * 0.25);
        });

        const newPage = Math.floor(pageProgress);
        if (newPage !== currentPage) {
            currentPage = newPage;
            onPageChange(currentPage);
        }
    }

    function onPageChange(pageIndex) {
        if (pageIndex <= 0) {
            ParticleSystem.setMood('default');
        } else if (pageIndex <= 3) {
            ParticleSystem.setMood('playful');
        } else if (pageIndex <= 6) {
            ParticleSystem.setMood('deep');
        } else if (pageIndex <= 8) {
            ParticleSystem.setMood('romantic');
        } else {
            ParticleSystem.setMood('romantic');
        }
    }

    function getPageCount() {
        return totalPages;
    }

    function getCurrentPage() {
        return currentPage;
    }

    return { init, flipToProgress, getPageCount, getCurrentPage };
})();
