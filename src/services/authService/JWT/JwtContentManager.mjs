import JwtBase64Manager from "./JwtBase64Manager.mjs";

class JwtContentManager {
  constructor() {
    this.JwtBase64Manager = new JwtBase64Manager();
  }

  /**
   * Cria um identificador único para o token (JTI).
   * @returns {Promise<string>} - JTI gerado.
   */
  async createJti() {
    const buf = this.JwtBase64Manager.generateRandomValues(16);
    return this.JwtBase64Manager.arrayBufferToBase64(buf);
  }

  /**
   * Codifica o conteúdo do token em Base64Url.
   * @param {Object|string} stringContent - Conteúdo a ser codificado.
   * @returns {Promise<string>} - Conteúdo codificado.
   */
  async encodeTokenContent(stringContent) {
    const stringifiedContent = JSON.stringify(stringContent);
    return this.JwtBase64Manager.uint8ArrayToString(this.JwtBase64Manager.stringToUint8Array(stringifiedContent));
  }

  /**
   * Decodifica o conteúdo do token de Base64Url para objeto.
   * @param {string} encodedContent - Conteúdo codificado.
   * @returns {Promise<Object>} - Conteúdo decodificado.
   */
  async decodeTokenContent(encodedContent) {
    return this.JwtBase64Manager.decodeBase64Url(encodedContent);
  }
  
}

export default JwtContentManager;
