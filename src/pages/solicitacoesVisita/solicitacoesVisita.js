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
    item.motivo.toLowerCase().includes(filtroAtivo) ||
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
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${item.endereco}</h5>
          <p class="card-text"><strong>Data:</strong> ${formatarData(item.data)}</p>
          <p class="card-text"><strong>Status:</strong> ${getStatusBadge(item.status)}</p>
          <button class="btn btn-sm btn-outline-primary w-100 btn-detalhes" data-index="${inicio + index}">Ver Detalhes</button>
        </div>
      </div>
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

  const criarItem = (label, pagina, desativado = false, ativo = false) => {
    const li = document.createElement('li');
    li.className = `page-item ${desativado ? 'disabled' : ''} ${ativo ? 'active' : ''}`;
    li.innerHTML = `<button class="page-link" data-pagina="${pagina}">${label}</button>`;
    return li;
  };

  paginacao.appendChild(criarItem('Anterior', currentPage - 1, currentPage === 1));
  for (let i = 1; i <= totalPaginas; i++) {
    paginacao.appendChild(criarItem(i, i, false, currentPage === i));
  }
  paginacao.appendChild(criarItem('Próxima', currentPage + 1, currentPage === totalPaginas));

  paginacao.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const novaPagina = parseInt(btn.getAttribute('data-pagina'));
      if (!isNaN(novaPagina) && novaPagina >= 1 && novaPagina <= totalPaginas) {
        currentPage = novaPagina;
        preencherTabela();
      }
    });
  });
}

function adicionarEventos() {
  document.querySelectorAll('.btn-detalhes').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.dataset.index;
      abrirModalVisualizacao(idx);
    });
  });
}

function abrirModalVisualizacao(index) {
  const item = dados[index];
  document.getElementById('view-data').textContent = formatarData(item.data);
  document.getElementById('view-endereco').textContent = item.endereco;
  document.getElementById('view-solicitante').textContent = item.solicitante;
  document.getElementById('view-motivo').textContent = item.motivo;
  document.getElementById('view-status').innerHTML = getStatusBadge(item.status);

  document.getElementById('btn-editar-modal').onclick = () => abrirModalEdicao(index);
  document.getElementById('btn-excluir-modal').onclick = () => {
    if (confirm('Deseja realmente excluir esta solicitação?')) {
      dados.splice(index, 1);
      salvarDados();
      preencherTabela();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modal-visualizacao'));
      modal.hide();
    }
  };

  const modal = new bootstrap.Modal(document.getElementById('modal-visualizacao'));
  modal.show();
}

function abrirModalEdicao(index) {
  const item = dados[index];
  document.getElementById("edit-index").value = index;
  document.getElementById("edit-data").value = item.data;
  document.getElementById("edit-endereco").value = item.endereco;
  document.getElementById("edit-solicitante").value = item.solicitante;
  document.getElementById("edit-motivo").value = item.motivo;
  document.getElementById("edit-status").value = item.status;

  const modal = new bootstrap.Modal(document.getElementById('modal-edicao'));
  modal.show();
}

document.getElementById("form-edicao").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = document.getElementById("edit-index").value;

  dados[index] = {
    data: document.getElementById("edit-data").value,
    endereco: document.getElementById("edit-endereco").value,
    solicitante: document.getElementById("edit-solicitante").value,
    motivo: document.getElementById("edit-motivo").value,
    status: document.getElementById("edit-status").value,
  };

  salvarDados();
  preencherTabela();
  const modal = bootstrap.Modal.getInstance(document.getElementById("modal-edicao"));
  modal.hide();
});

function salvarDados() {
  localStorage.setItem('visitas', JSON.stringify(dados));
}

document.getElementById('btnBuscar').addEventListener('click', () => {
  filtroAtivo = document.getElementById('search').value.trim().toLowerCase();
  currentPage = 1;
  preencherTabela();
});

filtroAtivo = '';
preencherTabela();
