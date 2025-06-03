document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const perfil = document.getElementById("perfil").value;

    // Simula “autenticação” – armazena no localStorage
    localStorage.setItem("geo_risco_loggedIn", "true");
    localStorage.setItem("geo_risco_perfil", perfil);
    // Poderíamos também salvar o e-mail, se quisermos exibir em “meu perfil”
    localStorage.setItem("geo_risco_email", email);

    // Mensagem rápida:
    alert("Login feito com sucesso!");

    // Redireciona para a página principal (incidentes)
    window.location.href = "index.html";
});