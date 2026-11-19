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

/* Comments Slide-In Page from Right */
.comments-drawer { position: fixed; top: 0; right: -100%; width: 100%; height: 100vh; background: #fff; z-index: 2100; transition: right 0.3s ease-in-out; display: flex; flex-direction: column; }
.comments-drawer.open { right: 0; }
.comments-drawer .drawer-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #e5e5e5; background: #fff; font-weight: 700; font-size: 15px; }
.comments-back-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 4px; color: inherit; }
.comments-drawer .drawer-body { padding: 14px; display: flex; flex-direction: column; flex-grow: 1; min-height: 0; max-width: 680px; width: 100%; margin: 0 auto; }
.comments-container { flex-grow: 1; overflow-y: auto; border: 1px solid #e5e5e5; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; flex-direction: column; gap: 10px; background: #fafafa; font-size: 14px; }
.comment-item { display: flex; gap: 10px; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.comment-item.reply { margin-left: 28px; border-left: 2px solid #ddd; padding-left: 10px; }
.comment-avatar-link { flex-shrink: 0; display: inline-block; line-height: 0; }
.comment-avatar { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; cursor: pointer; background: #f0f0f0; }
.comment-author-link { font-weight: bold; font-size: 13px; color: inherit; text-decoration: none; }
.comment-author-link:hover { text-decoration: underline; }
.comment-content { font-size: 13px; line-height: 1.4; margin-top: 3px; word-break: break-word; }
.comment-actions { display: flex; gap: 14px; margin-top: 6px; font-size: 11px; align-items: center; font-weight: 600; }
.comment-reaction-btn { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; color: #555; font-size: 11px; font-weight: 600; user-select: none; }
.comment-reaction-btn.active-like { color: #000; font-weight: bold; }
.comment-reaction-btn.active-like svg { stroke: #000; fill: #000; }
.comment-reaction-btn.active-dislike { color: #ef4444; font-weight: bold; }
.comment-reaction-btn.active-dislike svg { stroke: #ef4444; fill: #ef4444; }
.comment-post-btn { background: #000; color: #fff; padding: 12px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; user-select: none; }

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

// ===== POSTS RENDERING & ACTIONS (CONTROLLED BY APP.JS) =====
const POST_LIKE_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
const POST_DISLIKE_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>`;
const POST_COMMENT_SVG = `<svg class="reaction-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

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

        // Update all matching post boxes (handles duplicate postId across feed & search results)
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
                </div>
                <div class="reaction-btn" onclick="event.stopPropagation(); openCommentsDrawer('${post.id}')">
                    ${POST_COMMENT_SVG} Comments
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
window.blockAuthorFromFeed = blockAuthorFromFeed;

// ===== COMMENTS DRAWER (CONTROLLED BY APP.JS) =====
let _activeCommentsPostId = null;
let _replyingToCommentId = null;
let _replyingToCommentUsername = null;

const COMMENT_LIKE_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
const COMMENT_DISLIKE_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>`;

function ensureCommentsDrawer() {
    let drawer = document.getElementById('comments-drawer');
    if (drawer) return drawer;

    drawer = document.createElement('div');
    drawer.id = 'comments-drawer';
    drawer.className = 'comments-drawer';
    drawer.innerHTML = `
        <div class="drawer-header">
            <button type="button" class="comments-back-btn" onclick="closeCommentsDrawer()" aria-label="Back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <span>Comments</span>
        </div>
        <div class="drawer-body">
            <div class="comments-container" id="comments-list">Loading comments...</div>
            <div id="replying-banner" style="display: none; background: #f0f0f0; padding: 6px 10px; font-size: 11px; font-weight: bold; justify-content: space-between; align-items: center; border-radius: 4px; margin-bottom: 6px;">
                <span id="replying-to-text">Replying...</span>
                <span style="cursor: pointer; color: #666;" onclick="cancelReply()">Cancel</span>
            </div>
            <form id="comment-submit-form" style="display: flex; gap: 6px;">
                <input type="text" id="comment-input" placeholder="Write a comment..." required style="flex-grow: 1; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
                <div class="comment-post-btn" id="comment-post-submit-btn">Post</div>
            </form>
        </div>
    `;
    document.body.appendChild(drawer);

    document.getElementById('comment-submit-form').addEventListener('submit', submitComment);
    document.getElementById('comment-post-submit-btn').addEventListener('click', submitComment);

    return drawer;
}

function openCommentsDrawer(postId) {
    const drawer = ensureCommentsDrawer();
    _activeCommentsPostId = postId;
    cancelReply();
    drawer.classList.add('open');
    loadComments();
}

function closeCommentsDrawer() {
    const drawer = document.getElementById('comments-drawer');
    if (drawer) drawer.classList.remove('open');
    _activeCommentsPostId = null;
    cancelReply();
}

async function loadComments() {
    const listEl = document.getElementById('comments-list');
    if (!listEl || !_activeCommentsPostId) return;
    listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#666; font-weight:600;">Loading comments...</div>';

    const user = getSessionUser();
    const viewerEmail = user && user.email ? user.email : '';

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/comments/get?postId=${encodeURIComponent(_activeCommentsPostId)}&email=${encodeURIComponent(viewerEmail)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load comments');

        if (!data.comments || !data.comments.length) {
            listEl.innerHTML = '<p style="color: #666; text-align: center; font-size: 13px; margin: auto;">No comments yet.</p>';
            return;
        }

        const commentMap = new Map();
        const rootComments = [];

        data.comments.forEach(c => {
            c.replies = [];
            commentMap.set(c.id, c);
        });

        data.comments.forEach(c => {
            if (c.parent_id && commentMap.has(c.parent_id)) {
                commentMap.get(c.parent_id).replies.push(c);
            } else if (!c.parent_id) {
                rootComments.push(c);
            }
        });

        function renderCommentNode(c, isReply = false) {
            const isMe = !!(user && user.email && c.user_email && c.user_email.toLowerCase() === user.email.toLowerCase());
            const profileUrl = `profile.html?user=${encodeURIComponent(c.username || c.user_email)}`;
            const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>";

            return `
                <div class="comment-item ${isReply ? 'reply' : ''}" id="comment-${c.id}">
                    <a href="${profileUrl}" class="comment-avatar-link" onclick="goToProfile('${profileUrl}', event)" title="View @${escapeHtml(c.username)}'s profile">
                        <img class="comment-avatar" src="${c.pfp_url || defaultAvatar}">
                    </a>
                    <div style="flex-grow: 1;">
                        <a href="${profileUrl}" class="comment-author-link" onclick="goToProfile('${profileUrl}', event)">@${escapeHtml(c.username)}${renderVerifiedBadge(c.verified)}</a>
                        <div class="comment-content">${escapeHtml(c.content)}</div>
                        <div class="comment-actions">
                            <div class="comment-reaction-btn ${c.userReaction === 'like' ? 'active-like' : ''}" onclick="toggleCommentReaction('${c.id}', 'like')">
                                ${COMMENT_LIKE_SVG} <span class="c-likes-count">${c.likes}</span>
                            </div>
                            <div class="comment-reaction-btn ${c.userReaction === 'dislike' ? 'active-dislike' : ''}" onclick="toggleCommentReaction('${c.id}', 'dislike')">
                                ${COMMENT_DISLIKE_SVG} <span class="c-dislikes-count">${c.dislikes}</span>
                            </div>
                            <span style="cursor: pointer; color: #000;" onclick="setReplyingTo('${c.id}', '${escapeHtml(c.username)}')">Reply</span>
                            ${!isMe ? `<span style="cursor: pointer; color: #777;" onclick="blockUser('${escapeHtml(c.user_email)}', '${escapeHtml(c.username)}', loadComments)">Block</span>` : ''}
                        </div>
                    </div>
                </div>
                ${c.replies.map(r => renderCommentNode(r, true)).join('')}
            `;
        }

        listEl.innerHTML = rootComments.map(c => renderCommentNode(c)).join('');
        listEl.scrollTop = listEl.scrollHeight;
    } catch (err) {
        listEl.innerHTML = '<p style="color: #ef4444; font-size: 12px; text-align: center; margin: auto;">Failed to load comments.</p>';
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
    if (inputEl) inputEl.focus();
}

function cancelReply() {
    _replyingToCommentId = null;
    _replyingToCommentUsername = null;
    const bannerEl = document.getElementById('replying-banner');
    if (bannerEl) bannerEl.style.display = 'none';
}

async function submitComment(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const user = getSessionUser();
    if (!user) return promptSignup('comment');

    const input = document.getElementById('comment-input');
    if (!input) return;
    const content = input.value.trim();
    if (!content || !_activeCommentsPostId) return;

    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/comments/add`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                postId: _activeCommentsPostId,
                content,
                parentId: _replyingToCommentId
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add comment');

        input.value = '';
        cancelReply();
        loadComments();
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
window.setReplyingTo = setReplyingTo;
window.cancelReply = cancelReply;
window.submitComment = submitComment;
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
            <div id="story-close-btn" class="story-close-top-left">✕</div>
            <div id="story-age" class="story-age"></div>
            <div id="story-delete-btn" class="story-delete-btn">Delete</div>
            <video id="story-player" class="story-video" autoplay playsinline></video>
            <form id="story-reply-bar" class="story-reply-bar">
                <input type="text" id="story-reply-input" class="story-reply-input" placeholder="Reply to story..." maxlength="300" autocomplete="off">
                <button type="submit" id="story-reply-send" class="story-reply-send">Send</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const player = document.getElementById('story-player');
    const fill = document.getElementById('story-progress-fill');
    const replyInput = document.getElementById('story-reply-input');

    document.getElementById('story-reply-bar').addEventListener('submit', (e) => { e.preventDefault(); sendStoryReply(); });
    // Pause the story while typing, resume afterwards
    replyInput.addEventListener('focus', () => { player.pause(); });
    replyInput.addEventListener('blur', () => { if (document.getElementById('story-viewer-modal').classList.contains('open')) player.play().catch(() => {}); });

    modal.addEventListener('click', (e) => { if (e.target === modal) closeStoryModal(); });
    document.getElementById('story-close-btn').addEventListener('click', closeStoryModal);
    document.getElementById('story-delete-btn').addEventListener('click', deleteOwnStory);
    player.addEventListener('timeupdate', () => {
        if (player.duration) fill.style.width = (player.currentTime / player.duration * 100) + '%';
    });
    player.addEventListener('ended', closeStoryModal);
    _storyReady = true;
}

function openStory({ mediaUrl, createdAt, ownerEmail, onDeleted }) {
    if (!mediaUrl) return;
    ensureStoryPlayer();
    _storyOnDeleted = typeof onDeleted === 'function' ? onDeleted : null;

    const me = getSessionUser();
    const isOwner = !!(me && me.email && ownerEmail && me.email.toLowerCase() === String(ownerEmail).toLowerCase());
    document.getElementById('story-delete-btn').style.display = isOwner ? 'flex' : 'none';

    _storyOwnerEmail = ownerEmail ? String(ownerEmail) : '';
    document.getElementById('story-reply-bar').style.display = (!isOwner && _storyOwnerEmail) ? 'flex' : 'none';
    document.getElementById('story-reply-input').value = '';

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
    document.getElementById('story-reply-input').value = '';
    document.getElementById('story-reply-input').blur();
}

async function sendStoryReply() {
    if (_storyReplySending) return;
    const user = getSessionUser();
    if (!user) { closeStoryModal(); promptSignup('reply to stories'); return; }

    const input = document.getElementById('story-reply-input');
    const btn = document.getElementById('story-reply-send');
    const content = input.value.trim();
    if (!content || !_storyOwnerEmail) return;

    _storyReplySending = true;
    btn.disabled = true;
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/stories/reply`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ ownerEmail: _storyOwnerEmail, content })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send reply');
        input.value = '';
        input.blur();
        showToast("Reply sent");
    } catch (err) {
        showToast(err.message);
    } finally {
        _storyReplySending = false;
        btn.disabled = false;
    }
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

window.openStory = openStory;
window.closeStoryModal = closeStoryModal;

// ===== FCM TOKEN REGISTRATION =====
// Single source of truth. Do NOT redefine these functions in any HTML page.
// Called from Java via evaluateJavascript (1 arg) and from tryRegisterFcmWithRetry.
let _fcmRegistered = false;

function onFcmTokenReady(fcmToken, authToken) {
    authToken = authToken || getSessionToken();
    // Not logged in yet (or no token yet): skip. The DOMContentLoaded
    // handler below retries on every page once a session exists.
    if (!fcmToken || !authToken || _fcmRegistered) return;
    _fcmRegistered = true;

    fetch(`${WORKER_ORIGIN}/api/devices/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ fcmToken: fcmToken }),
        keepalive: true
    })
    .then(res => {
        if (!res.ok) throw new Error("Server returned status " + res.status);
        return res.json();
    })
    .then(data => {
        console.log("FCM token registered in D1:", data);
    })
    .catch(e => {
        _fcmRegistered = false;
        console.error("FCM fetch error:", e.message);
    });
}

function tryRegisterFcmWithRetry(authToken, retries = 5) {
    try {
        if (window.AndroidBridge && typeof window.AndroidBridge.getFcmToken === 'function') {
            const fcmToken = window.AndroidBridge.getFcmToken();
            if (fcmToken && fcmToken.trim() !== "") {
                onFcmTokenReady(fcmToken, authToken);
                return;
            }
        } else {
            // Not running inside the Android app (normal browser): nothing to do.
            return;
        }

        if (retries > 0) {
            setTimeout(() => tryRegisterFcmWithRetry(authToken, retries - 1), 2000);
        } else {
            console.error("FCM Error: AndroidBridge returned empty token after retries.");
        }
    } catch (e) {
        console.error("FCM Exception:", e.message);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const user = getSessionUser();
    const token = getSessionToken();
    if (user && token) {
        tryRegisterFcmWithRetry(token);
    }
});
