// 1. Dados simulados (Mock Data) — depois vamos trocar por chamada à API
// status pode ser: "Solicitado", "Em Preparação" ou "Entregue"
const pedidosData = [
    { id: 1, conta: 34,  cliente: "Raimundo Moura", tipo: "Bebida",     descricao: "Mojito",            dataHora: "10/05/2026 22:15", status: "Solicitado" },
    { id: 2, conta: 110, cliente: "Kelson Aires",   tipo: "Tira-Gosto", descricao: "Filé com fritas",   dataHora: "10/05/2026 22:18", status: "Entregue" },
    { id: 3, conta: 215, cliente: "Ana Paula F.",    tipo: "Bebida",     descricao: "Aperol",            dataHora: "10/05/2026 22:21", status: "Em Preparação" },
    { id: 4, conta: 87,  cliente: "Carlos Melo",     tipo: "Sobremesa",  descricao: "Petit Gateau",      dataHora: "10/05/2026 22:26", status: "Solicitado" }
];

// Simula uma lista de garçons cadastrados, pra "buscar o nome" pelo código
const garcomsData = [
    { codigo: 1001, nome: "João Aranha" },
    { codigo: 1002, nome: "Pedro Silva" },
    { codigo: 1003, nome: "Maria Ribeiro" }
];

// Define a ordem de prioridade exigida pelo ERS: Solicitado, depois Em Preparação, depois Entregue
const ORDEM_STATUS = { "Solicitado": 1, "Em Preparação": 2, "Entregue": 3 };

// Guarda qual pedido está sendo entregue agora (null = nenhum selecionado ainda)
let pedidoSelecionadoId = null;

function pesquisarPedidos() {
    const contaDigitada = document.getElementById("filtro-conta").value.trim();
    const clienteDigitado = document.getElementById("filtro-cliente").value.trim().toLowerCase();

    let resultado = pedidosData.filter(function (pedido) {
        const bateConta = contaDigitada === "" || pedido.conta.toString().includes(contaDigitada);
        const bateCliente = clienteDigitado === "" || pedido.cliente.toLowerCase().includes(clienteDigitado);
        return bateConta && bateCliente;
    });

    // Ordena pelo status, na prioridade exigida pelo ERS
    resultado.sort(function (a, b) {
        return ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status];
    });

    renderizarTabela(resultado);
}

function renderizarTabela(pedidos) {
    const tbody = document.getElementById("pedidos-tbody");
    tbody.innerHTML = pedidos.map(criarLinhaTabela).join("");
}

function criarLinhaTabela(pedido) {
    const classeBadge = {
        "Solicitado": "badge-solicitado",
        "Em Preparação": "badge-em-preparacao",
        "Entregue": "badge-entregue"
    }[pedido.status];

    // O comando disponível depende do status atual do pedido
    let comandoHtml = "-";
    if (pedido.status === "Solicitado") {
        comandoHtml = `<button class="btn-receber-pedido" onclick="receberPedido(${pedido.id})">Receber</button>`;
    } else if (pedido.status === "Em Preparação") {
        comandoHtml = `<button class="btn-entregar-pedido" onclick="selecionarParaEntrega(${pedido.id})">Entregar</button>`;
    }

    return `
        <tr>
            <td class="ps-4 fw-bold">${pedido.conta}</td>
            <td>${pedido.tipo}</td>
            <td>${pedido.descricao}</td>
            <td>${pedido.dataHora}</td>
            <td><span class="badge-status ${classeBadge}">${pedido.status}</span></td>
            <td>${comandoHtml}</td>
        </tr>
    `;
}

// "Receber" é uma ação direta e simples: muda o status sem precisar de formulário
function receberPedido(idPedido) {
    const pedido = pedidosData.find(function (p) { return p.id === idPedido; });
    if (pedido) {
        pedido.status = "Em Preparação";
        pesquisarPedidos(); // redesenha a tabela já com o status atualizado
    }
}

// "Entregar" não muda o status direto — primeiro guarda qual pedido foi escolhido
// e destaca o formulário "Registrar Entrega" pra o atendente preencher os dados
function selecionarParaEntrega(idPedido) {
    pedidoSelecionadoId = idPedido;
    const pedido = pedidosData.find(function (p) { return p.id === idPedido; });

    const infoDiv = document.getElementById("info-pedido-selecionado");
    document.getElementById("texto-pedido-selecionado").innerText =
        "Conta #" + pedido.conta + " — " + pedido.descricao;
    infoDiv.classList.remove("d-none");

    document.getElementById("card-registrar-entrega").classList.add("selecionado");
    limparErroEntrega();

    // Leva o atendente até o formulário, já que ele pode estar mais abaixo na tela
    document.getElementById("card-registrar-entrega").scrollIntoView({ behavior: "smooth", block: "center" });
}

// Quando o código do garçom é digitado, busca e mostra o nome correspondente
function buscarNomeGarcom() {
    const codigoDigitado = parseInt(document.getElementById("codigo-garcom").value, 10);
    const garcom = garcomsData.find(function (g) { return g.codigo === codigoDigitado; });

    document.getElementById("nome-garcom").value = garcom ? garcom.nome : "";
}

function registrarEntrega() {
    limparErroEntrega();

    // Validações: precisa ter um pedido selecionado e os campos obrigatórios preenchidos
    if (pedidoSelecionadoId === null) {
        mostrarErroEntrega("Selecione um pedido na tabela (botão Entregar) antes de registrar.");
        return;
    }

    const codigoGarcom = document.getElementById("codigo-garcom").value.trim();
    const codigoAtendente = document.getElementById("codigo-atendente").value.trim();
    const senhaAtendente = document.getElementById("senha-atendente").value.trim();

    if (codigoGarcom === "" || codigoAtendente === "" || senhaAtendente === "") {
        mostrarErroEntrega("Preencha código do garçom, código do atendente e senha para registrar a entrega.");
        return;
    }

    // Tudo certo: muda o status do pedido selecionado para "Entregue"
    const pedido = pedidosData.find(function (p) { return p.id === pedidoSelecionadoId; });
    pedido.status = "Entregue";

    limparFormularioEntrega();
    pesquisarPedidos();
}

function limparFormularioEntrega() {
    pedidoSelecionadoId = null;
    document.getElementById("info-pedido-selecionado").classList.add("d-none");
    document.getElementById("card-registrar-entrega").classList.remove("selecionado");
    document.getElementById("codigo-garcom").value = "";
    document.getElementById("nome-garcom").value = "";
    document.getElementById("codigo-atendente").value = "";
    document.getElementById("senha-atendente").value = "";
}

function mostrarErroEntrega(mensagem) {
    const erroDiv = document.getElementById("erro-registrar-entrega");
    erroDiv.innerText = mensagem;
    erroDiv.classList.remove("d-none");
}

function limparErroEntrega() {
    document.getElementById("erro-registrar-entrega").classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-pesquisar").addEventListener("click", pesquisarPedidos);
    document.getElementById("codigo-garcom").addEventListener("input", buscarNomeGarcom);
    document.getElementById("btn-registrar-entrega").addEventListener("click", registrarEntrega);

    pesquisarPedidos(); // mostra todos os pedidos (ordenados) na primeira carga
});