const WORKER_ORIGIN = "https://icy-glitter-5cd3.socials-73a.workers.dev";

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
    localStorage.setItem('rprofiles_session', JSON.stringify(user));
}

function requireAuth() {
    const user = getSessionUser();
    const path = window.location.pathname;
    if (!user && !path.endsWith('index.html') && path !== '/' && !path.endsWith('/')) {
        window.location.href = 'index.html';
    }
    return user;
}

function logout() {
    localStorage.removeItem('rprofiles_session');
    window.location.href = 'index.html';
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (match) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[match];
    });
}
