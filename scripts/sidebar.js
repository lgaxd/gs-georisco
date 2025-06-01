// Elementos DOM para sidebar e perfil
let sidebar;
let overlay;
let btnMenu;
let btnCloseSidebar;
let btnProfile;
let profileDropdown;

/**
 * Inicializa os elementos DOM relacionados à sidebar e ao perfil.
 */
function initSidebarElements() {
    sidebar = document.querySelector('.sidebar');
    overlay = document.querySelector('.overlay');
    btnMenu = document.querySelector('.btn-menu');
    btnCloseSidebar = document.querySelector('.btn-close-sidebar');
    btnProfile = document.querySelector('.btn-profile');
    profileDropdown = document.querySelector('.profile-dropdown'); // Corrigido para .profile-dropdown
}

/**
 * Configura os event listeners para a sidebar.
 */
function setupSidebar() {
    if (btnMenu && sidebar && overlay) {
        btnMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('visible');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });

        if (btnCloseSidebar) {
            btnCloseSidebar.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
            });
        }
    }
}

/**
 * Configura os event listeners para o dropdown do perfil.
 */
function setupProfileDropdown() {
    if (btnProfile && profileDropdown) {
        btnProfile.addEventListener('click', e => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            profileDropdown.classList.remove('show');
        });
    }
}

// Expor funções
window.sidebarModule = {
    init: initSidebarElements,
    setupSidebar,
    setupProfileDropdown
};