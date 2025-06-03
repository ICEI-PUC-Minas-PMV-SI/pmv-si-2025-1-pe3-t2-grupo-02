class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.loadRouterScript();
    this.loadHamburgerMenuScript();
    this.render();
    this.setupEvents();
    this.setupGlobalClick();
  }
  loadRouterScript() {
    const path = window.location.pathname;
    const isHome = path === "/src/" || path === "/" || path === "/index.html";
    const script = document.createElement("script");
    script.src = isHome ? "services/router/router.js" : "../../services/router/router.js";
    script.type = "module";
    document.head.appendChild(script);
  }

  loadHamburgerMenuScript() {
    const path = window.location.pathname;
    const isHome = path === "/src/" || path === "/" || path === "/index.html";
    let scriptSrc = "components/hamburgerMenu/hamburgerMenu.js";
    let cssSrc = "components/hamburgerMenu/hamburgerMenu.css";
    
    if (!isHome) {
      scriptSrc = "../../components/hamburgerMenu/hamburgerMenu.js";
      cssSrc = "../../components/hamburgerMenu/hamburgerMenu.css";
    }
    
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssSrc;
    document.head.appendChild(link);
    
    // Load JS
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.defer = true;
    document.head.appendChild(script);
  }

  setupGlobalClick() {
    document.addEventListener("click", (event) => {
      const menu = this.querySelector("#menu");
      const menuButton = this.querySelector("#menu-button");
      const loginBtn = this.querySelector("#login-btn");
      const loginOptions = document.querySelector("#login-options");


      if (menu && event.target !== menuButton && !menu.contains(event.target) &&
          event.target !== menuButton.firstElementChild) {
        menu.style.display = "none";
      }

      if (loginOptions && event.target !== loginBtn && !loginOptions.contains(event.target)) {
        loginOptions.style.display = "none";
      }
    });
  }

  async setLogout() {
    try {
      const config = await fetch("../../config.json").then(res => res.json());
      const apiUrl = config.API_URL;
      const loggedWith = localStorage.getItem("loggedWith");

      const res = await fetch(`${apiUrl}/usuarios?userEmail=${encodeURIComponent(loggedWith)}`);
      const users = await res.json();
      const user = users[0];

      if (user) {
        const loginBtn = this.querySelector("#login-btn");
        loginBtn.classList.add("logged-user");
        loginBtn.innerHTML = `
          <span class="user-icon">👤</span>
          <p id="username-text">${user.userName}</p>
        `;

        const options = document.createElement("div");
        options.id = "login-options";
        options.innerHTML = `
          <ul>
            <li><button id="logout-option" class="simple-button">Sair</button></li>
          </ul>
        `;
        loginBtn.insertAdjacentElement("afterend", options);

        document.getElementById("logout-option").addEventListener("click", () => this.handleLogout());
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  handleLogout() {
    localStorage.removeItem("loggedWith");
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    location.reload();
  }
  render() {
    const primaryLogo = "assets/mosquito.svg";
    const fallbackLogo = "../../assets/mosquito.svg";

    this.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <a onclick="redirectToPage('index.html')" class="header-title">
            <img src="${primaryLogo}" alt="Mosquito" onerror="this.onerror=null; this.src='${fallbackLogo}';"/>
            <h1>Dengue Status</h1>
          </a>
        </div>
        <div class="header-buttons">
          <button class="outline-button" onclick="redirectToPage('listagemDenunciasFocos/denuncias-focos.html')">
            Mapa de Denúncias de Foco
          </button>
          <button id="login-btn" class="filled-button">
            Entrar
          </button>
        </div>
        
        <!-- Novo Menu Hamburger -->
        <hamburger-menu></hamburger-menu>
        
        <!-- Menu antigo (mantido como fallback) -->
        <button id="menu-button" style="display: none;">
          <img src="assets/hamburger.png" alt="Menu" 
            onerror="this.onerror=null; this.src='../../assets/hamburger.png';"/>
        </button>
        <nav id="menu" style="display: none;">
          <ul>
            <li><a onclick="redirectToPage('listagemDenunciasFocos/denuncias-focos.html')">Mapa de Denúncias de Foco</a></li>
            <li id="login-nav-option"><a onclick="redirectToPage('login/login.html')">Entrar</a></li>
            <li><a id="logout-nav-option" href="javascript:void(0)">Sair</a></li>
          </ul>
        </nav>
      </header>
    `;

    if (localStorage.getItem("loggedWith")) {
      this.setLogout();
    } else {
      const logoutNav = this.querySelector("#logout-nav-option");
      if (logoutNav) logoutNav.style.display = "none";
    }
  }

  setupEvents() {
    const menuButton = this.querySelector("#menu-button");
    const loginBtn = this.querySelector("#login-btn");
    const logoutNav = this.querySelector("#logout-nav-option");

    if (menuButton) {
      menuButton.addEventListener("click", () => this.toggleMenu());
    }

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        if (localStorage.getItem("loggedWith")) {
          this.toggleLoginOptions();
        } else {
          redirectToPage('login/login.html');
        }
      });
    }

    if (logoutNav) {
      logoutNav.addEventListener("click", () => this.handleLogout());
    }
  }

  toggleMenu() {
    const menu = this.querySelector("#menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";

    const loggedWith = localStorage.getItem("loggedWith");
    const loginOption = this.querySelector("#login-nav-option");
    const logoutOption = this.querySelector("#logout-nav-option");

    if (loggedWith) {
      loginOption.style.display = "none";
      logoutOption.style.display = "block";
    } else {
      loginOption.style.display = "block";
      logoutOption.style.display = "none";
    }
  }

  toggleLoginOptions() {
    const loginOptions = document.querySelector("#login-options");
    if (!loginOptions) return;

    loginOptions.style.display =
      loginOptions.style.display === "inline" ? "none" : "inline";
  }
}

customElements.define("app-header", Header);
