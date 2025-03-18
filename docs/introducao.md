# 1. INTRODUÇÃO

O controle de doenças transmitidas por vetores, como mosquito, é essencial para o planejamento e gestão da saúde pública. Esse tipo de transmissor viral é responsável por 17% das doenças transmissíveis a nível mundial, provocando 700 mil mortes por ano (Neto __et al__., 2023). A dengue, por sua vez, é uma arbovirose transmitida por fêmeas de mosquitos Aedes aegypty, que se tornou um problema no Brasil a partir da década de 1980, quando foi registrado os primeiros casos e epidemias em diversos estados (Camara, 2024). 

Segundo Messina _et al_. (2019), o vetor transmissor da dengue prolifera-se em locais com temperaturas mais altas e em ambientes com alta urbanização. Para eles, a projeção é de que os lugares favoráveis para o desenvolvimento do mosquito tendam a aumentar. A dengue já é uma doença endêmica em países tropicais e subtropicais das Américas, África, Ásia, Oriente Médio, Ilhas do Pacífico e Região do Pacífico Ocidental, onde quase metade da população global estão suscetíveis à doença por viverem nessas regiões (Camara, 2024; Seixas; Luz; Junior, 2024). 

De acordo com o Ministério da Saúde (2024), apenas no primeiro semestre de 2024, foram notificados mais de 6 milhões de casos prováveis de dengue com incidência de cerca de 3060 casos para cada 100 mil habitantes, representando um aumento de 344,5% quando comparado com o mesmo período do ano anterior. Os Estados de Minas Gerais, Rio de Janeiro, São Paulo, Paraná, Santa Catarina, Goiás e Distrito Federal juntos concentraram 87,5% dos casos prováveis do Brasil em 2024. A partir desses dados, o Ministério da Saúde afirmou que novos patamares de transmissão se tornarão padrão nos próximos anos devido aos novos padrões climáticos e que ações de prevenção devem ser planejadas e executadas de forma integrada para mitigar os impactos dessa doença à saúde pública do país. 

As notificações de casos prováveis de dengue desde 2022 revelaram um crescimento alarmante no número de casos em relação aos anos anteriores (Ferreira _et al_., 2023). Com o enfrentamento do aumento histórico no número de internações e óbitos em 2024, a dengue se torna um importante e preocupante desafio para o Sistema Único de Saúde (SUS) (Ferreira _et al_., 2023; Medeiros, 2024). Logo, destaca-se a necessidade de ações preventivas pelas autoridades sanitárias do país para controlar a disseminação da doença e de acompanhamento epidemiológico de forma ágil e realista para traçar melhores estratégias de combate à propagação da doença. 

## 1.1. Problema

A dengue é um problema de saúde pública que demanda estratégias eficazes de monitoramento e combate tendo em vista o aumento alarmante de casos. No entanto, a subnotificação de casos, a dificuldade de acesso a informações e a ausência de mecanismos eficientes para denúncias de focos do vetor transmissor e o registro de casos de dengue por parte da população dificultam a atuação dos órgãos responsáveis. Atualmente, a obtenção de informações sobre a incidência da doença depende, em grande parte, de canais institucionais que podem apresentar defasagem nos dados e dificultar o engajamento da população no combate ao mosquito Aedes aegypti. 

 Para mitigar esses desafios, surge a necessidade do desenvolvimento de uma plataforma digital que centraliza dados sobre a endemia, possibilitando as denúncias e os registros. Tal plataforma pode ser usada tanto por cidadãos comuns quanto por profissionais da saúde e gestores públicos. 

## 1.2. Objetivos do trabalho

Este projeto tem como objetivo geral desenvolver uma aplicação Web onde seus usuários possam acessar, com facilidade, informações relacionadas aos casos de dengue no Brasil.  

Isso posto, os objetivos específicos deste trabalho são:  
 - Disponibilizar um mapa de calor para visualizar a incidência de casos por cidade, utilizando dados públicos da API Infodengue;
 - Permitir o cadastro de usuários para registro de casos de dengue próprios ou de familiares;
 - Oferecer a funcionalidade de solicitação de visita de um agente de saúde;
 - Possibilitar a denúncia de focos de dengue;
 - Permitir que agentes de saúde tenham acesso a registros completos dos casos e denúncias;
 - Permitir que agentes de saúde vejam visitas solicitas;
 - Fornecer informações educativas sobre prevenção, sintomas e tratamento da dengue, auxiliando no combate à proliferação do mosquito Aedes aegypti. 

## 1.3. Justificativa

É notório que há uma lacuna na satisfação das necessidades de informação sobre saúde pública em diversas esferas, seja por acesso desigual à informação, desatualização de dados, desinformação e fake news ou falta de compreensão pela população. Essa questão torna-se ainda mais grave devido ao, já abordado, aumento expressivo de casos de dengue no Brasil. Segundo Latorre _et al_. (2024), a utilização das Tecnologias da Informação e Comunicação (TICs) têm potencial de transformar a saúde pública e proporcionar gestões públicas mais eficientes e acessíveis. 

Em resposta a problemática da dengue, surge a iniciativa de criar uma ferramenta web de livre acesso para que o público (cidadãos e setor público) possuam um meio de acesso rápido e prático a informações relacionadas a dengue, além de poderem colaborar ativamente com a atualização de dados. 

De acordo com o estudo de Duncombe __et al__. (2012) sobre as diretrizes sobre dengue da _World Health Organization_ (2009) para diagnóstico, tratamento, prevenção e controle, os Sistemas de Informação Geográfica (SIG), em particular, permitem uma investigação mais aprofundada das informações de vigilância por meio de análises de dados espaciais e relações entre a doença e o ambiente.  

Rezende _et al_. (2024) mostraram que mapas de calor são meios de identificar as necessidades de estratégias locais, como campanhas de conscientização, eliminação de criadouros do mosquito da dengue e melhorias no saneamento. Segundo eles, a análise integrada de dados geográficos e epidemiológicos permite intervenções mais eficazes, direcionando recursos às áreas de maior vulnerabilidade. Já Capara _et al_. (2015), por exemplo, observaram que o engajamento da comunidade local em ações participativas colaborou para a redução da proliferação do vetor da dengue. 

Dessa maneira, ao disponibilizar dados mais acessíveis e precisos sobre a incidência da dengue, é possível colaborar com a conscientização da população sobre os riscos da doença e com a adoção de medidas preventivas. A visualização geográfica dos casos facilita a interpretação da situação atual de cada região. Além disso, estimular uma participação social mais ativa tem potencial de motivar os cidadãos a se precaverem contra a doença no dia a dia. 

## 1.4. Público alvo

A aplicação é voltada para dois grupos que desempenham um papel essencial na prevenção e no combate à dengue, proporcionando acesso a informações e ferramentas úteis para cada necessidade: 

- **População em geral** – qualquer pessoa interessada em acompanhar a incidência da dengue em sua região, relatar casos, denunciar focos do mosquito e solicitar visitas de agentes de saúde.
- **Setor Público** – agentes de saúde e gestores responsáveis por monitorar casos, atender solicitações de visita, analisar denúncias e planejar ações estratégicas para o combate à dengue. 
