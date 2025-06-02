// scripts/perfil.js

// Elementos DOM (NÃO DECLARAR OS MODAIS AQUI, ELES SÃO DO modal.js)
let profileNameSpan;
let profileEmailSpan;
let profileRoleSpan;

let btnEditName;
let btnChangePassword;
let btnLogout;

// Variáveis para os formulários e inputs DENTRO DOS MODAIS (estas sim são específicas do perfil.js)
let formEditName;
let newNameInput;

let formChangePassword;
let currentPasswordInput;
let newPasswordInput;
let confirmNewPasswordInput;

// Variável para simular o nome do usuário (apenas para demonstração)
let demoUserName = localStorage.getItem('demo_user_name') || "Usuário GeoRisco";

/**
 * Inicializa as referências aos elementos DOM da página de perfil.
 */
function initPerfilElements() {
    profileNameSpan = document.getElementById('profile-name');
    profileEmailSpan = document.getElementById('profile-email');
    profileRoleSpan = document.getElementById('profile-role');

    btnEditName = document.getElementById('btn-edit-name');
    btnChangePassword = document.getElementById('btn-change-password');
    btnLogout = document.getElementById('btn-logout');

    formEditName = document.getElementById('form-edit-name');
    newNameInput = document.getElementById('new-name');

    formChangePassword = document.getElementById('form-change-password');
    currentPasswordInput = document.getElementById('current-password');
    newPasswordInput = document.getElementById('new-password');
    confirmNewPasswordInput = document.getElementById('confirm-new-password');
}

/**
 * Popula as informações do perfil na página com dados simulados e do auth.js.
 */
function populateProfileInfo() {
    // É crucial que authModule esteja carregado ANTES de chamar esta função
    if (window.authModule && window.authModule.estaLogado()) {
        const perfilUsuario = window.authModule.obterPerfil();
        const usuarioEmail = window.authModule.getUsuarioEmail(); // Obter o e-mail

        if (profileNameSpan) profileNameSpan.textContent = demoUserName;
        if (profileEmailSpan) {
            profileEmailSpan.textContent = usuarioEmail; // Usar o e-mail real
        }
        if (profileRoleSpan) {
            profileRoleSpan.textContent = perfilUsuario.toUpperCase();
        }

        if (newNameInput) newNameInput.value = demoUserName;

    } else {
        alert("Você precisa estar logado para ver seu perfil.");
        window.location.href = "/pages/login.html";
    }
}

/**
 * Configura os event listeners para os botões e formulários do perfil.
 */
function setupPerfilEvents() {
    // Abrir Modal de Edição de Nome
    console.log("perfil.js: btnEditName encontrado?", btnEditName);
    console.log("perfil.js: window.modalModule existe?", !!window.modalModule);
    console.log("perfil.js: window.modalModule.openModal é função?", typeof window.modalModule?.openModal === 'function');
    console.log("perfil.js: window.modalModule.modalEditName encontrado?", window.modalModule?.modalEditName);
    if (btnEditName && window.modalModule && typeof window.modalModule.openModal === 'function' && window.modalModule.modalEditName) {
        btnEditName.addEventListener('click', () => {
            if (window.authModule && !window.authModule.exigirLoginAcao()) return;
            window.modalModule.openModal(window.modalModule.modalEditName);
        });
    } else {
        console.warn("Botão 'Editar Nome' ou dependências do modal não encontrados para setup.");
    }

    // Submeter Formulário de Edição de Nome
    if (formEditName && newNameInput) {
        formEditName.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = newNameInput.value.trim();
            if (newName) {
                demoUserName = newName;
                localStorage.setItem('demo_user_name', demoUserName);
                populateProfileInfo();
                alert("Nome atualizado com sucesso (demonstrativo)!");
                if (window.modalModule && typeof window.modalModule.closeModal === 'function' && window.modalModule.modalEditName) {
                    window.modalModule.closeModal(window.modalModule.modalEditName);
                }
            } else {
                alert("O nome não pode estar vazio.");
            }
        });
    }

    // Abrir Modal de Mudança de Senha
    console.log("perfil.js: btnChangePassword encontrado?", btnChangePassword);
    console.log("perfil.js: window.modalModule.modalChangePassword encontrado?", window.modalModule?.modalChangePassword);
    if (btnChangePassword && window.modalModule && typeof window.modalModule.openModal === 'function' && window.modalModule.modalChangePassword) {
        btnChangePassword.addEventListener('click', () => {
            if (window.authModule && !window.authModule.exigirLoginAcao()) return;
            if (formChangePassword) formChangePassword.reset();
            window.modalModule.openModal(window.modalModule.modalChangePassword);
        });
    } else {
        console.warn("Botão 'Mudar Senha' ou dependências do modal não encontrados para setup.");
    }

    // Submeter Formulário de Mudança de Senha
    if (formChangePassword && currentPasswordInput && newPasswordInput && confirmNewPasswordInput) {
        formChangePassword.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (currentPassword !== "123456") {
                alert("Senha atual incorreta (demonstrativo). Use '123456'.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert("A nova senha e a confirmação não coincidem.");
                return;
            }

            if (newPassword.length < 6) {
                alert("A nova senha deve ter pelo menos 6 caracteres.");
                return;
            }

            alert("Senha alterada com sucesso (demonstrativo)!");
            if (window.modalModule && typeof window.modalModule.closeModal === 'function' && window.modalModule.modalChangePassword) {
                window.modalModule.closeModal(window.modalModule.modalChangePassword);
            }
        });
    }

    // Botão de Sair (Logout)
    if (btnLogout && window.authModule && typeof window.authModule.logout === 'function') {
        btnLogout.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja sair?")) {
                window.authModule.logout(); // Usar a função de logout do authModule
                alert("Você foi desconectado.");
                window.location.href = "/pages/login.html";
            }
        });
    } else {
        console.warn("Botão 'Sair' ou função de logout do authModule não encontrados para setup.");
    }
}

/**
 * Função de inicialização do módulo de perfil.
 * Chamada quando o DOM estiver pronto.
 */
function initPerfilModule() {
    initPerfilElements();
    populateProfileInfo();
    setupPerfilEvents();
}

// Expor a função de inicialização
window.perfilModule = {
    init: initPerfilModule
};