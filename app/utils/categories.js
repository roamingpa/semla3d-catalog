// Definición de categorías con sus propiedades
export const categories = {
  'one piece': {
    name: 'One Piece',
    description: 'Deckboxes y accesorios inspirados en el mundo de One Piece',
    icon: 'i-heroicons-map',
    color: 'orange'
  },
  'final fantasy': {
    name: 'Final Fantasy',
    description: 'Deckboxes y accesorios de los personajes icónicos de Final Fantasy',
    icon: 'i-heroicons-sparkles',
    color: 'purple'
  },
  'pokemon': {
    name: 'Pokémon',
    description: 'Deckboxes y accesorios del mundo Pokémon',
    icon: 'i-heroicons-bolt',
    color: 'yellow'
  },
  'figuras': {
    name: 'Figuras',
    description: 'Figuras decorativas y coleccionables impresas en 3D',
    icon: 'i-heroicons-user-circle',
    color: 'pink'
  },
  'otros': {
    name: 'Otros',
    description: 'Otros productos y accesorios impresos en 3D',
    icon: 'i-heroicons-squares-2x2',
    color: 'gray'
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
