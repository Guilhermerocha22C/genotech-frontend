import { verificarTema, trocarTema } from "../../helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button")
const body = document.querySelector("body")
const assunto = localStorage.getItem("assunto")
const botaoJogarNovamente = document.querySelector("main button")

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema)
})

botaoJogarNovamente.addEventListener("click", jogarNovamente)

verificarTema(body, botaoTema)

function alterarAssunto() {
    const divIcone = document.querySelector(".assunto_icone")
    const iconeImg = document.querySelector(".assunto_icone img")
    const assuntoTitulo = document.querySelector(".assunto h1")

    const assuntoClass = assunto.toLowerCase().replace(/\s+/g, '-');
    const assuntoSrc = assuntoClass.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    divIcone.classList.add(assuntoClass)
    iconeImg.setAttribute("src", `/pages/quiz/assets/images/icon-${assuntoSrc}.svg`)
    iconeImg.setAttribute("alt", `ícone de ${assunto}`)
    assuntoTitulo.innerText = assunto
}

alterarAssunto()

function inserirResultado() {
    const sectionPontuacao = document.querySelector(".pontuacao")
    const divAssunto = document.querySelector(".assunto")
    const pontos = localStorage.getItem("pontos")

    sectionPontuacao.innerHTML = `
        ${divAssunto.outerHTML}
        <strong>${pontos}</strong>
        <p>de 10</p>
    `
}

function jogarNovamente() {
    localStorage.removeItem("pontos")
    localStorage.removeItem("assunto")

    window.location.href = "../../quizHome.html"
}

inserirResultado()
