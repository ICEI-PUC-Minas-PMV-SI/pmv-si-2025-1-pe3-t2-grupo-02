# 4. PROJETO DO DESIGN DE INTERAÇÃO
# 4 Personas e Protótipos

## 4.1 Personas

Nesta seção serão documentadas as personas do projeto.

![Figura 8: Persona estudante de biomedicina interessada sobre os focos do mosquito Aedes aegypty.](https://github.com/user-attachments/assets/67b5f033-780f-4b65-9f43-1843a4fea645)  
*Fonte: Autores, 2025.*

![Figura 9: Persona professora interessada na incidência de casos.](https://github.com/user-attachments/assets/3ad654eb-deff-4929-aab9-26253a5a6187)  
*Fonte: Autores, 2025.*

![Figura 10: Persona usuário idoso solicitante da visita de agentes da saúde.](https://github.com/user-attachments/assets/bb0a7c76-5f02-4760-8441-f821e73fa5a7)  
*Fonte: Autores, 2025.*

![Figura 11: Persona agente de saúde executante da visita.](https://github.com/user-attachments/assets/bc7e1642-d5ca-4fa7-9d1d-755f4e8fb3f8)
*Fonte: Autores, 2025.*

![Figura 12: Persona agente de saúde interessado em monitorar as informações sobre a dengue.](https://github.com/user-attachments/assets/6697dc8a-cabf-4774-9125-6bef6e69c520) 
*Fonte: Autores, 2025.*

---

## 4.2 Mapa de Empatia

Nesta seção serão documentados os mapas de empatia de cada persona apresentada no projeto.

![Figura 13: Mapa de empatia da persona estudante de biomedicina interessada sobre os focos do mosquito Aedes aegypty](https://github.com/user-attachments/assets/62731fbb-5336-47c1-a999-a331f7ffa6ed)
*Fonte: Autores, 2025.*

![Figura 14: Mapa de empatia da persona professora interessada na incidência de casos.](https://github.com/user-attachments/assets/0eb17f8d-6820-4884-842b-751396e65c4b)
*Fonte: Autores, 2025.*

![Figura 15: Mapa de empatia da persona idoso solicitante da visita de agentes da saúde.](https://github.com/user-attachments/assets/c1396c4f-aff2-45b5-a455-6241a8cd0da6)
*Fonte: Autores, 2025.*

![Figura 16: Mapa de empatia da persona agente comunitário de saúde.](https://github.com/user-attachments/assets/994a4ca2-518f-4b91-8f04-489210ef09cd)
*Fonte: Autores, 2025.*

![Figura 17: Mapa de empatia da persona agente de saúde interessado em monitorar as informações sobre a dengue.](https://github.com/user-attachments/assets/920f56a0-9cf1-46aa-bc6b-404936c2faca)
*Fonte: Autores, 2025.*

---

## 4.3 Protótipos das Interfaces

Nesta seção é apresentado os protótipos de alta fidelidade do sistema proposto, bem como os princípios gestálticos e as regras de ouro do design que foram seguidas.

### 4.3.1 Cadastrar, Entrar e Esqueci a senha

As páginas relacionadas à autenticação do sistema incluem Criar Conta (novo usuário), Entrar e Esqueci a Senha. Todas seguem a mesma identidade visual e aplicam os princípios gestálticos e as regras de ouro do design de interfaces para proporcionar uma experiência de uso fluida e intuitiva, alinhada aos padrões da plataforma Dengue Status.

Cada página possui um formulário específico conforme sua funcionalidade. Em conformidade com o princípio da consistência, os títulos, campos de entrada e botões de submissão mantêm os posicionamentos, cores e tipografia em todas as páginas. Além disso, com base na regra de oferecer atalhos para usuários experientes, os formulários permitem o uso de teclas como Tab para navegação entre campos, Ctrl + C / Ctrl + V para copiar e colar, e Enter para submeter o formulário quando o botão de envio estiver em foco. Isso contribui para uma navegação mais rápida e eficiente.

Seguindo a regra de prevenção de erros, os formulários impedem a submissão caso haja campos obrigatórios em branco ou se o campo de e-mail contiver um valor inválido. Nesses casos, são exibidas tooltips explicativas orientando o usuário sobre como corrigir os erros. Além disso, em alinhamento com a regra de fornecer feedback claro, caixas de diálogo são exibidas para confirmar o sucesso ou a falha nas requisições realizadas.

No que se refere aos princípios Gestálticos, os formulários aplicam os conceitos de Proximidade e Região Comum, agrupando campos e botões dentro de um espaço delimitado com bordas visuais que indicam claramente sua relação funcional. Os princípios da Continuidade e do Destino Comum também estão presentes: os campos são alinhados horizontal e verticalmente, incentivando o preenchimento sequencial e coerente do formulário.

Um exemplo específico pode ser visto na página Criar Conta, onde o checkbox "Sou agente de saúde" e o campo "Informe CNES" estão dispostos na mesma linha. Essa distribuição espacial comunica de forma clara que eles estão relacionados e que o preenchimento do CNES só é necessário caso o usuário se identifique como agente de saúde.

![Figura 18: Página de Criar Conta](https://github.com/user-attachments/assets/ae81a453-b24c-433c-b5cb-831376d68acf)


![Figura 19: Página de Criar Conta com modal de Sucesso](https://github.com/user-attachments/assets/8aa144bd-bed0-4571-826a-12a0875e4ce4)


![Figura 20: Página de Entrar](https://github.com/user-attachments/assets/99f7fad4-0d7a-4b0b-86a2-d77a1cc97020)


![Figura 21: Esqueci a senha](https://github.com/user-attachments/assets/effbf793-29cb-4e02-8ec7-7b264f54c541)

---

### 4.3.2 Mapa de casos e focos de dengue

A página de mapa de casos e focos de dengue foi pensada para atender às necessidades específicas de usuários como Lorena Silva, estudante de biomedicina e voluntária em ações de saúde pública. Suas demandas por precisão, eficiência e controle refletem-se em funcionalidades que integram princípios de design de interação, garantindo uma experiência intuitiva e eficiente.

A interface segue princípios gestálticos de forma estratégica para facilitar a usabilidade. O princípio da proximidade é aplicado através do agrupamento visual dos indicadores estatísticos na parte superior da página, onde "novos casos nas últimas 24h", "focos registrados na última semana" e "novos atendimentos no último mês" estão dispostos horizontalmente em containers adjacentes, permitindo comparação rápida entre métricas temporais relacionadas. O princípio da região comum delimita claramente as áreas funcionais da interface: a seção de indicadores, a área de filtros e o mapa interativo ocupam regiões distintas, facilitando a navegação visual durante análises prolongadas que Lorena realiza para seus relatórios acadêmicos.

O sistema de filtros implementa o princípio da continuidade através de um fluxo lógico de refinamento de dados que segue a hierarquia geográfica brasileira: Estado, Cidade e Bairro. Esta sequência atende à necessidade expressa por Lorena de "ajustar a granularidade dos dados" conforme o escopo de sua pesquisa. O princípio da simetria é observado no alinhamento horizontal dos campos de filtro e na distribuição equilibrada dos controles temporais (Início e Fim), criando um padrão visual que facilita o preenchimento sequencial durante configurações repetitivas.

Quanto às Regras de Ouro de Shneiderman, a página mantém consistência visual e funcional através de padrões uniformes de cores, tipografia e comportamentos interativos. A funcionalidade de "Salvar filtros" responde à frustração documentada de Lorena: "Por que não consigo salvar meus filtros? Tenho que reconfigurar tudo toda vez!". Esta implementação segue a Regra de Ouro de reduzir a carga de memória do usuário, permitindo que configurações complexas sejam recuperadas automaticamente em sessões futuras através de cookies, otimizando o fluxo de trabalho acadêmico onde análises similares são realizadas periodicamente.

Ainda, a funcionalidade de modo de alto contraste atende especificamente às preferências de Lorena por "opções para ajustar contrastes de cores em mapas" e "modo exterior para uso sob sol". A Figura 11 demonstra a implementação desta funcionalidade, onde o esquema de cores é alterado para tons mais saturados e contrastantes: o fundo escuro com elementos destacados em amarelo e ciano melhora a legibilidade em condições de luminosidade variada, seja durante análises prolongadas em ambiente interno ou consultas rápidas em campo durante campanhas de prevenção.

![Figura 22: Página de mapa de casos e focos de dengue](https://github.com/user-attachments/assets/76953a1a-468e-4246-912b-3da229825a3a)


![Figura 23: Página de mapa de casos e focos de dengue em modo externo](https://github.com/user-attachments/assets/17731d58-ba53-4a7a-a75f-827161c6c76e)


---

### 4.3.3 Lista de denúncias de focos (agente de saúde)

A página de listagem de denúncias de focos foi desenvolvida considerando as necessidades de usuários como Carlos Mendes, agente comunitário de saúde que atua diretamente em visitas domiciliares para identificação e controle de focos do Aedes aegypti. Esta funcionalidade atende suas demandas por acesso rápido a informações atualizadas, visualização clara de dados epidemiológicos e ferramentas eficientes para planejamento de ações em campo.

A interface implementa princípios gestálticos estratégicos para facilitar a análise rápida de informações durante o planejamento de visitas. O princípio da Proximidade é aplicado no agrupamento dos indicadores estatísticos superiores, onde "Total de Denúncias", "Denúncias Urgentes", "Bairros Afetados" e "Novas (últimos 7 dias)" estão dispostos horizontalmente com ícones distintivos, permitindo que Carlos identifique rapidamente as métricas prioritárias antes de iniciar seu trabalho de campo. O princípio da Região Comum delimita claramente as diferentes áreas funcionais: seção de indicadores, mapa de concentração, gráfico de distribuição por tipo de foco e tabela de registros detalhados.

O sistema de visualização implementa o princípio da Continuidade através da complementaridade entre o mapa de concentração geográfica e o gráfico circular de distribuição por tipo de foco. Esta organização atende diretamente à necessidade expressa por Carlos: "Preciso de um mapa claro para saber onde estão os maiores focos". O mapa utiliza códigos cromáticos intuitivos (vermelho para concentrações críticas, amarelo para moderadas, verde para áreas controladas) facilitando a identificação rápida de regiões prioritárias durante o planejamento de rotas de visita.

A tabela de registros detalhados segue o princípio da Simetria através do alinhamento consistente de colunas e utiliza codificação por cores para status e prioridades, reduzindo a carga cognitiva durante consultas rápidas. O sistema de tags coloridas para tipos de foco ("Entulhos Lixos", "Garrafas Latas", "Pneus") e locais ("Quintal", "Jardim", "Terreno Baldio") implementa uma linguagem visual consistente que facilita o reconhecimento de padrões epidemiológicos regionais.

Quanto às Regras de Ouro de Shneiderman, a página mantém consistência através de padrões uniformes de cores, tipografia e comportamentos interativos em todas as seções. A funcionalidade de busca na tabela segue a Regra de Ouro de oferecer atalhos para usuários experientes, permitindo que Carlos localize rapidamente registros específicos por endereço, bairro ou tipo de foco durante consultas em campo via smartphone.

O modal de detalhes da denúncia implementa feedback informativo através da apresentação estruturada de informações relevantes para o trabalho de campo. A seção "Informações do Local" fornece contexto geográfico preciso, atendendo à necessidade de Carlos por "localização precisa para reportar à equipe". O mapa integrado no modal permite visualização imediata da localização exata do foco, facilitando o planejamento de rotas e a comunicação com moradores durante visitas domiciliares.

A funcionalidade de agendamento integrada responde à necessidade de Carlos por "planejar ações em conjunto com outros agentes com base nos dados mais recentes". O sistema permite definir datas e horários específicos para visitas, facilitando a coordenação entre equipes e garantindo cobertura adequada das áreas afetadas. Esta funcionalidade implementa a Regra de Ouro de reduzir a carga de memória do usuário, centralizando informações de planejamento e execução em uma única interface.

O design responsivo da interface considera o uso frequente que Carlos faz do smartphone durante visitas domiciliares. A adaptação mobile mantém todas as funcionalidades essenciais acessíveis, permitindo consulta e atualização de registros diretamente no campo. O sistema de sincronização garante que alterações realizadas via mobile sejam imediatamente refletidas na visualização desktop usada no posto de saúde, atendendo à necessidade de integração entre diferentes contextos de trabalho.

A legenda para agentes de saúde implementa uma linguagem visual padronizada que facilita a comunicação entre diferentes profissionais da equipe. Os códigos cromáticos para status ("Pendente", "Agendado", "Visitado", "Eliminado") criam um vocabulário visual comum que reduz ambiguidades e melhora a eficiência da coordenação entre agentes durante ações conjuntas de controle epidemiológico.

---

### 4.3.4 Solicitar visita

A página de solicitar visita segue princípios Gestálticos e Regras de Ouro do Design. Na Figura 8, é possível notar que os campos de entrada e o botão de solicitar visitas estão dentro de um “container” e que campos relacionados (como Data da Visita e Turno da Visita indicando tempo e CEP e Endereço indicando localização) estão agrupados visualmente seguindo o princípio da Região Comum e da Proximidade aplicado ao formulário. Além disso, pelo princípio da Continuidade e da Simetria, o alinhamento dos campos de entrada e sua distribuição simétrica faz com que a leitura flua de cima para baixo seguindo uma ordem lógica: quando (Data e Turno), por que (Motivo) e onde (CEP e Endereço).

Quanto às Regras de Ouro de Shneiderman, a página de solicitar visitas segue o mesmo padrão de interface e interação em relação às demais páginas de formulário de forma consistente. O formulário possui caixas de diálogo indicando quando a visita é solicitada com sucesso e/ou quando ocorreu falha na solicitação. Além disso, o sistema possui feedbacks informativos quando o usuário tenta solicitar visitas com campos não preenchidos, data inválida e CEP fora do formato (000000-00) e possui prevenção de erros informando ao usuário qual campo que precisa de correção, como apresentado na Figura 9.

![Figura 24: Página de Solicitar Visita Web e Mobile](https://github.com/user-attachments/assets/5df97320-2f4a-4faa-ac48-28e0e11d3dbb)

![Figura 25: Página de Solicitar com diálogo informando erro no campo CEP](https://github.com/user-attachments/assets/ba21d3b2-c330-4dc8-80dd-bd8d102b0b6a)


---

### 4.3.5 Solicitações de visita (agente de saúde)

![Figura 26: Tabela de solicitações de visita](https://github.com/user-attachments/assets/1384f875-1955-4b46-a9be-735db1d5b98f)


![Figura 27: Tabela de solicitações de visita](https://github.com/user-attachments/assets/618b50e1-95ce-4f27-84ff-d553455ff7d3)


![Figura 28: Edição do status de solicitações de visita](https://github.com/user-attachments/assets/827db15f-0e63-4011-9927-63fedf07e2e8)


Esta página foi projetada para atender às necessidades dos agentes de saúde, oferecendo uma interface intuitiva e funcional para a gestão das solicitações de visitas realizadas pelos cidadãos. O principal objetivo é fornecer uma visão clara e organizada das demandas, facilitando o acompanhamento e a execução das visitas de forma eficiente.

Na página, o agente de saúde pode visualizar uma lista detalhada com as solicitações de visita, onde cada registro apresenta informações essenciais como o nome do solicitante, a data da solicitação, o endereço completo do local a ser visitado e o status atual da solicitação. Para uma visualização ainda mais intuitiva, os status — "Pendente", "Em andamento" e "Concluído" — são destacados com cores específicas, permitindo que o agente identifique rapidamente a situação de cada demanda e priorize suas ações com mais eficiência.

Além disso, foram adicionadas duas colunas complementares: uma que informa o motivo da solicitação, proporcionando maior clareza sobre a necessidade da visita, e outra que indica o turno de preferência (manhã, tarde ou noite), facilitando o planejamento das rotas e agendas dos agentes.

A página também conta com um modal dedicado para a edição do status da solicitação, oferecendo uma maneira prática e rápida para os agentes atualizarem o andamento das visitas, mantendo as informações sempre organizadas e atualizadas.

Para otimizar ainda mais a experiência, há uma funcionalidade de pesquisa inteligente, que permite localizar qualquer solicitação de forma ágil, além da opção de excluir registros, garantindo que o painel de trabalho se mantenha limpo, organizado e livre de demandas já finalizadas ou indevidas.

Toda a interface foi cuidadosamente desenvolvida para ser acessível, responsiva e amigável, funcionando perfeitamente tanto em desktops quanto em dispositivos móveis. A navegação clara e direta contribui para um uso prático no dia a dia dos agentes, minimizando o tempo de aprendizado e maximizando a produtividade.
