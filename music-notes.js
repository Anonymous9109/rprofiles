(function () {
    let noteAudio = new Audio();
    let noteAudioBtn = null;
    let onNoteStateChange = null;
    let searchDebounce = null;
    let selectedTrack = null;
    let createCallback = null;

    function esc(str) {
        return String(str || '').replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    function stopNoteAudio() {
        try { noteAudio.pause(); } catch (e) {}
        if (noteAudioBtn) {
            noteAudioBtn.innerText = '▶ Play Preview';
            noteAudioBtn = null;
        }
    }

    noteAudio.addEventListener('ended', stopNoteAudio);
    noteAudio.addEventListener('error', stopNoteAudio);

    window.toggleNoteAudio = function (previewUrl, btnEl) {
        if (!previewUrl) return;
        if (noteAudioBtn === btnEl && !noteAudio.paused) {
            stopNoteAudio();
            return;
        }
        stopNoteAudio();
        noteAudio.src = previewUrl;
        noteAudioBtn = btnEl;
        btnEl.innerText = '⏸ Pause';
        noteAudio.play().catch(() => {
            stopNoteAudio();
        });
    };

    function ensureUiInjected() {
        if (document.getElementById('note-picker-modal')) return;

        const style = document.createElement('style');
        style.textContent = `
            .story-ring-wrapper.has-note:not(.has-story) {
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
                padding: 2.5px;
                cursor: pointer;
            }
            .story-ring-wrapper.has-note:not(.has-story) .avatar,
            .story-ring-wrapper.has-note:not(.has-story) .profile-pfp {
                border: 2px solid #fff;
            }
            html.dark .story-ring-wrapper.has-note:not(.has-story) .avatar,
            html.dark .story-ring-wrapper.has-note:not(.has-story) .profile-pfp {
                border-color: #121212;
            }
            .feed-avatar-container.has-note:not(.has-story) {
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
                padding: 2px;
            }
            .note-tray-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: clamp(66px, 18vw, 78px);
                flex-shrink: 0;
                cursor: pointer;
                user-select: none;
            }
            .note-tray-ring {
                width: clamp(54px, 15vw, 64px);
                height: clamp(54px, 15vw, 64px);
                border-radius: 50%;
                background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
                padding: 2.5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .note-tray-ring img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #fff;
                background: #f0f0f0;
                display: block;
            }
            .note-tray-song {
                font-size: 10px;
                font-weight: 600;
                color: #854d0e;
                background: #fef9c3;
                border-radius: 8px;
                padding: 2px 5px;
                margin-top: 4px;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .note-tray-user {
                font-size: 11px;
                color: #222;
                margin-top: 2px;
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
                max-height: 85vh;
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
                max-height: 190px;
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
                    <div id="note-search-status" style="font-size:11px;color:#666;">Type a song title to search via iTunes.</div>
                    <div id="note-search-results" class="note-search-results" style="display:none;"></div>
                    <div id="note-selected-preview" style="display:none;font-size:12px;background:#fef9c3;border:1px solid #eab308;padding:8px 10px;border-radius:6px;"></div>
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
            searchDebounce = setTimeout(() => searchItunesSongs(q), 400);
        });
    }

    async function searchItunesSongs(query) {
        const statusEl = document.getElementById('note-search-status');
        const listEl = document.getElementById('note-search-results');
        try {
            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`);
            if (res.status === 429) {
                statusEl.innerText = 'Search rate limit reached briefly—wait a few seconds and try again.';
                return;
            }
            const data = await res.json();
            const tracks = (data.results || []).filter(t => t.trackId && t.trackName);
            if (!tracks.length) {
                statusEl.innerText = 'No matching songs found.';
                listEl.style.display = 'none';
                return;
            }
            statusEl.innerText = 'Tap a song to select it:';
            listEl.style.display = 'block';
            listEl.innerHTML = '';
            tracks.forEach(t => {
                const artwork = (t.artworkUrl100 || '').replace('100x100', '200x200');
                const row = document.createElement('div');
                row.className = 'note-track-row';
                row.innerHTML = `
                    <img src="${esc(artwork)}" alt="">
                    <div style="min-width:0;flex:1;">
                        <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.trackName)}</div>
                        <div style="font-size:11px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(t.artistName || '')}</div>
                    </div>
                `;
                row.onclick = () => {
                    selectedTrack = {
                        trackId: String(t.trackId),
                        trackName: t.trackName,
                        artistName: t.artistName || 'Unknown Artist',
                        artworkUrl: artwork,
                        previewUrl: t.previewUrl || '',
                        trackViewUrl: t.trackViewUrl || ''
                    };
                    listEl.querySelectorAll('.note-track-row').forEach(r => r.classList.remove('selected'));
                    row.classList.add('selected');
                    const prev = document.getElementById('note-selected-preview');
                    prev.style.display = 'block';
                    prev.innerHTML = `Selected: <strong>${esc(selectedTrack.trackName)}</strong> — ${esc(selectedTrack.artistName)}`;
                };
                listEl.appendChild(row);
            });
        } catch (err) {
            statusEl.innerText = 'Could not reach iTunes search right now.';
        }
    }

    window.openNotePicker = function (onCreated) {
        ensureUiInjected();
        selectedTrack = null;
        createCallback = typeof onCreated === 'function' ? onCreated : null;
        document.getElementById('note-text-input').value = '';
        document.getElementById('note-song-search').value = '';
        document.getElementById('note-search-results').style.display = 'none';
        document.getElementById('note-search-results').innerHTML = '';
        document.getElementById('note-selected-preview').style.display = 'none';
        document.getElementById('note-search-status').innerText = 'Type a song title to search via iTunes.';
        document.getElementById('note-picker-modal').classList.add('open');
    };

    window.closeNotePicker = function () {
        const el = document.getElementById('note-picker-modal');
        if (el) el.classList.remove('open');
    };

    window.submitMusicNote = async function () {
        if (!selectedTrack) {
            if (typeof showToast === 'function') showToast('Please pick a song first.');
            return;
        }
        const btn = document.getElementById('note-publish-btn');
        btn.disabled = true;
        try {
            const noteText = document.getElementById('note-text-input').value.trim();
            const res = await fetch(`${WORKER_ORIGIN}/api/notes/create`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    noteText,
                    ...selectedTrack
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to share note');
            closeNotePicker();
            if (typeof showToast === 'function') showToast('Music note shared for 24 hours!');
            if (createCallback) createCallback(data.note);
            if (typeof onNoteStateChange === 'function') onNoteStateChange();
        } catch (err) {
            if (typeof showToast === 'function') showToast(err.message);
        } finally {
            btn.disabled = false;
        }
    };

    window.openNoteViewer = function (note, ownerLabel, isOwner, onDeleted) {
        ensureUiInjected();
        stopNoteAudio();
        const titleEl = document.getElementById('note-viewer-title');
        const bodyEl = document.getElementById('note-viewer-body');
        titleEl.innerText = ownerLabel ? `${ownerLabel} Music Note` : 'Music Note';

        const safePreview = (note.preview_url || '').replace(/'/g, "\\'");
        bodyEl.innerHTML = `
            ${note.note_text ? `<div style="font-size:14px;font-weight:600;padding:4px 2px;">"${esc(note.note_text)}"</div>` : ''}
            <div class="note-viewer-card">
                <img src="${esc(note.artwork_url)}" alt="">
                <div style="min-width:0;flex:1;">
                    <div style="font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(note.track_name)}</div>
                    <div style="font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(note.artist_name)}</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                ${note.preview_url ? `<button type="button" onclick="toggleNoteAudio('${safePreview}', this)" style="padding:7px 14px;border:none;background:#000;color:#fff;border-radius:6px;font-weight:600;cursor:pointer;">▶ Play Preview</button>` : ''}
                ${note.track_view_url ? `<a href="${esc(note.track_view_url)}" target="_blank" rel="noopener" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none;">Open on Apple Music ↗</a>` : ''}
                ${isOwner ? `<button type="button" id="change-note-btn" style="margin-left:auto;padding:7px 12px;border:1px solid #eab308;background:#fef9c3;color:#111;border-radius:6px;font-weight:600;cursor:pointer;">Change</button>` : ''}
                ${isOwner ? `<button type="button" id="delete-note-btn" style="padding:7px 12px;border:1px solid #ef4444;background:#fff;color:#ef4444;border-radius:6px;font-weight:600;cursor:pointer;">Delete</button>` : ''}
            </div>
        `;

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
