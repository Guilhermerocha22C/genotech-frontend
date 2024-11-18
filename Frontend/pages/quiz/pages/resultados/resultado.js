import { verificarTema, trocarTema } from "../../helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button");
const body = document.querySelector("body");
const assunto = localStorage.getItem("assunto");
const botaoJogarNovamente = document.querySelector("main button");

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema);
});

botaoJogarNovamente.addEventListener("click", jogarNovamente);

verificarTema(body, botaoTema);

function alterarAssunto() {
    const divIcone = document.querySelector(".assunto_icone");
    const iconeImg = document.querySelector(".assunto_icone img");
    const assuntoTitulo = document.querySelector(".assunto h1");

    if (assunto) {
        const assuntoClass = assunto.toLowerCase().replace(/\s+/g, '-');
        const assuntoSrc = assuntoClass.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        divIcone.classList.add(assuntoClass);
        iconeImg.setAttribute("src", `/Frontend/pages/quiz/assets/images/icon-${assuntoSrc}.svg`);
        iconeImg.setAttribute("alt", `ícone de ${assunto}`);
        assuntoTitulo.innerText = assunto;
    }
}

function inserirResultado() {
    const sectionPontuacao = document.querySelector(".pontuacao");
    const divAssunto = document.querySelector(".assunto");
    const acertos = localStorage.getItem("acertos");

    console.log("Acertos recuperados:", acertos); // Para depuração

    if (acertos !== null) {
        sectionPontuacao.innerHTML = `
            ${divAssunto.outerHTML}
            <strong>${acertos}</strong>
            <p>de 10</p>
        `;

        const xpPorAcerto = 10;
        const xpIncremento = parseInt(acertos) * xpPorAcerto;

        atualizarUsuario(acertos, xpIncremento);
    } else {
        console.error("Acertos não encontrados no localStorage");
        sectionPontuacao.innerHTML = `
            ${divAssunto.outerHTML}
            <strong>Erro</strong>
            <p>Pontuação não disponível</p>
        `;
    }
}

async function atualizarUsuario(acertos, xpIncremento) {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('ID do usuário não encontrado');
        }

        console.log('Enviando atualização para o usuário:', userId);
        console.log('Acertos:', acertos);
        console.log('XP Incremento:', xpIncremento);

        const response = await fetch('genotechfullstack.vercel.app/api/atualizar-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, acertos, xpIncremento }),
        });

        console.log('Status da resposta:', response.status);
        const responseText = await response.text();
        console.log('Resposta completa:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }

        console.log('Usuário atualizado com sucesso');
        await exibirRanking();
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
        alert("Erro ao atualizar pontuação. Por favor, tente novamente mais tarde.");
    }
}

async function exibirRanking() {
    try {
        console.log('Buscando ranking...');
        const response = await fetch('genotechfullstack.vercel.app/api/ranking');
        console.log('Status da resposta do ranking:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados do ranking:', data);

        if (data.success) {
            const rankingList = document.querySelector('.ranking-list');
            if (rankingList) {
                rankingList.innerHTML = data.ranking.map((user, index) => `
                    <li>
                        <span class="position">${index + 1}</span>
                        <span class="name">${user.nome}</span>
                        <span class="points">${user.pontos}</span>
                    </li>
                `).join('');
                console.log('Ranking atualizado com sucesso');
            } else {
                console.error('Elemento .ranking-list não encontrado. Verifique se foi adicionado ao HTML.');
            }
        } else {
            console.error('Erro ao buscar ranking:', data.message);
        }
    } catch (error) {
        console.error('Erro ao buscar ranking:', error);
    }
}

function jogarNovamente() {
    localStorage.removeItem("acertos");
    localStorage.removeItem("assunto");
    window.location.href = "../../quizHome.html";
}

document.addEventListener('DOMContentLoaded', () => {
    alterarAssunto();
    inserirResultado();
    exibirRanking();
});