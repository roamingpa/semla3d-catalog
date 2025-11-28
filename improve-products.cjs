const fs = require('fs');
const path = require('path');

// Mapeo de archivos problemáticos a nombres mejorados
const nameImprovements = {
  '1.yml': 'separador-one-piece-12mil',
  '2.yml': 'separador-one-piece-14mil', 
  '3.yml': 'separador-one-piece-14mil-alt',
  '14mmil-3.yml': 'separador-one-piece-14mil-especial',
  'set.yml': 'set-monedas-marcadores',
  'img2470.yml': 'deckbox-personalizado-op-1',
  'img2474.yml': 'deckbox-personalizado-op-2', 
  'img2699.yml': 'deckbox-personalizado-op-3',
  'img1889.yml': 'damage-counter-pokemon-vista-1',
  'img1890.yml': 'damage-counter-pokemon-vista-2',
  'kid.yml': 'deckbox-kid-one-piece',
  'como-sacar-magneticos.yml': 'tutorial-magneticos-pokemon'
};

// Mejoras de nombres y descripciones más específicas
const contentImprovements = {
  'chocobo.yml': {
    name: 'Deckbox Chocobo Final Fantasy',
    description: 'Deckbox temático de Chocobo de Final Fantasy, perfecto para almacenar cartas TCG. Diseño detallado con la icónica criatura amarilla.'
  },
  'gomugomu-fruta.yml': {
    name: 'Deckbox Fruta Gomu Gomu One Piece',
    description: 'Deckbox en forma de la Fruta del Diablo Gomu Gomu de Luffy. Ideal para fans de One Piece y jugadores de TCG.'
  },
  'deckbox-brook.yml': {
    name: 'Deckbox Brook Soul King One Piece',
    description: 'Deckbox temático de Brook de One Piece. Diseño único del músico esqueleto de los Piratas del Sombrero de Paja.'
  },
  'deckbox-ace.yml': {
    name: 'Deckbox Portgas D. Ace One Piece',
    description: 'Deckbox con el gorro característico de Ace. Perfecto para almacenar cartas con estilo de One Piece.'
  },
  'deckbox-chopper.yml': {
    name: 'Deckbox Tony Tony Chopper One Piece',
    description: 'Deckbox con el adorable gorro de Chopper. Ideal para fans del reno médico de One Piece.'
  },
  'takopi.yml': {
    name: 'Figura Takopi Decorativa',
    description: 'Figura decorativa de Takopi, el personaje del manga. Perfecta para coleccionistas y fans del anime/manga.'
  },
  'figura-nami.yml': {
    name: 'Figura Nami One Piece',
    description: 'Figura decorativa de Nami de One Piece. Detalle exquisito de la navegante de los Piratas del Sombrero de Paja.'
  },
  'ballena-panuelitos.yml': {
    name: 'Soporte Pañuelos Ballena',
    description: 'Soporte funcional para pañuelos con diseño de ballena. Combina utilidad y decoración marina.'
  }
};

function improveProducts() {
  const productsPath = path.join(__dirname, 'content', 'products');
  
  // Renombrar archivos problemáticos
  for (const [oldName, newName] of Object.entries(nameImprovements)) {
    const oldPath = path.join(productsPath, oldName);
    const newPath = path.join(productsPath, `${newName}.yml`);
    
    if (fs.existsSync(oldPath)) {
      // Leer el contenido del archivo
      let content = fs.readFileSync(oldPath, 'utf8');
      
      // Actualizar el slug en el contenido
      content = content.replace(/slug: .+/, `slug: ${newName}`);
      
      // Mejorar el nombre si es muy genérico
      if (content.includes('name: 1') || content.includes('name: 2') || content.includes('name: 3')) {
        const improvedName = newName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        content = content.replace(/name: .+/, `name: ${improvedName}`);
      }
      
      // Escribir al nuevo archivo
      fs.writeFileSync(newPath, content);
      
      // Eliminar el archivo antiguo
      fs.unlinkSync(oldPath);
      
      console.log(`Renombrado: ${oldName} -> ${newName}.yml`);
    }
  }
  
  // Mejorar contenido de productos específicos
  for (const [fileName, improvements] of Object.entries(contentImprovements)) {
    const filePath = path.join(productsPath, fileName);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (improvements.name) {
        content = content.replace(/name: .+/, `name: ${improvements.name}`);
      }
      
      if (improvements.description) {
        content = content.replace(/description: .+/, `description: ${improvements.description}`);
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Mejorado: ${fileName}`);
    }
  }
  
  // Listar productos duplicados para revisión manual
  console.log('\n--- Revisión de duplicados posibles ---');
  const files = fs.readdirSync(productsPath);
  const productNames = new Map();
  
  for (const file of files) {
    if (!file.endsWith('.yml')) continue;
    
    const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
    const nameMatch = content.match(/name: (.+)/);
    
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase().trim();
      if (productNames.has(name)) {
        console.log(`Posible duplicado: "${name}" en ${productNames.get(name)} y ${file}`);
      } else {
        productNames.set(name, file);
      }
    }
  }
  
  console.log('\n--- Productos con precios "Consultar" ---');
  for (const file of files) {
    if (!file.endsWith('.yml')) continue;
    
    const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
    if (content.includes('price: Consultar')) {
      console.log(`Sin precio: ${file}`);
    }
  }
}

improveProducts();