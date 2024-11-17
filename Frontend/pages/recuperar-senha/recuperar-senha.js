document.getElementById('recuperarSenhaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch('http://localhost:3001/api/recuperar-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('message').textContent = 'Um link de recuperação foi enviado para o seu e-mail.';
            document.getElementById('message').style.color = 'green';
        } else {
            document.getElementById('message').textContent = data.message;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        document.getElementById('message').textContent = 'Erro ao conectar com o servidor.';
        document.getElementById('message').style.color = 'red';
    }
});