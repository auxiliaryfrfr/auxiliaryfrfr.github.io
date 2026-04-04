document.addEventListener("DOMContentLoaded", () => {
    loadNavigation();
    loadFooter(); 
    
    if (window.location.href.includes('/blog/')) {
        loadToast();
    }

    setupBeanScrollbar();
    requestAnimationFrame(setupBeanScrollbar);
    setTimeout(setupBeanScrollbar, 220);
    window.addEventListener('load', setupBeanScrollbar, { once: true });
});

function getPathPrefix() {
    const path = window.location.pathname;
    if (path.includes('/blog/') || path.includes('/projects/') || path.includes('/socials/') || path.includes('/dash/') || path.includes('/about/') || path.includes('/tos/') || path.includes('/pp/')) {
        return '../'; 
    }
    return './'; 
}

function loadNavigation() {
    const prefix = getPathPrefix();
    const path = window.location.pathname;

    const isBlog = path.includes('/blog/');
    const isProjects = path.includes('/projects/');
    const isSocials = path.includes('/socials/');
    const isAbout = path.includes('/about/');
    const isTos = path.includes('/tos/');
    const isPp = path.includes('/pp/');
    const isHome = !isBlog && !isProjects && !isSocials && !isAbout && !isTos && !isPp && !path.includes('/dash/');

    const navHTML = `
    <nav class="glass-nav">
        <div class="nav-left-group">
            <div class="logo">AUXILIARYFRFR</div>
            <ul class="nav-links desktop-menu">
                <li><a href="${prefix}" class="${isHome ? 'active' : ''}">Home</a></li>
                <li><a href="${prefix}about/" class="${isAbout ? 'active' : ''}">About</a></li>
                <li><a href="${prefix}blog/" class="${isBlog ? 'active' : ''}">Blog</a></li>
                <li><a href="${prefix}projects/" class="${isProjects ? 'active' : ''}">Projects</a></li>
                <li><a href="${prefix}socials/" class="${isSocials ? 'active' : ''}">Socials</a></li>
                <li><a href="${prefix}dash/" class="cyber-link">/dash</a></li>
            </ul>
        </div>

        <div class="nav-right-group">
            <div class="profile-trigger glass-panel" id="profileTrigger" onclick="toggleProfileMenu()">
                <img src="${prefix}images/default-user.png" alt="Profile" class="profile-pic">
            </div>
            <div class="hamburger" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </div>
        </div>

        <div class="profile-dropdown glass-panel" id="profileMenu">
            <div class="auth-section" id="authSection">
                <button class="btn-auth login-btn" onclick="simulateLogin()">
                    <i class="fab fa-discord"></i> Log In with Discord
                </button>
                <div class="user-info hidden" id="userInfo">
                    <div class="user-details">
                        <img src="${prefix}images/default-user.png" class="mini-avatar"> 
                        <span class="user-name">User</span>
                    </div>
                    <button class="btn-logout-full" onclick="simulateLogout()">
                        <i class="fas fa-power-off"></i> Log Out
                    </button>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="settings-section">
                <h4><i class="fas fa-sliders-h"></i> Settings</h4>
                <div class="setting-item">
                    <span>Light Mode</span>
                    <label class="theme-switch">
                        <input type="checkbox" id="lightModeToggle">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="newsletter-section">
                <h4><i class="fas fa-broadcast-tower"></i> Notifications</h4>
                <div class="locked-wrapper locked" id="newsletterWrapper">
                    <div class="lock-overlay">
                        <i class="fas fa-lock"></i>
                        <span>Login Required</span>
                    </div>
                    <p class="newsletter-sub">Get notified when new blogs drop.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="user@domain.com" required>
                        <button type="submit"><i class="fas fa-chevron-right"></i></button>
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <div class="mobile-menu" id="mobileMenu">
        <a href="${prefix}" class="${isHome ? 'active' : ''}">Home</a>
        <a href="${prefix}about/" class="${isAbout ? 'active' : ''}">About</a>
        <a href="${prefix}blog/" class="${isBlog ? 'active' : ''}">Blog</a>
        <a href="${prefix}projects/" class="${isProjects ? 'active' : ''}">Projects</a>
        <a href="${prefix}socials/" class="${isSocials ? 'active' : ''}">Socials</a>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function loadFooter() {
    const prefix = getPathPrefix();
    const footerHTML = `
    <footer class="glass-footer">
        <div class="footer-primary">
            <div class="footer-links" aria-label="Legal links">
                <a href="${prefix}tos/" class="footer-link" aria-label="Terms of Service" title="Terms of Service">
                    <i class="fa-solid fa-file-contract" aria-hidden="true"></i>
                    <span class="footer-link-label">Terms of Service</span>
                </a>
                <a href="${prefix}pp/" class="footer-link" aria-label="Privacy Policy" title="Privacy Policy">
                    <i class="fa-solid fa-user-shield" aria-hidden="true"></i>
                    <span class="footer-link-label">Privacy Policy</span>
                </a>
            </div>
            <a href="https://ko-fi.com/auxiliaryfrfr" class="kofi-support-btn" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-mug-hot"></i>
                <span>Support Me</span>
            </a>
        </div>
        <div class="copyright">
            <p>&copy; 2026 auxiliaryfrfr. MIT License.</p>
        </div>
    </footer>
    `;

    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.insertAdjacentHTML('beforeend', footerHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

function loadToast() {
    const toastHTML = `
    <div id="systemToast" class="system-toast">
        <button class="btn-toast-close" onclick="closeToast()">
            <i class="fas fa-times"></i>
        </button>

        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-broadcast-tower"></i>
            </div>
            <div class="toast-text">
                <h4>Want notifications?</h4>
                <p>Log in to auto-subscribe to new blogs!</p>
            </div>
        </div>
        <div class="toast-actions">
            <button class="btn-toast-login" onclick="simulateLogin()">
                <i class="fab fa-discord"></i> Log In
            </button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
}

let beanScrollbarController = null;
const desktopBeanQuery = window.matchMedia('(min-width: 769px)');

function setupBeanScrollbar() {
    if (!desktopBeanQuery.matches) {
        destroyBeanScrollbar();
        return;
    }

    if (!beanScrollbarController) {
        beanScrollbarController = createBeanScrollbar();
    }

    beanScrollbarController.refresh();
}

function destroyBeanScrollbar() {
    if (!beanScrollbarController) {
        document.documentElement.classList.remove('bean-scrollbar-enabled');
        document.body.classList.remove('bean-scrollbar-enabled', 'bean-dragging');
        return;
    }

    beanScrollbarController.destroy();
    beanScrollbarController = null;
}

function createBeanScrollbar() {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const IDLE_DELAY_MS = 1300;
    const EDGE_WAKE_ZONE_PX = 56;

    const track = document.createElement('div');
    track.className = 'bean-scrollbar bean-hidden';
    track.setAttribute('aria-hidden', 'true');

    const thumb = document.createElement('div');
    thumb.className = 'bean-scrollbar-thumb';

    track.appendChild(thumb);
    document.body.appendChild(track);

    document.documentElement.classList.add('bean-scrollbar-enabled');
    document.body.classList.add('bean-scrollbar-enabled');

    let isDragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;
    let thumbHeight = 52;
    let idleTimer = null;

    function clearIdleTimer() {
        if (idleTimer !== null) {
            window.clearTimeout(idleTimer);
            idleTimer = null;
        }
    }

    function setActiveState() {
        track.classList.remove('bean-idle');
        clearIdleTimer();
    }

    function scheduleIdleState() {
        clearIdleTimer();
        if (isDragging || track.classList.contains('bean-hidden')) return;

        idleTimer = window.setTimeout(() => {
            if (!isDragging && !track.classList.contains('bean-hidden')) {
                track.classList.add('bean-idle');
            }
        }, IDLE_DELAY_MS);
    }

    function getTopInset() {
        const nav = document.querySelector('.glass-nav');
        if (!nav) return 12;
        return Math.max(12, Math.round(nav.getBoundingClientRect().bottom + 8));
    }

    function getBottomInset() {
        const footer = document.querySelector('.glass-footer');
        if (!footer) return 12;

        const visibleFooterHeight = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
        return Math.max(12, Math.round(visibleFooterHeight + 8));
    }

    function getMaxScroll() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function syncThumb() {
        track.style.top = `${getTopInset()}px`;
        track.style.bottom = `${getBottomInset()}px`;

        const maxScroll = getMaxScroll();
        const trackHeight = track.clientHeight;

        if (maxScroll <= 0 || trackHeight <= 0) {
            track.classList.add('bean-hidden');
            track.classList.remove('bean-idle');
            clearIdleTimer();
            return;
        }

        track.classList.remove('bean-hidden');

        thumbHeight = clamp(trackHeight * 0.22, 38, 56);
        thumb.style.height = `${thumbHeight}px`;

        const thumbTravel = Math.max(0, trackHeight - thumbHeight);
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const nextY = thumbTravel * (scrollTop / maxScroll);

        thumb.style.transform = `translateY(${nextY}px)`;
        setActiveState();
        scheduleIdleState();
    }

    function scrollFromTrackOffset(offsetY) {
        const trackHeight = track.clientHeight;
        const maxScroll = getMaxScroll();
        const thumbTravel = Math.max(1, trackHeight - thumbHeight);
        const nextThumbY = clamp(offsetY, 0, thumbTravel);
        const nextScrollTop = (nextThumbY / thumbTravel) * maxScroll;

        window.scrollTo({
            top: nextScrollTop,
            behavior: 'auto'
        });
    }

    function onTrackMouseDown(event) {
        if (event.target === thumb) return;
        setActiveState();
        const rect = track.getBoundingClientRect();
        const desiredThumbTop = event.clientY - rect.top - (thumbHeight / 2);
        scrollFromTrackOffset(desiredThumbTop);
        scheduleIdleState();
    }

    function onThumbMouseDown(event) {
        isDragging = true;
        setActiveState();
        dragStartY = event.clientY;
        dragStartScroll = window.scrollY || document.documentElement.scrollTop;
        document.body.classList.add('bean-dragging');
        event.preventDefault();
    }

    function onMouseMove(event) {
        if (!isDragging) {
            if (event.clientX >= (window.innerWidth - EDGE_WAKE_ZONE_PX) && getMaxScroll() > 0) {
                setActiveState();
                scheduleIdleState();
            }
            return;
        }

        setActiveState();

        const trackHeight = track.clientHeight;
        const thumbTravel = Math.max(1, trackHeight - thumbHeight);
        const maxScroll = getMaxScroll();
        const deltaY = event.clientY - dragStartY;
        const deltaScroll = (deltaY / thumbTravel) * maxScroll;
        const nextScrollTop = clamp(dragStartScroll + deltaScroll, 0, maxScroll);

        window.scrollTo({
            top: nextScrollTop,
            behavior: 'auto'
        });
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove('bean-dragging');
        scheduleIdleState();
    }

    function onWheel() {
        if (getMaxScroll() <= 0) return;
        setActiveState();
        scheduleIdleState();
    }

    function onKeyDown(event) {
        if (getMaxScroll() <= 0) return;
        const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Space']);
        if (!scrollKeys.has(event.code)) return;
        setActiveState();
        scheduleIdleState();
    }

    window.addEventListener('scroll', syncThumb, { passive: true });
    window.addEventListener('resize', syncThumb);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
    track.addEventListener('mousedown', onTrackMouseDown);
    thumb.addEventListener('mousedown', onThumbMouseDown);

    return {
        refresh: syncThumb,
        destroy: () => {
            window.removeEventListener('scroll', syncThumb);
            window.removeEventListener('resize', syncThumb);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', stopDragging);
            track.removeEventListener('mousedown', onTrackMouseDown);
            thumb.removeEventListener('mousedown', onThumbMouseDown);
            stopDragging();
            clearIdleTimer();
            track.remove();
            document.documentElement.classList.remove('bean-scrollbar-enabled');
            document.body.classList.remove('bean-scrollbar-enabled', 'bean-dragging');
        }
    };
}

if (desktopBeanQuery.addEventListener) {
    desktopBeanQuery.addEventListener('change', setupBeanScrollbar);
} else if (desktopBeanQuery.addListener) {
    desktopBeanQuery.addListener(setupBeanScrollbar);
}
