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

    // *** ADIÇÃO CRÍTICA AQUI: Inicializar as referências dos modais de perfil ***
    modalEditName = document.getElementById("modal-edit-name");
    modalChangePassword = document.getElementById("modal-change-password");
    // *** FIM DA ADIÇÃO CRÍTICA ***
}

/**
 * Abre um modal.
 * @param {HTMLElement} modalElement O elemento DOM do modal.
 */
function openModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

/**
 * Fecha um modal.
 * @param {HTMLElement} modalElement O elemento DOM do modal.
 */
function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

/**
 * Configura event listeners para fechar modais ao clicar no botão "x" ou fora.
 */
function setupModalCloseEvents() {
    const modals = [
        { modal: modal, closeBtn: modalClose },
        { modal: imgModal, closeBtn: imgModalClose },
        { modal: postModal, closeBtn: postModalClose },
        { modal: filterModal, closeBtn: filterClose },
        { modal: respostaModal, closeBtn: respostaModalClose },
        // *** ADIÇÃO CRÍTICA AQUI: Adicionar os modais de perfil para fechamento ***
        { modal: modalEditName, closeBtn: document.getElementById('modal-edit-name-close') },
        { modal: modalChangePassword, closeBtn: document.getElementById('modal-change-password-close') }
        // *** FIM DA ADIÇÃO CRÍTICA ***
    ];

    modals.forEach(({ modal, closeBtn }) => {
        if (modal) {
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(modal));
            }
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
}

/**
 * Configura o fechamento de modais ao pressionar a tecla ESC.
 */
function setupEscClose() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            closeModal(imgModal);
            closeModal(postModal);
            closeModal(filterModal);
            closeModal(respostaModal);
            // *** ADIÇÃO CRÍTICA AQUI: Fechar modais de perfil com ESC ***
            closeModal(modalEditName);
            closeModal(modalChangePassword);
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

// EXPOR FUNÇÕES E TAMBÉM OS ELEMENTOS DE MODAL SE NECESSÁRIO PARA OUTROS SCRIPTS
window.modalModule = {
    init: initModalElements,
    setupModalCloseEvents,
    setupEscClose,
    setupIncidenteModal,
    setupImgModal,
    openImageModal,
    setupPostModal,
    openPostModal,
    setupFilterModal,
    setupMobileButton,
    setupRespostaModal,
    openRespostaModal,
    openModal,
    closeModal,
    // *** ADIÇÃO CRÍTICA AQUI: Expor os elementos de modal para perfil.js ***
    modalEditName, // Exponha a referência do elemento
    modalChangePassword // Exponha a referência do elemento
    // *** FIM DAS ADIÇÕES CRÍTICAS ***
};