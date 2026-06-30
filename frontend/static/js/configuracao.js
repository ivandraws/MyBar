const API_BASE_URL = "http://localhost:8080";

function getToken() {
    return sessionStorage.getItem("token");
}

function authHeader() {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    return headers;
}

const configuracaoAtual = {
    valorIngressoMasc: 50.00,
    valorIngressoFemin: 10.00,
    modoOperacao: "GESTAO"
};

async function carregarConfiguracao() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/configuracao`, {
            method: "GET",
            headers: authHeader()
        });

        if (!response.ok) {
            mostrarMensagem("msg-ingresso", "Não foi possível carregar a configuração atual.", "erro");
            return;
        }

        const configuracao = await response.json();
        configuracaoAtual.valorIngressoMasc = Number(configuracao.valorIngressoMasc ?? configuracao.valorIngressoMasc);
        configuracaoAtual.valorIngressoFemin = Number(configuracao.valorIngressoFemin ?? configuracao.valorIngressoFemin);
        configuracaoAtual.modoOperacao = configuracao.modoOperacao || "GESTAO";

        carregarTelaComDadosAtuais();
    } catch (error) {
        console.error("Erro ao carregar configuração:", error);
        mostrarMensagem("msg-ingresso", "Erro ao conectar com o servidor.", "erro");
    }
}

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

    fetch(`${API_BASE_URL}/api/configuracao/ingresso?masc=${encodeURIComponent(masculino)}&fem=${encodeURIComponent(feminino)}`, {
        method: "PUT",
        headers: authHeader()
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.json();
        })
        .then(configuracao => {
            configuracaoAtual.valorIngressoMasc = Number(configuracao.valorIngressoMasc);
            configuracaoAtual.valorIngressoFemin = Number(configuracao.valorIngressoFemin);
            mostrarMensagem("msg-ingresso", "Valores de ingresso salvos com sucesso.", "sucesso");
            carregarTelaComDadosAtuais();
        })
        .catch(error => {
            console.error("Erro ao salvar ingresso:", error);
            mostrarMensagem("msg-ingresso", "Não foi possível salvar os valores de ingresso.", "erro");
        });
}

function liberarAtendimentos() {
    const data = document.getElementById("liberacao-data").value;
    const hora = document.getElementById("liberacao-hora").value;

    if (data === "" || hora === "") {
        mostrarMensagem("msg-liberacao", "Informe data e hora para liberar os atendimentos.", "erro");
        return;
    }

    fetch(`${API_BASE_URL}/api/configuracao/operation?op=ATENDIMENTO`, {
        method: "PUT",
        headers: authHeader()
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.json();
        })
        .then(configuracao => {
            configuracaoAtual.modoOperacao = configuracao.modoOperacao || "ATENDIMENTO";
            atualizarIndicadorModo();
            mostrarMensagem("msg-liberacao", "Atendimentos liberados a partir de " + formatarDataHora(data, hora) + ".", "sucesso");
        })
        .catch(error => {
            console.error("Erro ao liberar atendimentos:", error);
            mostrarMensagem("msg-liberacao", "Não foi possível liberar os atendimentos.", "erro");
        });
}

function fecharAtendimentos() {
    const data = document.getElementById("fechamento-data").value;
    const hora = document.getElementById("fechamento-hora").value;

    if (data === "" || hora === "") {
        mostrarMensagem("msg-fechamento", "Informe data e hora para fechar os atendimentos.", "erro");
        return;
    }

    fetch(`${API_BASE_URL}/api/configuracao/operation?op=GESTAO`, {
        method: "PUT",
        headers: authHeader()
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.json();
        })
        .then(configuracao => {
            configuracaoAtual.modoOperacao = configuracao.modoOperacao || "GESTAO";
            atualizarIndicadorModo();
            mostrarMensagem("msg-fechamento", "Atendimentos fechados a partir de " + formatarDataHora(data, hora) + ".", "sucesso");
        })
        .catch(error => {
            console.error("Erro ao fechar atendimentos:", error);
            mostrarMensagem("msg-fechamento", "Não foi possível fechar os atendimentos.", "erro");
        });
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
    carregarConfiguracao();

    document.getElementById("btn-salvar-ingresso").addEventListener("click", salvarIngresso);
    document.getElementById("btn-liberar").addEventListener("click", liberarAtendimentos);
    document.getElementById("btn-fechar").addEventListener("click", fecharAtendimentos);
});