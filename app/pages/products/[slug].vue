<script setup>
import { useRoute } from 'vue-router'
import { queryCollection } from '#imports'
import { availableColors, getColorClass } from '@/utils/colors'

const route = useRoute()

const { data: product } = await useAsyncData('product', () =>
  queryCollection('products').where( 'slug', '=', route.params.slug ).first()
)

// Definir el layout para esta página
definePageMeta({
  layout: 'default'
})

// Función para contactar sobre este producto específico
const contactForProduct = () => {
  const productName = product.value?.name || 'producto'
  
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
</script>

<template>
  <div>
    <UContainer class="py-8">
      <div v-if="product">
        <!-- Botón de regreso -->
        <div class="mb-6">
          <UButton 
            to="/" 
            variant="ghost" 
            icon="i-heroicons-arrow-left"
            size="sm"
          >
            Volver al catálogo
          </UButton>
        </div>

        <!-- Contenido principal en tarjeta -->
        <UCard class="overflow-hidden shadow-xl">
          <!-- Grid principal -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <!-- Columna de imágenes -->
            <div class="space-y-4">
              <div v-if="product.images && product.images.length" class="space-y-4">
                <!-- Imagen principal -->
                <div class="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <!-- Galería de imágenes adicionales -->
                <div v-if="product.images.length > 1" class="grid grid-cols-3 gap-2">
                  <div 
                    v-for="(img, index) in product.images.slice(1, 4)" 
                    :key="`thumb-${index}`"
                    class="aspect-square overflow-hidden rounded-lg bg-purple-100 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      :src="img"
                      :alt="`${product.name} - ${index + 2}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div v-else class="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-lg">
                <div class="text-center">
                  <UIcon name="i-heroicons-photo" class="w-20 h-20 text-purple-400 mx-auto mb-2" />
                  <p class="text-purple-500">No image available</p>
                </div>
              </div>
            </div>

            <!-- Columna de información -->
            <div class="space-y-6">
              <!-- Header del producto -->
              <div class="border-b pb-6">
                <h1 class="text-4xl font-black mb-3">{{ product.name }}</h1>
                <p class="text-xl leading-relaxed text-muted">{{ product.description }}</p>
              </div>

              <!-- Precio destacado -->
              <div class="bg-elevated rounded-xl p-6 border">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium mb-1 text-muted">Precio</p>
                    <span class="text-4xl font-bold text-primary">${{ product.price }}</span>
                  </div>
                  <UBadge color="primary" variant="solid" size="lg">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-1" />
                    Disponible
                  </UBadge>
                </div>
              </div>

              <!-- Especificaciones en tarjetas -->
              <div class="space-y-4">
                <h3 class="text-2xl font-bold flex items-center gap-2">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6" />
                  Especificaciones
                </h3>
                
                <!-- Dimensiones con diagrama visual -->
                <DimensionsDisplay v-if="product.size" :size="product.size" />

                <!-- Colores disponibles -->
                <div class="bg-elevated rounded-lg p-4 border shadow-sm">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-swatch" class="w-5 h-5 text-primary" />
                      <span class="font-medium">Colores Disponibles</span>
                      <UBadge variant="soft" color="primary">{{ availableColors.length }}</UBadge>
                    </div>
                    
                    <!-- Grid de colores -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div 
                        v-for="color in availableColors" 
                        :key="color.value"
                        class="flex items-center gap-3 p-2 rounded-lg bg-muted hover:bg-accented transition-colors cursor-pointer"
                        :title="`Disponible en ${color.name}`"
                      >
                        <div 
                          :class="[
                            'w-6 h-6 rounded-full shadow-sm flex-shrink-0',
                            color.cssClass
                          ]"
                        />
                        <span class="text-sm font-medium">{{ color.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="bg-elevated rounded-xl p-6 border">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-information-circle" class="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 class="font-semibold mb-2">Información del Producto</h4>
                    <p class="text-muted text-sm leading-relaxed mb-4">
                      Este es un artículo de catálogo para fines de exhibición. Para consultas sobre precios y disponibilidad, 
                      por favor contacta directamente a nuestro equipo de ventas.
                    </p>
                    
                    <!-- Botón de contacto para este producto -->
                    <UButton 
                      @click="contactForProduct"
                      color="primary" 
                      variant="solid" 
                      size="md"
                      class="w-full cursor-pointer"
                    >
                      <LucideIcon name="Instagram" :size="16" class="mr-2" />
                      Consultar este producto
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Estado de producto no encontrado -->
      <div v-else class="text-center py-20">
        <UCard class="max-w-md mx-auto">
          <div class="text-center p-8">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-20 h-20 text-amber-400 mx-auto mb-6" />
            <h1 class="text-3xl font-bold mb-3">Producto no encontrado</h1>
            <p class="text-muted mb-8 leading-relaxed">
              El producto que buscas no existe en nuestro catálogo.
            </p>
            <UButton to="/" variant="solid" size="lg" icon="i-heroicons-home">
              Volver al catálogo
            </UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
