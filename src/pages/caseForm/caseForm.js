//Define data máxima para o calendário dos inputs de Início dos Sintomas e Data de Nascimento
const hoje = new Date().toISOString().split("T")[0];
document.getElementById("data_sintomas").setAttribute("max", hoje);
document.getElementById("data_nascimento").setAttribute("max", hoje);

//Funcionalidade de autocompletar o campo de Cidades com cidades de MG fornecidas pela API do IBGE
function autocomplete(input, options) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  input.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < options.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (options[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML =
          "<strong>" + options[i].substr(0, val.length) + "</strong>";
        b.innerHTML += options[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + options[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          input.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  input.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != input) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const cidadesMG = new Array();
fetch(
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios?orderBy=nome&view=nivelado"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao buscar os municípios de MG");
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((cidade) => cidadesMG.push(cidade["municipio-nome"]));
    autocomplete(document.getElementById("cidade"), cidadesMG);
  });

//CADASTRAR CASO DE DENGUE
function clearFields() {
  document.getElementById("nome").value = "";
  document.getElementById("data_nascimento").value = "";
  document.getElementById("genero").value = "escolher_opcao";
  document.getElementById("estado").value = "escolher_opcao";
  document.getElementById("data_sintomas").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("checkbox-case-yourself").checked = false;
  document.getElementById("checkbox-health-unit").checked = false;
  document
    .querySelectorAll('input[name="sintomas"]:checked')
    .forEach(function (checkbox) {
      checkbox.checked = false;
    });
}

function validateDatas(dtNascimento, dtSintomas) {
  let isValid = true;
  const nasc = new Date(dtNascimento);
  const sintomas = new Date(dtSintomas);

  if (nasc > sintomas) {
    isValid = false;
  }
  return isValid;
}

function validateCidade(cidadeInformada) {
  let isValid = false;
  cidadesMG.forEach((cidade) => {
    if (cidadeInformada == cidade.toLowerCase()) {
      isValid = true;
      return;
    }
  });
  return isValid;
}

async function createDengueCase(caseInformation) {
  let apiUrl;
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });
  fetch(`${apiUrl}/denuncias-casos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caseInformation),
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

  const dtNascimento = document.getElementById("data_nascimento").value;
  const dtSintomas = document.getElementById("data_sintomas").value;

  if (!validateDatas(dtNascimento, dtSintomas)) {
    showModalError(
      "Data de nascimento não pode ser antes da data de início de sintomas."
    );
    return;
  }

  let sintomasSelecionados = [];
  const checkboxesSintomas = document.querySelectorAll(
    'input[name="sintomas"]:checked'
  );
  if (!checkboxesSintomas.length) {
    showModalError("É necessário informar o(s) sintoma(s).");
    return;
  }
  checkboxesSintomas.forEach(function (checkbox) {
    sintomasSelecionados.push(checkbox.value);
  });

  const cidade = document.getElementById("cidade").value;
  if (!validateCidade(cidade.trim().toLowerCase())) {
    showModalError(
      "Cidade inválida. Por favor, escolher uma das opções apresentadas."
    );
    return;
  }

  const genero = document.getElementById("genero").value;
  if (genero === "escolher_opcao") {
    showModalError(
      "Escolha uma opção de gênero ou selecione Prefiro não informar."
    );
    return;
  }

  const estado = document.getElementById("estado").value;
  if (estado === "escolher_opcao") {
    showModalError("Escolha um estado.");
    return;
  }

  const today = new Date();
  const parsedToday = today.toISOString().split('T')[0];

  const dados = {
    data_registro: parsedToday,
    nome: document.getElementById("nome").value,
    data_nascimento: dtNascimento,
    genero,
    data_sintomas: dtSintomas,
    cidade,
    estado,
    autorregistro: document.getElementById("checkbox-case-yourself").checked,
    atendido_em_posto: document.getElementById("checkbox-health-unit").checked,
    sintomas: sintomasSelecionados,
  };

  createDengueCase(dados);
  return false;
}

//MODAL DE SUCESSO E ERRO
let modalSuccess = document.getElementById("case-form-modal-success");
let modalError = document.getElementById("case-form-modal-error");

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
