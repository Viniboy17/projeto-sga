const alunosEngenharia = [
    { matricula: '2023104521', nome: 'Beatriz Andrade Souza', p1: 8.5, p2: 7.0, proj1: 9.0, proj2: 8.0, final: '' },
    { matricula: '2023104522', nome: 'Carlos Eduardo Lima', p1: 5.0, p2: 4.5, proj1: 6.5, proj2: 5.5, final: '' },
    { matricula: '2023104523', nome: 'Daniela Ferreira Costa', p1: 6.0, p2: 5.5, proj1: 7.5, proj2: 6.0, final: '' },
    { matricula: '2023104524', nome: 'Eduardo Nascimento', p1: 9.0, p2: 8.5, proj1: 9.5, proj2: 9.0, final: '' },
    { matricula: '2023104525', nome: 'Fernanda Melo Rocha', p1: 4.0, p2: 3.5, proj1: 5.0, proj2: 4.5, final: 1.5 },
    { matricula: '2023104526', nome: 'Gustavo Pereira Dias', p1: 6.5, p2: 6.0, proj1: 5.5, proj2: 5.0, final: 6.5 },
    { matricula: '2023104527', nome: 'Helena Ribeiro Castro', p1: 7.5, p2: 8.0, proj1: 8.5, proj2: 8.0, final: '' },
    { matricula: '2023104528', nome: 'Igor Martins Santos', p1: 3.0, p2: 4.0, proj1: 3.5, proj2: 4.0, final: '' }
];

const alunosBancoDados = [
    { matricula: '2023201101', nome: 'Alexandre Matos', p1: 7.0, p2: 8.0, proj1: 8.5, proj2: 9.0, final: '' },
    { matricula: '2023201102', nome: 'Bruna Vasconcelos', p1: 4.5, p2: 5.0, proj1: 6.0, proj2: 5.0, final: '' },
    { matricula: '2023201103', nome: 'Caio Roberto Silva', p1: 9.5, p2: 9.0, proj1: 10.0, proj2: 9.5, final: '' },
    { matricula: '2023201104', nome: 'Diego Fernandes', p1: 3.5, p2: 4.0, proj1: 4.5, proj2: 3.0, final: '' },
    { matricula: '2023201105', nome: 'Elisa Montenegro', p1: 6.0, p2: 6.5, proj1: 7.0, proj2: 6.0, final: 7.0 },
    { matricula: '2023201106', nome: 'Felipe Barbosa', p1: 8.0, p2: 7.5, proj1: 8.0, proj2: 8.5, final: '' }
];

const listaTurmas = [
    { id: 'eng-soft', nome: 'Engenharia de Software', periodo: 'ADS 2026.1', corBorder: 'var(--azul)', alunos: alunosEngenharia },
    { id: 'banco-dados', nome: 'Banco de Dados II', periodo: 'ADS 2026.1', corBorder: 'var(--verde)', alunos: alunosBancoDados }
];


let turmaSelecionada = null;   
let paginaAtual = 1;           
const ITENS_POR_PAGINA = 6;   

const CHAVE_NOTAS = 'sga_notas';

const CAMPOS_NOTA = ['p1', 'p2', 'proj1', 'proj2', 'final'];

function salvarNotas() {
    const dados = {};

    for (let t = 0; t < listaTurmas.length; t++) {
        const turma = listaTurmas[t];
        dados[turma.id] = {};

        for (let a = 0; a < turma.alunos.length; a++) {
            const aluno = turma.alunos[a];
            dados[turma.id][aluno.matricula] = {};

            for (let c = 0; c < CAMPOS_NOTA.length; c++) {
                dados[turma.id][aluno.matricula][CAMPOS_NOTA[c]] = aluno[CAMPOS_NOTA[c]];
            }
        }
    }

    try {
        localStorage.setItem(CHAVE_NOTAS, JSON.stringify(dados));
    } catch (erro) {
        alert('Não foi possível salvar as notas neste navegador.');
    }
}

function carregarNotasSalvas() {
    let dados = {};

    try {
        dados = JSON.parse(localStorage.getItem(CHAVE_NOTAS)) || {};
    } catch (erro) {
        dados = {};
    }

    for (let t = 0; t < listaTurmas.length; t++) {
        const turma = listaTurmas[t];

        for (let a = 0; a < turma.alunos.length; a++) {
            const aluno = turma.alunos[a];
            const salvo = dados[turma.id] && dados[turma.id][aluno.matricula];
            if (!salvo) continue;

            for (let c = 0; c < CAMPOS_NOTA.length; c++) {
                if (salvo[CAMPOS_NOTA[c]] !== undefined) {
                    aluno[CAMPOS_NOTA[c]] = salvo[CAMPOS_NOTA[c]];
                }
            }
        }
    }
}



function renderizarTurmas() {
    const container = document.getElementById('conteudo');

    turmaSelecionada = null;

    document.getElementById('titulo').textContent = 'Minhas turmas';
    document.getElementById('subtitulo').textContent = 'Selecione uma turma para ver o diário de notas';

    let html = '<div class="cards">';

    for (let i = 0; i < listaTurmas.length; i++) {
        const turma = listaTurmas[i];
        const inicial = turma.nome.charAt(0).toUpperCase();

        html +=
            '<div class="card-turma" style="border-top-color: ' + turma.corBorder + ';" onclick="abrirTurma(\'' + turma.id + '\')">' +
                '<div class="letra">' + inicial + '</div>' +
                '<strong>' + turma.nome + '</strong>' +
                '<small>' + turma.periodo + '</small>' +
                '<small>' + turma.alunos.length + ' alunos</small>' +
                '<b>Abrir turma &gt;</b>' +
            '</div>';
    }

    html += '</div>';
    html += '<div class="dica"><b>Dica:</b> Clique em um cartão de turma para abrir, no corpo desta mesma página, a tabela de alunos e notas daquela turma.</div>';

    container.innerHTML = html;
}

function abrirTurma(idTurma) {
    turmaSelecionada = null;

    for (let i = 0; i < listaTurmas.length; i++) {
        if (listaTurmas[i].id === idTurma) {
            turmaSelecionada = listaTurmas[i];
            break;
        }
    }

    if (!turmaSelecionada) return;

    paginaAtual = 1;
    exibirTabelaTurma();
}


function criarInputNota(indice, campo, valor, desabilitado) {
    return '<input type="number" step="0.1" min="0" max="10" class="nota" value="' + valor + '"' +
        (desabilitado ? ' disabled' : '') +
        ' onchange="atualizarNota(' + indice + ', \'' + campo + '\', this.value)">';
}

function montarLinhaAluno(aluno, indice) {
    const notaProjeto = calcularNotaProjeto(aluno.proj1, aluno.proj2);
    const media = calcularMediaFinal(aluno.p1, aluno.p2, aluno.proj1, aluno.proj2);
    const status = determinarStatusAluno(media, notaProjeto, aluno.final);

    const finalPreenchido = aluno.final !== '' && aluno.final !== null;
    const bloquearFinal = status.texto !== 'FARÁ PROVA FINAL' && !finalPreenchido;

    return '<tr>' +
        '<td>' + aluno.matricula + '</td>' +
        '<td><b>' + aluno.nome + '</b></td>' +
        '<td>' + criarInputNota(indice, 'p1', aluno.p1, false) + '</td>' +
        '<td>' + criarInputNota(indice, 'p2', aluno.p2, false) + '</td>' +
        '<td>' + criarInputNota(indice, 'proj1', aluno.proj1, false) + '</td>' +
        '<td>' + criarInputNota(indice, 'proj2', aluno.proj2, false) + '</td>' +
        '<td><b>' + media.toFixed(1) + '</b></td>' +
        '<td><span class="badge badge-' + status.classe + '">' + status.texto + '</span></td>' +
        '<td>' + criarInputNota(indice, 'final', finalPreenchido ? aluno.final : '', bloquearFinal) + '</td>' +
    '</tr>';
}

function montarPaginacao(totalAlunos) {
    const totalPaginas = Math.ceil(totalAlunos / ITENS_POR_PAGINA);
    const primeiroItem = ((paginaAtual - 1) * ITENS_POR_PAGINA) + 1;
    const ultimoItem = Math.min(paginaAtual * ITENS_POR_PAGINA, totalAlunos);

    let html = '<div class="pag"><span>Mostrando ' + primeiroItem + '-' + ultimoItem + ' de ' + totalAlunos + ' alunos</span><div>';

    html += '<button ' + (paginaAtual === 1 ? 'disabled' : '') + ' onclick="mudarPagina(' + (paginaAtual - 1) + ')">&lt;</button>';

    for (let p = 1; p <= totalPaginas; p++) {
        html += '<button class="' + (p === paginaAtual ? 'atual' : '') + '" onclick="mudarPagina(' + p + ')">' + p + '</button>';
    }

    html += '<button ' + (paginaAtual === totalPaginas ? 'disabled' : '') + ' onclick="mudarPagina(' + (paginaAtual + 1) + ')">&gt;</button>';

    return html + '</div></div>';
}

function exibirTabelaTurma() {
    const container = document.getElementById('conteudo');
    if (!turmaSelecionada) return;

    const alunos = turmaSelecionada.alunos;
    const totalAlunos = alunos.length;

    document.getElementById('titulo').textContent = turmaSelecionada.nome;
    document.getElementById('subtitulo').textContent = turmaSelecionada.periodo + ' · ' + totalAlunos + ' alunos matriculados';

    let html = '<button class="link-voltar" onclick="renderizarTurmas()">&lt; Voltar para minhas turmas</button>';
    html += '<div class="tabela-wrap"><table><thead><tr>' +
                '<th>Matrícula</th>' +
                '<th>Nome do aluno</th>' +
                '<th>P1</th>' +
                '<th>P2</th>' +
                '<th>Proj. F1</th>' +
                '<th>Proj. F2</th>' +
                '<th>Média</th>' +
                '<th>Status</th>' +
                '<th>Final</th>' +
            '</tr></thead><tbody>';

    if (totalAlunos === 0) {
        html += '<tr><td colspan="9" style="text-align:center;padding:20px;">Nenhum aluno cadastrado nesta turma.</td></tr>';
    } else {
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = Math.min(inicio + ITENS_POR_PAGINA, totalAlunos);

        for (let i = inicio; i < fim; i++) {
            html += montarLinhaAluno(alunos[i], i);
        }
    }

    html += '</tbody></table></div>';

    if (totalAlunos > 0) {
        html += montarPaginacao(totalAlunos);
    }

    container.innerHTML = html;
}

function limitarNota(valor) {
    let nota = parseFloat(valor);

    if (isNaN(nota) || nota < 0) nota = 0;
    if (nota > 10) nota = 10;

    return nota;
}

function atualizarNota(indiceAluno, campo, valor) {
    if (campo === 'final' && valor === '') {
        turmaSelecionada.alunos[indiceAluno].final = '';
    } else {
        turmaSelecionada.alunos[indiceAluno][campo] = limitarNota(valor);
    }

    salvarNotas();
    exibirTabelaTurma();
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    exibirTabelaTurma();
}

document.addEventListener('DOMContentLoaded', function () {
    const usuario = exigirLogin();
    if (!usuario) return;

    carregarNotasSalvas();

    renderizarTurmas();

    document.getElementById('btnTurmas').addEventListener('click', renderizarTurmas);

    document.getElementById('atalhoPerfil').addEventListener('click', function () {
        window.location.href = '../perfil/perfil.html';
    });

    configurarBotaoSair();
});
