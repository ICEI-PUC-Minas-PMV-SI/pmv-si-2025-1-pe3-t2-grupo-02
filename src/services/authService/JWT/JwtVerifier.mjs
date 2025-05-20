import JwtBase64Manager from './JwtBase64Manager.mjs';
import JwtRsaKeyManager from './JwtRsaKeyManager.mjs';
import JwtContentManager from './JwtContentManager.mjs';


class JwtVerifier {
  constructor() {
    this.JwtBase64Manager = new JwtBase64Manager(); 
    this.JwtRsaKeyManager = new JwtRsaKeyManager();
    this.JwtContentManager  = new JwtContentManager();
  }
  
  /**
   * Verifica a assinatura de um token com a chave pública.
   * @param {string} token - Token JWT.
   * @param {CryptoKey} publicKey - Chave pública.
   * @returns {Promise<boolean>} - Resultado da verificação.
   */
  async verifyToken(token, publicKey) {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signature = this.JwtBase64Manager.base64ToUint8Array(encodedSignature);
    const isValid = await this.JwtRsaKeyManager.verifyMessage(publicKey, signature, data);
    return isValid;
  };

  /**
   * Valida um token JWT.
   * @param {string} token - Token JWT.
   * @param {CryptoKey} publicKey - Chave pública.
   * @returns {Promise<boolean>} - Resultado da validação.
   * @throws {Error} - Lança um erro se o token ou a chave pública não forem fornecidos, ou se o token for inválido.
   */
  async validateToken(token, publicKey) {
    if (!token) {
      throw new Error('Token não fornecido.');
    }
    if (!publicKey) {
      throw new Error('Chave pública não fornecida.');
    }
    const [headerEncoded, payloadEncoded, signature] = token.split('.');
    const decodedHeader = await this.JwtContentManager.decodeTokenContent(headerEncoded);
    const decodedPayload = await this.JwtContentManager.decodeTokenContent(payloadEncoded);
    const now = Math.floor(Date.now() / 1000);
    
    if (decodedPayload.exp && now >= decodedPayload.exp) {
      throw new Error('Token expirado.');
    }

    if (decodedPayload.nbf && now < decodedPayload.nbf) {
      throw new Error('Token não é válido ainda.');
    }

    if (await this.verifyToken(token, publicKey) !== true) {
      throw new Error('Assinatura do token inválida.');
    }
    return true;
  }
}

export default JwtVerifier;
