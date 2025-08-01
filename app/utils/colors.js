// Configuración global de colores disponibles para todos los productos
export const availableColors = [
  {
    name: 'Negro',
    value: 'negro',
    hex: '#000000',
    cssClass: 'bg-gray-900'
  },
  {
    name: 'Blanco',
    value: 'blanco',
    hex: '#FFFFFF',
    cssClass: 'bg-white border border-gray-300'
  },
  {
    name: 'Rojo',
    value: 'rojo',
    hex: '#EF4444',
    cssClass: 'bg-red-500'
  },
  {
    name: 'Azul',
    value: 'azul',
    hex: '#3B82F6',
    cssClass: 'bg-blue-500'
  },
  {
    name: 'Verde',
    value: 'verde',
    hex: '#10B981',
    cssClass: 'bg-green-500'
  },
  {
    name: 'Amarillo',
    value: 'amarillo',
    hex: '#F59E0B',
    cssClass: 'bg-yellow-500'
  },
  {
    name: 'Morado',
    value: 'morado',
    hex: '#8B5CF6',
    cssClass: 'bg-purple-500'
  },
  {
    name: 'Rosa',
    value: 'rosa',
    hex: '#EC4899',
    cssClass: 'bg-pink-500'
  },
  {
    name: 'Gris',
    value: 'gris',
    hex: '#6B7280',
    cssClass: 'bg-gray-500'
  }
]

// Función helper para obtener información de un color
export const getColorInfo = (colorValue) => {
  return availableColors.find(color => color.value === colorValue) || {
    name: colorValue,
    value: colorValue,
    hex: '#6B7280',
    cssClass: 'bg-gray-400'
  }
}

// Función para obtener la clase CSS de un color
export const getColorClass = (colorValue) => {
  const colorInfo = getColorInfo(colorValue)
  return colorInfo.cssClass
}
