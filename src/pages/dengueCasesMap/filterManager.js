
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        console.error("Erro ao analisar cookie:", e);
        return null;
      }
    }
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function saveFilters() {
  const estado = document.getElementById('estado').value;
  const cidade = document.getElementById('cidade').value;
  const bairro = document.getElementById('bairro').value;
  const location = document.getElementById('location').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  const filters = {
    estado,
    cidade,
    bairro,
    location,
    startDate,
    endDate
  };

  setCookie('dengueFilters', filters, 30); 
  
  alert('Filtros salvos com sucesso!');
}

function loadFilters() {
  const filters = getCookie('dengueFilters');
  if (filters) {
    if (filters.estado) {
      document.getElementById('estado').value = filters.estado;

      const event = new Event('change');
      document.getElementById('estado').dispatchEvent(event);
      
      setTimeout(() => {
        if (filters.cidade) {
          document.getElementById('cidade').value = filters.cidade;

          document.getElementById('cidade').dispatchEvent(event);
          
          setTimeout(() => {
            if (filters.bairro) {
              document.getElementById('bairro').value = filters.bairro;
            }
          }, 300);
        }
      }, 300);
    }
    
    if (filters.location) document.getElementById('location').value = filters.location;
    if (filters.startDate) document.getElementById('startDate').value = filters.startDate;
    if (filters.endDate) document.getElementById('endDate').value = filters.endDate;
  }
}

function populateCidades() {
  const estado = document.getElementById('estado').value;
  const cidadeSelect = document.getElementById('cidade');
  
  cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
  document.getElementById('bairro').innerHTML = '<option value="">Selecione primeiro a cidade</option>';
  
  if (estado && cidades[estado]) {
    cidades[estado].forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade;
      option.textContent = cidade;
      cidadeSelect.appendChild(option);
    });
  }
}

function populateBairros() {
  const cidade = document.getElementById('cidade').value;
  const bairroSelect = document.getElementById('bairro');
  
  bairroSelect.innerHTML = '<option value="">Selecione o bairro</option>';
  
  if (cidade && bairros[cidade]) {
    bairros[cidade].forEach(bairro => {
      const option = document.createElement('option');
      option.value = bairro;
      option.textContent = bairro;
      bairroSelect.appendChild(option);
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadFilters();
    
  document.getElementById('estado').addEventListener('change', populateCidades);
  document.getElementById('cidade').addEventListener('change', populateBairros);
  
  document.getElementById('saveFilterButton').addEventListener('click', saveFilters);
  
  document.getElementById('clearFilterButton').addEventListener('click', function() {
    eraseCookie('dengueFilters');
    document.getElementById('estado').value = '';
    document.getElementById('cidade').innerHTML = '<option value="">Selecione primeiro o estado</option>';
    document.getElementById('bairro').innerHTML = '<option value="">Selecione primeiro a cidade</option>';
    document.getElementById('location').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
  });
});
