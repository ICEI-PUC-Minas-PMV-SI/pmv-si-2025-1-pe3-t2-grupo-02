class JwtTimeManager {
  /**
   * Método para calcular o tempo de expiração de um JWT.
   * @param {number} expirationInSeconds - O tempo de expiração em segundos.
   * @returns {number} - O tempo de expiração em segundos desde a data atual.
  */
  calculateExpirationTime = (expirationInSeconds) => {
    return Math.floor(Date.now() / 1000) + expirationInSeconds;
  };

  /**
   * Método para calcular o tempo de início de validade de um JWT.
   * @param {number} notBeforeInSeconds - O tempo de início de validade em segundos.
   * @returns {number} - O tempo de início de validade em segundos desde a Epoch.
   */
  calculateNotBeforeTime = (notBeforeInSeconds) => {
    return Math.floor(Date.now() / 1000) + notBeforeInSeconds;
  };

  /**
   * Método para calcular a emissão de um JWT.
   * @returns {number} - O tempo de emissão em segundos a partir da data atual.
   */
  calculateIssuedAtTime = (iat = 0) => {
    return Math.floor(Date.now() / 1000) + iat;
  };
}

export default JwtTimeManager;
