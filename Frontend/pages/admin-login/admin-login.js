document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');

    adminLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('https://genotech-backend.vercel.app/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('admin', JSON.stringify(data.admin));
                
                // Alerta de login bem-sucedido
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Bem-sucedido!',
                    text: `Bem-vindo!`,
                    timer: 2000,
                    showConfirmButton: false
                });
                
                window.location.href = '/pages/AdminDashboard/admin-dashboard.html';
            } else {
                // Alerta de erro no login
                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Login',
                    text: data.message || 'Credenciais inválidas. Por favor, tente novamente.',
                });
            }
        } catch (error) {
            console.error('Erro ao fazer login admin:', error);
            
            // Alerta de erro de conexão
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.',
            });
        }
    });
});