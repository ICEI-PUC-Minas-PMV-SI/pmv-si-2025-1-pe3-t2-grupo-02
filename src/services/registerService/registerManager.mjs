import HashPasswordManager from '../authService/hashPasswordManager.mjs';
import UserRepository from '../db/repositories/userRepository.mjs';
import LoginManager from '../loginService/loginManager.mjs';

class RegisterManager {
  constructor() {
    this.HashPasswordManager = new HashPasswordManager();
    this.UserRepository = new UserRepository();
    this.LoginManager = new LoginManager();
  }

  /**
   * Registra um novo usuário após validar e processar os dados fornecidos.
   * 
   * @param {Object} userData - Dados do usuário para registro.
   * @param {string} userData.userName - Nome do usuário.
   * @param {string} userData.userNascentDate - Data de nascimento do usuário.
   * @param {string} userData.userGender - Gênero do usuário.
   * @param {string} userData.userEmail - Email do usuário.
   * @param {string} userData.userConfirmationEmail - Email de confirmação do usuário.
   * @param {string} userData.userPassword - Senha do usuário.
   * @param {string} userData.userRole - Papel do usuário USUARIO_COMUM | AGENTE_SAUDE.
   * @param {string} userData.userCnes- Número da CNES.
   * @returns {Object} Dados do usuário registrado.
   */
  async makeRegister(userData) {
    const requiredFields = [
      'userName',
      'userNascentDate',
      'userGender',
      'userEmail',
      'userConfirmationEmail',
      'userPassword',
      'userConfirmationPassword'
    ];
    await this.validateRequiredFields(userData, requiredFields);
    await this.validateEmailMatch(userData.userEmail, userData.userConfirmationEmail);
    await this.validatePasswordMatch(userData.userPassword, userData.userConfirmationPassword);
    await this.validateBirthDate(userData.userNascentDate);

    const saltUserPassword = this.HashPasswordManager.generateSalt();
    const hashedWithSaltPassword = await this.HashPasswordManager.makeHash(userData.userPassword, saltUserPassword);
    
    const userDataToRegister = {
      id: await this.generateUUID(),
      userName: userData.userName,
      userNascentDate: new Date(userData.userNascentDate),
      userGender: userData.userGender,
      userRole: userData.userRole || 'USUARIO_COMUM',
      userCnes: userData.userCnes || '',
      userEmail: userData.userEmail,
      hashedPassword: hashedWithSaltPassword,
      keys: {publicKey: ''}
    }
    await this.UserRepository.setNewUser(userDataToRegister);
    return userDataToRegister;
  }

  /**
   * Valida se todos os campos obrigatórios estão preenchidos.
   * 
   * @param {Object} userData - Dados do usuário.
   * @param {Array<string>} requiredFields - Lista de campos obrigatórios.
   * @throws {Error} Se algum campo obrigatório estiver faltando.
   */
  async validateRequiredFields(userData, requiredFields) {
    requiredFields.forEach(field => {
      if (!userData[field]) {
        alert(`Por favor, informe corretamente o valor de ${field}.\n`);
        throw new Error(`Por favor, informe corretamente o valor de ${field}.\n`);
      }
    });
  }

  /**
   * Valida se os emails correspondem.
   * 
   * @param {string} email - Email do usuário.
   * @param {string} confirmationEmail - Email de confirmação do usuário.
   * @throws {Error} Se os emails não corresponderem.
   */
  async validateEmailMatch(email, confirmationEmail) {
    if (email !== confirmationEmail) {
      alert('Os emails não conferem, por favor, tente novamente.');
      throw new Error('Os emails não conferem, por favor, tente novamente.');
    }
  }

  /**
   * Valida se as senhas correspondem.
   * 
   * @param {string} password - Senha do usuário.
   * @param {string} confirmationPassword - Senha de confirmação do usuário.
   * @throws {Error} Se as senhas não corresponderem.
   */
  async validatePasswordMatch(password, confirmationPassword) {
    if (password !== confirmationPassword) {
      alert('As senhas não conferem, por favor, tente novamente.');
      throw new Error('As senhas não conferem, por favor, tente novamente.');
    }
  }

  /**
   * Valida a data de nascimento do usuário.
   * 
   * @param {string} birthDate - Data de nascimento do usuário.
   * @throws {Error} Se a data de nascimento for inválida.
   */
  async validateBirthDate(birthDate) {
    const userBirthDate = new Date(birthDate);
    const minDate = new Date(1920, 1, 1);  
    const currentDate = new Date();
    if (userBirthDate >= currentDate || userBirthDate < minDate) {
      alert('Data de nascimento inválida.');
      throw new Error('Data de nascimento inválida.');
    }
  }

  /**
   * Gera um UUID (Universally Unique Identifier) para identificar o usuário.
   * 
   * @returns {string} UUID gerado.
   */
  async generateUUID() {
    function randomHex(size) {
      return Array.from(crypto.getRandomValues(new Uint8Array(size)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    const hexSegments = [
      randomHex(4), 
      randomHex(2), 
      '4' + randomHex(1).substring(0, 3), 
      (8 + (Math.random() * 4) >>> 0).toString(16) + randomHex(1).substring(0, 3), 
      randomHex(6) 
    ];
    return `${hexSegments[0].substring(0, 8)}-${hexSegments[1].substring(0, 4)}-${hexSegments[2]}-${hexSegments[3]}-${hexSegments[4]}`;
  }
}


export default RegisterManager;

