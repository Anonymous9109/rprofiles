(function (global) {
    function isVideoMediaUrl(url) {
        if (!url || typeof url !== 'string') return false;
        return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url) || url.startsWith('data:video/');
    }

    function createVideoPlayer(src) {
        const video = document.createElement('video');
        video.className = 'post-media nv-video-el';
        video.src = src;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        return video;
    }

    function renderVideoPlayers(rootEl) {
        const container = rootEl || document;
        const mediaEls = container.querySelectorAll('img.post-media');
        mediaEls.forEach(img => {
            if (img.dataset.videoHydrated) return;
            const src = img.getAttribute('src') || '';
            if (!isVideoMediaUrl(src)) return;
            img.dataset.videoHydrated = '1';
            img.replaceWith(createVideoPlayer(src));
        });
    }

    function pauseOffscreenVideos(entryTarget) {
        if (!entryTarget) return;
        const vid = entryTarget.querySelector('.nv-video-el');
        if (vid && !vid.paused) {
            vid.pause();
        }
    }

    global.NvaritiaVideoPlayer = {
        isVideoMediaUrl,
        createVideoPlayer,
        renderVideoPlayers,
        pauseOffscreenVideos
    };
})(window);
