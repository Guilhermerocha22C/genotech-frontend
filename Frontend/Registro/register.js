import { verificarTema, trocarTema } from "../pages/quiz/helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button");
const body = document.querySelector("body");

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema);
});

verificarTema(body, botaoTema);

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const messageElement = document.getElementById('message');
    
    if (!nome || !email || !senha) {
        messageElement.textContent = 'Por favor, preencha todos os campos.';
        messageElement.style.color = 'red';
        return;
    }
    
    try {
        const response = await fetch('https://genotechfullstack.vercel.app/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageElement.textContent = 'Cadastro realizado com sucesso!';
            messageElement.style.color = 'green';
            // Redirecionar para a página de login após um breve delay
            setTimeout(() => {
                window.location.href = '/Frontend/pages/Login/login.html';
            }, 2000);
        } else {
            if (data.message === "Usuário já existe") {
                messageElement.textContent = 'Não foi possível completar o registro.\nVerifique suas informações ou tente fazer login.';
            } else {
                messageElement.textContent = data.message || 'Erro ao cadastrar. Por favor, tente novamente.';
            }
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        messageElement.textContent = 'Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.';
        messageElement.style.color = 'red';
    }
});