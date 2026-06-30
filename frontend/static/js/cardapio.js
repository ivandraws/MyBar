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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-pesquisar").addEventListener("click", pesquisarItens);

    // Mostra todos os itens (já ordenados) na primeira carga da página
    pesquisarItens();
});