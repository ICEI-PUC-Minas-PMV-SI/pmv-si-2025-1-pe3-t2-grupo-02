async function criarCadastro(formulario) {
  let localSelecionado = [];
  const localCheckbox = document.querySelectorAll(
    'input[name="local"]:checked'
  );
  
  localCheckbox.forEach(function (checkbox) {
    localSelecionado.push(checkbox.value);
  }); 

  let tipoSelecionado = [];
  const tipoCheckbox = document.querySelectorAll(
    'input[name="tipo"]:checked'
  );
  
  tipoCheckbox.forEach(function (checkbox) {
    tipoSelecionado.push(checkbox.value);
  }); 
  
  const today = new Date();
  const parsedToday = today.toISOString().split('T')[0];
  const dados = {
    data_registro: parsedToday,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
    local: localSelecionado,  
    tipo: tipoSelecionado, 
  }

  let apiUrl;
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });

  fetch(`${apiUrl}/denuncias-focos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  }).then(res => console.log(res));   
    
  return true;
}




