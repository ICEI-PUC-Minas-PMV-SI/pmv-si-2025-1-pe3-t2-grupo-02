
import recoverPasswordManager from '../../services/recoverPasswordService/recoverPasswordManager.mjs'

const sendPasswordManager = new recoverPasswordManager();

const form = document.getElementById('sendRecoverPassword');
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const mail = document.getElementById('email').value;
  await sendPasswordManager.sendRecoveryPassword(mail);
});  