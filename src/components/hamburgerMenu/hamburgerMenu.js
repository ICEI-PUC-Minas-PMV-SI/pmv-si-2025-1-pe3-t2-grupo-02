class HamburgerMenu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
    this.setupClickOutside();
    this.updateMenuVisibility();
    
    window.addEventListener('storage', () => {
      this.updateMenuVisibility();
    });
    
    document.addEventListener('loginStatusChanged', () => {
      this.updateMenuVisibility();
    });
  }

  async render() {
    const loggedWith = localStorage.getItem("loggedWith");
    const outdoorModeActive = localStorage.getItem('outdoorMode') === 'true';
    
    this.innerHTML = `
      <div class="hamburger-menu-container">
        <button id="hamburger-button" class="hamburger-btn">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <nav id="hamburger-menu" class="hamburger-nav">
          <div class="hamburger-menu-header">
            <div class="header-left">
              <img src="assets/mosquito.svg" alt="Dengue Status" onerror="this.onerror=null; this.src='../../assets/mosquito.svg';"/>
              <h3>Dengue Status</h3>
            </div>
            <button id="close-menu-btn" class="close-menu-btn" aria-label="Fechar menu">
              <span class="close-icon">×</span>
            </button>
          </div>
          
          <ul class="hamburger-menu-list">
            <!-- Páginas Principais -->
            <li class="menu-section">
              <span class="section-title-hamburger">Navegação Principal</span>
            </li>
            <li><a onclick="redirectToPage('index.html')" href="#">🏠 Home</a></li>
            <li><a onclick="redirectToPage('dengueCasesMap/dengueCasesMap.html')" href="#">🗺️ Mapa Casos de Dengue</a></li>
            <li><a onclick="redirectToPage('healthPostsMap/healthPostsMap.html')" href="#">🏥 Mapa Postos de Saúde</a></li>
            <li><a onclick="redirectToPage('informacoes/informacoes.html')" href="#">ℹ️ Informações e Prevenção</a></li>
            
            <!-- Ações do Usuário -->
            <li class="menu-section">
              <span class="section-title-hamburger">Ações</span>
            </li>
            <li><a onclick="redirectToPage('caseForm/caseForm.html')" href="#">📋 Reportar Caso</a></li>
            <li><a onclick="redirectToPage('denuncia/denuncia.html')" href="#">🚨 Denunciar Foco</a></li>
            <li id="visit-menu-option"><a onclick="redirectToPage('solicitarVisita/solicitarVisita.html')" href="#">📅 Solicitar Visita</a></li>
            <li id="my-visits-menu-option" style="display: none;"><a onclick="redirectToPage('solicitacoesVisita/solicitacoesVisita.html')" href="#">📂 Minhas Solicitações</a></li>

            <!-- Área do Agente (apenas para usuários logados) -->
            <li class="menu-section agent-section" style="display: none;">
              <span class="section-title-hamburger">Área do Agente</span>
            </li>
            <li class="agent-option" style="display: none;"><a onclick="redirectToPage('listagemDenunciasFocos/denuncias-focos.html')" href="#">📊 Denúncias de Focos</a></li>
            <li class="agent-option" style="display: none;"><a onclick="redirectToPage('listagemDenunciasAgente/denuncias-focos-agente.html')" href="#">🔍 Gerenciar Denúncias</a></li>
            <li class="agent-option" style="display: none;"><a onclick="redirectToPage('solicitacoesVisita/solicitacoesVisita.html')" href="#">📋 Solicitações de Visita</a></li>
            
            <!-- Informações -->
            <li class="menu-section">
              <span class="section-title-hamburger">Informações</span>
            </li>
            <li><a onclick="redirectToPage('sobreNos/sobreNos.html')" href="#">👥 Sobre Nós</a></li>
            
            <!-- Configurações -->
            <li class="menu-section">
              <span class="section-title-hamburger">Configurações</span>
            </li>
            <li><a href="javascript:void(0)" id="outdoor-mode-toggle" class="outdoor-mode-button">${outdoorModeActive ? 'Modo Padrão' : '☀️ Modo Externo'}</a></li>
            
            <!-- Login/Logout -->
            <li class="menu-section">
              <span class="section-title-hamburger">Conta</span>
            </li>
            <li id="login-menu-option" style="display: ${loggedWith ? 'none' : 'block'};"><a onclick="redirectToPage('login/login.html')" href="#">🔑 Entrar</a></li>
            <li id="register-menu-option" style="display: ${loggedWith ? 'none' : 'block'};"><a onclick="redirectToPage('cadastro/cadastro.html')" href="#">📝 Cadastrar</a></li>
            <li id="logout-menu-option" style="display: ${loggedWith ? 'block' : 'none'};"><a href="javascript:void(0)" id="logout-btn">🚪 Sair</a></li>
          </ul>
        </nav>
        
        <div id="hamburger-overlay" class="hamburger-overlay"></div>
      </div>
    `;
  }

  setupEvents() {
    const hamburgerButton = this.querySelector('#hamburger-button');
    const hamburgerMenu = this.querySelector('#hamburger-menu');
    const hamburgerOverlay = this.querySelector('#hamburger-overlay');
    const closeMenuBtn = this.querySelector('#close-menu-btn');
    const logoutBtn = this.querySelector('#logout-btn');
    const outdoorModeToggle = this.querySelector('#outdoor-mode-toggle');

    // Toggle menu
    hamburgerButton.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Close menu with X button
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Close menu when clicking overlay
    hamburgerOverlay.addEventListener('click', () => {
      this.closeMenu();
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const isMenuOpen = hamburgerMenu.classList.contains('open');
        if (isMenuOpen) {
          this.closeMenu();
        }
      }
    });

    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }

    // Outdoor mode toggle
    if (outdoorModeToggle) {
      outdoorModeToggle.addEventListener('click', () => {
        this.toggleOutdoorMode();
      });
    }

    // Close menu when clicking menu items
    const menuLinks = this.querySelectorAll('.hamburger-menu-list a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  setupClickOutside() {
    document.addEventListener('click', (event) => {
      const hamburgerContainer = this.querySelector('.hamburger-menu-container');
      
      if (!hamburgerContainer.contains(event.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const hamburgerMenu = this.querySelector('#hamburger-menu');
    const hamburgerOverlay = this.querySelector('#hamburger-overlay');
    const hamburgerButton = this.querySelector('#hamburger-button');
    
    const isOpen = hamburgerMenu.classList.contains('open');
    
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    const hamburgerMenu = this.querySelector('#hamburger-menu');
    const hamburgerOverlay = this.querySelector('#hamburger-overlay');
    const hamburgerButton = this.querySelector('#hamburger-button');
    
    hamburgerMenu.classList.add('open');
    hamburgerOverlay.classList.add('open');
    hamburgerButton.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    const hamburgerMenu = this.querySelector('#hamburger-menu');
    const hamburgerOverlay = this.querySelector('#hamburger-overlay');
    const hamburgerButton = this.querySelector('#hamburger-button');
    
    hamburgerMenu.classList.remove('open');
    hamburgerOverlay.classList.remove('open');
    hamburgerButton.classList.remove('open');
    document.body.style.overflow = '';
  }

  handleLogout() {
    localStorage.removeItem("loggedWith");
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    this.closeMenu();
    location.reload();
  }

  toggleOutdoorMode() {
    const currentMode = localStorage.getItem('outdoorMode') === 'true';
    const newMode = !currentMode;
    
    localStorage.setItem('outdoorMode', newMode.toString());
    
    if (newMode) {
      document.body.classList.add('outdoor-mode');
    } else {
      document.body.classList.remove('outdoor-mode');
    }
    
    // Update the toggle text
    const outdoorModeToggle = this.querySelector('#outdoor-mode-toggle');
    if (outdoorModeToggle) {
      outdoorModeToggle.innerHTML = `☀️ ${newMode ? 'Modo Padrão' : 'Modo Externo'}`;
    }
    
    this.closeMenu();
  }

  async updateMenuVisibility() {
    const loggedWith = localStorage.getItem("loggedWith");
    const visitMenuOption = this.querySelector('#visit-menu-option');
    const myVisitsMenuOption = this.querySelector('#my-visits-menu-option');
    const agentSection = this.querySelector('.agent-section');
    const agentOptions = this.querySelectorAll('.agent-option');
    const loginMenuOption = this.querySelector('#login-menu-option');
    const registerMenuOption = this.querySelector('#register-menu-option');
    const logoutMenuOption = this.querySelector('#logout-menu-option');

    const isHealthAgent = loggedWith ? await this.checkIdHealthAgent(loggedWith) : false;

    if (visitMenuOption) {
      visitMenuOption.style.display = isHealthAgent ? 'none' : 'block';
    }
    
    if (myVisitsMenuOption) {
      myVisitsMenuOption.style.display = (loggedWith && !isHealthAgent) ? 'block' : 'none';
    }
    
    if (agentSection) {
      agentSection.style.display = isHealthAgent ? 'block' : 'none';
    }
    
    agentOptions.forEach(option => {
      if (option) {
        option.style.display = isHealthAgent ? 'block' : 'none';
      }
    });
    
    if (loginMenuOption) {
      loginMenuOption.style.display = loggedWith ? 'none' : 'block';
    }
    
    if (registerMenuOption) {
      registerMenuOption.style.display = loggedWith ? 'none' : 'block';
    }
    
    if (logoutMenuOption) {
      logoutMenuOption.style.display = loggedWith ? 'block' : 'none';
    }
  }

  async checkIdHealthAgent(loggedWith) {
    try {
      const configResponse = await fetch('../../config.json');
      const { API_URL } = await configResponse.json();

      const usersResponse = await fetch(`${API_URL}/usuarios`);
      if (!usersResponse.ok) return false;

      const users = await usersResponse.json();
      const loggedUser = users.find(user => user.userEmail === loggedWith);

      return loggedUser?.userRole === "AGENTE_SAUDE";
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
      return false;
    }
  }
}

customElements.define('hamburger-menu', HamburgerMenu);
