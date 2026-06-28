// 1. Dados simulados (Mock Data) — cada conta tem data, forma de pagamento e os itens lançados nela
// Depois, isso vai vir de uma chamada à API que devolve as contas do período
const contasData = [
    {
        data: "2026-06-20",
        formaPagamento: "Dinheiro",
        itens: [
            { tipo: "Entrada", valor: 50.00, gorjeta: 0 },
            { tipo: "Bebida", valor: 16.00, gorjeta: 1.60 },
            { tipo: "Comida", valor: 60.00, gorjeta: 12.00 }
        ]
    },
    {
        data: "2026-06-21",
        formaPagamento: "Pix",
        itens: [
            { tipo: "Entrada", valor: 10.00, gorjeta: 0 },
            { tipo: "Sobremesa", valor: 20.00, gorjeta: 2.00 },
            { tipo: "Bebida", valor: 9.50, gorjeta: 0.95 }
        ]
    },
    {
        data: "2026-06-22",
        formaPagamento: "Crédito",
        itens: [
            { tipo: "Entrada", valor: 50.00, gorjeta: 0 },
            { tipo: "Comida", valor: 60.00, gorjeta: 12.00 },
            { tipo: "Comida", valor: 24.00, gorjeta: 4.80 }
        ]
    },
    {
        data: "2026-06-22",
        formaPagamento: "Débito",
        itens: [
            { tipo: "Entrada", valor: 10.00, gorjeta: 0 },
            { tipo: "Bebida", valor: 8.00, gorjeta: 0.80 },
            { tipo: "Sobremesa", valor: 20.00, gorjeta: 2.00 }
        ]
    },
    {
        data: "2026-06-25",
        formaPagamento: "Dinheiro",
        itens: [
            { tipo: "Entrada", valor: 50.00, gorjeta: 0 },
            { tipo: "Bebida", valor: 9.50, gorjeta: 0.95 }
        ]
    }
];

function gerarRelatorio() {
    limparErroPeriodo();

    const dataInicio = document.getElementById("periodo-inicio").value;
    const dataFim = document.getElementById("periodo-fim").value;

    if (dataInicio === "" || dataFim === "") {
        mostrarErroPeriodo("Selecione a data de início e a data fim do período.");
        return;
    }

    if (dataInicio > dataFim) {
        mostrarErroPeriodo("A data de início não pode ser depois da data fim.");
        return;
    }

    // Passo 1: filtrar só as contas dentro do período escolhido
    // Como as datas estão no formato "AAAA-MM-DD", comparar como texto já funciona corretamente
    const contasFiltradas = contasData.filter(function (conta) {
        return conta.data >= dataInicio && conta.data <= dataFim;
    });

    calcularEExibirIndicadores(contasFiltradas);
    calcularEExibirDetalhamento(contasFiltradas);
    calcularEExibirPagamentos(contasFiltradas);
}

// Soma o valor de TODOS os itens de UMA conta (usado em vários cálculos abaixo)
function valorTotalDaConta(conta) {
    return conta.itens.reduce(function (somaAcumulada, item) {
        return somaAcumulada + item.valor + item.gorjeta;
    }, 0); // o "0" é o ponto de partida da soma
}

function calcularEExibirIndicadores(contas) {
    const totalContas = contas.length;

    const faturamentoTotal = contas.reduce(function (somaAcumulada, conta) {
        return somaAcumulada + valorTotalDaConta(conta);
    }, 0);

    // Ticket médio = faturamento total / quantidade de contas (evitando divisão por zero)
    const ticketMedio = totalContas > 0 ? faturamentoTotal / totalContas : 0;

    document.getElementById("kpi-total-contas").innerText = totalContas;
    document.getElementById("kpi-ticket-medio").innerText = formatarMoeda(ticketMedio);
    document.getElementById("kpi-faturamento").innerText = formatarMoeda(faturamentoTotal);
}

function calcularEExibirDetalhamento(contas) {
    // Junta todos os itens de todas as contas filtradas numa lista só
    const todosOsItens = contas.flatMap(function (conta) {
        return conta.itens;
    });

    const somaPorTipo = function (tipoBuscado) {
        return todosOsItens
            .filter(function (item) { return item.tipo === tipoBuscado; })
            .reduce(function (soma, item) { return soma + item.valor; }, 0);
    };

    const somaGorjetas = todosOsItens.reduce(function (soma, item) {
        return soma + item.gorjeta;
    }, 0);

    document.getElementById("det-entrada").innerText = formatarMoeda(somaPorTipo("Entrada"));
    document.getElementById("det-bebidas").innerText = formatarMoeda(somaPorTipo("Bebida"));
    document.getElementById("det-comidas").innerText = formatarMoeda(somaPorTipo("Comida"));
    document.getElementById("det-sobremesas").innerText = formatarMoeda(somaPorTipo("Sobremesa"));
    document.getElementById("det-gorjetas").innerText = formatarMoeda(somaGorjetas);
}

function calcularEExibirPagamentos(contas) {
    const somaPorFormaPagamento = function (formaBuscada) {
        return contas
            .filter(function (conta) { return conta.formaPagamento === formaBuscada; })
            .reduce(function (soma, conta) { return soma + valorTotalDaConta(conta); }, 0);
    };

    document.getElementById("pag-dinheiro").innerText = formatarMoeda(somaPorFormaPagamento("Dinheiro"));
    document.getElementById("pag-debito").innerText = formatarMoeda(somaPorFormaPagamento("Débito"));
    document.getElementById("pag-credito").innerText = formatarMoeda(somaPorFormaPagamento("Crédito"));
    document.getElementById("pag-pix").innerText = formatarMoeda(somaPorFormaPagamento("Pix"));
}

function formatarMoeda(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function mostrarErroPeriodo(mensagem) {
    const erroDiv = document.getElementById("erro-periodo");
    erroDiv.innerText = mensagem;
    erroDiv.classList.remove("d-none");
}

function limparErroPeriodo() {
    document.getElementById("erro-periodo").classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-gerar").addEventListener("click", gerarRelatorio);
});