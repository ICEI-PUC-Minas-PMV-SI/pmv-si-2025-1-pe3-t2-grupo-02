// Obter elementos relevantes
const selectWrapper = document.querySelector('.custom-select-wrapper');
const selectElement = document.getElementById('genero');
const customArrow = document.querySelector('.custom-arrow');

// Atualizar posição da seta quando o tamanho da janela for alterado
window.addEventListener('resize', positionCustomArrow);
positionCustomArrow();

const positionCustomArrow = () => {
  const selectRect = selectElement.getBoundingClientRect();
  customArrow.style.top = (selectRect.height / 2 - 2.5) + 'px'; // Ajuste conforme necessário
}