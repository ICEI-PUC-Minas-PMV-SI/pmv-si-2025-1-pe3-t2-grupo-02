// Esse script pode ser incluído em qualquer página para adicionar um botão de modo externo
// É útil para páginas que não têm o botão no cabeçalho ou que precisam de um botão adicional específico

/**
 * Adiciona um botão de modo externo à página
 * @param {string} containerId - ID do elemento onde o botão será adicionado
 * @param {string} position - Posição do botão ('before', 'after', 'prepend', 'append')
 * @param {string} buttonClass - Classes CSS adicionais para o botão
 */
function adicionarBotaoModoExterno(containerId, position = 'append', buttonClass = 'simple-button') {
  // Aguarda o DOM estar pronto
  document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o modo externo já está ativo no localStorage
    const outdoorModeActive = localStorage.getItem('outdoorMode') === 'true';
    const buttonText = outdoorModeActive ? 'Modo padrão' : 'Modo externo';
    
    // Cria o botão de modo externo
    const button = document.createElement('button');
    button.id = 'page-outdoor-mode-button';
    button.classList.add('outdoor-mode-button');
    if (buttonClass) {
      buttonClass.split(' ').forEach(cls => button.classList.add(cls));
    }
    button.textContent = buttonText;
    button.style.marginLeft = '10px';
    
    // Encontra o container onde o botão será adicionado
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container com ID "${containerId}" não encontrado`);
      return;
    }
    
    // Adiciona o botão na posição especificada
    switch (position) {
      case 'before':
        container.parentNode.insertBefore(button, container);
        break;
      case 'after':
        container.parentNode.insertBefore(button, container.nextSibling);
        break;
      case 'prepend':
        container.prepend(button);
        break;
      case 'append':
      default:
        container.append(button);
        break;
    }
    
    console.log(`Botão de modo externo adicionado ao container "${containerId}"`);
  });
}

// Exemplo de uso:
// adicionarBotaoModoExterno('my-container', 'append', 'my-custom-button-class');
