const WORKER_URL = 'https://auth-worker.evie-s-account.workers.dev';

window.addEventListener('load', () => {
    checkUser();
});

async function checkUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('session');

    if (urlToken) {
        localStorage.setItem('discord_token', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname); 
    }

    const token = localStorage.getItem('discord_token');
    if (token) {
        try {
            const res = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Token expired');
            
            const user = await res.json();
            updateUI(user);
        } catch (e) {
            console.error(e);
            handleGuestUser();
            localStorage.removeItem('discord_token');
        }
    } else {
        handleGuestUser();
    }
}

function simulateLogin() {
    window.location.href = `${WORKER_URL}/auth/login`;
}

function simulateLogout() {
    localStorage.removeItem('discord_token');
    window.location.reload();
}

function updateUI(user) {
    const loginBtn = document.querySelector('.login-btn');
    const userInfo = document.getElementById('userInfo');
    const newsletterWrapper = document.getElementById('newsletterWrapper');
    
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userInfo) userInfo.classList.remove('hidden');
    
    const discordName = user.global_name || user.username;
    const discordAvatar = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
        : 'images/default-user.png';
    
    const nameEls = document.querySelectorAll('.user-name');
    const miniAvatars = document.querySelectorAll('.mini-avatar');
    const navProfile = document.querySelector('.profile-pic');
    const trigger = document.getElementById('profileTrigger');

    nameEls.forEach(el => el.innerText = discordName);
    miniAvatars.forEach(el => el.src = discordAvatar);
    if (navProfile) navProfile.src = discordAvatar;
    
    if (newsletterWrapper) newsletterWrapper.classList.remove('locked');
    if (trigger) trigger.style.borderColor = "#5865F2";

    checkSubscriptionStatus(user);
}

async function checkSubscriptionStatus(user) {
    const input = document.querySelector('.newsletter-form input');
    if (input) {
        input.value = user.email;
        input.setAttribute('readonly', true);
    }
    
    const token = localStorage.getItem('discord_token');
    if (!token) return;

    try {
        const res = await fetch(`${WORKER_URL}/api/newsletter`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSubscribeState(data.subscribed ? 'subscribed' : 'unsubscribed');
    } catch (e) {
        console.error("Failed to check subscription:", e);
    }
}

async function handleNewsletter(e) {
    e.preventDefault();
    const button = document.querySelector('.newsletter-form button');
    const token = localStorage.getItem('discord_token');
    if (!token) return;

    const isSubbed = button.classList.contains('is-subscribed');
    if (isSubbed && !confirm('Unsubscribe from updates?')) return;

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const res = await fetch(`${WORKER_URL}/api/newsletter`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSubscribeState(data.subscribed ? 'subscribed' : 'unsubscribed');
    } catch (e) {
        console.error("Failed to toggle subscription:", e);
        alert("Error updating subscription.");
        setSubscribeState(isSubbed ? 'subscribed' : 'unsubscribed');
    }
}

function setSubscribeState(state) {
    const form = document.querySelector('.newsletter-form');
    const input = document.querySelector('.newsletter-form input');
    const button = document.querySelector('.newsletter-form button');

    if (!form || !input || !button) return;

    if (state === 'subscribed') {
        form.classList.add('success');
        input.value = "Subscribed"; 
        input.style.color = "#4CAF50"; 
        button.innerHTML = '<i class="fas fa-times"></i>';
        button.classList.add('is-subscribed');
    } else {
        form.classList.remove('success');
        input.style.color = "white"; 
        button.innerHTML = '<i class="fas fa-chevron-right"></i>';
        button.classList.remove('is-subscribed');
    }
}

document.addEventListener('submit', (e) => {
    if (e.target && e.target.classList.contains('newsletter-form')) {
        handleNewsletter(e);
    }
});

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburgerIcon = document.querySelector('.hamburger');
    menu.classList.toggle('open');
    hamburgerIcon.classList.toggle('open');
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    const profileTrigger = document.getElementById('profileTrigger');
    profileMenu.classList.toggle('open');
    profileTrigger.classList.toggle('active');
}

document.addEventListener('click', function(e) {
    const profileMenu = document.getElementById('profileMenu');
    const profileTrigger = document.getElementById('profileTrigger');
    
    if (profileMenu && profileMenu.classList.contains('open') && 
        !profileMenu.contains(e.target) && 
        !profileTrigger.contains(e.target)) {
        profileMenu.classList.remove('open');
        profileTrigger.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('lightModeToggle');
    const lightmodelist = [
        "MY EYES", "We don't do that here", "Nuh uh", "Absolutely not",
        "Psht, no", "Who hurt you?", "Fuh naw", "Oh hell no",
        "Not today, Satan", "Not while I'm alive", "You wish", "In your dreams",
        "Try again", "Over my dead body", "Keep dreaming", "Fat chance",
        "Out of the question", "Not a chance in hell", "Not in a million years", "Yeah, right"
    ];

    if (toggle) {
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                let snark = document.querySelector('.snark-text');
                if (!snark) {
                    snark = document.createElement('span');
                    snark.className = 'snark-text';
                    e.target.parentElement.parentElement.appendChild(snark);
                }

                setTimeout(() => {
                    e.target.checked = false;
                    const slider = e.target.nextElementSibling;
                    slider.classList.add('shake-reject');
                    setTimeout(() => slider.classList.remove('shake-reject'), 400);

                    snark.innerText = lightmodelist[Math.floor(Math.random() * lightmodelist.length)];
                    snark.classList.add('visible');

                    setTimeout(() => snark.classList.remove('visible'), 2000);
                }, 200); 
            }
        });
    }
});

function handleGuestUser() {
    if (!window.location.href.includes('/blog/')) return;
    if (sessionStorage.getItem('toastDismissed')) return;

    setTimeout(() => {
        const toast = document.getElementById('systemToast');
        if (toast) toast.classList.add('visible');
    }, 4000);
}

function closeToast() {
    const toast = document.getElementById('systemToast');
    if (toast) {
        toast.classList.remove('visible');
        sessionStorage.setItem('toastDismissed', 'true');
    }
}