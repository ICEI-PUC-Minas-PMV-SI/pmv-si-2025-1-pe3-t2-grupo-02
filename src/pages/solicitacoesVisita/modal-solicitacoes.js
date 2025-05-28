function abrirModalEdicao(idx) {
    const modal = document.getElementById('modal-editar');
    const selectStatus = document.getElementById('status-select');
    const btnSalvar = document.getElementById('salvar-edicao');
    modal.dataset.index = idx;
    selectStatus.value = dados[idx].status;
    modal.style.display = 'flex';
  
    btnSalvar.onclick = () => {
      dados[idx].status = selectStatus.value;
      fecharModalEdicao();
      preencherTabela();
    };
  }
  
  function fecharModalEdicao() {
    const modal = document.getElementById('modal-editar');
    modal.style.display = 'none';
  }
  
  window.onclick = (event) => {
    const modal = document.getElementById('modal-editar');
    if (event.target === modal) {
      fecharModalEdicao();
    }
  };
  