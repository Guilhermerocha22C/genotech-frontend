# GenoTech Frontend

Este é o repositório do frontend para o projeto GenoTech, uma plataforma educacional interativa focada em genética e biotecnologia.

## Funcionalidades

1. Interface de usuário responsiva
2. Sistema de login e registro
3. Perfil de usuário editável
4. Quiz interativo sobre genética e biotecnologia
5. Visualização de ranking de usuários
6. Tema claro/escuro alternável
7. Visualização 3D de moléculas
8. Tabela periódica interativa
9. Página inicial informativa sobre o projeto

## Tecnologias Utilizadas

- **HTML5**: Estruturação do conteúdo
- **CSS3**: Estilização e layout responsivo
- **JavaScript**: Programação do lado do cliente
- **Fetch API**: Para requisições HTTP ao backend
- **LocalStorage**: Para armazenamento local de dados do usuário
- **Three.js**: Para renderização 3D de moléculas
- **Font Awesome**: Para ícones
- **CSS Grid e Flexbox**: Para layouts responsivos
- **Media Queries**: Para design responsivo

## Configuração e Instalação

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. Para desenvolvimento, recomenda-se usar um servidor local (como Live Server no VS Code)

## Estrutura do Projeto

- `/pages`: Diferentes páginas da aplicação (login, perfil, quiz, etc.)
- `/assets`: Recursos estáticos como imagens e ícones

## Principais Componentes

- Página Inicial: Introdução ao projeto GenoTech
- Sistema de Autenticação: Login e registro de usuários
- Perfil de Usuário: Visualização e edição de informações do usuário
- Quiz: Interface interativa para responder perguntas sobre genética
- Ranking: Exibição da classificação dos usuários
- Visualizador 3D: Renderização de moléculas em 3D
- Tabela Periódica: Versão interativa da tabela periódica

## Integração com Backend

O frontend se comunica com o backend através de uma API RESTful. As principais integrações incluem:

- Autenticação de usuários
- Atualização de perfil
- Submissão de respostas do quiz
- Recuperação de dados para o ranking
