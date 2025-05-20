import JwtVerifier from './JwtVerifier.mjs';
import JwtContentManager from './JwtContentManager.mjs';
import JwtBase64Manager from './JwtBase64Manager.mjs';
import JwtRsaKeyManager from './JwtRsaKeyManager.mjs';
import UserRepository from '../../db/repositories/userRepository.mjs';


async function verifyUserIsAuthenticated() {
  const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  const importRsaKey = (pem) => {
    pem = atob(pem);
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      // .replace(/\s+/g, '');
    let binaryDerString;
    try {
      binaryDerString = atob(pemContents);
    } catch (error) {
      throw new Error('Failed to decode base64 string.');
    }
    const binaryDer = str2ab(binaryDerString);
  
    return crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      true,
      ["verify"],
    );
  }

  const jwtBase64Manager  = new JwtBase64Manager();
  const jwtRsaKeyManager  = new JwtRsaKeyManager();
  const jwtVerifier       = new JwtVerifier();
  const jwtContentManager = new JwtContentManager();
  const userRepository     = new UserRepository();
  const cookieJwt         = document.cookie.split('=')[1];

  if (!cookieJwt) {
    console.error('Token não fornecido.');
    return;
  }
  try {
    const [headerEncoded, payloadEncoded, signature] = cookieJwt.split('.');
    if (!headerEncoded || !payloadEncoded || !signature) {
      throw new Error('Token format is incorrect.');
    }

    const decodedPayload = await jwtContentManager.decodeTokenContent(payloadEncoded);
    const userData = await userRepository.getUserByEmail(decodedPayload.data.data.userEmail);
    const publicKeyEncoded = userData.keys.publicKey.replace('\n','');
    const importedPublicKey = await importRsaKey(publicKeyEncoded);
    
    const isValid = jwtVerifier.validateToken(cookieJwt, importedPublicKey);
    if (isValid) {
      console.log('Token is valid. Submitting case.');
      return true;
    } else {
      console.error('Token is invalid.');
      return false;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    console.error(error)
  }
}

export default verifyUserIsAuthenticated;