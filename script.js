document.addEventListener('DOMContentLoaded', () => {
    // ----- 1. Captura de elementos -----
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnMenu = document.getElementById('btn-menu');
    const btnClose = document.getElementById('btn-close');

    const btnProfile = document.getElementById('btn-profile');
    const profileDrop = document.getElementById('profile-dropdown');

    const locationBanner = document.querySelector('.location-banner');
    const filtroBairro = document.getElementById('filtro-bairro');

    const formMain = document.getElementById('form-incidente');
    const container = document.getElementById('incidentes-container');

    const btnFazer = document.getElementById('btn-fazer');
    const btnMinhas = document.getElementById('btn-minhas');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const formModal = document.getElementById('form-incidente-modal');

    // ----- 2. Sidebar -----
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
    }
    if (btnMenu && btnClose && overlay) {
        btnMenu.addEventListener('click', toggleSidebar);
        btnClose.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }

    // ----- 3. Profile dropdown -----
    if (btnProfile && profileDrop) {
        btnProfile.addEventListener('click', e => {
            e.stopPropagation();
            profileDrop.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            profileDrop.classList.remove('show');
        });
    }

    // ----- 4. LocalStorage & dados -----
    function initStorage() {
        if (!localStorage.getItem('incidentes')) {
            const exemplos = [
                {
                    titulo: 'Árvore prestes a cair na Rua Gomes de Carvalho',
                    descricao: 'Uma grande árvore está com o tronco rachado.',
                    fotoURL: '/images/arvore.jpg',
                    cidade: 'São Paulo',
                    bairro: 'Moema',
                    data: new Date().toLocaleString(),
                    comentarios: []
                },
                {
                    titulo: 'Buraco gigante na Rua Tabatinguera',
                    descricao: 'Asfalto cedeu após chuva forte.',
                    fotoURL: '/images/buraco.jpg',
                    cidade: 'São Paulo',
                    bairro: 'Sé',
                    data: new Date().toLocaleString(),
                    comentarios: []
                },
                {
                    titulo: 'Deslizamento de terra na Rua Girassol',
                    descricao: 'Barro escorreu sobre a via.',
                    fotoURL: '/images/deslizamento.png',
                    cidade: 'São Paulo',
                    bairro: 'Vila Madalena',
                    data: new Date().toLocaleString(),
                    comentarios: []
                },
                {
                    titulo: 'Poste torto na Rua Iguatemi',
                    descricao: 'Poste de luz inclinado após vento forte.',
                    fotoURL: '/images/poste.jpg',
                    cidade: 'São Paulo',
                    bairro: 'Itaim Bibi',
                    data: new Date().toLocaleString(),
                    comentarios: []
                }
            ];
            localStorage.setItem('incidentes', JSON.stringify(exemplos));
        }
    }

    function getIncidentes() {
        return JSON.parse(localStorage.getItem('incidentes')) || [];
    }

    function adicionarIncidente(titulo, descricao, fotoURL, cidade, bairro) {
        const arr = getIncidentes();
        arr.push({ titulo, descricao, fotoURL, cidade, bairro, data: new Date().toLocaleString(), comentarios: [] });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
    }

    function adicionarComentario(idx, texto) {
        const arr = getIncidentes();
        arr[idx].comentarios.push({ texto, data: new Date().toLocaleString() });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
    }

    // ----- 5. Renderização e filtro -----
    function renderIncidentes() {
        if (!container) return;
        container.innerHTML = '';
        const todos = getIncidentes();
        const bairroSel = filtroBairro ? filtroBairro.value : 'Todos';

        todos
            .filter(inc => bairroSel === 'Todos' || inc.bairro === bairroSel)
            .forEach((inc, i) => {
                const card = document.createElement('div');
                card.className = 'card-incidente';
                card.innerHTML = `
          <h3>${inc.titulo}</h3>
          <p><strong>Cidade:</strong> ${inc.cidade}</p>
          <p><strong>Bairro:</strong> ${inc.bairro}</p>
          <p>${inc.descricao}</p>
          ${inc.fotoURL ? `<img src="${inc.fotoURL}" alt="Incidente">` : ''}
          <small>${inc.data}</small>
          <h4>Comentários</h4>
          <ul>
            ${inc.comentarios.map(c => `<li>${c.texto}<br><small>${c.data}</small></li>`).join('')}
          </ul>
          <form data-idx="${i}" class="comment-form">
            <input name="comentario" placeholder="Comentário" required>
            <button type="submit">Enviar</button>
          </form>
        `;
                container.appendChild(card);
            });

        // associa todos os formulários de comentário
        container.querySelectorAll('.comment-form').forEach(f => {
            f.addEventListener('submit', e => {
                e.preventDefault();
                const idx = Number(f.dataset.idx);
                const txt = f.comentario.value.trim();
                if (txt) {
                    adicionarComentario(idx, txt);
                    f.reset();
                }
            });
        });
    }

    if (filtroBairro) {
        filtroBairro.addEventListener('change', renderIncidentes);
    }

    // ----- 6. Formulário principal -----
    if (formMain) {
        formMain.addEventListener('submit', e => {
            e.preventDefault();
            adicionarIncidente(
                e.target.titulo.value.trim(),
                e.target.descricao.value.trim(),
                e.target.fotoURL.value.trim(),
                'São Paulo',             // cidade fixa
                e.target.bairro.value    // bairro do select
            );
            formMain.reset();
        });
    }

    // ----- 7. Modal de reclamação -----
    if (btnFazer && modal && modalClose && formModal) {
        btnFazer.addEventListener('click', () => modal.style.display = 'flex');
        modalClose.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
        });
        formModal.addEventListener('submit', e => {
            e.preventDefault();
            adicionarIncidente(
                formModal.titulo.value.trim(),
                formModal.descricao.value.trim(),
                formModal.fotoURL.value.trim(),
                'São Paulo',             // cidade fixa
                formModal.bairro.value   // bairro do modal
            );
            formModal.reset();
            modal.style.display = 'none';
        });
        btnMinhas.addEventListener('click', () => {
            container && container.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ----- 8. Inicialização -----
    initStorage();
    renderIncidentes();
});
