document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const errorMsg = document.getElementById('error-msg');
    const loginTerminal = document.getElementById('login-terminal');
    const dashboardUI = document.getElementById('dashboard-ui');
    const logoutBtn = document.getElementById('logoutBtn');

    passwordInput.focus();
    
    document.addEventListener('click', () => {
        passwordInput.focus();
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = passwordInput.value;

            if (input === 'admin') {
                errorMsg.classList.add('hidden');
                
                const terminalOutput = document.getElementById('terminal-output');
                const p = document.createElement('p');
                p.style.color = '#00e676';
                p.innerText = '> ACCESS GRANTED. DECRYPTING ENVIRONMENT...';
                terminalOutput.appendChild(p);
                
                setTimeout(() => {
                    loginTerminal.style.display = 'none';
                    dashboardUI.classList.remove('hidden');
                    dashboardUI.style.animation = 'popIn 0.5s ease forwards';
                }, 1000);

            } else {
                errorMsg.classList.remove('hidden');
                passwordInput.value = ''; 
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        location.reload(); 
    });
});