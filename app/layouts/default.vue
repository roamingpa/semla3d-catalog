<template>
  <div class="min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100">
    <!-- Header Global -->
    <header class="bg-default/95 backdrop-blur-sm shadow-sm border-b">
      <UContainer class="py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo / Título -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <UIcon name="i-heroicons-cube" class="w-8 h-8 text-primary" />
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
