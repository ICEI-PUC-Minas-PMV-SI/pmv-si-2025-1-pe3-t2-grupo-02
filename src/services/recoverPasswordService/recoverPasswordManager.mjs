import UserRepository from "../../services/db/repositories/userRepository.mjs";
import HashPasswordManager from '../authService/hashPasswordManager.mjs';

/**
 * Classe responsável por gerenciar a recuperação de senha dos usuários.
 */
class recoverPasswordManager {
  /**
   * Construtor da classe.
   * Aqui, as classes UserRepository e HashPasswordManager são 
   * instanciadas, de modo que ficam acessíveis a todos os 
   * métodos desta classe com this.UserRepository<metodo_desejado> e 
   * HashPasswordManager<metodo_desejado>.
   */
  constructor() {
    this.UserRepository = new UserRepository();
    this.HashPasswordManager = new HashPasswordManager();
  }
  
  /**
   * Envia um email para o usuário com uma senha temporária 
   * para recuperação de senha.
   * @param {string} userEmail - O email do usuário que solicitou
   * a recuperação de senha.
   */
  async sendRecoveryPassword(userEmail) {
    const userData = await this.checkMail(userEmail)
    if (!userData) {
      alert("Erro! Verifique se preencheu o campo de email ou se o email está registrado.");
      return;
    }

    const randomPassword = this.generateRandomPassword()
    const salt = this.HashPasswordManager.generateSalt()
    const hashedPassword = await this.HashPasswordManager.makeHash(randomPassword, salt)
    await this.UserRepository.updateUserData(userData.id, { "hashedPassword":  hashedPassword})
    this.sendMail(userData.userEmail, randomPassword)
  }

  /**
   * Verifica se o email está registrado no sistema.
   * @param {string} mail - O email a ser verificado.
   * @returns {Object|boolean} - Retorna os dados do usuário se o email estiver registrado, caso contrário retorna false.
   */
  async checkMail(mail) {
    const userData = await this.UserRepository.getUserByEmail(mail)
    return false ? userData.userEmail !== mail : userData;  
  }
  
  /**
   * Envia um email contendo a senha temporária para o usuário.
   * @param {string} mail - O email do usuário que irá receber a senha temporária.
   */
  sendMail(mail, randomPassword) {
    const serviceID = "service_b746bnr";
    const templateID = "template_m0s04qo";

    var templateParams = {
        addressee: mail,
        message: randomPassword,
        reply_to: "denguestatus@gmail.com"
    }

    emailjs.send(serviceID, templateID, templateParams)
    .then(
        res => {
            document.getElementById('email').value = "";
            alert("Email enviado com sucesso!");
            console.log(res)
        }
    ) 
  }
 
  /**
   * Gera uma senha temporária aleatória.
   * @returns {string} - Retorna uma senha aleatória de 6 caracteres.
   */
  generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }
}

export default recoverPasswordManager;