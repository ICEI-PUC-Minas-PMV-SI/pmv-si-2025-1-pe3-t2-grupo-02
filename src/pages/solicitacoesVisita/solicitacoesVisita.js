async function getAuthenticatedUser() {
  const email = localStorage.getItem("loggedWith");

  if (!email) {
    console.error("Nenhum usuário logado (chave 'loggedWith' não encontrada).");
    return null;
  }

  try {
    let apiUrl;
    try {
      const configResponse = await fetch('../../config.json');
      const env = await configResponse.json();
      apiUrl = env.API_URL;
    } catch (e) {
      console.warn("config.json não encontrado, usando URL padrão http://localhost:3000");
      apiUrl = 'http://localhost:3000';
    }

    const response = await fetch(`${apiUrl}/usuarios?userEmail=${email}`);

    if (!response.ok) {
      throw new Error(`Erro na API: Status ${response.status}`);
    }

    const users = await response.json();

    if (users.length === 0) {
      console.error(`Nenhum usuário encontrado com o email: ${email}`);
      return null;
    }

    const userData = users[0];

    return {
      email: userData.userEmail,
      role: userData.userRole,
    };
  } catch (error) {
    console.error("Falha ao buscar dados do usuário na API:", error);
    return null;
  }
}

let dados = [];
let currentPage = 1;
const itemsPerPage = 10;
let filtroAtivo = "";

function mapStatusFromDb(dbStatus) {
  const statusMap = {
    EM_ABERTO: "Pendente",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDO: "Concluído",
  };
  return statusMap[dbStatus] || dbStatus;
}

async function carregarSolicitacoes() {
  const usuarioLogado = await getAuthenticatedUser();

  if (!usuarioLogado) {
    document.querySelector("main.principal").innerHTML = `
            <h1>Acesso Negado</h1>
            <p>Você precisa estar logado para ver esta página.</p>
        `;
    return;
  }

  try {
    const response = await fetch("../../services/db/db.json");
    if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

    const jsonData = await response.json();
    let solicitacoesDoDb = jsonData["solicitacao-visita"] || [];

    dados = solicitacoesDoDb.map(item => ({...item}));

    if (usuarioLogado.role === "USUARIO_COMUM") {
      solicitacoesDoDb = solicitacoesDoDb.filter(
        (item) => item.user === usuarioLogado.email
      );
    }

    preencherTabela(solicitacoesDoDb);
  } catch (error) {
    console.error("Erro ao carregar solicitações:", error);
  }
}

function preencherTabela(solicitacoes) {
  const tbody = document.getElementById("tabela-corpo");
  tbody.innerHTML = "";

  const dadosFiltrados = filtroAtivo
    ? solicitacoes.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filtroAtivo)
        )
      )
    : solicitacoes;

  if (dadosFiltrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhuma solicitação encontrada.</td></tr>`;
    document.getElementById("resultado-texto").textContent =
      "Mostrando 0 de 0 resultados";
    criarPaginacao(0);
    return;
  }

  const totalPaginas = Math.ceil(dadosFiltrados.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPaginas) || 1;
  const inicio = (currentPage - 1) * itemsPerPage;
  const fim = inicio + itemsPerPage;
  const dadosPagina = dadosFiltrados.slice(inicio, fim);

  dadosPagina.forEach((item) => {
    const tr = document.createElement("tr");
    const statusClass = {
        'Pendente': 'status-pendente',
        'Em andamento': 'status-em-andamento',
        'Concluído': 'status-concluido'
    }[mapStatusFromDb(item.status)] || '';

    tr.innerHTML = `
        <td>${item.data_visita || ""}</td>
        <td>${item.endereco || ""}</td>
        <td>${item.user || ""}</td>
        <td>${item.turno || ""}</td>
        <td>${item.motivo || ""}</td>
        <td class="${statusClass}">${mapStatusFromDb(item.status) || ''}</td>
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

  document.getElementById("resultado-texto").textContent = `Mostrando ${
    inicio + 1
  } a ${Math.min(fim, dadosFiltrados.length)} de ${
    dadosFiltrados.length
  } resultados`;
  criarPaginacao(totalPaginas);
}

async function handleEditClick(itemId) {
  const usuarioLogado = await getAuthenticatedUser();
  if (!usuarioLogado) return;

  const itemParaEditar = dados.find(item => item.id === itemId);
  if (!itemParaEditar) {
    console.error("Item para edição não encontrado:", itemId);
    return;
  }
  
  if (usuarioLogado.role === 'AGENTE_SAUDE') {
    // Se for agente, chama o modal de status (função de modal-solicitacoes.js)
    abrirModalEdicao(itemId);
  } else if (usuarioLogado.role === 'USUARIO_COMUM') {
    // Se for usuário comum, salva os dados e redireciona
    localStorage.setItem('editVisitData', JSON.stringify(itemParaEditar));
    window.location.href = '../solicitarVisita/solicitarVisita.html';
  }
}


function criarPaginacao(totalPaginas) {
    const paginacaoContainer = document.querySelector('.paginacao');
    paginacaoContainer.innerHTML = '';
    if (totalPaginas <= 1) return;
    const criarBotao = (texto, paginaAlvo, desabilitado = false, ativo = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = texto;
        btn.disabled = desabilitado;
        if (ativo) btn.classList.add('active');
        btn.addEventListener('click', () => { currentPage = paginaAlvo; preencherTabela(); });
        return btn;
    };
    paginacaoContainer.appendChild(criarBotao('&lt;', currentPage - 1, currentPage === 1));
    for (let i = 1; i <= totalPaginas; i++) {
        paginacaoContainer.appendChild(criarBotao(i.toString(), i, false, i === currentPage));
    }
    paginacaoContainer.appendChild(criarBotao('&gt;', currentPage + 1, currentPage === totalPaginas));
}

document.addEventListener('DOMContentLoaded', () => {
  carregarSolicitacoes();

  const tbody = document.getElementById('tabela-corpo');
  tbody.addEventListener('click', (event) => {
    const target = event.target;
    const editButton = target.closest('.btn-editar');
    const deleteButton = target.closest('.btn-excluir');

    if (editButton) {
      const itemId = editButton.dataset.id;
      handleEditClick(itemId);
    }

    if (deleteButton) {
      // Lógica de exclusão pode ser adicionada aqui
      console.log('Botão de excluir clicado para o item:', deleteButton.dataset.id);
    }
  });

  // Eventos de busca
  document.getElementById('btnBuscar').addEventListener('click', () => {
    filtroAtivo = document.getElementById('search').value.trim().toLowerCase();
    carregarSolicitacoes();
  });
  document.getElementById('search').addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        filtroAtivo = event.target.value.trim().toLowerCase();
        carregarSolicitacoes();
      }
  });
});