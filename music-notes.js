(function () {
    const DEFAULT_CLIP_SECONDS = 15;
    const SEARCH_DEBOUNCE_MS = 550;
    const CLIENT_CACHE_PREFIX = 'nvaritia_song_cache_';
    const PAUSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 511.989" style="width:15px;height:15px;vertical-align:-2px;display:inline-block;flex-shrink:0;"><path fill="#fff" fill-rule="nonzero" d="M256 0c70.678 0 134.697 28.664 181.017 74.983C483.336 121.303 512 185.322 512 256s-28.664 134.687-74.983 181.006c-46.32 46.319-110.339 74.983-181.017 74.983s-134.697-28.664-181.017-74.983C28.664 390.687 0 326.678 0 256S28.664 121.303 74.983 74.983C121.303 28.664 185.322 0 256 0zm-66.919 168.325h38.043c5.086 0 9.235 4.204 9.235 9.235v156.87c0 5.03-4.194 9.235-9.235 9.235h-38.043c-5.03 0-9.235-4.161-9.235-9.235V177.56c0-5.086 4.149-9.235 9.235-9.235zm95.772 0h38.055c5.086 0 9.235 4.193 9.235 9.235v156.87c0 5.03-4.194 9.235-9.235 9.235h-38.055c-5.041 0-9.235-4.161-9.235-9.235V177.56c0-5.086 4.161-9.235 9.235-9.235zm127.895-69.072C372.641 59.146 317.209 34.33 256 34.33c-61.209 0-116.641 24.816-156.748 64.923C59.146 139.36 34.33 194.791 34.33 256c0 61.209 24.816 116.63 64.922 156.737C139.359 452.843 194.791 477.66 256 477.66c61.209 0 116.641-24.817 156.748-64.923C452.854 372.63 477.67 317.209 477.67 256c0-61.209-24.816-116.64-64.922-156.747z"/></svg>`;

    let noteAudio = window.__nvaritiaNoteAudio || (window.__nvaritiaNoteAudio = new Audio());
    noteAudio.preload = 'auto';
    let noteAudioBtn = null;
    let onNoteStateChange = null;
    let searchDebounce = null;
    let selectedTrack = null;
    let createCallback = null;

    // Picker clip preview state
    let pickerStartSec = 0;
    let pickerDurationSec = DEFAULT_CLIP_SECONDS;
    let pickerTrackDuration = 30;
    let isPickerPreviewPlaying = false;
    let clipWatchInterval = null;
    const clientSearchCache = new Map();

    function esc(str) {
        return String(str || '').replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    function formatTime(sec) {
        const s = Math.max(0, Math.floor(Number(sec) || 0));
        const mins = Math.floor(s / 60);
        const rem = s % 60;
        return `${mins}:${String(rem).padStart(2, '0')}`;
    }

    function clearClipWatcher() {
        if (clipWatchInterval) {
            clearInterval(clipWatchInterval);
            clipWatchInterval = null;
        }
    }

    function stopPickerPreview() {
        isPickerPreviewPlaying = false;
        clearClipWatcher();
        try { noteAudio.pause(); } catch (e) {}
        const btn = document.getElementById('picker-preview-btn');
        if (btn) btn.innerText = '▶ Preview Clip';
    }

    function stopNoteAudio() {
        clearClipWatcher();
        try { noteAudio.pause(); } catch (e) {}
        if (noteAudioBtn) {
            noteAudioBtn.innerText = '▶ Play';
            noteAudioBtn = null;
        }
    }

    // Seeks reliably once data is ready, re-applying once if initial play starts at 0
    function playAtOffset(url, targetStart, onTick, onFinish) {
        clearClipWatcher();
        const start = Math.max(0, Number(targetStart) || 0);
        let appliedInitialSeek = false;
        let seekAttempts = 0;

        const forceSeek = () => {
            if (start <= 0) return;
            try {
                if (isFinite(noteAudio.duration) && noteAudio.duration > 0) {
                    noteAudio.currentTime = Math.min(start, Math.max(0, noteAudio.duration - 1));
                } else {
                    noteAudio.currentTime = start;
                }
            } catch (e) {}
        };

        const cleanupListeners = () => {
            noteAudio.removeEventListener('loadedmetadata', onMeta);
            noteAudio.removeEventListener('canplay', onCanPlay);
            noteAudio.removeEventListener('playing', onPlaying);
        };

        const onMeta = () => {
            if (isFinite(noteAudio.duration) && noteAudio.duration > 0 && selectedTrack) {
                pickerTrackDuration = Math.floor(noteAudio.duration);
                syncClipSliderBounds();
            }
            forceSeek();
        };

        const onCanPlay = () => {
            if (!appliedInitialSeek) {
                forceSeek();
            }
        };

        const onPlaying = () => {
            if (start > 0 && !appliedInitialSeek && noteAudio.currentTime < 1 && seekAttempts < 3) {
                seekAttempts++;
                forceSeek();
                setTimeout(() => {
                    if (noteAudio.currentTime >= 1) appliedInitialSeek = true;
                }, 150);
            } else {
                appliedInitialSeek = true;
            }
        };

        noteAudio.addEventListener('loadedmetadata', onMeta);
        noteAudio.addEventListener('canplay', onCanPlay);
        noteAudio.addEventListener('playing', onPlaying);

        if (noteAudio.src !== url) {
            noteAudio.src = url;
            noteAudio.load();
        } else if (noteAudio.readyState >= 2) {
            forceSeek();
        } else {
            noteAudio.load();
        }

        if (typeof onTick === 'function') {
            clipWatchInterval = setInterval(() => onTick(cleanupListeners), 200);
        }

        const p = noteAudio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {
                cleanupListeners();
                if (typeof onFinish === 'function') onFinish();
            });
        }

        return cleanupListeners;
    }

    noteAudio.addEventListener('ended', () => {
        stopPickerPreview();
        stopNoteAudio();
    });
    noteAudio.addEventListener('error', () => {
        stopPickerPreview();
        stopNoteAudio();
    });

    window.toggleNoteAudio = function (previewUrl, btnEl, startSec = 0, clipDuration = null) {
        if (!previewUrl) return;
        const start = Math.max(0, Number(startSec) || 0);
        const dur = clipDuration ? Math.max(3, Number(clipDuration)) : null;
        const end = dur ? start + dur : null;

        if (noteAudioBtn === btnEl && !noteAudio.paused) {
            stopNoteAudio();
            return;
        }
        stopNoteAudio();
        noteAudioBtn = btnEl || null;
        if (btnEl) btnEl.innerHTML = `${PAUSE_ICON_SVG} <span>Pause</span>`;

        playAtOffset(
            previewUrl,
            start,
            (cleanup) => {
                if (end && noteAudio.currentTime >= end) {
                    cleanup();
                    stopNoteAudio();
                }
            },
            () => stopNoteAudio()
        );
    };

    function syncClipSliderBounds() {
        const slider = document.getElementById('note-start-slider');
        const durSelect = document.getElementById('note-clip-length');
        const rangeLabel = document.getElementById('note-clip-range-label');
        const totalLabel = document.getElementById('note-track-total-label');
        if (!slider || !rangeLabel || !totalLabel) return;

        const maxDur = pickerTrackDuration > 0 ? pickerTrackDuration : 30;
        const effectiveDur = Math.min(pickerDurationSec, maxDur);
        const maxStart = Math.max(0, maxDur - effectiveDur);

        if (pickerStartSec > maxStart) pickerStartSec = maxStart;
        slider.max = String(maxStart);
        slider.value = String(pickerStartSec);
        if (durSelect) durSelect.value = String(pickerDurationSec);

        const endSec = Math.min(maxDur, pickerStartSec + effectiveDur);
        rangeLabel.innerText = `${formatTime(pickerStartSec)} – ${formatTime(endSec)} (${effectiveDur}s)`;
        totalLabel.innerText = pickerTrackDuration > 0 ? `Preview: ${formatTime(pickerTrackDuration)}` : 'Preview: up to 0:30';
    }

    window.onClipSliderInput = function (val) {
        pickerStartSec = Math.max(0, Number(val) || 0);
        syncClipSliderBounds();
        if (isPickerPreviewPlaying && selectedTrack && selectedTrack.previewUrl) {
            try { noteAudio.currentTime = pickerStartSec; } catch (e) {}
        }
    };

    window.onClipLengthChange = function (val) {
        pickerDurationSec = Math.max(5, Number(val) || DEFAULT_CLIP_SECONDS);
        syncClipSliderBounds();
    };

    window.togglePickerClipPreview = function () {
        if (!selectedTrack || !selectedTrack.previewUrl) {
            if (typeof showToast === 'function') showToast('No preview audio available for this track.');
            return;
        }
        const btn = document.getElementById('picker-preview-btn');
        if (isPickerPreviewPlaying && !noteAudio.paused) {
            stopPickerPreview();
            return;
        }

        isPickerPreviewPlaying = true;
        if (btn) btn.innerText = '⏸ Stop Preview';

        const maxDur = pickerTrackDuration > 0 ? pickerTrackDuration : 30;
        const effectiveDur = Math.min(pickerDurationSec, maxDur);
        const startAt = Math.min(pickerStartSec, Math.max(0, maxDur - effectiveDur));
        const stopAt = startAt + effectiveDur;

        playAtOffset(
            selectedTrack.previewUrl,
            startAt,
            (cleanup) => {
                if (!isPickerPreviewPlaying) {
                    cleanup();
                    return;
                }
                if (noteAudio.currentTime >= stopAt) {
                    try { noteAudio.currentTime = startAt; } catch (e) {}
                }
            },
            () => stopPickerPreview()
        );
    };

    function selectTrackForTrimming(track) {
        stopPickerPreview();
        selectedTrack = track;
        pickerStartSec = 0;
        pickerDurationSec = DEFAULT_CLIP_SECONDS;
        pickerTrackDuration = Number(track.durationSec) || 30;

        const box = document.getElementById('note-trimmer-box');
        const titleEl = document.getElementById('note-trimmer-title');
        if (box && titleEl) {
            titleEl.innerHTML = `<strong>${esc(track.trackName)}</strong> — ${esc(track.artistName)}`;
            box.style.display = 'flex';
        }
        syncClipSliderBounds();

        if (track.previewUrl) {
            noteAudio.src = track.previewUrl;
            noteAudio.load();
        }
    }

    function getClientCachedTracks(normQuery) {
        if (clientSearchCache.has(normQuery)) return clientSearchCache.get(normQuery);
        try {
            const raw = sessionStorage.getItem(CLIENT_CACHE_PREFIX + normQuery);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.expiresAt > Date.now() && Array.isArray(parsed.tracks)) {
                clientSearchCache.set(normQuery, parsed.tracks);
                return parsed.tracks;
            }
        } catch (e) {}
        return null;
    }

    function setClientCachedTracks(normQuery, tracks) {
        clientSearchCache.set(normQuery, tracks);
        try {
            sessionStorage.setItem(
                CLIENT_CACHE_PREFIX + normQuery,
                JSON.stringify({ tracks, expiresAt: Date.now() + 6 * 60 * 60 * 1000 })
            );
        } catch (e) {}
    }

    function ensureUiInjected() {
        if (document.getElementById('note-picker-modal')) return;

        const style = document.createElement('style');
        style.textContent = `
            .story-ring-wrapper {
                width: clamp(60px, 17vw, 76px);
                height: clamp(60px, 17vw, 76px);
            }
            .drawer-header .story-ring-wrapper {
                width: clamp(34px, 9.5vw, 42px);
                height: clamp(34px, 9.5vw, 42px);
            }
            .story-ring-wrapper.has-note:not(.has-story) {
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
                padding: 3px;
                cursor: pointer;
            }
            .drawer-header .story-ring-wrapper.has-story,
            .drawer-header .story-ring-wrapper.has-note:not(.has-story) {
                padding: 2px;
            }
            .story-ring-wrapper.has-note:not(.has-story) .avatar,
            .story-ring-wrapper.has-note:not(.has-story) .profile-pfp {
                border: 2.5px solid #fff;
            }
            html.dark .story-ring-wrapper.has-note:not(.has-story) .avatar,
            html.dark .story-ring-wrapper.has-note:not(.has-story) .profile-pfp {
                border-color: #121212;
            }
            .feed-avatar-container.has-note:not(.has-story) {
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
                padding: 2.5px;
            }
            .note-tray-card,
            .story-tray-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: clamp(78px, 21vw, 96px);
                flex-shrink: 0;
                cursor: pointer;
                user-select: none;
            }
            .stories-tray .story-ring-wrapper,
            .note-tray-ring {
                width: clamp(64px, 18vw, 80px);
                height: clamp(64px, 18vw, 80px);
                border-radius: 50%;
                padding: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .note-tray-ring {
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
            }
            .note-tray-ring img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 2.5px solid #fff;
                background: #f0f0f0;
                display: block;
            }
            html.dark .note-tray-ring img {
                border-color: #121212;
            }
            .note-tray-song {
                font-size: 10.5px;
                font-weight: 600;
                color: #854d0e;
                background: #fef9c3;
                border-radius: 999px;
                padding: 2px 7px;
                margin-top: 5px;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .note-tray-user,
            .story-tray-name {
                font-size: 12px;
                color: #222;
                margin-top: 5px;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
            }
            .note-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.55);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                padding: 14px;
            }
            .note-modal-backdrop.open { display: flex; }
            .note-modal-box {
                width: 100%;
                max-width: 420px;
                background: #fff;
                color: #111;
                border-radius: 10px;
                border: 1px solid #e5e5e5;
                overflow: hidden;
                max-height: 88vh;
                display: flex;
                flex-direction: column;
            }
            .note-modal-head {
                padding: 10px 14px;
                background: #fafafa;
                border-bottom: 1px solid #e5e5e5;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 700;
            }
            .note-modal-body {
                padding: 14px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .note-search-results {
                max-height: 165px;
                overflow-y: auto;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
            }
            .note-track-row {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                border-bottom: 1px solid #f1f1f1;
                cursor: pointer;
            }
            .note-track-row:last-child { border-bottom: none; }
            .note-track-row:hover, .note-track-row.selected { background: #fef9c3; }
            .note-track-row img {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                object-fit: cover;
                flex-shrink: 0;
            }
            .note-trimmer-box {
                display: none;
                flex-direction: column;
                gap: 8px;
                background: #fefce8;
                border: 1px solid #eab308;
                border-radius: 8px;
                padding: 10px;
                font-size: 12px;
            }
            .note-viewer-card {
                display: flex;
                gap: 12px;
                align-items: center;
                background: #fafafa;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                padding: 10px;
            }
            .note-viewer-card img {
                width: 56px;
                height: 56px;
                border-radius: 8px;
                object-fit: cover;
                flex-shrink: 0;
            }
        `;
        document.head.appendChild(style);

        const picker = document.createElement('div');
        picker.id = 'note-picker-modal';
        picker.className = 'note-modal-backdrop';
        picker.innerHTML = `
            <div class="note-modal-box">
                <div class="note-modal-head">
                    <span>Post a 24h Music Note</span>
                    <span style="cursor:pointer;font-size:18px;" onclick="closeNotePicker()">✕</span>
                </div>
                <div class="note-modal-body">
                    <input type="text" id="note-text-input" maxlength="80" placeholder="Add a short note (optional)..." style="width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:13px;">
                    <input type="text" id="note-song-search" placeholder="Search a song or artist..." style="width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:13px;">
                    <div id="note-search-status" style="font-size:11px;color:#666;">Type a song title to search.</div>
                    <div id="note-search-results" class="note-search-results" style="display:none;"></div>

                    <div id="note-trimmer-box" class="note-trimmer-box">
                        <div id="note-trimmer-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;color:#444;">
                            <span>Part: <strong id="note-clip-range-label">0:00 – 0:15 (15s)</strong></span>
                            <span id="note-track-total-label"></span>
                        </div>
                        <input type="range" id="note-start-slider" min="0" max="25" value="0" step="1" oninput="onClipSliderInput(this.value)" style="width:100%;accent-color:#eab308;cursor:pointer;">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                            <button type="button" id="picker-preview-btn" onclick="togglePickerClipPreview()" style="padding:6px 12px;border:none;background:#111;color:#fff;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">▶ Preview Clip</button>
                            <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:#444;">
                                Length:
                                <select id="note-clip-length" onchange="onClipLengthChange(this.value)" style="padding:4px 6px;border:1px solid #ccc;border-radius:6px;background:#fff;font-size:11px;">
                                    <option value="5">5s</option>
                                    <option value="10">10s</option>
                                    <option value="15" selected>15s</option>
                                    <option value="20">20s</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button type="button" onclick="closeNotePicker()" style="padding:7px 12px;border:1px solid #ccc;background:#fff;border-radius:6px;font-weight:600;cursor:pointer;">Cancel</button>
                        <button type="button" id="note-publish-btn" onclick="submitMusicNote()" style="padding:7px 14px;border:none;background:#eab308;color:#111;border-radius:6px;font-weight:700;cursor:pointer;">Share Note</button>
                    </div>
                </div>
            </div>
        `;

        const viewer = document.createElement('div');
        viewer.id = 'note-viewer-modal';
        viewer.className = 'note-modal-backdrop';
        viewer.innerHTML = `
            <div class="note-modal-box">
                <div class="note-modal-head">
                    <span id="note-viewer-title">Music Note</span>
                    <span style="cursor:pointer;font-size:18px;" onclick="closeNoteViewer()">✕</span>
                </div>
                <div id="note-viewer-body" class="note-modal-body"></div>
            </div>
        `;

        document.body.appendChild(picker);
        document.body.appendChild(viewer);

        document.getElementById('note-song-search').addEventListener('input', (e) => {
            const q = e.target.value.trim();
            clearTimeout(searchDebounce);
            if (q.length < 2) {
                document.getElementById('note-search-results').style.display = 'none';
                document.getElementById('note-search-status').innerText = 'Type at least 2 characters to search.';
                return;
            }
            document.getElementById('note-search-status').innerText = 'Searching...';
            searchDebounce = setTimeout(() => searchSongs(q), SEARCH_DEBOUNCE_MS);
        });
    }

    function renderTrackResults(tracks) {
        const statusEl = document.getElementById('note-search-status');
        const listEl = document.getElementById('note-search-results');
        if (!tracks.length) {
            statusEl.innerText = 'No matching songs found.';
            listEl.style.display = 'none';
            return;
        }
        statusEl.innerText = 'Tap a song to pick a clip & preview:';
        listEl.style.display = 'block';
        listEl.innerHTML = '';

        tracks.forEach(t => {
            const row = document.createElement('div');
            row.className = 'note-track-row';
            row.innerHTML = `
                <img src="${esc(t.artworkUrl)}" alt="">
                <div style="min-width:0;flex:1;">
                    <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.trackName)}</div>
                    <div style="font-size:11px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.artistName || '')}</div>
                </div>
            `;
            row.onclick = () => {
                listEl.querySelectorAll('.note-track-row').forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
                selectTrackForTrimming(t);
            };
            listEl.appendChild(row);
        });
    }

    async function searchSongs(query) {
        const statusEl = document.getElementById('note-search-status');
        const normQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
        const localHit = getClientCachedTracks(normQuery);
        if (localHit) {
            renderTrackResults(localHit);
            return;
        }

        try {
            const workerUrl = typeof WORKER_ORIGIN !== 'undefined' && WORKER_ORIGIN
                ? `${WORKER_ORIGIN}/api/notes/search?q=${encodeURIComponent(normQuery)}`
                : `https://itunes.apple.com/search?term=${encodeURIComponent(normQuery)}&entity=song&limit=10`;

            const res = await fetch(workerUrl);
            if (res.status === 429) {
                statusEl.innerText = 'Search rate limit reached briefly—wait a few seconds and try again.';
                return;
            }
            const data = await res.json();
            const tracks = Array.isArray(data.tracks)
                ? data.tracks
                : (data.results || [])
                    .filter(t => t.trackId && t.trackName)
                    .map(t => ({
                        trackId: String(t.trackId),
                        trackName: t.trackName,
                        artistName: t.artistName || 'Unknown Artist',
                        artworkUrl: (t.artworkUrl100 || '').replace('100x100', '200x200'),
                        previewUrl: t.previewUrl || '',
                        trackViewUrl: t.trackViewUrl || '',
                        durationSec: 30
                    }));

            setClientCachedTracks(normQuery, tracks);
            renderTrackResults(tracks);
        } catch (err) {
            statusEl.innerText = 'Could not reach song search right now.';
        }
    }

    window.openNotePicker = function (onCreated) {
        ensureUiInjected();
        stopPickerPreview();
        stopNoteAudio();
        selectedTrack = null;
        pickerStartSec = 0;
        pickerDurationSec = DEFAULT_CLIP_SECONDS;
        pickerTrackDuration = 30;
        createCallback = typeof onCreated === 'function' ? onCreated : null;
        document.getElementById('note-text-input').value = '';
        document.getElementById('note-song-search').value = '';
        document.getElementById('note-search-results').style.display = 'none';
        document.getElementById('note-search-results').innerHTML = '';
        document.getElementById('note-trimmer-box').style.display = 'none';
        document.getElementById('note-search-status').innerText = 'Type a song title to search.';
        document.getElementById('note-picker-modal').classList.add('open');
    };

    window.closeNotePicker = function () {
        stopPickerPreview();
        const el = document.getElementById('note-picker-modal');
        if (el) el.classList.remove('open');
    };

    window.submitMusicNote = async function () {
        if (!selectedTrack) {
            if (typeof showToast === 'function') showToast('Please pick a song first.');
            return;
        }
        stopPickerPreview();
        const btn = document.getElementById('note-publish-btn');
        btn.disabled = true;
        try {
            const noteText = document.getElementById('note-text-input').value.trim();
            const clipStart = pickerStartSec;
            const clipDuration = pickerDurationSec;

            const payload = {
                noteText,
                trackId: selectedTrack.trackId,
                trackName: selectedTrack.trackName,
                artistName: selectedTrack.artistName,
                artworkUrl: selectedTrack.artworkUrl,
                previewUrl: selectedTrack.previewUrl,
                trackViewUrl: selectedTrack.trackViewUrl,
                clipStart,
                clipDuration
            };

            const res = await fetch(`${WORKER_ORIGIN}/api/notes/create`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to share note');

            const createdNote = Object.assign(
                {
                    track_id: selectedTrack.trackId,
                    track_name: selectedTrack.trackName,
                    artist_name: selectedTrack.artistName,
                    artwork_url: selectedTrack.artworkUrl,
                    preview_url: selectedTrack.previewUrl,
                    track_view_url: selectedTrack.trackViewUrl,
                    note_text: noteText,
                    clip_start: clipStart,
                    clip_duration: clipDuration
                },
                data.note || {}
            );

            closeNotePicker();
            if (typeof showToast === 'function') showToast('Music note shared for 24 hours!');
            if (createCallback) createCallback(createdNote);
            if (typeof onNoteStateChange === 'function') onNoteStateChange();
        } catch (err) {
            if (typeof showToast === 'function') showToast(err.message);
        } finally {
            btn.disabled = false;
        }
    };

    window.openNoteViewer = function (note, ownerLabel, isOwner, onDeleted) {
        ensureUiInjected();
        stopPickerPreview();
        stopNoteAudio();
        const titleEl = document.getElementById('note-viewer-title');
        const bodyEl = document.getElementById('note-viewer-body');
        titleEl.innerText = ownerLabel ? `${ownerLabel} Music Note` : 'Music Note';

        const streamUrl = note.preview_url || note.previewUrl || '';
        const safeStream = streamUrl.replace(/'/g, "\\'");
        const trackLink = note.track_view_url || note.trackViewUrl || '';
        const clipStart = Math.max(0, Number(note.clip_start ?? note.clipStart ?? 0) || 0);
        const clipDuration = Math.max(3, Number(note.clip_duration ?? note.clipDuration ?? DEFAULT_CLIP_SECONDS) || DEFAULT_CLIP_SECONDS);

        bodyEl.innerHTML = `
            ${note.note_text ? `<div style="font-size:14px;font-weight:600;padding:4px 2px;">"${esc(note.note_text)}"</div>` : ''}
            <div class="note-viewer-card">
                <img src="${esc(note.artwork_url || note.artworkUrl || '')}" alt="">
                <div style="min-width:0;flex:1;">
                    <div style="font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(note.track_name || note.trackName || '')}</div>
                    <div style="font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(note.artist_name || note.artistName || '')}</div>
                    <div style="font-size:11px;color:#854d0e;margin-top:2px;">Clip: ${formatTime(clipStart)} – ${formatTime(clipStart + clipDuration)}</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                ${streamUrl ? `<button type="button" id="note-play-btn" onclick="toggleNoteAudio('${safeStream}', this, ${clipStart}, ${clipDuration})" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:none;background:#000;color:#fff;border-radius:6px;font-weight:600;cursor:pointer;">${PAUSE_ICON_SVG} <span>Pause</span></button>` : ''}
                ${trackLink ? `<a href="${esc(trackLink)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none;">Open on Apple Music ↗</a>` : ''}
                ${isOwner ? `<button type="button" id="change-note-btn" style="margin-left:auto;padding:7px 12px;border:1px solid #eab308;background:#fef9c3;color:#111;border-radius:6px;font-weight:600;cursor:pointer;">Change</button>` : ''}
                ${isOwner ? `<button type="button" id="delete-note-btn" style="padding:7px 12px;border:1px solid #ef4444;background:#fff;color:#ef4444;border-radius:6px;font-weight:600;cursor:pointer;">Delete</button>` : ''}
            </div>
        `;

        if (streamUrl) {
            const playBtn = document.getElementById('note-play-btn');
            window.toggleNoteAudio(streamUrl, playBtn, clipStart, clipDuration);
        }

        if (isOwner) {
            document.getElementById('change-note-btn').onclick = () => {
                closeNoteViewer();
                openNotePicker(onDeleted);
            };
            document.getElementById('delete-note-btn').onclick = async () => {
                try {
                    const res = await fetch(`${WORKER_ORIGIN}/api/notes/delete`, {
                        method: 'POST',
                        headers: authHeaders({ 'Content-Type': 'application/json' })
                    });
                    if (!res.ok) throw new Error('Failed to delete note');
                    closeNoteViewer();
                    if (typeof showToast === 'function') showToast('Music note removed.');
                    if (typeof onDeleted === 'function') onDeleted();
                    if (typeof onNoteStateChange === 'function') onNoteStateChange();
                } catch (e) {
                    if (typeof showToast === 'function') showToast(e.message);
                }
            };
        }

        document.getElementById('note-viewer-modal').classList.add('open');
    };

    window.closeNoteViewer = function () {
        stopNoteAudio();
        const el = document.getElementById('note-viewer-modal');
        if (el) el.classList.remove('open');
    };

    window.setNoteChangeListener = function (fn) {
        onNoteStateChange = fn;
    };
})();
