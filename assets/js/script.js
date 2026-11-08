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

// Função para renderizar os jogos na tela
function renderizarJogos() {
    const listaJogos = document.getElementById('lista-jogos');
    const jogos = getJogos();
    
    listaJogos.innerHTML = ''; // Limpa a lista antes de desenhar

    if (jogos.length === 0) {
        listaJogos.innerHTML = '<p>Nenhum jogo cadastrado.</p>';
        return;
    }

    jogos.forEach(jogo => {
        const article = document.createElement('article');
        
        article.innerHTML = `
            <h4>${jogo.nome}</h4>
            <p><strong>Gênero:</strong> ${formatarLabel(jogo.genero)}</p>
            <p><strong>Plataforma:</strong> ${formatarLabel(jogo.plataforma)}</p>
            <p><strong>Ano:</strong> ${jogo.ano}</p>
            <p><strong>Status:</strong> ${formatarLabel(jogo.status)}</p>
            <p><strong>Avaliação:</strong> ${jogo.avaliacao ? jogo.avaliacao + '/5' : 'N/A'}</p>
            
            <button type="button" onclick="verDetalhes(${jogo.id})">Ver detalhes</button>
            <button type="button" onclick="editarJogo(${jogo.id})">Editar</button>
            <button type="button" onclick="excluirJogo(${jogo.id})">Excluir</button>
        `;
        
        listaJogos.appendChild(article);
    });
}

// Funções vazias para evitar erros nos botões (implementaremos nos próximos passos)
function verDetalhes(id) { console.log('Detalhes do jogo', id); }
function editarJogo(id) { console.log('Editar jogo', id); }
function excluirJogo(id) { console.log('Excluir jogo', id); }

// Inicia a aplicação desenhando os jogos quando a página carrega
document.addEventListener('DOMContentLoaded', renderizarJogos);