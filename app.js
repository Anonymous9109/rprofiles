const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// ===== THEME, TOAST & CUSTOM DIALOGS =====
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
.ugc-dialog-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
.report-option { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: 600; background: #fafafa; }
.report-option input { width: auto; }
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

// Custom non-blocking confirm dialog (works reliably in Android WebView)
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
                    <div style="display:flex; gap:8px; margin-top:6px;">
                        <button id="ugc-confirm-yes" class="btn-app" style="flex:1; background:#ef4444; border-color:#ef4444; color:#fff;">Confirm</button>
                        <button type="button" class="btn-app-secondary" style="flex:1;" onclick="document.getElementById('ugc-confirm-overlay').style.display='none'">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
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
    try { saved = localStorage.getItem('rprofiles_theme') || 'light'; } catch (e) {}
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

// ===== SESSION =====
function getSessionUser() {
    const stored = localStorage.getItem('rprofiles_session');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch (e) {
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

// ===== UGC REPORT MODAL & SAFETY HELPERS =====
function reportPost(postId) {
    const user = getSessionUser();
    if (!user) return;

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
                    <p style="font-size:12px; color:#666;">Select the reason you are reporting this post:</p>
                    <label class="report-option"><input type="radio" name="report_reason" value="Spam or Misleading" required> Spam or Misleading</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Sexual or Explicit Content"> Sexual or Explicit Content</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Harassment or Bullying"> Harassment or Bullying</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Hate Speech or Violence"> Hate Speech or Violence</label>
                    <label class="report-option"><input type="radio" name="report_reason" value="Copyright or Intellectual Property"> Copyright Violation</label>
                    <input type="text" id="ugc-report-details" placeholder="Additional details (optional)..." style="padding:8px; border:1px solid #ccc; border-radius:6px; font-size:12px;">
                    <div style="display:flex; gap:8px; margin-top:4px;">
                        <button type="submit" id="ugc-report-submit" class="btn-app" style="flex:1; background:#ef4444; border-color:#ef4444; color:#fff;">Submit Report</button>
                        <button type="button" class="btn-app-secondary" style="flex:1;" onclick="document.getElementById('ugc-report-overlay').style.display='none'">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const form = document.getElementById('ugc-report-form');
    form.reset();
    const submitBtn = document.getElementById('ugc-report-submit');
    submitBtn.disabled = false;
    submitBtn.innerText = 'Submit Report';

    form.onsubmit = async (e) => {
        e.preventDefault();
        const selected = form.querySelector('input[name="report_reason"]:checked');
        if (!selected) {
            showToast("Please select a violation type.");
            return;
        }
        const details = document.getElementById('ugc-report-details').value.trim();
        const fullReason = details ? `${selected.value} — ${details}` : selected.value;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';

        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/reports/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, email: user.email, reason: fullReason })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit report');
            overlay.style.display = 'none';
            showToast("Report received. Our team will review this post within 24 hours.");
        } catch (err) {
            showToast(err.message);
            submitBtn.disabled = false;
            submitBtn.innerText = 'Submit Report';
        }
    };

    overlay.style.display = 'flex';
}

function blockUser(targetEmail, targetUsername, onSuccess) {
    const user = getSessionUser();
    if (!user) return;

    showConfirmDialog(
        "Block User",
        `Block @${targetUsername || targetEmail}? You will no longer see their posts, comments, or messages.`,
        "Block User",
        async () => {
            try {
                const res = await fetch(`${WORKER_ORIGIN}/api/users/block`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ blockerEmail: user.email, blockedEmail: targetEmail })
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
