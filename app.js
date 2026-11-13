const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

// Verified Badge SVG HTML helper
const VERIFIED_BADGE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-left:3px;color:#3b82f6;" title="Verified Account"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

function renderVerifiedBadge(isVerified) {
    return isVerified ? VERIFIED_BADGE_SVG : '';
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
    try { localStorage.setItem('rprofiles_theme', t); } catch (e) {}
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerText = t === 'dark' ? 'Switch to Light Mode' : ' Switch to Dark Mode';
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

// ===== SESSION =====
function getSessionUser() {
    const stored = localStorage.getItem('Nvaritia_session');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch (e) {
        localStorage.removeItem('Nvaritia_session');
        return null;
    }
}

function setSessionUser(user) {
    if (user && user.theme) applyTheme(user.theme);
    localStorage.setItem('Nvaritia_session', JSON.stringify(user));
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
    localStorage.removeItem('Nvaritia_session');
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, email: user.email, reason: finalReason })
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
