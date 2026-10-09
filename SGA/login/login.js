const formulario = document.getElementById('form');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const mensagem = document.getElementById('msg');

garantirProfessorPadrao();

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    mostrarMensagem(mensagem, '', false);

    const email = campoEmail.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (!email || !senha) {
        mostrarMensagem(mensagem, 'Preencha e-mail e senha.', false);
        return;
    }

    const professor = buscarProfessorPorEmail(lerProfessores(), email);

    if (!professor || professor.senha !== senha) {
        mostrarMensagem(mensagem, 'E-mail ou senha incorretos. Confira os dados e tente de novo.', false);
        return;
    }

    salvarSessao(professor.email);
    mostrarMensagem(mensagem, 'Login realizado com sucesso! Redirecionando...', true);
    formulario.reset();

    setTimeout(function () {
        window.location.href = '../home/home.html';
    }, 1500);
});
