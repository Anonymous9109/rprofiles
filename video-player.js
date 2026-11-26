(function (global) {
    const HUD_HIDE_DELAY = 2200;

    function injectStyles() {
        if (document.getElementById('nv-video-player-styles')) return;
        const style = document.createElement('style');
        style.id = 'nv-video-player-styles';
        style.textContent = `
            .nv-video-wrap,
            .nv-video-wrap * {
                box-sizing: border-box;
            }
            .nv-video-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                max-width: 100%;
                border-radius: 10px;
                border: 1px solid #e5e5e5;
                margin-bottom: 4px;
                overflow: hidden;
                background: #000000;
                background-color: #000000;
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            .nv-video-wrap .nv-video-el {
                display: block;
                width: 100%;
                max-width: 100%;
                max-height: 400px;
                min-height: 180px;
                object-fit: contain;
                border: none;
                border-radius: 0;
                margin: 0;
                padding: 0;
                background: #000000;
                background-color: #000000;
                color: #000000;
                -webkit-tap-highlight-color: transparent;
            }
            .nv-video-poster-black {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000000;
                background-color: #000000;
                pointer-events: none;
                opacity: 1;
                visibility: visible;
                transition: opacity 0.15s ease;
                z-index: 1;
            }
            .nv-video-wrap.is-frame-ready .nv-video-poster-black {
                opacity: 0;
                visibility: hidden;
            }
            .nv-video-center-btn,
            .nv-video-play-overlay {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                z-index: 2;
            }
            .nv-video-wrap.is-playing:not(.show-hud) .nv-video-center-btn,
            .nv-video-wrap.is-playing:not(.show-hud) .nv-video-play-overlay {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            .nv-video-wrap.is-playing:not(.show-hud) .nv-video-hud {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }
            .nv-video-wrap.is-playing.show-hud .nv-video-center-btn,
            .nv-video-wrap.is-playing.show-hud .nv-video-play-overlay,
            .nv-video-wrap.is-playing.show-hud .nv-video-hud {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
            .nv-video-play-badge {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.72);
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                transition: background 0.15s ease, transform 0.15s ease;
            }
            .nv-video-play-overlay:hover .nv-video-play-badge,
            .nv-video-center-btn:hover .nv-video-play-badge {
                background: rgba(0, 0, 0, 0.88);
                transform: scale(1.06);
            }
            .nv-video-play-badge svg {
                width: 24px;
                height: 24px;
                fill: #ffffff;
                margin-left: 3px;
            }
            .nv-video-hud {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 18px 12px 10px;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0));
                display: flex;
                flex-direction: column;
                gap: 6px;
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                z-index: 3;
            }
            .nv-video-timer-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                font-size: 11px;
                font-weight: 600;
            }
            .nv-video-progress-hit {
                width: 100%;
                padding: 6px 0;
                cursor: pointer;
                touch-action: none;
            }
            .nv-video-progress-track {
                width: 100%;
                height: 4px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.32);
                overflow: hidden;
            }
            .nv-video-progress-fill {
                width: 0%;
                height: 100%;
                background: #ffffff;
                border-radius: 999px;
            }
        `;
        document.head.appendChild(style);
    }

    function ensureBlackCover(wrap, video) {
        if (!wrap || !video) return null;
        let cover = wrap.querySelector('.nv-video-poster-black');
        if (!cover) {
            cover = document.createElement('div');
            cover.className = 'nv-video-poster-black';
            video.insertAdjacentElement('afterend', cover);
        }
        return cover;
    }

    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) return '0:00';
        const total = Math.floor(sec);
        const mins = Math.floor(total / 60);
        const rem = total % 60;
        return `${mins}:${String(rem).padStart(2, '0')}`;
    }

    function isVideoMediaUrl(url) {
        if (!url || typeof url !== 'string') return false;
        return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url) || url.startsWith('data:video/');
    }

    function unmuteVideo(videoEl) {
        if (!videoEl) return;
        videoEl.muted = false;
        videoEl.defaultMuted = false;
        videoEl.volume = 1.0;
    }

    function primeFirstFrame(videoEl, wrap) {
        if (!videoEl || videoEl.dataset.nvPrimed === '1') return;
        videoEl.dataset.nvPrimed = '1';

        const markReady = () => {
            if (wrap) wrap.classList.add('is-frame-ready');
        };

        const seekOnce = () => {
            if (!videoEl.paused || videoEl.dataset.nvSeeked === '1') return;
            if (videoEl.readyState < 1) return;
            videoEl.dataset.nvSeeked = '1';
            try {
                const dur = videoEl.duration;
                if (isFinite(dur) && dur > 0.15) {
                    videoEl.currentTime = 0.05;
                }
            } catch (e) {}
        };

        videoEl.addEventListener('loadedmetadata', seekOnce, { once: true });
        videoEl.addEventListener('loadeddata', () => {
            seekOnce();
            markReady();
        }, { once: true });
        videoEl.addEventListener('seeked', markReady, { once: true });
        videoEl.addEventListener('playing', markReady, { once: true });

        if (videoEl.readyState >= 2) {
            markReady();
        } else if (videoEl.readyState >= 1) {
            seekOnce();
        }
    }

    function bindPlayerToWrap(wrap, video) {
        if (!wrap || !video || wrap.dataset.nvBound === '1') return;
        wrap.dataset.nvBound = '1';
        injectStyles();
        ensureBlackCover(wrap, video);

        let hideTimer = null;
        let isScrubbing = false;
        const timerEl = wrap.querySelector('.nv-video-timer');
        const fillEl = wrap.querySelector('.nv-video-progress-fill');
        const hitEl = wrap.querySelector('.nv-video-progress-hit');

        const clearHideTimer = () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        };

        const scheduleHide = () => {
            clearHideTimer();
            if (!video.paused && !video.ended && !isScrubbing) {
                hideTimer = setTimeout(() => {
                    wrap.classList.remove('show-hud');
                }, HUD_HIDE_DELAY);
            }
        };

        const pulseHud = () => {
            wrap.classList.add('show-hud');
            scheduleHide();
        };

        const syncProgress = () => {
            const cur = video.currentTime || 0;
            const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
            if (timerEl) {
                timerEl.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
            }
            if (fillEl) {
                const pct = dur > 0 ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;
                fillEl.style.width = `${pct}%`;
            }
        };

        const seekFromClientX = (clientX) => {
            if (!hitEl) return;
            const dur = video.duration;
            if (!isFinite(dur) || dur <= 0) return;
            const rect = hitEl.getBoundingClientRect();
            if (!rect.width) return;
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            video.currentTime = ratio * dur;
            syncProgress();
        };

        const togglePlay = () => {
            if (video.paused || video.ended) {
                video.dataset.userPlayed = '1';
                unmuteVideo(video);
                const p = video.play();
                if (p && typeof p.then === 'function') {
                    p.then(() => {
                        unmuteVideo(video);
                        wrap.classList.add('is-frame-ready');
                    }).catch(() => {});
                }
            } else {
                video.dataset.userPlayed = '';
                video.pause();
            }
        };

        video.addEventListener('play', () => {
            wrap.classList.add('is-playing', 'is-frame-ready');
            if (video.dataset.userPlayed) {
                unmuteVideo(video);
            }
            pulseHud();
        });

        video.addEventListener('pause', () => {
            clearHideTimer();
            wrap.classList.remove('is-playing', 'show-hud');
        });

        video.addEventListener('ended', () => {
            clearHideTimer();
            wrap.classList.remove('is-playing', 'show-hud');
            syncProgress();
        });

        video.addEventListener('timeupdate', syncProgress);
        video.addEventListener('loadedmetadata', syncProgress);
        video.addEventListener('seeked', syncProgress);

        if (hitEl) {
            hitEl.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                isScrubbing = true;
                clearHideTimer();
                wrap.classList.add('show-hud');
                if (hitEl.setPointerCapture) {
                    try { hitEl.setPointerCapture(e.pointerId); } catch (_) {}
                }
                seekFromClientX(e.clientX);
            });

            hitEl.addEventListener('pointermove', (e) => {
                if (!isScrubbing) return;
                e.stopPropagation();
                seekFromClientX(e.clientX);
            });

            const finishScrub = (e) => {
                if (!isScrubbing) return;
                e.stopPropagation();
                seekFromClientX(e.clientX);
                isScrubbing = false;
                if (hitEl.releasePointerCapture) {
                    try { hitEl.releasePointerCapture(e.pointerId); } catch (_) {}
                }
                scheduleHide();
            };

            hitEl.addEventListener('pointerup', finishScrub);
            hitEl.addEventListener('pointercancel', finishScrub);

            hitEl.addEventListener('click', (e) => {
                e.stopPropagation();
                seekFromClientX(e.clientX);
                pulseHud();
            });
        }

        wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isScrubbing) return;
            if (video.paused || video.ended) {
                togglePlay();
                return;
            }
            if (wrap.classList.contains('show-hud')) {
                togglePlay();
            } else {
                pulseHud();
            }
        });

        primeFirstFrame(video, wrap);
        syncProgress();
    }

    function createVideoPlayer(src) {
        injectStyles();

        const wrap = document.createElement('div');
        wrap.className = 'nv-video-wrap';

        const video = document.createElement('video');
        video.className = 'post-media nv-video-el';
        video.src = src;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.preload = 'metadata';
        unmuteVideo(video);

        const blackCover = document.createElement('div');
        blackCover.className = 'nv-video-poster-black';

        const overlay = document.createElement('div');
        overlay.className = 'nv-video-play-overlay';
        overlay.innerHTML = `
            <div class="nv-video-play-badge">
                <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
            </div>
        `;

        const hud = document.createElement('div');
        hud.className = 'nv-video-hud';
        hud.innerHTML = `
            <div class="nv-video-timer-row">
                <span class="nv-video-timer">0:00 / 0:00</span>
            </div>
            <div class="nv-video-progress-hit" role="slider" aria-label="Seek video">
                <div class="nv-video-progress-track">
                    <div class="nv-video-progress-fill"></div>
                </div>
            </div>
        `;

        wrap.appendChild(video);
        wrap.appendChild(blackCover);
        wrap.appendChild(overlay);
        wrap.appendChild(hud);
        bindPlayerToWrap(wrap, video);
        return wrap;
    }

    function bindCustomVideoPlayers(rootEl) {
        const container = rootEl || document;
        container.querySelectorAll('.nv-video-wrap').forEach(wrap => {
            const vid = wrap.querySelector('video.nv-video-el, video');
            if (vid) {
                bindPlayerToWrap(wrap, vid);
            }
        });
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

        bindCustomVideoPlayers(container);
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
        pauseOffscreenVideos,
        bindCustomVideoPlayers
    };
    global.bindCustomVideoPlayers = bindCustomVideoPlayers;
})(window);
