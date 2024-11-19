import { verificarTema, trocarTema } from "../quiz/helpers/tema-helper.js";

const botaoTema = document.querySelector(".tema button");
const body = document.querySelector("body");

botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema);
});

verificarTema(body, botaoTema);

async function exibirRanking() {
    try {
        console.log('Iniciando busca do ranking...');
        const response = await fetch('https://genotechfullstack.vercel.app/api/ranking');
        const data = await response.json();
        console.log('Dados recebidos:', data);

        const rankingList = document.querySelector('.ranking-list');

        if (data.success && rankingList) {
            rankingList.innerHTML = data.ranking.map((user, index) => {
                console.log('Dados do usuário:', user);
                console.log('profile_image_url:', user.profile_image_url);

                const fotoURL = user.profile_image_url
                    ? `https://genotechfullstack.vercel.app${user.profile_image_url}`
                    : '/Frontend/Assets home/imagem-do-usuario-com-fundo-preto.png';

                const isDefault = !user.profile_image_url;
                const adminStar = user.isAdmin ? 
    `<span class="admin-star">
        <i class="fas fa-star"></i>
        <span class="tooltip">Desenvolvedor do Sistema</span>
     </span>` : '';
     console.log('Is Admin:', user.isAdmin);
console.log('Admin Star HTML:', adminStar);

                console.log('URL da foto:', fotoURL);

                return `
                    <li>
                        <img src="${fotoURL}" 
                             alt="Foto de Perfil de ${user.nome}" 
                             class="profile-pic ${isDefault ? 'default-pic' : ''}"
                             onerror="this.src='/Frontend/Assets home/imagem-do-usuario-com-fundo-preto.png';">
                        <span class="position">${index + 1}</span>
                        <span class="name">${user.nome} ${adminStar}</span>
                        <span class="points">${user.pontos} XP</span>
                    </li>
                `;
            }).join('');

            adicionarEventoClickImagens();
        } else {
            console.error('Falha ao obter dados do ranking ou elemento não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar ranking:', error);
    }
}

function adicionarEventoClickImagens() {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const images = document.querySelectorAll(".ranking-list .profile-pic");
    const span = document.getElementsByClassName("close")[0];

    if (!modal) {
        console.error("Modal não encontrado. Certifique-se de adicionar o HTML do modal.");
        return;
    }

    modal.style.display = "none";

    images.forEach(function(image) {
        image.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            modalImg.className = 'modal-content'; 
            if (this.classList.contains('default-pic')) {
                modalImg.classList.add('default-pic');
            }
        }
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    exibirRanking().then(() => {
        console.log('Ranking exibido com sucesso');
    }).catch(error => {
        console.error('Erro ao exibir ranking:', error);
    });
});