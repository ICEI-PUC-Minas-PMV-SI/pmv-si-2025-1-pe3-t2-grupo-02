let modal = document.getElementById("cadastro-conta-modal");
let closeModal = document.getElementById("closeModal");
let openModalModal = document.getElementById("openModal");

closeModal.onclick = function() {
  modal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const showModal = () => {
  modal.style.display = "block";
}

document.getElementById("openModal").addEventListener("submit", function(event){
  event.preventDefault();
  showModal();
});
