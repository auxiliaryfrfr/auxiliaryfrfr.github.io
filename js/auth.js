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
    const form = document.querySelector('.newsletter-form');

    if (input) {
        input.value = user.email;
        input.setAttribute('readonly', true);
        
        if (!document.querySelector('.input-lock')) {
            const lock = document.createElement('div');
            lock.className = 'input-lock';
            lock.innerHTML = '<i class="fas fa-shield-alt"></i>';
            if (form) form.prepend(lock);
        }
    }

    const { data } = await supabaseClient
        .from('subscribers')
        .select('*')
        .eq('user_uuid', user.id)
        .single();

    if (data) {
        setSubscribeState('subscribed');
    }
}

async function handleNewsletter(e) {
    e.preventDefault();
    const button = document.querySelector('.newsletter-form button');
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    if (button.classList.contains('is-subscribed')) {
        if(!confirm('Unsubscribe from updates?')) return;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        const { error } = await supabaseClient
            .from('subscribers')
            .delete()
            .eq('user_uuid', user.id);

        if (!error) {
            setSubscribeState('unsubscribed');
        } else {
            console.error(error);
            alert("Error unsubscribing.");
            setSubscribeState('subscribed');
        }
        return;
    }

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const { error } = await supabaseClient
        .from('subscribers')
        .insert({ 
            email: user.email,     
            user_uuid: user.id     
        });

    if (error) {
        console.error("Supabase Error:", error);
        button.innerHTML = '<i class="fas fa-times"></i>'; 
        
        if (error.code === '23505') {
            setSubscribeState('subscribed');
        } else {
            alert('Error: ' + error.message);
            setTimeout(() => { 
                button.innerHTML = '<i class="fas fa-chevron-right"></i>'; 
            }, 2000);
        }
    } else {
        setSubscribeState('subscribed');
    }
}

function setSubscribeState(state) {
    const form = document.querySelector('.newsletter-form');
    const input = document.querySelector('.newsletter-form input');
    const button = document.querySelector('.newsletter-form button');

    if (state === 'subscribed') {
        form.classList.add('success');
        input.value = "Subscribed"; 
        input.style.color = "#4CAF50"; 
        
        button.innerHTML = '<i class="fas fa-times"></i>';
        button.classList.add('is-subscribed');
        button.title = "Unsubscribe";
    } else {
        form.classList.remove('success');
        input.style.color = "white"; 
        
        button.innerHTML = '<i class="fas fa-chevron-right"></i>';
        button.classList.remove('is-subscribed');
        button.title = "Subscribe";
        
        supabaseClient.auth.getUser().then(({data}) => {
            if(data.user) input.value = data.user.email;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
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

checkUser();