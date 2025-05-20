
class JwtRsaKeyManager {
  constructor() {}

  /**
   * Codifica uma mensagem em bytes.
   * @param {string} message - Mensagem a ser codificada.
   * @returns {Uint8Array} - Mensagem codificada.
   */
  getMessageEncoding(message) {
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /**
   * Assina uma mensagem com uma chave privada.
   * @param {CryptoKey} privateKey - Chave privada.
   * @param {Uint8Array} encodedMessage - Mensagem codificada.
   * @returns {Promise<ArrayBuffer>} - Assinatura da mensagem.
   */
  async signMessage(privateKey, encodedMessage) {
    return await crypto.subtle.sign(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
      privateKey,
      encodedMessage
    );
  }

  /**
   * Verifica uma assinatura com a chave pública.
   * @param {CryptoKey} publicKey - Chave pública.
   * @param {ArrayBuffer} sign - Assinatura.
   * @param {Uint8Array} message - Mensagem codificada.
   * @returns {Promise<boolean>} - Resultado da verificação.
   */
  async verifyMessage(publicKey, sign, message) {
    return await crypto.subtle.verify(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
      publicKey,
      sign,
      message
    );
  }

  /**
   * Gera um par de chaves RSA.
   * @returns {Promise<Object>} - Par de chaves (pública e privada).
   */
  async generateKeyPair() {
    return await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
  }

  /**
   * Converte um ArrayBuffer para string.
   * @param {ArrayBuffer} buf - Buffer de bytes.
   * @returns {string} - String convertida.
   */
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  /**
   * Exporta uma chave privada em formato PEM.
   * @param {CryptoKey} key - Chave privada.
   * @returns {Promise<string>} - Chave privada em formato PEM.
   */
  async exportCryptoPrivateKey(key) {
    const exported = await crypto.subtle.exportKey("pkcs8", key);
    const exportedAsString = this.ab2str(exported);
    const exportedAsBase64 = btoa(exportedAsString);
    return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  }

  /**
   * Exporta uma chave pública em formato PEM.
   * @param {CryptoKey} key - Chave pública.
   * @returns {Promise<string>} - Chave pública em formato PEM.
   */
  async exportCryptoPublicKey(key) {
    const exported = await crypto.subtle.exportKey("spki", key);
    const exportedAsString = this.ab2str(exported);
    const exportedAsBase64 = btoa(exportedAsString);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  }

  /**
   * Divide uma string PEM em múltiplas linhas.
   * @param {string} pem - String PEM.
   * @returns {string} - String PEM formatada.
   */
  breakPemIntoMultipleLines(pem) {
    const charsPerLine = 64;
    let pemContents = '';
    while (pem.length > 0) {
      pemContents += `${pem.substring(0, charsPerLine)}\n`;
      pem = pem.substring(64);
    }
    return pemContents;
  }
}

export default JwtRsaKeyManager;