// Assume-se que 'dados' e 'preencherTabela' de solicitacoesVisita.js são acessíveis globalmente.
// Se não forem, precisarão ser importados ou passados como parâmetros.

function abrirModalEdicao(itemId) { // Parâmetro alterado de idx para itemId
    const modal = document.getElementById('modal-editar');
    const selectStatus = document.getElementById('status-select');
    const btnSalvar = document.getElementById('salvar-edicao'); // Botão original
    const btnCancelar = document.getElementById('cancelar-edicao');

    // Encontra o item no array 'dados' pelo ID
    const itemParaEditar = dados.find(item => item.id === itemId);

    if (!itemParaEditar) {
        console.error("Item não encontrado para edição com ID:", itemId);
        return;
    }

    modal.dataset.editingItemId = itemId; // Armazena o ID do item que está sendo editado
    selectStatus.value = itemParaEditar.status; // Define o status atual no select

    modal.style.display = 'flex';

    // Para evitar múltiplos listeners, clonamos o botão salvar e adicionamos o evento ao clone.
    const novoBtnSalvar = btnSalvar.cloneNode(true);
    btnSalvar.parentNode.replaceChild(novoBtnSalvar, btnSalvar);

    novoBtnSalvar.addEventListener('click', () => {
        const currentItemId = modal.dataset.editingItemId;
        const itemOriginal = dados.find(item => item.id === currentItemId);

        if (itemOriginal) {
            itemOriginal.status = selectStatus.value; // Atualiza o status no array em memória

            // Para persistir a alteração, uma chamada fetch PATCH ou PUT seria necessária aqui.
            // Ex: const statusDb = mapStatusToDb(selectStatus.value); // Função para converter 'Pendente' para 'EM_ABERTO'
            // fetch(`caminho/para/api/solicitacoes/${currentItemId}`, {
            //   method: 'PATCH',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ status: statusDb }) // Envia o status no formato do backend
            // })
            // .then(response => response.json())
            // .then(() => {
            //    fecharModalEdicao();
            //    preencherTabela(); // Re-renderiza a tabela com dados atualizados do servidor (idealmente)
            // })
            // .catch(err => console.error("Erro ao salvar alteração no servidor", err));
            alert('Status atualizado localmente. A alteração não será salva no db.json sem integração com backend.');
            fecharModalEdicao();
            preencherTabela(); // Re-renderiza a tabela com o dado atualizado em memória
        }
    });

    // Adiciona listener ao botão cancelar (se ainda não tiver ou se for clonado também)
    const novoBtnCancelar = btnCancelar.cloneNode(true);
    btnCancelar.parentNode.replaceChild(novoBtnCancelar, btnCancelar);
    novoBtnCancelar.addEventListener('click', fecharModalEdicao);
}

function fecharModalEdicao() {
    const modal = document.getElementById('modal-editar');
    modal.style.display = 'none';
    delete modal.dataset.editingItemId; // Limpa o ID armazenado
}

// Fechar modal ao clicar fora dele
const modalEditar = document.getElementById('modal-editar');
if (modalEditar) {
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) { // Verifica se o clique foi no overlay e não no conteúdo do modal
            fecharModalEdicao();
        }
    });
}