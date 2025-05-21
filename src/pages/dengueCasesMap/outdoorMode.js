document.addEventListener('DOMContentLoaded', function () {
  const outdoorModeActive = localStorage.getItem('outdoorMode') === 'true';

  if (outdoorModeActive) {
    document.body.classList.add('outdoor-mode');
  }

  const outdoorModeButton = document.getElementById('outdoorModeButton');
  if (outdoorModeButton) {
    outdoorModeButton.addEventListener('click', function () {
      document.body.classList.toggle('outdoor-mode');

      const isOutdoorMode = document.body.classList.contains('outdoor-mode');
      localStorage.setItem('outdoorMode', isOutdoorMode);

      outdoorModeButton.textContent = isOutdoorMode ? 'Modo normal' : 'Modo externo';
    });
  }
});
