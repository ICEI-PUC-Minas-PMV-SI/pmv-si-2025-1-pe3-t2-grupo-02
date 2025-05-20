class CookieService {
  constructor() {}

  /**
   * Define um cookie com um nome, valor e tempo de expiração em segundos.
   * Se o cookie já existir, ele será sobrescrito.
   *
   * @param {string} name - O nome do cookie.
   * @param {string} value - O valor do cookie.
   * @param {number} seconds - O tempo de expiração do cookie em segundos.
   */
  setCookie(name, value, seconds) {
    this.deleteCookie(name)
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    let expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // + "; Secure; HttpOnly; SameSite=Strict";
  }

  /**
   * Deleta um cookie com o nome especificado.
   * Define a data de expiração do cookie para uma data no passado.
   *
   * @param {string} name - O nome do cookie a ser deletado.
   */
  deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
}

export default CookieService;
