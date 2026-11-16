const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// Verified Badge SVG HTML helper
const VERIFIED_BADGE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-left:3px;color:#3b82f6;" title="Verified Account"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

// Accepts 1, true, "1" etc.
function renderVerifiedBadge(isVerified) {
    return (isVerified === true || Number(isVerified) === 1) ? VERIFIED_BADGE_SVG : '';
}

// ===== THEME, TOAST & CUSTOM DIALOGS =====
const THEME_CSS = `
:where(.btn-app-secondary) { background:#fff; color:#111; border:1px solid #ccc; padding:6px 12px; border-radius:4px; font-weight:600; font-size:12px; }
.btn-app-secondary { cursor:pointer; text-align:center; user-select:none; }
.btn-app { user-select:none; }

html.dark { color-scheme: dark; }
html.dark body { background:#121212; color:#eee; }
html.dark header, html.dark footer { background:#121212; border-color:#2a2a2a; }
html.dark .brand { color:#fff; }
html.dark .footer-tab { color:#999; }
html.dark .footer-tab.active { color:#fff; }
html.dark .footer-tab.active .footer-icon { stroke:#fff; }
html.dark .panel, html.dark .post-box, html.dark .user-result-box { border-color:#2a2a2a; }
html.dark .profile-name, html.dark .section-title { border-color:#2a2a2a; color:#eee; }
html.dark .panel-header { background:#1c1c1c; border-color:#2a2a2a; }
html.dark .post-box.highlighted { background:#1c1c1c; border-color:#333; }
html.dark .profile-left img, html.dark .avatar, html.dark .post-avatar, html.dark .post-media { border-color:#333; background:#1c1c1c; }
html.dark .post-meta { color:#eee; }
html.dark .btn-app { background:#fff; color:#000; border-color:#fff; }
html.dark .btn-app-secondary { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark :is(button, div)[style*="background: #000"] { background:#fff !important; color:#000 !important; }
html.dark .comment-post-btn { background:#fff; color:#000; }
html.dark span[style*="color: #000"], html.dark a[style*="color:#000"] { color:#fff !important; }
html.dark .reaction-btn { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark .reaction-btn.active-like { background:#fff; color:#000; border-color:#fff; }
html.dark .reaction-btn.active-like .reaction-icon { fill:#000; stroke:#000; }
html.dark .reaction-btn.active-dislike { background:#ef4444; color:#fff; border-color:#ef4444; }
html.dark .comments-drawer, html.dark .chat-drawer, html.dark .modal-window, html.dark .ugc-dialog-box { background:#181818; border-color:#333; color:#eee; }
html.dark .drawer-header, html.dark .modal-header, html.dark .ugc-dialog-head { background:#222; border-color:#2a2a2a; color:#eee; }
html.dark .comments-container, html.dark .chat-container { background:#1c1c1c; border-color:#2a2a2a; }
html.dark .comment-item { border-color:#2a2a2a; }
html.dark .comment-item.reply { border-left-color:#333; }
html.dark .comment-avatar { border-color:#333; }
html.dark .comment-reaction-btn { color:#aaa; }
html.dark .comment-reaction-btn.active-like { color:#fff; }
html.dark .comment-reaction-btn.active-like svg { stroke:#fff; fill:#fff; }
html.dark .chat-bubble.received { background:#2a2a2a; color:#eee; }
html.dark .chat-bubble.sent { background:#fff; color:#000; }
html.dark .inbox-item, html.dark .activity-item { border-color:#2a2a2a; }
html.dark .inbox-item:hover, html.dark .activity-item:hover { background:#1c1c1c; }
html.dark input, html.dark textarea, html.dark select { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark .custom-file-upload { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark [style*="background: #f0f0f0"] { background:#2a2a2a !important; color:#eee !important; }
html.dark .report-option { background:#222; border-color:#333; color:#eee; }

#offline-banner { position: fixed; bottom: 50px; left: 0; width: 100%; background: #ef4444; color: #fff; text-align: center; font-size: 11px; font-weight: 700; padding: 5px; z-index: 9999; display: none; }
#toast-box { position: fixed; bottom: 65px; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: 10px 18px; border-radius: 20px; font-size: 12px; font-weight: 600; z-index: 10000; opacity: 0; transition: opacity 0.25s ease; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.25); text-align: center; max-width: 90%; }
#toast-box.show { opacity: 1; }

.ugc-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.55); display: none; align-items: center; justify-content: center; z-index: 9500; padding: 16px; }
.ugc-dialog-box { width: 100%; max-width: 400px; background: #fff; border: 1px solid #ccc; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.ugc-dialog-head { background: #f5f5f5; padding: 12px 14px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
.ugc-dialog-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; font-size: 13px; max-height: 75vh; overflow-y: auto; }
.report-option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 600; background: #fafafa; }
.report-option input { width: auto; }
.ugc-btn { display: inline-block; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: 600; text-align: center; cursor: pointer; user-select: none; }
.ugc-btn-danger { background: #ef4444; color: #fff; border: 1px solid #ef4444; }
.ugc-btn-cancel { background: #fff; color: #111; border: 1px solid #ccc; }
html.dark .ugc-btn-cancel { background: #2a2a2a; color: #eee; border-color: #444; }
`;

function applyTheme(theme) {
    const t = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem('Nvaritia_theme', t); } catch (e) {}
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerText = t === 'dark' ? 'Switch to Light Mode' : ' Switch to Dark Mode';
}

async function saveTheme(theme) {
    applyTheme(theme);
    const res = await fetch(`${WORKER_ORIGIN}/api/profile/theme`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ theme })
    });
    if (!res.ok) throw new Error('Failed to save theme');
}

function showToast(message) {
    let toast = document.getElementById('toast-box');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-box';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.classList.remove('show'); }, 3200);
}

function showConfirmDialog(title, message, confirmLabel, onConfirm) {
    let overlay = document.getElementById('ugc-confirm-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ugc-confirm-overlay';
        overlay.className = 'ugc-overlay';
        overlay.innerHTML = `
            <div class="ugc-dialog-box">
                <div class="ugc-dialog-head">
                    <span id="ugc-confirm-title">Confirm</span>
                    <span style="cursor:pointer;" onclick="document.getElementById('ugc-confirm-overlay').style.display='none'">✕</span>
                </div>
                <div class="ugc-dialog-body">
                    <p id="ugc-confirm-msg" style="line-height:1.4;"></p>
                    <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-end;">
                        <div id="ugc-confirm-cancel" class="ugc-btn ugc-btn-cancel">Cancel</div>
                        <div id="ugc-confirm-yes" class="ugc-btn ugc-btn-danger">Confirm</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('ugc-confirm-cancel').addEventListener('click', () => { overlay.style.display = 'none'; });
    }
    document.getElementById('ugc-confirm-title').innerText = title;
    document.getElementById('ugc-confirm-msg').innerText = message;
    const yesBtn = document.getElementById('ugc-confirm-yes');
    yesBtn.innerText = confirmLabel || 'Confirm';
    yesBtn.onclick = () => {
        overlay.style.display = 'none';
        if (typeof onConfirm === 'function') onConfirm();
    };
    overlay.style.display = 'flex';
}

(function initApp() {
    const style = document.createElement('style');
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    let saved = 'light';
    try { saved = localStorage.getItem('Nvaritia_theme') || 'light'; } catch (e) {}
    applyTheme(saved);

    window.addEventListener('DOMContentLoaded', () => {
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.innerText = 'You are offline — showing cached interface.';
        document.body.appendChild(banner);

        function updateOnlineStatus() {
            banner.style.display = navigator.onLine ? 'none' : 'block';
        }
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    });
})();

// ===== SESSION & TOKEN MANAGEMENT =====
function getSessionToken() {
    return localStorage.getItem('Nvaritia_token') || '';
}

function setSessionToken(token) {
    if (token) localStorage.setItem('Nvaritia_token', token);
    else localStorage.removeItem('Nvaritia_token');
}

function authHeaders(additionalHeaders = {}) {
    const token = getSessionToken();
    const headers = { ...additionalHeaders };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function getSessionUser() {
    const stored = localStorage.getItem('Nvaritia_session');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch (e) {
        localStorage.removeItem('Nvaritia_session');
        localStorage.removeItem('Nvaritia_token');
        return null;
    }
}

function setSessionUser(user, token) {
    if (user && user.theme) applyTheme(user.theme);
    localStorage.setItem('Nvaritia_session', JSON.stringify(user));
    if (token) setSessionToken(token);
}

// Re-fetch the logged-in user from the server so cached fields (like `verified`) never go stale.
async function refreshSession() {
    const u = getSessionUser();
    if (!u) return null;
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/profile/${encodeURIComponent(u.email)}`);
        if (!res.ok) return u;
        const data = await res.json();
        if (data.user) {
            setSessionUser({ ...u, ...data.user });
            return getSessionUser();
        }
    } catch (e) {}
    return u;
}

function requireAuth(allowGuest = false) {
    const user = getSessionUser();
    const path = window.location.pathname;
    const onIndex = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    if (!user) {
        if (allowGuest) return { email: '', username: '', guest: true };
        if (!onIndex) {
            try { sessionStorage.setItem('Nvaritia_notice', 'Please sign up or log in to continue.'); } catch (e) {}
            window.location.href = 'index.html';
        }
        return null;
    }
    if (user.theme) applyTheme(user.theme);
    return user;
}

function promptSignup(action) {
    try { sessionStorage.setItem('Nvaritia_notice', `Sign up for a free account to ${action}.`); } catch (e) {}
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('Nvaritia_session');
    localStorage.removeItem('Nvaritia_token');
    localStorage.removeItem('Nvaritia_theme');
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (match) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[match];
    });
}

// ===== UGC REPORT MODAL & SAFETY HELPERS =====
function reportPost(postId) {
    const user = getSessionUser();
    if (!user) { promptSignup('report posts'); return; }

    let overlay = document.getElementById('ugc-report-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ugc-report-overlay';
        overlay.className = 'ugc-overlay';
        overlay.innerHTML = `
            <div class="ugc-dialog-box">
                <div class="ugc-dialog-head">
                    <span>Report Post</span>
                    <span style="cursor:pointer;" onclick="document.getElementById('ugc-report-overlay').style.display='none'">✕</span>
                </div>
                <form id="ugc-report-form" class="ugc-dialog-body">
                    <p style="font-size:12px; color:#666;">Select a violation category:</p>
                    <label class="report-option"><input type="radio" name="report_reason" value="Spam or Misleading" required> Spam or Misleading</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Sexual or Explicit Content"> Sexual or Explicit Content</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Harassment or Bullying"> Harassment or Bullying</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Hate Speech or Violence"> Hate Speech or Violence</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Copyright Violation"> Copyright Violation</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Something else" id="radio-something-else"> Something else</label>
                    
                    <div id="custom-reason-container" style="display:none; flex-direction:column; gap:4px; margin-top:4px;">
                        <label style="font-size:11px; font-weight:600; color:#555;">Please specify:</label>
                        <input type="text" id="ugc-custom-reason-input" placeholder="Type custom reason here..." style="padding:8px; border:1px solid #ccc; border-radius:6px; font-size:12px;">
                    </div>

                    <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-end;">
                        <div id="ugc-report-cancel" class="ugc-btn ugc-btn-cancel">Cancel</div>
                        <div id="ugc-report-submit" class="ugc-btn ugc-btn-danger">Submit Report</div>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('ugc-report-cancel').addEventListener('click', () => { overlay.style.display = 'none'; });
    }

    const form = document.getElementById('ugc-report-form');
    form.reset();
    document.getElementById('custom-reason-container').style.display = 'none';

    form.querySelectorAll('input[name="report_reason"]').forEach(radio => {
        radio.onchange = (e) => {
            const isSomethingElse = e.target.value === 'Something else';
            document.getElementById('custom-reason-container').style.display = isSomethingElse ? 'flex' : 'none';
            if (isSomethingElse) document.getElementById('ugc-custom-reason-input').focus();
        };
    });

    const submitBtn = document.getElementById('ugc-report-submit');
    function setSubmitBusy(busy) {
        submitBtn.style.pointerEvents = busy ? 'none' : 'auto';
        submitBtn.style.opacity = busy ? '0.6' : '1';
        submitBtn.innerText = busy ? 'Submitting...' : 'Submit Report';
    }
    setSubmitBusy(false);

    form.onsubmit = async (e) => {
        e.preventDefault();
        const selected = form.querySelector('input[name="report_reason"]:checked');
        if (!selected) {
            showToast("Please select a violation type.");
            return;
        }

        let finalReason = selected.value;
        if (selected.value === 'Something else') {
            const customText = document.getElementById('ugc-custom-reason-input').value.trim();
            if (!customText) {
                showToast("Please specify your reason.");
                document.getElementById('ugc-custom-reason-input').focus();
                return;
            }
            finalReason = `Something else: ${customText}`;
        }

        setSubmitBusy(true);

        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/reports/create`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ postId, reason: finalReason })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit report');
            overlay.style.display = 'none';
            showToast("Report received. Our moderation team will review this post within 24 hours.");
        } catch (err) {
            showToast(err.message);
            setSubmitBusy(false);
        }
    };

    submitBtn.onclick = () => form.onsubmit({ preventDefault() {} });
    document.getElementById('ugc-custom-reason-input').onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); form.onsubmit({ preventDefault() {} }); }
    };

    overlay.style.display = 'flex';
}

function blockUser(targetEmail, targetUsername, onSuccess) {
    const user = getSessionUser();
    if (!user) { promptSignup('block users'); return; }

    showConfirmDialog(
        "Block User",
        `Block @${targetUsername || targetEmail}? You will no longer see their posts, comments, or messages.`,
        "Block User",
        async () => {
            try {
                const res = await fetch(`${WORKER_ORIGIN}/api/users/block`, {
                    method: 'POST',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ blockedEmail: targetEmail })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to block user');
                showToast(`Blocked @${targetUsername || targetEmail}`);
                if (typeof onSuccess === 'function') onSuccess();
            } catch (err) {
                showToast(err.message);
            }
        }
    );
}

// ===== IMAGE COMPRESSION (client-side, before upload) =====
async function compressImage(file, maxDim = 2048, quality = 0.88) {
    if (!file || !file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
    try {
        const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
        const s = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
        const w = Math.round(bmp.width * s), h = Math.round(bmp.height * s);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(bmp, 0, 0, w, h);
        const blob = await new Promise(r => c.toBlob(r, 'image/webp', quality));
        if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
        return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
    } catch (e) { return file; }
}

// ===== VIDEO COMPRESSION (client-side, before story upload) =====
async function compressVideo(file, maxDim = 720, targetBitrate = 1000000) {
    if (!file || !file.type.startsWith('video/')) return file;
    try {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = url;
        video.muted = true;
        video.playsInline = true;
        await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = (e) => reject(e);
        });

        const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
        const width = Math.round(video.videoWidth * scale);
        const height = Math.round(video.videoHeight * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const stream = canvas.captureStream(30);
        let mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = '';
            }
        }

        const recorderOptions = mimeType ? { mimeType, videoBitsPerSecond: targetBitrate } : { videoBitsPerSecond: targetBitrate };
        const mediaRecorder = new MediaRecorder(stream, recorderOptions);
        const chunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        const stopped = new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: mimeType || 'video/webm' }));
            mediaRecorder.onerror = (e) => reject(e);
        });

        mediaRecorder.start();
        await video.play();

        const draw = () => {
            if (video.paused || video.ended) {
                if (mediaRecorder.state === 'recording') mediaRecorder.stop();
                return;
            }
            ctx.drawImage(video, 0, 0, width, height);
            requestAnimationFrame(draw);
        };
        draw();

        video.onended = () => {
            if (mediaRecorder.state === 'recording') mediaRecorder.stop();
        };

        const compressedBlob = await stopped;
        video.pause();
        URL.revokeObjectURL(url);

        if (compressedBlob.size < file.size) {
            return new File([compressedBlob], file.name.replace(/\.\w+$/, '') + '.webm', { type: 'video/webm' });
        }
        return file;
    } catch (err) {
        console.error("Video compression fallback to original:", err);
        return file;
    }
}

// ===== SHARED STORY PLAYER =====
const STORY_CSS = `
.story-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.story-modal.open { opacity: 1; pointer-events: auto; }
.story-modal-content { position: relative; width: 100vw; height: 100vh; background: #000; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.story-modal.open .story-modal-content { transform: translateX(0); }
.story-video { width: 100%; height: 100%; object-fit: contain; }
.story-progress-container { position: absolute; top: 40px; left: 24px; right: 24px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; z-index: 20; overflow: hidden; }
.story-progress-fill { height: 100%; width: 0%; background: #fff; transition: width 0.1s linear; }
.story-close-top-left { position: absolute; top: 52px; left: 24px; color: #fff; font-size: 18px; font-weight: bold; cursor: pointer; z-index: 20; background: rgba(0,0,0,0.5); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; user-select: none; }
.story-age { position: absolute; top: 52px; left: 66px; height: 34px; padding: 0 12px; color: #fff; font-size: 12px; font-weight: 600; z-index: 20; background: rgba(0,0,0,0.5); border-radius: 17px; display: none; align-items: center; user-select: none; }
.story-delete-btn { position: absolute; top: 52px; right: 24px; height: 34px; padding: 0 14px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; z-index: 20; background: #ef4444; border-radius: 17px; display: none; align-items: center; user-select: none; }
#ugc-confirm-overlay { z-index: 10001; }
`;

let _storyReady = false;
let _storyOnDeleted = null;

// SQLite CURRENT_TIMESTAMP is UTC without a "Z", so normalise before parsing
function storyAgeLabel(createdAt) {
    if (!createdAt) return '';
    let s = String(createdAt).trim();
    if (!/[zZ]$|[+-]\d\d:?\d\d$/.test(s)) s = s.replace(' ', 'T') + 'Z';
    const t = Date.parse(s);
    if (isNaN(t)) return '';
    const h = Math.floor((Date.now() - t) / 3600000);
    return h < 1 ? '<1h' : h + 'h';
}

function ensureStoryPlayer() {
    if (_storyReady) return;
    const style = document.createElement('style');
    style.textContent = STORY_CSS;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'story-viewer-modal';
    modal.className = 'story-modal';
    modal.innerHTML = `
        <div class="story-modal-content">
            <div class="story-progress-container"><div id="story-progress-fill" class="story-progress-fill"></div></div>
            <div id="story-close-btn" class="story-close-top-left">✕</div>
            <div id="story-age" class="story-age"></div>
            <div id="story-delete-btn" class="story-delete-btn">Delete</div>
            <video id="story-player" class="story-video" autoplay playsinline></video>
        </div>
    `;
    document.body.appendChild(modal);

    const player = document.getElementById('story-player');
    const fill = document.getElementById('story-progress-fill');

    modal.addEventListener('click', (e) => { if (e.target === modal) closeStoryModal(); });
    document.getElementById('story-close-btn').addEventListener('click', closeStoryModal);
    document.getElementById('story-delete-btn').addEventListener('click', deleteOwnStory);
    player.addEventListener('timeupdate', () => {
        if (player.duration) fill.style.width = (player.currentTime / player.duration * 100) + '%';
    });
    player.addEventListener('ended', closeStoryModal);
    _storyReady = true;
}

// openStory({ mediaUrl, createdAt, ownerEmail, onDeleted })
function openStory({ mediaUrl, createdAt, ownerEmail, onDeleted }) {
    if (!mediaUrl) return;
    ensureStoryPlayer();
    _storyOnDeleted = typeof onDeleted === 'function' ? onDeleted : null;

    const me = getSessionUser();
    const isOwner = !!(me && me.email && ownerEmail && me.email.toLowerCase() === String(ownerEmail).toLowerCase());
    document.getElementById('story-delete-btn').style.display = isOwner ? 'flex' : 'none';

    const label = storyAgeLabel(createdAt);
    const ageEl = document.getElementById('story-age');
    ageEl.innerText = label;
    ageEl.style.display = label ? 'flex' : 'none';

    const player = document.getElementById('story-player');
    document.getElementById('story-progress-fill').style.width = '0%';
    player.src = mediaUrl;
    document.getElementById('story-viewer-modal').classList.add('open');
    player.play().catch(() => {});
}

function closeStoryModal() {
    if (!_storyReady) return;
    const player = document.getElementById('story-player');
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.getElementById('story-progress-fill').style.width = '0%';
    document.getElementById('story-viewer-modal').classList.remove('open');
}

function deleteOwnStory() {
    showConfirmDialog("Delete Story", "Delete your story? This can't be undone.", "Delete", async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/stories/delete`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete story');
            closeStoryModal();
            showToast("Story deleted");
            if (_storyOnDeleted) _storyOnDeleted();
        } catch (err) {
            showToast(err.message);
        }
    });
}

// Expose shared story function globally
window.openStory = openStory;
window.closeStoryModal = closeStoryModal;
