document.addEventListener("DOMContentLoaded", () => {
    loadNavigation();
    loadFooter(); 
    
    if (window.location.href.includes('/blog/')) {
        loadToast();
    }
});

function getPathPrefix() {
    const path = window.location.pathname;
    if (path.includes('/blog/') || path.includes('/projects/') || path.includes('/socials/') || path.includes('/dash/')) {
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
    const isHome = !isBlog && !isProjects && !isSocials && !path.includes('/dash/');

    const navHTML = `
    <nav class="glass-nav">
        <div class="nav-left-group">
            <div class="logo">AUXILIARYFRFR</div>
            <ul class="nav-links desktop-menu">
                <li><a href="${prefix}index.html" class="${isHome ? 'active' : ''}">Home</a></li>
                <li><a href="${prefix}blog/index.html" class="${isBlog ? 'active' : ''}">Blog</a></li>
                <li><a href="${prefix}projects/index.html" class="${isProjects ? 'active' : ''}">Projects</a></li>
                <li><a href="${prefix}socials/index.html" class="${isSocials ? 'active' : ''}">Socials</a></li>
                <li><a href="${prefix}dash/index.html" class="cyber-link">/dash</a></li>
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
        <a href="${prefix}index.html" class="${isHome ? 'active' : ''}">Home</a>
        <a href="${prefix}blog/index.html" class="${isBlog ? 'active' : ''}">Blog</a>
        <a href="${prefix}projects/index.html" class="${isProjects ? 'active' : ''}">Projects</a>
        <a href="${prefix}socials/index.html" class="${isSocials ? 'active' : ''}">Socials</a>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function loadFooter() {
    const footerHTML = `
    <footer class="glass-footer">
        <div class="status-indicator">
            <span class="dot online"></span>
            <span class="status-text">System Status: 99.98% Uptime</span>
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