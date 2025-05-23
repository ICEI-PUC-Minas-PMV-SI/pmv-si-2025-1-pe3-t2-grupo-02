document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isViewMode = urlParams.get('mode') === 'view';
  const isEditMode = urlParams.get('mode') === 'edit';

  if (isViewMode || isEditMode) {
    const denunciaData = JSON.parse(localStorage.getItem(isViewMode ? 'viewDenuncia' : 'editDenuncia'));
    if (denunciaData) {
      document.querySelector('.header-report-case h1').textContent = isViewMode ? 'Visualizar Denúncia' : 'Editar Denúncia';
      
      const submitButton = document.querySelector('.report-case-button');
      if (submitButton) {
        submitButton.style.display = isViewMode ? 'none' : 'block';
        if (isEditMode) {
          submitButton.textContent = 'Atualizar';
        }
      }

      document.getElementById('estado').value = denunciaData.estado;
      document.getElementById('cidade').value = denunciaData.cidade;
      document.getElementById('bairro').value = denunciaData.bairro;

      const local = Array.isArray(denunciaData.local) ? denunciaData.local[0] : denunciaData.local;
      if (local === 'outro') {
        document.getElementById('outro').checked = true;
        document.getElementById('outro_local').value = denunciaData.local;
        document.getElementById('outro_local').disabled = isViewMode;
      } else {
        const localCheckbox = document.querySelector(`input[name="local"][value="${local}"]`);
        if (localCheckbox) {
          localCheckbox.checked = true;
        }
      }

      denunciaData.tipo.forEach(tipo => {
        if (tipo === 'outros') {
          document.getElementById('outros').checked = true;
          document.getElementById('outros_focos').value = tipo;
          document.getElementById('outros_focos').disabled = isViewMode;
        } else {
          const tipoCheckbox = document.querySelector(`input[name="tipo_foco"][value="${tipo}"]`);
          if (tipoCheckbox) {
            tipoCheckbox.checked = true;
          }
        }
      });

      if (isViewMode) {
        const form = document.getElementById('formulario1');
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.disabled = true;
        });
        form.onsubmit = null;
      } else if (isEditMode) {
        localStorage.setItem('editingDenunciaId', denunciaData.id);
      }
    }
  } else {
    const checkboxesLocal = document.querySelectorAll('input[name="local"]');
    checkboxesLocal.forEach(function (checkbox) {
      checkbox.addEventListener("click", function () {
        if (this.checked) {
          checkboxesLocal.forEach(function (otherCheckbox) {
            if (otherCheckbox !== checkbox) {
              otherCheckbox.checked = false;
            }
          });
        }

        const inputOutroLocal = document.getElementById("outro_local");
        if (this.value == "outro") {
          inputOutroLocal.disabled = false;
        } else {
          inputOutroLocal.disabled = true;
          inputOutroLocal.value = null;
        }
      });
    });

    const outrosFocosCheckbox = document.getElementById("outros");
    const inputOutrosFocos = document.getElementById("outros_focos");
    outrosFocosCheckbox.addEventListener("change", function () {
      if (this.checked) {
        inputOutrosFocos.disabled = false;
      } else {
        inputOutrosFocos.disabled = true;
        inputOutrosFocos.value = null;
      }
    });

    const estadoSelect = document.getElementById("estado");
    const cidadeInput = document.getElementById("cidade");
    
    estadoSelect.addEventListener("change", async function() {
      const estado = this.value;
      cidadeInput.value = "";
      citiesList = [];
      
      if (estado === "escolher_opcao") {
        return;
      }
      
      const url = BRAZIL_REGIONS_GEOJSON[estado];
      try {
        const response = await fetch(url);
        const geojson = await response.json();
        citiesList = geojson.features.map(f => f.properties.name).sort();
        autocomplete(cidadeInput, citiesList);
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    });
  }
});

function clearFields() {
  document.getElementById("estado").value = "escolher_opcao";
  document.getElementById("cidade").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("outro_local").value = "";
  document.getElementById("outros_focos").value = "";
  document
    .querySelectorAll('input[name="local"]:checked')
    .forEach(function (checkbox) {
      checkbox.checked = false;
    });
  document
    .querySelectorAll('input[name="tipo_foco"]:checked')
    .forEach(function (checkbox) {
      checkbox.checked = false;
    });
}

async function createDengueFocus(focusInformation) {
  let apiUrl;
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });
  
  try {
    const response = await fetch(`${apiUrl}/denuncias-focos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(focusInformation),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showModalSuccess();
    clearFields();
    window.location.href = '../listagemDenunciasFocos/denuncias-focos.html';
  } catch (error) {
    console.error('Error creating denuncia:', error);
    showModalError("Erro ao cadastrar denúncia. Por favor, tente novamente.");
  }
}

async function updateDengueFocus(focusInformation, id) {
  let apiUrl;
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });
  
  try {
    focusInformation.data_registro = new Date().toISOString().split("T")[0];
    
    const response = await fetch(`${apiUrl}/denuncias-focos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(focusInformation),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showModalSuccess();
    clearFields();
    localStorage.removeItem('editDenuncia');
    localStorage.removeItem('editingDenunciaId');
    window.location.href = '../listagemDenunciasFocos/denuncias-focos.html';
  } catch (error) {
    console.error('Error updating denuncia:', error);
    showModalError("Erro ao atualizar denúncia. Por favor, tente novamente.");
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const loggedWith = localStorage.getItem("loggedWith");
  if (!loggedWith) return;

  const estado = document.getElementById("estado").value;
  if (estado === "escolher_opcao") {
    showModalError("Escolha um estado.");
    return;
  }

  let localSelecionado = "";
  const checkboxLocal = document.querySelectorAll(
    'input[name="local"]:checked'
  );
  if (!checkboxLocal.length) {
    showModalError(
      "É necessário informar que tipo de local foi encontrado foco de denge."
    );
    return;
  }

  if (checkboxLocal[0].value === 'outro') {
    const inputOutroLocal = document.getElementById("outro_local");
    if (inputOutroLocal.value) {
      localSelecionado = inputOutroLocal.value;
    } else {
      showModalError(
        "É necessário informar que tipo de OUTRO local foi encontrado foco de denge."
      );
      return;
    }
  } else {
    localSelecionado = checkboxLocal[0].value;
  }

  let tiposSelecionados = [];
  const checkboxesTipos = document.querySelectorAll(
    'input[name="tipo_foco"]:checked'
  );
  if (!checkboxesTipos.length) {
    showModalError("É necessário informar o(s) lugar(es) com foco de dengue.");
    return;
  }
  checkboxesTipos.forEach(function (checkbox) {
    if (checkbox.value == 'outros') {
      const inputOutrosFocos = document.getElementById("outros_focos");
      if (inputOutrosFocos.value) {
        tiposSelecionados.push(inputOutrosFocos.value);
      } else {
        showModalError(
          "É necessário informar quais OUTROS lugares foram encontrados com foco de denge."
        );
        return;
      }
    } else {
      tiposSelecionados.push(checkbox.value);
    }
  });

  const dados = {
    email_usuario: loggedWith,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado,
    local: localSelecionado,
    tipo: tiposSelecionados,
  };

  const editingId = localStorage.getItem('editingDenunciaId');
  if (editingId) {
    updateDengueFocus(dados, editingId);
  } else {
    dados.data_registro = new Date().toISOString().split("T")[0];
    createDengueFocus(dados);
  }

  return false;
}

//MODAL DE SUCESSO E ERRO
let modalSuccess = document.getElementById("focus-form-modal-success");
let modalError = document.getElementById("focus-form-modal-error");

let closeModalSuccess = document.getElementById("close-modal-success");
let closeModalError = document.getElementById("close-modal-error");

closeModalSuccess.onclick = function () {
  modalSuccess.style.display = "none";
};

closeModalError.onclick = function () {
  modalError.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modalSuccess) {
    modalSuccess.style.display = "none";
  }
  if (event.target == modalError) {
    modalError.style.display = "none";
  }
};

const showModalSuccess = () => {
  modalSuccess.style.display = "block";
};

const showModalError = (motivo) => {
  modalError.style.display = "block";
  document.getElementById("dynamic-text").textContent = motivo;
};

const BRAZIL_REGIONS_GEOJSON = {
  AC: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-12-mun.json',
  AM: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-13-mun.json',
  AP: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-16-mun.json',
  PA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-15-mun.json',
  RO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-11-mun.json',
  RR: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-14-mun.json',
  TO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-17-mun.json',
  AL: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-27-mun.json',
  BA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-29-mun.json',
  CE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-23-mun.json',
  MA: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-21-mun.json',
  PB: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-25-mun.json',
  PE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-26-mun.json',
  PI: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-22-mun.json',
  RN: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json',
  SE: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-28-mun.json',
  ES: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-32-mun.json',
  MG: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-31-mun.json',
  RJ: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-33-mun.json',
  SP: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-35-mun.json',
  PR: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-41-mun.json',
  RS: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-43-mun.json',
  SC: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-42-mun.json',
  DF: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-53-mun.json',
  GO: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-52-mun.json',
  MT: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-51-mun.json',
  MS: 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-50-mun.json',
};

let citiesList = [];

function autocomplete(input, cities) {
  let currentFocus;
  
  input.addEventListener("input", function(e) {
    let val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    
    let a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    
    cities.forEach(city => {
      if (city.toLowerCase().includes(val.toLowerCase())) {
        let b = document.createElement("DIV");
        b.innerHTML = city;
        b.addEventListener("click", function(e) {
          input.value = this.innerHTML;
          closeAllLists();
        });
        a.appendChild(b);
      }
    });
  });
  
  input.addEventListener("keydown", function(e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) { // arrow DOWN
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { // arrow UP
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) { // ENTER
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  
  function closeAllLists(elmnt) {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}