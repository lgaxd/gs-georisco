document.addEventListener('DOMContentLoaded', () => {
    // É crucial que o authModule seja inicializado primeiro, pois outros módulos dependem dele.
    // Embora o auth.js já se exponha globalmente, é bom ter certeza que está acessível.
    // Nenhuma inicialização explícita é necessária para auth.js, apenas a inclusão no HTML.

    // Inicializar módulos de utilidades
    if (window.utilsModule) {
        window.utilsModule.initStorage();
    }

    // Inicializar módulos de elementos DOM e eventos
    if (window.sidebarModule) {
        window.sidebarModule.init();
        window.sidebarModule.setupSidebar();
        window.sidebarModule.setupProfileDropdown();
    }

    if (window.incidentesModule) {
        window.incidentesModule.init(); // Inicializa elementos DOM e listener de busca
    }

    // O módulo resposta.js já se expõe globalmente, não precisa de init().

    if (window.modalModule) {
        window.modalModule.init(); // Inicializa elementos DOM de modais
        window.modalModule.setupModalCloseEvents();
        window.modalModule.setupEscClose();
        window.modalModule.setupIncidenteModal();
        window.modalModule.setupImgModal();
        window.modalModule.setupPostModal();
        window.modalModule.setupFilterModal();
        window.modalModule.setupMobileButton();
        window.modalModule.setupRespostaModal(); // Configura o formulário de resposta
    }

    // Renderização inicial e população de dados após todos os módulos estarem prontos
    // Um pequeno timeout para garantir que todos os elementos estejam no DOM e módulos inicializados
    setTimeout(() => {
        if (window.incidentesModule) {
            window.incidentesModule.populateAutocomplete();
            window.incidentesModule.populateFilterBairros();
            window.incidentesModule.renderIncidentes();
        }
    }, 100);
});