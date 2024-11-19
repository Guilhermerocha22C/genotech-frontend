let imageFile = null;

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
            imageFile = file;
        }
        reader.readAsDataURL(file);
    }
});

async function updateProfile() {
    const newName = document.getElementById('usernameInput').value;
    if (!newName) {
        alert('Por favor, insira um nome de usuário.');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.id) {
        alert('Erro: Dados do usuário não encontrados. Por favor, faça login novamente.');
        logout();
        return;
    }
    
    const formData = new FormData();
    formData.append('nome', newName);
    if (imageFile) {
        formData.append('profileImage', imageFile);
    }

    try {
        const response = await fetch(`https://genotech-backend.vercel.app/api/user/update/${userData.id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            userData.nome = newName;
            if (data.imageUrl) {
                userData.profileImageUrl = `https://genotech-backend.vercel.app${data.imageUrl}`;
            }
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Perfil atualizado com sucesso!');
            loadUserData(); // Recarrega os dados do usuário
        } else {
            alert('Erro ao atualizar perfil: ' + (data.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil: ' + error.message);
    }
}

async function loadUserData() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        console.log('Usuário não está logado');
        window.location.href = '/pages/Login/login.html';
        return;
    }

    const user = JSON.parse(userData);
    console.log('Dados do usuário do localStorage:', user);

    try {
        const response = await fetch(`https://genotech-backend.vercel.app/api/user/${user.id}`);
        const data = await response.json();
        
        if (data.success) {
            const updatedUser = data.user;
            console.log('Dados atualizados do usuário:', updatedUser);
            console.log('É admin?', updatedUser.isAdmin); // Adicione esta linha
            
            // Atualizar localStorage com os dados mais recentes
            localStorage.setItem('userData', JSON.stringify(updatedUser));

            document.getElementById('usernameInput').value = updatedUser.nome;
            document.getElementById('emailInput').value = updatedUser.email;

            const adminStar = document.getElementById('adminStar');
if (updatedUser.isAdmin) {
    adminStar.style.display = 'inline';
} else {
    adminStar.style.display = 'none';
}

            const profileImageElement = document.getElementById('profileImage');
            if (updatedUser.profileImageUrl) {
                profileImageElement.src = updatedUser.profileImageUrl;
                profileImageElement.onerror = function() {
                    setDefaultImage();
                };
            } else {
                setDefaultImage();
            }
        } else {
            console.error('Erro ao buscar dados atualizados do usuário');
            setDefaultImage();
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setDefaultImage();
    }
}

function setDefaultImage() {
    const defaultImagePath = '/Assets home/imagem-do-usuario-com-fundo-preto.png';
    console.log('Definindo imagem padrão:', defaultImagePath);
    document.getElementById('profileImage').src = defaultImagePath;
}

function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/pages/Login/login.html';
}

window.addEventListener('load', loadUserData);