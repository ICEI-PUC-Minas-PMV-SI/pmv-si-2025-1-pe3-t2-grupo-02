class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const path = window.location.pathname;
    let relativePath = path.includes("index.html") ? "./src/" : "../../src/";
    relativePath += path.includes("src") ? "../../src/" :  "";
    this.innerHTML = `
      <footer class="footer">
    <nav>
      <ul>
        <li><a onclick="redirectToPage('index.html')">Home</a></li>
        <li><a onclick="redirectToPage('dengueCasesMap/dengueCasesMap.html')">Mapa focos da dengue</a></li>
        <li><a onclick="redirectToPage('healthPostsMap/healthPostsMap.html')">Mapa postos de saúde</a></li>

      </ul>
      <ul>
        <li><a onclick="redirectToPage('caseForm/caseForm.html')">Reportar caso</a></li>
        <li><a onclick="redirectToPage('informacoes/informacoes.html')">Informações e ajuda no combate</a></li>
        <li><a onclick="redirectToPage('denuncia/denuncia.html')">Denuncia de foco</a></li>
      </ul>
    </nav>
    <p class="copyright">© 2024 Dengue Status | PUC Minas | v1.0.0</p>
  </footer>
      `;
  }
}

customElements.define("app-footer", Footer);
