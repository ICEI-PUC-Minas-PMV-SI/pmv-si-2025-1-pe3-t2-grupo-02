let modal = document.getElementById("case-form-modal");

let closeModal = document.getElementById("closeModal");

if (closeModal) {
  closeModal.onclick = () => {
    modal.style.display = "none";
  }
}

// Quando o usuário clicar em qualquer lugar fora do modal, ele será fechado
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const showModal = () => {
  modal.style.display = "block";
}

document.getElementById("submitCase").addEventListener("submit", function(event){
  event.preventDefault();
  showModal();
});
