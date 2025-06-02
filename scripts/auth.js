// Funções de autenticação
function estaLogado() {
    return localStorage.getItem("geo_risco_loggedIn") === "true";
}

function obterPerfil() {
    return localStorage.getItem("geo_risco_perfil") || "cidadao";
}

// *** ADIÇÃO CRÍTICA AQUI: Armazenar e obter o e-mail ***
function setUsuarioLogado(email, perfil) {
    localStorage.setItem("geo_risco_loggedIn", "true");
    localStorage.setItem("geo_risco_perfil", perfil);
    localStorage.setItem("geo_risco_email", email); // Armazenar o e-mail
}

function getUsuarioEmail() {
    return localStorage.getItem("geo_risco_email") || ""; // Retorna o e-mail ou string vazia
}

function logout() {
    localStorage.removeItem("geo_risco_loggedIn");
    localStorage.removeItem("geo_risco_perfil");
    localStorage.removeItem("geo_risco_email"); // Remover o e-mail no logout
    localStorage.removeItem('demo_user_name'); // Remover o nome demonstrativo também
}
// *** FIM DA ADIÇÃO CRÍTICA ***

function exigirLoginAcao() {
    if (!estaLogado()) {
        alert("Você precisa fazer login para executar esta ação.");
        window.location.href = "/pages/login.html";
        return false;
    }
    return true;
}

window.authModule = {
    estaLogado,
    obterPerfil,
    exigirLoginAcao,
    // *** ADIÇÃO CRÍTICA AQUI: Expor as novas funções ***
    setUsuarioLogado,
    getUsuarioEmail,
    logout
    // *** FIM DA ADIÇÃO CRÍTICA ***
};