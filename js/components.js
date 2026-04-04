document.addEventListener("DOMContentLoaded", () => {
    loadNavigation();
    loadFooter(); 
    
    if (window.location.href.includes('/blog/')) {
        loadToast();
    }
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
                <li><a href="${prefix}index.html" class="${isHome ? 'active' : ''}">Home</a></li>
                <li><a href="${prefix}about/index.html" class="${isAbout ? 'active' : ''}">About</a></li>
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
        <a href="${prefix}about/index.html" class="${isAbout ? 'active' : ''}">About</a>
        <a href="${prefix}blog/index.html" class="${isBlog ? 'active' : ''}">Blog</a>
        <a href="${prefix}projects/index.html" class="${isProjects ? 'active' : ''}">Projects</a>
        <a href="${prefix}socials/index.html" class="${isSocials ? 'active' : ''}">Socials</a>
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
                <a href="${prefix}tos/index.html" class="footer-link" aria-label="Terms of Service" title="Terms of Service">
                    <i class="fa-solid fa-file-contract" aria-hidden="true"></i>
                    <span class="footer-link-label">Terms of Service</span>
                </a>
                <a href="${prefix}pp/index.html" class="footer-link" aria-label="Privacy Policy" title="Privacy Policy">
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