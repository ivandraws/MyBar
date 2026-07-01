const API_BASE = "http://localhost:8080";

// 1. Dados simulados (Mock Data) — depois vamos trocar por uma chamada à API
const itensData = [
    { codigo: 1010, descricao: "Coca-cola 290ml", tipo: "Bebida", valorUnitario: 8.00, gorjeta: 10 },
    { codigo: 2010, descricao: "Filé Com Fritas", tipo: "Tira Gosto", valorUnitario: 60.00, gorjeta: 20 },
    { codigo: 2050, descricao: "Sorvete de Abóbora", tipo: "Sobremesa", valorUnitario: 20.00, gorjeta: 10 },
    { codigo: 1020, descricao: "Suco de Maracujá 400ml", tipo: "Bebida", valorUnitario: 9.50, gorjeta: 10 },
    { codigo: 3010, descricao: "Ingresso de Entrada", tipo: "Ingresso", valorUnitario: 15.00, gorjeta: 0 },
    { codigo: 2030, descricao: "Petit Gateau", tipo: "Sobremesa", valorUnitario: 24.00, gorjeta: 10 }
];

// Mapeia o nome do tipo para a classe CSS do badge correspondente
const CLASSE_BADGE_TIPO = {
    "Bebida": "badge-tipo-bebida",
    "Tira Gosto": "badge-tipo-tiragosto",
    "Sobremesa": "badge-tipo-sobremesa",
    "Ingresso": "badge-tipo-ingresso"
};

function pesquisarItens() {
    // Lê o valor atual de cada campo de busca
    const codigoDigitado = document.getElementById("filtro-codigo").value.trim();
    const descricaoDigitada = document.getElementById("filtro-descricao").value.trim().toLowerCase();
    const tipoSelecionado = document.getElementById("filtro-tipo").value;

    // Filtra os itens: cada item precisa passar em TODAS as condições preenchidas
    let resultado = itensData.filter(function (item) {
        const bateCodigo = codigoDigitado === "" || item.codigo.toString().includes(codigoDigitado);
        const bateDescricao = descricaoDigitada === "" || item.descricao.toLowerCase().includes(descricaoDigitada);
        const bateTipo = tipoSelecionado === "" || item.tipo === tipoSelecionado;

        return bateCodigo && bateDescricao && bateTipo;
    });

    // Ordena por Descrição, em ordem crescente (A-Z), como pede o ERS
    resultado.sort(function (a, b) {
        return a.descricao.localeCompare(b.descricao);
    });

    renderizarTabela(resultado);
}

function renderizarTabela(itens) {
    const tbody = document.getElementById("itens-tbody");

    tbody.innerHTML = itens.map(function (item) {
        return criarLinhaTabela(item);
    }).join("");
}

function criarLinhaTabela(item) {
    const classeBadge = CLASSE_BADGE_TIPO[item.tipo] || "badge-tipo-ingresso";
    const valorFormatado = item.valorUnitario.toFixed(2).replace(".", ",");

    return `
        <tr>
            <td class="ps-4 fw-bold">${item.codigo}</td>
            <td>${item.descricao}</td>
            <td><span class="badge-tipo ${classeBadge}">${item.tipo}</span></td>
            <td>R$ ${valorFormatado}</td>
            <td>${item.gorjeta}%</td>
            <td class="d-flex gap-2">
                <button class="btn btn-acao btn-ver">Visualizar</button>
                <button class="btn btn-acao btn-lancar">Alterar</button>
                <button class="btn btn-acao btn-fechar">Excluir</button>
            </td>
        </tr>
    `;
}

// Aqui precisa de um form
let codigoEmEdicao = null;
let itensCached = [];

function abrirFormularioNovo() {
    
    contaEmEdicao = null;
    document.getElementById("modal-titulo").textContent = "Nova Conta";
    console.log("Novo item");
    // SOLUÇÃO DEFINITIVA: Limpa os campos manualmente sem usar o .reset()
    const campos = document.querySelectorAll("#form-item input, #form-item select");
    campos.forEach(campo => {
        if (campo.id === "campo-sexo") {
            campo.value = "M"; // Volta o select para o padrão
        } else {
            campo.value = "";  // Limpa todos os outros campos de texto/número
        }
    });
    
    document.getElementById("campo-cpf").removeAttribute("readonly");
    document.getElementById("campo-data").value = new Date().toISOString().split("T")[0];
    document.getElementById("campo-hora").value = new Date().toTimeString().substring(0,5);
    document.getElementById("info-cliente").classList.add("d-none");
    document.getElementById("btn-salvar-conta").textContent = "Abrir Conta";
    
    const modal = new bootstrap.Modal(document.getElementById("modal-conta"));
    modal.show();
}

// ── injeção dos modais no DOM ──────────────────────────────
function injetarModais() {
    const html = `
    <!-- ÁREA DE ALERTAS -->
    <div id="area-alerta" style="position:fixed;top:70px;right:20px;z-index:9999;min-width:320px;max-width:440px;"></div>

    <!-- MODAL NOVO ITEM / EDIÇÃO -->
    <div class="modal fade" id="modal-conta" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-titulo">Nova Conta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="form-item">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Nome *</label>
                            <input type="text" id="campo-cpf" class="form-control"
                                   placeholder="Comida" maxlength="14">
                            <div id="info-cliente" class="d-none"></div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-8">
                                <label class="form-label fw-semibold">Nome *</label>
                                <input type="text" id="campo-nome" class="form-control" placeholder="Nome completo">
                            </div>
                            <div class="col-4">
                                <label class="form-label fw-semibold">Sexo *</label>
                                <select id="campo-sexo" class="form-select">
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Telefone *</label>
                            <input type="text" id="campo-telefone" class="form-control" placeholder="(86) 99999-9999">
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-4">
                                <label class="form-label fw-semibold">Nº Conta *</label>
                                <input type="number" id="campo-numero" class="form-control" placeholder="108" min="1" max="9999">
                            </div>
                            <div class="col-4">
                                <label class="form-label fw-semibold">Data</label>
                                <input type="date" id="campo-data" class="form-control">
                            </div>
                            <div class="col-4">
                                <label class="form-label fw-semibold">Hora</label>
                                <input type="time" id="campo-hora" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="btn-cancelar-modal" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="btn-salvar-conta" class="btn btn-brand">Abrir Conta</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL EXCLUSÃO -->
    <div class="modal fade" id="modal-exclusao" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmar Exclusão</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p id="msg-exclusao" class="mb-0"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="btn-confirmar-exclusao" class="btn btn-danger btn-sm">Excluir</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
}




document.addEventListener("DOMContentLoaded", function () {
    injetarModais();
    document.getElementById("btn-pesquisar").addEventListener("click", pesquisarItens);
    document.getElementById("btnNewItem").addEventListener("click", abrirFormularioNovo)

    // Mostra todos os itens (já ordenados) na primeira carga da página
    pesquisarItens();
});