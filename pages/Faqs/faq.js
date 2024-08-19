document.querySelectorAll('.pergunta-faq').forEach(botao => {
    botao.addEventListener('click', () => {
        const resposta = botao.nextElementSibling;
        const ativo = botao.classList.contains('ativo');

        document.querySelectorAll('.pergunta-faq').forEach(item => {
            item.classList.remove('ativo');
            item.nextElementSibling.style.display = 'none';
        });

        if (!ativo) {
            botao.classList.add('ativo');
            resposta.style.display = 'block';
        }
    });
});
