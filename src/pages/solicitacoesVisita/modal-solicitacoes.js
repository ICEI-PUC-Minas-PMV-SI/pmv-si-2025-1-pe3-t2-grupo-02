function abrirModalEdicao(itemId) {
  const modal = document.getElementById('modal-editar');
  const selectStatus = document.getElementById('status-select');
  
  const itemParaEditar = dados.find(item => item.id === itemId);
  if (!itemParaEditar) {
    console.error("Item não encontrado para edição com ID:", itemId);
    return;
  }

  modal.dataset.editingItemId = itemId;
  
  const statusParaSelect = mapStatusFromDb(itemParaEditar.status);
  selectStatus.value = statusParaSelect;
  
  modal.classList.add('show');
  modal.style.display = 'flex';
}

function fecharModalEdicao() {
  const modal = document.getElementById('modal-editar');
  modal.classList.remove('show');
  modal.style.display = 'none';
  delete modal.dataset.editingItemId;
}

function mapStatusToDb(displayStatus) {
  const statusMap = {
    "Pendente": "EM_ABERTO",
    "Em andamento": "EM_ANDAMENTO", 
    "Concluído": "CONCLUIDO"
  };
  return statusMap[displayStatus] || displayStatus;
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-editar');
  const btnSalvar = document.getElementById('salvar-edicao');
  const btnCancelar = document.getElementById('cancelar-edicao');

  btnSalvar.addEventListener('click', () => {
    const currentItemId = modal.dataset.editingItemId;
    const selectStatus = document.getElementById('status-select');
    const itemOriginal = dados.find(item => item.id === currentItemId);
    
    if (itemOriginal) {
      const statusDb = mapStatusToDb(selectStatus.value);
      itemOriginal.status = statusDb;
      
      console.log('Status atualizado localmente para:', statusDb);
      fecharModalEdicao();
      
      carregarSolicitacoes();
    }
  });

  btnCancelar.addEventListener('click', fecharModalEdicao);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      fecharModalEdicao();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      fecharModalEdicao();
    }
  });
});