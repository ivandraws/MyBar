// ============================================================
//  contas.js — integração real com a API REST do MyBar
// ============================================================

const API_BASE = "http://localhost:8080"; // ajuste conforme o ambiente

// ── estado global ──────────────────────────────────────────
let todasContas  = [];   // dados vindos da API
let filtroAtual  = "todas";
let termoBusca   = "";
let contaEmEdicao = null; // objeto Conta sendo editado/visualizado

// ── helpers de autenticação ────────────────────────────────
async function apiFetch(caminho, opcoes = {}) {
    const token = sessionStorage.getItem("token");

    // 1. Configura os cabeçalhos padrão (JSON + Token)
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        ...(opcoes.headers || {})
    };

    // 2. Faz a requisição
    const resposta = await fetch(API_BASE + caminho, {
        ...opcoes,
        headers: headers
    });

    // 3. Gerenciamento de Erros (O "Segredo" para não deslogar)
    
    // Erro crítico de permissão: aqui sim devemos limpar a sessão
    if (resposta.status === 401 || resposta.status === 403) {
        sessionStorage.clear();
        window.location.href = "./login.html";
        throw new Error("Sessão expirada ou acesso negado.");
    }

    // Se o backend retornou erro (ex: 400 Bad Request, 500 Internal Error)
    if (!resposta.ok) {
        const mensagemErro = await resposta.text(); // Lê a mensagem que o Java enviou
        throw new Error(mensagemErro || "Erro na requisição: " + resposta.status);
    }

    // 4. Retorna o JSON se a resposta for 200 OK
    return await resposta.json();
}
function getToken() {
    return sessionStorage.getItem("token") || "";
}

function headers(extra = {}) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
        ...extra
    };
}

// ── chamadas à API ─────────────────────────────────────────
async function apiListarContas() {
    const res = await fetch(`${API_BASE}/contas`, { headers: headers() });
    if (!res.ok) throw new Error(`Erro ao listar contas: ${res.status}`);
    return res.json();
}
async function apiBuscarCliente(cpf) {
    const res = await fetch(`${API_BASE}/clientes/cpf/${encodeURIComponent(cpf)}`, { headers: headers() });
    
    // O PULO DO GATO: Se o backend retornar 404 (Não encontrou) OU 403 (Bloqueou a busca),
    // nós retornamos null para forçar o sistema a criar o cliente novo.
    if (res.status === 404 || res.status === 403) {
        return null; 
    }
    
    if (!res.ok) {
        throw new Error(`Erro ao buscar cliente: ${res.status}`);
    }
    
    return res.json();
}

async function apiAbrirConta(conta, codigoGarcom, senha) {
    const url = `${API_BASE}/contas?codigoGarcom=${encodeURIComponent(codigoGarcom)}&senha=${encodeURIComponent(senha)}`;
    const res = await fetch(url, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(conta)
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erro ${res.status}`);
    }
    return res.json();
}

async function apiAlterarConta(id, conta, codigoGarcom, senha) {
    const url = `${API_BASE}/contas/${id}?codigoGarcom=${encodeURIComponent(codigoGarcom)}&senha=${encodeURIComponent(senha)}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(conta)
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erro ${res.status}`);
    }
    return res.json();
}

async function apiExcluirConta(id) {
    const res = await fetch(`${API_BASE}/contas/${id}`, {
        method: "DELETE",
        headers: headers()
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erro ${res.status}`);
    }
}

async function apiCriarCliente(cliente) {
    const res = await fetch(`${API_BASE}/clientes`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(cliente)
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erro ${res.status}`);
    }
    return res.json();
}

// ── carregamento e exibição ────────────────────────────────
async function carregarContas() {
    try {
        todasContas = await apiListarContas();
        renderizarTabela();
    } catch (err) {
        mostrarAlerta("Não foi possível carregar as contas. Verifique a conexão com o servidor.", "danger");
    }
}

function contasFiltradas() {
    return todasContas.filter(conta => {
        // filtro de status
        const statusOk = filtroAtual === "todas" ||
            conta.status?.toLowerCase() === filtroAtual.toUpperCase() ||
            conta.status === filtroAtual.toUpperCase();

        // busca textual
        const termo = termoBusca.toLowerCase();
        const buscaOk = !termo ||
            String(conta.numero).includes(termo) ||
            (conta.cliente?.cpf || "").toLowerCase().includes(termo) ||
            (conta.cliente?.nome || "").toLowerCase().includes(termo);

        return statusOk && buscaOk;
    });
}

function renderizarTabela() {
    const tbody = document.getElementById("contas-tbody");
    const lista = contasFiltradas();

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-taupe">Nenhuma conta encontrada.</td>
            </tr>`;
        return;
    }

    tbody.innerHTML = lista.map(criarLinhaTabela).join("");

    // eventos nos botões de cada linha
    tbody.querySelectorAll(".btn-ver").forEach(btn =>
        btn.addEventListener("click", () => abrirModalVisualizacao(btn.dataset.id)));
    tbody.querySelectorAll(".btn-alterar").forEach(btn =>
        btn.addEventListener("click", () => abrirModalEdicao(btn.dataset.id)));
    tbody.querySelectorAll(".btn-excluir").forEach(btn =>
        btn.addEventListener("click", () => abrirModalExclusao(btn.dataset.id)));
}

function criarLinhaTabela(conta) {
    const isAberta = conta.status === "ABERTA";
    const badgeClasse = isAberta ? "badge-aberta" : "badge-fechada";
    const labelStatus = isAberta ? "Aberta" : (conta.status === "FECHADA" ? "Fechada" : "Cancelada");

    const dataHora = conta.dataAbertura
        ? `${formatarData(conta.dataAbertura)} ${formatarHora(conta.horaAbertura)}`
        : "—";

    const botoesAcao = `
        <button class="btn btn-acao btn-ver"     data-id="${conta.id}">Ver</button>
        <button class="btn btn-acao btn-alterar" data-id="${conta.id}">Alterar</button>
        <button class="btn btn-acao btn-excluir" data-id="${conta.id}">Excluir</button>
    `;

    return `
        <tr>
            <td class="ps-4 fw-bold">${conta.numero}</td>
            <td>${conta.cliente?.cpf || "—"}</td>
            <td>${conta.cliente?.nome || "—"}</td>
            <td>${conta.cliente?.telefone || "—"}</td>
            <td>—</td>
            <td>${dataHora}</td>
            <td><span class="badge-status ${badgeClasse}">${labelStatus}</span></td>
            <td class="d-flex gap-2 flex-wrap">${botoesAcao}</td>
        </tr>
    `;
}

// ── utilitários de formatação ──────────────────────────────
function formatarData(data) {
    if (!data) return "";
    if (Array.isArray(data)) {
        const [ano, mes, dia] = data;
        return `${String(dia).padStart(2,"0")}/${String(mes).padStart(2,"0")}/${ano}`;
    }
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
}

function formatarHora(hora) {
    if (!hora) return "";
    if (Array.isArray(hora)) {
        const [h, m] = hora;
        return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    }
    return String(hora).substring(0, 5);
}

function mostrarAlerta(msg, tipo = "danger") {
    const area = document.getElementById("area-alerta");
    if (!area) return;
    area.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

function limparAlerta() {
    const area = document.getElementById("area-alerta");
    if (area) area.innerHTML = "";
}
function abrirModalNovaConta() {
    contaEmEdicao = null;
    document.getElementById("modal-titulo").textContent = "Nova Conta";
    
    // SOLUÇÃO DEFINITIVA: Limpa os campos manualmente sem usar o .reset()
    const campos = document.querySelectorAll("#form-conta input, #form-conta select");
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
async function abrirModalEdicao(id) {
    const conta = todasContas.find(c => String(c.id) === String(id));
    if (!conta) return;
    contaEmEdicao = conta;

    document.getElementById("modal-titulo").textContent = "Alterar Conta";
    document.getElementById("campo-cpf").value = conta.cliente?.cpf || "";
    document.getElementById("campo-cpf").setAttribute("readonly", true);
    document.getElementById("campo-numero").value = conta.numero;
    document.getElementById("campo-nome").value = conta.cliente?.nome || "";
    document.getElementById("campo-telefone").value = conta.cliente?.telefone || "";
    document.getElementById("campo-sexo").value = conta.cliente?.sexo || "M";
    document.getElementById("campo-data").value = Array.isArray(conta.dataAbertura)
        ? `${conta.dataAbertura[0]}-${String(conta.dataAbertura[1]).padStart(2,"0")}-${String(conta.dataAbertura[2]).padStart(2,"0")}`
        : conta.dataAbertura;
    document.getElementById("campo-hora").value = formatarHora(conta.horaAbertura);
    document.getElementById("info-cliente").classList.add("d-none");
    document.getElementById("btn-salvar-conta").textContent = "Salvar Alterações";

    const modal = new bootstrap.Modal(document.getElementById("modal-conta"));
    modal.show();
}

async function abrirModalVisualizacao(id) {
    const conta = todasContas.find(c => String(c.id) === String(id));
    if (!conta) return;
    contaEmEdicao = conta;

    document.getElementById("modal-titulo").textContent = "Visualizar Conta";
    document.getElementById("campo-cpf").value = conta.cliente?.cpf || "";
    document.getElementById("campo-cpf").setAttribute("readonly", true);
    document.getElementById("campo-numero").value = conta.numero;
    document.getElementById("campo-nome").value = conta.cliente?.nome || "";
    document.getElementById("campo-telefone").value = conta.cliente?.telefone || "";
    document.getElementById("campo-sexo").value = conta.cliente?.sexo || "M";
    document.getElementById("campo-data").value = Array.isArray(conta.dataAbertura)
        ? `${conta.dataAbertura[0]}-${String(conta.dataAbertura[1]).padStart(2,"0")}-${String(conta.dataAbertura[2]).padStart(2,"0")}`
        : conta.dataAbertura;
    document.getElementById("campo-hora").value = formatarHora(conta.horaAbertura);
    document.getElementById("info-cliente").classList.add("d-none");

    // modo somente leitura
    document.querySelectorAll("#form-conta input, #form-conta select")
        .forEach(el => el.setAttribute("disabled", true));
    document.getElementById("btn-salvar-conta").classList.add("d-none");
    document.getElementById("btn-cancelar-modal").textContent = "Fechar";

    const modal = new bootstrap.Modal(document.getElementById("modal-conta"));
    modal.show();

    // quando fechar, reativa campos
    document.getElementById("modal-conta").addEventListener("hidden.bs.modal", function handler() {
        document.querySelectorAll("#form-conta input, #form-conta select")
            .forEach(el => el.removeAttribute("disabled"));
        document.getElementById("btn-salvar-conta").classList.remove("d-none");
        document.getElementById("btn-cancelar-modal").textContent = "Cancelar";
        this.removeEventListener("hidden.bs.modal", handler);
    });
}

// busca cliente ao sair do campo CPF (nova conta)
async function onCpfBlur() {
    if (contaEmEdicao) return; // edição: CPF já fixo
    const cpf = document.getElementById("campo-cpf").value.trim();
    if (!cpf) return;
    try {
        const cliente = await apiBuscarCliente(cpf);
        const infoEl = document.getElementById("info-cliente");
        if (cliente) {
            document.getElementById("campo-nome").value = cliente.nome;
            document.getElementById("campo-telefone").value = cliente.telefone || "";
            document.getElementById("campo-sexo").value = cliente.sexo || "M";
            infoEl.textContent = "✓ Cliente encontrado no cadastro.";
            infoEl.className = "small text-success mt-1";
            infoEl.classList.remove("d-none");
        } else {
            document.getElementById("campo-nome").value = "";
            document.getElementById("campo-telefone").value = "";
            infoEl.textContent = "Cliente não encontrado — preencha os dados para cadastrá-lo.";
            infoEl.className = "small text-warning mt-1";
            infoEl.classList.remove("d-none");
        }
    } catch (_) { /* silencioso */ }
}
async function salvarConta() {
    // 1. Captura dos dados do formulário
    const codigoGarcom = document.getElementById("campo-codigo-garcom").value.trim();
    const senha        = document.getElementById("campo-senha-garcom").value.trim();
    const cpf          = document.getElementById("campo-cpf").value.trim();
    const nome         = document.getElementById("campo-nome").value.trim();
    const telefone     = document.getElementById("campo-telefone").value.trim();
    const sexo         = document.getElementById("campo-sexo").value;
    const numero       = parseInt(document.getElementById("campo-numero").value, 10);

    // 2. Validação básica
    if (!codigoGarcom || !senha || !cpf || !nome || isNaN(numero)) {
        mostrarAlerta("Preencha todos os campos obrigatórios.");
        return;
    }

    // Desabilita o botão para evitar cliques duplos
    const btnSalvar = document.getElementById("btn-salvar-conta");
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
        // 3. Verifica se o cliente existe; se não, cria um novo
        let cliente = await apiBuscarCliente(cpf);
        
        if (!cliente) {
            cliente = await apiFetch("/clientes", {
                method: "POST",
                body: JSON.stringify({ cpf, nome, telefone, sexo })
            });
        }

        // 4. Monta os dados para o envio (Corpo JSON e Query String)
        const corpoConta = { numero: numero, cliente: { id: cliente.id } };
        const parametros = `?codigoGarcom=${encodeURIComponent(codigoGarcom)}&senha=${encodeURIComponent(senha)}`;

        // 5. Faz a requisição POST (nova) ou PUT (edição)
        if (contaEmEdicao) {
            await apiFetch(`/contas/${contaEmEdicao.id}` + parametros, { 
                method: "PUT", 
                body: JSON.stringify(corpoConta) 
            });
            mostrarAlerta("Conta alterada com sucesso!", "success");
        } else {
            await apiFetch("/contas" + parametros, { 
                method: "POST", 
                body: JSON.stringify(corpoConta) 
            });
            mostrarAlerta("Conta aberta com sucesso!", "success");
        }

        // 6. Fecha o modal e recarrega a tabela de contas
        bootstrap.Modal.getInstance(document.getElementById("modal-conta")).hide();
        await carregarContas();

    } catch (err) {
        mostrarAlerta(err.message || "Erro ao salvar conta.");
    } finally {
        // 7. Restaura o estado original do botão
        btnSalvar.disabled = false;
        btnSalvar.textContent = contaEmEdicao ? "Salvar Alterações" : "Abrir Conta";
    }
}
// ── modal Exclusão ─────────────────────────────────────────
function abrirModalExclusao(id) {
    const conta = todasContas.find(c => String(c.id) === String(id));
    if (!conta) return;

    document.getElementById("msg-exclusao").textContent =
        `Deseja excluir a conta Nº ${conta.numero} do cliente ${conta.cliente?.nome || ""}?`;
    document.getElementById("btn-confirmar-exclusao").dataset.id = id;

    const modal = new bootstrap.Modal(document.getElementById("modal-exclusao"));
    modal.show();
}

async function confirmarExclusao() {
    const id = document.getElementById("btn-confirmar-exclusao").dataset.id;
    const btn = document.getElementById("btn-confirmar-exclusao");
    btn.disabled = true;
    btn.textContent = "Excluindo...";

    try {
        await apiExcluirConta(id);
        bootstrap.Modal.getInstance(document.getElementById("modal-exclusao")).hide();
        mostrarAlerta("Conta excluída com sucesso.", "success");
        await carregarContas();
    } catch (err) {
        mostrarAlerta(err.message || "Erro ao excluir conta.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Excluir";
    }
}

// ── filtros e busca ────────────────────────────────────────
function configurarFiltros() {
    document.querySelectorAll(".btn-filtro").forEach(botao => {
        botao.addEventListener("click", () => {
            document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
            botao.classList.add("active");
            filtroAtual = botao.dataset.filtro;
            renderizarTabela();
        });
    });
}

function configurarBusca() {
    const campo = document.getElementById("campo-busca");
    if (!campo) return;
    campo.addEventListener("input", () => {
        termoBusca = campo.value;
        renderizarTabela();
    });
}

// ── injeção dos modais no DOM ──────────────────────────────
function injetarModais() {
    const html = `
    <!-- ÁREA DE ALERTAS -->
    <div id="area-alerta" style="position:fixed;top:70px;right:20px;z-index:9999;min-width:320px;max-width:440px;"></div>

    <!-- MODAL NOVA CONTA / EDIÇÃO -->
    <div class="modal fade" id="modal-conta" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-titulo">Nova Conta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="form-conta">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">CPF *</label>
                            <input type="text" id="campo-cpf" class="form-control"
                                   placeholder="000.000.000-00" maxlength="14">
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
                        <hr>
                        <p class="text-taupe small mb-2">Autenticação do Garçom</p>
                        <div class="row g-2">
                            <div class="col-6">
                                <label class="form-label fw-semibold">Código *</label>
                                <input type="text" id="campo-codigo-garcom" class="form-control" placeholder="1010">
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-semibold">Senha *</label>
                                <input type="password" id="campo-senha-garcom" class="form-control" placeholder="••••">
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

// ── inicialização ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
    injetarModais();
    configurarFiltros();
    configurarBusca();

    // botão "+ Nova Conta"
    document.getElementById("btn-nova-conta")
        ?.addEventListener("click", abrirModalNovaConta);

    // eventos do modal de conta
    document.getElementById("btn-salvar-conta")
        .addEventListener("click", salvarConta);
    document.getElementById("campo-cpf")
        .addEventListener("blur", onCpfBlur);

    // evento do modal de exclusão
    document.getElementById("btn-confirmar-exclusao")
        .addEventListener("click", confirmarExclusao);

    // carrega contas da API
    carregarContas();
});