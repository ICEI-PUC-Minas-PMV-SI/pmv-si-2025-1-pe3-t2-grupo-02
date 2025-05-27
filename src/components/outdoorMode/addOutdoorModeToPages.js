// Script para adicionar as importações de modo externo em todas as páginas HTML
const fs = require('fs');
const path = require('path');

// Caminho base do projeto
const basePath = path.resolve(__dirname, '..', '..');

// Conteúdo do HTML a ser inserido (importações)
const outdoorModeImports = `<link rel="stylesheet" type="text/css" href="../../components/outdoorMode/outdoorMode.css" />
<script src="../../components/outdoorMode/outdoorMode.js" defer></script>`;

// Versão da importação para a raiz do projeto
const outdoorModeImportsRoot = `<link rel="stylesheet" type="text/css" href="components/outdoorMode/outdoorMode.css" />
<script src="components/outdoorMode/outdoorMode.js" defer></script>`;

// Função para processar arquivos HTML 
function processHtmlFile(filePath, isRoot = false) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verifica se as importações já existem no arquivo
    if (content.includes('outdoorMode.css') || content.includes('outdoorMode.js')) {
      console.log(`Arquivo ${filePath} já contém as importações. Pulando.`);
      return;
    }
    
    // Determina qual versão da importação usar com base na localização do arquivo
    const importsToAdd = isRoot ? outdoorModeImportsRoot : outdoorModeImports;
    
    // Encontra onde inserir as importações (antes do </head> ou após o último link/script)
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${importsToAdd}\n</head>`);
    } else {
      // Se não tiver tag </head>, tenta encontrar o último link ou script no início do arquivo
      const headEndPos = content.indexOf('</head>');
      if (headEndPos !== -1) {
        const headContent = content.substring(0, headEndPos);
        const lastLinkOrScriptPos = Math.max(
          headContent.lastIndexOf('</script>'),
          headContent.lastIndexOf('/>'),
          headContent.lastIndexOf('>'),
        );
        
        if (lastLinkOrScriptPos !== -1) {
          // Insere após o último link ou script
          content = content.substring(0, lastLinkOrScriptPos + 1) + 
                    '\n' + importsToAdd + 
                    content.substring(lastLinkOrScriptPos + 1);
        }
      }
    }
    
    // Salva o arquivo modificado
    fs.writeFileSync(filePath, content);
    console.log(`Arquivo ${filePath} atualizado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao processar o arquivo ${filePath}:`, error);
  }
}

// Função para percorrer os diretórios de forma recursiva
function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walk(filePath, callback); // Recursivamente processa subdiretórios
    } else if (path.extname(file).toLowerCase() === '.html') {
      const isRoot = path.relative(basePath, dir) === '';
      callback(filePath, isRoot);
    }
  });
}

// Percorre todos os arquivos HTML, excluindo node_modules e outros diretórios não desejados
console.log(`Processando arquivos HTML a partir de: ${basePath}`);

walk(basePath, (filePath, isRoot) => {
  // Ignora arquivos em node_modules ou outros diretórios irrelevantes
  if (!filePath.includes('node_modules') && 
      !filePath.includes('.git') &&
      !filePath.includes('outdoorModeImports.html')) {
    processHtmlFile(filePath, isRoot);
  }
});

console.log('Processo concluído.');
