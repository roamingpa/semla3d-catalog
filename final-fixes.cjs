const fs = require('fs');
const path = require('path');

// Precios estimados para productos sin precio
const priceFixes = {
  'damage-counter-pokemon-vista-1.yml': 8000,
  'damage-counter-pokemon-vista-2.yml': 8000,
  'deckbox-kid-one-piece.yml': 20000,
  'deckbox-personalizado-op-1.yml': 20000,
  'deckbox-personalizado-op-2.yml': 20000,
  'deckbox-personalizado-op-3.yml': 20000,
  'mil-cada-uno-monedas.yml': 1000,
  'separador-one-piece-14mil-especial.yml': 14000,
  'tutorial-magneticos-pokemon.yml': 0 // Video tutorial, sin precio
};

// Descripciones mejoradas
const descriptionFixes = {
  'separador-one-piece-12mil.yml': 'Separadores para latitas One Piece de $12.000 cada uno. Organiza tu colección con estilo pirata.',
  'separador-one-piece-14mil.yml': 'Separadores para latitas One Piece de $14.000 cada uno. Perfectos para mantener ordenadas tus cartas temáticas.',
  'separador-one-piece-14mil-alt.yml': 'Separadores para latitas One Piece de $14.000 cada uno, diseño alternativo. Calidad premium para coleccionistas.',
  'separador-one-piece-14mil-especial.yml': 'Separadores especiales para latitas One Piece. Edición limitada con detalles únicos.',
  'deckbox-personalizado-op-1.yml': 'Deckbox personalizado One Piece. Diseño único adaptado a tus gustos específicos del anime.',
  'deckbox-personalizado-op-2.yml': 'Deckbox personalizado One Piece, versión 2. Cada diseño es único y hecho a medida.',
  'deckbox-personalizado-op-3.yml': 'Deckbox personalizado One Piece, versión 3. Personalización completa para verdaderos fans.',
  'deckbox-kid-one-piece.yml': 'Deckbox temático de Eustass Kid de One Piece. Para fans del Capitán Kid y su tripulación.',
  'damage-counter-pokemon-vista-1.yml': 'Organizador para damage counters Pokémon. Mantén tus contadores ordenados durante las batallas.',
  'damage-counter-pokemon-vista-2.yml': 'Organizador para damage counters Pokémon, vista alternativa. Sistema práctico de organización.',
  'mil-cada-uno-monedas.yml': 'Monedas decorativas a $1.000 cada una. Perfectas para juegos temáticos o colección.',
  'tutorial-magneticos-pokemon.yml': 'Video tutorial sobre cómo usar los magnéticos en deckbox Pokémon. Guía práctica incluida.'
};

function finalFixes() {
  const productsPath = path.join(__dirname, 'content', 'products');
  const files = fs.readdirSync(productsPath).filter(f => f.endsWith('.yml'));
  
  console.log('Aplicando correcciones finales...\n');
  
  for (const file of files) {
    const filePath = path.join(productsPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Arreglar precios
    if (priceFixes[file] !== undefined) {
      const newPrice = priceFixes[file];
      if (newPrice === 0) {
        content = content.replace(/price: Consultar/, 'price: "Gratis"');
      } else {
        content = content.replace(/price: Consultar/, `price: ${newPrice}`);
      }
      changed = true;
      console.log(`Precio actualizado en ${file}: ${newPrice === 0 ? 'Gratis' : '$' + newPrice}`);
    }
    
    // Arreglar descripciones
    if (descriptionFixes[file]) {
      content = content.replace(/description: .+/, `description: ${descriptionFixes[file]}`);
      changed = true;
      console.log(`Descripción mejorada en ${file}`);
    }
    
    // Arreglar descripciones genéricas que quedaron mal
    if (content.includes('description: 1 impreso en 3D') || 
        content.includes('description: 2 impreso en 3D') ||
        content.includes('description: 3 impreso en 3D')) {
      // Extraer el nombre para crear una descripción mejor
      const nameMatch = content.match(/name: (.+)/);
      if (nameMatch) {
        const name = nameMatch[1];
        const newDesc = `${name} impreso en 3D con alta calidad y precisión. Diseño funcional y duradero para uso diario.`;
        content = content.replace(/description: .+/, `description: ${newDesc}`);
        changed = true;
        console.log(`Descripción genérica corregida en ${file}`);
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
    }
  }
  
  // Generar reporte final
  console.log('\n--- REPORTE FINAL ---');
  console.log(`Total de productos creados: ${files.length}`);
  
  const categories = {};
  const priceRanges = { 'Gratis': 0, '1-10k': 0, '11-20k': 0, '21k+': 0 };
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
    
    // Contar categorías
    const categoryMatch = content.match(/category: (.+)/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      categories[category] = (categories[category] || 0) + 1;
    }
    
    // Contar rangos de precio
    const priceMatch = content.match(/price: (.+)/);
    if (priceMatch) {
      const priceStr = priceMatch[1];
      if (priceStr === '"Gratis"') {
        priceRanges['Gratis']++;
      } else {
        const price = parseInt(priceStr);
        if (price <= 10000) priceRanges['1-10k']++;
        else if (price <= 20000) priceRanges['11-20k']++;
        else priceRanges['21k+']++;
      }
    }
  }
  
  console.log('\nProductos por categoría:');
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} productos`);
  });
  
  console.log('\nProductos por rango de precio:');
  Object.entries(priceRanges).forEach(([range, count]) => {
    console.log(`  ${range}: ${count} productos`);
  });
  
  console.log('\n✅ Proceso completado exitosamente!');
}

finalFixes();