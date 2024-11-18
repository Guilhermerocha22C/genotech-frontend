const fs = require('fs');
const path = require('path');

const baseUrl = 'https://res.cloudinary.com/dyhgyswcn/image/upload/v1/';
const directoriesToSearch = ['Frontend']; // Adicione aqui os diretórios que contêm seus arquivos de código

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex atualizada para capturar mais padrões de URL de imagem
  const regex = /(?<=src="|url$$|href="|content=")['"]?([^"'()]*?\.(?:png|jpg|jpeg|svg|webp|gif))['"]?/gi;
  
  content = content.replace(regex, (match, p1) => {
    // Verifica se a URL já é uma URL completa (começa com http:// ou https://)
    if (p1.startsWith('http://') || p1.startsWith('https://')) {
      return match; // Não altera URLs completas
    }
    
    // Remove a barra inicial se existir
    const cleanPath = p1.startsWith('/') ? p1.slice(1) : p1;
    
    // Substitui espaços por %20 na URL
    return baseUrl + cleanPath.replace(/ /g, '%20');
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(html|css|js|jsx|ts|tsx|vue|php|md)$/i.test(file.name)) {
      updateFile(fullPath);
    }
  }
}

directoriesToSearch.forEach(processDirectory);

console.log("Image URL update process completed.");