
class HashPasswordManager {
  constructor() {
    this.saltLength = 16;
    this.iterations = 10000;
  }

  /**
   * Gera um hash para a senha fornecida com um salt.
   * @param {string} password - A senha a ser hashada.
   * @param {string} salt - O salt a ser usado.
   * @returns {Promise<string>} - O hash gerado no formato `salt:hash`.
   */
  async makeHash(password, salt) {
    const hash = await this.hashWithSaltAndStretching(password, salt);
    return `${salt}:${hash}`;
  }

  /**
   * Gera um hash para a senha fornecida, utilizando um salt e várias iterações de hashing.
   * @param {string} password - A senha a ser hashada.
   * @param {string} salt - O salt a ser usado.
   * @returns {Promise<string>} - O hash gerado.
   */
  async hashWithSaltAndStretching(password, salt) {
    let hash = password;
    for (let i = 0; i < this.iterations; i++) {
      hash = await this.sha256(hash + salt);
    }
    return hash;
  }

  /**
   * Compara uma senha fornecida com um hash armazenado.
   * @param {string} password - A senha a ser comparada.
   * @param {string} storedHash - O hash armazenado no formato `salt:hash`.
   * @returns {Promise<boolean>} - Verdadeiro se a senha corresponder ao hash armazenado, falso caso contrário.
   */
  async compareHash(password, storedHash) {
    const [salt, originalHash] = storedHash.split(':');
    const inputHash = await this.hashWithSaltAndStretching(password, salt);
    return inputHash === originalHash;
  }

  /**
   * Gera um hash SHA-256 para a mensagem fornecida.
   * @param {string} message - A mensagem a ser hashada.
   * @returns {Promise<string>} - O hash SHA-256 gerado.
   */
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  }

  /**
   * Gera um salt aleatório.
   * @returns {string} - O salt gerado em formato hexadecimal.
   */
  generateSalt() {
    const randomBytes = new Uint8Array(this.saltLength);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(byte => ('00' + byte.toString(16)).slice(-2))
      .join('');
  }
}

export default HashPasswordManager;
