# 3. DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE

## 3.1 Objetivos deste documento
Descrever e especificar as necessidades que devem ser atendidas pelo projeto Dengue Status, uma aplicação Web desenvolvida para atender à crescente demanda de cidadãos e agentes de saúde por informações acessíveis, precisas e atualizadas sobre a incidência de casos e focos de dengue no Brasil.

## 3.2 Escopo do produto

### 3.2.1 Nome do produto e seus componentes principais
O produto será denominado Dengue Status – uma aplicação Web composta por três módulos principais: 

Módulo de Monitoramento Epidemiológico: exibir dados registrados de casos de dengue e denúncia de foco, disponibiliza mapas de calor e permite o filtro por estado, município, período e bairro. 

Módulo Cidadão: voltado para o público geral, permite o cadastro, registro de casos, denúncias de focos de dengue e solicitação de visita de agentes de saúde. 

Módulo Agente de Saúde: oferece ferramentas para agentes consultarem e gerenciarem registros, denúncias e visitas agendadas, além de confirmar ações executadas. 

### 3.2.2 Missão do produto
Facilitar o monitoramento e a prevenção da dengue por meio da centralização de informações em tempo real, estimulando a participação ativa da população e a tomada de decisões estratégicas por gestores públicos e agentes de saúde, contribuindo para a redução da propagação da doença. 

### 3.2.3 Limites do produto
O Dengue Status não contempla: 

Diagnóstico clínico ou emissão de laudos médicos; 

Integração com sistemas internos de hospitais ou unidades de saúde para agendamento de atendimentos; 

Registro de outros agravos não relacionados à dengue; 

Comunicação em tempo real entre usuários e agentes de saúde (chat); 

Funcionalidades de pagamento, arrecadação ou doações. 

### 3.2.4 Benefícios do produto

| # | Benefício | Valor para o Cliente |
|--------------------|------------------------------------|----------------------------------------|
|1	| Visualização de casos de dengue e denúncia de foco em mapa |	Essencial |
|2 | Engajamento da população no combate à dengue | Essencial | 
|3 | Facilitação no registro de casos e denúncias | Essencial | 
|4	| Acesso rápido a informações educativas sobre dengue e prevenção	| Recomendável | 
|5	| Ferramenta de apoio à gestão pública em saúde	| Essencial | 

## 3.3 Descrição geral do produto

### 3.3.1 Requisitos Funcionais

| Código | Requisito Funcional (Funcionalidade) | Descrição |
|--------|--------------------------------------|-----------|
| RF-001 | Cadastro Usuário | A aplicação deve permitir que o usuário seja cadastrado informando dados pessoais, papel (usuário comum ou agente de saúde), CNES, email e senha. |
| RF-002 | Verificação CNES | A aplicação deve verificar a existência do CNES para o registro de agente de saúde a partir da API DEMAS do ministério da saúde. |
| RF-003 | Login Usuário | A aplicação deve permitir que o usuário realize login comparando seu email com o hash da senha dele. |
| RF-004 | Logout Usuário | A aplicação deve permitir que o usuário realize logout apagando o estado de autenticação do armazenamento local do navegador. |
| RF-005 | Recuperação Senha | A aplicação deve fornecer ao usuário a possibilidade de alterar sua senha em caso de esquecimento enviando um link de recuperação ao email dele. |
| RF-006 | Exigência de autenticação | A aplicação deve exigir autenticação do usuário para registrar casos e focos de dengue. |
| RF-007 | Registro Casos | A aplicação deve permitir que o usuário logado registre casos de dengue em sua região. |
| RF-008 | Registro Denúncias | A aplicação deve permitir que o usuário logado registre denúncias de foco em sua região. |
| RF-009 | Solicitar visita | A aplicação deve permitir que o usuário logado solicite visita de agente de saúde. |
| RF-010 | Cancelar visita solicitada | A aplicação deve permitir que o usuário que solicitou visita de agente de saúde possa cancelá-la. |
| RF-011 | Aceitar visita | A aplicação deve permitir que o usuário agente de saúde logado confirme ou negue solicitação de visita. |
| RF-012 | Cancelar visita aceita | A aplicação deve permitir que o usuário agente de saúde que confirmou solicitação de visita possa cancelá-la. |
| RF-013 | Confirmar visita | A aplicação deve permitir que o usuário comum e o usuário da saúde informe que a visita foi feita. |
| RF-014 | Visualizar visita | A aplicação deve apresentar solicitações de visitas aos agentes de saúde. |
| RF-015 | Histórico Denúncias | A aplicação deve apresentar o histórico de denúncias de foco realizadas. |
| RF-016 | Histórico Casos | A aplicação deve apresentar o histórico quantitativo de casos registrados no sistema. |
| RF-017 | Alerta E-mail | A aplicação deve enviar email de alerta automaticamente para usuários quando novos casos forem reportados no seu CEP. |
| RF-018 | Validação CEP | A aplicação deve ter endereços informados validados a partir de CEP via API pública. |
| RF-019 | Mapa de Calor | A aplicação deve apresentar mapa de calor com os dados de casos de dengue reportados no sistema. |
| RF-020 | Filtro Estadual | A aplicação deve oferecer um filtro a nível estadual para que os usuários pesquisem de forma mais precisa os casos de dengue de determinada região no mapa de calor. |
| RF-021 | Filtro Municipal | A aplicação deve oferecer um filtro a nível municipal para que os usuários pesquisem de forma mais precisa os casos de dengue de determinada região no mapa de calor. |
| RF-022 | Filtro Período | A aplicação deve oferecer um filtro por período para que os usuários pesquisem de forma mais precisa os casos de dengue de determinada região. |
| RF-023 | Unidades Próximas | A aplicação deve permitir a visualização geográfica (por meio de mapa) de unidades de saúde próximas ao usuário a nível nacional. |
| RF-024 | Filtro Municipal (Unidades) | A aplicação deve oferecer um filtro a nível municipal para que os usuários pesquisem de forma mais precisa as unidades de saúde de determinada região. |
| RF-025 | Filtro Bairro | A aplicação deve oferecer um filtro a nível de bairro para que os usuários pesquisem de forma mais precisa as unidades de saúde de determinada região. |
| RF-026 | Geolocalização | A aplicação deve solicitar acesso a geolocalização do usuário opcionalmente para exibir os dados da visualização geográfica baseada na localização atual do usuário. |
| RF-027 | Informação Prevenção | A aplicação deve possuir informações a respeito da prevenção da doença e do combate à proliferação do seu vetor. |
| RF-028 | Legenda Estadual | Uma legenda deve ser exibida sobre uma região com informações dos focos de dengue a nível estadual quando o usuário clicar sobre ela. |
| RF-029 | Legenda Municipal | Uma legenda deve ser exibida sobre uma região com informações dos focos de dengue a nível municipal quando o usuário clicar sobre ela. |
| RF-030 | Sobre Plataforma | A aplicação deve apresentar os idealizadores, um meio de contato com eles e a motivação da criação da plataforma. |
| RF-031 | Editar Denúncias | A aplicação deve permitir que o usuário logado edite suas denúncias de foco registradas. |
| RF-032 | Excluir Denúncias | A aplicação deve permitir que o usuário logado exclua suas denúncias de foco registradas. |
| RF-033 | Mensagem de feedback | Em caso de erro de comunicação com o servidor, falha na validação de formulário ou em caso de êxito em um registro, a aplicação deve exibir uma mensagem de feedback na tela do usuário, indicando se a operação foi bem-sucedida ou se houve um erro. |
| RF-034 | Listagem de denúncias | Agentes de saúde poderão visualizar a listagem de todas as denúncias de casos a partir de uma tabela com filtros por Período e Local. |
| RF-035 | Listagem de registros de casos de dengue | Agentes de saúde poderão visualizar a listagem de todos os registros de casos a partir de uma tabela com filtros por Período e Local. |
| RF-036 | Editar caso de dengue | A aplicação deve permitir que o usuário logado edite informações sobre os casos de dengue registrados. |
| RF-037 | Excluir caso de dengue | A aplicação deve permitir que o usuário logado exclua casos de dengue registrados. |
| RF-038 | Ver histórico de casos registrados | A aplicação deve permitir que o usuário visualize o histórico de casos de dengue registrados por ele. |
| RF-039 | Configuração de preferências de notificações | O sistema deve permitir que o Agente de Saúde configure suas preferências de notificações. |
| RF-040 | Exibição Página Inicial | A aplicação deve exibir a página inicial ao usuário após o login, contendo um resumo visual dos principais dados e funcionalidades, como o mapa de calor, histórico de casos e acesso rápido às seções de denúncia e solicitação de visita. |
| RF-041 | Navegação a partir da Página Inicial | A aplicação deve permitir que o usuário navegue a partir da página inicial para outras funcionalidades, como cadastro de denúncias, visualização do mapa de calor, e informações sobre prevenção da dengue, por meio de botões e links claramente identificados. |
| RF-042 | Atualização dinâmica dos dados na Página Inicial | A aplicação deve atualizar dinamicamente os dados exibidos na página inicial, como número de casos registrados e denúncias recentes, utilizando chamadas à API sem necessidade de recarregar a página. |
| RF-043 | Exibição de informações sobre prevenção | A página inicial deve apresentar uma seção com informações claras e atualizadas sobre prevenção da dengue, incluindo texto e imagens ilustrativas. |
| RF-044 | Acesso rápido para solicitação de visita | A página inicial deve possuir um botão ou link de fácil acesso para que o usuário possa solicitar visita de agente de saúde diretamente. |

### 3.3.2 Requisitos Não Funcionais

| Código   | Restrição | Descrição |
|----------|-----------|-----------|
| RNF-001  | Ambiente  | A aplicação deve ser responsiva para mobile e desktop. |
| RNF-002  | Precisão  | A aplicação deve exibir os dados fornecidos pelos usuários com fidelidade. |
| RNF-003  | Segurança | A aplicação deve ser segura, implementando medidas de segurança robustas para proteger os dados dos usuários. |
| RNF-004  | Segurança | Conformidade com a Lei Geral de Proteção de Dados. |

### 3.3.3 Usuários 

| # | Ator                  | Descrição |
|---|-----------------------|-----------|
| 1 | Usuário comum (cidadão) | Usuário que utiliza a plataforma para registrar casos e focos de dengue e manter-se informado acerca de sua região. Ele pode se cadastrar, realizar login e acessar funcionalidades como visualizações geográficas, registro de casos, denúncias de focos e solicitação de visita de um agente de saúde. Esses usuários também podem visualizar dados históricos, editar seus registros de denúncias e casos, e receber alertas por e-mail. |
| 2 | Usuário Agente de saúde | Usuário cuja entrada no sistema envolve uma validação específica (verificação do CNES via API do Ministério da Saúde). Além de realizar login e logout, os agentes de saúde têm funções voltadas à gestão das visitas: eles podem confirmar ou negar solicitações de visita e, juntamente com os usuários comuns, informar a conclusão das visitas. Esse perfil também pode acessar as funcionalidades de visualização geográfica do sistema e receber comunicações por e-mail. |


## 3.4 Modelagem do Sistema

### 3.4.1 Diagrama de Casos de Uso
3.4.1.1 Casos de uso da entidade foco de dengue 

Conforme evidenciado no diagrama de casos da Figura 1, o usuário logado (e somente se estiver logado) poderá: 1) registrar um novo caso de foco; 2) visualizar o histórico de denúncias de focos realizadas; 3) observar mais informações, em formato de tooltip, sobre o foco, ao clicar sobre uma região no mapa, tanto a nível estadual quanto municipal.  

Figura 1: Diagrama de Casos de Uso da Entidade Foco de Dengue. 

![diagrama-foco-dengue](https://github.com/user-attachments/assets/4185cc95-bd52-4a12-9438-978608ab3530)
Fonte: Autores, 2025 

3.4.1.2 Casos de uso da entidade caso de dengue 

A Figura 2 apresenta o diagrama de casos de uso relacionados ao registro e gerenciamento de casos de dengue. O usuário comum, logado no sistema, pode registrar um novo caso de dengue, editar ou excluir um caso previamente registrado. Além disso, o usuário tem a opção de visualizar o histórico de casos registrados, bem como acessar estatísticas dos casos de dengue cadastrados no sistema. 

Figura 2: Diagrama de Casos de Uso - Gerenciamento de casos de dengue. 

![diagrama-caso-dengue](https://github.com/user-attachments/assets/7ebe79c0-a475-49ba-b7f3-e5401ab652ff)
Fonte: Autores, 2025 

3.4.1.3 Casos de uso da entidade usuário comum 

A Figura 3 apresenta o diagrama de casos de uso relacionados ao usuário comum. O usuário tem a opção de realizar o cadastro através de seus dados pessoais e fazer o login através dos dados informados. Ele também pode alterar sua senha através do email e realizar o logout. Ao estar logado, o usuário pode adicionar e visualizar informações a respeito da prevenção da doença e do combate à proliferação do mosquito vetor. O usuário também poderá visualizar informações sobre os idealizadores do projeto e a motivação por trás dele, além de uma forma de contato com eles. 

Figura 3: Diagrama de Casos de Uso do Usuário Comum. 

![diagrama-usuario-comum](https://github.com/user-attachments/assets/67f9d8e4-30fe-4e05-b89f-1ab2c14d20aa)
Fonte: Autores, 2025 

3.4.1.4 Casos de uso da entidade agente de saúde 

No contexto da Figura 4, é apresentado um diagrama de caso de uso UML que ilustra as funcionalidades disponíveis para o ator "Agente de Saúde" em um sistema de informação em saúde. O diagrama demonstra a interação do usuário com quatro funcionalidades principais, representadas por elipses: 

O ator "Agente de Saúde" pode realizar seu cadastro mediante validação do código CNES (Cadastro Nacional de Estabelecimentos de Saúde). 

O sistema permite ao agente receber notificações automáticas via e-mail sobre novos casos, registros adicionados e atualizações de visitas realizadas. 

O ator possui permissão para acessar uma visualização detalhada de todas as denúncias por meio de uma interface de listagem específica. 

O sistema oferece ao agente a capacidade de visualizar detalhadamente os registros específicos de dengue através de uma página de listagem dedicada. 

Este diagrama evidencia a arquitetura funcional do sistema, destacando as principais operações que o Agente de Saúde pode executar. 

 
Figura 4: Diagrama de Casos de Uso do Agente de Saúde.

![diagrama-agente-saude](https://github.com/user-attachments/assets/172cddc3-e975-4455-863e-ca6d103d9c19)
Fonte: Autores, 2025 

3.4.1.5 Casos de uso da entidade solicitação de visita 

A Figura 5 apresenta o diagrama de casos de uso relacionados às visitas de agentes de saúde. O usuário comum, logado no sistema, pode solicitar uma visita de agente de saúde a sua residência. O agente de saúde logado, por sua vez, poderá aceitar ou recusar às solicitações de visitas apresentadas para a sua região de atendimento. Ao aceitar ou recusar à solicitação, o usuário comum, que fez o requerimento, será atualizado sobre a resposta do agente de saúde. Ambos os usuários comuns e os agentes de saúde poderão confirmar que a visita foi realizada. 

Figura 5: Diagrama de Casos de Uso - Gerenciamento de visitas de agentes de saúde. 

![diagrama-visita-saude](https://github.com/user-attachments/assets/102bc944-be85-4b4a-889a-6f3e54ff26f2)
Fonte: Autores, 2025


### 3.4.2 Descrições de Casos de Uso

3.4.2.1 Descrições dos casos de uso de foco de dengue
Denunciar Foco (CSU01) 
Sumário:
 O Usuário Comum autenticado registra um novo caso de foco de dengue em sua região.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado no sistema.
•	A página de “Denunciar Foco” deve estar acessível.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação com sucesso.
2.	O Usuário seleciona a opção “Denunciar Foco” na página inicial.
3.	O Sistema apresenta o formulário para registro do foco de dengue.
4.	O Usuário preenche os campos obrigatórios (por exemplo, endereço, data, descrição) e confirma o registro.
5.	O Sistema valida os dados inseridos; se estiverem corretos, o registro é ar-mazenado e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Validação de Dados
•	Se o Usuário deixar campos obrigatórios em branco ou inserir dados inváli-dos:
 4.a. O Sistema exibe mensagens de erro indicando os campos que preci-sam ser corrigidos.
 4.b. O Usuário ajusta as informações e reenvia o formulário.
Fluxo Alternativo (2): Cancelamento do Registro
•	Se o Usuário optar por cancelar o registro:
 3.a. O Usuário sai ou fecha a aba do formulário.
 3.b. O Sistema descarta quaisquer informações preenchidas e retorna à página principal (caso o usuário tenha voltado e não fechado a aba do na-vegador).
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 5.a. O Sistema exibe uma mensagem de erro informando o problema.

Pós-condições:
•	Um novo caso de foco de dengue é registrado no sistema.
•	O Usuário recebe a confirmação da denúncia.
Visualizar Histórico de Denúncias (CSU02)
Sumário:
O Usuário Comum consulta o histórico de denúncias de focos de dengue já regis-tradas.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	Deve existir pelo menos uma denúncia registrada no sistema.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Histórico de Denúncias” no menu.
3.	O Sistema recupera e exibe uma lista de denúncias realizadas, contendo informações resumidas (por exemplo, data, localização e status).
Fluxo Alternativo (1): Sem Registros
•	Se não houver nenhuma denúncia registrada:
 3.a. O Sistema informa que não existem registros de denúncias.
Fluxo Alternativo (2): Filtragem e Ordenação
•	O Usuário pode optar por filtrar ou ordenar os registros (por data ou locali-dade):
 3.b. O Sistema atualiza a lista conforme os critérios selecionados.
Pós-condições:
•	O Usuário visualiza o histórico de denúncias, podendo acessar detalhes de cada registro.

Visualizar Informações Detalhadas no Mapa (CSU03)
Sumário:
 O Usuário Comum visualiza informações detalhadas dos focos de dengue em um mapa interativo, através de tooltips ao clicar em regiões específicas (nível es-tadual ou municipal).
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O sistema deve apresentar a visualização do mapa interativo com os dados de focos atualizados.
Fluxo Principal:
1.	O Usuário seleciona a opção “Visualizar Mapa” no menu principal.
2.	O Sistema apresenta o mapa interativo com as regiões destacadas.
3.	O Usuário clica em uma região do mapa.
4.	O Sistema exibe uma tooltip contendo informações detalhadas sobre os fo-cos de dengue na região (podendo ser a nível estadual ou municipal, con-forme o zoom ou a seleção).
Fluxo Alternativo (1): Falha no Carregamento do Mapa
•	Se o mapa não carregar corretamente devido a problemas técnicos:
 3.a. O Sistema exibe uma mensagem de erro e orienta o Usuário a recarre-gar a página ou tentar novamente mais tarde.
Fluxo Alternativo (2): Região Sem Dados
•	Se a região selecionada não possuir registros de focos:
 5.a. O Sistema exibe uma tooltip informando que não há dados disponíveis para aquela região.
Pós-condições:
•	O Usuário visualizou informações detalhadas sobre os focos de dengue na região selecionada, ou recebeu uma mensagem informativa caso não haja dados.

Editar Denúncia de Foco (CSU04)
Sumário:
O Usuário Comum autenticado edita uma denúncia de foco de dengue previa-mente registrada por ele próprio.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
•	Deve existir pelo menos uma denúncia registrada associada ao Usuário.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Histórico de Denúncias” no menu.
3.	O Sistema exibe uma lista de denúncias, diferenciando as que foram regis-tradas pelo usuário das que não foram.
4.	O Usuário seleciona uma denúncia de sua autoria para edição.
5.	O Sistema apresenta o formulário preenchido com os dados atuais da de-núncia.
6.	O Usuário altera os dados desejados e confirma a edição.
7.	O Sistema valida os dados e, se estiverem corretos, atualiza o registro e exibe uma mensagem de sucesso.
Fluxo Alternativo (1): Dados Inválidos
•	Se o Usuário inserir dados inválidos no formulário:
 6.a. O Sistema exibe mensagens de erro informando quais campos preci-sam ser corrigidos.
 6.b. O Usuário ajusta as informações e reenvia o formulário.
Fluxo Alternativo (2): Cancelamento da Edição
•	Se o Usuário decidir não continuar com a edição:
6.a. O usuário sai ou fecha a aba do formulário.
6.b. O Usuário clica no botão “Cancelar”.
6.c. O Sistema descarta quaisquer alterações feitas e retorna à lista de de-núncias.
Fluxo de Exceção:
•	Se houver falha de comunicação com o servidor durante a edição:
 7.a. O Sistema exibe uma mensagem de erro.
Pós-condições:
•	A denúncia foi atualizada com sucesso no sistema.
•	O Usuário recebeu uma confirmação da alteração.
Excluir Denúncia de Foco (CSU05)
Sumário:
 O Usuário Comum autenticado exclui uma denúncia de foco de dengue previa-mente registrada por ele próprio.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
•	Deve existir pelo menos uma denúncia registrada associada ao Usuário.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Histórico de Denúncias” no menu.
3.	O Sistema exibe uma lista de denúncias, diferenciando as que foram regis-tradas pelo usuário das que não foram.
4.	O Usuário seleciona uma denúncia para exclusão.
5.	O Sistema exibe um alerta de confirmação para o Usuário.
6.	O Usuário confirma a exclusão da denúncia.
7.	O Sistema remove a denúncia e exibe uma mensagem de sucesso.
Fluxo Alternativo (1): Cancelamento da Exclusão
•	Se o Usuário decidir não excluir a denúncia:
5.a O usuário sai ou fecha a aba do registro.
5.b. O Usuário cancela a operação no alerta de confirmação.
5.c. O Sistema mantém a denúncia no histórico e retorna à lista.
Fluxo de Exceção:
•	Se houver falha de comunicação com o servidor durante a exclusão:
 7.a. O Sistema exibe uma mensagem de erro.
Pós-condições:
•	A denúncia foi removida com sucesso do sistema.
•	O Usuário recebeu a confirmação da exclusão.

3.4.2.2 Descrições dos casos de uso de caso de dengue
Registrar Caso de Dengue (CSU01)
Sumário:
 O Usuário Comum registra um novo caso de dengue ao relatar sintomas ou con-firmação médica.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado no sistema.
•	A página “Reportar caso” deve estar acessível.
Fluxo Principal:
1.	O Usuário acessa o sistema e realiza autenticação.
2.	O Usuário seleciona a opção “Reportar caso”.
3.	O Sistema exibe o formulário de registro de caso.
4.	O Usuário preenche os campos obrigatórios (data, sintomas, confirmação médica, localização, etc) e confirma o registro.
5.	O Sistema valida os dados, armazena o caso e exibe uma mensagem de sucesso.
Fluxo Alternativo (1): Campos em branco
•	4.a. Caso os campos estejam em branco, o Sistema alerta sobre esses campos.
•	4.b. O Usuário preenche os dados e reenvia o formulário.
Fluxo Alternativo (2): Cancelamento do Registro
•	3.a. O Usuário pode cancelar a operação.
•	3.b. O Sistema retorna à página inicial, descartando os dados preenchidos.
Fluxo de Exceção: 
•	Em caso de falha na comunicação com o servidor durante o registro: 
  5.a. O Sistema exibe uma mensagem de erro informando o problema
Pós-condições:
•	O novo caso de dengue é salvo no sistema e vinculado ao usuário.
•	O Usuário recebe confirmação do registro.




Editar Caso de Dengue (CSU02)
Sumário:
 O Usuário Comum edita um caso de dengue previamente registrado por ele.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
•	Deve haver ao menos um caso de dengue registrado por ele.
Fluxo Principal:
1.	O Usuário autentica-se no sistema.
2.	Acessa o histórico de casos registrados.
3.	Seleciona um dos casos, registrados por ele, para edição.
4.	O Sistema exibe o formulário com os dados atuais.
5.	O Usuário realiza as alterações e confirma.
6.	O Sistema valida os dados e, se estiverem corretos, atualiza o registro e exibe uma mensagem de sucesso.
Fluxo Alternativo (1): Dados Inválidos
•	5.a. O Sistema aponta campos incorretos.
•	5.b. O Usuário corrige os dados e reenviar.
Fluxo Alternativo (2): Cancelamento da Edição
•	4.a. O Usuário cancela a operação ou fecha o formulário.
•	4.b. O Sistema descarta as mudanças.
Fluxo de Exceção:
•	6.a. Falha no servidor impede a edição, sendo exibida uma mensagem de erro.
Pós-condições:
•	O caso de dengue é atualizado.
•	O Usuário visualiza a confirmação da alteração.


Excluir Caso de Dengue (CSU03)
Sumário:
 O Usuário Comum exclui um caso de dengue previamente registrado.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
•	Deve haver ao menos um caso registrado por ele.
Fluxo Principal:
1.	O Usuário acessa o sistema e autentica-se.
2.	Vai ao histórico de casos.
3.	Seleciona um caso para excluir.
4.	O Sistema pede confirmação.
5.	O Usuário confirma.
6.	O Sistema exclui o caso e exibe mensagem de sucesso.
Fluxo Alternativo (1): Cancelamento da Exclusão
•	4.a. O Usuário opta por cancelar a exclusão.
•	4.b. O Sistema mantém o caso e retorna ao histórico.
Fluxo de Exceção:
•	6.a. Caso haja falha técnica, uma mensagem de erro é exibida.
Pós-condições:
•	O caso de dengue é removido.
•	O Usuário é notificado da exclusão.


Ver Histórico de Casos Registrados (CSU04)
Sumário:
 O Usuário Comum visualiza todos os casos de dengue registrados por ele.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o sistema e autentica-se.
2.	Seleciona a opção “Histórico de Casos”.
3.	O Sistema exibe uma lista com os registros do Usuário.
Fluxo Alternativo (1): Nenhum Caso Encontrado
•	3.a. O Sistema informa que não há registros.
Fluxo Alternativo (2): Filtragem e Ordenação
•	3.b. O Usuário pode aplicar filtros (data, status etc).
•	3.c. O Sistema atualiza a lista.
Pós-condições:
•	O Usuário visualiza os casos e pode acessar detalhes ou opções de edi-ção/exclusão.



Visualizar Estatísticas dos Casos (CSU5)
Sumário:
 O Usuário Comum visualiza estatísticas sobre os casos de dengue em um mapa interativo ao clicar em regiões específicas (nível estadual ou municipal).
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O sistema deve apresentar a visualização do mapa interativo com os dados de focos atualizados. 
Fluxo Principal:
1.	O Usuário seleciona a opção “Visualizar Mapa” no menu principal.
2.	O Sistema apresenta o mapa interativo com as regiões destacadas.
3.	O Usuário clica em uma região do mapa.
4.	O Sistema exibe uma tooltip contendo informações detalhadas sobre os casos de dengue na região (podendo ser a nível estadual ou municipal, conforme o zoom ou a seleção). 
Fluxo Alternativo (1): Falha no Carregamento do Mapa 
•	Se o mapa não carregar corretamente devido a problemas técnicos: 
  3.a. O Sistema exibe uma mensagem de erro e orienta o Usuário a recar-regar a página ou tentar novamente mais tarde. 
Fluxo Alternativo (2): Região Sem Dados 
•	Se a região selecionada não possuir registros de focos: 
  5.a. O Sistema exibe uma tooltip informando que não há dados disponí-veis para aquela região. 
Pós-condições: 
•	O Usuário visualizou informações detalhadas sobre os focos de dengue na região selecionada, ou recebeu uma mensagem informativa caso não haja dados. 


3.4.2.3 Descrições dos casos de uso do usuário comum
Cadastro através de dados pessoais (CSU01)
Sumário:
 O Usuário faz seu cadastro usando seus dados pessoais.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	Os dados devem ser válidos.
•	O Usuário deve utilizar dados que não foram cadastrados ainda.
Fluxo Principal:
1.	O usuário acessa a página de cadastro.
2.	Preenche o formulário com dados pessoais (ex.: nome, e-mail, senha, etc.).
3.	Confirma as informações inseridas.
4.	Envia o formulário para o sistema.
5.	O sistema valida os dados e, se estiverem corretos, cria a conta.
6.	Exibe uma mensagem de sucesso ou, em caso de erro, orienta sobre a correção necessária.
Fluxo de Exceção:
•	Se os dados não forem válidos ou já tiverem sido utilizados:
 7.a. O Sistema exibe uma mensagem de erro.
Pós-condições:
•	O Usuário realizou seu cadastro no site.
•	O Usuário recebeu a confirmação do cadastro.   
Login através dos dados cadastrados (CSU02)
Sumário:
 O Usuário faz seu login usando os dados cadastrados.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	Os dados devem ser válidos.
•	O Usuário deve utilizar dados que já foram cadastrados.
Fluxo Principal:
7.	O usuário acessa a página de login.
8.	Insere e-mail e senha previamente cadastrados.
9.	Clica no botão de login.
10.	O sistema verifica se os dados estão corretos.
11.	Se forem válidos, o usuário é autenticado e redirecionado para a área principal da plataforma.
12.	Caso contrário, uma mensagem de erro é exibida.
Fluxo de Exceção:
•	Se os dados não forem válidos ou não foram cadastrados ainda:
 13.a. O Sistema exibe uma mensagem de erro.
Pós-condições:
•	O Usuário realizou seu login no site.  
Logout (CSU03)
Sumário:
 O Usuário faz seu login usando os dados cadastrados.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O usuário deve estar logado no Sistema..

Fluxo Principal:
13.	O usuário, já logado, acessa o menu de opções.
14.	Seleciona a opção "Logout" ou "Sair".
15.	O sistema encerra a sessão do usuário.
16.	O usuário é redirecionado para a tela inicial ou de login.
Fluxo de Exceção:
•	Não se aplica.
Pós-condições:
•	O Usuário realizou seu logout no site.  
Alteração da senha de login através do email (CSU04)
Sumário:
O Usuário altera sua senha através do email usado no cadastro.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O usuário deve possuir um cadastro.
Fluxo Principal:
17.	O usuário acessa a opção "Esqueci minha senha" ou "Alterar senha".
18.	Informa o e-mail cadastrado na plataforma.
19.	Recebe no e-mail um link ou código para redefinir a senha.
20.	Acessa o link, insere a nova senha e confirma a alteração.
21.	O sistema salva a nova senha e confirma a alteração ao usuário.
Fluxo de Exceção:
•	Se os dados não forem válidos ou não foram cadastrados ainda:
 22.a. O Sistema exibe uma mensagem de erro.
Pós-condições:
•	O Usuário alterou sua senha.
Adicionar e visualizar informações de prevenção e combate ao vetor da doença (CSU05)
Sumário:
O Usuário adiciona e visualiza informações de prevenção e combate ao vetor da doença.
Ator Primário:
Usuário Comum
Ator Secundário:
Não se aplica
Pré-condições:
•	O usuário deve estar logado no Sistema.
Fluxo Principal:
22.	O usuário logado acessa a área de informações.
23.	Pode escolher entre:
24.	Visualizar conteúdos já cadastrados (ex.: textos, imagens, dicas de pre-venção).
25.	Adicionar novas informações, preenchendo um formulário específico.
26.	Se adicionar, o sistema salva a nova informação após validação.
27.	As informações ficam disponíveis para todos os usuários visualizarem.
Fluxo de Exceção:
•	Não se aplica.
Pós-condições:
•	O Usuário adicionou e visualizou informações de prevenção e combate ao vetor da doença.
Visualizar os idealizadores do projeto, motivações da criação da plata-forma e contato com os mesmos (CSU06)
Sumário:
O Usuário visualiza os idealizadores do projeto, motivações da criação da plata-forma e contato com os mesmos.
Ator Primário:
Usuário Comum
Ator Secundário:
Não se aplica
Pré-condições:
•	O usuário deve estar logado no Sistema.
Fluxo Principal:
28.	O usuário acessa a seção "Sobre o Projeto" ou similar.
29.	Visualiza uma lista com os idealizadores do projeto.
30.	Lê sobre as motivações que levaram à criação da plataforma.
31.	Acessa informações de contato para falar com os idealizadores (e-mail, redes sociais etc.).
Fluxo de Exceção:
•	Não se aplica.
Pós-condições:
•	Visualizou os idealizadores do projeto, motivações da criação da plataforma e contato com eles.

3.4.2.5 Descrições dos casos de uso de solicitação de visita
Solicitar Visita de Agente de Saúde (CSU00)
Sumário:
O Usuário Comum, logado no sistema, solicita visita de agente de saúde.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Usuário Agente de Saúde
Pré-condições:
•	O Usuário deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Solicitar Visita” no menu.
3.	O Sistema exibe um formulário para o usuário preencher os campos obriga-tórios de Data, Turno, Endereço, CEP e Motivo.
4.	O Sistema valida os dados inseridos; se estiverem corretos, a solicitação é registrada e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Validação de Dados
•	Se o Usuário deixar campos obrigatórios em branco ou inserir CEP inváli-do:
 4.a. O Sistema exibe mensagens de erro indicando os campos que preci-sam ser corrigidos.
 4.b. O Usuário ajusta as informações e reenvia o formulário.
Fluxo Alternativo (2): Cancelamento da Solicitação
•	Se o Usuário optar por cancelar a solicitação:
 3.a. O Usuário sai ou fecha a aba do formulário.
 3.b. O Sistema descarta quaisquer informações preenchidas e retorna à página principal (caso o usuário tenha voltado e não fechado a aba do na-vegador).
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 5.a. O Sistema exibe uma mensagem de erro informando o problema.
 5.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	Uma nova solicitação de visita de agente de saúde é registrada no sistema.
•	O Usuário recebe a confirmação da solicitação.

Cancelar Visita de Agente de Saúde (CSU00)
Sumário:
O Usuário Comum, logado no sistema, cancela visita de agente de saúde que foi previamente solicitada.
Ator Primário:
 Usuário Comum
Ator Secundário:
 Usuário Agente de Saúde
Pré-condições:
•	O Usuário deve estar autenticado.
•	O Usuário deve ter solicitado uma visita
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Minhas Visitas” no menu.
3.	O Usuário clica na visita solicitada que ainda não ocorreu.
4.	O Sistema abre os detalhes da visita.
5.	O Usuário clica no botão de Cancelar a visita
6.	O Sistema abre uma caixa de texto com a opção de confirmar a ação.
7.	O Usuário confirma.
8.	O Sistema registra a ação do usuário e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Desistir do Cancelamento
•	Se o Usuário optar por desistir do cancelamento:
 7.a. O Usuário fecha a caixa de texto de confirmação da ação .
 7.b. O Sistema volta a exibir apenas os detalhes da solicitação de visita
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o cancelamento da visita:
 8.a. O Sistema exibe uma mensagem de erro informando o problema.
 8.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	A solicitação de visita de visita é deletada do sistema.
•	Se a visita já tiver sido aceita por um agente de saúde, ele receberá um email notificando o cancelamento da visita. 


Aceitar Solicitação de Visita (CSU00)
Sumário:
O Usuário Agente de Saúde, logado no sistema, aceita a solicitação de uma visita.
Ator Primário:
 Usuário Agente de Saúde
Ator Secundário:
 Usuário Comum
Pré-condições:
•	O Usuário agente de saúde deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Visitas Solicitadas” no menu.
3.	O Sistema exibe uma lista de solicitação de visitas com Data, Hora, Ende-reço da visita e Motivo.
4.	O Usuário escolhe uma solicitação que deseja aceitar à solicitação de visi-ta.
5.	O Sistema exibe uma caixa de texto com as opções Aceitar e Recusar.
6.	O Usuário aceita a solicitação de visita.
7.	O Sistema registra a resposta do usuário e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Cancelamento da Operação de Aceitar Visita
•	Se o Usuário optar por cancelar a operação:
 6.a. O Usuário sai ou fecha a caixa de texto.
 6.b. O Sistema retorna à página de visitas solicitadas.
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 7.a. O Sistema exibe uma mensagem de erro informando o problema.
 7.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	Uma visita de agente de saúde é aceita no sistema.
•	O Usuário recebe a resposta da sua solicitação de visita no sistema e via email.


Recusar Solicitação de Visita (CSU00)

Sumário:
O Usuário Agente de Saúde, logado no sistema, recusa a solicitação de uma visi-ta.
Ator Primário:
 Usuário Agente de Saúde
Ator Secundário:
 Usuário Comum
Pré-condições:
•	O Usuário agente de saúde deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Visitas Solicitadas” no menu.
3.	O Sistema exibe uma lista de solicitação de visitas com Data, Hora, Ende-reço da visita e Motivo.
4.	O Usuário escolhe uma solicitação que deseja recusar à solicitação de visi-ta.
5.	O Sistema exibe uma caixa de texto com as opções Aceitar e Recusar.
6.	O Usuário recusa a solicitação de visita.
7.	O Sistema exibe o campo obrigatório de Motivo com botões de opções “In-disponível nesse turno” e “Outro”, o campo obrigatório de Instruções e o bo-tão Finalizar.
8.	O usuário seleciona o motivo.
9.	O usuário escreve as instruções de como o usuário que solicitou a visita deve proceder, como por exemplo “Marque a visita para um dos tais dias”, “Evite a água parada em pratos de vasos de planta, pneus e garrafas”, “Procure o posto de saúde mais próximo”.
10.	O usuário clica em Finalizar.
11.	O Sistema registra a resposta do usuário e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Cancelamento da Operação de Recusar Visita
•	Se o Usuário optar por cancelar a operação:
 6.a. O Usuário sai ou fecha a caixa de texto.
 6.b. O Sistema retorna à página de visitas solicitadas.
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 11.a. O Sistema exibe uma mensagem de erro informando o problema.
 11.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	Uma visita de agente de saúde é negada no sistema.
•	O Usuário recebe a resposta da sua solicitação de visita no sistema e via email.


Cancelar Solicitação de Visita Aceita (CSU00)
Sumário:
O Usuário Agente de Saúde, logado no sistema, cancela a solicitação de uma vi-sita que foi previamente aceita.
Ator Primário:
 Usuário Agente de Saúde
Ator Secundário:
 Usuário Comum
Pré-condições:
•	O Usuário agente de saúde deve estar autenticado.
•	O Usuário agente de saúde deve ter aceitado a uma solicitação de visita.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Minhas Visitas” no menu.
3.	O Sistema exibe a lista de visitas do usuário.
4.	O Usuário seleciona a visita aceita que deseja cancelar.
5.	O Sistema exibe os detalhes da visita.
6.	O Usuário clica no botão de cancelar visita.
7.	O Sistema exibe uma caixa de texto com a opção confirmar.
8.	O Usuário confirma a ação de cancelar a visita.
9.	O Sistema registra a ação do usuário e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Desistir de cancelar a visita
•	Se o Usuário optar por desistir de cancelar a solicitação de visita aceita:
 8.a. O Usuário sai ou fecha a caixa de texto.
 8.b. O Sistema volta a exibir apenas os detalhes da solicitação de visita
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 9.a. O Sistema exibe uma mensagem de erro informando o problema.
 9.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	A solicitação de visita volta para o estado Em Aberto.
•	O sistema avisa ao usuário que solicitou a visita que ela foi cancelada e es-tá em aberto novamente.


Confirmar Visita Realizada (CSU00)
Sumário:
O Usuário, logado no sistema, confirma que a visita de agente de saúde foi reali-zada.
Ator Primário:
 Usuário agente de saúde e Usuário comum
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Minhas visitas” no menu.
3.	O Sistema exibe visitas marcadas.
4.	O Usuário escolhe a visita agendada em questão
5.	O Sistema exibe uma caixa de texto com “Essa visita foi realizada?” e as opções “Sim” e “Não”.
6.	O Usuário informa se a visita foi realizada.
7.	O Sistema registra a resposta do usuário e uma mensagem de confirmação é exibida.
Fluxo Alternativo (1): Cancelamento da Operação de Confirmar Visita Realiza-da
•	Se o Usuário optar por cancelar a operação:
 6.a. O Usuário sai ou fecha a caixa de texto.
 6.b. O Sistema retorna à página de “Minhas visitas”.
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor durante o registro:
 8.a. O Sistema exibe uma mensagem de erro informando o problema.
 8.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	Uma visita de agente de saúde, agendada no sistema, é confirmada se foi atendida quando o usuário que solicitou a visita e o usuário agente de sa-úde confirmam a visita.

Visualizar Visitas Solicitadas (CSU00)
Sumário:
O Usuário Agente de saúde, logado no sistema, visualiza as visitas de agente de saúde que foram solicitadas no sistema.
Ator Primário:
 Usuário Agente de Saúde.
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção “Visitas Solicitadas” no menu.
3.	O Sistema exibe visitas solicitadas em uma tabela com as colunas Data, Turno, Endereço, CEP, Motivo e Status (Em Aberto, Aceita, Negada, Reali-zada), e com as linhas ordenadas por Data e filtradas por Status Em Aberto.
4.	O Sistema exibe um campo de pesquisa por CEP para filtrar a tabela.
5.	O Sistema exibe checkbox para filtrar a tabela por Status.
Fluxo Alternativo (1): Filtrar por CEP
•	Se o Usuário optar por filtrar por CEP:
 4.a. O Usuário digita o CEP no campo de pesquisa.
 4.b. O Sistema processa a pesquisa e apresenta a tabela apenas com as solicitações de visita que tenham o CEP informado.
Fluxo Alternativo (2): Filtrar por Status
•	Se o Usuário optar por filtrar por Status:
 4.a. O Usuário seleciona pelo menos um dos Status disponíveis.
 4.b. O Sistema processa a pesquisa e apresenta a tabela apenas com as solicitações de visita que tenham um dos Status informado.
Fluxo de Exceção:
•	Em caso de falha na comunicação com o servidor o carregamento da tabe-la:
 3.a. O Sistema exibe uma mensagem de erro informando o problema.
 3.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	O usuário consegue ver todas as informações das visitas solicitas no sis-tema que atenda aos critérios de filtro.


3.4.2.4 Descrições dos casos de uso do agente de saúde
Cadastro perante o código de CNES validado (CSU01)
Sumário:
O Usuário Agente de Saúde realiza cadastro no sistema mediante validação do seu código CNES.
Ator Primário:
 Usuário Agente de Saúde.
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve possuir um código CNES válido.
Fluxo Principal:
1.	O Usuário acessa a página de cadastro do sistema.
2.	O Sistema apresenta um formulário para cadastro.
3.	O Usuário preenche os dados pessoais e insere seu código CNES.
4.	O Sistema valida o código CNES junto à base de dados oficial.
5.	Com o código validado, o Sistema cria o cadastro do Usuário.
6.	O Sistema confirma o cadastro e habilita acesso ao Usuário.
Fluxo Alternativo (1): Código CNES inválido
•	Se o código CNES for inválido: 4.a. O Sistema informa que o código é invá-lido. 4.b. O Usuário pode corrigir o código ou cancelar o cadastro.
Fluxo de Exceção:
•	Em caso de falha na comunicação durante validação do CNES: 4.a. O Sis-tema exibe uma mensagem de erro informando o problema. 4.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	O Usuário Agente de Saúde está cadastrado no sistema e pode acessar suas funcionalidades.


Receber alertas de novos casos, novos registros e atualizações de visitas por e-mail (CSU02)
Sumário:
O Usuário Agente de Saúde recebe notificações por e-mail sobre novidades no sistema.
Ator Primário:
 Usuário Agente de Saúde.
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar cadastrado no sistema.
•	O Usuário deve ter um e-mail válido registrado.
Fluxo Principal:
1.	O Usuário acessa as configurações de notificação no sistema.
2.	O Sistema apresenta opções de configuração para recebimento de alertas.
3.	O Usuário seleciona quais tipos de alertas deseja receber por e-mail (novos casos, novos registros, atualizações de visitas).
4.	O Sistema salva as preferências do Usuário.
5.	O Sistema passa a enviar e-mails conforme ocorram eventos selecionados pelo Usuário.
Fluxo Alternativo: Desativação de alertas
•	Se o Usuário desejar desativar alertas: 3.a. O Usuário desmarca as opções de alerta que não deseja mais receber. 3.b. O Sistema atualiza as preferên-cias e interrompe o envio dos alertas desativados.
Fluxo de Exceção:
•	Em caso de falha no envio de e-mail: 5.a. O Sistema registra a falha no log. 5.b. O Sistema tenta reenviar após um intervalo determinado.
Pós-condições:
•	O Usuário recebe alertas por e-mail conforme as configurações estabeleci-das.


Visualizar denúncias de forma detalhada em uma página de listagem (CSU03)
Sumário:
O Usuário Agente de Saúde visualiza detalhes das denúncias registradas no sis-tema.
Ator Primário:
 Usuário Agente de Saúde.
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado no sistema.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção "Denúncias" no menu.
3.	O Sistema exibe uma listagem de denúncias com informações como Data, Local, Tipo de Denúncia, Status e outras informações relevantes.
4.	O Sistema disponibiliza filtros para facilitar a busca por denúncias es-pecíficas.
5.	O Usuário pode selecionar uma denúncia específica para visualizar mais detalhes.
6.	O Sistema exibe os detalhes completos da denúncia selecionada.
Fluxo Alternativo: Aplicar filtros na listagem
•	Se o Usuário optar por filtrar a listagem: 4.a. O Usuário seleciona os crité-rios de filtro desejados. 4.b. O Sistema atualiza a listagem exibindo apenas as denúncias que atendem aos filtros.
Fluxo de Exceção:
•	Em caso de falha no carregamento das denúncias: 3.a. O Sistema exibe uma mensagem de erro informando o problema. 3.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	O Usuário visualiza as denúncias conforme os filtros aplicados e pode acessar detalhes de cada uma.


Visualizar registros de dengue de forma detalhada em uma página de listagem (CSU04)
Sumário:
O Usuário Agente de Saúde visualiza detalhadamente os registros de casos de dengue no sistema.
Ator Primário:
 Usuário Agente de Saúde.
Ator Secundário:
 Não se aplica
Pré-condições:
•	O Usuário deve estar autenticado no sistema.
Fluxo Principal:
1.	O Usuário acessa o site e realiza a autenticação.
2.	O Usuário seleciona a opção "Registros de Dengue" no menu.
3.	O Sistema exibe os registros de dengue em uma tabela com colunas como Data de Notificação, Paciente, Endereço, Sintomas, Status (Suspeito, Confirmado, Descartado) e outras informações relevan-tes.
4.	O Sistema disponibiliza opções de filtro por período, região, status e outros critérios.
5.	O Usuário pode selecionar um registro específico para visualizar in-formações mais detalhadas.
6.	O Sistema exibe uma página com todos os detalhes do caso seleci-onado.
Fluxo Alternativo: Aplicar filtros na listagem
•	Se o Usuário optar por filtrar a listagem: 4.a. O Usuário seleciona os crité-rios de filtro desejados. 4.b. O Sistema atualiza a listagem exibindo apenas as denúncias que atendem aos filtros.
Fluxo de Exceção:
•	Em caso de falha no carregamento dos registros: 3.a. O Sistema exibe uma mensagem de erro informando o problema. 3.b. O Usuário é orientado a tentar novamente mais tarde.
Pós-condições:
•	O Usuário visualiza os registros de dengue conforme os filtros aplicados e pode acessar detalhes de cada caso.


### 3.4.3 Diagrama de Classes 

A Figura 2 mostra o diagrama de classes do sistema. A Matrícula deve conter a identificação do funcionário responsável pelo registro, bem com os dados do aluno e turmas. Para uma disciplina podemos ter diversas turmas, mas apenas um professor responsável por ela.

#### Figura 2: Diagrama de Classes do Sistema.

A Figura mostra o diagrama de classes do sistema. A Matrícula deve conter a identificação do funcionário responsável pelo registro, bem com os dados do aluno e turmas. Para uma disciplina podemos ter diversas turmas, mas apenas um professor responsável por ela. 

![diagrama-classes](https://github.com/user-attachments/assets/e83ad56f-dd71-4bfe-853b-ddd5898db755)


### 3.4.4 Descrições das Classes 

| Nº | Nome                    | Descrição                                                                 |
|----|-------------------------|---------------------------------------------------------------------------|
| 1  | Usuario                 | Classe pai com a definição dos atributos e métodos dos usuários do sistema. |
| 2  | UsuarioComum            | Classe filha que herda de `Usuario` e utiliza todos os seus atributos e métodos. |
| 3  | UsuarioAgenteSaude      | Classe filha que herda de `Usuario`, utiliza seus atributos e métodos e acrescenta o atributo `cnes`. |
| 4  | CasoDengue              | Classe com os atributos e métodos para os registros de casos de dengue.    |
| 5  | FocoDengue              | Classe com os atributos e métodos para os focos de dengue denunciados.     |
| 6  | Visita                  | Classe com os atributos e métodos das visitas feitas pelos agentes de saúde. |
| 7  | EmailNotificacao        | Classe com os métodos responsáveis pelo envio de notificações por e-mail.  |
