// Define o valor mínimo do campo de data para amanhã
function getTomorrowDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Formata o campo CEP e busca o endereço automaticamente
const handleZipCode = async (event) => {
  let input = event.target;
  input.value = zipCodeMask(input.value);

  const cep = input.value.replace(/\D/g, "");
  if (cep.length === 8) {
    const enderecoInput = document.getElementById("endereco");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data && !data.erro) {
        enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const zipCodeMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
};

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("data_visita");
  input.min = getTomorrowDate();
  document.getElementById("cep").addEventListener("keyup", handleZipCode);

  // Verifica se está em modo de edição
  const editDataString = localStorage.getItem("editVisitData");
  if (editDataString) {
    const visitData = JSON.parse(editDataString);
    
    document.querySelector('.header-visita h1').textContent = 'Editar Solicitação de Visita';
    document.querySelector('.submit-button').textContent = 'Atualizar Solicitação';

    document.getElementById('data_visita').value = visitData.data_visita;
    document.getElementById('turno').value = visitData.turno;
    document.getElementById('motivo').value = visitData.motivo;
    document.getElementById('cep').value = zipCodeMask(visitData.cep);
    document.getElementById('endereco').value = visitData.endereco;
    
    localStorage.setItem('editingVisitId', visitData.id);
    localStorage.removeItem('editVisitData');
  }
});

async function handleSubmit(event) {
  event.preventDefault();
  const loggedWith = localStorage.getItem("loggedWith");
  if (!loggedWith) return;

  const dtVisita = document.getElementById("data_visita").value;
  const turno = document.getElementById("turno").value;
  const motivo = document.getElementById("motivo").value;
  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco").value;

  if (turno === "escolher_opcao") {
    showModalError("Escolha um turno para visita.");
    return;
  }

  if (!motivo.trim()) {
    showModalError("Explique o motivo da solicitação de visita.");
    return;
  }

  const isValidCep = await validateCep(cep);
  if (!isValidCep) {
    showModalError("Erro ao validar CEP. Verifique se ele está correto.");
    return;
  }

  if (!endereco.trim()) {
    showModalError("Informe o endereço completo.");
    return;
  }

  const today = new Date();
  const parsedToday = today.toISOString().split("T")[0];

  const dados = {
    data_registro: parsedToday,
    user: loggedWith,
    data_visita: dtVisita,
    turno,
    motivo,
    cep,
    endereco,
    status: "EM_ABERTO",
  };

  // Verifica se está editando ou criando
  const editingId = localStorage.getItem('editingVisitId');
  if (editingId) {
    updateSolicitacaoVisita(dados, editingId);
  } else {
    createSolicitacaoVisita(dados);
  }
}

async function createSolicitacaoVisita(dados) {
  let apiUrl;
  const env = await (await fetch("../../config.json")).json();
  apiUrl = env.API_URL;

  await fetch(`${apiUrl}/solicitacao-visita/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then(async (res) => {
      const responseData = await res.json();
      salvarLocalmente(dados);
      showModalSuccess();
      clearFields();
    })
    .catch(() => {
      showModalError("Erro ao solicitar visita. Tente novamente mais tarde.");
    });
}

async function updateSolicitacaoVisita(dados, id) {
  let apiUrl;
  try {
    const env = await (await fetch("../../config.json")).json();
    apiUrl = env.API_URL;
  } catch (e) {
    apiUrl = 'http://localhost:3000';
  }

  delete dados.status; 
  delete dados.data_registro;

  await fetch(`${apiUrl}/solicitacao-visita/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Falha ao atualizar');
      showModalSuccess("Visita atualizada com sucesso!");
      localStorage.removeItem('editingVisitId');
      setTimeout(() => {
         window.location.href = '../solicitacoesVisita/solicitacoesVisita.html';
      }, 1500);
    })
    .catch(() => {
      showModalError("Erro ao atualizar visita. Tente novamente mais tarde.");
    });
}

function salvarLocalmente(dados) {
  const visitas = JSON.parse(localStorage.getItem("visitas")) || [];

  visitas.push({
    data: dados.data_visita,
    endereco: dados.endereco,
    solicitante: dados.user,
    motivo: dados.motivo,
    status: dados.status,
  });

  localStorage.setItem("visitas", JSON.stringify(visitas));
}

function clearFields() {
  document.getElementById("data_visita").value = "";
  document.getElementById("turno").value = "escolher_opcao";
  document.getElementById("motivo").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("endereco").value = "";
}

const validateCep = async (cep) => {
  let isValid = true;
  const numericCep = cep.replace(/\D/g, "");
  if (numericCep.length === 8) {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${numericCep}/json/`
      );
      if (!response.ok) {
        isValid = false;
      }

      const data = await response.json();
      if (data.erro) {
        isValid = false;
      }
    } catch {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
};

// MODAL DE SUCESSO E ERRO
let modalSuccess = document.getElementById("solicitar-visita-modal-success");
let modalError = document.getElementById("solicitar-visita-modal-error");

let closeModalSuccess = document.getElementById("close-modal-success");
let closeModalError = document.getElementById("close-modal-error");

closeModalSuccess.onclick = function () {
  modalSuccess.style.display = "none";
};

closeModalError.onclick = function () {
  modalError.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modalSuccess) modalSuccess.style.display = "none";
  if (event.target == modalError) modalError.style.display = "none";
};

const showModalSuccess = () => {
  modalSuccess.style.display = "block";
};

const showModalError = (motivo) => {
  modalError.style.display = "block";
  document.getElementById("dynamic-text").textContent = motivo;
};
