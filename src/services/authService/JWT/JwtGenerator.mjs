import JwtBase64Manager from './JwtBase64Manager.mjs';
import JwtRsaKeyManager from './JwtRsaKeyManager.mjs';
import JwtContentManager from './JwtContentManager.mjs';
import JwtTimeManager from './JwtTimeManager.mjs';
import JwtVerifier from './JwtVerifier.mjs';

class JwtGenerator {
  constructor() {
    this.JwtRsaKeyManager   = new JwtRsaKeyManager();
    this.JwtContentManager  = new JwtContentManager();
    this.JwtTimeManager     = new JwtTimeManager();
    this.JwtBase64Manager   = new JwtBase64Manager();
    this.JwtVerifier        = new JwtVerifier();
  }

  /**
   * Cria um token JWT.
   * @param {Object} payloadOptions - Dados do payload do token.
   * @param {Object} [options={}] - Opções adicionais como exp (expiração), nbf 
   * (not before) e iat (issued at).
   * @returns {Object} - Um objeto contendo o token gerado e as chaves pública e privada.
   * @throws {Error} - Lança um erro se os parâmetros de tempo ou payload forem inválidos.
  */
  async createToken(payloadOptions, options = {}) {
    const { exp, nbf, iat } = options;
    const { privateKey, publicKey } = await this.JwtRsaKeyManager.generateKeyPair();
    if (exp <= 0 || nbf < 0 ) {
      throw new Error('Por favor, informe os parâmetros de tempo de expiração e início de validade do token.');
    }
    if (!payloadOptions) {
      throw new Error('É necessário informar, no mínimo, o ID do usuário para a emissão do token.');
    }

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      jti: await this.JwtContentManager.createJti(),
      exp: this.JwtTimeManager.calculateExpirationTime(exp || 7200),
      nbf: this.JwtTimeManager.calculateNotBeforeTime(nbf || 0),
      iat: this.JwtTimeManager.calculateIssuedAtTime(iat || 0),
      iss: "DengueStatus",
      data: payloadOptions
    }

    const token = await this.signToken(header, payload, privateKey);
    if (await this.JwtVerifier.validateToken(token, publicKey) !== true) {
      throw new Error('Perdão, não foi possível gerar corretamente o token.');
    }
    
    const exportedKeys = {privateKey: await this.JwtRsaKeyManager.exportCryptoPrivateKey(privateKey), publicKey: await this.JwtRsaKeyManager.exportCryptoPublicKey(publicKey)};
    return {token: token, exportedKeys: exportedKeys, cryptoKeys: {privateKey, publicKey}};
  }

  /**
   * Assina o token com a chave privada fornecida.
   * @param {Object} header - Cabeçalho do token.
   * @param {Object} payload - Payload do token.
   * @param {CryptoKey} privateKey - Chave privada usada para assinar o token.
   * @returns {string} - O token assinado como uma string.
   */
  async signToken(header, payload, privateKey) {
    const headerBase64 = await this.JwtContentManager.encodeTokenContent(header);
    const payloadBase64 = await this.JwtContentManager.encodeTokenContent(payload);
    const headerAndPayload = `${headerBase64}.${payloadBase64}`;
    const dataEncoded = this.JwtBase64Manager.stringToUint8Array(headerAndPayload);
    const signature = await this.JwtRsaKeyManager.signMessage(privateKey, dataEncoded);
    const base64Signature = this.JwtBase64Manager.uint8ArrayToString(new Uint8Array(signature));
    return `${headerAndPayload}.${base64Signature}`;
  };
}

export default JwtGenerator;