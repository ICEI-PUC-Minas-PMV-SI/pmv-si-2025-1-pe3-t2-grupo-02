import RegisterManager from "../../services/registerService/registerManager.mjs";

// MODAL DE SUCESSO E ERRO
let modalSuccess = document.getElementById("new-user-modal-success");
let modalError = document.getElementById("new-user-modal-error");

let closeModalSuccess = document.getElementById("close-modal-success");
let closeModalError = document.getElementById("close-modal-error");

if (closeModalSuccess && modalSuccess) {
  closeModalSuccess.onclick = function () {
    modalSuccess.style.display = "none";
  };
}

if (closeModalError && modalError) {
  closeModalError.onclick = function () {
    modalError.style.display = "none";
  };
}

window.addEventListener = (event) => {
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

// HABILITAÇÃO DO CAMPO CNES
const checkboxHealthAgent = document.getElementById("checkbox-health-agent");
const cnesInput = document.getElementById("cnes");

function toggleCnesInput() {
  if (checkboxHealthAgent.checked) {
    cnesInput.disabled = false;
    cnesInput.setAttribute("required", "required");
    cnesInput.setAttribute("title", "Até 8 dígitos");
  } else {
    cnesInput.disabled = true;
    cnesInput.removeAttribute("required");
    cnesInput.setAttribute(
      "title",
      "Selecione a opção 'Sou Agente de Saúde' para preencher este campo"
    );
    cnesInput.value = "";
  }
}

checkboxHealthAgent.addEventListener("change", toggleCnesInput);
window.addEventListener("DOMContentLoaded", toggleCnesInput);
cnesInput.addEventListener("input", () => {
  cnesInput.value = cnesInput.value.replace(/\D/g, "").slice(0, 8);
});

const validateCnes = async (cnes) => {
  let isValid = true;
  const numericCnes = cnes.replace(/\D/g, "");

  try {
    const response = await fetch(
      `https://corsproxy.io/?url=https://apidadosabertos.saude.gov.br/cnes/estabelecimentos/${numericCnes}`
    );
    if (!response.ok) {
      isValid = false;
    }
  } catch {
    isValid = false;
  }

  return isValid;
};

const form = document.getElementById("registrationForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const sendRegister = new RegisterManager();
  const userName = document.getElementById("userName").value;
  const userNascentDate = document.getElementById("userNascentDate").value;
  const userGender =
    document.getElementById("userGender").value || "Prefiro não informar";
  const userEmail = document.getElementById("userEmail").value;
  const userConfirmationEmail = document.getElementById(
    "userConfirmationEmail"
  ).value;
  const userPassword = document.getElementById("userPassword").value;
  const userConfirmationPassword = document.getElementById(
    "userConfirmationPassword"
  ).value;
  const isHealthAgent = checkboxHealthAgent.checked;
  if (isHealthAgent) {
    const isValidCnes = await validateCnes(cnesInput.value);
    if (!isValidCnes) {
      showModalError("Não conseguimos validar seu CNES. Por favor, verifique e tente novamente.");
      return;
    }
  }

  try {
    const response = await sendRegister.makeRegister({
      userName: userName,
      userNascentDate: userNascentDate,
      userGender: userGender,
      userEmail: userEmail,
      userConfirmationEmail: userConfirmationEmail,
      userPassword: userPassword,
      userConfirmationPassword: userConfirmationPassword,
      userRole: isHealthAgent ? "AGENTE_SAUDE" : "USUARIO_COMUM",
      userCnes: isHealthAgent ? cnesInput.value : ""
    });
    window.location.href = "../login/login.html";
    showModalSuccess();
  } catch (error) {
    console.log(error);
    showModalError(
      "Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente."
    );
  }
});
