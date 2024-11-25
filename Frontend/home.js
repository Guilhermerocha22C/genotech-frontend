AOS.init();

function isAuthenticated() {
    return !!localStorage.getItem('user');
}

function redirectToLogin() {
    window.location.href = '/pages/Login/login.html';
}

function initHomePage() {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('welcomeMessage').textContent = `Bem-vindo, ${user.nome}!`;

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        redirectToLogin();
    });
}

document.addEventListener('DOMContentLoaded', initHomePage);