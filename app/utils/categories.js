// Definición de categorías con sus propiedades
export const categories = {
  tcg: {
    name: 'TCG',
    description: 'Juegos de cartas coleccionables y accesorios para torneos',
    icon: 'CreditCard',
    color: 'blue'
  },
  rpg: {
    name: 'RPG',
    description: 'Dados personalizados y accesorios para juegos de rol',
    icon: 'Dice6',
    color: 'purple'
  },
  cocina: {
    name: 'Cocina',
    description: 'Utensilios prácticos y funcionales para tu cocina',
    icon: 'ChefHat',
    color: 'orange'
  },
  oficina: {
    name: 'Oficina',
    description: 'Soluciones de organización y productividad para tu espacio de trabajo',
    icon: 'Briefcase',
    color: 'green'
  },
  accesorios: {
    name: 'Accesorios',
    description: 'Accesorios útiles para el día a día',
    icon: 'Smartphone',
    color: 'cyan'
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
