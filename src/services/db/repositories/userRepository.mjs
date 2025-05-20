let apiUrl;
class UserRepository {
  /**
   * Adiciona um novo usuário ao banco de dados.
   *
   * @param {Object} userData - Dados do usuário a ser registrado.
   * @returns {Object} Dados do usuário registrado.
   * @throws {Error} Se ocorrer um erro ao carregar o JSON.
   */
  async setNewUser(userData) {
    const userJson = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Erro ao carregar JSON:', error);
      });
    return userJson;
  }

  /**
   * Recupera todos os usuários do banco de dados.
   *
   * @returns {Array<Object>} Lista de usuários.
   * @throws {Error} Se ocorrer um erro ao carregar o JSON.
   */
  async getUsersInDb() {
    const usersJson = await fetch(`${apiUrl}/usuarios`)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Erro ao carregar JSON:', error);
      });
    return usersJson;
  }

  /**
   * Recupera um usuário pelo email.
   *
   * @param {string} email - Email do usuário.
   * @returns {Object} Dados do usuário.
   * @throws {Error} Se o usuário não for encontrado ou ocorrer um erro ao carregar o JSON.
   */
  async getUserByEmail(email) {
    const userData = await fetch(`${apiUrl}/usuarios?userEmail=${encodeURIComponent(email)}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Erro ao carregar JSON:', error);
      });

    if (!userData) {
      throw new Error('Usuário não encontrado');
    }
    return userData[0];
  }

  /**
   * Atualiza os dados de um usuário.
   *
   * @param {string} userId - ID do usuário.
   * @param {Object} patchData - Dados a serem atualizados.
   * @returns {Object} Dados do usuário atualizado.
   * @throws {Error} Se ocorrer um erro ao carregar o JSON.
   */
  async updateUserData(userId, patchData) {
    const patchConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patchData)
    };

    const userData = await fetch(`${apiUrl}/usuarios/${userId}`, patchConfig)
      .then(response => response.json())
      .catch(error => {
        console.error('Erro ao carregar JSON:', error);
      });
    return userData;
  }

  async init() {
    const response = await fetch('../../config.json');
    const env = await response.json();
    apiUrl = env.API_URL;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const userRepository = new UserRepository();
  await userRepository.init();
});

export default UserRepository;
