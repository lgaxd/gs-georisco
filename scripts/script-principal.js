document.addEventListener('DOMContentLoaded', () => {
    // ----- 1. Captura de elementos -----

    const container = document.getElementById('incidentes-container');

    const searchInput = document.getElementById('search-bairro');
    const datalist = document.getElementById('bairros-list');

    const btnOpenFilter = document.getElementById('btn-open-filter');
    const filterModal = document.getElementById('filter-modal');
    const filterClose = document.getElementById('filter-close');
    const filterForm = document.getElementById('filter-form');
    const selectBairro = document.getElementById('filter-bairro');
    const btnClearFilter = document.getElementById('btn-clear-filter');

    const btnFazer = document.getElementById('btn-fazer');
    const btnMinhas = document.getElementById('btn-minhas');

    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const formModal = document.getElementById('form-incidente-modal');

    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');

    const imgModal = document.getElementById('img-modal');
    const imgModalClose = document.getElementById('img-modal-close');
    const imgModalContent = document.getElementById('img-modal-content');

    // Elementos do post-modal (visualizar + comentar)
    const postModal = document.getElementById('post-modal');
    const postModalClose = document.getElementById('post-modal-close');
    const postDetails = document.getElementById('post-details');
    const postComments = document.getElementById('post-comments');
    const postCommentForm = document.getElementById('post-comment-form');
    const postCommentInput = document.getElementById('post-comment-input');

    // ----- 2. Sidebar -----
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const btnMenu = document.querySelector('.btn-menu');
    const btnClose = document.querySelector('.btn-close-sidebar');

    if (btnMenu && sidebar && overlay) {
        btnMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('visible');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });

        if (btnClose) {
            btnClose.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
            });
        }
    }

    // ----- 2. Profile dropdown funcional em todas as páginas -----
    const btnProfile = document.querySelector('.btn-profile');
    const profileDrop = document.querySelector('.dropdown');

    if (btnProfile && profileDrop) {
        btnProfile.addEventListener('click', e => {
            e.stopPropagation();
            profileDrop.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            profileDrop.classList.remove('show');
        });
    }

    // ----- 4. LocalStorage & dados iniciais -----
    function initStorage() {
        const dadosBrutos = localStorage.getItem('incidentes');

        if (!dadosBrutos) {
            carregarExemplos(); // nada salvo ainda
        } else {
            try {
                const dados = JSON.parse(dadosBrutos);

                const dadosAntigos = dados.some(inc => inc.fotoURL || !Array.isArray(inc.imagens));

                if (dadosAntigos) {
                    console.warn('Dados antigos detectados. Substituindo pelos exemplos atualizados.');
                    localStorage.removeItem('incidentes');
                    carregarExemplos();
                }
            } catch (e) {
                console.error('Erro ao ler dados do localStorage:', e);
                localStorage.removeItem('incidentes');
                carregarExemplos();
            }
        }
    }

    function carregarExemplos() {
        const exemplos = [
            {
                titulo: 'Árvore na Rua Gomes de Carvalho',
                descricao: 'Uma grande árvore está com o tronco rachado.',
                imagens: ['images/arvore.jpg'],
                cidade: 'São Paulo',
                bairro: 'Moema',
                data: new Date().toLocaleString('pt-BR'),
                comentarios: []
            },
            {
                titulo: 'Buraco gigante na Rua Tabatinguera',
                descricao: 'Asfalto cedeu após chuva forte.',
                imagens: ['images/buraco.jpg'],
                cidade: 'São Paulo',
                bairro: 'Sé',
                data: new Date().toLocaleString('pt-BR'),
                comentarios: []
            },
            {
                titulo: 'Deslizamento de terra na Rua Girassol',
                descricao: 'Barro escorreu sobre a via.',
                imagens: ['images/deslizamento.png'],
                cidade: 'São Paulo',
                bairro: 'Vila Madalena',
                data: new Date().toLocaleString('pt-BR'),
                comentarios: []
            },
            {
                titulo: 'Poste torto na Rua Iguatemi',
                descricao: 'Poste de luz inclinado após vento forte.',
                imagens: ['images/poste.jpg'],
                cidade: 'São Paulo',
                bairro: 'Itaim Bibi',
                data: new Date().toLocaleString('pt-BR'),
                comentarios: []
            }
        ];

        localStorage.setItem('incidentes', JSON.stringify(exemplos));
    }

    function getIncidentes() {
        return JSON.parse(localStorage.getItem('incidentes')) || [];
    }

    function adicionarIncidente(titulo, descricao, imagensArray, cidade, bairro) {
        const arr = getIncidentes();
        arr.push({
            titulo,
            descricao,
            imagens: imagensArray,
            cidade,
            bairro,
            data: new Date().toLocaleString('pt-BR'),
            comentarios: []
        });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
        populateAutocomplete();       // atualiza autocomplete se bairro novo
        populateFilterBairros();      // atualiza opções do filtro
    }

    function adicionarComentario(idx, texto) {
        const arr = getIncidentes();
        arr[idx].comentarios.push({ texto, data: new Date().toLocaleString('pt-BR') });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
    }

    function associarEventosComentarios() {
        container.querySelectorAll('.btn-comentar').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = Number(btn.dataset.idx);
                abrirPostModal(idx);
            });
        });
    }

    // ----- 5. Renderização e filtro -----
    function renderIncidentes(filtroTexto = '') {
        container.innerHTML = '';
        const todos = getIncidentes();
        const texto = filtroTexto.trim().toLowerCase();

        todos
            .filter(inc => {
                if (!texto) return true;
                return inc.bairro.toLowerCase().startsWith(texto);
            })
            .forEach((inc, i) => {
                // Quantas imagens este incidente tem?
                const qtd = (inc.imagens || []).length;
                let classeGrid = 'one';
                if (qtd === 1) classeGrid = 'one';
                else if (qtd === 2) classeGrid = 'two';
                else if (qtd === 3) classeGrid = 'three';
                else if (qtd >= 4) classeGrid = 'four';

                // Monta HTML das imagens em grade
                let imagensHTML = '';
                if (qtd > 0) {
                    imagensHTML = `<div class="imagens-grid ${classeGrid}">`
                        + inc.imagens.map(
                            url => `<img src="${url}" alt="Incidente" data-src="${url}" class="grid-img" />`
                        ).join('')
                        + `</div>`;
                }

                // Monta o card completo, **sem** o formulário inline
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
<button class="btn-comentar" data-idx="${i}" title="Ver comentários">
  <img src="images/comentario.png" alt="Comentários" class="icon-comentario" />
</button>`;
                container.appendChild(card);
            });

        // Associa os botões de comentário de cada card ao post-modal
        container.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = Number(btn.dataset.idx);
                abrirPostModal(idx);
            });
        });

        // Associa os formulários de comentário inline (só existirá dentro do post-modal)
        // (Esse listener será definido ao abrir o post-modal, não aqui)

        // Associa cada miniatura ao lightbox de imagem
        // Associa os botões de comentário ao post-modal
        associarEventosComentarios();

        // Associa miniaturas ao lightbox de imagem
        container.querySelectorAll('.grid-img').forEach(imgEl => {
            imgEl.addEventListener('click', e => {
                const src = e.currentTarget.getAttribute('data-src');
                imgModalContent.src = src;
                imgModal.style.display = 'flex';
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const val = searchInput.value.trim();
            renderIncidentes(val); // chama a função com o valor digitado
        });
    }

    // ----- 6. Autocomplete -----
    function populateAutocomplete() {
        const bairros = [...new Set(getIncidentes().map(i => i.bairro))];
        datalist.innerHTML = bairros.map(b => `<option value="${b}">`).join('');
    }

    // ----- 7. Modal de filtro -----
    function populateFilterBairros() {
        const bairros = [...new Set(getIncidentes().map(i => i.bairro))];
        selectBairro.innerHTML = '<option value="" disabled selected>Selecione o bairro</option>'
            + bairros.map(b => `<option>${b}</option>`).join('');
    }

    // ----- 8. Modal de registro de incidente -----
    if (btnFazer && modal && modalClose && formModal && fileInput) {
        btnFazer.addEventListener('click', () => {
            formModal.reset();
            previewContainer.innerHTML = '';
            modal.style.display = 'flex';
        });

        modalClose.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
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
                adicionarIncidente(titulo, descricao, [], cidade, bairro);
                formModal.reset();
                previewContainer.innerHTML = '';
                modal.style.display = 'none';
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
                        adicionarIncidente(titulo, descricao, imagensArray, cidade, bairro);
                        formModal.reset();
                        previewContainer.innerHTML = '';
                        modal.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }

    // ----- 9. Botão flutuante “+” (sempre visível) -----
    const btnAddMobile = document.getElementById('btn-add-mobile');
    btnAddMobile.addEventListener('click', () => {
        formModal.reset();
        previewContainer.innerHTML = '';
        modal.style.display = 'flex';
    });

    // ----- 10. Lightbox (img-modal) -----
    if (imgModal && imgModalClose) {
        imgModalClose.addEventListener('click', () => {
            imgModal.style.display = 'none';
        });
        imgModal.addEventListener('click', e => {
            if (e.target === imgModal) {
                imgModal.style.display = 'none';
            }
        });
    }

    // ----- 11. Filtro avançado -----
    btnOpenFilter.addEventListener('click', () => filterModal.style.display = 'flex');
    filterClose.addEventListener('click', () => filterModal.style.display = 'none');
    filterModal.addEventListener('click', e => {
        if (e.target === filterModal) filterModal.style.display = 'none';
    });

    populateFilterBairros();

    filterForm.addEventListener('submit', e => {
        e.preventDefault();
        const bairro = filterForm['filter-bairro'].value;
        renderIncidentes(bairro);
        filterModal.style.display = 'none';
        searchInput.value = bairro;
    });

    btnClearFilter.addEventListener('click', () => {
        filterForm.reset();
        renderIncidentes();
        filterModal.style.display = 'none';
        searchInput.value = '';
    });

    // ----- 12. Modal de POST + comentários (post-modal) -----
    function abrirPostModal(idx) {
        const inc = getIncidentes()[idx];
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
            if (qtd === 1) classeGrid = 'one';
            else if (qtd === 2) classeGrid = 'two';
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
        postComments.innerHTML = '';
        inc.comentarios.forEach(c => {
            const divC = document.createElement('div');
            divC.className = 'post-comment-item';
            divC.innerHTML = `${c.texto}<br><small>${c.data}</small>`;
            postComments.appendChild(divC);
        });

        // Adicionar listener de clique nas miniaturas dentro do post-modal:
        postComments.querySelectorAll('.grid-img').forEach(elem => {
            elem.addEventListener('click', evt => {
                const src = evt.currentTarget.getAttribute('data-src');
                imgModalContent.src = src;
                imgModal.style.display = 'flex';
            });
        });

        // Ao enviar novo comentário (dentro do post-modal):
        postCommentForm.onsubmit = e => {
            e.preventDefault();
            const texto = postCommentInput.value.trim();
            if (!texto) return;
            adicionarComentario(idx, texto);
            postCommentInput.value = '';
            // Reabrir o modal e recarregar todos os comentários:
            abrirPostModal(idx);
        };

        postModal.style.display = 'flex';
    }

    if (postModal && postModalClose) {
        postModalClose.addEventListener('click', () => {
            postModal.style.display = 'none';
        });
        postModal.addEventListener('click', e => {
            if (e.target === postModal) {
                postModal.style.display = 'none';
            }
        });
    }

    // ----- 13. Inicialização -----
    initStorage();
    renderIncidentes();
    populateAutocomplete();
    populateFilterBairros();
});
