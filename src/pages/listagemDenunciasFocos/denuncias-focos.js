async function fetchDenunciasFocos() {
  try {
    let apiUrl;
    await fetch('../../config.json')
      .then((response) => response.json())
      .then((env) => {
        apiUrl = env.API_URL;
      });
    const response = await fetch(`${apiUrl}/denuncias-focos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    const tableBody = document.getElementById('denunciasTableBody');
    tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Erro ao carregar dados. Por favor, verifique se o servidor está rodando.
                </td>
            </tr>
        `;
    return [];
  }
}

let allDenunciasFocos = [];
let filteredDenunciasFocos = [];

let currentFilters = {
  dataInicio: null,
  dataFim: null,
  bairro: [],
  cidade: [],
  estado: [],
  local: [],
  tipo: [],
};

let currentPage = 1;
const itemsPerPage = 10;

let currentSort = {
  column: 'data_registro',
  direction: 'desc',
};

function getPaginatedData(data) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.querySelector('.pagination');
  const prevButton = paginationContainer.querySelector(
    '.pagination-btn:first-child'
  );
  const nextButton = paginationContainer.querySelector(
    '.pagination-btn:last-child'
  );
  const pageSpan = paginationContainer.querySelector('.pagination-page');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
  pageSpan.textContent = `${currentPage} de ${totalPages}`;

  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable(
        filteredDenunciasFocos.length > 0
          ? filteredDenunciasFocos
          : allDenunciasFocos
      );
    }
  };

  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable(
        filteredDenunciasFocos.length > 0
          ? filteredDenunciasFocos
          : allDenunciasFocos
      );
    }
  };
}

function populateFilterOptions(denuncias) {
  const bairros = [...new Set(denuncias.map((d) => d.bairro))]
    .filter(Boolean)
    .sort();
  const cidades = [...new Set(denuncias.map((d) => d.cidade))]
    .filter(Boolean)
    .sort();
  const estados = [...new Set(denuncias.map((d) => d.estado))]
    .filter(Boolean)
    .sort();
  const locais = [
    ...new Set(
      denuncias.flatMap((d) => (Array.isArray(d.local) ? d.local : [d.local]))
    ),
  ]
    .filter(Boolean)
    .sort();
  const tipos = [...new Set(denuncias.flatMap((d) => d.tipo))]
    .filter(Boolean)
    .sort();

  const filterBairro = $('#filterBairro');
  filterBairro.empty();
  bairros.forEach((bairro) => {
    filterBairro.append(`<option value="${bairro}">${bairro}</option>`);
  });

  const filterCidade = $('#filterCidade');
  filterCidade.empty();
  cidades.forEach((cidade) => {
    filterCidade.append(`<option value="${cidade}">${cidade}</option>`);
  });

  const filterEstado = $('#filterEstado');
  filterEstado.empty();
  estados.forEach((estado) => {
    filterEstado.append(`<option value="${estado}">${estado}</option>`);
  });

  const filterLocal = $('#filterLocal');
  filterLocal.empty();
  locais.forEach((local) => {
    filterLocal.append(
      `<option value="${local}">${formatBadgeText(local)}</option>`
    );
  });

  const filterTipo = $('#filterTipo');
  filterTipo.empty();
  tipos.forEach((tipo) => {
    filterTipo.append(
      `<option value="${tipo}">${formatBadgeText(tipo)}</option>`
    );
  });

  $('.selectpicker').selectpicker({
    noneSelectedText: 'Nenhum selecionado',
    noneResultsText: 'Nenhum resultado encontrado {0}',
    countSelectedText: '{0} selecionados',
    liveSearchPlaceholder: 'Buscar...',
    style: 'btn-default',
    size: 5,
    width: '100%',
    liveSearch: true,
    actionsBox: false,
    selectedTextFormat: 'count > 3',
  });

  if (currentFilters.bairro.length)
    $('#filterBairro').selectpicker('val', currentFilters.bairro);
  if (currentFilters.cidade.length)
    $('#filterCidade').selectpicker('val', currentFilters.cidade);
  if (currentFilters.estado.length)
    $('#filterEstado').selectpicker('val', currentFilters.estado);
  if (currentFilters.local.length)
    $('#filterLocal').selectpicker('val', currentFilters.local);
  if (currentFilters.tipo.length)
    $('#filterTipo').selectpicker('val', currentFilters.tipo);

  $('.selectpicker').selectpicker('refresh');
}

function toggleFilterModal() {
  const modal = document.getElementById('filterModal');
  modal.classList.toggle('show');
}
document
  .querySelector('.table-search-btn[title="Filtrar"]')
  .addEventListener('click', toggleFilterModal);
document
  .getElementById('closeFilterModal')
  .addEventListener('click', toggleFilterModal);

function performSearch(searchTerm) {
  searchTerm = searchTerm.toLowerCase().trim();
  currentPage = 1;

  if (!searchTerm) {
    renderTable(
      filteredDenunciasFocos.length > 0
        ? filteredDenunciasFocos
        : allDenunciasFocos
    );
    return;
  }

  const searchResults = (
    filteredDenunciasFocos.length > 0
      ? filteredDenunciasFocos
      : allDenunciasFocos
  ).filter((denuncia) => {
    return (
      (denuncia.data_registro &&
        denuncia.data_registro.toLowerCase().includes(searchTerm)) ||
      (denuncia.bairro && denuncia.bairro.toLowerCase().includes(searchTerm)) ||
      (denuncia.cidade && denuncia.cidade.toLowerCase().includes(searchTerm)) ||
      (denuncia.estado && denuncia.estado.toLowerCase().includes(searchTerm)) ||
      (Array.isArray(denuncia.local)
        ? denuncia.local.some((local) =>
            local.toLowerCase().includes(searchTerm)
          )
        : denuncia.local.toLowerCase().includes(searchTerm)) ||
      denuncia.tipo.some((tipo) => tipo.toLowerCase().includes(searchTerm))
    );
  });

  renderTable(searchResults);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.table-search-input');

  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchInput.value);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  $('.selectpicker').selectpicker({
    noneSelectedText: 'Nenhum selecionado',
    noneResultsText: 'Nenhum resultado encontrado {0}',
    countSelectedText: '{0} selecionados',
    liveSearchPlaceholder: 'Buscar...',
    style: 'btn-default',
    size: 5,
    width: '100%',
    liveSearch: true,
    actionsBox: false,
    selectedTextFormat: 'count > 3',
  });

  const filterForm = document.getElementById('filterForm');
  filterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters(e);
  });

  const clearFiltersBtn = document.getElementById('clearFilters');
  clearFiltersBtn.addEventListener('click', function (e) {
    e.preventDefault();
    clearFilters();
  });

  $('.selectpicker').on(
    'changed.bs.select',
    function (e, clickedIndex, isSelected, previousValue) {
      const select = $(this);
      const selectedValues = select.selectpicker('val') || [];
      const filterId = select.attr('id');

      switch (filterId) {
        case 'filterBairro':
          currentFilters.bairro = selectedValues;
          break;
        case 'filterCidade':
          currentFilters.cidade = selectedValues;
          break;
        case 'filterEstado':
          currentFilters.estado = selectedValues;
          break;
        case 'filterLocal':
          currentFilters.local = selectedValues;
          break;
        case 'filterTipo':
          currentFilters.tipo = selectedValues;
          break;
      }
    }
  );

  const filterModal = document.getElementById('filterModal');
  filterModal.addEventListener('shown.bs.modal', () => {
    $('.selectpicker').selectpicker('refresh');
  });

  document.querySelectorAll('.custom-table th.sortable').forEach((header) => {
    header.addEventListener('click', () => {
      const column = header.dataset.sort;
      handleSort(column);
    });
  });
});

function applyFilters(e) {
  if (e) e.preventDefault();

  const getSelectedValues = (selectId) => {
    const values = $(`#${selectId}`).selectpicker('val');
    return values || [];
  };

  const dataInicio = document.getElementById('filterDataInicio').value;
  const dataFim = document.getElementById('filterDataFim').value;

  currentFilters = {
    dataInicio: dataInicio || null,
    dataFim: dataFim || null,
    bairro: getSelectedValues('filterBairro'),
    cidade: getSelectedValues('filterCidade'),
    estado: getSelectedValues('filterEstado'),
    local: getSelectedValues('filterLocal'),
    tipo: getSelectedValues('filterTipo'),
  };

  filteredDenunciasFocos = allDenunciasFocos.filter((denuncia) => {
    const hasCommonElements = (arr1, arr2) => {
      if (!arr1.length || !arr2.length) return true;
      return arr1.some((item) => arr2.includes(item));
    };

    const matchesAnySelected = (value, selectedValues) => {
      if (!selectedValues.length) return true;
      if (!value) return false;
      return selectedValues.includes(value);
    };

    const isDateInRange = (dateStr) => {
      if (!dateStr) return true;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return true;

      if (currentFilters.dataInicio) {
        const startDate = new Date(currentFilters.dataInicio);
        if (date < startDate) return false;
      }

      if (currentFilters.dataFim) {
        const endDate = new Date(currentFilters.dataFim);
        endDate.setHours(23, 59, 59, 999);
        if (date > endDate) return false;
      }

      return true;
    };

    const bairroMatch = matchesAnySelected(
      denuncia.bairro,
      currentFilters.bairro
    );
    const cidadeMatch = matchesAnySelected(
      denuncia.cidade,
      currentFilters.cidade
    );
    const estadoMatch = matchesAnySelected(
      denuncia.estado,
      currentFilters.estado
    );
    const dataMatch = isDateInRange(denuncia.data_registro);

    const localMatch =
      currentFilters.local.length === 0 ||
      (Array.isArray(denuncia.local)
        ? hasCommonElements(denuncia.local, currentFilters.local)
        : currentFilters.local.includes(denuncia.local));

    const tipoMatch =
      currentFilters.tipo.length === 0 ||
      hasCommonElements(denuncia.tipo, currentFilters.tipo);

    return (
      bairroMatch &&
      cidadeMatch &&
      estadoMatch &&
      localMatch &&
      tipoMatch &&
      dataMatch
    );
  });

  currentPage = 1;
  const searchInput = document.querySelector('.table-search-input');
  if (searchInput.value.trim()) {
    performSearch(searchInput.value);
  } else {
    renderTable(filteredDenunciasFocos);
  }

  const hasActiveFilters = Object.values(currentFilters).some(
    (selected) =>
      selected && (Array.isArray(selected) ? selected.length > 0 : true)
  );
  document
    .querySelector('.table-search-btn[title="Filtrar"]')
    .classList.toggle('active', hasActiveFilters);

  toggleFilterModal();
}

function clearFilters() {
  currentFilters = {
    dataInicio: null,
    dataFim: null,
    bairro: [],
    cidade: [],
    estado: [],
    local: [],
    tipo: [],
  };

  $('.selectpicker').each(function () {
    $(this).selectpicker('deselectAll');
  });
  $('.selectpicker').selectpicker('refresh');

  document.getElementById('filterDataInicio').value = '';
  document.getElementById('filterDataFim').value = '';

  filteredDenunciasFocos = [];
  currentPage = 1;

  const searchInput = document.querySelector('.table-search-input');
  searchInput.value = '';

  currentSort = {
    column: 'data_registro',
    direction: 'desc',
  };

  document.querySelectorAll('.custom-table th.sortable').forEach((header) => {
    header.classList.remove('asc', 'desc');
    header.querySelector('.sort-icon').textContent = 'unfold_more';
  });

  const sortHeader = document.querySelector('th[data-sort="data_registro"]');
  sortHeader.classList.add('desc');
  sortHeader.querySelector('.sort-icon').textContent = 'expand_more';

  renderTable(allDenunciasFocos);

  document
    .querySelector('.table-search-btn[title="Filtrar"]')
    .classList.remove('active');
}

function formatDate(dateString) {
  if (!dateString) return 'Não registrado';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return 'Data inválida';
  }
}

function renderTable(denuncias) {
  const tableBody = document.getElementById('denunciasTableBody');
  tableBody.innerHTML = '';

  let dataToRender = denuncias;
  if (currentSort.column) {
    dataToRender = sortData(
      denuncias,
      currentSort.column,
      currentSort.direction
    );
  }

  const paginatedData = getPaginatedData(dataToRender);
  const loggedWith = localStorage.getItem('loggedWith');

  paginatedData.forEach((denuncia) => {
    const row = document.createElement('tr');
    const dataRegistro = formatDate(denuncia.data_registro);
    const locais = Array.isArray(denuncia.local)
      ? denuncia.local
          .map(
            (local) =>
              `<span class=\"badge badge-locais badge-custom\">${formatBadgeText(
                local
              )}</span>`
          )
          .join(' ')
      : `<span class=\"badge badge-locais badge-custom\">${formatBadgeText(
          denuncia.local
        )}</span>`;
    const tipos = denuncia.tipo
      .map(
        (tipo) =>
          `<span class=\"badge badge-tipos badge-custom\">${formatBadgeText(
            tipo
          )}</span>`
      )
      .join(' ');

    const actionButtons = `
      <button class="action-btn" title="Visualizar"><span class="material-icons">visibility</span></button>
      ${
        denuncia.email_usuario === loggedWith
          ? `<button class="action-btn" title="Editar"><span class="material-icons">edit</span></button>
           <button class="action-btn" title="Excluir"><span class="material-icons">delete</span></button>`
          : ''
      }`;

    row.innerHTML = `
            <td>${dataRegistro}</td>
            <td>${denuncia.bairro}</td>
            <td>${denuncia.cidade}</td>
            <td>${denuncia.estado}</td>
            <td>${locais}</td>
            <td>${tipos}</td>
            <td class="actions-col">
                ${actionButtons}
            </td>
        `;
    tableBody.appendChild(row);
  });

  document.getElementById('resultsCount').textContent = denuncias.length;
  updatePagination(denuncias.length);
}

async function populateTable() {
  const tableBody = document.getElementById('denunciasTableBody');
  tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2">Carregando dados...</p>
            </td>
        </tr>
    `;
  const denunciasFocos = await fetchDenunciasFocos();
  if (denunciasFocos.length === 0) {
    return;
  }
  allDenunciasFocos = denunciasFocos;
  populateFilterOptions(denunciasFocos);
  renderTable(denunciasFocos);
}

document.addEventListener('DOMContentLoaded', populateTable);

function formatBadgeText(text) {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(
      (word) =>
        word.charAt(0).toLocaleUpperCase('pt-BR') +
        word.slice(1).toLocaleLowerCase('pt-BR')
    )
    .join(' ');
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');

  doc.setFontSize(16);
  doc.text('Relatório de Denúncias de Focos', 14, 15);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate} às ${currentTime}`, 14, 22);

  const data = (
    filteredDenunciasFocos.length > 0
      ? filteredDenunciasFocos
      : allDenunciasFocos
  ).map((denuncia) => {
    const dataRegistro = formatDate(denuncia.data_registro);
    const locais = Array.isArray(denuncia.local)
      ? denuncia.local.map((local) => formatBadgeText(local)).join(', ')
      : formatBadgeText(denuncia.local);
    const tipos = denuncia.tipo.map((tipo) => formatBadgeText(tipo)).join(', ');

    return [
      dataRegistro,
      denuncia.bairro || '',
      denuncia.cidade || '',
      denuncia.estado || '',
      locais,
      tipos,
    ];
  });

  doc.autoTable({
    head: [
      ['Data de Registro', 'Bairro', 'Cidade', 'Estado', 'Locais', 'Tipo'],
    ],
    body: data,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [108, 117, 125],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 40 },
      5: { cellWidth: 40 },
    },
    margin: { top: 30 },
    didDrawPage: function (data) {
      doc.setFontSize(8);
      doc.text(
        `Página ${data.pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  const fileName = `denuncias_focos_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}

document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.querySelector('.export-btn');
  exportBtn.addEventListener('click', exportToPDF);
});

function sortData(data, column, direction) {
  return [...data].sort((a, b) => {
    let valueA, valueB;

    if (column === 'local') {
      valueA = Array.isArray(a.local) ? a.local.join(', ') : a.local || '';
      valueB = Array.isArray(b.local) ? b.local.join(', ') : b.local || '';
    } else if (column === 'tipo') {
      valueA = a.tipo.join(', ');
      valueB = b.tipo.join(', ');
    } else if (column === 'data_registro') {
      valueA = a.data_registro ? new Date(a.data_registro).getTime() : 0;
      valueB = b.data_registro ? new Date(b.data_registro).getTime() : 0;
    } else {
      valueA = a[column] || '';
      valueB = b[column] || '';
    }

    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function handleSort(column) {
  const headers = document.querySelectorAll('.custom-table th.sortable');

  headers.forEach((header) => {
    header.classList.remove('asc', 'desc');
    header.querySelector('.sort-icon').textContent = 'unfold_more';
  });

  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }

  const currentHeader = document.querySelector(`th[data-sort="${column}"]`);
  currentHeader.classList.add(currentSort.direction);
  currentHeader.querySelector('.sort-icon').textContent =
    currentSort.direction === 'asc' ? 'expand_less' : 'expand_more';

  const dataToSort =
    filteredDenunciasFocos.length > 0
      ? filteredDenunciasFocos
      : allDenunciasFocos;
  const sortedData = sortData(dataToSort, column, currentSort.direction);

  if (filteredDenunciasFocos.length > 0) {
    filteredDenunciasFocos = sortedData;
  } else {
    allDenunciasFocos = sortedData;
  }

  renderTable(sortedData);
}
