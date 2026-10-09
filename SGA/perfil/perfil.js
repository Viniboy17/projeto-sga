
const TAMANHO_MAX_FOTO = 5 * 1024 * 1024; // 5 MB
let fotoTempBase64 = null;

function carregarCamposFormularioPerfil() {
    const usuario = exigirLogin();
    if (!usuario) return;

    document.getElementById('nome').value = usuario.nome || '';
    document.getElementById('email').value = usuario.email || '';
    document.getElementById('disc').value = usuario.disciplina || '';

    fotoTempBase64 = usuario.foto || null;
}


function escolherFoto(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    if (arquivo.size > TAMANHO_MAX_FOTO) {
        alert('A imagem deve ter no máximo 5 MB.');
        evento.target.value = '';
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (e) {
        fotoTempBase64 = e.target.result;
        aplicarFotoAvatares(fotoTempBase64);
    };

    leitor.readAsDataURL(arquivo);
}

function removerFoto() {
    fotoTempBase64 = null;
    document.getElementById('inputFoto').value = '';
    aplicarFotoAvatares(null);
}


function salvarPerfil(evento) {
    evento.preventDefault();

    const usuarioAtual = obterUsuarioSessao();
    if (!usuarioAtual) return;

    const novoNome = document.getElementById('nome').value.trim();
    const novoEmail = document.getElementById('email').value.trim().toLowerCase();
    const novaDisciplina = document.getElementById('disc').value.trim();

    if (!novoNome || !novoEmail || !novaDisciplina) {
        alert('Preencha todos os campos do perfil.');
        return;
    }

    if (!emailValido(novoEmail)) {
        alert('Digite um e-mail válido.');
        return;
    }

    const lista = lerProfessores();

    const emailMudou = novoEmail !== usuarioAtual.email.toLowerCase();
    if (emailMudou && buscarProfessorPorEmail(lista, novoEmail)) {
        alert('Este e-mail já está em uso por outro professor.');
        return;
    }

    const registro = buscarProfessorPorEmail(lista, usuarioAtual.email);
    if (!registro) return;

    registro.nome = novoNome;
    registro.email = novoEmail;
    registro.disciplina = novaDisciplina;
    registro.foto = fotoTempBase64;

    if (!salvarProfessores(lista)) {
        alert('Não foi possível salvar. Tente uma foto menor.');
        return;
    }

    salvarSessao(novoEmail);

    carregarCamposFormularioPerfil();
    alert('Perfil atualizado com sucesso!');
}


document.addEventListener('DOMContentLoaded', function () {
    carregarCamposFormularioPerfil();

    document.getElementById('btnAlterarFoto').addEventListener('click', function () {
        document.getElementById('inputFoto').click();
    });

    document.getElementById('inputFoto').addEventListener('change', escolherFoto);
    document.getElementById('btnRemoverFoto').addEventListener('click', removerFoto);
    document.getElementById('form-perfil').addEventListener('submit', salvarPerfil);

    configurarBotaoSair();
});
