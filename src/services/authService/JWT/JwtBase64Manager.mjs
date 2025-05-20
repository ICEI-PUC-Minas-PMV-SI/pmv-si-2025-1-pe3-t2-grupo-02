class JwtBase64Manager {
  constructor() {}

  /**
   * Gera valores aleatórios.
   * @param {number} length - Comprimento do array de valores aleatórios.
   * @returns {Uint8Array} - Array contendo valores aleatórios.
   */
  generateRandomValues = (length) => {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Converte um ArrayBuffer para uma string Base64.
   * @param {ArrayBuffer} arrayBuffer - Buffer de bytes.
   * @returns {string} - String Base64.
   */
  arrayBufferToBase64(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    byteArray.forEach((byte) => {
      byteString += String.fromCharCode(byte);
    });
    return btoa(byteString);
  }

  /**
   * Converte uma string Base64 para um Uint8Array.
   * @param {string} base64Contents - String Base64.
   * @returns {Uint8Array} - Array de bytes.
  */
  base64ToUint8Array(base64Contents) {
    base64Contents = base64Contents.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    const content = atob(base64Contents);
    return new Uint8Array(content.split('').map((c) => c.charCodeAt(0)));
  }
  
  /**
   * Converte uma string para um Uint8Array.
   * @param {string} contents - String de entrada.
   * @returns {Uint8Array} - Array de bytes.
  */
  stringToUint8Array(contents) {
    const encoded = btoa(unescape(encodeURIComponent(contents)));
    return this.base64ToUint8Array(encoded);
  }
    
  /**
   * Converte um Uint8Array para uma string Base64.
   * @param {Uint8Array} unsignedArray - Array de bytes.
   * @returns {string} - String Base64.
  */
  uint8ArrayToString(unsignedArray) {
    const base64string = btoa(String.fromCharCode(...unsignedArray));
    return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Decodifica uma string Base64Url para um objeto.
   * @param {string} base64Url - String Base64Url.
   * @returns {Object} - Objeto decodificado.
   */
  decodeBase64Url(base64Url) {
    const padding = '='.repeat((4 - base64Url.length % 4) % 4);
    const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const decodedString = atob(base64);
    return JSON.parse(decodedString);
  }

  str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}

export default JwtBase64Manager;