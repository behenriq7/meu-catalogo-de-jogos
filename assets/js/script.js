// Estrutura inicial de dados (mock) para o caso do localStorage estar vazio
const jogosIniciais = [
    {
        id: 1,
        nome: "Grand Theft Auto V",
        genero: "acao",
        plataforma: "xbox",
        ano: 2013,
        status: "jogando",
        avaliacao: 5,
        observacoes: "Modo história quase no fim."
    },
    {
        id: 2,
        nome: "Hogwarts Legacy",
        genero: "aventura",
        plataforma: "pc",
        ano: 2023,
        status: "concluido",
        avaliacao: 5,
        observacoes: "Fazer as missões secundárias restantes."
    }
];

// Chave usada para salvar no localStorage
const STORAGE_KEY = 'meuCatalogoJogos';

// Função para buscar os jogos do localStorage
function getJogos() {
    const jogosSalvos = localStorage.getItem(STORAGE_KEY);
    if (jogosSalvos) {
        return JSON.parse(jogosSalvos);
    } else {
        // Se não tiver nada salvo, salva e retorna os iniciais
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jogosIniciais));
        return jogosIniciais;
    }
}

// Função para formatar as labels (ex: "acao" -> "Ação")
function formatarLabel(valor) {
    const labels = {
        'acao': 'Ação',
        'aventura': 'Aventura',
        'esporte': 'Esporte',
        'rpg': 'RPG',
        'tiro': 'Tiro',
        'xbox': 'Xbox',
        'playstation': 'PlayStation',
        'pc': 'PC',
        'nintendo': 'Nintendo',
        'quero-jogar': 'Quero Jogar',
        'jogando': 'Jogando',
        'concluido': 'Concluído'
    };
    return labels[valor] || valor;
}

// Função para renderizar os jogos na tela (AGORA COM FILTROS E ORDENAÇÃO)
function renderizarJogos() {
    const listaJogos = document.getElementById('lista-jogos');
    let jogos = getJogos();

    // 1. Lendo os valores preenchidos na área de pesquisa
    const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase().trim();
    const filtroGenero = document.getElementById('filtro-genero').value;
    const ordenacao = document.getElementById('ordenacao').value;

    // 2. Aplicando o Filtro de Texto (Pesquisa por nome)
    if (termoPesquisa) {
        jogos = jogos.filter(jogo => jogo.nome.toLowerCase().includes(termoPesquisa));
    }

    // 3. Aplicando o Filtro de Gênero
    if (filtroGenero) {
        jogos = jogos.filter(jogo => jogo.genero === filtroGenero);
    }

    // 4. Aplicando a Ordenação
    if (ordenacao === 'nome') {
        jogos.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordem alfabética
    } else if (ordenacao === 'ano') {
        jogos.sort((a, b) => (b.ano || 0) - (a.ano || 0)); // Mais novos primeiro
    } else if (ordenacao === 'avaliacao') {
        jogos.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0)); // Maior nota primeiro
    }

    // 5. Desenhando na tela
    listaJogos.innerHTML = ''; // Limpa a lista antes de desenhar

    if (jogos.length === 0) {
        listaJogos.innerHTML = '<p>Nenhum jogo encontrado com estes filtros.</p>';
        return;
    }

    jogos.forEach(jogo => {
        const article = document.createElement('article');

        article.innerHTML = `
            <h4>${jogo.nome}</h4>
            <p><strong>Gênero:</strong> ${formatarLabel(jogo.genero)}</p>
            <p><strong>Plataforma:</strong> ${formatarLabel(jogo.plataforma)}</p>
            <p><strong>Ano:</strong> ${jogo.ano || 'Não informado'}</p>
            <p><strong>Status:</strong> ${formatarLabel(jogo.status)}</p>
            <p><strong>Avaliação:</strong> ${jogo.avaliacao ? jogo.avaliacao + '/5' : 'N/A'}</p>
            
            <button type="button" onclick="verDetalhes(${jogo.id})">Ver detalhes</button>
            <button type="button" onclick="editarJogo(${jogo.id})">Editar</button>
            <button type="button" onclick="excluirJogo(${jogo.id})">Excluir</button>
        `;

        listaJogos.appendChild(article);
    });
}

// --- PASSO 3: EXCLUSÃO E DETALHES ---

// Função para excluir um jogo
function excluirJogo(id) {
    // Pede uma confirmação antes de apagar
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        let jogos = getJogos();

        // Filtra o array, mantendo apenas os jogos com ID diferente do que foi clicado
        jogos = jogos.filter(jogo => jogo.id !== id);

        // Salva o novo array no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos));

        // Atualiza a lista na tela
        renderizarJogos();

        // Se o jogo excluído for o mesmo que está aberto nos detalhes, limpa a área
        const detalhes = document.getElementById('conteudo-detalhes');
        if (detalhes.dataset.jogoId == id) {
            detalhes.innerHTML = '<p>Selecione um jogo no catálogo para visualizar seus detalhes aqui.</p>';
            delete detalhes.dataset.jogoId;
        }

        alert('Jogo excluído com sucesso!');
    }
}

// Função para ver os detalhes
function verDetalhes(id) {
    const jogos = getJogos();
    // Procura o jogo específico pelo ID
    const jogo = jogos.find(j => j.id === id);

    if (jogo) {
        const containerDetalhes = document.getElementById('conteudo-detalhes');

        // Guarda o ID no HTML para sabermos qual jogo está aberto (útil para exclusão/edição)
        containerDetalhes.dataset.jogoId = jogo.id;

        // Injeta o HTML com os dados do jogo selecionado
        containerDetalhes.innerHTML = `
            <h3>${jogo.nome}</h3>
            <p>${jogo.observacoes ? jogo.observacoes : 'Nenhuma observação cadastrada para este jogo.'}</p>
            <ul>
                <li><strong>Gênero:</strong> ${formatarLabel(jogo.genero)}</li>
                <li><strong>Plataforma:</strong> ${formatarLabel(jogo.plataforma)}</li>
                <li><strong>Ano de lançamento:</strong> ${jogo.ano || 'Não informado'}</li>
                <li><strong>Status:</strong> ${formatarLabel(jogo.status)}</li>
                <li><strong>Avaliação:</strong> ${jogo.avaliacao ? jogo.avaliacao + '/5' : 'Sem avaliação'}</li>
            </ul>
            <button type="button" onclick="editarJogo(${jogo.id})">Editar jogo</button>
            <button type="button" onclick="excluirJogo(${jogo.id})">Excluir jogo</button>
        `;

        // Rola a página suavemente até a seção de detalhes
        document.getElementById('detalhes').scrollIntoView({ behavior: 'smooth' });
    }
}

// --- PASSO 4: EDIÇÃO ---

// Função para carregar os dados de um jogo no formulário para edição
function editarJogo(id) {
    const jogos = getJogos();
    const jogo = jogos.find(j => j.id === id);

    if (jogo) {
        // Preenche os campos do formulário com os dados do jogo
        document.getElementById('nome-jogo').value = jogo.nome;
        document.getElementById('genero').value = jogo.genero;
        document.getElementById('plataforma').value = jogo.plataforma;
        document.getElementById('ano').value = jogo.ano;
        document.getElementById('status').value = jogo.status;
        document.getElementById('avaliacao').value = jogo.avaliacao;
        document.getElementById('observacoes').value = jogo.observacoes;

        // Guarda o ID do jogo no formulário para sabermos que é uma edição
        const formCadastro = document.getElementById('form-cadastro');
        formCadastro.dataset.editandoId = jogo.id;

        // Muda o título e o botão para indicar visualmente a edição
        document.querySelector('#cadastro h2').textContent = 'Editar Jogo';
        formCadastro.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';

        // Rola a página suavemente até o formulário
        document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
    }
}

// --- EVENTOS E INICIALIZAÇÃO ---

// Inicia a aplicação desenhando os jogos quando a página carrega
document.addEventListener('DOMContentLoaded', renderizarJogos);

// Captura o formulário do HTML
const formCadastro = document.getElementById('form-cadastro');

// Lógica de salvar (novo jogo ou edição)
formCadastro.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome-jogo').value.trim();
    const genero = document.getElementById('genero').value;
    const plataforma = document.getElementById('plataforma').value;
    const ano = document.getElementById('ano').value;
    const status = document.getElementById('status').value;
    const avaliacao = document.getElementById('avaliacao').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    if (!nome || !genero || !plataforma || !status) {
        alert('Atenção: Os campos Nome, Gênero, Plataforma e Status são obrigatórios!');
        return;
    }

    let jogos = getJogos();
    const editandoId = formCadastro.dataset.editandoId; // Verifica se tem um ID guardado (modo edição)

    if (editandoId) {
        // MODO EDIÇÃO: Encontra o jogo no array e atualiza os dados
        jogos = jogos.map(jogo => {
            if (jogo.id == editandoId) {
                return {
                    ...jogo, // Mantém o ID original
                    nome: nome,
                    genero: genero,
                    plataforma: plataforma,
                    ano: ano ? parseInt(ano) : '',
                    status: status,
                    avaliacao: avaliacao ? parseInt(avaliacao) : '',
                    observacoes: observacoes
                };
            }
            return jogo;
        });

        alert('Jogo atualizado com sucesso!');

        // Restaura o formulário para o visual original (Modo Cadastro)
        delete formCadastro.dataset.editandoId;
        document.querySelector('#cadastro h2').textContent = 'Cadastrar novo jogo';
        formCadastro.querySelector('button[type="submit"]').textContent = 'Cadastrar jogo';

        // Se o jogo editado estiver aberto na área de detalhes, atualiza lá também
        const detalhes = document.getElementById('conteudo-detalhes');
        if (detalhes.dataset.jogoId == editandoId) {
            verDetalhes(parseInt(editandoId));
        }

    } else {
        // MODO CADASTRO NOVO
        const novoJogo = {
            id: Date.now(),
            nome: nome,
            genero: genero,
            plataforma: plataforma,
            ano: ano ? parseInt(ano) : '',
            status: status,
            avaliacao: avaliacao ? parseInt(avaliacao) : '',
            observacoes: observacoes
        };
        jogos.push(novoJogo);
        alert('Jogo cadastrado com sucesso!');
    }

    // Salva, renderiza a lista e limpa o form
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos));
    renderizarJogos();
    formCadastro.reset();
});

// Lógica de Pesquisa e Filtros
const formPesquisa = document.getElementById('form-pesquisa');

formPesquisa.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita recarregar a página
    renderizarJogos(); // A função de renderizar já sabe ler os campos e filtrar!
});