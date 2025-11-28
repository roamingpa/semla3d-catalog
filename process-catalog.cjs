const fs = require('fs');
const path = require('path');

// Función para normalizar nombres de archivos (remover extensiones, espacios extra, etc.)
function normalizeFileName(filename) {
  return filename
    .replace(/\.(jpg|jpeg|png|mov|mp4)$/i, '') // Remover extensiones
    .replace(/^video\s*/i, '') // Remover "video" del inicio
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
    .toLowerCase();
}

// Función para extraer precio del nombre del archivo
function extractPrice(filename) {
  const priceMatch = filename.match(/(\d+)\s*mil/i);
  if (priceMatch) {
    return parseInt(priceMatch[1]) * 1000;
  }
  
  // Casos especiales
  if (filename.includes('c_u') || filename.includes('cada uno')) {
    const priceMatch = filename.match(/(\d+)\s*c_u/i);
    if (priceMatch) {
      return parseInt(priceMatch[1]);
    }
  }
  
  return null;
}

// Función para limpiar el nombre del producto
function cleanProductName(filename) {
  return filename
    .replace(/^\d+\s*mil\s*/i, '') // Remover precio del inicio
    .replace(/\d+\s*mil/i, '') // Remover precio de cualquier parte
    .replace(/c_u/gi, 'cada uno')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función para generar slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Función para mapear carpetas a categorías
function mapCategoryFromFolder(folderPath) {
  const categoryMap = {
    'Caja de dados one piece': 'gaming',
    'Deckbox Final Fantasy': 'gaming', 
    'Deckbox One Piece': 'gaming',
    'Deckbox pokemon': 'gaming',
    'Monedas-marcadores': 'gaming',
    'Otras figuras': 'decorativo',
    'Separador damage counter box pokemon': 'gaming',
    'Separadores latita one piece': 'gaming',
    'Separadores latita pokemon': 'gaming',
    'Soporte cartas para mesa': 'funcional'
  };
  
  for (const [folder, category] of Object.entries(categoryMap)) {
    if (folderPath.includes(folder)) {
      return category;
    }
  }
  return 'otro';
}

// Función principal para procesar archivos
function processFiles() {
  const catalogoPath = path.join(__dirname, 'public', 'catalogo');
  const productsPath = path.join(__dirname, 'content', 'products');
  
  // Crear directorio products si no existe
  if (!fs.existsSync(productsPath)) {
    fs.mkdirSync(productsPath, { recursive: true });
  }
  
  const products = new Map();
  
  function scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        // Es un archivo
        const relativePath = path.relative(catalogoPath, fullPath);
        const normalizedName = normalizeFileName(item);
        const price = extractPrice(item);
        const productName = cleanProductName(normalizedName);
        const category = mapCategoryFromFolder(relativePath);
        
        if (!productName) continue; // Saltar si no se puede determinar el nombre
        
        // Crear clave única para agrupar archivos del mismo producto
        const productKey = `${category}-${normalizedName.replace(/\d+\s*mil/i, '').trim()}`;
        
        if (!products.has(productKey)) {
          products.set(productKey, {
            name: productName,
            price: price,
            category: category,
            images: [],
            videos: [],
            folderPath: path.dirname(relativePath)
          });
        }
        
        const product = products.get(productKey);
        
        // Actualizar precio si encontramos uno válido
        if (price && !product.price) {
          product.price = price;
        }
        
        // Agregar archivos
        const webPath = `/catalogo/${relativePath.replace(/\\/g, '/')}`;
        const ext = path.extname(item).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          product.images.push(webPath);
        } else if (['.mov', '.mp4'].includes(ext)) {
          product.videos.push(webPath);
        }
      }
    }
  }
  
  scanDirectory(catalogoPath);
  
  // Crear archivos YML para cada producto
  for (const [key, product] of products.entries()) {
    const slug = generateSlug(product.name);
    const fileName = `${slug}.yml`;
    const filePath = path.join(productsPath, fileName);
    
    // Generar contenido YML
    const ymlContent = `---
name: ${product.name}
slug: ${slug}
description: ${generateDescription(product.name, product.category)}
price: ${product.price || 'Consultar'}
category: ${product.category}
${product.images.length > 0 ? `images:\n${product.images.map(img => `  - "${img}"`).join('\n')}` : ''}
${product.videos.length > 0 ? `videos:\n${product.videos.map(vid => `  - "${vid}"`).join('\n')}` : ''}
size:
  length: ""
  width: ""
  height: ""
print_time: "2-3 días"
customizable_options: []
combina_bien_con: []
---
`;
    
    fs.writeFileSync(filePath, ymlContent, 'utf8');
    console.log(`Creado: ${fileName}`);
  }
  
  console.log(`\nProceso completado. Se crearon ${products.size} productos.`);
}

// Función para generar descripciones automáticas
function generateDescription(name, category) {
  const descriptions = {
    gaming: `${name} impreso en 3D, perfecto para tus juegos de cartas. Diseño detallado y alta calidad de impresión.`,
    decorativo: `${name} decorativo impreso en 3D. Pieza única con acabado de alta calidad, ideal para coleccionistas.`,
    funcional: `${name} funcional impreso en 3D. Diseño práctico y resistente para uso diario.`,
    otro: `${name} impreso en 3D con materiales de alta calidad y precisión en cada detalle.`
  };
  
  return descriptions[category] || descriptions.otro;
}

// Ejecutar el script
processFiles();