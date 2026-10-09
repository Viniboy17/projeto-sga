const formulario = document.getElementById('form');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoDisciplina = document.getElementById('disc');
const campoSenha = document.getElementById('senha');
const campoConfirmar = document.getElementById('conf');
const mensagem = document.getElementById('msg');

const TAMANHO_MIN_SENHA = 8;

garantirProfessorPadrao();

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    mostrarMensagem(mensagem, '', false);

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim().toLowerCase();
    const disciplina = campoDisciplina.value.trim();
    const senha = campoSenha.value;
    const senhaConfirmar = campoConfirmar.value;

    function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (!nome || !email || !disciplina || !senha || !senhaConfirmar) {
        mostrarMensagem(mensagem, 'Preencha todos os campos.', false);
        return;
    }

    if (!emailValido(email)) {
        mostrarMensagem(mensagem, 'Digite um e-mail válido.', false);
        return;
    }

    if (senha.length < TAMANHO_MIN_SENHA) {
        mostrarMensagem(mensagem, 'A senha deve ter no mínimo ' + TAMANHO_MIN_SENHA + ' caracteres.', false);
        return;
    }

    if (senha !== senhaConfirmar) {
        mostrarMensagem(mensagem, 'As senhas não coincidem.', false);
        return;
    }

    const professores = lerProfessores();

    if (buscarProfessorPorEmail(professores, email)) {
        mostrarMensagem(mensagem, 'Este e-mail já está cadastrado.', false);
        return;
    }

    professores.push({
        id: Date.now(),
        nome: nome,
        email: email,
        disciplina: disciplina,
        senha: senha
    });

    if (!salvarProfessores(professores)) {
        mostrarMensagem(mensagem, 'Não foi possível salvar o cadastro neste navegador.', false);
        return;
    }

    mostrarMensagem(mensagem, 'Cadastro realizado com sucesso! Redirecionando...', true);
    formulario.reset();

    setTimeout(function () {
        window.location.href = '../login/login.html';
    }, 1500);
});
