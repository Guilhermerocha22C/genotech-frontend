document.addEventListener('DOMContentLoaded', () => {
    // Obter o token da URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        document.getElementById('token').value = token;
    } else {
        document.getElementById('message').textContent = 'Token inválido ou ausente.';
        document.getElementById('redefinirSenhaForm').style.display = 'none';
    }
});

function redirecionarParaLogin() {
    setTimeout(() => {
        window.location.href = '../Login/login.html'; // Ajuste o caminho conforme necessário
    }, 3000); // 3000 milissegundos = 3 segundos
}

document.getElementById('redefinirSenhaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const token = document.getElementById('token').value;
    
    if (novaSenha !== confirmarSenha) {
        document.getElementById('message').textContent = 'As senhas não coincidem.';
        document.getElementById('message').style.color = 'red';
        return;
    }
    
    try {
        const response = await fetch('https://genotech-backend.vercel.app/api/redefinir-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, novaSenha }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('message').textContent = 'Senha redefinida com sucesso! Redirecionando para a página de login...';
            document.getElementById('message').style.color = 'green';
            document.getElementById('redefinirSenhaForm').style.display = 'none';
            redirecionarParaLogin(); // Chama a função de redirecionamento
        } else {
            document.getElementById('message').textContent = data.message;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        document.getElementById('message').textContent = 'Erro ao conectar com o servidor.';
        document.getElementById('message').style.color = 'red';
    }
});