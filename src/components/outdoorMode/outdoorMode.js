// Gerenciador global do modo externo
class OutdoorModeManager {
  constructor() {
    this.outdoorModeKey = 'outdoorMode';
  }

  // Inicializa o gerenciador ao carregar a página
  init() {
    // Verifica se o modo externo está ativo
    const outdoorModeActive = localStorage.getItem(this.outdoorModeKey) === 'true';

    // Aplica o modo externo se estiver ativo
    if (outdoorModeActive) {
      document.body.classList.add('outdoor-mode');
    }

    // Não adicionamos os event listeners aqui, deixaremos isso para o método setupGlobal
  }

  // Configura globalmente o modo externo - será chamado quando os componentes estiverem prontos
  setupGlobal() {
    // Antes de tudo, precisamos verificar se o componente de cabeçalho está pronto
    if (!document.querySelector('app-header')) {
      console.log('Componente de cabeçalho não encontrado, aguardando...');
      setTimeout(() => this.setupGlobal(), 200);
      return;
    }
    
    // Pega todos os botões de modo externo na página após os componentes serem carregados
    const outdoorModeButtons = document.querySelectorAll('.outdoor-mode-button, #outdoorModeButton, #header-outdoor-mode-button, #menu-outdoor-mode-button');
    
    if (outdoorModeButtons.length === 0) {
      console.log('Nenhum botão de modo externo encontrado, aguardando...');
      // Se não encontrar os botões, tenta novamente após um pequeno delay
      setTimeout(() => this.setupGlobal(), 200);
      return;
    }
    
    console.log(`${outdoorModeButtons.length} botões de modo externo encontrados`);
    
    // Atualiza o texto dos botões com base no estado atual
    const isOutdoorMode = document.body.classList.contains('outdoor-mode');
    this.updateButtonsText(isOutdoorMode);
    
    outdoorModeButtons.forEach(button => {
      // Remove event listeners anteriores para evitar duplicação
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // Adiciona o novo event listener
      newButton.addEventListener('click', (e) => {
        if (e && e.preventDefault) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        console.log('Botão de modo externo clicado');
        
        // Alterna o modo externo
        document.body.classList.toggle('outdoor-mode');
        
        // Verifica se o modo externo está ativo após a alternância
        const isOutdoorMode = document.body.classList.contains('outdoor-mode');
        console.log(`Modo externo ativo: ${isOutdoorMode}`);
        
        // Salva a preferência no localStorage
        localStorage.setItem(this.outdoorModeKey, isOutdoorMode);
        
        // Atualiza o texto de todos os botões
        this.updateButtonsText(isOutdoorMode);
      });
    });
  }

  // Atualiza o texto de todos os botões de modo externo
  updateButtonsText(isOutdoorMode) {
    const outdoorModeButtons = document.querySelectorAll('.outdoor-mode-button, #outdoorModeButton, #header-outdoor-mode-button, #menu-outdoor-mode-button');
    
    console.log(`Atualizando texto de ${outdoorModeButtons.length} botões`);
    
    outdoorModeButtons.forEach(button => {
      button.textContent = isOutdoorMode ? 'Modo padrão' : 'Modo externo';
    });
  }
  
  // Método para aplicar diretamente o modo externo (para uso via console ou API)
  toggleMode() {
    document.body.classList.toggle('outdoor-mode');
    const isOutdoorMode = document.body.classList.contains('outdoor-mode');
    localStorage.setItem(this.outdoorModeKey, isOutdoorMode);
    this.updateButtonsText(isOutdoorMode);
    console.log(`Modo alternado manualmente. Modo externo: ${isOutdoorMode}`);
    return isOutdoorMode;
  }
}

// Cria uma instância global para que possa ser acessada via console para depuração
let outdoorModeManager;

// Inicializa o gerenciador quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  outdoorModeManager = new OutdoorModeManager();
  outdoorModeManager.init();
  
  // Aguarde todos os componentes personalizados serem carregados
  // antes de configurar os event listeners
  window.addEventListener('load', () => {
    // Espera o DOM estar completamente pronto, incluindo componentes personalizados
    setTimeout(() => {
      console.log('Configurando gerenciador de modo externo...');
      outdoorModeManager.setupGlobal();
    }, 500);
  });
  
  // Expõe a instância globalmente para depuração (apenas em desenvolvimento)
  window.outdoorModeManager = outdoorModeManager;
});
