AOS.init();

function isAuthenticated() {
    const user = localStorage.getItem('user');
    console.log('User data in localStorage:', user); // Log para depuração
    return !!user;
}

function redirectToLogin() {
    console.log('Redirecting to login page'); // Log para depuração
    window.location.href = '/pages/Login/login.html';
}

function initHomePage() {
    console.log('Initializing home page'); // Log para depuração
    if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting'); // Log para depuração
        redirectToLogin();
        return;
    }

    console.log('User authenticated, updating UI'); // Log para depuração
    const user = JSON.parse(localStorage.getItem('user'));
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Bem-vindo, ${user.nome}!`;
    } else {
        console.error('Welcome message element not found'); // Log para depuração
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Logout clicked'); // Log para depuração
            localStorage.removeItem('user');
            redirectToLogin();
        });
    } else {
        console.error('Logout button not found'); // Log para depuração
    }
}

document.addEventListener('DOMContentLoaded', initHomePage);

// Adicione este código para verificar se o usuário já está autenticado ao carregar a página
if (isAuthenticated()) {
    console.log('User already authenticated, staying on home page'); // Log para depuração
} else {
    console.log('User not authenticated on page load'); // Log para depuração
}