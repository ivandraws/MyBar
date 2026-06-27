const API_BASE_URL = "http://localhost:8080";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // impede o recarregamento padrão da página

    const login = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const submitBtn = event.target.querySelector("button[type='submit']");
    const textoOriginal = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Entrando...";

    limparErro();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, password })
        });

        if (!response.ok) {
            // Seu AuthenticationController devolve 401 com uma string simples no corpo
            mostrarErro("Usuário ou senha inválidos.");
            return;
        }

        const data = await response.json(); // { token, nome, tipo }

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("nome", data.nome);
        sessionStorage.setItem("tipo", data.tipo);

        window.location.href = "./dashboard.html";

    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        mostrarErro("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = textoOriginal;
    }
});

function mostrarErro(mensagem) {
    limparErro();
    const form = document.getElementById("loginForm");
    const alerta = document.createElement("div");
    alerta.id = "login-error";
    alerta.className = "alert alert-danger small py-2 mb-3";
    alerta.innerText = mensagem;
    form.insertBefore(alerta, form.firstChild);
}

function limparErro() {
    const existente = document.getElementById("login-error");
    if (existente) existente.remove();
}