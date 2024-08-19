import { verificarTema, trocarTema } from "../../helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button");
const body = document.querySelector("body");
const assunto = localStorage.getItem("assunto");

let quiz = {};
let pontos = 0;
let pergunta = 1;
let resposta = "";
let idInputResposta = "";
let respostaCorretaId = "";

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema);
});

verificarTema(body, botaoTema);

function alterarAssunto() {
    const divIcone = document.querySelector(".assunto_icone");
    const iconeImg = document.querySelector(".assunto_icone img");
    const assuntoTitulo = document.querySelector(".assunto h1");

    const assuntoFormatado = assunto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

    const caminhoImagem = `/pages/quiz/assets/images/icon-${assuntoFormatado}.svg`;

    divIcone.classList.add(assuntoFormatado);
    iconeImg.setAttribute("src", caminhoImagem);
    iconeImg.setAttribute("alt", `ícone de ${assunto}`);
    assuntoTitulo.innerText = assunto;
}

async function buscarPerguntas() {
    const urlDados = "../../data.json";

    await fetch(urlDados).then(resposta => resposta.json()).then(dados => {
        dados.quizzes.forEach(dado => {
            if (dado.title === assunto) {
                quiz = dado;
            }
        });
    });
}

function montarPergunta() {
    const main = document.querySelector("main");

    const options = quiz.questions[pergunta - 1].options.sort(() => Math.random() - 0.5);

    main.innerHTML = `
        <section class="pergunta">
            <div>
                <p>Questão ${pergunta} de 10</p>
                <h2>${alterarSinais(quiz.questions[pergunta - 1].question)}</h2>
            </div>
            <div class="barra_progresso">
                <div style="width: ${pergunta * 10}%"></div>
            </div>
        </section>
        <section class="alternativas">
            <form action="">
                ${options.map((option, index) => `
                    <label for="alternativa_${index}">
                        <input type="radio" id="alternativa_${index}" name="alternativa" value="${alterarSinais(option)}">
                        <div>
                            <span>${String.fromCharCode(65 + index)}</span>
                            ${alterarSinais(option)}
                        </div>
                    </label>
                `).join('')}
            </form>
            <button id="btnResponder" disabled>Responder</button>
        </section>
    `;

    const botaoEnviar = document.getElementById("btnResponder");

    botaoEnviar.removeEventListener("click", validarResposta);

    const inputsResposta = document.querySelectorAll(".alternativas input");
    inputsResposta.forEach(input => {
        input.addEventListener("click", () => {
            botaoEnviar.disabled = false;
        });
    });

    botaoEnviar.addEventListener("click", validarResposta);
}

function alterarSinais(texto) {
    return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function guardarResposta(evento) {
    resposta = evento.target.value;
    idInputResposta = evento.target.id;

    const botaoEnviar = document.querySelector(".alternativas button");
    botaoEnviar.addEventListener("click", validarResposta);
}

function validarResposta() {
    const botaoEnviar = document.querySelector(".alternativas button");
    botaoEnviar.innerText = "Próxima";
    botaoEnviar.removeEventListener("click", validarResposta);

    if (pergunta === 10) {
        botaoEnviar.innerText = "Finalizar";
        botaoEnviar.addEventListener("click", finalizar);
    } else {
        botaoEnviar.addEventListener("click", proximaPergunta);
    }

    if (resposta === quiz.questions[pergunta - 1].answer) {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "correta");
        pontos += 1;
    } else {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "errada");
        document.querySelector(`label[for='${respostaCorretaId}']`).setAttribute("id", "correta");
    }

    pergunta += 1;
}

function finalizar() {
    localStorage.setItem("pontos", pontos);
    window.location.href = "../resultados/resultado.html";
}

function proximaPergunta() {
    montarPergunta();
    adicionarEventoInputs();
}

function adicionarEventoInputs() {
    const inputsResposta = document.querySelectorAll(".alternativas input");
    inputsResposta.forEach(input => {
        input.addEventListener("click", guardarResposta);

        if (input.value === quiz.questions[pergunta - 1].answer) {
            respostaCorretaId = input.id;
        }
    });
}

async function iniciar() {
    alterarAssunto();
    await buscarPerguntas();
    montarPergunta();
    adicionarEventoInputs();
}

iniciar();
