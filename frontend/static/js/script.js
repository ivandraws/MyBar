function carregarUsuario(nome, cargo, inicial) {
    document.getElementById('user-name').innerText = nome;
    document.getElementById('user-role').innerText = cargo;
    document.getElementById('user-avatar').innerText = inicial;
}

// Mapeia o nome técnico do enum (TipoUsuario) para um rótulo amigável em português
const ROTULOS_TIPO = {
    ADMIN: "Administrador",
    COZINHA: "Cozinha",
    GARCOM: "Garçom",
    ATENDENTE_BALCAO: "Atendente Balcão"
};

function inicializarSessao() {
    const token = sessionStorage.getItem("token");

    // Sem token, não tem sessão válida — manda de volta pro login
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    const nome = sessionStorage.getItem("nome") || "Usuário";
    const tipo = sessionStorage.getItem("tipo") || "";
    const cargo = ROTULOS_TIPO[tipo] || tipo;
    const inicial = nome.trim().charAt(0).toUpperCase() || "U";

    carregarUsuario(nome, cargo, inicial);
}

function logout() {
    sessionStorage.clear();
    window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", inicializarSessao);