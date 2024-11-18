require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)){
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../Frontend')));
app.use('/uploads', express.static(uploadsPath));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
      charset: 'utf8mb4',
      connectTimeout: 20000
});

// Estabelecer conexão com o banco de dados
con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conexão com o banco de dados estabelecida!');
});

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rota principal - serve a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/pages/Login/login.html'));
});

// Rota para buscar dados do usuário
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    con.query('SELECT id, nome, email, profile_image_url FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        const user = results[0];
        user.profileImageUrl = user.profile_image_url 
            ? `genotechfullstack.vercel.app${user.profile_image_url}`
            : null;
            user.isAdmin = adminEmails.includes(user.email); 
        res.json({ success: true, user });
    });
});

// Rota de login de admin
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Tentativa de login admin:', email);

    con.query('SELECT * FROM `admin` WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Erro na consulta de login admin:', err);
            return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }

        if (rows.length > 0) {
            const admin = rows[0];
            if (password === admin.senha) {
                console.log('Login admin bem-sucedido:', email);
                delete admin.senha;
                res.status(200).json({ success: true, message: 'Autenticado como admin', admin });
            } else {
                console.log('Senha incorreta para o email:', email);
                res.status(401).json({ success: false, message: 'Usuário ou Senha inválidos' });
            }
        } else {
            console.log('Nenhum usuário admin encontrado com o email:', email);
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});

// Lista de emails de administradores
const adminEmails = [
    'gui23rocha@gmail.com',
    'Joaopedrosousa2909@gmail.com',
    'fabriciofrei01@gmail.com',
    'anderson2007lvs123@gmail.com'
];

// Rota de login de usuário com reCAPTCHA
app.post('/api/login', async (req, res) => {
    const { email, password, recaptchaResponse } = req.body;
    console.log('Tentativa de login:', email);
    console.log('reCAPTCHA response:', recaptchaResponse);

    // Verificar reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';

    try {
        const recaptchaVerify = await axios.post(verifyURL, null, {
            params: {
                secret: secretKey,
                response: recaptchaResponse
            }
        });

        console.log('reCAPTCHA verification result:', recaptchaVerify.data);

        if (!recaptchaVerify.data.success) {
            console.log('reCAPTCHA verification failed');
            return res.status(400).json({ success: false, message: 'reCAPTCHA inválido' });
        }

        // Continuar com a lógica de login existente
        con.query('SELECT * FROM `usuarios` WHERE email = ?', [email], (err, rows) => {
            if (err) {
                console.error('Erro na consulta de login:', err);
                return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
            }

            if (rows.length > 0) {
                const user = rows[0];
                if (password === user.senha) {
                    console.log('Login bem-sucedido:', email);
                    delete user.senha;
                    // Sempre incluir a URL completa da imagem de perfil
                    user.profileImageUrl = user.profile_image_url 
                        ? `genotechfullstack.vercel.app${user.profile_image_url}`
                        : null;
                    console.log('Dados do usuário enviados:', user);
                    res.status(200).json({ 
                        success: true, 
                        message: 'Autenticado', 
                        user: {
                            id: user.id,
                            nome: user.nome,
                            email: user.email,
                            profileImageUrl: user.profileImageUrl,
                            isAdmin: adminEmails.includes(user.email) // Verifica se é admin
                        }
                    });
                } else {
                    console.log('Senha incorreta para o email:', email);
                    res.status(401).json({ success: false, message: 'Usuário ou Senha inválidos' });
                }
            } else {
                console.log('Nenhum usuário encontrado com o email:', email);
                res.status(404).json({ success: false, message: 'Usuário não encontrado' });
            }
        });
    } catch (error) {
        console.error('Erro ao verificar reCAPTCHA:', error);
        res.status(500).json({ success: false, message: 'Erro ao verificar reCAPTCHA' });
    }
});

// Rota de registro de usuário
app.post('/api/register', (req, res) => {
    const { nome, email, senha } = req.body;
    console.log('Tentativa de registro:', { nome, email });

    con.query('SELECT * FROM `usuarios` WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar usuário existente:', err);
            return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }

        if (results.length > 0) {
            console.log('Tentativa de registro com email já existente:', email);
            return res.status(400).json({ success: false, message: 'Usuário já existe' });
        }
        // eslint-disable-next-line no-unused-vars
        con.query('INSERT INTO `usuarios` (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (err, result) => {
            if (err) {
                console.error('Erro ao inserir novo usuário:', err);
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
            }

            console.log('Usuário cadastrado com sucesso:', { nome, email });
            res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso' });
        });
    });
});

// Rota para buscar usuários (para o dashboard admin)
app.get('/api/admin/users', (req, res) => {
    con.query('SELECT id, nome, email FROM usuarios', (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
        res.json({ success: true, users: results });
    });
});

// Rota para servir o dashboard admin
app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/pages/AdminDashboard/admin-dashboard.html'));
});

// Rota para atualizar o perfil do usuário
app.put('/api/user/update/:id', upload.single('profileImage'), (req, res) => {
    const userId = req.params.id;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ success: false, message: 'Nome não fornecido' });
    }

    let updateQuery = 'UPDATE usuarios SET nome = ?';
    let queryParams = [nome];

    if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        updateQuery += ', profile_image_url = ?';
        queryParams.push(imageUrl);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(userId);

    con.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json({ 
            success: true, 
            message: 'Usuário atualizado com sucesso',
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });
    });
});

// Rota para editar usuário
app.put('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, email } = req.body;

    const query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
    con.query(query, [nome, email, userId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json({ success: true, message: 'Usuário atualizado com sucesso' });
    });
});

// Rota para deletar usuário
app.delete('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao deletar usuário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json({ success: true, message: 'Usuário deletado com sucesso' });
    });
});

// Função para enviar e-mail de recuperação
async function enviarEmailRecuperacao(email, token) {
    const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5501';
    const resetUrl = `${baseUrl}/Frontend/pages/redefinir-senha/redefinir-senha.html?token=${token}`;

    const msg = {
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Recuperação de Senha',
        text: `Você solicitou a recuperação de senha. Clique no link a seguir para redefinir sua senha: ${resetUrl}`,
        html: `<p>Você solicitou a recuperação de senha. Clique no link a seguir para redefinir sua senha:</p>
               <a href="${resetUrl}">Redefinir Senha</a>`,
    };

    try {
        await sgMail.send(msg);
        console.log('E-mail enviado com sucesso para:', email);
        return true;
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error.message);
        if (error.response) {
            console.error('Detalhes do erro:', error.response.body);
        }
        return false;
    }
}

// Rota para recuperação de senha
app.post('/api/recuperar-senha', (req, res) => {
    const { email } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    con.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar solicitação' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'E-mail não encontrado' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const updateQuery = 'UPDATE usuarios SET reset_token = ?, reset_token_expiration = ? WHERE email = ?';
        const expirationDate = new Date(Date.now() + 3600000); // Token válido por 1 hora
        con.query(updateQuery, [token, expirationDate, email], async (updateErr) => {
            if (updateErr) {
                console.error('Erro ao armazenar token:', updateErr);
                return res.status(500).json({ success: false, message: 'Erro ao processar solicitação' });
            }

            const emailEnviado = await enviarEmailRecuperacao(email, token);

            if (emailEnviado) {
                res.json({ success: true, message: 'E-mail de recuperação enviado com sucesso' });
            } else {
                res.status(500).json({ success: false, message: 'Erro ao enviar e-mail de recuperação' });
            }
        });
    });
});

app.post('/api/redefinir-senha', (req, res) => {
    const { token, novaSenha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiration > NOW()';
    con.query(query, [token], (err, results) => {
        if (err) {
            console.error('Erro ao verificar token:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar solicitação' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Token inválido ou expirado' });
        }

        const usuario = results[0];

        const updateQuery = 'UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?';
        con.query(updateQuery, [novaSenha, usuario.id], (updateErr) => {
            if (updateErr) {
                console.error('Erro ao atualizar senha:', updateErr);
                return res.status(500).json({ success: false, message: 'Erro ao redefinir senha' });
            }

            res.json({ success: true, message: 'Senha redefinida com sucesso' });
        });
    });
});

// Rota para atualizar usuário
app.post('/api/atualizar-usuario', (req, res) => {
    console.log('Rota /api/atualizar-usuario acessada');
    console.log('Corpo da requisição:', req.body);
    const { userId, xpIncremento } = req.body;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: 'ID do usuário não fornecido' });
    }

    const query = `
        UPDATE usuarios
        SET pontos = pontos + ?, xp_total = xp_total + ?
        WHERE id = ?
    `;

    con.query(query, [xpIncremento, xpIncremento, userId], (err) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
        }
        res.json({ success: true, message: 'Usuário atualizado com sucesso' });
    });
});

// Rota para obter o perfil do usuário
app.get('/api/perfil-usuario', (req, res) => {
    const userId = req.query.userId; 

    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário não fornecido' });
    }

    con.query('SELECT id, nome, email FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar perfil do usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
        }
        
        if (results.length > 0) {
            res.json({
                userId: results[0].id,
                nome: results[0].nome,
                email: results[0].email
            });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });
});

// Rota para buscar o ranking
app.get('/api/ranking', (req, res) => {
    const query = 'SELECT id, nome, pontos, profile_image_url, email FROM usuarios ORDER BY pontos DESC';
    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar ranking:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar ranking' });
        }
        const ranking = results.map(user => ({
            ...user,
            isAdmin: adminEmails.includes(user.email)
        }));
        console.log('Resultados do ranking:', ranking);
        res.json({ success: true, ranking });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/index.html'));
});

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Middleware para lidar com erros (500)
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}!`);
});