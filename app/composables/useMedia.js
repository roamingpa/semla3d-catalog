export const useMedia = () => {
  const config = useRuntimeConfig()
  
  /**
   * Convierte una ruta relativa de media a una URL completa
   * @param {string} path - Ruta relativa (ej: "/catalogo/deckbox-final-fantasy/cactuar/video1.mov")
   * @returns {string} URL completa del recurso
   */
  const getMediaUrl = (path) => {
    if (!path) return ''
    
    // Si la ruta ya es una URL completa, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // Eliminar el slash inicial si existe
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    
    // Codificar la ruta para URL (espacios y caracteres especiales)
    const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
    
    // Combinar con la base URL
    return `${config.public.mediaBaseUrl}/${encodedPath}`
  }
  
  /**
   * Convierte un array de rutas relativas a URLs completas
   * @param {string[]} paths - Array de rutas relativas
   * @returns {string[]} Array de URLs completas
   */
  const getMediaUrls = (paths) => {
    if (!paths || !Array.isArray(paths)) return []
    return paths.map(path => getMediaUrl(path))
  }
  
  return {
    getMediaUrl,
    getMediaUrls
  }
}
