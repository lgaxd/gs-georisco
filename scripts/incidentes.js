// incidentes.js

// Elementos DOM para incidentes
let incidentesContainer;
let bairrosDatalist;
let filterBairroSelect;
let searchInput;

// Mapeamento de cargos para exibição.
const cargos = {
    cidadao: "Cidadão",
    moderador: "MODERADOR", // Alterado para CAPS
    autoridade: "AUTORIDADE" // Alterado para CAPS
};
/**
 * Inicializa os elementos DOM e variáveis globais para o módulo de incidentes.
 */
function initIncidentesElements() {
    incidentesContainer = document.getElementById('incidentes-container');
    bairrosDatalist = document.getElementById('bairros-list');
    filterBairroSelect = document.getElementById('filter-bairro');
    searchInput = document.getElementById('search-bairro');
}

/**
 * Associa event listeners aos botões de comentário nos cards de incidente.
 */
function associarEventosComentarios() {
    incidentesContainer.querySelectorAll('.btn-comentar').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = Number(btn.dataset.idx);
            // Chama a função do módulo modal para abrir o post-modal
            if (window.modalModule && window.modalModule.openPostModal) {
                window.modalModule.openPostModal(idx);
            }
        });
    });

    // Associa cada miniatura ao lightbox de imagem
    incidentesContainer.querySelectorAll('.grid-img').forEach(imgEl => {
        imgEl.addEventListener('click', e => {
            const src = e.currentTarget.getAttribute('data-src');
            if (window.modalModule && window.modalModule.openImageModal) {
                window.modalModule.openImageModal(src);
            }
        });
    });
}

/**
 * Renderiza os incidentes na página, aplicando um filtro de texto opcional.
 * @param {string} filtroTexto O texto para filtrar por bairro (opcional).
 */
function renderIncidentes(filtroTexto = '') {
    if (!incidentesContainer) {
        console.error("Elemento 'incidentes-container' não encontrado. Certifique-se de que initIncidentesElements foi chamado.");
        return;
    }

    incidentesContainer.innerHTML = '';
    const todos = window.utilsModule ? window.utilsModule.getIncidentes() : [];
    const texto = filtroTexto.trim().toLowerCase();
    const perfilUsuario = window.authModule ? window.authModule.obterPerfil() : 'cidadao';

    const incidentesFiltrados = todos.filter(inc => {
        if (!texto) return true;
        return inc.bairro.toLowerCase().startsWith(texto);
    });

    if (incidentesFiltrados.length === 0 && texto) {
        incidentesContainer.innerHTML = `<p class="no-results">Nenhum incidente encontrado para "${filtroTexto}".</p>`;
        return;
    } else if (incidentesFiltrados.length === 0) {
        incidentesContainer.innerHTML = `<p class="no-results">Não há incidentes cadastrados.</p>`;
        return;
    }

    incidentesFiltrados.forEach((inc, i) => {
        const qtd = (inc.imagens || []).length;
        let classeGrid = 'one';
        if (qtd === 2) classeGrid = 'two';
        else if (qtd === 3) classeGrid = 'three';
        else if (qtd >= 4) classeGrid = 'four';

        let imagensHTML = '';
        if (qtd > 0) {
            imagensHTML = `<div class="imagens-grid ${classeGrid}">`
                + inc.imagens.map(
                    url => `<img src="${url}" alt="Incidente" data-src="${url}" class="grid-img" />`
                ).join('')
                + `</div>`;
        }

        // --- ALTERAÇÃO AQUI: BOTÃO DE RESPOSTA ---
        let btnResponderHTML = '';
        if (perfilUsuario === 'moderador' || perfilUsuario === 'autoridade') {
            btnResponderHTML = `
                <button class="btn-resposta btn-action" data-idx="${i}" title="Adicionar Resposta">
                    Adicionar Resposta
                </button>`;
        }
        // --- FIM DA ALTERAÇÃO ---

        // --- SEÇÃO PARA RENDERIZAR RESPOSTAS ---
        let respostasHTML = '';
        if (inc.respostas && inc.respostas.length > 0) {
            respostasHTML = `
                <div class="respostas-section">
                    <h4>Respostas:</h4>
                    ${inc.respostas.map(resp => `
                        <div class="resposta-item">
                            <p class="resposta-texto">${resp.texto}</p>
                            <span class="resposta-autor">(${cargos[resp.perfil.toLowerCase()] || 'Cidadão'})</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        // --- FIM DA SEÇÃO ---


        const card = document.createElement('div');
        card.className = 'card-incidente';
        card.innerHTML = `
            <h3>${inc.titulo}</h3>
            <p><strong>Cidade:</strong> ${inc.cidade}</p>
            <p><strong>Bairro:</strong> ${inc.bairro}</p>
            <p>${inc.descricao}</p>
            ${imagensHTML}
            <div class="info-linha">
                <small>${inc.data}</small>
                <span class="comentario-count">${inc.comentarios.length} comentário(s)</span>
                </div>
            <div class="card-actions">
                <button class="btn-comentar" data-idx="${i}" title="Ver comentários">
                    <img src="/images/comentario.png" alt="Comentários" class="icon-comentario" />
                </button>
                ${btnResponderHTML}
            </div>
            ${respostasHTML} `;
        incidentesContainer.appendChild(card);
    });

    // Reassocia eventos após a renderização
    associarEventosComentarios(); // This function already handles general comment buttons
    // Associa eventos para o novo botão de responder
    incidentesContainer.querySelectorAll('.btn-resposta').forEach(btn => { // Changed selector to .btn-resposta
        btn.addEventListener('click', e => {
            const idx = Number(btn.dataset.idx);
            if (window.modalModule && window.modalModule.openRespostaModal) {
                window.modalModule.openRespostaModal(idx);
            }
        });
    });
}

/**
 * Preenche o datalist para o autocomplete da busca de bairros.
 */
function populateAutocomplete() {
    if (!bairrosDatalist || !window.utilsModule) return;
    const bairros = [...new Set(window.utilsModule.getIncidentes().map(i => i.bairro))];
    bairrosDatalist.innerHTML = bairros.map(b => `<option value="${b}">`).join('');
}

/**
 * Preenche o select do filtro de bairros.
 */
function populateFilterBairros() {
    if (!filterBairroSelect || !window.utilsModule) return;
    const bairros = [...new Set(window.utilsModule.getIncidentes().map(i => i.bairro))];
    filterBairroSelect.innerHTML = '<option value="" disabled selected>Selecione o bairro</option>'
        + bairros.map(b => `<option>${b}</option>`).join('');
}

/**
 * Inicializa o módulo de incidentes, incluindo elementos e event listeners principais.
 */
function init() {
    initIncidentesElements();
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const val = searchInput.value.trim();
            renderIncidentes(val);
        });
    }
}

// Expor funções
window.incidentesModule = {
    init,
    renderIncidentes,
    populateAutocomplete,
    populateFilterBairros,
    associarEventosComentarios // Exposto para ser chamado por outros módulos, se necessário
};