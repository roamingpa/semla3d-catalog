<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100">
    <!-- Header Global -->
    <header class="bg-default/95 backdrop-blur-sm shadow-sm border-b relative z-50">
      <UContainer class="py-4">
        <!-- Layout para desktop -->
        <div class="hidden md:flex items-center justify-between gap-4">
          <!-- Logo / Título -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img :src="getMediaUrl('catalogo/logo/1.jpg')" alt="Semla3D Logo" class="w-8 h-8 object-contain" />
              <h1 class="text-xl font-bold text-highlighted">Semla3D</h1>
            </NuxtLink>
          </div>

          <!-- Barra de búsqueda -->
          <div class="flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          <!-- Navegación adicional -->
          <div class="flex-shrink-0 flex items-center gap-2">
            <UButton
              to="/"
              variant="ghost"
              size="sm"
              icon="i-heroicons-home"
            >
              Catálogo
            </UButton>
            <UButton
              to="/stock"
              variant="ghost"
              size="sm"
              icon="i-heroicons-check-circle"
            >
              Stock
            </UButton>
          </div>
        </div>

        <!-- Layout para móvil -->
        <div class="md:hidden space-y-3">
          <!-- Primera fila: Logo y navegación -->
          <div class="flex items-center justify-between">
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img :src="getMediaUrl('catalogo/logo/1.jpg')" alt="Semla3D Logo" class="w-7 h-7 object-contain" />
                <h1 class="text-lg font-bold text-highlighted">Semla3D</h1>
              </NuxtLink>
            </div>
            
            <div class="flex-shrink-0 flex items-center gap-1">
              <UButton
                to="/"
                variant="ghost"
                size="sm"
                icon="i-heroicons-home"
              >
                <span class="sr-only">Catálogo</span>
              </UButton>
              <UButton
                to="/stock"
                variant="ghost"
                size="sm"
              >
                🟢
              </UButton>
            </div>
          </div>

          <!-- Segunda fila: Barra de búsqueda a ancho completo -->
          <div class="w-full">
            <SearchBar />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Contenido principal -->
    <main>
      <slot />
    </main>

    <!-- Call to Action Instagram -->
    <section class="bg-primary/10 border-t border-primary/20 py-12">
      <UContainer>
        <div class="text-center max-w-2xl mx-auto">
          <div class="mb-6">
            <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 class="text-2xl font-bold text-highlighted mb-2">¿Te gusta lo que ves?</h2>
            <p class="text-lg text-muted">
              Este es solo nuestro catálogo. Para realizar tu pedido, contáctanos directamente por Instagram.
            </p>
          </div>
          
          <div class="space-y-4">
            <UButton
              size="lg"
              color="primary"
              variant="solid"
              class="text-lg px-8 py-3 cursor-pointer"
              @click="openInstagramMessage"
            >
              <LucideIcon name="Instagram" :size="20" class="mr-2" />
              Escribir por Instagram
            </UButton>
            
            <div class="flex items-center justify-center gap-4 text-sm text-dimmed">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span>Respuesta rápida</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                <span>Atención personalizada</span>
              </div>
            </div>
            
            <p class="text-sm text-muted">
              <span class="inline-flex items-center gap-1">
                <LucideIcon name="Instagram" :size="14" />
                Instagram: <a href="https://instagram.com/semla3d" target="_blank" class="text-primary hover:underline font-medium">@semla3d</a>
              </span>
            </p>
          </div>
        </div>
      </UContainer>
    </section>

     <!-- Páginas Amigas Section -->
    <section class="bg-white/80 backdrop-blur-sm border-t border-primary/20 py-12">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-highlighted mb-4">Páginas Amigas</h2>
          <p class="text-lg text-muted max-w-2xl mx-auto">
            Descubre otros emprendimientos increíbles que recomendamos
          </p>
        </div>

        <div class="flex justify-center">
          <div class="max-w-md">
            <UCard 
              class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              :ui="{ 
                base: 'overflow-hidden border border-primary/20 bg-white/90 backdrop-blur-sm',
                body: { padding: 'p-6' }
              }"
            >
              <div class="text-center space-y-4">
                <!-- Instagram Icon -->
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UIcon name="i-simple-icons-instagram" class="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 class="text-xl font-bold text-highlighted mb-2">@aso.tcg</h3>
                  <p class="text-muted text-sm mb-4">
                    Tu tienda especializada en Trading Card Games. Cartas, sobres, accesorios y todo lo que necesitas para tu juego favorito.
                  </p>
                </div>

                <!-- Features -->
                <div class="space-y-2 text-sm text-muted">
                  <div class="flex items-center justify-center gap-2">
                    <UIcon name="i-heroicons-gift" class="w-4 h-4 text-primary" />
                    <span>Trading Card Games</span>
                  </div>
                  <div class="flex items-center justify-center gap-2">
                    <UIcon name="i-heroicons-truck" class="w-4 h-4 text-primary" />
                    <span>Envíos combinados disponibles</span>
                  </div>
                  <div class="flex items-center justify-center gap-2">
                    <UIcon name="i-heroicons-star" class="w-4 h-4 text-primary" />
                    <span>Productos de calidad</span>
                  </div>
                </div>

                <!-- Visit Button -->
                <UButton 
                  to="https://www.instagram.com/aso.tcg/"
                  target="_blank"
                  color="primary"
                  size="lg"
                  icon="i-simple-icons-instagram"
                  class="w-full"
                  external
                >
                  Visitar @aso.tcg
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Footer -->
    <footer class="bg-default/95 backdrop-blur-sm border-t mt-16">
      <UContainer class="py-8">
        <div class="text-center text-muted">
          <p class="mb-2">© 2025 Catálogo Semla3D. Todos los derechos reservados.</p>
          <p class="text-sm text-dimmed">Productos impresos en 3D premium diseñados con precisión y calidad.</p>
        </div>
      </UContainer>
    </footer>

  </div>
</template>

<script setup>
// Inicializar el índice de búsqueda al cargar el layout
const { initializeSearch } = useSearch()
const { getMediaUrl } = useMedia()

onMounted(() => {
  initializeSearch()
})

// Función para abrir Instagram con mensaje
const openInstagramMessage = () => {
  // Intentar abrir la app de Instagram primero, luego el navegador
  const instagramAppUrl = `instagram://user?username=semla3d`
  const instagramWebUrl = `https://instagram.com/semla3d`
  
  // Detectar si es móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (isMobile) {
    // En móvil, intentar abrir la app
    window.location.href = instagramAppUrl
    // Fallback al navegador después de un pequeño delay
    setTimeout(() => {
      window.open(instagramWebUrl, '_blank')
    }, 1000)
  } else {
    // En desktop, abrir directamente en el navegador
    window.open(instagramWebUrl, '_blank')
  }
}
</script>
