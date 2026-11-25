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

    function generateVideoPoster(src, videoEl) {
        try {
            const probe = document.createElement('video');
            probe.src = src;
            probe.muted = true;
            probe.playsInline = true;
            probe.preload = 'auto';
            if (!src.startsWith('data:') && !src.startsWith('blob:')) {
                probe.crossOrigin = 'anonymous';
            }

            let captured = false;

            const captureFrame = () => {
                if (captured) return;
                const w = probe.videoWidth;
                const h = probe.videoHeight;
                if (!w || !h) return;

                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(probe, 0, 0, w, h);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    if (dataUrl && dataUrl.startsWith('data:image/jpeg')) {
                        captured = true;
                        videoEl.setAttribute('poster', dataUrl);
                    }
                } catch (e) {
                    // Canvas tainted or CORS blocked; leave video element as-is
                } finally {
                    probe.removeAttribute('src');
                    probe.load();
                }
            };

            probe.addEventListener('loadedmetadata', () => {
                const targetTime = probe.duration && isFinite(probe.duration)
                    ? Math.min(0.1, Math.max(0, probe.duration * 0.05))
                    : 0;
                if (targetTime > 0 && probe.currentTime !== targetTime) {
                    try {
                        probe.currentTime = targetTime;
                    } catch (e) {
                        captureFrame();
                    }
                } else {
                    captureFrame();
                }
            }, { once: true });

            probe.addEventListener('seeked', captureFrame, { once: true });
            probe.addEventListener('loadeddata', () => {
                if (!captured && (!probe.duration || probe.currentTime > 0)) {
                    captureFrame();
                }
            }, { once: true });

            probe.load();
        } catch (e) {}
    }

    function createVideoPlayer(src) {
        injectStyles();

        const wrap = document.createElement('div');
        wrap.className = 'nv-video-wrap';

        const video = document.createElement('video');
        video.className = 'post-media nv-video-el';
        video.src = src;
        video.playsInline = true;
        video.preload = 'metadata';

        generateVideoPoster(src, video);

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
