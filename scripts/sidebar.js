// Gerenciamento da sidebar

const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const btnMenu = document.querySelector('.btn-menu');
const btnClose = document.querySelector('.btn-close-sidebar');

function setupSidebar() {
    if (btnMenu && sidebar && overlay) {
        btnMenu.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("visible");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("visible");
        });

        if (btnClose) {
            btnClose.addEventListener("click", () => {
                sidebar.classList.remove("open");
                overlay.classList.remove("visible");
            });
        }
    }
}

// Profile dropdown
const btnProfile = document.querySelector('.btn-profile');
const profileDrop = document.querySelector('.profile-dropdown'); // Corrigido: '.dropdown' para '.profile-dropdown'

function setupProfileDropdown() {
    if (btnProfile && profileDrop) {
        btnProfile.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede que o clique se propague para o document e feche o dropdown imediatamente
            profileDrop.classList.toggle("show");
        });
        // Adicionado listener no document para fechar o dropdown ao clicar fora
        document.addEventListener("click", (e) => {
            // Se o clique não foi no botão do perfil e o dropdown está aberto
            if (!btnProfile.contains(e.target) && profileDrop.classList.contains("show")) {
                profileDrop.classList.remove("show");
            }
        });
    }
}

// EXPOR as funções para serem chamadas pelo script-principal.js
window.setupSidebar = setupSidebar;
window.setupProfileDropdown = setupProfileDropdown;