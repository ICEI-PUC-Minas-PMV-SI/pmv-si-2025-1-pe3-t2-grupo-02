// Removida a linha: const dados = JSON.parse(localStorage.getItem('visitas')) || [];
let dados = []; // Esta variável guardará os dados carregados do db.json

let currentPage = 1;
const itemsPerPage = 10;
let filtroAtivo = '';

// Função para mapear o status do banco de dados para o status de exibição
function mapStatusFromDb(dbStatus) {
    if (dbStatus === 'EM_ABERTO') {
        return 'Pendente';
    }
    // Adicione outros mapeamentos se o seu db.json puder ter outros valores de status
    // Por exemplo:
    if (dbStatus === 'EM_ANDAMENTO') return 'Em andamento';
    if (dbStatus === 'CONCLUIDO') return 'Concluído';
    return dbStatus; // Ou 'Pendente' como padrão se um status desconhecido for encontrado
}

// Função para carregar as solicitações do db.json
async function carregarSolicitacoes() {
    try {
        // Ajuste o caminho para o db.json se ele estiver em um local diferente.
        // Assumindo que db.json está dois níveis acima (na raiz do projeto)
        // em relação ao diretório de solicitacoesVisita.html/js
        const response = await fetch('../../services/db/db.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const solicitacoesDoDb = jsonData['solicitacao-visita'];

        if (!solicitacoesDoDb) {
            console.error('A chave "solicitacao-visita" não foi encontrada no db.json.');
            dados = [];
        } else {
            // Mapeia os dados do db.json para o formato esperado pela tabela
            dados = solicitacoesDoDb.map(item => ({
                id: item.id, // Guardar o ID é importante para edições/exclusões futuras
                data: item.data_visita,
                endereco: item.endereco,
                solicitante: item.user, // Mapeia 'user' (email) para 'solicitante'
                turno: item.turno,
                motivo: item.motivo,
                status: mapStatusFromDb(item.status) // Mapeia o status
            }));
        }
        preencherTabela(); // Preenche a tabela após os dados serem carregados e mapeados
    } catch (error) {
        console.error("Erro ao carregar solicitações do db.json:", error);
        const tbody = document.getElementById('tabela-corpo');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Falha ao carregar dados. Verifique o console para mais detalhes.</td></tr>`;
        }
        const resultadoTexto = document.getElementById('resultado-texto');
        if (resultadoTexto) {
            resultadoTexto.textContent = 'Falha ao carregar dados';
        }
    }
}

function getDadosFiltrados() {
    if (!Array.isArray(dados)) {
        return [];
    }
    return dados.filter(item =>
        (item.endereco && typeof item.endereco === 'string' && item.endereco.toLowerCase().includes(filtroAtivo)) ||
        (item.solicitante && typeof item.solicitante === 'string' && item.solicitante.toLowerCase().includes(filtroAtivo)) ||
        (item.turno && typeof item.turno === 'string' && item.turno.toLowerCase().includes(filtroAtivo)) ||
        (item.motivo && typeof item.motivo === 'string' && item.motivo.toLowerCase().includes(filtroAtivo)) ||
        (item.status && typeof item.status === 'string' && item.status.toLowerCase().includes(filtroAtivo)) ||
        (item.data && typeof item.data === 'string' && item.data.toLowerCase().includes(filtroAtivo))
    );
}

function preencherTabela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = ''; // Limpa o corpo da tabela

    const dadosFiltrados = getDadosFiltrados();

    if (dadosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhuma solicitação encontrada.</td></tr>`;
        document.getElementById('resultado-texto').textContent = 'Mostrando 0 de 0 resultados';
        criarPaginacao(0); // Limpa ou ajusta a paginação
        return;
    }

    const totalPaginas = Math.ceil(dadosFiltrados.length / itemsPerPage);
    if (currentPage > totalPaginas && totalPaginas > 0) {
        currentPage = totalPaginas;
    } else if (totalPaginas === 0) {
        currentPage = 1;
    }

    const inicio = (currentPage - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    const dadosPagina = dadosFiltrados.slice(inicio, fim);

    dadosPagina.forEach(item => {
        const tr = document.createElement('tr');
        // Mapeamento de classes de status para estilização
        const statusClass = {
            'Pendente': 'status-pendente',
            'Em andamento': 'status-em-andamento',
            'Concluído': 'status-concluido'
        }[item.status] || '';

        tr.innerHTML = `
            <td>${item.data || ''}</td>
            <td>${item.endereco || ''}</td>
            <td>${item.solicitante || ''}</td>
            <td>${item.turno || ''}</td>
            <td>${item.motivo || ''}</td>
            <td class="${statusClass}">${item.status || ''}</td>
            <td>
                <button class="btn-editar" data-id="${item.id}" aria-label="Editar">
                    <img src="../../assets/icone-editar.png" alt="Editar" width="18" height="18" />
                </button>
                <button class="btn-excluir" data-id="${item.id}" aria-label="Excluir">
                    <img src="../../assets/icone-lixeira.png" alt="Excluir" width="18" height="18" />
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('resultado-texto').textContent =
        `Mostrando ${dadosFiltrados.length === 0 ? 0 : inicio + 1} a ${Math.min(fim, dadosFiltrados.length)} de ${dadosFiltrados.length} resultados`;

    criarPaginacao(totalPaginas);
    adicionarEventosAosBotoes(); // Renomeado para clareza e para garantir que os eventos sejam re-adicionados
}

function criarPaginacao(totalPaginas) {
    const paginacaoContainer = document.querySelector('.paginacao');
    paginacaoContainer.innerHTML = ''; // Limpa botões antigos

    if (totalPaginas <= 0) return;

    const criarBotao = (texto, paginaAlvo, desabilitado = false, ativo = false) => {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.disabled = desabilitado;
        if (ativo) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = paginaAlvo;
            preencherTabela();
        });
        return btn;
    };

    paginacaoContainer.appendChild(criarBotao('<<', currentPage - 1, currentPage === 1));

    // Lógica para exibir um conjunto limitado de botões de página (ex: 1 ... 5 6 7 ... 10)
    const maximoBotoesVisiveis = 5;
    let inicioLoop = 1;
    let fimLoop = totalPaginas;

    if (totalPaginas > maximoBotoesVisiveis) {
        let meio = Math.ceil(maximoBotoesVisiveis / 2);
        if (currentPage > meio) {
            inicioLoop = currentPage - meio + 1;
        }
        fimLoop = inicioLoop + maximoBotoesVisiveis - 1;
        if (fimLoop > totalPaginas) {
            fimLoop = totalPaginas;
            inicioLoop = fimLoop - maximoBotoesVisiveis + 1;
            if (inicioLoop < 1) inicioLoop = 1;
        }

        if (inicioLoop > 1) {
            paginacaoContainer.appendChild(criarBotao('1', 1));
            if (inicioLoop > 2) {
                const span = document.createElement('span');
                span.textContent = '...';
                span.style.padding = '0 5px';
                paginacaoContainer.appendChild(span);
            }
        }
    }

    for (let i = inicioLoop; i <= fimLoop; i++) {
        paginacaoContainer.appendChild(criarBotao(i.toString(), i, false, i === currentPage));
    }

    if (fimLoop < totalPaginas) {
        if (fimLoop < totalPaginas - 1) {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '0 5px';
            paginacaoContainer.appendChild(span);
        }
        paginacaoContainer.appendChild(criarBotao(totalPaginas.toString(), totalPaginas));
    }

    paginacaoContainer.appendChild(criarBotao('>>', currentPage + 1, currentPage === totalPaginas || totalPaginas === 0));
}


function adicionarEventosAosBotoes() {
    // Usar delegação de eventos para performance e para não precisar re-adicionar listeners
    // Se preferir o método antigo de re-adicionar, certifique-se que os botões são novos (clonados)
    // ou que os listeners antigos são removidos.
    // Por simplicidade aqui, vamos re-consultar e adicionar.
    // Para uma solução mais robusta, a delegação de eventos no tbody seria melhor.

    document.querySelectorAll('.btn-editar').forEach(btn => {
        const newBtn = btn.cloneNode(true); // Clona para remover listeners antigos
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.id;
            abrirModalEdicao(itemId);
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(btn => {
        const newBtn = btn.cloneNode(true); // Clona para remover listeners antigos
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.id;
            const confirmar = confirm('Deseja realmente excluir esta solicitação?');
            if (confirmar) {
                const indexParaExcluir = dados.findIndex(item => item.id === itemId);
                if (indexParaExcluir !== -1) {
                    dados.splice(indexParaExcluir, 1); // Remove do array em memória
                    // Para persistir a exclusão, uma chamada fetch DELETE seria necessária aqui.
                    // Ex: fetch(`caminho/para/api/solicitacoes/${itemId}`, { method: 'DELETE' })
                    //     .then(() => preencherTabela())
                    //     .catch(err => console.error("Erro ao excluir no servidor", err));
                    alert('Solicitação excluída localmente. A exclusão não será salva no db.json sem integração com backend.');
                    preencherTabela(); // Re-renderiza a tabela
                }
            }
        });
    });
}

// Event listener para o botão de busca
const btnBuscar = document.getElementById('btnBuscar');
if (btnBuscar) {
    btnBuscar.addEventListener('click', () => {
        filtroAtivo = document.getElementById('search').value.trim().toLowerCase();
        currentPage = 1; // Resetar para a primeira página ao buscar
        preencherTabela();
    });
}
const searchInput = document.getElementById('search');
if (searchInput){
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filtroAtivo = searchInput.value.trim().toLowerCase();
            currentPage = 1;
            preencherTabela();
        }
    });
}


// Inicia o carregamento dos dados quando o script é executado
// Como o script tem 'defer', o DOM estará pronto.
carregarSolicitacoes();