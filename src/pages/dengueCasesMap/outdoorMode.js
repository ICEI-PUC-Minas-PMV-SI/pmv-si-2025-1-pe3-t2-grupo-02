document.addEventListener('DOMContentLoaded', function () {
  const outdoorModeActive = localStorage.getItem('outdoorMode') === 'true';

  // Se o modo externo estiver ativo, aplicamos a classe no carregamento
  if (outdoorModeActive) {
    document.body.classList.add('outdoor-mode');
  }
});
