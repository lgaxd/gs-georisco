/**
 * Carrega exemplos de incidentes no localStorage se não houver dados.
 */
function carregarExemplos() {
    const exemplos = [
        {
            titulo: 'Árvore na Rua Gomes de Carvalho',
            descricao: 'Uma grande árvore está com o tronco rachado.',
            imagens: ['images/arvore.jpg'],
            cidade: 'São Paulo',
            bairro: 'Moema',
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Queda de Árvore',
            gravidade: 'Risco Potencial',
            status: 'Pendente',
            comentarios: [],
            respostas: []
        },
        {
            titulo: 'Buraco gigante na Rua Tabatinguera',
            descricao: 'Asfalto cedeu após chuva forte.',
            imagens: ['images/buraco.jpg'],
            cidade: 'São Paulo',
            bairro: 'Sé',
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Buraco na via',
            gravidade: 'Risco Moderado',
            status: 'Pendente',
            comentarios: [],
            respostas: []
        },
        {
            titulo: 'Deslizamento de terra na Rua Girassol',
            descricao: 'Barro escorreu sobre a via.',
            imagens: ['images/deslizamento.png'],
            cidade: 'São Paulo',
            bairro: 'Vila Madalena',
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Deslizamento',
            gravidade: 'Risco Crítico',
            status: 'Pendente',
            comentarios: [],
            respostas: []
        },
        {
            titulo: 'Poste torto na Rua Iguatemi',
            descricao: 'Poste de luz inclinado após vento forte.',
            imagens: ['images/poste.jpg'],
            cidade: 'São Paulo',
            bairro: 'Itaim Bibi',
            data: new Date().toLocaleString('pt-BR'),
            tipo: 'Poste Danificado',
            gravidade: 'Risco Potencial',
            status: 'Pendente',
            comentarios: [],
            respostas: []
        },
    ];
    localStorage.setItem('incidentes', JSON.stringify(exemplos));
}

/**
 * Inicializa o armazenamento de incidentes, carregando exemplos se necessário
 * ou atualizando a estrutura de dados.
 */
function initStorage() {
    const raw = localStorage.getItem('incidentes');
    if (!raw) {
        carregarExemplos();
    } else {
        try {
            const arr = JSON.parse(raw);
            // Verifica se há dados antigos (ex: 'fotoURL' em vez de 'imagens' array)
            const antigos = arr.some(inc => inc.fotoURL || !Array.isArray(inc.imagens));
            if (antigos) {
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

/**
 * Obtém todos os incidentes armazenados.
 * @returns {Array} Uma lista de incidentes.
 */
function getIncidentes() {
    return JSON.parse(localStorage.getItem('incidentes')) || [];
}

/**
 * Salva uma lista de incidentes no localStorage.
 * @param {Array} incidentes A lista de incidentes a ser salva.
 */
function salvarIncidentes(incidentes) {
    try {
        localStorage.setItem('incidentes', JSON.stringify(incidentes));
    } catch (e) {
        console.error('Erro ao salvar incidentes no localStorage:', e);
    }
}

/**
 * Adiciona um novo incidente ao armazenamento.
 * @param {string} titulo
 * @param {string} descricao
 * @param {Array<string>} imagensArray URLs ou Base64 das imagens.
 * @param {string} cidade
 * @param {string} bairro
 * @param {string} [tipo] Classificação do tipo do incidente
 * @param {string} [gravidade] Classificação de gravidade
 * @param {string} [status] Status atual do incidente
 */
function adicionarIncidente(titulo, descricao, imagensArray, cidade, bairro, tipo = '', gravidade = '', status = 'Pendente') {
    const arr = getIncidentes();
    arr.push({
        titulo,
        descricao,
        imagens: imagensArray,
        cidade,
        bairro,
        tipo,
        gravidade,
        status,
        data: new Date().toLocaleString('pt-BR'),
        comentarios: [],
        respostas: []
    });
    salvarIncidentes(arr);
    // As renderizações serão feitas pelo módulo de incidentes, não aqui diretamente
}

/**
 * Adiciona um comentário a um incidente específico.
 * @param {number} idx Índice do incidente.
 * @param {string} texto Texto do comentário.
 */
function adicionarComentario(idx, texto) {
    const arr = getIncidentes();
    if (arr[idx]) {
        arr[idx].comentarios.push({ texto, data: new Date().toLocaleString('pt-BR') });
        salvarIncidentes(arr);
    } else {
        console.error(`Incidente com índice ${idx} não encontrado para adicionar comentário.`);
    }
}

/**
 * Adiciona uma resposta de autoridade a um incidente específico.
 * @param {number} idx Índice do incidente.
 * @param {string} texto Texto da resposta.
 * @param {string} perfil Perfil do usuário que está respondendo (moderador/autoridade).
 */
function adicionarResposta(idx, texto, perfil) {
    const arr = getIncidentes();
    if (arr[idx]) {
        arr[idx].respostas.push({ texto, data: new Date().toLocaleString('pt-BR'), perfil });
        salvarIncidentes(arr);
    } else {
        console.error(`Incidente com índice ${idx} não encontrado para adicionar resposta.`);
    }
}

// Expor funções para serem acessíveis globalmente
window.utilsModule = {
    initStorage,
    getIncidentes,
    salvarIncidentes,
    adicionarIncidente,
    adicionarComentario,
    adicionarResposta
};
