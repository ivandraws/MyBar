// 1. Dados simulados (Mock Data)
const API_DATA = "http://localhost:8080"
const dashboardData = {
    kpis: {
        contas: { valor: 24, delta: "+3 abertas agora" },
        faturamento: { valor: "R$ 4.820", delta: "+12% vs ontem" },
        fila: { valor: 7, delta: "2 com atraso" }
    },
    pedidos: [
        { id: 108, cliente: "Kelson Aires", garcom: "João Lima", itens: 5, total: 234.00, status: "Aberta" },
        { id: 33, cliente: "Raimundo Moura", garcom: "Pedro S.", itens: 2, total: 48.00, status: "Aberta" },
        { id: 47, cliente: "Ana Paula F.", garcom: "João Lima", itens: 8, total: 312.00, status: "Fechando" },
        { id: 55, cliente: "Carlos Melo", garcom: "Maria R.", itens: 3, total: 95.00, status: "Aberta" }
    ],
    cozinha: [
        { conta: "#34", item: "Frango Desossado", status: "Em Preparo" },
        { conta: "#47", item: "Petit Gateau", status: "Solicitado" },
        { conta: "#108", item: "Batata Gratinada", status: "Entregue" }
    ]
};


function initDashboard() {
    // Injetar KPIs
    document.getElementById('kpi-contas').innerText = dashboardData.kpis.contas.valor;
    document.getElementById('kpi-contas-delta').innerText = dashboardData.kpis.contas.delta;
    
    document.getElementById('kpi-faturamento').innerText = dashboardData.kpis.faturamento.valor;
    document.getElementById('kpi-faturamento-delta').innerText = dashboardData.kpis.faturamento.delta;
    
    document.getElementById('kpi-ticket').innerText = dashboardData.kpis.fila.valor;
    document.getElementById('kpi-ticket-delta').innerText = dashboardData.kpis.fila.delta;

    // Injetar Tabela
    const tbody = document.getElementById('pedidos-tbody');
    tbody.innerHTML = dashboardData.pedidos.map(p => `
        <tr>
            <td class="ps-4 fw-bold">${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.garcom}</td>
            <td>${p.itens}</td>
            <td>R$ ${p.total.toFixed(2)}</td>
            <td><span class="badge bg-sage text-dark">${p.status}</span></td>
            <td><button class="btn btn-sm btn-outline-secondary">Ver</button></td>
        </tr>
    `).join('');

    // Injetar Cozinha (A LÓGICA CORRETA ESTÁ AQUI)
    const kitchenList = document.getElementById('kitchen-list');
    kitchenList.innerHTML = dashboardData.cozinha.map(item => {
        // Calculamos a cor baseada no status de CADA item individualmente
        corStatus = NaN
        if (item.status=== 'Entregue') {
            corStatus = 'bg-success text-white';
        }
        else if (item.status==='Solicitado') {
            corStatus = 'bg-light text-dark border';
        }else if (item.status === 'Em Preparo') {
            corStatus = 'bg-warning text-dark';
        }else if(item.status ==='Cancelado'){
            corStatus = 'bg-danger text-white'
        }
        
        return `
            <div class="p-2 border-bottom">
                <small class="text-taupe d-block" style="font-size: 0.75rem;">Conta ${item.conta}</small>
                <span class="d-block fw-bold" style="font-size: 0.85rem;">${item.item}</span>
                <span class="badge border ${corStatus}" style="font-size: 0.7rem;">${item.status}</span>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', initDashboard);