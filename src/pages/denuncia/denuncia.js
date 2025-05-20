document.addEventListener("DOMContentLoaded", () => {
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
  fetch(`${apiUrl}/denuncias-focos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(focusInformation),
  }).then((res) => {
    console.log(res.json());
    showModalSuccess();
    clearFields();
  });
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

  const today = new Date();
  const parsedToday = today.toISOString().split("T")[0];

  const dados = {
    data_registro: parsedToday,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado,
    local: localSelecionado,
    tipo: tiposSelecionados,
  };
  createDengueFocus(dados);

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