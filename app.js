const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// Verified Badge SVG HTML helpers
const VERIFIED_BADGE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-left:3px;color:#3b82f6;" title="Verified Account"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

const STAR_VERIFIED_BADGE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" style="display:inline-block;vertical-align:-1px;margin-left:3px;" title="Special Verified Account"><defs><linearGradient id="nvPinkStarGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff6ec4"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#nvPinkStarGrad)"/><polygon points="12 5.8 13.95 9.75 18.3 10.38 15.15 13.45 15.89 17.78 12 15.73 8.11 17.78 8.85 13.45 5.7 10.38 10.05 9.75 12 5.8" fill="#ffffff"/></svg>`;

// Accepts 0 (none), 1 / true / "1" (regular), 2 / "2" (gradient pink star)
function renderVerifiedBadge(isVerified) {
    if (isVerified === 2 || Number(isVerified) === 2) {
        return STAR_VERIFIED_BADGE_SVG;
    }
    if (isVerified === true || Number(isVerified) === 1) {
        return VERIFIED_BADGE_SVG;
    }
    return '';
}

function getDisplayName(entity, fallback = '') {
    if (!entity) return fallback || '';
    if (typeof entity === 'string') return entity.trim() || fallback || '';
    const dn = String(entity.display_name ?? entity.displayName ?? '').trim();
    if (dn) return dn;
    const uname = String(entity.username || '').trim();
    if (uname) return uname;
    return fallback || String(entity.email || '').trim();
}

window.getDisplayName = getDisplayName;

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

/* Custom Post Video Player */
.nv-video-wrap {
    position: relative;
    width: 100%;
    max-height: 440px;
    background: #000;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
}
html.dark .nv-video-wrap { border-color: #333; }
.nv-video-el {
    width: 100%;
    max-height: 440px;
    display: block;
    object-fit: contain;
    background: #000;
    cursor: pointer;
}
.nv-video-center-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.58);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 4;
    transition: opacity 0.2s ease, transform 0.15s ease;
    padding: 0;
}
.nv-video-center-btn:active {
    transform: translate(-50%, -50%) scale(0.92);
}
.nv-video-wrap.is-playing .nv-video-center-btn {
    opacity: 0;
    pointer-events: none;
}
.nv-video-wrap.is-playing:hover .nv-video-center-btn,
.nv-video-wrap.is-playing.show-hud .nv-video-center-btn {
    opacity: 1;
    pointer-events: auto;
}
.nv-video-hud {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0));
    padding-top: 18px;
}
.nv-video-timer-row {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px 6px 10px;
    pointer-events: none;
}
.nv-video-timer {
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
    letter-spacing: 0.02em;
}
.nv-video-progress-hit {
    width: 100%;
    height: 14px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    touch-action: none;
}
.nv-video-progress-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.28);
    position: relative;
    transition: height 0.12s ease;
}
.nv-video-progress-hit:hover .nv-video-progress-track,
.nv-video-progress-hit:active .nv-video-progress-track {
    height: 6px;
}
.nv-video-progress-fill {
    height: 100%;
    width: 0%;
    background: #ffffff;
    pointer-events: none;
}

/* Comments Slide-In Page from Right */
.comments-drawer { position: fixed; top: 0; right: -100%; width: 100%; height: 100vh; height: 100dvh; max-height: 100%; background: #fff; z-index: 2100; transition: right 0.28s cubic-bezier(0.22, 1, 0.36, 1); display: flex; flex-direction: column; overflow: hidden; will-change: right; pointer-events: auto; }
.comments-drawer.open { right: 0; pointer-events: auto; }
.comments-drawer .drawer-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #e5e5e5; background: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0; position: relative; z-index: 2; }
.comments-back-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 4px; color: inherit; }
.comments-drawer .drawer-body { padding: 14px; padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px)); display: flex; flex-direction: column; flex-grow: 1; min-height: 0; max-width: 680px; width: 100%; margin: 0 auto; position: relative; z-index: 3; pointer-events: auto; }
.comments-container { flex-grow: 1; min-height: 0; overflow-y: auto; border: 1px solid #e5e5e5; padding: 14px; margin-bottom: 8px; border-radius: 8px; display: flex; flex-direction: column; gap: 14px; background: #fafafa; font-size: 15px; position: relative; z-index: 1; -webkit-overflow-scrolling: touch; }

#comment-sticker-panel { display: none; flex-direction: column; gap: 8px; padding: 10px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; margin-bottom: 8px; flex-shrink: 0; position: relative; z-index: 4; }
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
.friend-mention-box { display: none; flex-direction: column; gap: 4px; max-height: 170px; overflow-y: auto; background: #fff; border: 1px solid #d4d4d8; border-radius: 8px; padding: 6px; margin-bottom: 6px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: relative; z-index: 5; }
.friend-mention-box.open { display: flex; }
.friend-mention-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.friend-mention-item:hover, .friend-mention-item.active { background: #f4f4f5; }
.friend-mention-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd; background: #f0f0f0; flex-shrink: 0; }

/* Comment Composer Layout */
#comment-submit-form { display: flex; flex-direction: row; align-items: center; gap: 8px; flex-shrink: 0; position: relative; z-index: 6; pointer-events: auto; touch-action: manipulation; }
.composer-top-row { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; position: relative; z-index: 7; pointer-events: auto; }
.composer-user-pfp { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc; background: #f0f0f0; flex-shrink: 0; pointer-events: none; }
#comment-input { flex: 1 1 auto; min-width: 0; padding: 10px 14px; border: 1px solid #ccc; border-radius: 20px; font-size: 16px; line-height: 1.25; background: #fff; color: #111; position: relative; z-index: 8; pointer-events: auto !important; touch-action: manipulation !important; user-select: text !important; -webkit-user-select: text !important; cursor: text; }
#comment-input:focus { outline: none; border-color: #111; }
.composer-actions-row { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; }
.composer-icon-btn { background: transparent; color: #111; border: none; padding: 7px; border-radius: 50%; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; user-select: none; -webkit-user-select: none; flex-shrink: 0; }
.composer-icon-btn:hover { background: rgba(0,0,0,0.06); }
.composer-icon-btn.active { background: #111; color: #fff; }
.comment-post-btn { display: none; background: #000; color: #fff; padding: 9px 16px; border-radius: 18px; font-weight: 700; cursor: pointer; font-size: 13px; align-items: center; justify-content: center; user-select: none; -webkit-user-select: none; flex-shrink: 0; border: none; }

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

/* Stories Rainbow Ring, Plus Button & Right-Sliding Drawer */
.feed-avatar-container {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
}
.feed-avatar-container.has-story {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4, #22c55e, #facc15, #f58529);
    background-size: 240% 240%;
    animation: nvRainbowSpin 5s ease infinite;
    padding: 2.5px;
}
.feed-avatar-container.has-story .post-avatar {
    width: 100%;
    height: 100%;
    border: 2px solid #fff;
}
html.dark .feed-avatar-container.has-story .post-avatar {
    border-color: #121212;
}

.story-ring-wrapper.has-story {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4, #22c55e, #facc15, #f58529) !important;
    background-size: 240% 240% !important;
    animation: nvRainbowSpin 5s ease infinite;
    padding: 3px !important;
}
.story-ring-wrapper.has-story .profile-pfp-img {
    border: 2px solid #fff;
}
html.dark .story-ring-wrapper.has-story .profile-pfp-img {
    border-color: #181818;
}

@keyframes nvRainbowSpin {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.story-plus-btn {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    border: 2px solid #fff;
    font-size: 17px;
    font-weight: 700;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 15;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    padding: 0;
}
.story-plus-btn:active {
    transform: scale(0.92);
}
html.dark .story-plus-btn {
    background: #fff;
    color: #000;
    border-color: #181818;
}

.nv-story-drawer {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: #09090b;
    color: #fff;
    z-index: 4000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: right 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: right;
    overflow: hidden;
}
.nv-story-drawer.open {
    right: 0;
}
.nv-story-topbar {
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0));
}
.nv-story-top-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}
.nv-story-close-btn {
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.22);
    color: #fff;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}
.nv-story-author-pfp {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255,255,255,0.35);
    flex-shrink: 0;
}
.nv-story-author-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.nv-story-author-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.nv-story-time-ago {
    font-size: 11px;
    color: rgba(255,255,255,0.78);
    margin-top: 1px;
}
.nv-story-delete-btn {
    background: #ef4444;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(239,68,68,0.4);
}
.nv-story-delete-btn:active {
    transform: scale(0.95);
}
.nv-story-stage {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    z-index: 1;
}
.nv-story-media-img {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.nv-story-media-video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
    cursor: pointer;
}
.nv-story-reply-bar {
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px calc(12px + env(safe-area-inset-bottom, 0px));
    background: linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0));
}
.nv-story-reply-input {
    flex: 1;
    min-width: 0;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.28);
    background: rgba(24,24,27,0.85);
    color: #fff;
    font-size: 14px;
}
.nv-story-reply-input::placeholder {
    color: rgba(255,255,255,0.6);
}
.nv-story-reply-send {
    background: #fff;
    color: #000;
    border: none;
    border-radius: 999px;
    padding: 9px 15px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
}

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
html.dark #comment-input { background:#1c1c1c; color:#eee; border-color:#333; }
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

async function syncAndroidFcmToken(retries = 6) {
    const user = getSessionUser();
    const authToken = getSessionToken();
    if (!user || !user.email || !authToken) return;
    if (!window.AndroidBridge || typeof window.AndroidBridge.getFcmToken !== 'function') return;

    let fcmToken = '';
    try {
        fcmToken = String(window.AndroidBridge.getFcmToken() || '').trim();
    } catch (e) {}

    if (!fcmToken) {
        if (retries > 0) {
            setTimeout(() => syncAndroidFcmToken(retries - 1), 1500);
        }
        return;
    }

    const syncKey = `nvaritia_fcm_synced_${user.email.toLowerCase()}`;
    try {
        if (localStorage.getItem(syncKey) === fcmToken) return;
    } catch (e) {}

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/devices/register`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ fcmToken })
        });
        if (res.ok) {
            try { localStorage.setItem(syncKey, fcmToken); } catch (e) {}
        }
    } catch (e) {}
}

window.syncAndroidFcmToken = syncAndroidFcmToken;

function setSessionUser(user, token) {
    if (user && user.theme) applyTheme(user.theme);
    localStorage.setItem('Nvaritia_session', JSON.stringify(user));
    if (token) setSessionToken(token);
    syncAndroidFcmToken();
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
        if (allowGuest) return { email: '', username: '', display_name: '', guest: true };
        if (!onIndex) {
            try { sessionStorage.setItem('Nvaritia_notice', 'Please sign up or log in to continue.'); } catch (e) {}
            window.location.href = 'index.html';
        }
        return null;
    }
    if (user.theme) applyTheme(user.theme);
    syncAndroidFcmToken();
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
        return { postId: match[1], authorUsername: "", authorDisplayName: "", content: "", mediaUrl: "" };
    }

    return null;
}

function formatInboxPreviewText(rawContent) {
    const shared = parseSharedPostContent(rawContent);
    if (!shared) return rawContent || "";
    const authorLabel = shared.authorDisplayName || (shared.authorUsername ? `@${shared.authorUsername}` : "");
    return authorLabel
        ? `Shared ${authorLabel}'s post`
        : "Shared a post";
}

function renderSharedPostBubbleHtml(shared, isSent) {
    const postId = encodeURIComponent(shared.postId);
    const targetUrl = `feed.html?post=${postId}`;
    const authorLabel = shared.authorDisplayName
        ? escapeHtml(shared.authorDisplayName)
        : (shared.authorUsername ? `@${escapeHtml(shared.authorUsername)}` : "Post on Nvaritia");
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
        ? friends.filter(f =>
            getDisplayName(f).toLowerCase().includes(filterText) ||
            (f.username || "").toLowerCase().includes(filterText) ||
            (f.email || "").toLowerCase().includes(filterText)
        )
        : friends;

    if (!filtered.length) {
        listEl.innerHTML = `<p style="color:#666; text-align:center; padding:12px;">${friends.length ? "No matching friends." : "No friends yet. Add friends from their profile to share posts."}</p>`;
        return;
    }

    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";
    listEl.innerHTML = '';

    for (const friend of filtered) {
        const friendLabel = getDisplayName(friend, friend.email);
        const row = document.createElement('div');
        row.className = 'share-friend-row';
        row.innerHTML = `
            <div class="share-friend-meta">
                <img class="share-friend-avatar" src="${friend.pfp_url || defaultAvatar}" alt="">
                <span class="share-friend-name">${escapeHtml(friendLabel)}${renderVerifiedBadge(friend.verified)}</span>
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
                        authorDisplayName: _shareTargetPost.display_name || "",
                        snippet: _shareTargetPost.content || "",
                        mediaUrl: _shareTargetPost.media_url || ""
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Could not share post");
                btn.innerText = "Sent ✓";
                showToast(`Shared with ${friendLabel}`);
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

    const postMeta = _sharedPostCache.get(postId) || { id: postId, username: "", display_name: "", content: "", media_url: "" };
    _shareTargetPost = postMeta;

    const modal = ensureShareFriendsModal();
    const summaryEl = document.getElementById('share-post-summary');
    const searchEl = document.getElementById('share-friend-search');
    const listEl = document.getElementById('share-friends-list');

    const authorLabel = getDisplayName(postMeta);
    summaryEl.innerHTML = authorLabel
        ? `<strong>${escapeHtml(authorLabel)}</strong>${postMeta.content ? `: ${escapeHtml(postMeta.content)}` : " (Media post)"}`
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

const NV_PLAY_SVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff" stroke="none" style="margin-left:2px;"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>`;
const NV_PAUSE_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`;

function isVideoMediaUrl(url) {
    if (!url || typeof url !== "string") return false;
    const clean = url.split("?")[0].split("#")[0].toLowerCase();
    return /\.(mp4|webm|mov|m4v|ogg)$/i.test(clean);
}

function formatVideoTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const total = Math.floor(sec);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function renderPostMediaHtml(mediaUrl) {
    if (!mediaUrl) return "";
    if (isVideoMediaUrl(mediaUrl)) {
        return `
            <div class="nv-video-wrap" onclick="event.stopPropagation()">
                <video class="nv-video-el" src="${escapeHtml(mediaUrl)}" playsinline preload="metadata"></video>
                <button type="button" class="nv-video-center-btn" aria-label="Play video">${NV_PLAY_SVG}</button>
                <div class="nv-video-hud">
                    <div class="nv-video-timer-row">
                        <span class="nv-video-timer">0:00 / 0:00</span>
                    </div>
                    <div class="nv-video-progress-hit" role="slider" aria-label="Seek video">
                        <div class="nv-video-progress-track">
                            <div class="nv-video-progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    return `<img class="post-media" src="${escapeHtml(mediaUrl)}" loading="lazy" alt="Post media">`;
}

function bindCustomVideoPlayers(rootEl = document) {
    rootEl.querySelectorAll(".nv-video-wrap").forEach(wrap => {
        if (wrap.dataset.playerBound === "1") return;
        wrap.dataset.playerBound = "1";

        const video = wrap.querySelector(".nv-video-el");
        const btn = wrap.querySelector(".nv-video-center-btn");
        const timerEl = wrap.querySelector(".nv-video-timer");
        const hitEl = wrap.querySelector(".nv-video-progress-hit");
        const fillEl = wrap.querySelector(".nv-video-progress-fill");
        let hudTimer = null;

        const flashHud = () => {
            wrap.classList.add("show-hud");
            clearTimeout(hudTimer);
            hudTimer = setTimeout(() => wrap.classList.remove("show-hud"), 1800);
        };

        const syncUi = () => {
            const cur = video.currentTime || 0;
            const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
            timerEl.textContent = `${formatVideoTime(cur)} / ${formatVideoTime(dur)}`;
            fillEl.style.width = dur > 0 ? `${Math.min(100, (cur / dur) * 100)}%` : "0%";
        };

        const togglePlay = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (video.paused || video.ended) {
                document.querySelectorAll(".nv-video-el").forEach(other => {
                    if (other !== video && !other.paused) other.pause();
                });
                video.play().catch(() => {});
                flashHud();
            } else {
                video.pause();
            }
        };

        btn.addEventListener("click", togglePlay);
        video.addEventListener("click", togglePlay);

        video.addEventListener("play", () => {
            wrap.classList.add("is-playing");
            btn.innerHTML = NV_PAUSE_SVG;
            btn.setAttribute("aria-label", "Pause video");
            flashHud();
        });

        video.addEventListener("pause", () => {
            wrap.classList.remove("is-playing", "show-hud");
            btn.innerHTML = NV_PLAY_SVG;
            btn.setAttribute("aria-label", "Play video");
        });

        video.addEventListener("ended", () => {
            wrap.classList.remove("is-playing", "show-hud");
            btn.innerHTML = NV_PLAY_SVG;
            fillEl.style.width = "100%";
        });

        video.addEventListener("loadedmetadata", syncUi);
        video.addEventListener("durationchange", syncUi);
        video.addEventListener("timeupdate", syncUi);

        const scrubTo = (clientX) => {
            if (!isFinite(video.duration) || video.duration <= 0) return;
            const rect = hitEl.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            video.currentTime = ratio * video.duration;
            syncUi();
            flashHud();
        };

        let scrubbing = false;
        hitEl.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            scrubbing = true;
            try { hitEl.setPointerCapture(e.pointerId); } catch (err) {}
            scrubTo(e.clientX);
        });
        hitEl.addEventListener("pointermove", (e) => {
            if (!scrubbing) return;
            scrubTo(e.clientX);
        });
        const stopScrub = () => { scrubbing = false; };
        hitEl.addEventListener("pointerup", stopScrub);
        hitEl.addEventListener("pointercancel", stopScrub);
    });
}

window.bindCustomVideoPlayers = bindCustomVideoPlayers;

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

function blockAuthorFromFeed(authorEmail, authorDisplayName, authorUsername) {
    blockUser(authorEmail, authorDisplayName || authorUsername, () => {
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
        const authorDisplayName = getDisplayName(post, getDisplayName(fallbackAuthor, authorUsername || authorEmail));
        const authorPfp = post.pfp_url || (fallbackAuthor && fallbackAuthor.pfp_url) || defaultAvatar;
        const authorVerified = post.verified !== undefined ? post.verified : (fallbackAuthor && fallbackAuthor.verified);
        const initialCommentsCount = post.comments_count ?? post.comment_count ?? post.commentsCount ?? 0;

        _sharedPostCache.set(post.id, {
            id: post.id,
            user_email: authorEmail,
            username: authorUsername,
            display_name: authorDisplayName,
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
                <div class="safety-btn" onclick="blockAuthorFromFeed('${escapeHtml(authorEmail)}', '${escapeHtml(authorDisplayName)}', '${escapeHtml(authorUsername)}')">Block</div>
               </div>`;

        const profileUrl = `profile.html?user=${encodeURIComponent(authorUsername || authorEmail)}`;
        const hasStory = Boolean(post.has_story || (fallbackAuthor && fallbackAuthor.has_story));
        const hasStoryClass = hasStory ? 'has-story' : '';
        const avatarClickAttr = hasStory && typeof viewUserStory === 'function'
            ? `onclick="event.stopPropagation(); viewUserStory('${escapeHtml(authorEmail)}', '${escapeHtml(post.story_created_at || '')}', { username: '${escapeHtml(authorUsername)}', display_name: '${escapeHtml(authorDisplayName)}', pfp_url: '${escapeHtml(authorPfp)}' })"`
            : `onclick="goToProfile('${profileUrl}', event)"`;

        const authorRowHtml = `
            <div class="post-header-line">
                <div class="feed-avatar-container ${hasStoryClass}" ${avatarClickAttr} title="${hasStory ? 'View Story' : 'View Profile'}">
                    <img class="post-avatar" src="${authorPfp}">
                </div>
                <div style="flex-grow: 1;">
                    <a href="${profileUrl}" class="post-meta" onclick="goToProfile('${profileUrl}', event)">${escapeHtml(authorDisplayName)}</a>${renderVerifiedBadge(authorVerified)}
                    <br><span class="post-timestamp">${new Date(post.created_at).toLocaleString()}</span>
                </div>
                ${ownerOrSafetyControls}
            </div>
        `;

        const mediaHtml = renderPostMediaHtml(post.media_url);

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

    bindCustomVideoPlayers(container);

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
let _replyingToCommentName = null;
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
let _lastDrawerHeight = 0;
let _lastDrawerTop = 0;

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
    const isFocused = !!(input && document.activeElement === input);
    _composerTypingMode = Boolean(active || isFocused || hasText || hasMention);
    form.classList.toggle('composer-typing', _composerTypingMode);
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
        const dname = getDisplayName(f).toLowerCase();
        return uname.startsWith(q) || uname.includes(q) || dname.includes(q);
    });

    if (_mentionSelectedIdx >= _mentionMatches.length) _mentionSelectedIdx = 0;

    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

    if (!_mentionMatches.length) {
        box.innerHTML = `<div style="padding:8px 10px; font-size:12px; color:#666;">${friends.length ? "Only friends can be tagged (no matching friend)." : "You have no friends to tag yet."}</div>`;
        box.classList.add('open');
        return;
    }

    box.innerHTML = _mentionMatches.map((f, idx) => `
        <div class="friend-mention-item ${idx === _mentionSelectedIdx ? 'active' : ''}" onmousedown="event.preventDefault()" onclick="selectFriendMention(${idx})">
            <img class="friend-mention-avatar" src="${f.pfp_url || defaultAvatar}" alt="">
            <span>${escapeHtml(getDisplayName(f, f.username))} <span style="opacity:0.65;font-size:11px;">@${escapeHtml(f.username)}</span>${renderVerifiedBadge(f.verified)}</span>
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
        focusCommentInput(nextPos);
    } else {
        input.value = `${val}${val && !val.endsWith(' ') ? ' ' : ''}@${friend.username} `;
        focusCommentInput();
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
        focusCommentInput(nextPos);
    } else {
        focusCommentInput();
    }

    await ensureFriendsLoaded(false);
    await updateFriendMentionStateFromInput();
}

function focusCommentInput(caretPos = null) {
    const input = document.getElementById('comment-input');
    if (!input) return;
    input.disabled = false;
    input.readOnly = false;
    input.style.pointerEvents = 'auto';
    if (document.activeElement !== input) {
        input.focus({ preventScroll: true });
    }
    if (typeof caretPos === 'number') {
        try { input.setSelectionRange(caretPos, caretPos); } catch (e) {}
    }
}

function syncCommentsDrawerViewport() {
    const drawer = document.getElementById('comments-drawer');
    if (!drawer || !drawer.classList.contains('open')) return;

    let targetHeight = window.innerHeight;
    let targetTop = 0;

    if (window.visualViewport) {
        targetHeight = Math.round(window.visualViewport.height);
        targetTop = Math.round(window.visualViewport.offsetTop);
    }

    if (targetHeight !== _lastDrawerHeight || targetTop !== _lastDrawerTop) {
        _lastDrawerHeight = targetHeight;
        _lastDrawerTop = targetTop;
        drawer.style.height = `${targetHeight}px`;
        drawer.style.top = `${targetTop}px`;
    }
}

function resetCommentsDrawerViewport() {
    _lastDrawerHeight = 0;
    _lastDrawerTop = 0;
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
        const existingInput = document.getElementById('comment-input');
        if (existingInput) {
            existingInput.disabled = false;
            existingInput.readOnly = false;
            existingInput.setAttribute('inputmode', 'text');
            existingInput.style.pointerEvents = 'auto';
        }
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
                    <input type="text" id="comment-input" inputmode="text" enterkeyhint="send" placeholder="Write a comment..." autocomplete="off" autocorrect="on" autocapitalize="sentences">
                </div>
                <div class="composer-bottom-bar">
                    <div class="composer-actions-row">
                        <button type="button" class="composer-icon-btn" id="comment-image-btn" title="Upload image" aria-label="Upload image" onmousedown="event.preventDefault()" onclick="triggerCommentImagePick()">${COMPOSER_IMAGE_SVG}</button>
                        <button type="button" class="composer-icon-btn" id="comment-tag-btn" title="Tag a friend" aria-label="Tag a friend" onmousedown="event.preventDefault()" onclick="triggerFriendTagMode()">${COMPOSER_AT_SVG}</button>
                        <button type="button" class="composer-icon-btn" id="comment-sticker-toggle-btn" title="Stickers" aria-label="Stickers" onmousedown="event.preventDefault()" onclick="toggleStickerPicker()">${COMPOSER_STICKER_SVG}</button>
                    </div>
                    <button type="submit" class="comment-post-btn" id="comment-post-submit-btn" onmousedown="event.preventDefault()">Send</button>
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
        input.disabled = false;
        input.readOnly = false;
        const stickerPanel = document.getElementById('comment-sticker-panel');
        if (stickerPanel && stickerPanel.classList.contains('open')) {
            stickerPanel.classList.remove('open');
            const stickerBtn = document.getElementById('comment-sticker-toggle-btn');
            if (stickerBtn) stickerBtn.classList.remove('active');
        }
        setComposerTypingMode(true);
        if (!Array.isArray(_friendsCache)) {
            ensureFriendsLoaded(false);
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            const activeEl = document.activeElement;
            const formEl = document.getElementById('comment-submit-form');
            const mentionBox = document.getElementById('friend-mention-box');
            const stickerPanel = document.getElementById('comment-sticker-panel');
            const keepingComposerOpen =
                (formEl && activeEl && formEl.contains(activeEl)) ||
                (mentionBox && activeEl && mentionBox.contains(activeEl)) ||
                (stickerPanel && activeEl && stickerPanel.contains(activeEl));
            if (!keepingComposerOpen) {
                setComposerTypingMode(false);
            }
        }, 50);
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

    document.addEventListener('pointerdown', (e) => {
        const drawerEl = document.getElementById('comments-drawer');
        if (!drawerEl || !drawerEl.classList.contains('open')) return;
        const inputEl = document.getElementById('comment-input');
        if (inputEl && (e.target === inputEl || inputEl.contains(e.target))) return;

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
            if (inputEl && document.activeElement === inputEl) {
                inputEl.blur();
            }
            setComposerTypingMode(false);
        }
    });

    if (!_commentsViewportBound) {
        _commentsViewportBound = true;
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', syncCommentsDrawerViewport, { passive: true });
            window.visualViewport.addEventListener('scroll', syncCommentsDrawerViewport, { passive: true });
        }
        window.addEventListener('resize', syncCommentsDrawerViewport, { passive: true });
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

    const input = document.getElementById('comment-input');
    if (input) {
        input.disabled = false;
        input.readOnly = false;
        input.style.pointerEvents = 'auto';
    }

    syncCommentsDrawerViewport();
    requestAnimationFrame(() => {
        drawer.classList.add('open');
        syncCommentsDrawerViewport();
    });

    loadComments();
    loadSharedStickers();
}

function closeCommentsDrawer() {
    const input = document.getElementById('comment-input');
    if (input && document.activeElement === input) {
        input.blur();
    }
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
            const authorName = getDisplayName(c, c.username || c.user_email);
            const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

            return `
                <div class="comment-item ${isReply ? 'reply' : ''}" id="comment-${c.id}">
                    <a href="${profileUrl}" class="comment-avatar-link" onclick="goToProfile('${profileUrl}', event)">
                        <img class="comment-avatar" src="${c.pfp_url || defaultAvatar}" alt="">
                    </a>
                    <div class="comment-main-col">
                        <div class="comment-header-row">
                            <a href="${profileUrl}" class="comment-author-link" onclick="goToProfile('${profileUrl}', event)">${escapeHtml(authorName)}</a>${renderVerifiedBadge(c.verified)}
                        </div>
                        ${renderCommentBodyHtml(c.content)}
                        <div class="comment-actions">
                            <span class="comment-reaction-btn ${c.userReaction === 'like' ? 'active-like' : ''}" onclick="reactToComment('${c.id}', 'like', this)">
                                ${COMMENT_LIKE_SVG} <span class="c-likes">${c.likes || 0}</span>
                            </span>
                            <span class="comment-reaction-btn ${c.userReaction === 'dislike' ? 'active-dislike' : ''}" onclick="reactToComment('${c.id}', 'dislike', this)">
                                ${COMMENT_DISLIKE_SVG} <span class="c-dislikes">${c.dislikes || 0}</span>
                            </span>
                            <span style="cursor: pointer;" onclick="startReply('${c.id}', '${escapeHtml(authorName)}')">Reply</span>
                            ${isMe ? `<span class="comment-delete-btn" onclick="deleteComment('${c.id}')">Delete</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        listEl.innerHTML = '';
        for (const root of rootComments) {
            listEl.innerHTML += renderCommentNode(root, false);
            for (const reply of root.replies) {
                listEl.innerHTML += renderCommentNode(reply, true);
            }
        }
        syncStickerSaveIndicators();
    } catch (err) {
        listEl.innerHTML = `<p style="color:#ef4444; text-align:center;">Error: ${escapeHtml(err.message)}</p>`;
    }
}

function startReply(commentId, displayName) {
    _replyingToCommentId = commentId;
    _replyingToCommentName = displayName;
    const banner = document.getElementById('replying-banner');
    const txt = document.getElementById('replying-to-text');
    if (banner && txt) {
        txt.innerText = `Replying to ${displayName}`;
        banner.style.display = 'flex';
    }
    setComposerTypingMode(true);
    focusCommentInput();
}

function cancelReply() {
    _replyingToCommentId = null;
    _replyingToCommentName = null;
    const banner = document.getElementById('replying-banner');
    if (banner) banner.style.display = 'none';
}

async function reactToComment(commentId, reactionType, btnEl) {
    const user = getSessionUser();
    if (!user) return promptSignup('react to comments');

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/comments/react`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ commentId, reaction: reactionType })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const parent = btnEl.parentElement;
        const likeBtn = parent.children[0];
        const dislikeBtn = parent.children[1];

        likeBtn.querySelector('.c-likes').innerText = data.likes;
        dislikeBtn.querySelector('.c-dislikes').innerText = data.dislikes;

        likeBtn.className = `comment-reaction-btn ${data.userReaction === 'like' ? 'active-like' : ''}`;
        dislikeBtn.className = `comment-reaction-btn ${data.userReaction === 'dislike' ? 'active-dislike' : ''}`;
    } catch (err) {
        showToast(err.message);
    }
}

async function postCommentPayload(contentText) {
    const user = getSessionUser();
    if (!user) {
        promptSignup('comment on posts');
        return false;
    }
    if (!_activeCommentsPostId) return false;

    const mentionCheck = validateFriendMentions(contentText);
    if (!mentionCheck.ok) {
        showToast(`You can only tag friends (@${mentionCheck.invalidUsernames.join(', @')})`);
        return false;
    }

    const res = await fetch(`${WORKER_ORIGIN}/api/comments/add`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            postId: _activeCommentsPostId,
            content: contentText,
            parentId: _replyingToCommentId
        })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add comment');

    cancelReply();
    closeFriendMentionDropdown();
    toggleStickerPicker(false);
    await loadComments();
    return true;
}

async function sendStickerComment(sticker) {
    const user = getSessionUser();
    if (!user) return promptSignup('post stickers');
    if (!_activeCommentsPostId) return;

    try {
        recordStickerUsage(sticker);
        await postCommentPayload(`${STICKER_PREFIX}${sticker}`);
    } catch (err) {
        showToast(err.message);
    }
}

async function submitComment(e) {
    e.preventDefault();
    const user = getSessionUser();
    if (!user) return promptSignup('comment on posts');

    const input = document.getElementById('comment-input');
    const content = input ? input.value.trim() : '';
    if (!content || !_activeCommentsPostId) return;

    const submitBtn = document.getElementById('comment-post-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    try {
        const posted = await postCommentPayload(content);
        if (posted && input) {
            input.value = '';
            setComposerTypingMode(false);
        }
    } catch (err) {
        showToast(err.message);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

window.openCommentsDrawer = openCommentsDrawer;
window.closeCommentsDrawer = closeCommentsDrawer;
window.startReply = startReply;
window.cancelReply = cancelReply;
window.reactToComment = reactToComment;
window.deleteComment = deleteComment;
window.submitComment = submitComment;
window.sendStickerComment = sendStickerComment;
window.sendImageStickerUrl = sendImageStickerUrl;
window.toggleStickerPicker = toggleStickerPicker;
window.triggerStickerImagePick = triggerStickerImagePick;
window.handleStickerImageSelected = handleStickerImageSelected;
window.triggerCommentImagePick = triggerCommentImagePick;
window.handleCommentImageSelected = handleCommentImageSelected;
window.triggerFriendTagMode = triggerFriendTagMode;
window.selectFriendMention = selectFriendMention;
window.setStickerTab = setStickerTab;
window.toggleBrowseAllUploadedStickers = toggleBrowseAllUploadedStickers;
window.toggleSaveSticker = toggleSaveSticker;

// ===== REPORT & BLOCK MODALS =====
const REPORT_REASONS = [
    "Spam or unwanted solicitation",
    "Harassment or bullying",
    "Hate speech or discriminatory content",
    "Sexual content or nudity",
    "Violence or dangerous activity",
    "Copyright or intellectual property violation",
    "Misinformation or scam"
];

let _reportTargetPostId = null;

function ensureReportModal() {
    let overlay = document.getElementById('report-modal-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'report-modal-overlay';
    overlay.className = 'ugc-overlay';

    const optionsHtml = REPORT_REASONS.map((reason, idx) => `
        <label class="report-option">
            <input type="radio" name="reportReason" value="${escapeHtml(reason)}" ${idx === 0 ? 'checked' : ''}>
            <span>${escapeHtml(reason)}</span>
        </label>
    `).join('');

    overlay.innerHTML = `
        <div class="ugc-dialog-box">
            <div class="ugc-dialog-head">
                <span>Report Post</span>
                <span style="cursor:pointer;" id="report-close-btn">✕</span>
            </div>
            <div class="ugc-dialog-body">
                <p style="color:#666; margin-bottom:2px;">Why are you reporting this post?</p>
                ${optionsHtml}
                <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-end;">
                    <div id="report-cancel-btn" class="ugc-btn ugc-btn-cancel">Cancel</div>
                    <div id="report-submit-btn" class="ugc-btn ugc-btn-danger">Submit Report</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeModal = () => { overlay.style.display = 'none'; _reportTargetPostId = null; };
    document.getElementById('report-close-btn').addEventListener('click', closeModal);
    document.getElementById('report-cancel-btn').addEventListener('click', closeModal);

    document.getElementById('report-submit-btn').addEventListener('click', async () => {
        if (!_reportTargetPostId) return;
        const selected = overlay.querySelector('input[name="reportReason"]:checked');
        const reason = selected ? selected.value : REPORT_REASONS[0];
        const postId = _reportTargetPostId;
        closeModal();
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/reports/create`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ postId, reason })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to report');
            showToast(data.message || 'Report submitted.');
        } catch (err) {
            showToast(err.message);
        }
    });

    return overlay;
}

function reportPost(postId) {
    const user = getSessionUser();
    if (!user) return promptSignup('report posts');
    _reportTargetPostId = postId;
    ensureReportModal().style.display = 'flex';
}

function blockUser(blockedEmail, blockedLabelName, onSuccessCallback) {
    const user = getSessionUser();
    if (!user) return promptSignup('block users');

    const label = blockedLabelName || blockedEmail;
    showConfirmDialog(
        `Block ${label}?`,
        `You will no longer see posts or messages from ${label}.`,
        "Block User",
        async () => {
            try {
                const res = await fetch(`${WORKER_ORIGIN}/api/users/block`, {
                    method: 'POST',
                    headers: authHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ blockedEmail })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to block user');
                showToast(`${label} has been blocked.`);
                if (typeof onSuccessCallback === 'function') onSuccessCallback();
            } catch (err) {
                showToast(err.message);
            }
        }
    );
}

// ===== CLIENT-SIDE IMAGE & VIDEO COMPRESSION ENGINE =====
function compressImage(file, maxDimension = 1280, quality = 0.8) {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith('image/')) return resolve(file);
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width <= maxDimension && height <= maxDimension && file.size < 450 * 1024) return resolve(file);
            if (width > height) {
                if (width > maxDimension) { height = Math.round((height * maxDimension) / width); width = maxDimension; }
            } else {
                if (height > maxDimension) { width = Math.round((width * maxDimension) / height); height = maxDimension; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (!blob || blob.size >= file.size) return resolve(file);
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
            }, "image/jpeg", quality);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
    });
}

async function compressVideo(file) {
    return file;
}

// ===== STORIES VIEWER, POSTING & RELATIVE TIME =====
function parseUtcTimestamp(input) {
    if (!input) return NaN;
    if (typeof input === 'number') {
        return input < 1e12 ? input * 1000 : input;
    }
    let s = String(input).trim();
    if (!s) return NaN;
    if (/^\d+$/.test(s)) {
        const num = Number(s);
        return num < 1e12 ? num * 1000 : num;
    }
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) {
        s = s.replace(' ', 'T') + 'Z';
    }
    return new Date(s).getTime();
}

function formatTimeAgo(isoOrDate) {
    const ts = parseUtcTimestamp(isoOrDate);
    if (isNaN(ts)) return 'just now';
    const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diffSec < 60) return diffSec <= 5 ? 'just now' : `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? 'hr' : 'hrs'} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
}

let _activeStoryOwnerEmail = null;

function ensureStoryDrawer() {
    let drawer = document.getElementById('nv-story-drawer');
    if (drawer) return drawer;

    drawer = document.createElement('div');
    drawer.id = 'nv-story-drawer';
    drawer.className = 'nv-story-drawer';
    drawer.innerHTML = `
        <div class="nv-story-stage" id="nv-story-stage"></div>
        <div class="nv-story-topbar">
            <div class="nv-story-top-left">
                <button type="button" class="nv-story-close-btn" id="nv-story-close-btn" aria-label="Close story">✕</button>
                <img id="nv-story-author-pfp" class="nv-story-author-pfp" src="" alt="">
                <div class="nv-story-author-meta">
                    <span id="nv-story-author-name" class="nv-story-author-name"></span>
                    <span id="nv-story-time-ago" class="nv-story-time-ago"></span>
                </div>
            </div>
            <button type="button" class="nv-story-delete-btn" id="nv-story-delete-btn" style="display:none;">Delete</button>
        </div>
        <div class="nv-story-reply-bar" id="nv-story-reply-bar">
            <input type="text" id="nv-story-reply-input" class="nv-story-reply-input" maxlength="300" placeholder="Reply to story...">
            <button type="button" id="nv-story-reply-send" class="nv-story-reply-send">Send</button>
        </div>
    `;
    document.body.appendChild(drawer);

    document.getElementById('nv-story-close-btn').addEventListener('click', closeStoryDrawer);
    document.getElementById('nv-story-delete-btn').addEventListener('click', deleteActiveStory);
    document.getElementById('nv-story-reply-send').addEventListener('click', sendStoryReply);
    document.getElementById('nv-story-reply-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendStoryReply();
        }
    });

    return drawer;
}

function closeStoryDrawer() {
    const drawer = document.getElementById('nv-story-drawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    const stage = document.getElementById('nv-story-stage');
    if (stage) {
        const vid = stage.querySelector('video');
        if (vid) vid.pause();
        setTimeout(() => {
            if (!drawer.classList.contains('open')) stage.innerHTML = '';
        }, 280);
    }
    _activeStoryOwnerEmail = null;
}

async function deleteActiveStory() {
    if (!_activeStoryOwnerEmail) return;
    showConfirmDialog("Delete Story", "Delete your active story?", "Delete", async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/stories/delete`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete story');
            closeStoryDrawer();
            showToast("Story deleted");
            if (typeof loadProfilePage === 'function') await loadProfilePage();
        } catch (err) {
            showToast(err.message);
        }
    });
}

async function sendStoryReply() {
    const user = getSessionUser();
    if (!user) return promptSignup('reply to stories');
    const input = document.getElementById('nv-story-reply-input');
    const text = input ? input.value.trim() : '';
    if (!text || !_activeStoryOwnerEmail) return;

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stories/reply`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ ownerEmail: _activeStoryOwnerEmail, content: text })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not send reply');
        input.value = '';
        showToast("Reply sent");
    } catch (err) {
        showToast(err.message);
    }
}

async function viewUserStory(ownerEmail, fallbackCreatedAt = '', authorMeta = null) {
    if (!ownerEmail) return;
    const drawer = ensureStoryDrawer();
    const stage = document.getElementById('nv-story-stage');
    const nameEl = document.getElementById('nv-story-author-name');
    const timeEl = document.getElementById('nv-story-time-ago');
    const pfpEl = document.getElementById('nv-story-author-pfp');
    const delBtn = document.getElementById('nv-story-delete-btn');
    const replyBar = document.getElementById('nv-story-reply-bar');

    const session = getSessionUser();
    const isOwner = !!(session && session.email && session.email.toLowerCase() === ownerEmail.toLowerCase());
    _activeStoryOwnerEmail = ownerEmail.toLowerCase();

    const defaultPfp = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34'><rect width='100%' height='100%' fill='%23333'/></svg>";
    nameEl.innerText = authorMeta ? getDisplayName(authorMeta, ownerEmail) : ownerEmail;
    pfpEl.src = (authorMeta && authorMeta.pfp_url) || defaultPfp;
    timeEl.innerText = formatTimeAgo(fallbackCreatedAt);
    delBtn.style.display = isOwner ? 'inline-flex' : 'none';
    replyBar.style.display = isOwner ? 'none' : 'flex';
    stage.innerHTML = '<div style="color:#aaa;font-size:13px;">Loading story...</div>';

    requestAnimationFrame(() => drawer.classList.add('open'));

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stories/get?email=${encodeURIComponent(ownerEmail.toLowerCase())}`);
        const data = await res.json();
        const story = data && data.story;
        if (!res.ok || !story || !story.media_url) {
            throw new Error(data.error || 'Story expired or not found');
        }

        timeEl.innerText = formatTimeAgo(story.created_at || fallbackCreatedAt);
        if (isVideoMediaUrl(story.media_url)) {
            stage.innerHTML = `<video class="nv-story-media-video" src="${escapeHtml(story.media_url)}" autoplay playsinline loop></video>`;
            const vid = stage.querySelector('video');
            if (vid) {
                vid.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (vid.paused) {
                        vid.play().catch(() => {});
                    } else {
                        vid.pause();
                    }
                });
            }
        } else {
            stage.innerHTML = `<img class="nv-story-media-img" src="${escapeHtml(story.media_url)}" alt="Story">`;
        }
    } catch (err) {
        showToast(err.message || 'Could not load story');
        closeStoryDrawer();
    }
}

async function uploadStoryFile(file) {
    const user = getSessionUser();
    if (!user) return promptSignup('post stories');
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    const isImg = file.type.startsWith('image/');
    if (!isVid && !isImg) {
        showToast("Please choose a video or image for your story.");
        return;
    }

    showToast("Uploading story...");
    try {
        const prepared = isImg ? await compressImage(file, 1080, 0.85) : await compressVideo(file);
        const fd = new FormData();
        fd.append('media', prepared);

        const res = await fetch(`${WORKER_ORIGIN}/api/stories/create`, {
            method: 'POST',
            headers: authHeaders(),
            body: fd
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to post story');

        showToast("Story posted!");
        if (typeof loadProfilePage === 'function') {
            await loadProfilePage();
        }
    } catch (err) {
        showToast(err.message);
    }
}

window.viewUserStory = viewUserStory;
window.closeStoryDrawer = closeStoryDrawer;
window.uploadStoryFile = uploadStoryFile;
window.formatTimeAgo = formatTimeAgo;
