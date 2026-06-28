const API_BASE_URL = "http://localhost:8080";

function getToken() {
    return sessionStorage.getItem("token");
}

function authHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

// ===================== Rótulos e badges por tipo =====================
const INFO_TIPO = {
    ADMIN:            { rotulo: "Administrador",   classe: "badge-admin" },
    COZINHA:          { rotulo: "Cozinha",          classe: "badge-cozinha" },
    GARCOM:           { rotulo: "Garçom",           classe: "badge-garcom" },
    ATENDENTE_BALCAO: { rotulo: "Atendente Balcão", classe: "badge-atendente" }
};

// ===================== Validação de senha (RNF5) =====================
function ehSequenciaObvia(senha) {
    const digitos = senha.split("").map(Number);
    const ehCrescente = digitos.every((d, i) => i === 0 || d === digitos[i - 1] + 1);
    const ehDecrescente = digitos.every((d, i) => i === 0 || d === digitos[i - 1] - 1);
    return ehCrescente || ehDecrescente;
}

function ehTodosDigitosIguais(senha) {
    return senha.split("").every(c => c === senha[0]);
}

function ehRepeticaoEmPar(senha) {
    return senha.substring(0, 2) === senha.substring(2, 4);
}

function ehIgualAoCodigo(senha, codigoUsuario) {
    return senha === codigoUsuario.toString();
}

function validarSenha(senha, codigoUsuario) {
    if (senha.length !== 4 || !/^\d{4}$/.test(senha)) {
        return "A senha deve ter exatamente 4 dígitos numéricos.";
    }
    if (ehTodosDigitosIguais(senha)) {
        return "Senha fraca: não use os 4 dígitos iguais (ex: 1111).";
    }
    if (ehSequenciaObvia(senha)) {
        return "Senha fraca: não use sequências óbvias (ex: 1234, 4321).";
    }
    if (ehRepeticaoEmPar(senha)) {
        return "Senha fraca: não repita os mesmos 2 dígitos (ex: 1212, 1010).";
    }
    if (ehIgualAoCodigo(senha, codigoUsuario)) {
        return "A senha não pode ser igual ao código do usuário.";
    }
    return null;
}

// ===================== Listagem =====================
async function pesquisarUsuarios() {
    const nomeDigitado = document.getElementById("filtro-nome").value.trim().toLowerCase();

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: "GET",
            headers: authHeader()
        });

        if (response.status === 403) {
            alert("Você não tem permissão para acessar esta página.");
            window.location.href = "./dashboard.html";
            return;
        }

        if (!response.ok) {
            mostrarErroGeral("Erro ao buscar usuários.");
            return;
        }

        const usuarios = await response.json();

        const resultado = usuarios
            .filter(u => nomeDigitado === "" || u.nome.toLowerCase().includes(nomeDigitado))
            .sort((a, b) => a.nome.localeCompare(b.nome));

        renderizarTabela(resultado);

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        mostrarErroGeral("Não foi possível conectar ao servidor.");
    }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById("usuarios-tbody");
    tbody.innerHTML = usuarios.map(criarLinhaTabela).join("");
}

function criarLinhaTabela(usuario) {
    const info = INFO_TIPO[usuario.tipo] || { rotulo: usuario.tipo, classe: "" };
    return `
        <tr>
            <td class="ps-4 fw-bold">${usuario.codigo}</td>
            <td>${usuario.nome}</td>
            <td><span class="badge-tipo-usuario ${info.classe}">${info.rotulo}</span></td>
            <td class="d-flex gap-2">
                <button class="btn btn-acao btn-ver" onclick="visualizarUsuario(${usuario.codigo})">Visualizar</button>
                <button class="btn btn-acao btn-lancar" onclick="abrirFormularioEdicao(${usuario.codigo})">Alterar</button>
                <button class="btn btn-acao btn-fechar" onclick="excluirUsuario(${usuario.codigo})">Excluir</button>
            </td>
        </tr>
    `;
}

// ===================== Formulário =====================
let codigoEmEdicao = null;
let usuariosCached = [];

async function abrirFormularioNovo() {
    codigoEmEdicao = null;
    document.getElementById("titulo-form-usuario").innerText = "Novo Usuário";
    document.getElementById("form-codigo").value = "";
    document.getElementById("form-codigo").disabled = false;
    document.getElementById("form-nome").value = "";
    document.getElementById("form-tipo").value = "GARCOM";
    document.getElementById("form-email").value = "";
    document.getElementById("form-senha").value = "";
    limparErrosFormulario();
    document.getElementById("card-form-usuario").classList.remove("d-none");
}

async function abrirFormularioEdicao(codigo) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            headers: authHeader()
        });
        const usuarios = await response.json();
        const usuario = usuarios.find(u => u.codigo === codigo);
        if (!usuario) return;

        usuariosCached = usuarios;
        codigoEmEdicao = codigo;

        document.getElementById("titulo-form-usuario").innerText = "Alterar Usuário";
        document.getElementById("form-codigo").value = usuario.codigo;
        document.getElementById("form-codigo").disabled = true;
        document.getElementById("form-nome").value = usuario.nome;
        document.getElementById("form-tipo").value = usuario.tipo;
        document.getElementById("form-email").value = usuario.email;
        document.getElementById("form-senha").value = "";

        limparErrosFormulario();
        document.getElementById("card-form-usuario").classList.remove("d-none");

    } catch (error) {
        alert("Erro ao carregar dados do usuário.");
    }
}

function fecharFormulario() {
    document.getElementById("card-form-usuario").classList.add("d-none");
    codigoEmEdicao = null;
}

async function salvarUsuario() {
    limparErrosFormulario();

    const codigoStr = document.getElementById("form-codigo").value.trim();
    const nome = document.getElementById("form-nome").value.trim();
    const tipo = document.getElementById("form-tipo").value;
    const email = document.getElementById("form-email").value.trim();
    const senha = document.getElementById("form-senha").value.trim();

    if (!codigoStr || !nome || !email) {
        mostrarErroGeral("Preencha código, nome e email.");
        return;
    }

    const codigo = parseInt(codigoStr);

    // senha obrigatória só na criação
    if (codigoEmEdicao === null || senha !== "") {
        const erroSenha = validarSenha(senha, codigo);
        if (erroSenha) { mostrarErroSenha(erroSenha); return; }
    }

    const body = {
        codigo: codigo,
        nome: nome,
        login: email,
        password: senha,
        role: tipo
    };

    try {
        const method = codigoEmEdicao === null ? "POST" : "PUT";

        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: method,
            headers: authHeader(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const msg = await response.text();
            mostrarErroGeral(msg || "Erro ao salvar usuário.");
            return;
        }

        fecharFormulario();
        pesquisarUsuarios();

    } catch (error) {
        mostrarErroGeral("Não foi possível conectar ao servidor.");
    }
}

async function visualizarUsuario(codigo) {
    await abrirFormularioEdicao(codigo);
    document.querySelectorAll("#card-form-usuario input, #card-form-usuario select").forEach(campo => {
        campo.disabled = true;
    });
    document.getElementById("btn-salvar-usuario").classList.add("d-none");
}

async function excluirUsuario(codigo) {
    const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${codigo}`, {
            method: "DELETE",
            headers: authHeader()
        });

        if (!response.ok) {
            alert("Não foi possível excluir o usuário.");
            return;
        }

        pesquisarUsuarios();

    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}

// ===================== Utilitários =====================
function mostrarErroSenha(mensagem) {
    const el = document.getElementById("erro-senha");
    el.innerText = mensagem;
    el.classList.remove("d-none");
}

function mostrarErroGeral(mensagem) {
    const el = document.getElementById("erro-geral-usuario");
    el.innerText = mensagem;
    el.classList.remove("d-none");
}

function limparErrosFormulario() {
    document.getElementById("erro-senha").classList.add("d-none");
    document.getElementById("erro-geral-usuario").classList.add("d-none");
    document.querySelectorAll("#card-form-usuario input, #card-form-usuario select").forEach(campo => {
        campo.disabled = false;
    });
    document.getElementById("form-codigo").disabled = (codigoEmEdicao !== null);
    document.getElementById("btn-salvar-usuario").classList.remove("d-none");
}

// ===================== Init =====================
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-pesquisar").addEventListener("click", pesquisarUsuarios);
    document.getElementById("btn-novo-usuario").addEventListener("click", abrirFormularioNovo);
    document.getElementById("btn-salvar-usuario").addEventListener("click", salvarUsuario);
    document.getElementById("btn-cancelar-usuario").addEventListener("click", fecharFormulario);
    pesquisarUsuarios();
});