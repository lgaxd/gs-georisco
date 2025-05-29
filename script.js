document.addEventListener('DOMContentLoaded', () => {
    // -- Sidebar --
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const btnMenu = document.getElementById('btn-menu');
    const btnClose = document.getElementById('btn-close');
    if (sidebar && overlay && btnMenu && btnClose) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('visible');
        };
        btnMenu.addEventListener('click', toggleSidebar);
        btnClose.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }

    // -- Profile dropdown --
    const btnProfile = document.getElementById('btn-profile');
    const profileDrop = document.getElementById('profile-dropdown');
    if (btnProfile && profileDrop) {
        btnProfile.addEventListener('click', e => {
            e.stopPropagation();
            profileDrop.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            profileDrop.classList.remove('show');
        });
    }

    // -- LocalStorage & Incidentes --
    const formMain = document.getElementById('form-incidente');
    const container = document.getElementById('incidentes-container');
    function initStorage() {
        if (!localStorage.getItem('incidentes')) {
            localStorage.setItem('incidentes', JSON.stringify([]));
        }
    }
    function getIncidentes() {
        return JSON.parse(localStorage.getItem('incidentes'));
    }
    function adicionarIncidente(t, d, f) {
        const arr = getIncidentes();
        arr.push({ titulo: t, descricao: d, fotoURL: f, data: new Date().toLocaleString(), comentarios: [] });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
    }
    function adicionarComentario(i, texto) {
        const arr = getIncidentes();
        arr[i].comentarios.push({ texto, data: new Date().toLocaleString() });
        localStorage.setItem('incidentes', JSON.stringify(arr));
        renderIncidentes();
    }
    function renderIncidentes() {
        if (!container) return;
        container.innerHTML = '';
        getIncidentes().forEach((inc, i) => {
            const card = document.createElement('div');
            card.className = 'card-incidente';
            card.innerHTML = `
          <h3>${inc.titulo}</h3>
          <p>${inc.descricao}</p>
          ${inc.fotoURL ? `<img src="${inc.fotoURL}">` : ''}
          <small>${inc.data}</small>
          <h4>Comentários</h4>
          <ul>
            ${inc.comentarios.map(c => `<li>${c.texto}<br><small>${c.data}</small></li>`).join('')}
          </ul>
          <form data-idx="${i}" class="comment-form">
            <input name="comentario" placeholder="Comentário" required>
            <button type="submit">OK</button>
          </form>
        `;
            container.appendChild(card);
        });
        document.querySelectorAll('.comment-form').forEach(f => {
            f.addEventListener('submit', e => {
                e.preventDefault();
                const idx = Number(f.dataset.idx);
                const txt = f.comentario.value.trim();
                if (txt) adicionarComentario(idx, txt);
                f.reset();
            });
        });
    }
    if (formMain) {
        formMain.addEventListener('submit', e => {
            e.preventDefault();
            adicionarIncidente(
                e.target.titulo.value.trim(),
                e.target.descricao.value.trim(),
                e.target.fotoURL.value.trim()
            );
            formMain.reset();
        });
    }

    // -- Modal de reclamação --
    const modal = document.getElementById('modal');
    const btnFazer = document.getElementById('btn-fazer');
    const btnMinhas = document.getElementById('btn-minhas');
    const modalClose = document.getElementById('modal-close');
    const formModal = document.getElementById('form-incidente-modal');
    if (modal && btnFazer && modalClose && formModal) {
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
                formModal.fotoURL.value.trim()
            );
            formModal.reset();
            modal.style.display = 'none';
        });
        btnMinhas.addEventListener('click', () =>
            container && container.scrollIntoView({ behavior: 'smooth' })
        );
    }

    // Inicialização
    initStorage();
    renderIncidentes();
});
