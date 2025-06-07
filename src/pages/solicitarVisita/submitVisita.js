import verifyUserIsAuthenticated from '../../services/authService/JWT/verifyUserIsAuthenticated.mjs';

let unauthenticatedModal = document.getElementById("case-form-unauthenticated-modal");
let closeUnauthenticatedModal = document.getElementById("close-unauthenticated-modal");

const showModal = () => {
  unauthenticatedModal.style.display = "block";
}

closeUnauthenticatedModal.onclick = () => {
  unauthenticatedModal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target == unauthenticatedModal) {
    unauthenticatedModal.style.display = "none";
  }
}


document.getElementById('visitaForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const isAuthenticate = await verifyUserIsAuthenticated();
  if (!isAuthenticate) {
    showModal();
    return false;
  }
  else {
    return true;
  }
});