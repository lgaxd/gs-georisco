// modal.js

// Variáveis globais para elementos de modais
let modal; // Modal de formulário de incidente
let modalClose;
let formModal;
let fileInput;
let previewContainer;

let imgModal;
let imgModalContent;
let imgModalClose;

let postModal;
let postModalClose;
let postDetails;
let postComments;
let postCommentForm;
let postCommentInput;

let respostaModal;
let respostaModalClose;
let respostaForm;
let respostaTexto;

let filterModal;
let filterClose;
let filterForm;
let selectBairro;

let btnAddMobile;
let btnFazer;

// *** ADIÇÃO CRÍTICA AQUI: Declarar as variáveis dos modais de perfil ***
let modalEditName;
let modalChangePassword;
// *** FIM DA ADIÇÃO CRÍTICA ***


/**
 * Inicializa as referências aos elementos DOM de todos os modais.
 */
function initModalElements() {
    // Modal de incidente (formulário)
    modal = document.getElementById('modal');
    modalClose = document.getElementById('modal-close');
    formModal = document.getElementById('form-incidente-modal');
    fileInput = document.getElementById('file-input');
    previewContainer = document.getElementById('preview-container');

    // Modal de imagem
    imgModal = document.getElementById('img-modal');
    imgModalClose = document.getElementById('img-modal-close');
    imgModalContent = document.getElementById('img-modal-content');

    // Modal de post (comentários)
    postModal = document.getElementById('post-modal');
    postModalClose = document.getElementById('post-modal-close');
    postDetails = document.getElementById('post-details');
    postComments = document.getElementById('post-comments');
    postCommentForm = document.getElementById('post-comment-form');
    postCommentInput = document.getElementById('post-comment-input');

    // Modal de resposta (se existir no HTML)
    respostaModal = document.getElementById('modal-resposta');
    respostaModalClose = document.getElementById('modal-resposta-close');
    respostaForm = document.getElementById('form-resposta-modal');
    respostaTexto = document.getElementById('resposta-texto');


    // Modal de filtro
    filterModal = document.getElementById('filter-modal');
    filterClose = document.getElementById('filter-close');
    filterForm = document.getElementById('filter-form');
    selectBairro = document.getElementById('filter-bairro');

    // Botões
    btnAddMobile = document.getElementById('btn-add-mobile');
    btnFazer = document.getElementById('btn-fazer');

    // *** INICIALIZAÇÃO CRÍTICA: Referenciar os modais de perfil ***
    modalEditName = document.getElementById("modal-edit-name");
    modalChangePassword = document.getElementById("modal-change-password");

    console.log("modal.js: modalEditName após initModalElements:", modalEditName);
    console.log("modal.js: modalChangePassword após initModalElements:", modalChangePassword);
    // *** FIM DA INICIALIZAÇÃO CRÍTICA ***
}

/**
 * Função para abrir um modal.
 * @param {HTMLElement} modalElement O elemento DOM do modal a ser aberto.
 */
function openModal(modalElement) {
    if (modalElement) { // Verifique se o elemento não é null
        modalElement.style.display = 'flex'; // ou 'block', dependendo do seu CSS
        // Adiciona a classe 'modal-open' ao body para desabilitar o scroll
        document.body.classList.add('modal-open');
    } else {
        console.error("openModal: Elemento modal é null ou indefinido.");
    }
}
/**
 * Função para fechar um modal.
 * @param {HTMLElement} modalElement O elemento DOM do modal a ser fechado.
 */
function closeModal(modalElement) {
    if (modalElement) { // Verifique se o elemento não é null
        modalElement.style.display = 'none';
        // Remove a classe 'modal-open' do body
        document.body.classList.remove('modal-open');
    } else {
        console.error("closeModal: Elemento modal é null ou indefinido.");
    }
}

/**
 * Configura event listeners para fechar modais ao clicar no botão "x" ou fora.
 */
function setupModalCloseEvents() {
    // Array de botões de fechar e seus respectivos modais
    const closeButtons = [
        { btn: modalClose, modal: modal },
        { btn: imgModalClose, modal: imgModal },
        { btn: postModalClose, modal: postModal },
        { btn: respostaModalClose, modal: respostaModal },
        { btn: filterClose, modal: filterModal },
        // Botões de fechar dos modais de perfil
        { btn: document.getElementById("modal-edit-name-close"), modal: modalEditName },
        { btn: document.getElementById("modal-change-password-close"), modal: modalChangePassword }
    ];

    closeButtons.forEach(({ btn, modal }) => {
        if (btn && modal) { // Garante que o botão e o modal existem
            btn.addEventListener("click", (event) => {
                event.stopPropagation(); // Impede que o clique no botão de fechar acione o "clicar fora"
                closeModal(modal);
            });
        } else {
            console.warn(`setupModalCloseEvents: Botão ou modal não encontrado para ${btn?.id || (modal?.id ? `modal ${modal.id}` : 'ID desconhecido')}.`);
        }
    });

    // --- Lógica para fechar modal clicando fora ---
    // Crie um array com todos os elementos de modal que você quer fechar clicando fora
    const allModals = [
        modal, imgModal, postModal, respostaModal, filterModal,
        modalEditName, modalChangePassword
    ];

    allModals.forEach(currentModal => {
        if (currentModal) { // Garante que o elemento do modal existe
            currentModal.addEventListener('click', (event) => {
                // Se o clique ocorreu diretamente no elemento do modal (o "overlay" do modal)
                // e não em um de seus filhos (o conteúdo interno do modal), feche-o.
                if (event.target === currentModal) {
                    closeModal(currentModal);
                }
            });
        }
    });
    // --- FIM da lógica de fechar clicando fora ---
}

/**
 * Configura o fechamento de modais ao pressionar a tecla ESC.
 */
function setupEscClose() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Fecha o modal atualmente visível (você pode precisar de uma lógica mais sofisticada
            // se tiver múltiplos modais abertos e quiser fechar apenas o último/topo).
            // Por simplicidade, vamos tentar fechar os modais conhecidos se estiverem abertos.
            if (modal?.style.display === 'flex') closeModal(modal);
            if (imgModal?.style.display === 'flex') closeModal(imgModal);
            if (postModal?.style.display === 'flex') closeModal(postModal);
            if (respostaModal?.style.display === 'flex') closeModal(respostaModal);
            if (filterModal?.style.display === 'flex') closeModal(filterModal);
            // *** ADIÇÃO CRÍTICA: Fechar modais de perfil com ESC ***
            if (modalEditName?.style.display === 'flex') closeModal(modalEditName);
            if (modalChangePassword?.style.display === 'flex') closeModal(modalChangePassword);
            // *** FIM DA ADIÇÃO CRÍTICA ***
        }
    });
}

/**
 * Configura o modal de registro de incidente (formulário).
 */
function setupIncidenteModal() {
    if (btnFazer && modal && formModal && fileInput) {
        btnFazer.addEventListener('click', () => {
            // Verifica se o módulo de autenticação existe e se o usuário está logado
            if (window.authModule && !window.authModule.exigirLoginAcao()) {
                return; // Impede a abertura do modal se não estiver logado
            }
            formModal.reset();
            previewContainer.innerHTML = '';
            openModal(modal);
        });

        // Pré-visualização de cada imagem selecionada
        fileInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';
            const files = Array.from(fileInput.files).slice(0, 4);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => {
                    const img = document.createElement('img');
                    img.src = ev.target.result;
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });

        // Ao submeter o formulário, converte as imagens e cadastra o incidente
        formModal.addEventListener('submit', e => {
            e.preventDefault();
            const titulo = formModal.titulo.value.trim();
            const descricao = formModal.descricao.value.trim();
            const bairro = formModal.bairro.value;
            const cidade = 'São Paulo';

            const files = Array.from(fileInput.files).slice(0, 4);

            if (files.length === 0) {
                if (window.utilsModule) {
                    window.utilsModule.adicionarIncidente(titulo, descricao, [], cidade, bairro);
                }
                if (window.incidentesModule) {
                    window.incidentesModule.renderIncidentes();
                    window.incidentesModule.populateAutocomplete();
                    window.incidentesModule.populateFilterBairros();
                }
                formModal.reset();
                previewContainer.innerHTML = '';
                closeModal(modal);
                return;
            }

            let imagensArray = [];
            let carregados = 0;
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => {
                    imagensArray.push(ev.target.result);
                    carregados++;
                    if (carregados === files.length) {
                        if (window.utilsModule) {
                            window.utilsModule.adicionarIncidente(titulo, descricao, imagensArray, cidade, bairro);
                        }
                        if (window.incidentesModule) {
                            window.incidentesModule.renderIncidentes();
                            window.incidentesModule.populateAutocomplete();
                            window.incidentesModule.populateFilterBairros();
                        }
                        formModal.reset();
                        previewContainer.innerHTML = '';
                        closeModal(modal);
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

/**
 * Configura o modal de imagem (lightbox).
 */
function setupImgModal() {
    // A lógica de abertura é feita em incidentes.js (openImageModal)
    // O fechamento já é tratado em setupModalCloseEvents
}

/**
 * Abre o modal de imagem com a URL fornecida.
 * @param {string} src A URL da imagem a ser exibida.
 */
function openImageModal(src) {
    if (imgModalContent && imgModal) {
        imgModalContent.src = src;
        openModal(imgModal);
    }
}

/**
 * Configura o modal de post (detalhes e comentários).
 */
function setupPostModal() {
    // A lógica de abertura é feita em openPostModal
    // O fechamento já é tratado em setupModalCloseEvents
}

/**
 * Abre o modal de post com os detalhes e comentários de um incidente.
 * @param {number} idx O índice do incidente a ser exibido.
 */
function openPostModal(idx) {
    if (!postModal || !postDetails || !postComments || !window.utilsModule) {
        console.error("Elementos do post-modal ou utilsModule não encontrados.");
        return;
    }

    const inc = window.utilsModule.getIncidentes()[idx];
    if (!inc) {
        console.error(`Incidente com índice ${idx} não encontrado.`);
        return;
    }

    // Montar detalhes do post:
    let detalhesHTML = `
        <h3>${inc.titulo}</h3>
        <p><strong>Cidade:</strong> ${inc.cidade} &nbsp; <strong>Bairro:</strong> ${inc.bairro}</p>
        <p>${inc.descricao}</p>
        <small>${inc.data}</small>
    `;
    // Se tiver imagens, replicar grade (usamos classe “one/two/three/four”):
    const qtd = (inc.imagens || []).length;
    if (qtd > 0) {
        let classeGrid = 'one';
        if (qtd === 2) classeGrid = 'two';
        else if (qtd === 3) classeGrid = 'three';
        else if (qtd >= 4) classeGrid = 'four';
        detalhesHTML += `<div class="imagens-grid ${classeGrid}">`
            + inc.imagens.map(
                url => `<img src="${url}" alt="Incidente" data-src="${url}" class="grid-img" />`
            ).join('')
            + `</div>`;
    }
    postDetails.innerHTML = detalhesHTML;

    // Montar comentários existentes:
    postComments.innerHTML = '<div class="post-comments-section"><h4>Comentários</h4>';
    if (inc.comentarios && inc.comentarios.length > 0) {
        inc.comentarios.forEach(c => {
            const divC = document.createElement('div');
            divC.className = 'post-comment-item';
            divC.innerHTML = `<p>${c.texto}</p><small>${c.data}</small>`;
            postComments.querySelector('.post-comments-section').appendChild(divC);
        });
    } else {
        postComments.querySelector('.post-comments-section').innerHTML += `<p class="no-comments">Nenhum comentário ainda.</p>`;
    }
    postComments.innerHTML += '</div>';

    // Adicionar listener de clique nas miniaturas dentro do post-modal:
    postDetails.querySelectorAll('.grid-img').forEach(elem => {
        elem.addEventListener('click', evt => {
            const src = evt.currentTarget.getAttribute('data-src');
            openImageModal(src);
        });
    });

    // Ao enviar novo comentário (dentro do post-modal):
    if (postCommentForm && postCommentInput) {
        // Remove any existing listener to prevent duplicates
        postCommentForm.onsubmit = e => {
            e.preventDefault();
            // Verifica se o usuário está logado antes de permitir o comentário
            if (window.authModule && !window.authModule.exigirLoginAcao()) {
                return;
            }

            const texto = postCommentInput.value.trim();
            if (!texto) return;

            if (window.utilsModule) {
                window.utilsModule.adicionarComentario(idx, texto);
            }
            postCommentInput.value = '';
            // Reabrir o modal e recarregar todos os comentários e respostas:
            openPostModal(idx);
            // Atualiza a renderização dos incidentes para refletir a contagem de comentários
            if (window.incidentesModule) {
                window.incidentesModule.renderIncidentes();
            }
        };
    }

    openModal(postModal);
}

/**
 * Configura o modal de filtro avançado.
 */
function setupFilterModal() {
    if (filterModal && filterClose && filterForm && selectBairro) {
        const btnOpenFilter = document.getElementById('btn-open-filter');
        const btnClearFilter = document.getElementById('btn-clear-filter');

        if (btnOpenFilter) {
            btnOpenFilter.addEventListener('click', () => openModal(filterModal));
        }

        filterForm.addEventListener('submit', e => {
            e.preventDefault();
            const bairro = filterForm['filter-bairro'].value;
            if (window.incidentesModule) {
                window.incidentesModule.renderIncidentes(bairro);
                // Atualiza o campo de busca principal com o valor do filtro
                const searchInput = document.getElementById('search-bairro');
                if (searchInput) {
                    searchInput.value = bairro;
                }
            }
            closeModal(filterModal);
        });

        if (btnClearFilter) {
            btnClearFilter.addEventListener('click', () => {
                filterForm.reset();
                if (window.incidentesModule) {
                    window.incidentesModule.renderIncidentes();
                    // Limpa o campo de busca principal
                    const searchInput = document.getElementById('search-bairro');
                    if (searchInput) {
                        searchInput.value = '';
                    }
                }
                closeModal(filterModal);
            });
        }
    }
}

/**
 * Configura o botão flutuante de adição de incidente para mobile.
 */
function setupMobileButton() {
    if (btnAddMobile && formModal && previewContainer && modal) {
        btnAddMobile.addEventListener('click', () => {
            // Verifica se o módulo de autenticação existe e se o usuário está logado
            if (window.authModule && !window.authModule.exigirLoginAcao()) {
                return; // Impede a abertura do modal se não estiver logado
            }
            formModal.reset();
            previewContainer.innerHTML = '';
            openModal(modal);
        });
    }
}

/**
 * Configura o modal de resposta para autoridades/moderadores.
 */
function setupRespostaModal() {
    if (respostaForm && respostaModal && respostaTexto) {
        // Assume que `window.respostaModule.indiceAtualParaResposta` será definido antes de abrir o modal
        respostaForm.onsubmit = e => {
            e.preventDefault();
            // Verifica se o usuário está logado e tem permissão antes de adicionar a resposta
            if (window.authModule && !window.authModule.exigirLoginAcao()) {
                return;
            }
            const perfil = window.authModule ? window.authModule.obterPerfil() : 'cidadao';
            if (perfil !== 'moderador' && perfil !== 'autoridade') {
                alert("Você não tem permissão para adicionar respostas.");
                return;
            }

            const texto = respostaTexto.value.trim();
            if (!texto) return;

            if (window.utilsModule && window.respostaModule && window.respostaModule.indiceAtualParaResposta !== null) {
                window.utilsModule.adicionarResposta(
                    window.respostaModule.indiceAtualParaResposta,
                    texto,
                    perfil
                );
            }
            closeModal(respostaModal);
            respostaForm.reset();
            window.respostaModule.indiceAtualParaResposta = null; // Reseta o índice
            // Atualiza a renderização dos incidentes para refletir a nova resposta
            if (window.incidentesModule) {
                window.incidentesModule.renderIncidentes();
                // Também atualiza o post-modal se ele estiver aberto para o mesmo incidente
                if (postModal.style.display === 'flex') {
                    openPostModal(window.utilsModule.getIncidentes().findIndex(inc => inc === window.utilsModule.getIncidentes()[window.respostaModule.indiceAtualParaResposta]));
                }
            }
        };
    }
}

/**
 * Abre o modal de resposta para um incidente específico.
 * @param {number} idx Índice do incidente para o qual a resposta será adicionada.
 */
function openRespostaModal(idx) {
    if (window.authModule && !window.authModule.exigirLoginAcao()) {
        return;
    }
    const perfil = window.authModule.obterPerfil();
    if (perfil !== 'moderador' && perfil !== 'autoridade') {
        alert("Apenas moderadores e autoridades podem adicionar respostas.");
        return;
    }

    if (respostaModal && window.respostaModule) {
        window.respostaModule.indiceAtualParaResposta = idx;
        openModal(respostaModal);
        respostaTexto.value = ''; // Limpa o campo de texto
    }
}

// EXPOR FUNÇÕES E TAMBÉM OS ELEMENTOS DE MODAL
window.modalModule = {
    init: initModalElements,
    openModal, // Expor a função openModal
    closeModal, // Expor a função closeModal
    setupModalCloseEvents,
    setupEscClose,
    setupIncidenteModal, // Se você tiver uma função específica para o modal principal
    setupImgModal,
    openImageModal,
    setupPostModal,
    openPostModal,
    setupRespostaModal,
    openRespostaModal,
    setupFilterModal,
    setupMobileButton,
    // *** ADIÇÃO CRÍTICA: Expor os elementos de modal após serem inicializados ***
    get modalEditName() { return modalEditName; }, // Getter para garantir que o valor seja atualizado após init
    get modalChangePassword() { return modalChangePassword; } // Getter para garantir o valor atualizado
    // *** FIM DAS ADIÇÕES CRÍTICAS ***
};