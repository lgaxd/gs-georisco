document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar módulos base (utils, auth)
    if (window.utilsModule) {
        window.utilsModule.initStorage();
    }
    // window.authModule não precisa de init(), ele já expõe as funções diretamente.

    // 2. Inicializar Sidebar
    if (window.setupSidebar) {
        window.setupSidebar();
    }
    if (window.setupProfileDropdown) {
        window.setupProfileDropdown();
    }

    // 3. Inicializar o modal.js e seus eventos
    if (window.modalModule) {
        window.modalModule.init();
        window.modalModule.setupModalCloseEvents();
        window.modalModule.setupEscClose();

        // Configurações específicas de outros modais
        window.modalModule.setupIncidenteModal();
        window.modalModule.setupImgModal();
        window.modalModule.setupPostModal();
        window.modalModule.setupRespostaModal();
        window.modalModule.setupFilterModal();
        window.modalModule.setupMobileButton();
    }

    // 4. Inicializar o módulo de incidentes (apenas na página principal)
    if (window.incidentesModule) {
        if (!window.location.pathname.includes('perfil.html')) {
            window.incidentesModule.init(); // Se incidentes.js tiver um init()
            window.incidentesModule.populateAutocomplete();
            window.incidentesModule.populateFilterBairros();
            window.incidentesModule.renderIncidentes();
        }
    }

    // 5. Inicializar o módulo de perfil (APENAS se estiver na página de perfil)
    if (window.location.pathname.includes('perfil.html')) {
        // Agora, authModule deve estar disponível por causa da ordem no HTML
        if (window.perfilModule && window.perfilModule.init) {
            window.perfilModule.init();
        } else {
            console.error("Erro: perfilModule ou sua função init não está disponível na página de perfil.");
        }
    }

    // 6. Inicializar módulo de contato/formulário (se aplicável)
    // Verifique se você usa contato.js ou formulario.js e mantenha apenas um.
    // Ajuste o nome da pasta e do módulo conforme o que você manteve.
    if (window.location.pathname.includes('contato.html')) { // OU 'formulario.html'
        if (window.contatoModule && window.contatoModule.init) { // OU window.formularioModule
            window.contatoModule.init(); // OU window.formularioModule.init()
        } else {
            console.warn("Módulo de Contato/Formulário não encontrado para inicialização.");
        }
    }


    // 7. Configurar evento de busca (se aplicável, geralmente na página principal)
    const searchInput = document.getElementById("search-bairro");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            if (window.incidentesModule) {
                window.incidentesModule.renderIncidentes(searchInput.value);
            }
        });
    }

    const btnNotifications = document.getElementById("btn-notifications");
    if (btnNotifications) {
        btnNotifications.addEventListener('click', () => {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (!window.authModule || !window.authModule.estaLogado()) {
                alert("Você precisa estar logado para ver suas notificações.");
                window.location.href = 'login.html';
            } else {
                window.location.href = 'notificacoes.html';
            }
        });
    }

    const btnMinhas = document.getElementById("btn-minhas");
    if (btnMinhas) {
        btnMinhas.addEventListener('click', () => {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (!window.authModule || !window.authModule.estaLogado()) {
                alert("Você precisa estar logado para ver seus registros.");
                window.location.href = 'login.html';
            } else {
                window.location.href = 'registros.html';
            }
        });
    }

    document.querySelectorAll(".btn-ver").forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });

});