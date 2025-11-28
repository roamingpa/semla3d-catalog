/**
 * Formatea un número como precio con separador de miles
 * @param {number} amount - El monto a formatear
 * @param {string} currency - El símbolo de moneda (default: '$')
 * @returns {string} El precio formateado (ej: "$22.000")
 */
export function formatPrice(amount, currency = '$') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`
  }
  
  // Convertir a número si es string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Formatear con separador de miles (punto para Chile)
  const formatted = numAmount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return `${currency}${formatted}`
}

/**
 * Formatea solo el número sin símbolo de moneda
 * @param {number} amount - El monto a formatear
 * @returns {string} El número formateado (ej: "22.000")
 */
export function formatNumber(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0'
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  return numAmount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}
