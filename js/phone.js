document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const boot = document.getElementById('boot-screen');
        if(boot) boot.style.display = 'none';
        openApp('home');
        setTimeout(startIntroSequence, 1000);
    }, 2000);

    updateClock();
    setInterval(updateClock, 1000);
    initCalculator();
    initCalendar();
    initWeather();

    const input = document.getElementById('apology-input');
    if (input) {
        input.addEventListener('input', (e) => checkRules(e.target.value));
    }
    
    const postBtn = document.getElementById('post-btn');
    if(postBtn) postBtn.onclick = postApology;
});

let gameStarted = false;
let gameFinished = false;
let introStage = 0;
let lawyerInteracted = false;

function initWeather() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => {
            document.querySelector('.weather-widget h2').innerText = "Local";
            document.querySelector('.weather-widget h1').innerText = "24°";
        }
    );
}
function fetchWeather(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('.weather-widget h1').innerText = `${Math.round(data.current_weather.temperature)}°`;
            document.querySelector('.weather-widget h2:first-child').innerText = "Local";
        }).catch(e => console.log(e));
}

let chatHistory = {};
let chatMeta = {};

function startIntroSequence() {
    addReceivedMessage("Hey, you there?", "PR Team");
}

function handleIntroChoice(choice) {
    const body = document.getElementById('chat-body');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble sent';
    bubble.innerText = choice;
    body.appendChild(bubble);
    
    if(!chatHistory['PR Team']) chatHistory['PR Team'] = [];
    chatHistory['PR Team'].push({ text: choice, type: 'sent' });

    document.getElementById('script-choices').style.display = 'none';

    setTimeout(() => {
        let response = "";
        if (introStage === 0) {
            response = "We need to talk. You're going to get cancelled if we don't do something about it.";
            introStage = 1;
            setTimeout(() => {
                showScriptChoices(["What are we going to do?"]);
            }, 1000);
        } 
        else if (introStage === 1) {
            response = "You need to go on <b>Yapper</b> and make a good apology message.";
            setTimeout(() => {
                startGame();
            }, 1500);
        }
        addReceivedMessage(response);
    }, 800);
}

function showScriptChoices(options) {
    const container = document.getElementById('script-choices');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = opt;
        btn.onclick = () => handleIntroChoice(opt);
        container.appendChild(btn);
    });
    container.style.display = 'flex';
}

function addReceivedMessage(text, sender = 'PR Team') {
    if(!chatHistory[sender]) chatHistory[sender] = [];
    chatHistory[sender].push({ text: text, type: 'received' });

    const contactNameEl = document.getElementById('chat-contact-name');
    const isChatOpen = contactNameEl && contactNameEl.innerText === sender && document.getElementById('screen-conversation').classList.contains('active-screen');

    if (isChatOpen) {
        const body = document.getElementById('chat-body');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble received';
        bubble.innerHTML = text; 
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
    } else {
        if(!chatMeta[sender]) chatMeta[sender] = { unread: 0 };
        chatMeta[sender].unread++;
        showToast(sender, "New Message");
        updateMsgBadge();
        if(document.getElementById('screen-messages').classList.contains('active-screen')) {
            renderMessagesList();
        }
    }
}

function startGame() {
    gameStarted = true;
    checkRules(""); 
    document.getElementById('real-chat-input').style.display = 'flex';
    showToast("System", "Yapper App Unlocked");
}

let activeRules = [];
let currentText = "";

function isRuleDone(id) {
    const rule = activeRules.find(r => r.id === id);
    return rule && rule.status === true;
}

const RULES = [
    {
        id: 'start_sigh', sender: 'PR Team', text: "Start the apology with *sigh*. It makes you look human.",
        trigger: () => true, validator: (t) => t.trim().startsWith("*sigh*")
    },
    {
        id: 'min_length', sender: 'PR Team', text: "Good. Now, write a good apology for eating that kid's ice cream. Make it at least 30 characters.",
        trigger: () => isRuleDone('start_sigh'), 
        validator: (t) => t.length >= 30
    },
    {
        id: 'no_sorry', sender: 'Lawyer', text: "do NOT say stuff like \"sorry\" and \"apologize\" yo. you're gonna get us in trouble",
        trigger: () => isRuleDone('min_length'), 
        validator: (t) => {
            const lower = t.toLowerCase();
            return !lower.includes("sorry") && !lower.includes("apolog");
        }
    },
    {
        id: 'sponsor_plug', sender: 'Pepsi', text: "Hey, we need a plug. Mention \"Pepsi\" in a yap and we'll pay you.",
        trigger: () => isRuleDone('no_sorry'), 
        validator: (t) => t.toLowerCase().includes("pepsi")
    },
    {
        id: 'sponsor_code', sender: 'Pepsi', text: "Oh, also, drop the code: \"FREEVBUCKS999\".",
        trigger: () => isRuleDone('sponsor_plug'), 
        validator: (t) => t.includes("FREEVBUCKS999")
    },
    {
        id: 'roman_sum', sender: 'History Nerd', text: "The UPPERCASE Roman Numerals (I,V,X,L,C,D,M) in your yap must sum to 150.",
        trigger: () => isRuleDone('sponsor_code'),
        validator: (t) => {
            const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
            let sum = 0;
            for (let char of t) { if (map[char]) sum += map[char]; }
            return sum === 150;
        }
    },
    {
        id: 'math_sum', sender: 'Dumbass', text: "The digits in your yap must add up to exactly 67.",
        trigger: () => isRuleDone('roman_sum'),
        validator: (t) => {
            const digits = t.match(/\d/g);
            if (!digits) return false;
            const sum = digits.reduce((a, b) => parseInt(a) + parseInt(b), 0);
            return sum === 67;
        }
    },
    {
        id: 'prime_length', sender: 'Math Teacher', text: "The total character count must be a Prime Number.",
        trigger: () => isRuleDone('math_sum'), 
        validator: (t) => isPrime(t.length)
    }
];

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) { if (num % i === 0) return false; }
    return true;
}

function isSpam(text) {
    if (/(.)\1{4,}/.test(text)) return true;
    const words = text.split(/\s+/);
    if (words.some(w => w.length > 25)) return true;
    return false;
}

function checkRules(text) {
    if (!gameStarted) return;
    currentText = text;
    let allSatisfied = true;
    const btn = document.getElementById('post-btn');

    document.getElementById('yapper-counter').innerText = `${text.length} Chars`;

    if (isSpam(text)) {
        btn.classList.remove('active');
        btn.disabled = true;
        if (!window.spamWarned) {
            showToast("PR Team", "Stop spamming!");
            window.spamWarned = true;
            setTimeout(() => window.spamWarned = false, 3000);
        }
        return;
    }

    RULES.forEach(rule => {
        if (!activeRules.includes(rule) && rule.trigger(text)) {
            activeRules.push(rule);
            addReceivedMessage(rule.text, rule.sender); 
        }
    });

    activeRules.forEach(rule => {
        const isPassed = rule.validator(text);
        rule.status = isPassed; 
        if (!isPassed) allSatisfied = false;
    });

    if (activeRules.length === RULES.length && allSatisfied) {
        btn.classList.add('active');
        btn.disabled = false;
    } else {
        btn.classList.remove('active');
        btn.disabled = true;
    }
}

function handleLawyerInteraction() {
    const container = document.getElementById('script-choices');
    container.innerHTML = '';
    
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = "my bad cuh";
    btn.onclick = () => {
        sendMessageInternal("my bad cuh");
        container.style.display = 'none';
        lawyerInteracted = true;
        
        setTimeout(() => {
            const imgHTML = `<img src="../images/lawyer.jpg" style="width:100%; border-radius:10px; margin-top:5px;">`;
            addReceivedMessage(imgHTML, 'Lawyer');
        }, 1000);
    };
    
    container.appendChild(btn);
    container.style.display = 'flex';
}

function sendMessageInternal(text) {
    const body = document.getElementById('chat-body');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble sent';
    bubble.innerText = text;
    body.appendChild(bubble);
    
    const contact = document.getElementById('chat-contact-name').innerText;
    if(!chatHistory[contact]) chatHistory[contact] = [];
    chatHistory[contact].push({ text: text, type: 'sent' });
}

function renderMessagesList() {
    const list = document.querySelector('.msg-list');
    list.innerHTML = ''; 

    const allContacts = new Set([...Object.keys(chatHistory)]);
    if (gameStarted) {
        activeRules.forEach(r => allContacts.add(r.sender));
    }

    allContacts.forEach(sender => {
        const history = chatHistory[sender] || [];
        const lastMsg = history[history.length - 1];
        
        let preview = "";
        let textColorClass = "text-grey";
        let unreadCount = (chatMeta[sender] && chatMeta[sender].unread) || 0;

        if (unreadCount > 0) {
            preview = "New Message";
            textColorClass = "text-unread";
        } else {
            const pendingRule = activeRules.find(r => r.sender === sender && !r.status);
            
            if (pendingRule) {
                preview = pendingRule.text;
                textColorClass = "text-red";
            } else if (lastMsg) {
                preview = lastMsg.text.startsWith('<img') ? 'Sent an image' : lastMsg.text;
                textColorClass = "text-grey"; 
            }
        }

        const item = document.createElement('div');
        item.className = 'msg-item';
        item.onclick = () => openChat(sender);
        
        const color = stringToColor(sender);
        const nameDisplay = sender; 

        let html = `
            <div class="msg-avatar" style="background: ${color}">${sender[0]}</div>
            <div class="msg-text">
                <h4 style="font-weight:${unreadCount > 0 ? '700' : '400'}">${nameDisplay}</h4>
                <p class="${textColorClass}">${preview}</p>
            </div>
        `;
        
        if (unreadCount > 0) {
            html += `<div class="unread-dot"></div>`;
        }

        item.innerHTML = html;
        list.appendChild(item);
    });
}

function openChat(contact) {
    openApp('conversation');
    document.getElementById('chat-contact-name').innerText = contact;
    
    if(chatMeta[contact]) chatMeta[contact].unread = 0;
    updateMsgBadge();

    const body = document.getElementById('chat-body');
    body.innerHTML = '';
    
    const history = chatHistory[contact] || [];

    history.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.type}`;
        bubble.innerHTML = msg.text; 
        
        if (msg.type === 'received') {
            const rule = activeRules.find(r => r.text === msg.text);
            if (rule) {
                if (rule.status) {
                    bubble.style.color = "#2ecc71"; 
                    bubble.style.opacity = "0.7";
                } else {
                    bubble.style.color = "#ff4757"; 
                    bubble.style.fontWeight = "bold";
                }
            }
        }
        body.appendChild(bubble);
    });
    
    if (contact === 'PR Team' && !gameStarted && !gameFinished) {
        if (introStage === 0) showScriptChoices(["Hi", "No"]);
        else if (introStage === 1) showScriptChoices(["What are we going to do?"]);
    }

    if (contact === 'Lawyer' && !lawyerInteracted && gameStarted) {
        if (chatHistory['Lawyer'] && chatHistory['Lawyer'].length > 0) {
            handleLawyerInteraction();
        }
    }
    
    body.scrollTop = body.scrollHeight;
}

let toastTimeout;
function showToast(sender, msg) {
    const toast = document.getElementById('notification-toast');
    document.getElementById('toast-sender').innerText = sender;
    document.getElementById('toast-message').innerText = msg;
    
    toast.classList.remove('show');
    void toast.offsetWidth; 
    
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
}

function updateMsgBadge() {
    const iconBox = document.getElementById('msg-icon-box');
    let totalUnread = 0;
    for (let c in chatMeta) totalUnread += chatMeta[c].unread;

    const existing = iconBox.querySelector('.notification-badge');
    if (existing) existing.remove();

    if(totalUnread > 0) {
        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        badge.innerText = totalUnread > 9 ? '9+' : totalUnread;
        iconBox.appendChild(badge);
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}

function openApp(appName) {
    if (appName === 'yapper' && !gameStarted) { showToast("System", "App Locked"); return; }
    if (appName === 'yapper' && gameFinished) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
        document.getElementById('victory-screen').classList.add('active-screen');
        return;
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    const target = document.getElementById(`screen-${appName}`);
    if (target) {
        target.classList.add('active-screen');
        if (appName === 'messages') {
            renderMessagesList();
        }
    }
}

function goHome() { openApp('home'); }

function updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.querySelectorAll('.clock-display').forEach(el => el.innerText = t);
}

function openGoogle() { window.open('https://www.google.com', '_blank'); }

function openImageViewer(src) {
    const overlay = document.getElementById('image-overlay');
    document.getElementById('overlay-img').src = src;
    overlay.style.display = 'flex';
}
function closeImageViewer() { document.getElementById('image-overlay').style.display = 'none'; }

function handleToastClick() { openApp('messages'); }

function initCalendar() {
    const grid = document.getElementById('cal-grid-days');
    if(!grid) return;
    grid.innerHTML = '';
    for(let i=0; i<5; i++) grid.appendChild(document.createElement('div'));
    for (let day = 1; day <= 31; day++) {
        let el = document.createElement('div');
        el.className = 'cal-day';
        el.innerText = day;
        if (day === 14) {
            el.classList.add('event');
            el.onclick = () => showToast('Reminders', 'Anniversary <3');
        }
        grid.appendChild(el);
    }
}

let calcExpression = "";
function initCalculator() {}
function calcInput(val) {
    const display = document.getElementById('calc-display');
    if (val === 'C') { calcExpression = ""; display.innerText = "0"; }
    else if (val === '=') { try { calcExpression = eval(calcExpression).toString(); display.innerText = calcExpression; } catch { display.innerText = "Error"; calcExpression = ""; } }
    else { if (display.innerText === "0" || display.innerText === "Error") calcExpression = val; else calcExpression += val; display.innerText = calcExpression; }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    sendMessageInternal(text);
    input.value = '';
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
    for(let i=0; i<50; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + '%';
        el.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        el.style.animationDelay = Math.random() * 1 + 's';
        el.style.animationDuration = Math.random() * 2 + 2 + 's';
        el.style.animationName = 'confettiDrop';
        container.appendChild(el);
    }
}

function postApology() {
    gameFinished = true;
    triggerConfetti();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById('victory-screen').classList.add('active-screen');
    document.getElementById('final-apology-text').innerText = document.getElementById('apology-input').value;

    const comments = [
        { name: "StanAccount7", text: "omg bestie i forgive you 😭" },
        { name: "Pepsi", text: "Check is in the mail." },
        { name: "RandomUser", text: "Wait this is actually kinda sincere??" }
    ];

    const list = document.getElementById('comments-list');
    list.innerHTML = ''; 
    let i = 0;
    
    function addComment() {
        if (i >= comments.length) {
            setTimeout(() => {
                showToast("PR Team", "New Message");
                if(!chatHistory['PR Team']) chatHistory['PR Team'] = [];
                chatHistory['PR Team'].push({ text: "We did it, you're not going to be cancelled! ...For now.", type: 'received', isFinal: true });
                if(!chatMeta['PR Team']) chatMeta['PR Team'] = { unread: 0 };
                chatMeta['PR Team'].unread++;
                updateMsgBadge();
            }, 1000);
            return;
        }
        const c = comments[i];
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
            <div class="pfp" style="width:30px; height:30px; background:#${Math.floor(Math.random()*16777215).toString(16)}"></div>
            <div class="comment-text"><h5>${c.name}</h5><p>${c.text}</p></div>
        `;
        list.appendChild(item);
        i++;
        setTimeout(addComment, 800);
    }
    addComment();
}