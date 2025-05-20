import HashPasswordManager from '../authService/hashPasswordManager.mjs';
import JwtGenerator from '../authService/JWT/JwtGenerator.mjs';
import JwtVerifier from '../authService/JWT/JwtVerifier.mjs';
import JwtBase64Manager from '../authService/JWT/JwtBase64Manager.mjs';
import UserRepository from '../db/repositories/userRepository.mjs';

class LoginManager {
  constructor() {
    this.HashPasswordManager = new HashPasswordManager();
    this.JwtGenerator = new JwtGenerator();
    this.JwtVerifier = new JwtVerifier();
    this.JwtBase64Manager = new JwtBase64Manager();
    this.UserRepository = new UserRepository();
  }

  /**
   * Realiza o login de um usuário.
   * 
   * @param {string} username - Email do usuário.
   * @param {string} password - Senha do usuário.
   * @returns {Object} Objeto contendo o token JWT e informações de expiração.
   * @throws {Error} Se o usuário não for encontrado ou a senha estiver incorreta.
   */
  async makeLogin(username, password) {
    const userData = await this.UserRepository.getUserByEmail(username);
    if (!userData) {
      throw new Error('Usuário não encontrado');
    }
    const [storedSalt, storedHash] = userData.hashedPassword.split(':')
    const hashedPassword = await this.HashPasswordManager.makeHash(password, storedSalt);
    
    if (hashedPassword !== userData.hashedPassword) {
      throw new Error('Senha incorreta');
    }
    
    const expires = { exp: 7200, nbf: 0, iat: 0 };
    const token = await this.JwtGenerator.createToken({ data: userData }, expires);
    await this.updatePublicKey(userData.id, token.exportedKeys.publicKey)
    return {token, expires}
  }

  /**
   * Atualiza a chave pública do usuário.
   * 
   * @param {string} userId - ID do usuário.
   * @param {string} publicKey - Chave pública do usuário.
   * @returns {Promise} Promessa que representa a conclusão da atualização dos dados do usuário.
   */
  async updatePublicKey(userId, publicKey) {
    const encodedPublicKey = this.JwtBase64Manager.arrayBufferToBase64(this.JwtBase64Manager.stringToUint8Array(publicKey));
    return await this.UserRepository.updateUserData(userId, {"keys": {"publicKey": encodedPublicKey}});
  } 
}

export default LoginManager;

