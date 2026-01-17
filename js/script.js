document.addEventListener("DOMContentLoaded", () => {
    
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.classList.add('hidden');
        
        setTimeout(() => {
            splash.style.display = 'none';
        }, 1000); 
    }, 2200);

    console.log("%c SYSTEM: ONLINE ", "background: #000; color: #ff80ab; font-size: 12px; padding: 5px; border: 1px solid #ff80ab;");
    console.log("Welcome to the console. If you're looking for bugs, you might find features instead.");

});