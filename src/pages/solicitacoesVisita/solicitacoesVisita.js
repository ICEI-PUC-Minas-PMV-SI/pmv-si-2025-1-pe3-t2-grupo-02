const dados = JSON.parse(localStorage.getItem('visitas')) || [];

let currentPage = 1;
const itemsPerPage = 10;
let filtroAtivo = '';

function formatarData(isoDate) {
  const date = new Date(isoDate);
  if (isNaN(date)) return isoDate;
  return date.toLocaleDateString('pt-BR');
}

function getStatusBadge(status) {
  const badgeMap = {
    'EM_ABERTO': '<span class="badge bg-warning text-dark">Em Aberto</span>',
    'EM_ANDAMENTO': '<span class="badge bg-info text-dark">Em Andamento</span>',
    'CONCLUÍDO': '<span class="badge bg-success">Concluído</span>',
  };
  return badgeMap[status] || '<span class="badge bg-secondary">Desconhecido</span>';
}

function getDadosFiltrados() {
  return dados.filter(item =>
    item.endereco.toLowerCase().includes(filtroAtivo) ||
    item.solicitante.toLowerCase().includes(filtroAtivo) ||
    item.status.toLowerCase().includes(filtroAtivo) ||
    item.data.toLowerCase().includes(filtroAtivo)
  );
}

function preencherTabela() {
  const container = document.getElementById('lista-solicitacoes');
  container.innerHTML = '';

  const dadosFiltrados = getDadosFiltrados();
  const inicio = (currentPage - 1) * itemsPerPage;
  const fim = inicio + itemsPerPage;
  const dadosPagina = dadosFiltrados.slice(inicio, fim);

  dadosPagina.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.data}</td>
      <td>${item.endereco}</td>
      <td>${item.solicitante}</td>
      <td>${item.status}</td>
      <td>
        <button class="btn-excluir" data-index="${inicio + index}" aria-label="Excluir">
          <img src="../assets/icone-lixeira.png" alt="Excluir" width="18" height="18" />
        </button>
      </td>
    `;
    container.appendChild(col);
  });

  document.getElementById('resultado-texto').textContent =
    `Mostrando ${dadosFiltrados.length === 0 ? 0 : inicio + 1} a ${Math.min(fim, dadosFiltrados.length)} de ${dadosFiltrados.length} resultados`;

  renderizarPaginacao(dadosFiltrados.length);
  adicionarEventos();
}

function renderizarPaginacao(totalItens) {
  const paginacao = document.getElementById('paginacao');
  paginacao.innerHTML = '';
  const totalPaginas = Math.ceil(totalItens / itemsPerPage);
  if (totalPaginas <= 1) return;

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = '<<';
  btnAnterior.disabled = currentPage === 1;
  btnAnterior.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      preencherTabela();
    }
  });
  paginacao.appendChild(btnAnterior);

  paginacao.appendChild(criarItem('Anterior', currentPage - 1, currentPage === 1));
  for (let i = 1; i <= totalPaginas; i++) {
    paginacao.appendChild(criarItem(i, i, false, currentPage === i));
  }
  paginacao.appendChild(criarItem('Próxima', currentPage + 1, currentPage === totalPaginas));

  const btnProxima = document.createElement('button');
  btnProxima.textContent = '>>';
  btnProxima.disabled = currentPage === totalPaginas;
  btnProxima.addEventListener('click', () => {
    if (currentPage < totalPaginas) {
      currentPage++;
      preencherTabela();
    }
  });
  paginacao.appendChild(btnProxima);
}

function adicionarEventos() {
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.currentTarget.dataset.index;
      const confirmar = confirm('Deseja realmente excluir esta solicitação?');
      if (confirmar) {
        dados.splice(idx, 1);
        preencherTabela();
      }
    });
  });
}

document.getElementById('btnBuscar').addEventListener('click', () => {
  filtroAtivo = document.getElementById('search').value.trim().toLowerCase();
  currentPage = 1;
  preencherTabela();
});

filtroAtivo = '';
preencherTabela();
