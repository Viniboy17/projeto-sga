const PESO_INDIVIDUAL = 0.4;
const PESO_PROJETO = 0.6;
const NOTA_APROVACAO = 7.0;
const NOTA_MINIMA_PROJETO = 4.0;

function mediaSimples(nota1, nota2) {
    if (isNaN(nota1) || isNaN(nota2)) return 0;
    return (nota1 + nota2) / 2;
}

function calcularNotaIndividual(p1, p2) {
    return mediaSimples(p1, p2);
}

function calcularNotaProjeto(proj1, proj2) {
    return mediaSimples(proj1, proj2);
}

function calcularMediaFinal(p1, p2, proj1, proj2) {
    const notaIndividual = calcularNotaIndividual(p1, p2);
    const notaProjeto = calcularNotaProjeto(proj1, proj2);

    return (notaIndividual * PESO_INDIVIDUAL) + (notaProjeto * PESO_PROJETO);
}

function determinarStatusAluno(mediaFinal, notaProjeto, notaFinal) {
    const aprovado = { texto: 'APROVADO', classe: 'aprovado' };
    const reprovado = { texto: 'REPROVADO', classe: 'reprovado' };

    if (mediaFinal >= NOTA_APROVACAO) {
        return aprovado;
    }

    if (notaProjeto < NOTA_MINIMA_PROJETO) {
        return reprovado;
    }

    const temNotaFinal = notaFinal !== null && notaFinal !== '' && !isNaN(notaFinal);

    if (temNotaFinal) {
        const soma = notaProjeto + Number(notaFinal);
        return soma >= NOTA_APROVACAO ? aprovado : reprovado;
    }

    return { texto: 'FARÁ PROVA FINAL', classe: 'final' };
}
