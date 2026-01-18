const SUPABASE_URL = 'https://bqmkajpkooucvyabwncu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FBcAuoqWgHlZch1XmgWEwA_WKF0JIwE';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        updateUI(session.user);
    }
}

async function simulateLogin() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
    });
    if (error) console.error(error);
}

async function simulateLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.reload();
    }
}

function updateUI(user) {
    const loginBtn = document.querySelector('.login-btn');
    const userInfo = document.getElementById('userInfo');
    const newsletterWrapper = document.getElementById('newsletterWrapper');
    
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userInfo) userInfo.classList.remove('hidden');
    
    const discordName = user.user_metadata.full_name || user.user_metadata.name;
    const discordAvatar = user.user_metadata.avatar_url;
    
    const nameEl = document.querySelector('.user-name');
    const miniAvatar = document.querySelector('.mini-avatar');
    const navProfile = document.querySelector('.profile-pic');
    const trigger = document.getElementById('profileTrigger');

    if (nameEl) nameEl.innerText = discordName;
    if (miniAvatar) miniAvatar.src = discordAvatar;
    if (navProfile) navProfile.src = discordAvatar;
    
    if (newsletterWrapper) newsletterWrapper.classList.remove('locked');
    if (trigger) trigger.style.borderColor = "#5865F2";
}

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

checkUser();