// 1. Dados simulados (Mock Data) — depois vamos trocar isso por uma chamada à API
const contasData = [
    { numero: 108, cpf: "123.456.789-10", cliente: "Kelson Aires", celular: "(86) 98888-8888", garcom: "João Lima", abertura: "21:30", status: "Aberta" },
    { numero: 33,  cpf: "987.654.321-00", cliente: "Raimundo Moura", celular: "(86) 99999-9999", garcom: "Pedro S.", abertura: "21:45", status: "Aberta" },
    { numero: 47,  cpf: "111.222.333-44", cliente: "Ana Paula F.", celular: "(86) 97777-1234", garcom: "João Lima", abertura: "22:00", status: "Aberta" },
    { numero: 12,  cpf: "555.666.777-88", cliente: "Carlos Melo", celular: "(86) 96666-5678", garcom: "Maria R.", abertura: "20:15", status: "Fechada" },
    { numero: 9,   cpf: "999.888.777-66", cliente: "Fernanda Cruz", celular: "(86) 95555-9012", garcom: "Pedro S.", abertura: "20:00", status: "Fechada" },
    { numero: 5,   cpf: "444.333.222-11", cliente: "Lucas Santos", celular: "(86) 94444-3456", garcom: "João Lima", abertura: "19:45", status: "Fechada" }
];

// Guarda qual filtro está ativo agora ("todas", "aberta" ou "fechada")
let filtroAtual = "todas";

function renderizarTabela() {
    const tbody = document.getElementById("contas-tbody");

    // Passo 1: filtrar os dados conforme o filtro ativo
    const contasFiltradas = contasData.filter(function (conta) {
        if (filtroAtual === "todas") {
            return true; // mostra tudo, sem filtrar nada
        }
        // Compara o status da conta (em minúsculo) com o filtro escolhido
        return conta.status.toLowerCase() === filtroAtual;
    });

    // Passo 2: transformar cada conta em uma linha de tabela (<tr>)
    tbody.innerHTML = contasFiltradas.map(function (conta) {
        return criarLinhaTabela(conta);
    }).join("");
}

function criarLinhaTabela(conta) {
    const isAberta = conta.status === "Aberta";

    // Badge de status muda de cor dependendo se está aberta ou fechada
    const badgeClasse = isAberta ? "badge-aberta" : "badge-fechada";

    // Botões de ação só aparecem se a conta estiver aberta
    const botoesAcao = isAberta
        ? `
            <button class="btn btn-acao btn-ver">Ver</button>
            <button class="btn btn-acao btn-lancar">Lançar</button>
            <button class="btn btn-acao btn-fechar">Fechar</button>
          `
        : "";

    return `
        <tr>
            <td class="ps-4 fw-bold">${conta.numero}</td>
            <td>${conta.cpf}</td>
            <td>${conta.cliente}</td>
            <td>${conta.celular}</td>
            <td>${conta.garcom}</td>
            <td>${conta.abertura}</td>
            <td><span class="badge-status ${badgeClasse}">${conta.status}</span></td>
            <td class="d-flex gap-2">${botoesAcao}</td>
        </tr>
    `;
}

function configurarFiltros() {
    const botoesFiltro = document.querySelectorAll(".btn-filtro");

    botoesFiltro.forEach(function (botao) {
        botao.addEventListener("click", function () {
            // Remove "active" de todos os botões, depois adiciona só no que foi clicado
            botoesFiltro.forEach(function (b) { b.classList.remove("active"); });
            botao.classList.add("active");

            filtroAtual = botao.dataset.filtro; // lê o atributo data-filtro do botão clicado
            renderizarTabela();
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    configurarFiltros();
    renderizarTabela();
});