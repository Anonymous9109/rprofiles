const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// ===== THEME =====
const THEME_CSS = `
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
html.dark button[style*="background: #000"] { background:#fff !important; color:#000 !important; }
html.dark span[style*="color: #000"], html.dark a[style*="color:#000"] { color:#fff !important; }
html.dark .reaction-btn { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark .reaction-btn.active-like { background:#fff; color:#000; border-color:#fff; }
html.dark .reaction-btn.active-like .reaction-icon { fill:#000; stroke:#000; }
html.dark .reaction-btn.active-dislike { background:#ef4444; color:#fff; border-color:#ef4444; }
html.dark .comments-drawer, html.dark .chat-drawer, html.dark .modal-window { background:#181818; border-color:#333; }
html.dark .drawer-header, html.dark .modal-header { background:#222; border-color:#2a2a2a; color:#eee; }
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
html.dark input, html.dark textarea { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark .custom-file-upload { background:#1c1c1c; color:#eee; border-color:#333; }
html.dark [style*="background: #f0f0f0"] { background:#2a2a2a !important; color:#eee !important; }
`;

function applyTheme(theme) {
    const t = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem('rprofiles_theme', t); } catch (e) {}
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerText = t === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode';
}

async function saveTheme(email, theme) {
    applyTheme(theme);
    const res = await fetch(`${WORKER_ORIGIN}/api/profile/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, theme })
    });
    if (!res.ok) throw new Error('Failed to save theme');
}

(function initTheme() {
    const style = document.createElement('style');
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    let saved = 'light';
    try { saved = localStorage.getItem('rprofiles_theme') || 'light'; } catch (e) {}
    applyTheme(saved);
})();

// ===== SESSION =====
function getSessionUser() {
    const stored = localStorage.getItem('rprofiles_session');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (e) {
        localStorage.removeItem('rprofiles_session');
        return null;
    }
}

function setSessionUser(user) {
    if (user && user.theme) applyTheme(user.theme);
    localStorage.setItem('rprofiles_session', JSON.stringify(user));
}

function requireAuth() {
    const user = getSessionUser();
    const path = window.location.pathname;
    if (!user && !path.endsWith('index.html') && path !== '/' && !path.endsWith('/')) {
        window.location.href = 'index.html';
    }
    // Apply the account's saved theme on every page, even on a stale local cache
    if (user && user.theme) applyTheme(user.theme);
    return user;
}

function logout() {
    localStorage.removeItem('rprofiles_session');
    localStorage.removeItem('rprofiles_theme');
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (match) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[match];
    });
}