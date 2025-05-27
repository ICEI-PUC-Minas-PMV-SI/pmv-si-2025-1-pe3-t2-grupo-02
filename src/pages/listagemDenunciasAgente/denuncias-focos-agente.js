// Variáveis para mapa e gráficos
let denunciasMap;
let tiposChart;
let detailMap;

// Função para atualizar estilos dos componentes visuais no modo externo
function updateOutdoorModeStyles(isOutdoorMode) {
  // Atualizar estilos do mapa
  if (denunciasMap) {
    const mapElement = document.getElementById('denunciasMap');
    if (isOutdoorMode) {
      mapElement.style.filter = 'saturate(150%) brightness(110%) contrast(120%)';
      // Atualizar controles e markers do mapa para melhor visualização no modo externo
      document.querySelectorAll('.leaflet-control').forEach(control => {
        control.style.backgroundColor = '#333333';
        control.style.color = '#FFFFFF';
        control.style.border = '2px solid #FFDD00';
      });
    } else {
      mapElement.style.filter = 'none';
      document.querySelectorAll('.leaflet-control').forEach(control => {
        control.style.backgroundColor = '';
        control.style.color = '';
        control.style.border = '';
      });
    }
    
    // Trigger de atualização do mapa para aplicar as mudanças
    denunciasMap.invalidateSize();
  }
  
  // Atualizar estilos do gráfico de tipos
  if (tiposChart) {
    const existingOptions = tiposChart.options;
    
    if (isOutdoorMode) {
      // Configurações de alta visibilidade para o modo externo
      tiposChart.options.plugins.legend.labels.color = '#FFDD00';
      tiposChart.options.plugins.title.color = '#FFFFFF';
      tiposChart.options.color = '#FFFFFF';
    } else {
      // Restaurar configurações padrão
      tiposChart.options.plugins.legend.labels.color = '#666666';
      tiposChart.options.plugins.title.color = '#333333';
      tiposChart.options.color = '#333333';
    }
    
    // Aplicar as mudanças
    tiposChart.update();
  }
}

// Inicializar observador do modo externo
function setupOutdoorModeObserver() {
  // Observar mudanças na classe 'outdoor-mode' do body para atualizar componentes visuais
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isOutdoorMode = document.body.classList.contains('outdoor-mode');
        updateOutdoorModeStyles(isOutdoorMode);
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
  
  // Verificar estado inicial
  const isOutdoorMode = document.body.classList.contains('outdoor-mode');
  updateOutdoorModeStyles(isOutdoorMode);
}

// Função para inicializar os mapas e gráficos
function initVisualization() {
  // Inicializar mapa de denúncias
  denunciasMap = L.map('denunciasMap').setView([-20.2976, -40.2958], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(denunciasMap);
  
  // Configurar observador do modo externo
  setupOutdoorModeObserver();

  // Inicializar gráfico de tipos de foco
  if (document.getElementById('tiposChart')) {
    const ctx = document.getElementById('tiposChart').getContext('2d');
    tiposChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(231, 76, 60, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            display: true,
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Distribuição por Tipo de Foco',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

// Atualiza os dados visuais com base nas denúncias
function updateVisualData(denuncias) {
  // Atualizar contadores
  const totalDenuncias = denuncias.length;
  const denunciasUrgentes = denuncias.filter(d => d.prioridade === 'alta').length;
  
  // Calcular bairros afetados (únicos)
  const bairrosUnicos = new Set(denuncias.map(d => d.bairro));
  const totalBairros = bairrosUnicos.size;
  
  // Calcular denúncias dos últimos 7 dias
  const dataAtual = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(dataAtual.getDate() - 7);
  const novasDenuncias = denuncias.filter(d => {
    const dataDenuncia = new Date(d.data_registro);
    return dataDenuncia >= seteDiasAtras;
  }).length;
  
  // Atualizar os valores no DOM
  document.getElementById('totalDenuncias').textContent = totalDenuncias;
  document.getElementById('denunciasUrgentes').textContent = denunciasUrgentes;
  document.getElementById('bairrosAfetados').textContent = totalBairros;
  document.getElementById('novasDenuncias').textContent = novasDenuncias;
  
  // Atualizar mapa
  if (denunciasMap) {
    denunciasMap.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        denunciasMap.removeLayer(layer);
      }
    });
    
    // Adicionar marcadores para cada denúncia
    denuncias.forEach(denuncia => {
      if (denuncia.latitude && denuncia.longitude) {
        // Cor do marcador baseado na prioridade
        const markerColor = denuncia.prioridade === 'alta' ? 'red' : 
                           (denuncia.prioridade === 'media' ? 'orange' : 'green');
        
        const marker = L.circleMarker([denuncia.latitude, denuncia.longitude], {
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.7,
          radius: 8
        }).addTo(denunciasMap);
        
        marker.bindPopup(`
          <strong>Denúncia ID: ${denuncia.id}</strong><br>
          Local: ${denuncia.local}<br>
          Tipo: ${denuncia.tipo}<br>
          Status: ${denuncia.status}<br>
          Prioridade: ${denuncia.prioridade}<br>
          <button class="btn btn-sm btn-primary view-details" data-id="${denuncia.id}">
            Ver detalhes
          </button>
        `);
        
        marker.on('popupopen', function() {
          const button = document.querySelector(`.view-details[data-id="${denuncia.id}"]`);
          if (button) {
            button.addEventListener('click', () => {
              mostrarDetalhesDenuncia(denuncia);
            });
          }
        });
      }
    });
  }
  
  // Atualizar gráfico de tipos se existir
  if (tiposChart) {
    // Contagem de ocorrências por tipo
    const tipoCount = {};
    denuncias.forEach(denuncia => {
      // Garante que estamos lidando com um array de tipos
      const tipos = Array.isArray(denuncia.tipo) ? denuncia.tipo : [denuncia.tipo];
      
      tipos.forEach(tipo => {
        // Formatar o texto para melhor legibilidade na legenda
        const formattedType = formatBadgeText(tipo);
        tipoCount[formattedType] = (tipoCount[formattedType] || 0) + 1;
      });
    });
    
    // Ordenar os tipos por frequência (do mais comum para o menos comum)
    const sortedLabels = Object.keys(tipoCount).sort((a, b) => tipoCount[b] - tipoCount[a]);
    const sortedData = sortedLabels.map(label => tipoCount[label]);
    
    // Atualizar dados do gráfico
    tiposChart.data.labels = sortedLabels;
    tiposChart.data.datasets[0].data = sortedData;
    
    // Certificar-se de que temos cores suficientes
    const colorsNeeded = tiposChart.data.labels.length;
    const defaultColors = [
      'rgba(255, 99, 132, 0.8)', // Vermelho
      'rgba(54, 162, 235, 0.8)', // Azul
      'rgba(255, 206, 86, 0.8)', // Amarelo
      'rgba(75, 192, 192, 0.8)', // Verde-água
      'rgba(153, 102, 255, 0.8)', // Roxo
      'rgba(255, 159, 64, 0.8)', // Laranja
      'rgba(231, 76, 60, 0.8)', // Vermelho escuro
      'rgba(46, 204, 113, 0.8)', // Verde
      'rgba(52, 152, 219, 0.8)', // Azul escuro
      'rgba(155, 89, 182, 0.8)' // Lilás
    ];
    
    // Expandir a paleta de cores se necessário
    while (defaultColors.length < colorsNeeded) {
      defaultColors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`);
    }
    
    tiposChart.data.datasets[0].backgroundColor = defaultColors.slice(0, colorsNeeded);
    
    // Criar legendas personalizadas fora do gráfico para melhor visualização
    const chartContainer = document.querySelector('.chart-container');
    const existingLegend = document.getElementById('custom-legend');
    
    if (chartContainer) {
      // Remover legenda antiga se existir
      if (existingLegend) {
        existingLegend.remove();
      }
      
      // Criar nova legenda
      const legendDiv = document.createElement('div');
      legendDiv.id = 'custom-legend';
      legendDiv.classList.add('tipo-legend');
      
      // Adicionar itens à legenda
      sortedLabels.forEach((label, index) => {
        const percentage = Math.round((sortedData[index] / sortedData.reduce((a, b) => a + b, 0)) * 100);
        const legendItem = document.createElement('div');
        legendItem.classList.add('tipo-legend-item');
        
        const colorBox = document.createElement('span');
        colorBox.classList.add('tipo-legend-color');
        colorBox.style.backgroundColor = defaultColors[index];
        
        const labelText = document.createElement('span');
        labelText.classList.add('tipo-legend-label');
        labelText.textContent = `${label}: ${sortedData[index]} (${percentage}%)`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendDiv.appendChild(legendItem);
      });
      
      chartContainer.appendChild(legendDiv);
    }
    
    tiposChart.update();
  }
}

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
    
    // Adicionando status e prioridade para demonstração
    return data.map(denuncia => {
      // Gerar status aleatório para demonstração
      const statusOptions = ['pendente', 'agendado', 'visitado', 'eliminado'];
      const prioridadeOptions = ['baixa', 'media', 'alta'];
      
      // Utilizando ID ou outro valor único como seed para manter consistência
      const idSeed = parseInt(String(denuncia.id || '').replace(/\D/g, '') || '1') || Date.now();
      const statusIndex = idSeed % statusOptions.length;
      const prioridadeIndex = Math.floor(idSeed / 3) % prioridadeOptions.length;
      
      // Adicionar coordenadas aleatórias para demonstração (Vitória-ES)
      const baseLatitude = -20.2976;
      const baseLongitude = -40.2958;
      const randomLat = baseLatitude + (Math.random() * 0.05 - 0.025);
      const randomLng = baseLongitude + (Math.random() * 0.05 - 0.025);
      
      return {
        ...denuncia,
        status: statusOptions[statusIndex],
        prioridade: prioridadeOptions[prioridadeIndex],
        observacoes: denuncia.observacoes || 'Sem observações adicionadas pelo denunciante.',
        data_visita: null,
        latitude: denuncia.latitude || randomLat,
        longitude: denuncia.longitude || randomLng
      };
    });
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
  status: [],
  prioridade: []
};

let currentPage = 1;
const itemsPerPage = 10;

let currentSort = {
  column: null,
  direction: null
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

  // Status e prioridade
  const filterStatus = $('#filterStatus');
  filterStatus.empty();
  ['pendente', 'agendado', 'visitado', 'eliminado'].forEach(status => {
    filterStatus.append(`<option value="${status}">${formatStatusText(status)}</option>`);
  });

  const filterPrioridade = $('#filterPrioridade');
  filterPrioridade.empty();
  ['baixa', 'media', 'alta'].forEach(prioridade => {
    filterPrioridade.append(`<option value="${prioridade}">${formatPrioridadeText(prioridade)}</option>`);
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
  if (currentFilters.status.length)
    $('#filterStatus').selectpicker('val', currentFilters.status);
  if (currentFilters.prioridade.length)
    $('#filterPrioridade').selectpicker('val', currentFilters.prioridade);

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
        case 'filterStatus':
          currentFilters.status = selectedValues;
          break;
        case 'filterPrioridade':
          currentFilters.prioridade = selectedValues;
          break;
      }
    }
  );

  const filterModal = document.getElementById('filterModal');
  filterModal.addEventListener('shown.bs.modal', () => {
    $('.selectpicker').selectpicker('refresh');
  });

  document.querySelectorAll('.custom-table th.sortable').forEach(header => {
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

  renderTable(allDenunciasFocos);

  document
    .querySelector('.table-search-btn[title="Filtrar"]')
    .classList.remove('active');

  currentSort = {
    column: null,
    direction: null
  };
  
  document.querySelectorAll('.custom-table th.sortable').forEach(header => {
    header.classList.remove('asc', 'desc');
    header.querySelector('.sort-icon').textContent = 'unfold_more';
  });
}

// Função para formatar data
function formatDate(dateStr) {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return dateStr;
  }
}

function formatStatusText(status) {
  const statusMap = {
    'pendente': 'Pendente de Visita',
    'agendado': 'Visita Agendada',
    'visitado': 'Visitado',
    'eliminado': 'Foco Eliminado'
  };
  return statusMap[status] || status;
}

function formatPrioridadeText(prioridade) {
  const prioridadeMap = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta'
  };
  return prioridadeMap[prioridade] || prioridade;
}

function toggleDetailModal(denunciaId = null) {
  const modal = document.getElementById('denunciaDetailModal');
  modal.classList.toggle('show');
  
  if (denunciaId && modal.classList.contains('show')) {
    loadDenunciaDetails(denunciaId);
  }
}

// Função para carregar os detalhes da denúncia pelo ID
function loadDenunciaDetails(denunciaId) {
  // Encontrar a denúncia correspondente
  const denuncia = allDenunciasFocos.find(d => d.id == denunciaId);
  
  if (denuncia) {
    mostrarDetalhesDenuncia(denuncia);
  } else {
    alert('Denúncia não encontrada!');
    toggleDetailModal();
  }
}

// Função para agendar visita diretamente da tabela
function scheduleVisit(denunciaId) {
  // Encontrar a denúncia correspondente
  const denuncia = allDenunciasFocos.find(d => d.id == denunciaId);
  
  if (denuncia) {
    // Abrir o modal de detalhes
    mostrarDetalhesDenuncia(denuncia);
    
    // Simular clique no botão de agendar visita após um pequeno atraso
    setTimeout(() => {
      document.getElementById('agendarVisitaBtn').click();
    }, 300);
  }
}

// Função para gerar relatório de uma denúncia específica
function printReport(denunciaId) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Encontrar a denúncia correspondente
  const denuncia = allDenunciasFocos.find(d => d.id == denunciaId);
  
  if (!denuncia) {
    alert('Denúncia não encontrada!');
    return;
  }
  
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');

  // Título do relatório
  doc.setFontSize(16);
  doc.text(`Relatório de Denúncia #${denuncia.id}`, 14, 15);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate} às ${currentTime}`, 14, 22);
  
  // Informações da denúncia
  doc.setFontSize(12);
  doc.text('Informações da Denúncia:', 14, 30);
  doc.setFontSize(10);
  
  const dataRegistro = formatDate(denuncia.data_registro);
  doc.text(`Data de Registro: ${dataRegistro}`, 20, 38);
  doc.text(`Bairro: ${denuncia.bairro || 'Não informado'}`, 20, 44);
  doc.text(`Cidade: ${denuncia.cidade || 'Não informada'}, ${denuncia.estado || ''}`, 20, 50);
  doc.text(`Status: ${formatStatusText(denuncia.status)}`, 20, 56);
  doc.text(`Prioridade: ${formatPrioridadeText(denuncia.prioridade)}`, 20, 62);
  
  // Localização do foco
  doc.setFontSize(12);
  doc.text('Localização do Foco:', 14, 72);
  doc.setFontSize(10);
  doc.text(`Endereço: ${denuncia.endereco || 'Não informado'}`, 20, 80);
  
  // Detalhes do foco
  doc.setFontSize(12);
  doc.text('Detalhes:', 14, 90);
  doc.setFontSize(10);
  
  const tipos = Array.isArray(denuncia.tipo) 
    ? denuncia.tipo.map(t => formatBadgeText(t)).join(', ')
    : formatBadgeText(denuncia.tipo);
  
  const locais = Array.isArray(denuncia.local)
    ? denuncia.local.map(l => formatBadgeText(l)).join(', ')
    : formatBadgeText(denuncia.local);
    
  doc.text(`Tipos de Foco: ${tipos}`, 20, 98);
  doc.text(`Locais: ${locais}`, 20, 104);
  
  // Observações
  doc.setFontSize(12);
  doc.text('Observações:', 14, 114);
  
  // Quebrar observações longas em múltiplas linhas
  const observacoes = denuncia.observacoes || 'Sem observações.';
  const textLines = doc.splitTextToSize(observacoes, 170);
  doc.setFontSize(10);
  doc.text(textLines, 20, 122);
  
  // Notas do agente
  if (denuncia.notasAgente) {
    doc.setFontSize(12);
    doc.text('Notas do Agente:', 14, 142);
    const notasLines = doc.splitTextToSize(denuncia.notasAgente, 170);
    doc.setFontSize(10);
    doc.text(notasLines, 20, 150);
  }
  
  // Informações da visita
  if (denuncia.data_visita) {
    doc.setFontSize(12);
    doc.text('Informações de Visita:', 14, 170);
    doc.setFontSize(10);
    doc.text(`Data Agendada: ${formatDate(denuncia.data_visita)}`, 20, 178);
  }
  
  // QR code para localização (simulado apenas com texto)
  doc.setFontSize(8);
  doc.text('Escaneie para acessar a localização', 150, 200);
  doc.rect(150, 205, 30, 30);
  doc.text('QR Code', 158, 220);
  
  // Rodapé
  doc.setFontSize(8);
  doc.text('Sistema de Denúncias de Focos - Vigilância Sanitária', 14, doc.internal.pageSize.height - 10);
  
  const fileName = `denuncia_${denuncia.id}_${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}

function renderTable(denuncias) {
  const tableBody = document.getElementById('denunciasTableBody');
  tableBody.innerHTML = '';

  let dataToRender = denuncias;
  if (currentSort.column) {
    dataToRender = sortData(denuncias, currentSort.column, currentSort.direction);
  }

  const paginatedData = getPaginatedData(dataToRender);
  paginatedData.forEach((denuncia) => {
    const row = document.createElement('tr');
    row.setAttribute('data-denuncia-id', denuncia.id || '');
    row.addEventListener('click', function() {
      toggleDetailModal(denuncia.id);
    });
    
    const dataRegistro = formatDate(denuncia.data_registro);
    const locais = Array.isArray(denuncia.local)
      ? denuncia.local
          .map(
            (local) =>
              `<span class="badge badge-locais badge-custom">${formatBadgeText(
                local
              )}</span>`
          )
          .join(' ')
      : `<span class="badge badge-locais badge-custom">${formatBadgeText(
          denuncia.local
        )}</span>`;
    const tipos = denuncia.tipo
      .map(
        (tipo) =>
          `<span class="badge badge-tipos badge-custom">${formatBadgeText(
            tipo
          )}</span>`
      )
      .join(' ');
      
    const statusBadge = `<span class="status-badge status-${denuncia.status}">${formatStatusText(denuncia.status)}</span>`;
    const prioridadeBadge = `<span class="priority-badge prioridade-${denuncia.prioridade}">
      <span class="priority-indicator-table priority-${denuncia.prioridade}"></span>
      ${formatPrioridadeText(denuncia.prioridade)}
    </span>`;
    
    row.innerHTML = `
            <td>${dataRegistro}</td>
            <td>${denuncia.bairro || '-'}</td>
            <td>${denuncia.cidade || '-'}</td>
            <td>${denuncia.estado || '-'}</td>
            <td>${locais}</td>
            <td>${tipos}</td>
            <td>${statusBadge}</td>
            <td>${prioridadeBadge}</td>
            <td class="actions-col">
                <button class="action-btn" title="Ver detalhes" onclick="event.stopPropagation(); toggleDetailModal('${denuncia.id}')">
                  <span class="material-icons">visibility</span>
                </button>
                <button class="action-btn" title="Agendar visita" onclick="event.stopPropagation(); scheduleVisit('${denuncia.id}')">
                  <span class="material-icons">event</span>
                </button>
                <button class="action-btn" title="Imprimir" onclick="event.stopPropagation(); printReport('${denuncia.id}')">
                  <span class="material-icons">print</span>
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });

  document.getElementById('resultsCount').textContent = denuncias.length;
  updatePagination(denuncias.length);
  
  // Atualizar visualizações
  updateVisualData(allDenunciasFocos);
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

// Removido: document.addEventListener('DOMContentLoaded', populateTable);

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

function formatStatusText(status) {
  const statusMap = {
    'pendente': 'Pendente',
    'agendado': 'Visita Agendada',
    'visitado': 'Visitado',
    'eliminado': 'Foco Eliminado'
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPrioridadeText(prioridade) {
  const prioridadeMap = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta'
  };
  return prioridadeMap[prioridade] || prioridade.charAt(0).toUpperCase() + prioridade.slice(1);
}

// Função para mostrar o modal com detalhes da denúncia
function mostrarDetalhesDenuncia(denuncia) {
  const modal = document.getElementById('denunciaDetailModal');
  
  // Preencher os detalhes no modal
  document.getElementById('detailId').textContent = denuncia.id || 'N/A';
  document.getElementById('detailDate').textContent = formatDate(denuncia.data_registro) || 'Data não informada';
  document.getElementById('detailEndereco').textContent = denuncia.endereco || 'Não informado';
  document.getElementById('detailBairro').textContent = denuncia.bairro || 'Não informado';
  document.getElementById('detailCidade').textContent = denuncia.cidade || 'Não informado';
  document.getElementById('detailEstado').textContent = denuncia.estado || 'Não informado';
  document.getElementById('detailReferencia').textContent = denuncia.referencia || 'Sem pontos de referência';
  
  // Preencher tipos e locais com badges
  const tipoElement = document.getElementById('detailTipo');
  if (tipoElement) {
    tipoElement.innerHTML = '';
    
    if (Array.isArray(denuncia.tipo) && denuncia.tipo.length > 0) {
      denuncia.tipo.forEach(tipo => {
        const badge = document.createElement('span');
        badge.className = 'badge badge-tipos badge-custom';
        badge.textContent = formatBadgeText(tipo);
        tipoElement.appendChild(badge);
      });
    } else {
      tipoElement.innerHTML = '<span>Não informado</span>';
    }
  }
  
  const localElement = document.getElementById('detailLocal');
  if (localElement) {
    localElement.innerHTML = '';
    
    if (Array.isArray(denuncia.local) && denuncia.local.length > 0) {
      denuncia.local.forEach(local => {
        const badge = document.createElement('span');
        badge.className = 'badge badge-locais badge-custom';
        badge.textContent = formatBadgeText(local);
        localElement.appendChild(badge);
      });
    } else if (denuncia.local) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-locais badge-custom';
      badge.textContent = formatBadgeText(denuncia.local);
      localElement.appendChild(badge);
    } else {
      localElement.innerHTML = '<span>Não informado</span>';
    }
  }
  
  // Atualizar status e prioridade
  const statusSelect = document.getElementById('detailStatus');
  if (statusSelect) {
    statusSelect.value = denuncia.status || 'pendente';
  }
  
  const prioridadeSelect = document.getElementById('detailPrioridade');
  if (prioridadeSelect) {
    prioridadeSelect.value = denuncia.prioridade || 'baixa';
  }
  
  // Mostrar observações
  const obsElement = document.getElementById('detailObservacoes');
  if (obsElement) {
    obsElement.textContent = denuncia.observacoes || 'Sem observações adicionadas pelo denunciante.';
  }
  
  // Mostrar data de visita se houver
  if (denuncia.data_visita) {
    document.getElementById('detailDataVisita').value = denuncia.data_visita.split('T')[0];
    if (denuncia.data_visita.includes('T')) {
      document.getElementById('detailHoraVisita').value = denuncia.data_visita.split('T')[1].substring(0, 5);
    }
  } else {
    document.getElementById('detailDataVisita').value = '';
    document.getElementById('detailHoraVisita').value = '';
  }
  
  // Mostrar notas do agente se houver
  const notasElement = document.getElementById('detailNotas');
  if (notasElement) {
    notasElement.value = denuncia.notasAgente || '';
  }
  
  // Mostrar imagens se houver
  const imagesElement = document.getElementById('detailImages');
  if (imagesElement) {
    imagesElement.innerHTML = '';
    
    if (denuncia.imagens && Array.isArray(denuncia.imagens) && denuncia.imagens.length > 0) {
      denuncia.imagens.forEach((img, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `Imagem ${index + 1} da denúncia`;
        imgElement.onclick = () => window.open(img, '_blank');
        imagesElement.appendChild(imgElement);
      });
    } else {
      imagesElement.innerHTML = '<p>Sem imagens disponíveis</p>';
    }
  }
  
  // Inicializar o mapa de detalhe se houver coordenadas
  if (denuncia.latitude && denuncia.longitude && document.getElementById('detailMap')) {
    if (detailMap) {
      detailMap.remove();
    }
    
    detailMap = L.map('detailMap').setView([denuncia.latitude, denuncia.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(detailMap);
    
    L.marker([denuncia.latitude, denuncia.longitude]).addTo(detailMap)
      .bindPopup(`<strong>Local da denúncia</strong><br>${denuncia.endereco || 'Endereço não informado'}`)
      .openPopup();
      
    // Ajustar o mapa após abrir o modal
    setTimeout(() => {
      detailMap.invalidateSize();
    }, 200);
  }
  
  // Exibir modal
  modal.classList.add('show');
}

// Anexar eventos aos botões do modal de detalhes
function attachDetailModalEvents() {
  // Botão de salvar alterações
  document.getElementById('salvarMudancasBtn').addEventListener('click', function() {
    const denunciaId = document.getElementById('detailId').textContent;
    const status = document.getElementById('detailStatus').value;
    const prioridade = document.getElementById('detailPrioridade').value;
    const notas = document.getElementById('detailNotas').value;
    const dataVisita = document.getElementById('detailDataVisita').value;
    
    // Atualizar a denúncia nos dados
    const index = allDenunciasFocos.findIndex(d => d.id === denunciaId);
    if (index !== -1) {
      allDenunciasFocos[index].status = status;
      allDenunciasFocos[index].prioridade = prioridade;
      allDenunciasFocos[index].notasAgente = notas;
      
      if (dataVisita) {
        allDenunciasFocos[index].data_visita = dataVisita;
        // Se uma data foi definida e o status ainda é pendente, atualizar para agendado
        if (status === 'pendente') {
          allDenunciasFocos[index].status = 'agendado';
          document.getElementById('detailStatus').value = 'agendado';
        }
      }
      
      // Atualizar visualizações
      renderTable(filteredDenunciasFocos.length > 0 ? filteredDenunciasFocos : allDenunciasFocos);
      updateVisualData(allDenunciasFocos);
      
      alert('Informações atualizadas com sucesso!');
    }
  });
  
  // Botão de agendar visita
  document.getElementById('agendarVisitaBtn').addEventListener('click', function() {
    const dataVisitaInput = document.getElementById('detailDataVisita');
    
    // Definir data padrão como amanhã às 10h
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(10, 0, 0, 0);
    
    const formatoData = amanha.toISOString().slice(0, 16);
    dataVisitaInput.value = formatoData;
    
    // Atualizar status para agendado
    document.getElementById('detailStatus').value = 'agendado';
    
    // Focar no campo para que o usuário possa modificar
    dataVisitaInput.focus();
  });
  
  // Botão de imprimir relatório
  document.getElementById('printReportBtn').addEventListener('click', function() {
    const denunciaId = document.getElementById('detailId').textContent;
    printReport(denunciaId);
  });
  
  // Botão de concluir denúncia
  document.getElementById('concluirDenunciaBtn').addEventListener('click', function() {
    if (confirm('Confirmar que o foco foi eliminado?')) {
      const denunciaId = document.getElementById('detailId').textContent;
      const index = allDenunciasFocos.findIndex(d => d.id === denunciaId);
      
      if (index !== -1) {
        allDenunciasFocos[index].status = 'eliminado';
        document.getElementById('detailStatus').value = 'eliminado';
        
        // Se não houver data de visita, colocar a data atual
        if (!allDenunciasFocos[index].data_visita) {
          const agora = new Date().toISOString().slice(0, 16);
          document.getElementById('detailDataVisita').value = agora;
          allDenunciasFocos[index].data_visita = agora;
        }
        
        // Atualizar visualizações
        renderTable(filteredDenunciasFocos.length > 0 ? filteredDenunciasFocos : allDenunciasFocos);
        updateVisualData(allDenunciasFocos);
        
        alert('Denúncia marcada como resolvida!');
      }
    }
  });
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');

  doc.setFontSize(16);
  doc.text('Relatório de Denúncias de Focos - Agentes de Saúde', 14, 15);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${currentDate} às ${currentTime}`, 14, 22);

  // Estatísticas para o relatório
  const totalDenuncias = document.getElementById('totalDenuncias').textContent;
  const denunciasUrgentes = document.getElementById('denunciasUrgentes').textContent;
  const bairrosAfetados = document.getElementById('bairrosAfetados').textContent;
  
  doc.setFontSize(12);
  doc.text('Resumo:', 14, 30);
  doc.setFontSize(10);
  doc.text(`Total de Denúncias: ${totalDenuncias}`, 20, 38);
  doc.text(`Denúncias Urgentes: ${denunciasUrgentes}`, 20, 44);
  doc.text(`Bairros Afetados: ${bairrosAfetados}`, 20, 50);

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
      formatStatusText(denuncia.status),
      formatPrioridadeText(denuncia.prioridade),
    ];
  });

  doc.autoTable({
    head: [
      ['Data de Registro', 'Bairro', 'Cidade', 'Estado', 'Locais', 'Tipo', 'Status', 'Prioridade'],
    ],
    body: data,
    startY: 60,
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
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 20 },
      7: { cellWidth: 20 },
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

// Função para ordenar os dados da tabela
function handleSort(column) {
  const headers = document.querySelectorAll('.custom-table th.sortable');
  const header = document.querySelector(`.custom-table th[data-sort="${column}"]`);
  
  // Atualizar ícones e classes nos cabeçalhos da tabela
  headers.forEach(h => {
    if (h !== header) {
      h.classList.remove('asc', 'desc');
      h.querySelector('.sort-icon').textContent = 'unfold_more';
    }
  });
  
  let direction;
  if (!header.classList.contains('asc') && !header.classList.contains('desc')) {
    // Primeira vez clicando - ordenar ascendente
    header.classList.add('asc');
    header.classList.remove('desc');
    header.querySelector('.sort-icon').textContent = 'keyboard_arrow_up';
    direction = 'asc';
  } else if (header.classList.contains('asc')) {
    // Já está ascendente - mudar para descendente
    header.classList.remove('asc');
    header.classList.add('desc');
    header.querySelector('.sort-icon').textContent = 'keyboard_arrow_down';
    direction = 'desc';
  } else {
    // Já está descendente - remover ordenação
    header.classList.remove('desc');
    header.querySelector('.sort-icon').textContent = 'unfold_more';
    direction = null;
  }
  
  // Atualizar estado de ordenação atual
  currentSort = {
    column: direction ? column : null,
    direction: direction
  };
  
  // Renderizar tabela com a nova ordenação
  renderTable(
    filteredDenunciasFocos.length > 0
      ? filteredDenunciasFocos
      : allDenunciasFocos
  );
}

// Função para realizar a ordenação dos dados
function sortData(data, column, direction) {
  return [...data].sort((a, b) => {
    let valueA, valueB;
    
    // Tratamentos especiais para diferentes tipos de colunas
    switch (column) {
      case 'data_registro':
        valueA = new Date(a.data_registro || '1970-01-01').getTime();
        valueB = new Date(b.data_registro || '1970-01-01').getTime();
        break;
      case 'bairro':
        valueA = a.bairro || '';
        valueB = b.bairro || '';
        break;
      case 'cidade':
        valueA = a.cidade || '';
        valueB = b.cidade || '';
        break;
      case 'estado':
        valueA = a.estado || '';
        valueB = b.estado || '';
        break;
      case 'local':
        valueA = Array.isArray(a.local) ? a.local[0] || '' : a.local || '';
        valueB = Array.isArray(b.local) ? b.local[0] || '' : b.local || '';
        break;
      case 'tipo':
        valueA = Array.isArray(a.tipo) ? a.tipo[0] || '' : a.tipo || '';
        valueB = Array.isArray(b.tipo) ? b.tipo[0] || '' : b.tipo || '';
        break;
      case 'status':
        // Ordem personalizada para status: pendente > agendado > visitado > eliminado
        const statusOrder = {
          'pendente': 1,
          'agendado': 2,
          'visitado': 3,
          'eliminado': 4
        };
        valueA = statusOrder[a.status] || 999;
        valueB = statusOrder[b.status] || 999;
        break;
      case 'prioridade':
        // Ordem personalizada para prioridade: alta > media > baixa
        const prioridadeOrder = {
          'alta': 1,
          'media': 2,
          'baixa': 3
        };
        valueA = prioridadeOrder[a.prioridade] || 999;
        valueB = prioridadeOrder[b.prioridade] || 999;
        break;
      default:
        valueA = a[column] || '';
        valueB = b[column] || '';
    }
    
    // Comparação para string (case insensitive)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB, 'pt-BR', { sensitivity: 'base' })
        : valueB.localeCompare(valueA, 'pt-BR', { sensitivity: 'base' });
    }
    
    // Comparação para números/datas
    return direction === 'asc' ? valueA - valueB : valueB - valueA;
  });
}

// Inicializar a página quando carregada
document.addEventListener('DOMContentLoaded', async function() {
  // Inicializar visualizações
  if (document.getElementById('denunciasMap')) {
    initVisualization();
  }
  
  // Carregar dados e popular tabela
  await populateTable();
  
  // Adicionar listener para o botão de exportação
  const exportBtn = document.querySelector('.export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToPDF);
  }
  
  // Configurar fechamento do modal de detalhes
  document.getElementById('closeDetailModal').addEventListener('click', function() {
    document.getElementById('denunciaDetailModal').classList.remove('show');
  });
  
  // Fechar modal ao clicar fora
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('denunciaDetailModal');
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
  
  // Inicializar handlers de ordenação
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', function() {
      const column = this.getAttribute('data-sort');
      handleSort(column);
    });
  });
  
  // Inicializar eventos do modal de detalhes
  attachDetailModalEvents();
  
  // Configurar observador do modo externo
  setupOutdoorModeObserver();
});
