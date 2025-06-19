# 7. Código fonte

Dengue Status é uma aplicação Web desenvolvida com HTML, CSS, Javascript. Em algumas páginas foi utilizado Bootstrap para facilitar aplicação da responsividade. Além disso, afim de simular uma API RESTfull, o site usa JSON Server para criar, atualizar e ler os dados. 

A aplicação em produção pode ser acessada aqui: <i>[denguestatus.onrender.com](https://denguestatus.onrender.com/)</i>.

Caso deseje explorar o que foi desenvolvido localmente, leia o conteúdo a seguir:

## Instalação do Site

No terminal, usar os seguintes comandos:

**1 -** Clone o projeto:

~~~
git clone https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2024-1-pe1-t1-denguestatus.git
~~~

**2 -** Instale o JSON Server:

~~~
npm install -g json-server
~~~

**3 -** Acesse o diretorio db a partir do diretório do projeto:
~~~
cd ./src/services/db
~~~

**3 -** Inicie o JSON Server :
~~~
json-server --watch db.json
~~~

Acesse as páginas do projeto com o Live Server e utilize o sistema.

## Organização do código

O código do projeto encontra-se no diretório <b>src</b>. O arquivo index.html é a landing page da aplicação e o style.css possui os estilos gerais das páginas.

Diretórios dentro de src:

* <b>assets:</b> imagens utilizadas;
* <b>components:</b> código reutilizável por mais de uma página. (Ex: Footer, Header, estilo dos inputs.);
* <b>data:</b> coordenadas dos estados brasileiros para geração de mapa;
* <b>pages:</b> diretórios de cada  uma das páginas da aplicação com seus respectivos arquivos HTML, CSS e JavaScript;
* <b>services:</b> código para requisições http relacionado ao sistema de login e acesso aos dados cadastrados;

