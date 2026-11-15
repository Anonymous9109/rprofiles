const WORKER_ORIGIN = "https://your-worker-subdomain.workers.dev"; // <-- Keep your actual Worker URL here

function getSessionUser() {
    try {
        const raw = localStorage.getItem('nvaritia_user');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function getSessionToken() {
    try {
        return localStorage.getItem('nvaritia_token') || '';
    } catch (e) {
        return '';
    }
}

function setSessionUser(user, token) {
    try {
        if (user) localStorage.setItem('nvaritia_user', JSON.stringify(user));
        if (token) localStorage.setItem('nvaritia_token', token);
    } catch (e) {}
}

function logout() {
    try {
        localStorage.removeItem('nvaritia_user');
        localStorage.removeItem('nvaritia_token');
    } catch (e) {}
    window.location.href = 'index.html';
}

function authHeaders(extra = {}) {
    const token = getSessionToken();
    const headers = { ...extra };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function requireAuth(allowGuest = false) {
    const user = getSessionUser();
    const token = getSessionToken();

    if (!user || (!user.guest && !token)) {
        if (allowGuest) {
            return { guest: true, email: '', username: 'Guest' };
        }
        window.location.href = 'index.html';
        throw new Error('Unauthorized');
    }
    if (user.theme) applyTheme(user.theme);
    return user;
}

function promptSignup(actionText = 'do that') {
    try {
        sessionStorage.setItem('Nvaritia_notice', `Create an account or log in to ${actionText}.`);
    } catch (e) {}
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderVerifiedBadge(verified) {
    if (!verified) return '';
    return `<span title="Verified" style="display:inline-flex;align-items:center;margin-left:4px;vertical-align:middle;"><svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2L14.8 4.4L18.5 4.1L19.9 7.5L23 9.6L21.9 13.1L23 16.6L19.9 18.7L18.5 22.1L14.8 21.8L12 24L9.2 21.8L5.5 22.1L4.1 18.7L1 16.6L2.1 13.1L1 9.6L4.1 7.5L5.5 4.1L9.2 4.4L12 2Z"/><path d="M9 12.2L11 14.2L15.5 9.7" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

async function saveTheme(theme) {
    const res = await fetch(`${WORKER_ORIGIN}/api/profile/theme`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ theme })
    });
    if (!res.ok) throw new Error('Failed to save theme');
    applyTheme(theme);
}

async function compressImage(file, maxDim = 1280) {
    if (!file || !file.type.startsWith('image/')) return file;
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width <= maxDim && height <= maxDim && file.size < 800 * 1024) {
                return resolve(file);
            }
            if (width > height && width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
            } else if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                resolve(blob ? new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }) : file);
            }, 'image/jpeg', 0.82);
        };
        img.onerror = () => resolve(file);
        img.src = url;
    });
}

async function reportPost(postId) {
    const user = getSessionUser();
    if (!user || user.guest) return promptSignup('report posts');
    try {
        const res = await fetch(`${WORKER_ORIGIN}/api/posts/report`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ postId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Report failed');
        if (typeof showToast === 'function') showToast('Post reported for review.');
    } catch (err) {
        if (typeof showToast === 'function') showToast(err.message);
    }
}

async function blockUser(targetEmail, targetUsername, onDone) {
    const user = getSessionUser();
    if (!user || user.guest) return promptSignup('block users');
    const execBlock = async () => {
        try {
            const res = await fetch(`${WORKER_ORIGIN}/api/users/block`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ blockedEmail: targetEmail })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Block failed');
            if (typeof showToast === 'function') showToast(`Blocked @${targetUsername || targetEmail}`);
            if (typeof onDone === 'function') onDone();
        } catch (err) {
            if (typeof showToast === 'function') showToast(err.message);
        }
    };
    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm(`Block @${targetUsername || targetEmail}?`, execBlock, true);
    } else {
        execBlock();
    }
}
