AOS.init();
 
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/pages/Login/login.html';
}

// Adicione isso no início de home.js ou qualquer outra página protegida
if (!localStorage.getItem('user')) {
    window.location.href = '/pages/Login/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // Se não houver usuário logado, redireciona para a página de login
        window.location.href = '/pages/Login/login.html';
    } else {
        // Exibe mensagem de boas-vindas
        document.getElementById('welcomeMessage').textContent = `Bem-vindo, ${user.nome}!`;
    }

    // Lógica para o botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/pages/Login/login.html';
    });
});