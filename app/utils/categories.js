// Definición de categorías con sus propiedades
export const categories = {
  'one piece': {
    name: 'One Piece',
    description: 'Deckboxes y accesorios inspirados en el mundo de One Piece',
    icon: 'Anchor',
    color: 'orange'
  },
  'final fantasy': {
    name: 'Final Fantasy',
    description: 'Deckboxes y accesorios de los personajes icónicos de Final Fantasy',
    icon: 'Sparkles',
    color: 'purple'
  }
}

// Función para obtener información de una categoría
export function getCategoryInfo(categorySlug) {
  return categories[categorySlug] || {
    name: categorySlug,
    description: '',
    icon: 'Folder',
    color: 'gray'
  }
}

// Función para obtener todas las categorías
export function getAllCategories() {
  return Object.entries(categories).map(([slug, info]) => ({
    slug,
    ...info
  }))
}
