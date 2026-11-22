const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// Verified Badge SVG HTML helper
const VERIFIED_BADGE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-left:3px;color:#3b82f6;" title="Verified Account"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

// Accepts 1, true, "1" etc.
function renderVerifiedBadge(isVerified) {
    return (isVerified === true || Number(isVerified) === 1) ? VERIFIED_BADGE_SVG : '';
}

function goToProfile(url, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    window.location.href = url;
}

window.goToProfile = goToProfile;

// ===== THEME, TOAST & CUSTOM DIALOGS =====
const THEME_CSS = `
:where(.btn-app-secondary) { background:#fff; color:#111; border:1px solid #ccc; padding:6px 12px; border-radius:4px; font-weight:600; font-size:12px; }
.btn-app-secondary { cursor:pointer; text-align:center; user-select:none; }
.btn-app { user-select:none; }

.post-actions { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.reaction-group { display: flex; align-items: center; gap: 14px; }
.reaction-btn,
html.dark .reaction-btn,
html.dark .reaction-btn.active-like,
html.dark .reaction-btn.active-dislike {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 4px 6px !important;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: inherit;
    font-size: 13px;
}
.reaction-icon { width: 20px; height: 20px; flex-shrink: 0; }
.reaction-btn.active-like { color: #000 !important; font-weight: 700; }
html.dark .reaction-btn.active-like { color: #fff !important; font-weight: 700; }
.reaction-btn.active-like .reaction-icon { stroke: #000; fill: #000; }
html.dark .reaction-btn.active-like .reaction-icon { stroke: #fff; fill: #fff; }
.reaction-btn.active-dislike { color: #ef4444 !important; font-weight: 700; }
.reaction-btn.active-dislike .reaction-icon { stroke: #ef4444; fill: #ef4444; }

/* Comments Slide-In Page from Right */
.comments-drawer { position: fixed; top: 0; right: -100%; width: 100%; height: 100vh; height: 100dvh; max-height: 100%; background: #fff; z-index: 2100; transition: right 0.28s cubic-bezier(0.22, 1, 0.36, 1); display: flex; flex-direction: column; overflow: hidden; will-change: right; }
.comments-drawer.open { right: 0; }
.comments-drawer .drawer-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #e5e5e5; background: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.comments-back-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 4px; color: inherit; }
.comments-drawer .drawer-body { padding: 14px; padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px)); display: flex; flex-direction: column; flex-grow: 1; min-height: 0; max-width: 680px; width: 100%; margin: 0 auto; position: relative; }
.comments-container { flex-grow: 1; min-height: 0; overflow-y: auto; border: 1px solid #e5e5e5; padding: 14px; margin-bottom: 8px; border-radius: 8px; display: flex; flex-direction: column; gap: 14px; background: #fafafa; font-size: 15px; }

#comment-sticker-panel { display: none; flex-direction: column; gap: 8px; padding: 10px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; margin-bottom: 8px; flex-shrink: 0; }
#comment-sticker-panel.open { display: flex; }
.sticker-tabs-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
.sticker-tab-group { display: flex; gap: 6px; }
.sticker-tab-btn { background: #fff; color: #333; border: 1px solid #d4d4d8; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer; }
.sticker-tab-btn.active { background: #000; color: #fff; border-color: #000; }

.sticker-section-header { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 700; letter-spacing: 0.02em; color: #52525b; margin-top: 2px; }
.sticker-browse-link { background: none; border: none; color: inherit; font-size: 11px; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; }

.most-used-strip { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
.most-used-arrow-btn { flex: 0 0 auto; width: 38px; height: 38px; border-radius: 999px; border: 1px solid #18181b; background: #fff; color: #111; font-size: 16px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
.most-used-arrow-btn:active { transform: scale(0.94); }

.comment-sticker-grid { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 8px; max-height: 156px; overflow-y: auto; }
.comment-sticker-card { position: relative; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 6px 10px; font-size: 24px; line-height: 1.1; cursor: pointer; user-select: none; transition: transform 0.12s ease; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.comment-sticker-card.img-sticker { padding: 4px; width: 58px; height: 58px; }
.comment-sticker-card.img-sticker img { width: 100%; height: 100%; object-fit: contain; border-radius: 4px; pointer-events: none; }
.sticker-save-badge { position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc; background: #fff; color: #111; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1; padding: 0; }
.sticker-save-badge.saved { background: #000; color: #fff; border-color: #000; }
.comment-sticker-upload-btn { font-size: 12px; font-weight: 700; padding: 6px 11px; background: #000; color: #fff; border: 1px solid #000; border-radius: 6px; cursor: pointer; }
.comment-sticker-card:active { transform: scale(0.94); }

/* Friend-Only @Mention Dropdown */
.friend-mention-box { display: none; flex-direction: column; gap: 4px; max-height: 170px; overflow-y: auto; background: #fff; border: 1px solid #d4d4d8; border-radius: 8px; padding: 6px; margin-bottom: 6px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.friend-mention-box.open { display: flex; }
.friend-mention-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.friend-mention-item:hover, .friend-mention-item.active { background: #f4f4f5; }
.friend-mention-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd; background: #f0f0f0; flex-shrink: 0; }

/* Comment Composer Layout */
#comment-submit-form { display: flex; flex-direction: row; align-items: center; gap: 8px; flex-shrink: 0; }
.composer-top-row { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; }
.composer-user-pfp { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc; background: #f0f0f0; flex-shrink: 0; }
#comment-input { flex: 1 1 auto; min-width: 0; padding: 10px 14px; border: 1px solid #ccc; border-radius: 20px; font-size: 16px; background: #fff; color: #111; }
.composer-actions-row { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }
.composer-icon-btn { background: transparent; color: #111; border: none; padding: 7px; border-radius: 50%; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; user-select: none; flex-shrink: 0; }
.composer-icon-btn:hover { background: rgba(0,0,0,0.06); }
.composer-icon-btn.active { background: #111; color: #fff; }
.comment-post-btn { display: none; background: #000; color: #fff; padding: 9px 16px; border-radius: 18px; font-weight: 700; cursor: pointer; font-size: 13px; align-items: center; justify-content: center; user-select: none; flex-shrink: 0; border: none; }

/* Typing / Tagging Mode: buttons move to bottom-left, Send appears on far right */
#comment-submit-form.composer-typing { flex-direction: column; align-items: stretch; gap: 8px; }
#comment-submit-form.composer-typing .composer-bottom-bar { display: flex; align-items: center; justify-content: space-between; width: 100%; }
#comment-submit-form:not(.composer-typing) .composer-bottom-bar { display: contents; }
#comment-submit-form.composer-typing .comment-post-btn { display: inline-flex; }

.comment-item { display: flex; gap: 12px; align-items: flex-start; justify-content: flex-start; border-bottom: 1px solid #eee; padding-bottom: 14px; }
.comment-item:last-child { border-bottom: none; padding-bottom: 4px; }
.comment-item.reply { margin-left: 34px; border-left: 2px solid #ddd; padding-left: 12px; }
.comment-avatar-link { flex-shrink: 0; display: inline-block; line-height: 0; }
.comment-avatar { width: 46px; height: 46px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; cursor: pointer; background: #f0f0f0; }
.comment-item.reply .comment-avatar { width: 38px; height: 38px; }
.comment-main-col { display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; flex: 1 1 auto; min-width: 0; }
.comment-header-row { display: flex; align-items: center; justify-content: flex-start; width: 100%; gap: 4px; }
.comment-author-link { font-weight: 700; font-size: 15px; color: inherit; text-decoration: none; display: inline-flex; align-items: center; }
.comment-author-link:hover { text-decoration: underline; }
.comment-content { font-size: 15px; line-height: 1.5; margin-top: 4px; word-break: break-word; text-align: left; }
.comment-mention-link { font-weight: 700; color: inherit; text-decoration: underline; cursor: pointer; }
.comment-sticker-box { display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; margin-top: 6px; gap: 4px; align-self: flex-start; }
.comment-sticker-badge { display: inline-block; font-size: 40px; line-height: 1.15; margin-top: 6px; margin-left: 0; margin-right: auto; text-align: left; user-select: none; }
.comment-sticker-img { display: block; max-width: 132px; max-height: 132px; width: auto; height: auto; object-fit: contain; border-radius: 8px; margin-left: 0; margin-right: auto; user-select: none; }
.comment-media-img { display: block; max-width: 220px; max-height: 220px; width: auto; height: auto; object-fit: cover; border-radius: 10px; margin-top: 6px; border: 1px solid #e5e5e5; }
.comment-sticker-save-toggle { font-size: 11px; color: #666; cursor: pointer; font-weight: 600; user-select: none; }
.comment-sticker-save-toggle.saved { color: #111; font-weight: 700; }
.comment-sticker-save-toggle:hover { text-decoration: underline; }
.comment-actions { display: flex; gap: 16px; margin-top: 8px; font-size: 13px; align-items: center; justify-content: flex-start; font-weight: 600; flex-wrap: wrap; width: 100%; }
.comment-reaction-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; color: #555; font-size: 13px; font-weight: 600; user-select: none; }
.comment-reaction-btn.active-like { color: #000; font-weight: bold; }
.comment-reaction-btn.active-like svg { stroke: #000; fill: #000; }
.comment-reaction-btn.active-dislike { color: #ef4444; font-weight: bold; }
.comment-reaction-btn.active-dislike svg { stroke: #ef4444; fill: #ef4444; }
.comment-delete-btn { cursor: pointer; color: #ef4444; }

/* Share to Friends & Shared Post Bubble Styles */
.share-friends-list { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; max-height: 50vh; overflow-y: auto; }
.share-friend-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 10px; border: 1px solid #e5e5e5; border-radius: 8px; background: #fafafa; }
.share-friend-meta { display: flex; align-items: center; gap: 10px; min-width: 0; }
.share-friend-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd; background: #f0f0f0; flex-shrink: 0; }
.share-friend-name { font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.share-friend-send-btn { background: #000; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; flex-shrink: 0; }
.share-friend-send-btn:disabled { opacity: 0.55; cursor: default; }
.share-post-preview { padding: 8px 10px; border-radius: 8px; background: #f4f4f5; font-size: 12px; color: #333; border: 1px solid #e4e4e7; }
.shared-post-bubble { cursor: pointer; display: flex; flex-direction: column; gap: 6px; min-width: 200px; }
.shared-post-kicker { font-size: 11px; font-weight: 700; opacity: 0.8; }
.shared-post-snippet { font-size: 13px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.shared-post-thumb { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(128,128,128,0.25); }
.shared-post-cta { font-size: 12px; font-weight: 700; text-decoration: underline; }

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
html.dark .composer-icon-btn { color:#eee; }
html.dark .composer-icon-btn:hover { background:rgba(255,255,255,0.08); }
html.dark .composer-icon-btn.active { background:#fff; color:#000; }
html.dark .friend-mention-box { background:#181818; border-color:#2a2a2a; }
html.dark .friend-mention-item:hover, html.dark .friend-mention-item.active { background:#242424; }
html.dark #comment-sticker-panel { background:#181818; border-color:#2a2a2a; }
html.dark .sticker-tab-btn { background:#222; color:#ddd; border-color:#333; }
html.dark .sticker-tab-btn.active { background:#fff; color:#000; border-color:#fff; }
html.dark .sticker-section-header { color:#a1a1aa; }
html.dark .most-used-arrow-btn { background:#222; color:#fff; border-color:#52525b; }
html.dark .comment-sticker-card { background:#222; border-color:#333; }
html.dark .sticker-save-badge { background:#222; color:#eee; border-color:#555; }
html.dark .sticker-save-badge.saved { background:#fff; color:#000; border-color:#fff; }
html.dark .comment-sticker-save-toggle { color:#a1a1aa; }
html.dark .comment-sticker-save-toggle.saved { color:#fff; }
html.dark .comment-sticker-upload-btn { background:#fff !important; color:#000 !important; border-color:#fff !important; }
html.dark span[style*="color: #000"], html.dark a[style*="color:#000"] { color:#fff !important; }
html.dark .comments-drawer, html.dark .chat-drawer, html.dark .modal-window, html.dark .ugc-dialog-box, html.dark .search-drawer { background:#121212; border-color:#2a2a2a; color:#eee; }
html.dark .comments-drawer .drawer-header, html.dark .search-drawer-header, html.dark .drawer-header, html.dark .modal-header, html.dark .ugc-dialog-head { background:#181818; border-color:#2a2a2a; color:#eee; }
html.dark .search-filters { background:#181818; border-color:#2a2a2a; }
html.dark .filter-tab.active { background:#121212; color:#fff; border-bottom-color:#fff; }
html.dark .comments-container, html.dark .chat-container { background:#1c1c1c; border-color:#2a2a2a; }
html.dark .comment-item { border-color:#2a2a2a; }
html.dark .comment-item.reply { border-left-color:#333; }
html.dark .comment-avatar { border-color:#333; background:#1c1c1c; }
html.dark .comment-reaction-btn { color:#aaa; }
html.dark .comment-reaction-btn.active-like { color:#fff; }
html.dark .comment-reaction-btn.active-like svg { stroke:#fff; fill:#fff; }
html.dark .comment-reaction-btn.active-dislike { color:#ef4444; }
html.dark .comment-reaction-btn.active-dislike svg { stroke:#ef4444; fill:#ef4444; }
html.dark .chat-bubble.received { background:#2a2a2a; color:#eee; }
html.dark .chat-bubble.sent { background:#fff; color:#000; }
html.dark .inbox-item, html.dark .activity-item { border-color:#2a2a2a; }
html.dark .inbox-item:hover, html.dark .activity-item:hover { background:#1c1c1c; }
html.dark input, html.dark textarea, html.dark select { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark .custom-file-upload { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark [style*="background: #f0f0f0"] { background:#2a2a2a !important; color:#eee !important; }
html.dark .report-option { background:#222; border-color:#333; color:#eee; }
html.dark .share-friend-row { background:#1c1c1c; border-color:#2a2a2a; }
html.dark .share-post-preview { background:#1c1c1c; border-color:#2a2a2a; color:#ddd; }
html.dark .share-friend-send-btn { background:#fff; color:#000; }

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

// ===== SHARED POST HELPERS =====
const SHARED_POST_PREFIX = "__NVARITIA_POST__:";
const _sharedPostCache = new Map();
let _shareTargetPost = null;
let _friendsCache = null;

async function ensureFriendsLoaded(force = false) {
    const user = getSessionUser();
    if (!user || !user.email) {
        _friendsCache = [];
        return _friendsCache;
    }
    if (!force && Array.isArray(_friendsCache)) return _friendsCache;
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/friends/list`, { headers: authHeaders() });
        if (!res.ok) return Array.isArray(_friendsCache) ? _friendsCache : [];
        const data = await res.json();
        _friendsCache = Array.isArray(data.friends) ? data.friends : [];
    } catch (e) {
        if (!Array.isArray(_friendsCache)) _friendsCache = [];
    }
    return _friendsCache;
}

function parseSharedPostContent(content) {
    if (!content || typeof content !== "string") return null;

    if (content.startsWith(SHARED_POST_PREFIX)) {
        try {
            const parsed = JSON.parse(content.slice(SHARED_POST_PREFIX.length));
            if (parsed && parsed.postId) return parsed;
        } catch (e) {}
    }

    const match = content.match(/[?&]post=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return { postId: match[1], authorUsername: "", content: "", mediaUrl: "" };
    }

    return null;
}

function formatInboxPreviewText(rawContent) {
    const shared = parseSharedPostContent(rawContent);
    if (!shared) return rawContent || "";
    return shared.authorUsername
        ? `Shared @${shared.authorUsername}'s post`
        : "Shared a post";
}

function renderSharedPostBubbleHtml(shared, isSent) {
    const postId = encodeURIComponent(shared.postId);
    const targetUrl = `feed.html?post=${postId}`;
    const authorLabel = shared.authorUsername ? `@${escapeHtml(shared.authorUsername)}` : "Post on Nvaritia";
    const snippet = shared.content ? `<div class="shared-post-snippet">${escapeHtml(shared.content)}</div>` : "";
    const mediaThumb = shared.mediaUrl
        ? `<img class="shared-post-thumb" src="${escapeHtml(shared.mediaUrl)}" alt="Shared post media">`
        : "";

    return `
        <div class="chat-bubble shared-post-bubble ${isSent ? 'sent' : 'received'}" onclick="window.location.href='${targetUrl}'">
            <div class="shared-post-kicker">Shared Post • ${authorLabel}</div>
            ${snippet}
            ${mediaThumb}
            <div class="shared-post-cta">View in Feed →</div>
        </div>
    `;
}

function copyPostLinkFallback(shareUrl) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(shareUrl).then(() => showToast("Link copied")).catch(() => {
            execCopyFallback(shareUrl);
        });
        return;
    }
    execCopyFallback(shareUrl);
}

function execCopyFallback(text) {
    const temp = document.createElement('input');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast("Link copied");
}

function ensureShareFriendsModal() {
    let overlay = document.getElementById('share-friends-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'share-friends-overlay';
    overlay.className = 'ugc-overlay';
    overlay.innerHTML = `
        <div class="ugc-dialog-box">
            <div class="ugc-dialog-head">
                <span>Share to Friends</span>
                <span style="cursor:pointer;" id="share-friends-close">✕</span>
            </div>
            <div class="ugc-dialog-body">
                <div id="share-post-summary" class="share-post-preview"></div>
                <input type="text" id="share-friend-search" placeholder="Search friends..." style="padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:13px;">
                <div id="share-friends-list" class="share-friends-list">
                    <div style="text-align:center; padding:14px; color:#666;">Loading friends...</div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:6px;">
                    <button type="button" id="share-copy-link-btn" class="ugc-btn ugc-btn-cancel">Copy Link</button>
                    <button type="button" id="share-done-btn" class="ugc-btn ugc-btn-cancel">Done</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeModal = () => { overlay.style.display = 'none'; };
    document.getElementById('share-friends-close').addEventListener('click', closeModal);
    document.getElementById('share-done-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    document.getElementById('share-friend-search').addEventListener('input', (e) => {
        renderFriendsInShareModal(e.target.value.trim().toLowerCase());
    });

    document.getElementById('share-copy-link-btn').addEventListener('click', () => {
        if (!_shareTargetPost) return;
        copyPostLinkFallback(`${window.location.origin}/feed.html?post=${encodeURIComponent(_shareTargetPost.id)}`);
    });

    return overlay;
}

function renderFriendsInShareModal(filterText = "") {
    const listEl = document.getElementById('share-friends-list');
    if (!listEl) return;

    const friends = Array.isArray(_friendsCache) ? _friendsCache : [];
    const filtered = filterText
        ? friends.filter(f => (f.username || "").toLowerCase().includes(filterText) || (f.email || "").toLowerCase().includes(filterText))
        : friends;

    if (!filtered.length) {
        listEl.innerHTML = `<p style="color:#666; text-align:center; padding:12px;">${friends.length ? "No matching friends." : "No friends yet. Add friends from their profile to share posts."}</p>`;
        return;
    }

    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";
    listEl.innerHTML = '';

    for (const friend of filtered) {
        const row = document.createElement('div');
        row.className = 'share-friend-row';
        row.innerHTML = `
            <div class="share-friend-meta">
                <img class="share-friend-avatar" src="${friend.pfp_url || defaultAvatar}" alt="">
                <span class="share-friend-name">@${escapeHtml(friend.username)}${renderVerifiedBadge(friend.verified)}</span>
            </div>
            <button type="button" class="share-friend-send-btn">Send</button>
        `;
        const btn = row.querySelector('.share-friend-send-btn');
        btn.addEventListener('click', async () => {
            if (!_shareTargetPost) return;
            btn.disabled = true;
            btn.innerText = "Sending...";
            try {
                const res = await fetch(`${WORKER_ORIGIN}/api/posts/share`, {
                    method: 'POST',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({
                        postId: _shareTargetPost.id,
                        recipientEmail: friend.email,
                        authorUsername: _shareTargetPost.username || "",
                        snippet: _shareTargetPost.content || "",
                        mediaUrl: _shareTargetPost.media_url || ""
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Could not share post");
                btn.innerText = "Sent ✓";
                showToast(`Shared with @${friend.username}`);
            } catch (err) {
                btn.disabled = false;
                btn.innerText = "Send";
                showToast(err.message);
            }
        });
        listEl.appendChild(row);
    }
}

async function sharePost(postId) {
    const user = getSessionUser();
    if (!user) return promptSignup('share posts with friends');

    const postMeta = _sharedPostCache.get(postId) || { id: postId, username: "", content: "", media_url: "" };
    _shareTargetPost = postMeta;

    const modal = ensureShareFriendsModal();
    const summaryEl = document.getElementById('share-post-summary');
    const searchEl = document.getElementById('share-friend-search');
    const listEl = document.getElementById('share-friends-list');

    summaryEl.innerHTML = postMeta.username
        ? `<strong>@${escapeHtml(postMeta.username)}</strong>${postMeta.content ? `: ${escapeHtml(postMeta.content)}` : " (Media post)"}`
        : `Post ID: ${escapeHtml(postId)}`;
    searchEl.value = "";
    listEl.innerHTML = `<div style="text-align:center; padding:14px; color:#666;">Loading friends...</div>`;
    modal.style.display = 'flex';

    try {
        const friends = await ensureFriendsLoaded(true);
        renderFriendsInShareModal("");
        if (!Array.isArray(friends)) throw new Error("Failed to load friends");
    } catch (err) {
        listEl.innerHTML = `<p style="color:#ef4444; text-align:center; padding:12px;">${escapeHtml(err.message)}</p>`;
    }
}

window.parseSharedPostContent = parseSharedPostContent;
window.formatInboxPreviewText = formatInboxPreviewText;
window.renderSharedPostBubbleHtml = renderSharedPostBubbleHtml;

// ===== POSTS RENDERING & ACTIONS (CONTROLLED BY APP.JS) =====
const POST_LIKE_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
const POST_DISLIKE_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>`;
const POST_COMMENT_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
const POST_SHARE_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;

function updatePostCommentCount(postId, count) {
    const safeCount = Math.max(0, Number(count) || 0);
    document.querySelectorAll(`.post-box[data-post-id="${postId}"] .comments-count`).forEach(el => {
        el.innerText = safeCount;
    });
}

function incrementPostCommentCount(postId, delta = 1) {
    const first = document.querySelector(`.post-box[data-post-id="${postId}"] .comments-count`);
    const current = first ? (parseInt(first.innerText, 10) || 0) : 0;
    updatePostCommentCount(postId, current + delta);
}

function blockAuthorFromFeed(authorEmail, authorUsername) {
    blockUser(authorEmail, authorUsername, () => {
        document.querySelectorAll(`[data-author="${authorEmail.toLowerCase()}"]`).forEach(el => el.remove());
    });
}

async function toggleReaction(postId, reactionType, buttonEl = null) {
    const user = getSessionUser();
    if (!user) return promptSignup('like or dislike posts');
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/reactions/toggle`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ postId, reaction: reactionType })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update reaction');

        const boxes = document.querySelectorAll(`.post-box[data-post-id="${postId}"]`);
        if (boxes.length) {
            boxes.forEach(box => {
                const lSpan = box.querySelector('.likes-count');
                const dSpan = box.querySelector('.dislikes-count');
                if (lSpan) lSpan.innerText = data.likes;
                if (dSpan) dSpan.innerText = data.dislikes;

                const buttons = box.querySelectorAll('.reaction-btn');
                if (buttons[0]) buttons[0].className = `reaction-btn ${data.userReaction === 'like' ? 'active-like' : ''}`;
                if (buttons[1]) buttons[1].className = `reaction-btn ${data.userReaction === 'dislike' ? 'active-dislike' : ''}`;
            });
        } else if (buttonEl) {
            const card = buttonEl.closest('.post-box');
            if (card) {
                const lSpan = card.querySelector('.likes-count');
                const dSpan = card.querySelector('.dislikes-count');
                if (lSpan) lSpan.innerText = data.likes;
                if (dSpan) dSpan.innerText = data.dislikes;

                const buttons = card.querySelectorAll('.reaction-btn');
                if (buttons[0]) buttons[0].className = `reaction-btn ${data.userReaction === 'like' ? 'active-like' : ''}`;
                if (buttons[1]) buttons[1].className = `reaction-btn ${data.userReaction === 'dislike' ? 'active-dislike' : ''}`;
            }
        }
    } catch (err) {
        showToast(err.message);
    }
}

async function deletePost(postId) {
    showConfirmDialog("Delete Post", "Are you sure you want to delete this post?", "Delete", async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/posts/delete`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ postId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete');
            document.querySelectorAll(`.post-box[data-post-id="${postId}"]`).forEach(el => el.remove());
            showToast("Post deleted");
        } catch (err) {
            showToast(err.message);
        }
    });
}

async function renderPosts(posts, container, options = {}) {
    if (!container) return;
    const {
        clear = true,
        highlightPostId = null,
        observer = null,
        fallbackAuthor = null
    } = options;

    if (clear) container.innerHTML = '';
    if (!posts || (!posts.length && clear)) {
        container.innerHTML = '<p style="color: #666; padding: 12px; text-align: center;">No posts recorded.</p>';
        return;
    }

    const viewer = getSessionUser();
    const viewerEmail = viewer && viewer.email ? viewer.email : '';
    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

    for (const post of posts) {
        const authorEmail = post.user_email || (fallbackAuthor && fallbackAuthor.email) || '';
        const authorUsername = post.username || (fallbackAuthor && fallbackAuthor.username) || '';
        const authorPfp = post.pfp_url || (fallbackAuthor && fallbackAuthor.pfp_url) || defaultAvatar;
        const authorVerified = post.verified !== undefined ? post.verified : (fallbackAuthor && fallbackAuthor.verified);
        const initialCommentsCount = post.comments_count ?? post.comment_count ?? post.commentsCount ?? 0;

        _sharedPostCache.set(post.id, {
            id: post.id,
            user_email: authorEmail,
            username: authorUsername,
            content: post.content || "",
            media_url: post.media_url || ""
        });

        const isOwner = !!(viewer && viewer.email && authorEmail && viewer.email.toLowerCase() === authorEmail.toLowerCase());
        let rxData = { likes: post.likes_count || 0, dislikes: post.dislikes_count || 0, userReaction: null };
        try {
            const rxRes = await fetch(`${WORKER_ORIGIN}/api/reactions/get?postId=${encodeURIComponent(post.id)}&email=${encodeURIComponent(viewerEmail)}`);
            if (rxRes.ok) rxData = await rxRes.json();
        } catch (e) {}

        const isHighlighted = highlightPostId === post.id;
        const postEl = document.createElement('div');
        postEl.className = `post-box ${isHighlighted ? 'highlighted' : ''}`;
        postEl.setAttribute('data-post-id', post.id);
        postEl.setAttribute('data-author', authorEmail.toLowerCase());

        const formattedContent = post.content
            ? `<div class="post-text">${escapeHtml(post.content).replace(
                /@([a-zA-Z0-9_]+)/g,
                '<a href="profile.html?user=$1" onclick="goToProfile(\'profile.html?user=$1\', event)" style="font-weight:600; color:#000; text-decoration:underline;">@$1</a>'
            )}</div>`
            : '';

        const ownerOrSafetyControls = isOwner
            ? `<div class="delete-btn" onclick="event.stopPropagation(); deletePost('${post.id}')">Delete</div>`
            : `<div class="safety-actions" onclick="event.stopPropagation()">
                <div class="safety-btn" onclick="reportPost('${post.id}')">Report</div>
                <div class="safety-btn" onclick="blockAuthorFromFeed('${escapeHtml(authorEmail)}', '${escapeHtml(authorUsername)}')">Block</div>
               </div>`;

        const profileUrl = `profile.html?user=${encodeURIComponent(authorUsername || authorEmail)}`;
        const hasStoryClass = post.has_story ? 'has-story' : '';
        const avatarClickAttr = post.has_story && typeof viewUserStory === 'function'
            ? `onclick="event.stopPropagation(); viewUserStory('${escapeHtml(authorEmail)}', '${escapeHtml(post.story_created_at || '')}')"`
            : `onclick="goToProfile('${profileUrl}', event)"`;

        const authorRowHtml = `
            <div class="post-header-line">
                <div class="feed-avatar-container ${hasStoryClass}" ${avatarClickAttr} title="${post.has_story ? 'View Story' : 'View Profile'}">
                    <img class="post-avatar" src="${authorPfp}">
                </div>
                <div style="flex-grow: 1;">
                    <a href="${profileUrl}" class="post-meta" onclick="goToProfile('${profileUrl}', event)">${authorUsername ? '@' + escapeHtml(authorUsername) : escapeHtml(authorEmail)}</a>${renderVerifiedBadge(authorVerified)}
                    <br><span class="post-timestamp">${new Date(post.created_at).toLocaleString()}</span>
                </div>
                ${ownerOrSafetyControls}
            </div>
        `;

        const mediaHtml = post.media_url ? `<img class="post-media" src="${post.media_url}">` : '';

        postEl.innerHTML = `
            ${authorRowHtml}
            ${formattedContent}
            ${mediaHtml}
            <div class="post-actions">
                <div class="reaction-group">
                    <div class="reaction-btn ${rxData.userReaction === 'like' ? 'active-like' : ''}" onclick="event.stopPropagation(); toggleReaction('${post.id}', 'like', this)">
                        ${POST_LIKE_SVG} <span class="likes-count">${rxData.likes}</span>
                    </div>
                    <div class="reaction-btn ${rxData.userReaction === 'dislike' ? 'active-dislike' : ''}" onclick="event.stopPropagation(); toggleReaction('${post.id}', 'dislike', this)">
                        ${POST_DISLIKE_SVG} <span class="dislikes-count">${rxData.dislikes}</span>
                    </div>
                    <div class="reaction-btn" aria-label="Comments" onclick="event.stopPropagation(); openCommentsDrawer('${post.id}')">
                        ${POST_COMMENT_SVG} <span class="comments-count">${initialCommentsCount}</span>
                    </div>
                </div>
                <div class="reaction-btn" aria-label="Share" onclick="event.stopPropagation(); sharePost('${post.id}')">
                    ${POST_SHARE_SVG}
                </div>
            </div>
        `;
        container.appendChild(postEl);
        if (observer) {
            observer.observe(postEl);
        }
    }

    if (highlightPostId && observer) {
        const target = container.querySelector(`.post-box[data-post-id="${highlightPostId}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

window.renderPosts = renderPosts;
window.toggleReaction = toggleReaction;
window.deletePost = deletePost;
window.sharePost = sharePost;
window.blockAuthorFromFeed = blockAuthorFromFeed;

// ===== COMMENTS DRAWER, FRIEND MENTIONING, IMAGE UPLOAD & STICKER LIBRARY =====
let _activeCommentsPostId = null;
let _replyingToCommentId = null;
let _replyingToCommentUsername = null;
let _commentsViewportBound = false;
let _stickerUploading = false;
let _commentImageUploading = false;
let _composerTypingMode = false;
let _mentionActiveQuery = null;
let _mentionMatches = [];
let _mentionSelectedIdx = 0;
let _activeStickerTab = 'all';
let _browseAllUploaded = false;
let _sharedStickersCache = [];
let _mostUsedStickersCache = [];
let _stickerUseCounts = new Map();
let _savedStickersSet = new Set();
let _stickerSaveLockUntil = new Map();

const COMMENT_STICKERS = ["😂", "🔥", "❤️", "😭", "👍", "💀", "🥺", "👏", "🎉", "🤔", "😍", "🙏"];
const STICKER_PREFIX = "__STICKER__:";
const COMMENT_IMAGE_PREFIX = "__COMMENT_IMG__:";
const SHARED_STICKERS_STORAGE_KEY = "nvaritia_shared_stickers_v1";
const SAVED_STICKERS_STORAGE_KEY = "nvaritia_saved_stickers_v1";
const STICKER_USAGE_STORAGE_KEY = "nvaritia_sticker_usage_v1";

const COMMENT_LIKE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
const COMMENT_DISLIKE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>`;
const COMPOSER_IMAGE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
const COMPOSER_AT_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>`;
const COMPOSER_STICKER_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path><path d="M15 3v6h6"></path><circle cx="9.5" cy="13.5" r="1"></circle><circle cx="14.5" cy="13.5" r="1"></circle><path d="M9.5 16.5a3.5 3.5 0 0 0 5 0"></path></svg>`;

function isSafeStickerImageUrl(val) {
    if (typeof val !== "string") return false;
    const trimmed = val.trim();
    if (/^https?:\/\//i.test(trimmed)) return true;
    if (/^data:image\/(webp|png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) return true;
    return false;
}

function hydrateLocalStickerState() {
    try {
        const sharedRaw = JSON.parse(localStorage.getItem(SHARED_STICKERS_STORAGE_KEY) || "[]");
        if (Array.isArray(sharedRaw)) {
            _sharedStickersCache = sharedRaw.filter(isSafeStickerImageUrl);
        }
    } catch (e) {}

    try {
        const savedRaw = JSON.parse(localStorage.getItem(SAVED_STICKERS_STORAGE_KEY) || "[]");
        if (Array.isArray(savedRaw)) {
            _savedStickersSet = new Set(savedRaw.filter(isSafeStickerImageUrl));
        }
    } catch (e) {}

    try {
        const usageRaw = JSON.parse(localStorage.getItem(STICKER_USAGE_STORAGE_KEY) || "{}");
        if (usageRaw && typeof usageRaw === "object") {
            _stickerUseCounts = new Map(
                Object.entries(usageRaw).map(([k, v]) => [k, Math.max(1, Number(v) || 1)])
            );
        }
    } catch (e) {}
}

hydrateLocalStickerState();

function persistLocalStickerState() {
    try {
        localStorage.setItem(SHARED_STICKERS_STORAGE_KEY, JSON.stringify(_sharedStickersCache.slice(0, 120)));
        localStorage.setItem(SAVED_STICKERS_STORAGE_KEY, JSON.stringify([..._savedStickersSet].slice(0, 100)));
        localStorage.setItem(STICKER_USAGE_STORAGE_KEY, JSON.stringify(Object.fromEntries([..._stickerUseCounts.entries()].slice(0, 150))));
    } catch (e) {}
}

function recordStickerUsage(stickerKey) {
    if (!stickerKey) return;
    const nextCount = (_stickerUseCounts.get(stickerKey) || 0) + 1;
    _stickerUseCounts.set(stickerKey, nextCount);
    persistLocalStickerState();
}

function getRankedMostUsedStickers() {
    const candidateMap = new Map();

    for (const item of _mostUsedStickersCache) {
        if (!item || !item.url || !isSafeStickerImageUrl(item.url)) continue;
        const count = Math.max(Number(item.use_count) || 1, _stickerUseCounts.get(item.url) || 0);
        candidateMap.set(item.url, { kind: 'image', value: item.url, count });
    }

    for (const url of [..._savedStickersSet, ..._sharedStickersCache]) {
        if (!isSafeStickerImageUrl(url)) continue;
        const count = _stickerUseCounts.get(url) || 1;
        const prev = candidateMap.get(url);
        if (!prev || count > prev.count) {
            candidateMap.set(url, { kind: 'image', value: url, count });
        }
    }

    for (const em of COMMENT_STICKERS) {
        const count = _stickerUseCounts.get(em) || 1;
        candidateMap.set(em, { kind: 'emoji', value: em, count });
    }

    return [...candidateMap.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
}

function syncStickerSaveIndicators() {
    const savedCount = _savedStickersSet.size;

    document.querySelectorAll('.sticker-tab-btn').forEach(btn => {
        if ((btn.textContent || '').startsWith('My Collection')) {
            btn.textContent = `My Collection (${savedCount})`;
        }
    });

    document.querySelectorAll('.sticker-save-badge').forEach(badge => {
        const card = badge.closest('.comment-sticker-card');
        const img = card && card.querySelector('img');
        const url = img ? img.getAttribute('src') : '';
        if (!url) return;
        const isSaved = _savedStickersSet.has(url);
        badge.classList.toggle('saved', isSaved);
        badge.textContent = isSaved ? '★' : '+';
        badge.title = isSaved ? 'Saved in collection' : 'Save to collection';
    });

    document.querySelectorAll('.comment-sticker-save-toggle').forEach(el => {
        const url = el.getAttribute('data-sticker-url') || '';
        if (!url) return;
        const isSaved = _savedStickersSet.has(url);
        el.classList.toggle('saved', isSaved);
        el.textContent = isSaved ? '★ Saved in collection' : '+ Save sticker';
    });
}

async function loadSharedStickers() {
    const user = getSessionUser();
    const email = user && user.email ? user.email : '';
    try {
        const query = email ? `?email=${encodeURIComponent(email)}` : '';
        const res = await fetch(`${WORKER_ORIGIN}/api/stickers/list${query}`, {
            headers: authHeaders()
        });
        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data.mostUsedStickers)) {
            _mostUsedStickersCache = data.mostUsedStickers.filter(s => s && isSafeStickerImageUrl(s.url));
            for (const s of _mostUsedStickersCache) {
                const cnt = Math.max(Number(s.use_count) || 1, _stickerUseCounts.get(s.url) || 0);
                _stickerUseCounts.set(s.url, cnt);
            }
        }

        const serverStickers = Array.isArray(data.stickers)
            ? data.stickers.map(s => {
                const u = typeof s === 'string' ? s : s && s.url;
                if (u && s && typeof s === 'object' && s.use_count) {
                    _stickerUseCounts.set(u, Math.max(Number(s.use_count) || 1, _stickerUseCounts.get(u) || 0));
                }
                return u;
            }).filter(isSafeStickerImageUrl)
            : [];

        if (Array.isArray(data.savedUrls)) {
            const now = Date.now();
            const mergedSaved = new Set(_savedStickersSet);
            const serverSavedSet = new Set(data.savedUrls.filter(isSafeStickerImageUrl));

            for (const [lockedUrl, lockUntil] of _stickerSaveLockUntil.entries()) {
                if (lockUntil <= now) {
                    _stickerSaveLockUntil.delete(lockedUrl);
                    continue;
                }
                if (_savedStickersSet.has(lockedUrl)) mergedSaved.add(lockedUrl);
                else mergedSaved.delete(lockedUrl);
            }

            for (const u of serverSavedSet) {
                if ((_stickerSaveLockUntil.get(u) || 0) <= now) mergedSaved.add(u);
            }
            for (const u of [...mergedSaved]) {
                if ((_stickerSaveLockUntil.get(u) || 0) <= now && !serverSavedSet.has(u)) {
                    mergedSaved.delete(u);
                }
            }

            _savedStickersSet = mergedSaved;
        }

        _sharedStickersCache = [...new Set([...serverStickers, ..._sharedStickersCache])];
        persistLocalStickerState();
        renderStickerPicker();
        syncStickerSaveIndicators();
    } catch (e) {}
}

async function publishStickerToDatabase(url) {
    if (!isSafeStickerImageUrl(url)) return;
    _sharedStickersCache = [url, ..._sharedStickersCache.filter(u => u !== url)];
    recordStickerUsage(url);
    persistLocalStickerState();
    renderStickerPicker();
    syncStickerSaveIndicators();

    try {
        await fetch(`${WORKER_ORIGIN}/api/stickers/create`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ url, incrementUse: true })
        });
        await loadSharedStickers();
    } catch (e) {}
}

async function toggleSaveSticker(event, url) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const user = getSessionUser();
    if (!user) return promptSignup('save stickers to your collection');
    if (!isSafeStickerImageUrl(url)) return;

    const currentlySaved = _savedStickersSet.has(url);
    const nextSaved = !currentlySaved;

    _stickerSaveLockUntil.set(url, Date.now() + 4000);
    if (nextSaved) {
        _savedStickersSet.add(url);
        showToast("Saved to your stickers");
    } else {
        _savedStickersSet.delete(url);
        showToast("Removed from your stickers");
    }
    persistLocalStickerState();
    renderStickerPicker();
    syncStickerSaveIndicators();

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stickers/save`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ url, saved: nextSaved })
        });
        if (res.ok) {
            const data = await res.json();
            if (typeof data.saved === 'boolean') {
                if (data.saved) _savedStickersSet.add(url);
                else _savedStickersSet.delete(url);
                persistLocalStickerState();
                renderStickerPicker();
                syncStickerSaveIndicators();
            }
        }
    } catch (e) {}
}

function setStickerTab(tabName) {
    _activeStickerTab = tabName;
    if (tabName === 'all') {
        _browseAllUploaded = true;
    }
    renderStickerPicker();
    syncStickerSaveIndicators();
}

function toggleBrowseAllUploadedStickers(forceState = null) {
    _browseAllUploaded = typeof forceState === 'boolean' ? forceState : !_browseAllUploaded;
    if (_browseAllUploaded) _activeStickerTab = 'all';
    renderStickerPicker();
    syncStickerSaveIndicators();
}

function renderStickerCardHtml(item, showSaveBadge = true) {
    if (item.kind === 'image') {
        const isSaved = _savedStickersSet.has(item.value);
        const badgeHtml = showSaveBadge
            ? `<button type="button" class="sticker-save-badge ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Saved in collection' : 'Save to collection'}" onclick="toggleSaveSticker(event, decodeURIComponent('${encodeURIComponent(item.value)}'))">${isSaved ? '★' : '+'}</button>`
            : '';
        return `
            <div class="comment-sticker-card img-sticker" title="Post image sticker" onclick="sendImageStickerUrl(decodeURIComponent('${encodeURIComponent(item.value)}'))">
                <img src="${escapeHtml(item.value)}" alt="Sticker">
                ${badgeHtml}
            </div>
        `;
    }
    return `
        <button type="button" class="comment-sticker-card" onclick="sendStickerComment(decodeURIComponent('${encodeURIComponent(item.value)}'))">${escapeHtml(item.value)}</button>
    `;
}

function renderStickerPicker() {
    const panel = document.getElementById('comment-sticker-panel');
    if (!panel) return;

    const savedList = [..._savedStickersSet];
    const allUploadedList = [...new Set([...savedList, ..._sharedStickersCache])];
    const mostUsedList = getRankedMostUsedStickers();

    const mostUsedCardsHtml = mostUsedList.map(item => renderStickerCardHtml(item, true)).join('');
    const arrowButtonHtml = `
        <button type="button" class="most-used-arrow-btn" title="Browse all uploaded stickers" aria-label="Browse all uploaded stickers" onclick="toggleBrowseAllUploadedStickers()">
            ${_browseAllUploaded ? '↑' : '→'}
        </button>
    `;

    let secondarySectionHtml = '';
    if (_activeStickerTab === 'saved') {
        const savedCards = savedList.length
            ? savedList.map(url => renderStickerCardHtml({ kind: 'image', value: url }, true)).join('')
            : `<p style="color:#666; font-size:12px; padding:8px; margin:auto;">No saved stickers yet. Tap + on any sticker to save it.</p>`;
        secondarySectionHtml = `
            <div class="sticker-section-header">
                <span>My Collection (${savedList.length})</span>
            </div>
            <div class="comment-sticker-grid">${savedCards}</div>
        `;
    } else if (_activeStickerTab === 'emoji') {
        const emojiCards = COMMENT_STICKERS.map(st => renderStickerCardHtml({ kind: 'emoji', value: st }, false)).join('');
        secondarySectionHtml = `
            <div class="sticker-section-header">
                <span>Emojis</span>
            </div>
            <div class="comment-sticker-grid">${emojiCards}</div>
        `;
    } else if (_browseAllUploaded) {
        const uploadedCards = allUploadedList.length
            ? allUploadedList.map(url => renderStickerCardHtml({ kind: 'image', value: url }, true)).join('')
            : `<p style="color:#666; font-size:12px; padding:8px; margin:auto;">No uploaded stickers yet.</p>`;
        secondarySectionHtml = `
            <div class="sticker-section-header">
                <span>All Uploaded Stickers (${allUploadedList.length})</span>
                <button type="button" class="sticker-browse-link" onclick="toggleBrowseAllUploadedStickers(false)">Hide</button>
            </div>
            <div class="comment-sticker-grid">${uploadedCards}</div>
        `;
    }

    panel.innerHTML = `
        <div class="sticker-tabs-row">
            <div class="sticker-tab-group">
                <button type="button" class="sticker-tab-btn ${_activeStickerTab === 'all' && !_browseAllUploaded ? 'active' : ''}" onclick="setStickerTab('all')">All Stickers</button>
                <button type="button" class="sticker-tab-btn ${_activeStickerTab === 'saved' ? 'active' : ''}" onclick="setStickerTab('saved')">My Collection (${savedList.length})</button>
                <button type="button" class="sticker-tab-btn ${_activeStickerTab === 'emoji' ? 'active' : ''}" onclick="setStickerTab('emoji')">Emojis</button>
            </div>
            <button type="button" class="comment-sticker-upload-btn" id="comment-sticker-upload-btn" onclick="triggerStickerImagePick()">${_stickerUploading ? 'Uploading...' : '+ Upload Sticker'}</button>
        </div>
        <div class="sticker-section-header">
            <span>Most used</span>
            <button type="button" class="sticker-browse-link" onclick="toggleBrowseAllUploadedStickers()">All uploaded (${allUploadedList.length})</button>
        </div>
        <div class="most-used-strip">
            ${mostUsedCardsHtml}
            ${arrowButtonHtml}
        </div>
        ${secondarySectionHtml}
    `;
}

function parseStickerContent(raw) {
    if (typeof raw !== "string") return null;
    if (raw.startsWith(STICKER_PREFIX)) {
        const value = raw.slice(STICKER_PREFIX.length).trim();
        if (!value) return null;
        if (isSafeStickerImageUrl(value)) {
            return { type: "image", value };
        }
        return { type: "emoji", value };
    }
    return null;
}

function parseCommentImageContent(raw) {
    if (typeof raw !== "string") return null;
    if (raw.startsWith(COMMENT_IMAGE_PREFIX)) {
        const value = raw.slice(COMMENT_IMAGE_PREFIX.length).trim();
        if (isSafeStickerImageUrl(value)) return value;
    }
    return null;
}

function formatMentionTextHtml(text) {
    return escapeHtml(text || '').replace(
        /(^|[\s(])@([a-zA-Z0-9_]+)/g,
        (match, prefix, uname) => {
            const safeUname = escapeHtml(uname);
            const profileUrl = `profile.html?user=${encodeURIComponent(uname)}`;
            return `${prefix}<a href="${profileUrl}" class="comment-mention-link" onclick="goToProfile('${profileUrl}', event)">@${safeUname}</a>`;
        }
    );
}

function renderCommentBodyHtml(rawContent) {
    const sticker = parseStickerContent(rawContent);
    if (sticker) {
        if (sticker.type === "image") {
            const isSaved = _savedStickersSet.has(sticker.value);
            return `
                <div class="comment-sticker-box">
                    <img class="comment-sticker-img" src="${escapeHtml(sticker.value)}" alt="Sticker" loading="lazy">
                    <span class="comment-sticker-save-toggle ${isSaved ? 'saved' : ''}" data-sticker-url="${escapeHtml(sticker.value)}" onclick="toggleSaveSticker(event, decodeURIComponent('${encodeURIComponent(sticker.value)}'))">${isSaved ? '★ Saved in collection' : '+ Save sticker'}</span>
                </div>
            `;
        }
        return `<div class="comment-sticker-badge" role="img" aria-label="Sticker">${escapeHtml(sticker.value)}</div>`;
    }

    const commentImgUrl = parseCommentImageContent(rawContent);
    if (commentImgUrl) {
        return `<img class="comment-media-img" src="${escapeHtml(commentImgUrl)}" alt="Comment image" loading="lazy">`;
    }

    return `<div class="comment-content">${formatMentionTextHtml(rawContent || '')}</div>`;
}

function setComposerTypingMode(active) {
    const input = document.getElementById('comment-input');
    const form = document.getElementById('comment-submit-form');
    if (!form) return;
    const hasText = !!(input && input.value.trim().length > 0);
    const hasMention = _mentionActiveQuery !== null;
    _composerTypingMode = Boolean(active || hasText || hasMention);
    form.classList.toggle('composer-typing', _composerTypingMode);
    syncCommentsDrawerViewport();
}

function syncComposerUserAvatar() {
    const img = document.getElementById('composer-user-pfp');
    if (!img) return;
    const user = getSessionUser();
    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";
    img.src = (user && user.pfp_url) ? user.pfp_url : defaultAvatar;
}

function getFriendUsernamesSet() {
    const friends = Array.isArray(_friendsCache) ? _friendsCache : [];
    return new Set(
        friends
            .map(f => (f && f.username ? String(f.username).trim().toLowerCase() : ""))
            .filter(Boolean)
    );
}

function validateFriendMentions(text) {
    const mentionMatches = [...String(text || "").matchAll(/(?:^|\s)@([a-zA-Z0-9_]+)/g)];
    if (!mentionMatches.length) return { ok: true, invalidUsernames: [] };

    const friendSet = getFriendUsernamesSet();
    const invalid = [];
    for (const m of mentionMatches) {
        const uname = (m[1] || "").toLowerCase();
        if (!friendSet.has(uname)) {
            invalid.push(m[1]);
        }
    }
    return { ok: invalid.length === 0, invalidUsernames: invalid };
}

function closeFriendMentionDropdown() {
    _mentionActiveQuery = null;
    _mentionMatches = [];
    _mentionSelectedIdx = 0;
    const box = document.getElementById('friend-mention-box');
    const atBtn = document.getElementById('comment-tag-btn');
    if (box) {
        box.classList.remove('open');
        box.innerHTML = '';
    }
    if (atBtn) atBtn.classList.remove('active');
}

function renderFriendMentionDropdown() {
    const box = document.getElementById('friend-mention-box');
    if (!box) return;

    if (_mentionActiveQuery === null) {
        box.classList.remove('open');
        box.innerHTML = '';
        return;
    }

    const friends = Array.isArray(_friendsCache) ? _friendsCache : [];
    const q = _mentionActiveQuery.toLowerCase();
    _mentionMatches = friends.filter(f => {
        const uname = (f && f.username ? String(f.username) : "").toLowerCase();
        return uname.startsWith(q) || uname.includes(q);
    });

    if (_mentionSelectedIdx >= _mentionMatches.length) _mentionSelectedIdx = 0;

    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

    if (!_mentionMatches.length) {
        box.innerHTML = `<div style="padding:8px 10px; font-size:12px; color:#666;">${friends.length ? "Only friends can be tagged (no matching friend)." : "You have no friends to tag yet."}</div>`;
        box.classList.add('open');
        return;
    }

    box.innerHTML = _mentionMatches.map((f, idx) => `
        <div class="friend-mention-item ${idx === _mentionSelectedIdx ? 'active' : ''}" onclick="selectFriendMention(${idx})">
            <img class="friend-mention-avatar" src="${f.pfp_url || defaultAvatar}" alt="">
            <span>@${escapeHtml(f.username)}${renderVerifiedBadge(f.verified)}</span>
        </div>
    `).join('');
    box.classList.add('open');
}

function selectFriendMention(index) {
    const friend = _mentionMatches[index];
    const input = document.getElementById('comment-input');
    if (!friend || !input) return;

    const val = input.value;
    const caret = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
    const beforeCaret = val.slice(0, caret);
    const afterCaret = val.slice(caret);
    const atMatch = beforeCaret.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/);

    if (atMatch) {
        const startIdx = atMatch.index + (atMatch[0].startsWith(' ') || atMatch[0].startsWith('\n') ? 1 : 0);
        const replacement = `@${friend.username} `;
        input.value = val.slice(0, startIdx) + replacement + afterCaret;
        const nextPos = startIdx + replacement.length;
        input.focus();
        try { input.setSelectionRange(nextPos, nextPos); } catch (e) {}
    } else {
        input.value = `${val}${val && !val.endsWith(' ') ? ' ' : ''}@${friend.username} `;
        input.focus();
    }

    closeFriendMentionDropdown();
    setComposerTypingMode(true);
}

async function updateFriendMentionStateFromInput() {
    const input = document.getElementById('comment-input');
    if (!input) return;
    const val = input.value;
    const caret = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
    const beforeCaret = val.slice(0, caret);
    const match = beforeCaret.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/);

    if (!match) {
        closeFriendMentionDropdown();
        return;
    }

    _mentionActiveQuery = match[1] || "";
    const atBtn = document.getElementById('comment-tag-btn');
    if (atBtn) atBtn.classList.add('active');
    setComposerTypingMode(true);

    if (!Array.isArray(_friendsCache)) {
        await ensureFriendsLoaded(false);
    }
    renderFriendMentionDropdown();
}

async function triggerFriendTagMode() {
    const user = getSessionUser();
    if (!user) return promptSignup('tag friends');
    const input = document.getElementById('comment-input');
    if (!input) return;

    setComposerTypingMode(true);
    toggleStickerPicker(false);

    const val = input.value;
    const needsSpace = val.length > 0 && !/\s$/.test(val);
    const caret = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
    const before = val.slice(0, caret);
    const after = val.slice(caret);

    if (!/(?:^|\s)@[a-zA-Z0-9_]*$/.test(before)) {
        const insert = `${needsSpace ? ' ' : ''}@`;
        input.value = before + insert + after;
        const nextPos = before.length + insert.length;
        input.focus();
        try { input.setSelectionRange(nextPos, nextPos); } catch (e) {}
    } else {
        input.focus();
    }

    await ensureFriendsLoaded(false);
    await updateFriendMentionStateFromInput();
}

function syncCommentsDrawerViewport() {
    const drawer = document.getElementById('comments-drawer');
    if (!drawer || !drawer.classList.contains('open')) return;
    if (window.visualViewport) {
        drawer.style.height = `${window.visualViewport.height}px`;
        drawer.style.top = `${window.visualViewport.offsetTop}px`;
    } else {
        drawer.style.height = `${window.innerHeight}px`;
        drawer.style.top = '0px';
    }
}

function resetCommentsDrawerViewport() {
    const drawer = document.getElementById('comments-drawer');
    if (!drawer) return;
    drawer.style.height = '';
    drawer.style.top = '';
}

function toggleStickerPicker(forceState = null) {
    const panel = document.getElementById('comment-sticker-panel');
    const stickerBtn = document.getElementById('comment-sticker-toggle-btn');
    if (!panel) return;
    const nextOpen = typeof forceState === 'boolean' ? forceState : !panel.classList.contains('open');
    if (nextOpen) {
        closeFriendMentionDropdown();
        _browseAllUploaded = false;
        renderStickerPicker();
        syncStickerSaveIndicators();
        loadSharedStickers();
    }
    panel.classList.toggle('open', nextOpen);
    if (stickerBtn) stickerBtn.classList.toggle('active', nextOpen);
    syncCommentsDrawerViewport();
}

function triggerStickerImagePick() {
    const user = getSessionUser();
    if (!user) return promptSignup('post image stickers');
    if (_stickerUploading) return;
    const input = document.getElementById('comment-sticker-file-input');
    if (input) input.click();
}

function triggerCommentImagePick() {
    const user = getSessionUser();
    if (!user) return promptSignup('attach images to comments');
    if (_commentImageUploading) return;
    const input = document.getElementById('comment-image-file-input');
    if (input) input.click();
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(blob);
    });
}

async function uploadMediaFile(file, maxDataUrlLen = 520000) {
    const endpoints = [`${WORKER_ORIGIN}/api/comments/sticker`, `${WORKER_ORIGIN}/api/upload`];
    for (const url of endpoints) {
        try {
            const fd = new FormData();
            fd.append('media', file);
            fd.append('file', file);
            const res = await fetch(url, {
                method: 'POST',
                headers: authHeaders(),
                body: fd
            });
            if (res.status === 404) continue;
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Image upload failed');
            const uploadedUrl = data.url || data.media_url || data.sticker_url || '';
            if (uploadedUrl) return uploadedUrl;
        } catch (err) {
            if (/404/.test(err.message)) continue;
            throw err;
        }
    }

    const dataUrl = await blobToDataUrl(file);
    if (typeof dataUrl === "string" && dataUrl.length <= maxDataUrlLen && isSafeStickerImageUrl(dataUrl)) {
        return dataUrl;
    }
    throw new Error("Image is too large without a worker upload endpoint.");
}

async function handleCommentImageSelected(input) {
    const rawFile = input && input.files && input.files[0];
    if (!rawFile) return;
    input.value = '';

    if (!rawFile.type.startsWith('image/')) {
        showToast("Please choose an image file.");
        return;
    }

    _commentImageUploading = true;
    try {
        const prepared = await compressImage(rawFile, 1024, 0.82);
        const imageUrl = await uploadMediaFile(prepared, 650000);
        await postCommentPayload(`${COMMENT_IMAGE_PREFIX}${imageUrl}`);
    } catch (err) {
        showToast(err.message || "Failed to send image");
    } finally {
        _commentImageUploading = false;
    }
}

async function handleStickerImageSelected(input) {
    const rawFile = input && input.files && input.files[0];
    if (!rawFile) return;
    input.value = '';

    if (!rawFile.type.startsWith('image/')) {
        showToast("Please choose an image file.");
        return;
    }

    _stickerUploading = true;
    renderStickerPicker();
    try {
        const prepared = await compressImage(rawFile, 512, 0.82);
        const stickerUrl = await uploadMediaFile(prepared, 420000);
        await publishStickerToDatabase(stickerUrl);
        await postCommentPayload(`${STICKER_PREFIX}${stickerUrl}`);
    } catch (err) {
        showToast(err.message || "Failed to send image sticker");
    } finally {
        _stickerUploading = false;
        renderStickerPicker();
        syncStickerSaveIndicators();
    }
}

async function sendImageStickerUrl(url) {
    if (!isSafeStickerImageUrl(url)) return;
    try {
        if (!_sharedStickersCache.includes(url)) {
            _sharedStickersCache.unshift(url);
        }
        recordStickerUsage(url);
        renderStickerPicker();
        syncStickerSaveIndicators();
        await postCommentPayload(`${STICKER_PREFIX}${url}`);
        fetch(`${WORKER_ORIGIN}/api/stickers/create`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ url, incrementUse: true })
        }).then(() => loadSharedStickers()).catch(() => {});
    } catch (err) {
        showToast(err.message);
    }
}

function ensureCommentsDrawer() {
    let drawer = document.getElementById('comments-drawer');
    if (drawer) {
        syncComposerUserAvatar();
        return drawer;
    }

    drawer = document.createElement('div');
    drawer.id = 'comments-drawer';
    drawer.className = 'comments-drawer';
    drawer.innerHTML = `
        <div class="drawer-header">
            <button type="button" class="comments-back-btn" onclick="closeCommentsDrawer()" aria-label="Back">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <span id="comments-drawer-title">Comments</span>
        </div>
        <div class="drawer-body">
            <div class="comments-container" id="comments-list">Loading comments...</div>
            <div id="replying-banner" style="display: none; background: #f0f0f0; padding: 7px 10px; font-size: 12px; font-weight: bold; justify-content: space-between; align-items: center; border-radius: 4px; margin-bottom: 6px; flex-shrink: 0;">
                <span id="replying-to-text">Replying...</span>
                <span style="cursor: pointer; color: #666;" onclick="cancelReply()">Cancel</span>
            </div>
            <div id="friend-mention-box" class="friend-mention-box" role="listbox" aria-label="Tag friends"></div>
            <input type="file" id="comment-image-file-input" accept="image/*" style="display: none;" onchange="handleCommentImageSelected(this)">
            <input type="file" id="comment-sticker-file-input" accept="image/*" style="display: none;" onchange="handleStickerImageSelected(this)">
            <div id="comment-sticker-panel" aria-label="Stickers"></div>
            <form id="comment-submit-form">
                <div class="composer-top-row">
                    <img id="composer-user-pfp" class="composer-user-pfp" src="" alt="Your avatar">
                    <input type="text" id="comment-input" placeholder="Write a comment..." autocomplete="off">
                </div>
                <div class="composer-bottom-bar">
                    <div class="composer-actions-row">
                        <button type="button" class="composer-icon-btn" id="comment-image-btn" title="Upload image" aria-label="Upload image" onclick="triggerCommentImagePick()">${COMPOSER_IMAGE_SVG}</button>
                        <button type="button" class="composer-icon-btn" id="comment-tag-btn" title="Tag a friend" aria-label="Tag a friend" onclick="triggerFriendTagMode()">${COMPOSER_AT_SVG}</button>
                        <button type="button" class="composer-icon-btn" id="comment-sticker-toggle-btn" title="Stickers" aria-label="Stickers" onclick="toggleStickerPicker()">${COMPOSER_STICKER_SVG}</button>
                    </div>
                    <button type="submit" class="comment-post-btn" id="comment-post-submit-btn">Send</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(drawer);
    syncComposerUserAvatar();
    renderStickerPicker();

    const form = document.getElementById('comment-submit-form');
    const input = document.getElementById('comment-input');

    form.addEventListener('submit', submitComment);

    input.addEventListener('focus', () => {
        toggleStickerPicker(false);
        setComposerTypingMode(true);
        ensureFriendsLoaded(false);
        syncCommentsDrawerViewport();
        setTimeout(syncCommentsDrawerViewport, 150);
    });

    input.addEventListener('input', () => {
        setComposerTypingMode(true);
        updateFriendMentionStateFromInput();
    });

    input.addEventListener('keydown', (e) => {
        if (_mentionActiveQuery !== null && _mentionMatches.length) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                _mentionSelectedIdx = (_mentionSelectedIdx + 1) % _mentionMatches.length;
                renderFriendMentionDropdown();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                _mentionSelectedIdx = (_mentionSelectedIdx - 1 + _mentionMatches.length) % _mentionMatches.length;
                renderFriendMentionDropdown();
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                selectFriendMention(_mentionSelectedIdx);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                closeFriendMentionDropdown();
                return;
            }
        }
    });

    document.addEventListener('click', (e) => {
        const drawerEl = document.getElementById('comments-drawer');
        if (!drawerEl || !drawerEl.classList.contains('open')) return;
        const formEl = document.getElementById('comment-submit-form');
        const mentionBox = document.getElementById('friend-mention-box');
        const stickerPanel = document.getElementById('comment-sticker-panel');
        const clickedInsideComposer = formEl && formEl.contains(e.target);
        const clickedMention = mentionBox && mentionBox.contains(e.target);
        const clickedSticker = stickerPanel && stickerPanel.contains(e.target);

        if (!clickedMention) {
            closeFriendMentionDropdown();
        }
        if (!clickedInsideComposer && !clickedMention && !clickedSticker) {
            setComposerTypingMode(false);
        }
    });

    if (!_commentsViewportBound) {
        _commentsViewportBound = true;
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', syncCommentsDrawerViewport);
            window.visualViewport.addEventListener('scroll', syncCommentsDrawerViewport);
        }
        window.addEventListener('resize', syncCommentsDrawerViewport);
    }

    return drawer;
}

function openCommentsDrawer(postId) {
    const drawer = ensureCommentsDrawer();
    _activeCommentsPostId = postId;
    cancelReply();
    closeFriendMentionDropdown();
    toggleStickerPicker(false);
    setComposerTypingMode(false);
    ensureFriendsLoaded(false);

    drawer.classList.remove('open');
    void drawer.offsetWidth;
    requestAnimationFrame(() => {
        drawer.classList.add('open');
        syncCommentsDrawerViewport();
    });

    loadComments();
    loadSharedStickers();
}

function closeCommentsDrawer() {
    const drawer = document.getElementById('comments-drawer');
    if (drawer) {
        drawer.classList.remove('open');
        resetCommentsDrawerViewport();
    }
    closeFriendMentionDropdown();
    toggleStickerPicker(false);
    setComposerTypingMode(false);
    _activeCommentsPostId = null;
    cancelReply();
}

async function deleteComment(commentId) {
    const user = getSessionUser();
    if (!user) return promptSignup('delete comments');

    showConfirmDialog("Delete Comment", "Delete this comment?", "Delete", async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/comments/delete`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ commentId, postId: _activeCommentsPostId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete comment');

            const commentEl = document.getElementById(`comment-${commentId}`);
            if (commentEl) commentEl.remove();

            if (_activeCommentsPostId) {
                await loadComments();
            }
            showToast("Comment deleted");
        } catch (err) {
            showToast(err.message);
        }
    });
}

async function loadComments() {
    const listEl = document.getElementById('comments-list');
    const titleEl = document.getElementById('comments-drawer-title');
    if (!listEl || !_activeCommentsPostId) return;
    listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#666; font-weight:600;">Loading comments...</div>';

    const user = getSessionUser();
    const viewerEmail = user && user.email ? user.email : '';

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/comments/get?postId=${encodeURIComponent(_activeCommentsPostId)}&email=${encodeURIComponent(viewerEmail)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load comments');

        const comments = Array.isArray(data.comments) ? data.comments : [];
        if (titleEl) titleEl.innerText = `Comments (${comments.length})`;
        updatePostCommentCount(_activeCommentsPostId, comments.length);

        if (!comments.length) {
            listEl.innerHTML = '<p style="color: #666; text-align: center; font-size: 14px; margin: auto;">No comments yet.</p>';
            return;
        }

        const commentMap = new Map();
        const rootComments = [];

        comments.forEach(c => {
            c.replies = [];
            commentMap.set(c.id, c);
        });

        comments.forEach(c => {
            if (c.parent_id && commentMap.has(c.parent_id)) {
                commentMap.get(c.parent_id).replies.push(c);
            } else if (!c.parent_id) {
                rootComments.push(c);
            }
        });

        function renderCommentNode(c, isReply = false) {
            const isMe = !!(user && user.email && c.user_email && c.user_email.toLowerCase() === user.email.toLowerCase());
            const profileUrl = `profile.html?user=${encodeURIComponent(c.username || c.user_email)}`;
            const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

            return `
                <div class="comment-item ${isReply ? 'reply' : ''}" id="comment-${c.id}">
                    <a href="${profileUrl}" class="comment-avatar-link" onclick="goToProfile('${profileUrl}', event)" title="View @${escapeHtml(c.username)}'s profile">
                        <img class="comment-avatar" src="${c.pfp_url || defaultAvatar}">
                    </a>
                    <div class="comment-main-col">
                        <div class="comment-header-row">
                            <a href="${profileUrl}" class="comment-author-link" onclick="goToProfile('${profileUrl}', event)">@${escapeHtml(c.username)}${renderVerifiedBadge(c.verified)}</a>
                        </div>
                        ${renderCommentBodyHtml(c.content)}
                        <div class="comment-actions">
                            <div class="comment-reaction-btn ${c.userReaction === 'like' ? 'active-like' : ''}" onclick="toggleCommentReaction('${c.id}', 'like')">
                                ${COMMENT_LIKE_SVG} <span class="c-likes-count">${c.likes}</span>
                            </div>
                            <div class="comment-reaction-btn ${c.userReaction === 'dislike' ? 'active-dislike' : ''}" onclick="toggleCommentReaction('${c.id}', 'dislike')">
                                ${COMMENT_DISLIKE_SVG} <span class="c-dislikes-count">${c.dislikes}</span>
                            </div>
                            <span style="cursor: pointer; color: #000;" onclick="setReplyingTo('${c.id}', '${escapeHtml(c.username)}')">Reply</span>
                            ${isMe
                                ? `<span class="comment-delete-btn" onclick="deleteComment('${c.id}')">Delete</span>`
                                : `<span style="cursor: pointer; color: #777;" onclick="blockUser('${escapeHtml(c.user_email)}', '${escapeHtml(c.username)}', loadComments)">Block</span>`
                            }
                        </div>
                    </div>
                </div>
                ${c.replies.map(r => renderCommentNode(r, true)).join('')}
            `;
        }

        listEl.innerHTML = rootComments.map(c => renderCommentNode(c)).join('');
        listEl.scrollTop = listEl.scrollHeight;
        syncStickerSaveIndicators();
    } catch (err) {
        listEl.innerHTML = '<p style="color: #ef4444; font-size: 13px; text-align: center; margin: auto;">Failed to load comments.</p>';
    }
}

function setReplyingTo(commentId, username) {
    const user = getSessionUser();
    if (!user) return promptSignup('reply to comments');
    _replyingToCommentId = commentId;
    _replyingToCommentUsername = username;
    const textEl = document.getElementById('replying-to-text');
    const bannerEl = document.getElementById('replying-banner');
    const inputEl = document.getElementById('comment-input');
    if (textEl) textEl.innerText = `Replying to @${username}`;
    if (bannerEl) bannerEl.style.display = 'flex';
    if (inputEl) {
        inputEl.focus();
        setComposerTypingMode(true);
    }
}

function cancelReply() {
    _replyingToCommentId = null;
    _replyingToCommentUsername = null;
    const bannerEl = document.getElementById('replying-banner');
    if (bannerEl) bannerEl.style.display = 'none';
}

async function postCommentPayload(content) {
    const user = getSessionUser();
    if (!user) return promptSignup('comment');
    if (!content || !_activeCommentsPostId) return;

    const targetPostId = _activeCommentsPostId;
    const res = await fetch(`${WORKER_ORIGIN}/api/comments/add`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            postId: targetPostId,
            content,
            parentId: _replyingToCommentId
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add comment');

    cancelReply();
    closeFriendMentionDropdown();
    toggleStickerPicker(false);
    incrementPostCommentCount(targetPostId, 1);
    await loadComments();
}

async function sendStickerComment(sticker) {
    try {
        recordStickerUsage(sticker);
        renderStickerPicker();
        syncStickerSaveIndicators();
        await postCommentPayload(`${STICKER_PREFIX}${sticker}`);
    } catch (err) {
        showToast(err.message);
    }
}

async function submitComment(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const input = document.getElementById('comment-input');
    if (!input) return;
    const content = input.value.trim();
    if (!content || !_activeCommentsPostId) return;

    if (/(?:^|\s)@[a-zA-Z0-9_]+/.test(content)) {
        await ensureFriendsLoaded(false);
        const check = validateFriendMentions(content);
        if (!check.ok) {
            showToast(`You can only tag friends (@${check.invalidUsernames.join(', @')} is not your friend).`);
            return;
        }
    }

    try {
        await postCommentPayload(content);
        input.value = '';
        setComposerTypingMode(false);
    } catch (err) {
        showToast(err.message);
    }
}

async function toggleCommentReaction(commentId, reactionType) {
    const user = getSessionUser();
    if (!user) return promptSignup('like or dislike comments');
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/comments/react`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ commentId, reaction: reactionType })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to react');

        const parent = document.getElementById(`comment-${commentId}`);
        if (parent) {
            const lSpan = parent.querySelector('.c-likes-count');
            const dSpan = parent.querySelector('.c-dislikes-count');
            if (lSpan) lSpan.innerText = data.likes;
            if (dSpan) dSpan.innerText = data.dislikes;

            const buttons = parent.querySelectorAll('.comment-reaction-btn');
            if (buttons[0]) buttons[0].className = `comment-reaction-btn ${data.userReaction === 'like' ? 'active-like' : ''}`;
            if (buttons[1]) buttons[1].className = `comment-reaction-btn ${data.userReaction === 'dislike' ? 'active-dislike' : ''}`;
        }
    } catch (err) {
        showToast(err.message);
    }
}

window.openCommentsDrawer = openCommentsDrawer;
window.closeCommentsDrawer = closeCommentsDrawer;
window.loadComments = loadComments;
window.deleteComment = deleteComment;
window.setReplyingTo = setReplyingTo;
window.cancelReply = cancelReply;
window.submitComment = submitComment;
window.sendStickerComment = sendStickerComment;
window.sendImageStickerUrl = sendImageStickerUrl;
window.triggerStickerImagePick = triggerStickerImagePick;
window.handleStickerImageSelected = handleStickerImageSelected;
window.triggerCommentImagePick = triggerCommentImagePick;
window.handleCommentImageSelected = handleCommentImageSelected;
window.triggerFriendTagMode = triggerFriendTagMode;
window.selectFriendMention = selectFriendMention;
window.toggleStickerPicker = toggleStickerPicker;
window.setStickerTab = setStickerTab;
window.toggleBrowseAllUploadedStickers = toggleBrowseAllUploadedStickers;
window.toggleSaveSticker = toggleSaveSticker;
window.toggleCommentReaction = toggleCommentReaction;

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

// ===== VIDEO PASS-THROUGH (Compression completely removed) =====
async function compressVideo(file) {
    return file;
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
.story-reply-bar { position: absolute; left: 0; right: 0; bottom: 10%; z-index: 20; display: none; gap: 8px; padding: 12px 16px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0)); }
.story-reply-input { flex-grow: 1; min-width: 0; padding: 10px 16px; border: 1px solid rgba(255,255,255,0.6); border-radius: 22px; background: rgba(0,0,0,0.4); color: #fff; font-size: 16px; outline: none; }
.story-reply-input::placeholder { color: rgba(255,255,255,0.7); }
.story-reply-send { border: none; border-radius: 22px; padding: 10px 18px; background: #fff; color: #000; font-size: 14px; font-weight: 700; cursor: pointer; }
.story-reply-send:disabled { opacity: 0.5; }
html.dark .story-reply-input { background: rgba(0,0,0,0.4); color: #fff; border-color: rgba(255,255,255,0.6); }
#ugc-confirm-overlay { z-index: 10001; }
`;

let _storyReady = false;
let _storyOnDeleted = null;
let _storyOwnerEmail = '';
let _storyReplySending = false;

function storyAgeLabel(createdAt) {
    if (!createdAt) return '';
    let s = String(createdAt).trim();
    if (!/[zZ]$|[+-]\d\d:?\d\d$/.test(s)) s = s.replace(' ', 'T') + 'Z';
    const t = Date.parse(s);
    if (isNaN(t)) return '';
    const sec = Math.max(0, Math.floor((Date.now() - t) / 1000));
    if (sec < 60) return sec + 's';
    const min = Math.floor(sec / 60);
    if (min < 60) return min + 'm';
    return Math.floor(min / 60) + 'h';
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
            <div class="story-close-top-left" onclick="closeStoryModal()">✕</div>
            <div id="story-age" class="story-age"></div>
            <div id="story-delete-btn" class="story-delete-btn" onclick="deleteActiveStory()">Delete</div>
            <video id="story-video-player" class="story-video" playsinline controls preload="metadata"></video>
            <div id="story-reply-bar" class="story-reply-bar">
                <input id="story-reply-input" class="story-reply-input" type="text" maxlength="300" placeholder="Reply to story..." autocomplete="off">
                <button id="story-reply-send" class="story-reply-send" type="button" onclick="sendStoryReply()">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const player = document.getElementById('story-video-player');
    const fill = document.getElementById('story-progress-fill');
    const updateProgress = () => {
        if (player.duration && isFinite(player.duration)) {
            fill.style.width = ((player.currentTime / player.duration) * 100) + '%';
        }
    };
    player.addEventListener('timeupdate', updateProgress);
    player.addEventListener('ended', () => {
        fill.style.width = '100%';
        setTimeout(() => closeStoryModal(), 250);
    });
    player.addEventListener('error', () => {
        const err = player.error;
        showToast(`Story playback error (${err ? err.code : '?'}): ${err && err.message ? err.message : 'unable to play video'}`);
    });

    const replyInput = document.getElementById('story-reply-input');
    replyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendStoryReply(); }
    });

    const shiftForKeyboard = () => {
        const bar = document.getElementById('story-reply-bar');
        if (!bar || bar.style.display !== 'flex') return;
        const vv = window.visualViewport;
        const kb = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
        bar.style.bottom = kb ? (kb + 12) + 'px' : '10%';
    };
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', shiftForKeyboard);
        window.visualViewport.addEventListener('scroll', shiftForKeyboard);
    }

    _storyReady = true;
}

function showStoryInPlayer(mediaUrl, { canDelete = false, onDeleted = null, createdAt = '', ownerEmail = '' } = {}) {
    ensureStoryPlayer();
    _storyOnDeleted = onDeleted || null;
    _storyOwnerEmail = (ownerEmail || '').toLowerCase();

    const viewer = getSessionUser();
    const canReply = !canDelete && !!_storyOwnerEmail && !!(viewer && viewer.email && viewer.email.toLowerCase() !== _storyOwnerEmail);

    const delBtn = document.getElementById('story-delete-btn');
    if (delBtn) delBtn.style.display = canDelete ? 'flex' : 'none';

    const replyBar = document.getElementById('story-reply-bar');
    const replyInput = document.getElementById('story-reply-input');
    if (replyBar) replyBar.style.display = canReply ? 'flex' : 'none';
    if (replyInput) replyInput.value = '';

    const ageEl = document.getElementById('story-age');
    const age = storyAgeLabel(createdAt);
    if (ageEl) {
        ageEl.textContent = age;
        ageEl.style.display = age ? 'flex' : 'none';
    }

    const modal = document.getElementById('story-viewer-modal');
    const player = document.getElementById('story-video-player');
    const fill = document.getElementById('story-progress-fill');

    fill.style.width = '0%';
    player.src = mediaUrl;
    player.load();
    modal.classList.add('open');
    player.play().catch((err) => {
        showToast(`Story play issue: ${err && err.message ? err.message : 'tap video to play'}`);
    });
}

function openStory({ mediaUrl, canDelete = false, onDeleted = null, createdAt = '', ownerEmail = '' } = {}) {
    return showStoryInPlayer(mediaUrl, { canDelete, onDeleted, createdAt, ownerEmail });
}

async function sendStoryReply() {
    if (_storyReplySending) return;
    const viewer = getSessionUser();
    if (!viewer) { promptSignup('reply to stories'); return; }

    const input = document.getElementById('story-reply-input');
    const btn = document.getElementById('story-reply-send');
    const content = (input ? input.value : '').trim();
    if (!content || !_storyOwnerEmail) return;

    _storyReplySending = true;
    if (btn) btn.disabled = true;
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stories/reply`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ ownerEmail: _storyOwnerEmail, content })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not send reply');
        if (input) input.value = '';
        showToast('Reply sent');
    } catch (err) {
        showToast(err.message);
    } finally {
        _storyReplySending = false;
        if (btn) btn.disabled = false;
    }
}

async function viewUserStory(email, createdAt = '') {
    if (!email) return;
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stories/get?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        let data = null;
        try { data = await res.json(); } catch (e) { data = null; }

        if (!res.ok) {
            showToast((data && data.error) ? data.error : `Story failed to load (${res.status})`);
            return;
        }

        const storyObj = data && (data.story || (Array.isArray(data.stories) && data.stories[0]));
        if (!storyObj || !storyObj.media_url) {
            showToast("Story expired or unavailable");
            return;
        }

        const viewer = getSessionUser();
        const isOwn = !!(viewer && viewer.email && viewer.email.toLowerCase() === email.trim().toLowerCase());
        showStoryInPlayer(storyObj.media_url, {
            canDelete: isOwn,
            createdAt: createdAt || storyObj.created_at || '',
            ownerEmail: email.trim().toLowerCase()
        });
    } catch (err) {
        showToast(`Story failed to load: ${err && err.message ? err.message : 'network error'}`);
    }
}

function closeStoryModal() {
    if (!_storyReady) return;
    const modal = document.getElementById('story-viewer-modal');
    const player = document.getElementById('story-video-player');
    const bar = document.getElementById('story-reply-bar');
    if (document.activeElement === document.getElementById('story-reply-input')) {
        document.activeElement.blur();
    }
    if (bar) bar.style.bottom = '10%';
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.classList.remove('open');
}

function deleteActiveStory() {
    showConfirmDialog("Delete Story", "Delete your active story?", "Delete", async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/stories/delete`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete story');
            closeStoryModal();
            showToast("Story deleted");
            if (typeof _storyOnDeleted === 'function') _storyOnDeleted();
        } catch (err) {
            showToast(err.message);
        }
    });
}

window.openStory = openStory;
window.showStoryInPlayer = showStoryInPlayer;
window.viewUserStory = viewUserStory;
window.closeStoryModal = closeStoryModal;
window.deleteActiveStory = deleteActiveStory;
window.sendStoryReply = sendStoryReply;
