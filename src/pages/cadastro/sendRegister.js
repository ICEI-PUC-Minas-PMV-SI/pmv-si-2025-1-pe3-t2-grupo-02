import RegisterManager from "../../services/registerService/registerManager.mjs";

const checkboxHealthAgent = document.getElementById("checkbox-health-agent");
const cnesInput = document.getElementById("cnes");

function toggleCnesInput() {
  if (checkboxHealthAgent.checked) {
    cnesInput.disabled = false;
    cnesInput.setAttribute("required", "required");
    cnesInput.setAttribute("title", "Até 8 dígitos")
  } else {
    cnesInput.disabled = true;
    cnesInput.removeAttribute("required");
    cnesInput.setAttribute("title", "Selecione a opção 'Sou Agente de Saúde' para preencher este campo");
    cnesInput.value = "";
  }
}

// Executa ao carregar a página e ao alterar o checkbox
checkboxHealthAgent.addEventListener("change", toggleCnesInput);
window.addEventListener("DOMContentLoaded", toggleCnesInput);
cnesInput.addEventListener("input", () => {
  cnesInput.value = cnesInput.value.replace(/\D/g, "").slice(0, 8);
});

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

  try {
    const registerData = await sendRegister.makeRegister({
      userName: userName,
      userNascentDate: userNascentDate,
      userGender: userGender,
      userEmail: userEmail,
      userConfirmationEmail: userConfirmationEmail,
      userPassword: userPassword,
      userConfirmationPassword: userConfirmationPassword,
    });
    window.location.href = "../login/login.html";
    alert("Cadastro realizado com sucesso!\nVocê já pode fazer login");
  } catch (error) {
    console.log(error);
    alert(
      "Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente."
    );
  }
});
