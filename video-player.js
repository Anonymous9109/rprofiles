(function (global) {
    const posterCache = new Map();

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
            .nv-video-poster-img {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
                display: none;
                background: #000;
            }
            .nv-video-poster-img.has-poster {
                display: block;
            }
            .nv-video-wrap.is-playing .nv-video-poster-img {
                display: none;
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

    function applyPoster(videoEl, posterImgEl, dataUrl) {
        if (!dataUrl) return;
        if (videoEl && !videoEl.getAttribute('poster')) {
            videoEl.setAttribute('poster', dataUrl);
        }
        if (posterImgEl) {
            posterImgEl.src = dataUrl;
            posterImgEl.classList.add('has-poster');
        }
    }

    function generateVideoPoster(src, videoEl, posterImgEl) {
        if (!src || !videoEl) return;

        if (posterCache.has(src)) {
            applyPoster(videoEl, posterImgEl, posterCache.get(src));
            return;
        }

        try {
            const probe = document.createElement('video');
            probe.muted = true;
            probe.defaultMuted = true;
            probe.playsInline = true;
            probe.preload = 'auto';
            if (!src.startsWith('data:') && !src.startsWith('blob:')) {
                probe.crossOrigin = 'anonymous';
            }

            let done = false;
            let seekAttempted = false;

            const cleanup = () => {
                try {
                    probe.pause();
                    probe.removeAttribute('src');
                    probe.load();
                } catch (e) {}
            };

            const tryCapture = () => {
                if (done) return;
                const w = probe.videoWidth;
                const h = probe.videoHeight;
                if (!w || !h) return;

                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(probe, 0, 0, w, h);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
                    if (dataUrl && dataUrl.startsWith('data:image/jpeg')) {
                        done = true;
                        posterCache.set(src, dataUrl);
                        applyPoster(videoEl, posterImgEl, dataUrl);
                        cleanup();
                    }
                } catch (e) {
                    // Tainted canvas when R2/CDN lacks Access-Control-Allow-Origin
                    done = true;
                    cleanup();
                }
            };

            const triggerSeek = () => {
                if (seekAttempted || done) return;
                seekAttempted = true;
                try {
                    const dur = probe.duration;
                    if (dur && isFinite(dur) && dur > 0.2) {
                        probe.currentTime = Math.min(0.15, dur * 0.05);
                    } else {
                        tryCapture();
                    }
                } catch (e) {
                    tryCapture();
                }
            };

            probe.addEventListener('loadedmetadata', triggerSeek, { once: true });
            probe.addEventListener('loadeddata', () => {
                if (!done) {
                    if (!seekAttempted) {
                        triggerSeek();
                    } else {
                        tryCapture();
                    }
                }
            });
            probe.addEventListener('seeked', tryCapture, { once: true });
            probe.addEventListener('canplay', () => {
                if (!done) tryCapture();
            }, { once: true });
            probe.addEventListener('error', () => {
                done = true;
                cleanup();
            }, { once: true });

            setTimeout(() => {
                if (!done) {
                    tryCapture();
                    if (!done) {
                        done = true;
                        cleanup();
                    }
                }
            }, 6000);

            probe.src = src;
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
        video.preload = 'auto';

        const posterImg = document.createElement('img');
        posterImg.className = 'nv-video-poster-img';
        posterImg.alt = '';

        generateVideoPoster(src, video, posterImg);

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
        wrap.appendChild(posterImg);
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
