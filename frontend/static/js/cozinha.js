// 1. Dados simulados (Mock Data) — depois vamos trocar por uma chamada à API
// status pode ser: "solicitado", "emPreparo" ou "entregue"
const pedidosData = [
    { id: 1, conta: 108, item: "Petit Gateau",       horario: "22:26", status: "solicitado" },
    { id: 2, conta: 47,  item: "Arroz Cremoso",       horario: "22:30", status: "solicitado" },
    { id: 3, conta: 55,  item: "Sorvete Abóbora",     horario: "22:35", status: "solicitado" },
    { id: 4, conta: 34,  item: "Frango Desossado",    horario: "22:15", status: "emPreparo" },
    { id: 5, conta: 61,  item: "Batata Gratinada",    horario: "22:18", status: "emPreparo" },
    { id: 6, conta: 33,  item: "Filé c/ Fritas",      horario: "22:20", status: "emPreparo" },
    { id: 7, conta: 12,  item: "Risoto de Camarão",   horario: "22:22", status: "emPreparo" },
    { id: 8, conta: 9,   item: "Petit Gateau",        horario: "22:24", status: "emPreparo" },
    { id: 9, conta: 110, item: "Filé com Fritas",     horario: "22:00", status: "entregue" },
    { id: 10, conta: 5,  item: "Batata Frita",        horario: "22:05", status: "entregue" },
    { id: 11, conta: 99, item: "Mousse Chocolate",    horario: "22:10", status: "entregue" }
];

// Define, para cada status, qual é o "próximo passo" e o texto/classe do botão
const CONFIG_STATUS = {
    solicitado: {
        proximoStatus: "emPreparo",
        textoBotao: "▶ Receber pedido",
        classeBotao: "btn-receber",
        classeBorda: "coluna-solicitado-borda"
    },
    emPreparo: {
        proximoStatus: "entregue",
        textoBotao: "✓ Marcar entregue",
        classeBotao: "btn-marcar-entregue",
        classeBorda: "coluna-em-preparo-borda"
    },
    entregue: {
        proximoStatus: null, // não tem próximo passo, é o estado final
        textoBotao: null,
        classeBotao: "",
        classeBorda: "coluna-entregue-borda"
    }
};

let filtroAtivo = "todos";

function renderizarQuadro() {
    // Separa os pedidos em 3 grupos, conforme o status de cada um
    const porStatus = {
        solicitado: pedidosData.filter(function (p) { return p.status === "solicitado"; }),
        emPreparo: pedidosData.filter(function (p) { return p.status === "emPreparo"; }),
        entregue: pedidosData.filter(function (p) { return p.status === "entregue"; })
    };

    // Desenha cada coluna com os pedidos que pertencem a ela
    Object.keys(porStatus).forEach(function (status) {
        const corpoColuna = document.getElementById("coluna-body-" + status);
        corpoColuna.innerHTML = porStatus[status].map(criarCardPedido).join("");

        // Atualiza os contadores (tanto no cabeçalho da coluna quanto no botão de filtro)
        const quantidade = porStatus[status].length;
        document.getElementById("coluna-contador-" + status).innerText = "(" + quantidade + ")";
        document.getElementById("contador-" + status).innerText = "(" + quantidade + ")";
    });

    document.getElementById("contador-todos").innerText = "(" + pedidosData.length + ")";

    aplicarFiltroVisual();
}

function criarCardPedido(pedido) {
    const config = CONFIG_STATUS[pedido.status];

    // Só desenha o botão se houver um "próximo status" definido
    const botaoHtml = config.proximoStatus
        ? `<button class="btn-acao-pedido ${config.classeBotao}" onclick="avancarStatus(${pedido.id})">${config.textoBotao}</button>`
        : "";

    return `
        <div class="card-pedido ${config.classeBorda}">
            <span class="conta-label">Conta #${pedido.conta}</span>
            <span class="item-nome">${pedido.item}</span>
            <span class="horario">Solicitado às ${pedido.horario}</span>
            ${botaoHtml}
        </div>
    `;
}

// Chamada pelo onclick do botão dentro de cada card
function avancarStatus(idPedido) {
    const pedido = pedidosData.find(function (p) { return p.id === idPedido; });
    if (!pedido) return;

    const proximoStatus = CONFIG_STATUS[pedido.status].proximoStatus;
    if (proximoStatus) {
        pedido.status = proximoStatus; // muda o dado...
        renderizarQuadro();            // ...e redesenha tudo com base no dado novo
    }
}

function aplicarFiltroVisual() {
    const colunas = document.querySelectorAll(".coluna-cozinha");

    colunas.forEach(function (coluna) {
        const statusDaColuna = coluna.dataset.coluna;
        const deveMostrar = (filtroAtivo === "todos" || filtroAtivo === statusDaColuna);
        coluna.style.display = deveMostrar ? "flex" : "none";
    });
}

function configurarFiltros() {
    const botoesFiltro = document.querySelectorAll(".btn-filtro");

    botoesFiltro.forEach(function (botao) {
        botao.addEventListener("click", function () {
            botoesFiltro.forEach(function (b) { b.classList.remove("active"); });
            botao.classList.add("active");

            filtroAtivo = botao.dataset.filtro;
            aplicarFiltroVisual();
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    configurarFiltros();
    renderizarQuadro();
});