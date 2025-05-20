import LoginManager from '../../services/loginService/loginManager.mjs';
import CookieService from '../../services/cookieService/cookieService.mjs';

const form = document.getElementById('loginForm');

form.addEventListener('submit', async function(event) {
  event.preventDefault(); 

  const sendLogin = new LoginManager();
  const cookieService = new CookieService();

  const username = document.getElementById('email').value;
  const password = document.getElementById('senha').value;
  try {
    const credentials = await sendLogin.makeLogin(username, password);
    cookieService.setCookie("jwt", credentials.token.token, credentials.expires.exp);

    window.location.pathname = '/';
    localStorage.setItem('loggedWith', username);
  } catch (error) {
    console.log(error);
  }
});
