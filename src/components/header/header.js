class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadRouterScript();
    this.render();
    this.setupEvents();

    document.addEventListener("click", (event) => {
      //sumir menus quando o usuário clica fora deles

      const menu = this.querySelector("#menu");
      const menuButton = this.querySelector("#image-hamburger");

      if (event.target !== menuButton && event.target !== menu) {
        menu.style.display = "none";
      }

      const loginOptions = document.getElementById("login-options");
      const elementsToIgnore = [
        loginOptions,
        document.getElementById("login-btn"),
        document.getElementById("image-logout"),
        document.getElementById("username-text"),
      ];

      if (loginOptions && !elementsToIgnore.includes(event.target)) {
        loginOptions.style.display = "none";
      }

      const logoutBtn = document.getElementById("logout-option");
      if (event.target === logoutBtn) {
        this.handleLogout();
      }
    });
  }

  loadRouterScript() {
    const path = window.location.pathname;
    const isHome = path === "/src/" || path === "/" || path === "/index.html";
    let scriptSrc = "services/router/router.js";
    if (!isHome) {
      scriptSrc = "../../services/router/router.js";
    }
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "module";
    document.head.appendChild(script);
  }

  async setLogout() {
    let apiUrl;
    await fetch("../../config.json")
      .then((response) => response.json())
      .then((env) => {
        apiUrl = env.API_URL;
      });
    const loggedWith = localStorage.getItem("loggedWith");
    fetch(`${apiUrl}/usuarios?userEmail=${encodeURIComponent(loggedWith)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res[0];
        if (user) {
          const loginBtn = document.getElementById("login-btn");
          loginBtn.classList.add("logged-user");
          loginBtn.innerHTML = `
                <p id="username-text">${user.userName}</p>
                <img id="image-logout" src="assets/logout.png" alt="Logout" onerror="this.onerror=null; this.src='../../assets/logout.png';"/>
              `;

          const options = document.createElement("div");
          options.id = "login-options";
          options.innerHTML = `
                <ul>
                  <li><button id="logout-option"">Sair</button></li>
                </ul>
              `;
          loginBtn.insertAdjacentElement("afterend", options);

          loginBtn.onclick = "";
        }
      });
  }

  handleLogout() {
    localStorage.removeItem("loggedWith");
    document.cookie =
      "jwt" + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    this.connectedCallback();
  }

  render() {
    const path = window.location.pathname;
    let relativePath = path.includes("index.html") ? "./src/" : "../../src/";
    const outdoorModeActive = localStorage.getItem('outdoorMode') === 'true';
    relativePath += path.includes("src") ? "../../src/" : "";
    const primaryLogo = "assets/mosquito.svg";
    const fallbackLogo = "../../assets/mosquito.svg";

    this.innerHTML = `
    <header class="header">
      <div>
        <a onclick="redirectToPage('index.html')" class="header-title" style="text-decoration: none">
        <img src="${primaryLogo}" alt="Mosquito Aedis Aegypti" onerror="this.onerror=null; this.src='${fallbackLogo}';" />
          <h1>Dengue Status</h1>
        </a>
      </div>
      <div class="header-buttons">
        <button class="header-button" onclick="redirectToPage('caseForm/caseForm.html')">Reportar Caso</button>
        <button class="header-button" onclick="redirectToPage('denuncia/denuncia.html')">Denunciar Foco</button>
        <button id="visit-request-btn" class="header-button" style="display: none;" onclick="redirectToPage('solicitarVisita/solicitarVisita.html')">Solicitar Visita</button>
        <button id="login-btn" class="highlighted-main-button" onclick="redirectToPage('login/login.html')">Entrar</button>
        <button id="header-outdoor-mode-button" class="header-button outdoor-mode-button">${outdoorModeActive ? 'Modo padrão' : 'Modo externo'}</button>
      </div>
      <button id="menu-button">
        <img id="image-hamburger" src="assets/hamburger.png" alt="Menu" onerror="this.onerror=null; this.src='../../assets/hamburger.png';"/>
      </button>
      <nav id="menu">
      <ul>
        <li class="first"><a onclick="redirectToPage('caseForm/caseForm.html')">Reportar Caso</a></li>
        <li class="middle"><a onclick="redirectToPage('denuncia/denuncia.html')">Denunciar Foco</a></li>
        <li id="visit-menu-option" class="middle" style="display: none;"><a onclick="redirectToPage('solicitarVisita/solicitarVisita.html')">Solicitar Visita</a></li>
        <li class="middle"><a href="javascript:void(0)" id="menu-outdoor-mode-button" class="outdoor-mode-button">${outdoorModeActive ? 'Modo padrão' : 'Modo externo'}</a></li>
        <li id="login-nav-option"class="last"><a onclick="redirectToPage('login/login.html')">Entrar</a></li>
        <li class="last"><a id="logout-nav-option" href="javascript:void(0)">Sair</a></li>
      </ul>
      </nav>
    </header>
    `;

    const loggedWith = localStorage.getItem("loggedWith");
    if (loggedWith) {
      this.setLogout();
      this.showLoggedHeaderOptions();
    }
  }

  showLoggedHeaderOptions() {
    const visitBtn = this.querySelector("#visit-request-btn");
    if (visitBtn) {
      visitBtn.style.display = "inline-block";
    }
    const visitMenuOption = this.querySelector("#visit-menu-option");
    if (visitMenuOption) {
      visitMenuOption.style.display = "block";
    }
  }

  setupEvents() {
    const menuButton = this.querySelector("#menu-button");
    menuButton.addEventListener("click", () => this.clickMenu());

    const loginOptions = this.querySelector("#login-btn");
    if (loginOptions)
      loginOptions.addEventListener("click", () => this.clickLoginOptions());
    
    // Removemos os event listeners dos botões de modo externo
    // Eles serão gerenciados pelo OutdoorModeManager global
  }

  clickMenu() {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";

      const loggedWith = localStorage.getItem("loggedWith");
      const loginOption = document.getElementById("login-nav-option");
      const logoutOption = document.getElementById("logout-nav-option");
      if (loggedWith) {
        loginOption.style.display = "none";
        logoutOption.style.display = "block";
        logoutOption.addEventListener("click", () => {
          this.handleLogout();
        });
      } else {
        loginOption.style.display = "block";
        logoutOption.style.display = "none";
      }
    }
  }

  clickLoginOptions() {
    const loginOptions = document.querySelector("#login-options");
    if (loginOptions.style.display === "inline") {
      loginOptions.style.display = "none";
    } else {
      loginOptions.style.display = "inline";
    }
  }

  // Removemos o método toggleOutdoorMode pois agora ele é gerenciado pelo OutdoorModeManager
}

customElements.define("app-header", Header);
