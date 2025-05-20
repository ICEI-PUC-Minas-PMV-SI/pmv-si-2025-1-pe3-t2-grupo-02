import RegisterManager from '../../services/registerService/registerManager.mjs';

const form = document.getElementById('registrationForm');

form.addEventListener('submit', async function(event) {
  event.preventDefault(); 
  const sendRegister              = new RegisterManager();
  const userName                  = document.getElementById('userName').value;
  const userNascentDate           = document.getElementById('userNascentDate').value;
  const userGender                = document.getElementById('userGender').value || 'Prefiro não informar';
  const userEmail                 = document.getElementById('userEmail').value;
  const userConfirmationEmail     = document.getElementById('userConfirmationEmail').value;
  const userPassword              = document.getElementById('userPassword').value;
  const userConfirmationPassword  = document.getElementById('userConfirmationPassword').value;

  try {
    const registerData = await sendRegister.makeRegister({ 
      userName:                   userName, 
      userNascentDate:            userNascentDate, 
      userGender:                 userGender, 
      userEmail:                  userEmail, 
      userConfirmationEmail:      userConfirmationEmail, 
      userPassword:               userPassword,
      userConfirmationPassword:   userConfirmationPassword
    }); 
    window.location.href = '../login/login.html';
    alert('Cadastro realizado com sucesso!\nVocê já pode fazer login');
  } catch (error) {
    console.log(error);
    alert('Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente.');
  }
}) 

