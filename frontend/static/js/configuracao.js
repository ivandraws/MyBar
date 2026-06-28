// Estado simulado da configuração — depois isso vai vir de um GET /configuracao real
// modoOperacao pode ser: "GESTAO" ou "ATENDIMENTO" (mesmos nomes do enum ModoOperacao do backend)
const configuracaoAtual = {
    valorIngressoMasc: 50.00,
    valorIngressoFemin: 10.00,
    modoOperacao: "GESTAO"
};

function carregarTelaComDadosAtuais() {
    // Preenche os campos de ingresso com o valor já configurado
    document.getElementById("ingresso-masculino").value = configuracaoAtual.valorIngressoMasc.toFixed(2);
    document.getElementById("ingresso-feminino").value = configuracaoAtual.valorIngressoFemin.toFixed(2);

    atualizarIndicadorModo();
}

function atualizarIndicadorModo() {
    const dot = document.getElementById("status-dot");
    const texto = document.getElementById("texto-modo-operacao");

    if (configuracaoAtual.modoOperacao === "ATENDIMENTO") {
        dot.className = "status-dot atendimento";
        texto.innerText = "Atendimento liberado";
    } else {
        dot.className = "status-dot gestao";
        texto.innerText = "Gestão (atendimento fechado)";
    }
}

function salvarIngresso() {
    const masculino = parseFloat(document.getElementById("ingresso-masculino").value);
    const feminino = parseFloat(document.getElementById("ingresso-feminino").value);

    if (isNaN(masculino) || isNaN(feminino)) {
        mostrarMensagem("msg-ingresso", "Informe os dois valores de ingresso.", "erro");
        return;
    }

    // Simula o que o ConfiguracaoService.atualizarValoresIngresso faria no backend
    configuracaoAtual.valorIngressoMasc = masculino;
    configuracaoAtual.valorIngressoFemin = feminino;

    mostrarMensagem("msg-ingresso", "Valores de ingresso salvos com sucesso.", "sucesso");
}

function liberarAtendimentos() {
    const data = document.getElementById("liberacao-data").value;
    const hora = document.getElementById("liberacao-hora").value;

    if (data === "" || hora === "") {
        mostrarMensagem("msg-liberacao", "Informe data e hora para liberar os atendimentos.", "erro");
        return;
    }

    // Simula o ConfiguracaoService.alterarModoOperacao(ModoOperacao.ATENDIMENTO)
    configuracaoAtual.modoOperacao = "ATENDIMENTO";
    atualizarIndicadorModo();

    mostrarMensagem("msg-liberacao", "Atendimentos liberados a partir de " + formatarDataHora(data, hora) + ".", "sucesso");
}

function fecharAtendimentos() {
    const data = document.getElementById("fechamento-data").value;
    const hora = document.getElementById("fechamento-hora").value;

    if (data === "" || hora === "") {
        mostrarMensagem("msg-fechamento", "Informe data e hora para fechar os atendimentos.", "erro");
        return;
    }

    // Simula o ConfiguracaoService.alterarModoOperacao(ModoOperacao.GESTAO)
    configuracaoAtual.modoOperacao = "GESTAO";
    atualizarIndicadorModo();

    mostrarMensagem("msg-fechamento", "Atendimentos fechados a partir de " + formatarDataHora(data, hora) + ".", "sucesso");
}

// Converte "2026-06-28" + "14:30" em "28/06/2026 14:30", formato mais comum no Brasil
function formatarDataHora(dataISO, hora) {
    const [ano, mes, dia] = dataISO.split("-");
    return dia + "/" + mes + "/" + ano + " " + hora;
}

function mostrarMensagem(idElemento, texto, tipo) {
    const elemento = document.getElementById(idElemento);
    elemento.innerText = texto;
    elemento.className = "small mt-2 " + (tipo === "sucesso" ? "msg-sucesso" : "msg-erro");
}

document.addEventListener("DOMContentLoaded", function () {
    carregarTelaComDadosAtuais();

    document.getElementById("btn-salvar-ingresso").addEventListener("click", salvarIngresso);
    document.getElementById("btn-liberar").addEventListener("click", liberarAtendimentos);
    document.getElementById("btn-fechar").addEventListener("click", fecharAtendimentos);
});