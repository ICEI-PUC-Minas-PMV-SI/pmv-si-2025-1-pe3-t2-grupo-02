# 5. PLANO DE TESTES DE SOFTWARE
   
# 5 Avaliação de Usabilidade

Foram conduzidos dois tipos de testes com a aplicação desenvolvida neste projeto: a avaliação por observação de sessões de uso e a avaliação por inspeção. Os testes foram realizados por diferentes usuários, todos utilizando a mesma versão do sistema, disponível em [https://denguestatus.onrender.com](https://denguestatus.onrender.com). Esta seção apresenta uma síntese dos resultados obtidos durante essas avaliações.

## 5.1 Avaliação por observação de sessão de uso

Nesta avaliação, o sistema foi apresentado a seis usuários distintos, cada um acompanhado por avaliadores diferentes, com o objetivo de verificar o nível de entendimento e a usabilidade da aplicação desenvolvida.

A avaliação teve início com perguntas gerais sobre a plataforma. Constatou-se que nenhum dos participantes conhecia previamente o sistema Dengue Status. No entanto, apenas ao visualizar a página inicial, todos foram capazes de compreender que a aplicação se propõe a fornecer dados sobre a situação da dengue, bem como informações sobre sintomas e formas de prevenção. Além disso, os usuários presumiram que o sistema foi desenvolvido para o público geral interessados nessa doença e que sua criação estaria relacionada a alguma instituição da área da saúde.

Em seguida, os participantes foram convidados a realizar seis tarefas na plataforma. As atividades escolhidas representam funcionalidades voltadas aos usuários comuns, ou seja, à população em geral. Cada execução foi acompanhada e registrada pelo avaliador, que atribuiu uma pontuação de desempenho com base no grau de sucesso na realização das tarefas. O Quadro 6 apresenta o sistema de pontuação utilizado, enquanto o Quadro 7 mostra as tarefas propostas e os resultados obtidos por cada usuário.

### Sistema de pontuação

| Descrição                   | Pontuação |
|----------------------------|-----------|
| Não completou              | 0         |
| Completou com dificuldade ou ajuda | 1         |
| Completou facilmente        | 2         |

*Quadro 6: Sistema de pontuação com base no sucesso da execução da tarefa — Autores, 2025.*

### Resultados das tarefas realizadas

| Tarefas                                  | Usuário 01 | Usuário 02 | Usuário 03 | Usuário 04 | Usuário 05 | Usuário 06 |
|-----------------------------------------|------------|------------|------------|------------|------------|------------|
| Cadastrar no sistema                     | 2          | 2          | 2          | 2          | 1          | 1          |
| Reportar um caso de dengue               | 2          | 2          | 1          | 2          | 2          | 2          |
| Denunciar foco do mosquito da dengue    | 1          | 2          | 2          | 2          | 2          | 2          |
| Solicitar visita de agente de saúde     | 2          | 2          | 2          | 2          | 2          | 2          |
| Editar solicitação de visita de agente de saúde | 1   | 2          | 2          | 2          | 1          | 1          |
| Busca de unidade de saúde através do mapa aplicando filtros | 2 | 0          | 0          | 2          | 2          | 0          |

*Quadro 7: Pontuações obtidas em cada tarefa — Autores, 2025.*

---

A partir do Quadro 7, observa-se que todas as tarefas propostas foram concluídas, ainda que algumas tenham sido realizadas com dificuldade por alguns usuários. A exceção foi a atividade **Busca de unidade de saúde através do mapa aplicando filtros**, que metade dos participantes não conseguiu concluir com sucesso.

Durante o teste, os avaliadores identificaram problemas específicos nessa funcionalidade. Um deles está relacionado ao limite de zoom do mapa, que pode impedir a visualização dos postos de saúde. Além disso, o mapa não destaca claramente as Unidades Básicas de Saúde (como postos e hospitais), o que torna sua identificação menos intuitiva para o usuário.

O teste com os usuários que tiveram dificuldades na tarefa **Cadastrar no sistema** indicou a necessidade de aprimorar a visibilidade do acesso ao cadastro. Os avaliadores de dois participantes relataram dificuldade para se registrar, pois o botão de cadastro não estava suficientemente destacado na interface, o que comprometeu a usabilidade dessa funcionalidade.

Alguns usuários também apresentaram dificuldades na tarefa **Editar solicitação de visita de agente de saúde**. Embora todos tenham conseguido concluir a atividade, foi observado que metade dos participantes teve dificuldade para localizar a página de edição da solicitação, o que indica a necessidade de melhorar a sinalização dessa funcionalidade na interface.

Por fim, as principais tarefas que exigem o engajamento da população, sendo elas **Reportar caso de dengue**, **Denunciar foco** e **Solicitar visita de agente de saúde**, foram realizadas com sucesso e sem dificuldades pela maioria dos usuários. A única ressalva foi em relação à funcionalidade **Reportar um caso de dengue**, na qual foi identificado um possível problema na seleção da cidade. Em alguns casos, as opções disponíveis variam de forma inadequada conforme o estado selecionado, o que pode impedir o envio do relato. Trata-se, portanto, de um ponto crítico que merece atenção para garantir o bom funcionamento da plataforma.

Após a realização de todas as tarefas, os avaliadores aplicaram um questionário final com o objetivo de entender as impressões dos usuários após utilizarem o sistema. De forma geral, todos os participantes demonstraram uma percepção positiva sobre o Dengue Status, descrevendo-o como uma aplicação útil, bem-organizada e com bom design visual. Também consideraram as tarefas fáceis de realizar, o que indica que o sistema é viável para o uso cotidiano da população.

Os usuários destacaram que o sistema é relevante e atual, por abordar diretamente o combate à dengue, um problema de saúde pública recorrente. Entre os principais pontos positivos, foram mencionadas funcionalidades como o mapa interativo para localizar unidades de saúde, a possibilidade de solicitar visitas de agentes de saúde, e o incentivo à população para denunciar focos do mosquito. No entanto, o mapa foi citado com mais frequência como um ponto que precisa de melhorias. Pelos testes, a usabilidade e à clareza na exibição das unidades de saúde precisam ser aperfeiçoadas.

A maioria dos participantes considerou o sistema completo, sem sentir falta de funcionalidades adicionais. A única sugestão levantada foi a de informar ao usuário comum qual agente de saúde será responsável pela visita solicitada. Este é um requisito que pode ser adicionado para promover maior transparência e segurança para os usuários.

Ao final da avaliação, os usuários perceberam o Dengue Status como uma ferramenta para apoio ao combate à dengue, capaz de realizar denúncias de focos, reportar casos, buscar apoio local e fornecer informações atualizadas sobre a doença.

## 5.2 Avaliação por inspeção

Nesta avaliação, o sistema foi analisado com base nos dez princípios heurísticos de Nielsen, visando identificar problemas de usabilidade e oportunidades de melhoria.

### 5.2.1 Visibilidade do status do sistema

- O sistema não fornece feedback adequado durante interações críticas:
  - Os links no rodapé e cabeçalho não alteram o cursor para pointer nem exibem sublinhado, dificultando sua identificação como elementos clicáveis.
  - Após ações como registrar denúncias, não há confirmação visual (mensagens de sucesso ou spinners), deixando os usuários incertos sobre o êxito ou falha de suas ações.

### 5.2.2 Correspondência com o mundo real

- Foram identificadas inconsistências linguísticas e conceituais:
  - Campos de data aparecem em inglês.
  - Termos como "Modo Externo" (para alternância de temas) são incomuns.
  - Ao selecionar qualquer estado no mapa, o foco permanece em Brasília, gerando desorientação.

### 5.2.3 Controle e liberdade do usuário

- Os usuários carecem de mecanismos de reversão em ações críticas:
  - Exclusões de registros (casos/focos) não podem ser desfeitas.
  - O modal de atualização de status em "Solicitações de Visita" não fecha ao clicar em "Cancelar" ou "Salvar", aprisionando os usuários em estados indesejados.
  - O sistema não consegue correlacionar adequadamente estados e municípios brasileiros, impactando diretamente a usabilidade e impedindo de completar fluxos.

### 5.2.4 Consistência e padrões

- Observou-se inconsistências:
  - Botões para ações equivalentes usam rótulos diferentes ("Cadastrar" em "Reportar Caso" vs. "Registrar" em "Reportar Foco").
  - O botão "Encontrar Pontos de Saúde" na página “Informações” não executa nenhuma ação.

### 5.2.5 Prevenção de Erros

- O sistema apresenta deficiências na implementação de mecanismos preventivos de erro:
  - A necessidade de login só é informada após o preenchimento completo de formulários.
  - Mensagens de erro em campos obrigatórios estão em inglês.
  - Não há aviso ao sair de páginas com formulários editados não salvos.

### 5.2.6 Reconhecimento em vez de recordação

- A interface exige excessiva carga de memória dos usuários mantendo funções essenciais pouco visíveis ou inacessíveis:
  - A página "Listagem de Denúncias/Focos" só é acessada via "Solicitações de Visita".
  - A opção "Salvar Filtros" não é clara no seu contexto.

### 5.2.7 Flexibilidade e Eficiência de Uso

- Faltam atalhos para usuários experientes (ex.: teclas de acesso rápido). Ações primárias (denúncias, registros) estão ocultas no menu hambúrguer, dificultando o acesso para iniciantes.

### 5.2.8 Estética e Design Minimalista

- Há poluição visual significativa:
  - O modal de atualização de status abre automaticamente sem contexto relevante na página “Minhas visitas”.

### 5.2.9 Recuperação de Erros

- As mensagens de erro não fornecem instruções de correção para os usuários:
  - "Senha incorreta" não sugere verificações simples (ex.: Caps Lock Ativo).

### 5.2.10 Ajuda e Documentação

- O sistema não oferece suporte integrado: não há documentação, guias ou ajuda contextual.