let allUsers = [];
let filteredUsers = [];
const usersPerPage = 10;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
        window.location.href = '/Frontend/pages/admin-login/admin-login.html';
        return;
    }

    document.getElementById('viewUsers').addEventListener('click', fetchUsers);
    document.getElementById('logout').addEventListener('click', logout);

    fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await fetch('https://genotechfullstack.vercel.app/api/admin/users');
        const data = await response.json();
        if (data.success) {
            allUsers = data.users;
            filteredUsers = [...allUsers];
            displayUsers();
            setupPagination();
            setupSearch();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar usuários',
                text: data.message
            });
        }
    } catch (error) {
        console.error('Erro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão',
            text: 'Não foi possível conectar com o servidor'
        });
    }
}

function displayUsers() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Lista de Usuários</h2>';
    
    const searchDiv = document.createElement('div');
    searchDiv.innerHTML = `
        <form id="searchForm" class="search-container">
            <input type="text" id="searchInput" placeholder="Pesquisar usuários...">
            <select id="filterSelect">
                <option value="all">Todos</option>
                <option value="name">Nome</option>
                <option value="email">Email</option>
            </select>
            <button type="submit" id="searchButton" class="search-button">Buscar</button>
        </form>
    `;
    content.appendChild(searchDiv);

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
        </tr>
    `;

    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    paginatedUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.nome}', '${user.email}')">Editar</button>
                <button onclick="deleteUser(${user.id})">Deletar</button>
            </td>
        `;
        table.appendChild(tr);
    });
    content.appendChild(table);

    const paginationDiv = document.createElement('div');
    paginationDiv.id = 'pagination';
    content.appendChild(paginationDiv);

    // Adicionar estilos
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            display: flex;
            margin-bottom: 20px;
        }
        #searchInput {
            flex-grow: 1;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
        }
        #filterSelect {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-left: none;
            background-color: #f8f8f8;
        }
        .search-button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .search-button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);
}

function setupPagination() {
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            displayUsers();
        });
        paginationDiv.appendChild(btn);
    }
}

function setupSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    function performSearch(e) {
        if (e) e.preventDefault(); // Previne o comportamento padrão do formulário

        const searchTerm = searchInput.value.toLowerCase();
        const filterType = filterSelect.value;

        filteredUsers = allUsers.filter(user => {
            if (filterType === 'name') {
                return user.nome.toLowerCase().includes(searchTerm);
            } else if (filterType === 'email') {
                return user.email.toLowerCase().includes(searchTerm);
            } else {
                return user.nome.toLowerCase().includes(searchTerm) || 
                       user.email.toLowerCase().includes(searchTerm);
            }
        });

        currentPage = 1;
        displayUsers();
        setupPagination();
    }

    searchForm.addEventListener('submit', performSearch);
    searchInput.addEventListener('input', performSearch);
    filterSelect.addEventListener('change', performSearch);
}

async function editUser(userId, userName, userEmail) {
    const { value: formValues } = await Swal.fire({
        title: 'Editar Usuário',
        html:
            `<input id="swal-input1" class="swal2-input" value="${userName}" placeholder="Nome">` +
            `<input id="swal-input2" class="swal2-input" value="${userEmail}" placeholder="Email">`,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        }
    });

    if (formValues) {
        const [newName, newEmail] = formValues;
        try {
            const response = await fetch(`https://genotechfullstack.vercel.app/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: newName, email: newEmail })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('Sucesso', 'Usuário atualizado com sucesso!', 'success');
                fetchUsers(); // Recarrega a lista de usuários
            } else {
                Swal.fire('Erro', 'Erro ao atualizar usuário: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            Swal.fire('Erro', 'Erro ao conectar com o servidor', 'error');
        }
    }
}

async function deleteUser(userId) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: `Você está prestes a deletar o usuário com ID: ${userId}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://genotechfullstack.vercel.app/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('Deletado!', 'Usuário deletado com sucesso.', 'success');
                fetchUsers(); // Recarrega a lista de usuários
            } else {
                Swal.fire('Erro', 'Erro ao deletar usuário: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            Swal.fire('Erro', 'Erro ao conectar com o servidor', 'error');
        }
    }
}

async function logout() {
    try {
        localStorage.removeItem('admin');
        await Swal.fire({
            icon: 'success',
            title: 'Logout Realizado',
            text: 'Você foi desconectado com sucesso.',
            timer: 2000,
            showConfirmButton: false
        });
        window.location.href = '/Frontend/pages/admin-login/admin-login.html';
    } catch (error) {
        console.error('Erro durante o logout:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro no Logout',
            text: 'Ocorreu um erro ao tentar fazer logout. Por favor, tente novamente.',
        });
    }
}