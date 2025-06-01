// Funções de autenticação
function estaLogado() {
    return localStorage.getItem("geo_risco_loggedIn") === "true";
}

function obterPerfil() {
    // Retorna o perfil armazenado ou "cidadao" como padrão
    return localStorage.getItem("geo_risco_perfil") || "cidadao";
}

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
    exigirLoginAcao
};
