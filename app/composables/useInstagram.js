// Composable para manejar posts de Instagram
export const useInstagram = () => {
  // Función para abrir Instagram
  const openInstagram = () => {
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // En móvil, intentar abrir la app de Instagram
      const instagramAppUrl = `instagram://user?username=semla3d`
      window.location.href = instagramAppUrl
      // Fallback al navegador
      setTimeout(() => {
        window.open(`https://instagram.com/semla3d`, '_blank')
      }, 1000)
    } else {
      // En desktop, abrir Instagram en el navegador
      window.open(`https://instagram.com/semla3d`, '_blank')
    }
  }

  return {
    openInstagram,
  }
}
