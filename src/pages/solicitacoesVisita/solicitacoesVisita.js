const dados = JSON.parse(localStorage.getItem('visitas')) || [];

let currentPage = 1;
const itemsPerPage = 10;
let filtroAtivo = '';

function getDadosFiltrados() {
  return dados.filter(item =>
    item.endereco.toLowerCase().includes(filtroAtivo) ||
    item.solicitante.toLowerCase().includes(filtroAtivo) ||
    item.status.toLowerCase().includes(filtroAtivo) ||
    item.data.toLowerCase().includes(filtroAtivo)
  );
}

function preencherTabela() {
  const tbody = document.getElementById('tabela-corpo');
  tbody.innerHTML = '';

  const dadosFiltrados = getDadosFiltrados();

  if (dadosFiltrados.length === 0) {
    alert('Nenhuma solicitação encontrada');
    document.getElementById('resultado-texto').textContent = 'Solicitação não encontrada';
    criarPaginacao(0);
    return;
  }

  const totalPaginas = Math.ceil(dadosFiltrados.length / itemsPerPage);

  if (currentPage > totalPaginas) currentPage = totalPaginas || 1;

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
    tbody.appendChild(tr);
  });

  document.getElementById('resultado-texto').textContent =
    `Mostrando ${dadosFiltrados.length === 0 ? 0 : inicio + 1} a ${Math.min(fim, dadosFiltrados.length)} de ${dadosFiltrados.length} resultados`;

  criarPaginacao(totalPaginas);
  adicionarEventos();
}

function criarPaginacao(totalPaginas) {
  const paginacao = document.querySelector('.paginacao');
  paginacao.innerHTML = '';

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

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = i;
      preencherTabela();
    });
    paginacao.appendChild(btn);
  }

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
