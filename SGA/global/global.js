/* ---------- 1. CONSTANTES ---------- */

// Chave onde fica a lista de professores cadastrados (array em JSON)
const CHAVE_PROFESSORES = 'professores';

// Chave onde fica o e-mail do professor logado (a "sessão")
const CHAVE_SESSAO = 'sga_sessao';

// Caminho da tela de login, relativo a qualquer página (todas ficam em pastas irmãs)
const PAGINA_LOGIN = '../login/login.html';


/* ---------- 2. ARMAZENAMENTO ---------- */

// Lê a lista de professores. Se não existir ou estiver corrompida, devolve lista vazia.
function lerProfessores() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_PROFESSORES)) || [];
    } catch (erro) {
        return [];
    }
}

// Grava a lista de professores. Devolve true se deu certo e false se falhou
// (por exemplo, quando a foto em base64 estoura o limite do localStorage).
function salvarProfessores(lista) {
    try {
        localStorage.setItem(CHAVE_PROFESSORES, JSON.stringify(lista));
        return true;
    } catch (erro) {
        return false;
    }
}


function buscarProfessorPorEmail(lista, email) {
    const alvo = String(email).trim().toLowerCase();

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].email && lista[i].email.trim().toLowerCase() === alvo) {
            return lista[i];
        }
    }

    return null;
}

const PROFESSOR_PADRAO = {
    id: 1,
    nome: 'Ana Paula Menezes',
    email: 'anapaula@gmail.com',
    disciplina: 'Engenharia de Software',
    senha: '12345678'
};

function garantirProfessorPadrao() {
    const lista = lerProfessores();

    if (!buscarProfessorPorEmail(lista, PROFESSOR_PADRAO.email)) {
        lista.push(PROFESSOR_PADRAO);
        salvarProfessores(lista);
    }
}


function mostrarMensagem(elemento, texto, sucesso) {
    elemento.textContent = texto;
    elemento.style.color = sucesso ? 'var(--verde)' : '';
}


function salvarSessao(email) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(email));
}

function lerEmailSessao() {
    const dado = localStorage.getItem(CHAVE_SESSAO);
    if (!dado) return null;

    try {
        const email = JSON.parse(dado);
        return email ? String(email).trim().toLowerCase() : null;
    } catch (erro) {
        return null;
    }
}

function obterUsuarioSessao() {
    const email = lerEmailSessao();
    if (!email) return null;

    return buscarProfessorPorEmail(lerProfessores(), email);
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
    window.location.href = PAGINA_LOGIN;
}


function aplicarFotoAvatares(foto) {
    const avatares = document.querySelectorAll('.avatar');

    for (let i = 0; i < avatares.length; i++) {
        const avatar = avatares[i];
        const icone = avatar.querySelector('.bi-person-fill');

        if (foto) {
            avatar.style.backgroundImage = 'url("' + foto + '")';
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            if (icone) icone.style.display = 'none';
        } else {
            avatar.style.backgroundImage = 'none';
            if (icone) {
                icone.style.display = 'block';
            } else {
                avatar.innerHTML = '<i class="bi bi-person-fill"></i>';
            }
        }
    }
}

function carregarDadosSessaoInterface() {
    const usuario = obterUsuarioSessao();
    if (!usuario) return null;

    aplicarFotoAvatares(usuario.foto);

    const nomeLateral = document.getElementById('nomeLateral');
    if (nomeLateral && usuario.nome) {
        nomeLateral.textContent = 'Prof. ' + usuario.nome;
    }

    return usuario;
}

function exigirLogin() {
    const usuario = carregarDadosSessaoInterface();

    if (!usuario) {
        window.location.href = PAGINA_LOGIN;
    }

    return usuario;
}

function configurarBotaoSair() {
    const botaoSair = document.getElementById('sair');
    if (!botaoSair) return;

    botaoSair.addEventListener('click', function (evento) {
        evento.preventDefault();
        encerrarSessao();
    });
}