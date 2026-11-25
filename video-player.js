(function (global) {
    function injectStyles() {
        if (document.getElementById('nv-video-player-styles')) return;
        const style = document.createElement('style');
        style.id = 'nv-video-player-styles';
        style.textContent = `
            .nv-video-wrap {
                position: relative;
                display: inline-block;
                max-width: 100%;
                border-radius: 6px;
                border: 1px solid #e5e5e5;
                margin-bottom: 4px;
                overflow: hidden;
                background: #000;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            .nv-video-wrap .nv-video-el {
                display: block;
                max-width: 100%;
                max-height: 400px;
                min-height: 180px;
                border: none;
                border-radius: 0;
                margin-bottom: 0;
                background: #000;
                -webkit-tap-highlight-color: transparent;
            }
            .nv-video-play-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.2);
                pointer-events: none;
                transition: opacity 0.15s ease;
                z-index: 2;
            }
            .nv-video-wrap.is-playing .nv-video-play-overlay {
                opacity: 0;
                visibility: hidden;
            }
            .nv-video-play-badge {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.72);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .nv-video-play-badge svg {
                width: 24px;
                height: 24px;
                fill: #ffffff;
                margin-left: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    function isVideoMediaUrl(url) {
        if (!url || typeof url !== 'string') return false;
        return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url) || url.startsWith('data:video/');
    }

    function forceFirstFrame(videoEl) {
        if (!videoEl) return;
        let done = false;
        const seekToFrame = () => {
            if (done || !videoEl.paused) return;
            done = true;
            try {
                const dur = videoEl.duration;
                videoEl.currentTime = (dur && isFinite(dur) && dur > 0.2) ? 0.1 : 0.01;
            } catch (e) {}
        };
        videoEl.addEventListener('loadedmetadata', seekToFrame, { once: true });
        videoEl.addEventListener('loadeddata', seekToFrame, { once: true });
        videoEl.addEventListener('canplay', seekToFrame, { once: true });
        videoEl.load();
    }

    function createVideoPlayer(src) {
        injectStyles();

        const wrap = document.createElement('div');
        wrap.className = 'nv-video-wrap';

        const video = document.createElement('video');
        video.className = 'post-media nv-video-el';
        video.src = src;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.preload = 'auto';

        forceFirstFrame(video);

        const overlay = document.createElement('div');
        overlay.className = 'nv-video-play-overlay';
        overlay.innerHTML = `
            <div class="nv-video-play-badge">
                <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
            </div>
        `;

        video.addEventListener('play', () => {
            wrap.classList.add('is-playing');
        });
        video.addEventListener('pause', () => {
            wrap.classList.remove('is-playing');
        });
        video.addEventListener('ended', () => {
            wrap.classList.remove('is-playing');
        });

        wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused || video.ended) {
                video.muted = false;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });

        wrap.appendChild(video);
        wrap.appendChild(overlay);
        return wrap;
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
