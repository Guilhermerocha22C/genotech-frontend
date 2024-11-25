import { verificarTema, trocarTema } from "../quiz/helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button");
const body = document.querySelector("body");

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema);
});

verificarTema(body, botaoTema);

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        console.log('Formulário enviado');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            document.getElementById('message').textContent = 'Por favor, complete o reCAPTCHA.';
            document.getElementById('message').style.color = 'red';
            return;
        }

        try {
            const response = await fetch('https://genotech-backend.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, recaptchaResponse }),
            });

            const data = await response.json();

            if (data.success) {
                // Login bem-sucedido
                localStorage.setItem('userData', JSON.stringify(data.user));
                localStorage.setItem('userId', data.user.id); 
                console.log('Dados do usuário após login:', data.user);
                console.log('ID do usuário armazenado:', data.user.id);
                window.location.href = '/index.html'; 
            } else {
                // Login falhou
                document.getElementById('message').textContent = data.message;
                document.getElementById('message').style.color = 'red';
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            document.getElementById('message').textContent = 'Erro ao conectar com o servidor.';
            document.getElementById('message').style.color = 'red';
        }
    });
});