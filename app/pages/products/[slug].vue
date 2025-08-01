<script setup>
import { useRoute } from 'vue-router'
import { queryCollection } from '#imports'
import { availableColors, getColorClass } from '@/utils/colors'

const route = useRoute()

const { data: product, refresh: refreshProduct } = await useAsyncData(`product-${route.params.slug}`, () =>
  queryCollection('products').where( 'slug', '=', route.params.slug ).first()
)

// Obtener productos que combinan bien (selección manual)
const { data: combinaBienCon, refresh: refreshCombina } = await useAsyncData(`combina-bien-${route.params.slug}`, async () => {
  if (!product.value?.combina_bien_con?.length) return []
  
  const combinaSlugs = product.value.combina_bien_con
  const products = await queryCollection('products').all()
  
  return products.filter(p => combinaSlugs.includes(p.slug))
})

// Obtener productos relacionados aleatorios basados en la categoría
const { data: relatedProducts, refresh: refreshRelated } = await useAsyncData(`related-products-${route.params.slug}`, async () => {
  if (!product.value?.category) return []
  
  const products = await queryCollection('products').all()
  
  // Filtrar productos de la misma categoría excluyendo el producto actual
  const sameCategory = products.filter(p => 
    p.category === product.value.category && 
    p.slug !== product.value.slug
  )
  
  // Mezclar aleatoriamente y tomar máximo 4 productos
  const shuffled = sameCategory.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 4)
})

// Observar cambios en la ruta y refrescar datos
watch(() => route.params.slug, async () => {
  selectedImageIndex.value = 0 // Resetear la imagen seleccionada
  await refreshProduct()
  await refreshCombina()
  await refreshRelated()
})

// Estado para la imagen principal seleccionada
const selectedImageIndex = ref(0)

// Estado para el mensaje de copia
const showCopyMessage = ref(false)
const copiedMessage = ref('')

// Función para cambiar la imagen principal
const selectImage = (index) => {
  selectedImageIndex.value = index
}

// Definir el layout para esta página
definePageMeta({
  layout: 'default'
})

// Meta tags dinámicos para redes sociales
useSeoMeta({
  title: () => product.value ? `${product.value.name} - Semla3D` : 'Producto - Semla3D',
  description: () => product.value?.description || 'Producto impreso en 3D de alta calidad',
  ogTitle: () => product.value ? `${product.value.name} - Semla3D` : 'Producto - Semla3D',
  ogDescription: () => product.value?.description || 'Producto impreso en 3D de alta calidad',
  ogImage: () => product.value?.images?.[0] || '',
  ogUrl: () => process.client ? window.location.href : `https://semla3d.com/products/${route.params.slug}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => product.value ? `${product.value.name} - Semla3D` : 'Producto - Semla3D',
  twitterDescription: () => product.value?.description || 'Producto impreso en 3D de alta calidad',
  twitterImage: () => product.value?.images?.[0] || '',
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

// Funciones para compartir en redes sociales
const getProductUrl = () => {
  return window.location.href
}

const getShareText = () => {
  const productName = product.value?.name || 'producto'
  const price = product.value?.price || ''
  return `¡Mira este increíble ${productName} impreso en 3D! ${price ? `Precio: $${price}` : ''} - Semla3D`
}

const shareOnWhatsApp = () => {
  const text = encodeURIComponent(getShareText())
  const url = encodeURIComponent(getProductUrl())
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
}

const shareOnFacebook = () => {
  const url = getProductUrl()
  const text = getShareText()
  
  // Verificar si estamos en desarrollo (localhost)
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // En desarrollo, usar el método de copia con mensaje informativo
    navigator.clipboard.writeText(`${text} ${url}`).then(() => {
      alert('Como estás en desarrollo local, se ha copiado el contenido al portapapeles.\n\nEn producción, esto abrirá Facebook directamente.')
    }).catch(() => {
      // Fallback
      const textToCopy = `${text} ${url}`
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Como estás en desarrollo local, se ha copiado el contenido al portapapeles.\n\nEn producción, esto abrirá Facebook directamente.')
    })
    return
  }
  
  // En producción, intentar múltiples métodos
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  
  // Método 1: Intentar con sharer.php (más confiable)
  try {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      'facebook-share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    )
  } catch (error) {
    // Método 2: Fallback simple
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      '_blank'
    )
  }
}

const shareOnTwitter = () => {
  const text = encodeURIComponent(getShareText())
  const url = encodeURIComponent(getProductUrl())
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

const copyProductLink = async () => {
  try {
    await navigator.clipboard.writeText(getProductUrl())
    showCopyMessage.value = true
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      showCopyMessage.value = false
    }, 3000)
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = getProductUrl()
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    showCopyMessage.value = true
    setTimeout(() => {
      showCopyMessage.value = false
    }, 3000)
  }
}

// Función para copiar datos de transferencia al portapapeles
const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text)
    
    // Mostrar mensaje específico según el tipo
    const messages = {
      banco: 'Banco copiado',
      tipoCuenta: 'Tipo de cuenta copiado',
      numeroCuenta: 'Número de cuenta copiado',
      rut: 'RUT copiado',
      titular: 'Titular copiado',
      email: 'Email copiado'
    }
    
    copiedMessage.value = messages[type] || 'Copiado'
    
    // Limpiar el mensaje después de 2 segundos
    setTimeout(() => {
      copiedMessage.value = ''
    }, 2000)
    
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copiedMessage.value = 'Copiado'
    setTimeout(() => {
      copiedMessage.value = ''
    }, 2000)
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
                    :src="product.images[selectedImageIndex]"
                    :alt="product.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <!-- Galería de imágenes adicionales -->
                <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-2">
                  <div 
                    v-for="(img, index) in product.images" 
                    :key="`thumb-${index}`"
                    class="aspect-square overflow-hidden rounded-lg bg-purple-100 cursor-pointer hover:opacity-80 transition-all duration-200 border-2"
                    :class="{
                      'border-primary ring-2 ring-primary/30': selectedImageIndex === index,
                      'border-transparent hover:border-primary/50': selectedImageIndex !== index
                    }"
                    @click="selectImage(index)"
                  >
                    <img
                      :src="img"
                      :alt="`${product.name} - ${index + 1}`"
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

                <!-- Tiempo de producción -->
                <div v-if="product.print_time" class="bg-elevated rounded-lg p-4 border shadow-sm">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary" />
                    <div class="flex-1">
                      <span class="font-medium">Tiempo mínimo de Producción</span>
                      <p class="text-sm text-muted mt-1">{{ product.print_time }}</p>
                    </div>
                  </div>
                </div>

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
                        class="flex items-center gap-3 p-2 rounded-lg bg-muted"
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

                <!-- Opciones de personalización -->
                <div v-if="product.customizable_options && product.customizable_options.length > 0" class="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4 shadow-sm">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-violet-600" />
                      <span class="font-medium text-violet-900">Opciones de Personalización</span>
                    </div>
                    
                    <!-- Lista de opciones -->
                    <div class="space-y-2">
                      <div 
                        v-for="option in product.customizable_options" 
                        :key="option"
                        class="flex items-center gap-2 text-sm"
                      >
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-violet-600 flex-shrink-0" />
                        <span class="text-violet-800">{{ option }}</span>
                      </div>
                    </div>
                    
                    <!-- Nota informativa -->
                    <div class="bg-violet-100 rounded-md p-3 mt-3">
                      <p class="text-xs text-violet-700">
                        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
                        Las personalizaciones pueden afectar el tiempo de producción y precio. Consúltanos para más detalles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información de entrega y envíos -->
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-truck" class="w-6 h-6 text-blue-600 mt-1" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-blue-900 mb-3">Entrega y Envíos</h4>
                    
                    <div class="space-y-3">
                      <!-- Tiempo de entrega -->
                      <div class="flex items-start gap-2">
                        <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-blue-600 mt-0.5" />
                        <div class="text-sm">
                          <span class="font-medium text-blue-900">Tiempo de entrega:</span>
                          <p class="text-blue-700">
                            {{ product.print_time ? `${product.print_time} de producción + 1-3 días de envío` : '3-7 días hábiles' }}
                            (puede variar según cantidad de pedidos activos)
                          </p>
                        </div>
                      </div>
                      
                      <!-- Métodos de entrega -->
                      <div class="flex items-start gap-2">
                        <UIcon name="i-heroicons-truck" class="w-4 h-4 text-blue-600 mt-0.5" />
                        <div class="text-sm">
                          <span class="font-medium text-blue-900">Opciones de entrega:</span>
                          <ul class="text-blue-700 mt-1 space-y-1">
                            <li>• Envíos a todo el país a través de Starken</li>
                            <li>• Entrega presencial a coordinar en metros de Santiago</li>
                          </ul>
                        </div>
                      </div>

                      <!-- Envíos combinados -->
                      <div class="bg-blue-100 rounded-lg p-4 border border-blue-300">
                        <div class="flex items-start gap-2">
                          <UIcon name="i-heroicons-gift" class="w-4 h-4 text-blue-600 mt-0.5" />
                          <div class="text-sm">
                            <span class="font-medium text-blue-900">¡Envíos combinados disponibles!</span>
                            <p class="text-blue-700 mt-1">
                              Hacemos envíos combinados con 
                              <a 
                                href="https://www.instagram.com/aso.tcg/" 
                                target="_blank" 
                                class="font-semibold underline hover:text-blue-800 transition-colors"
                              >
                                @aso.tcg
                              </a>
                              para optimizar costos de envío. ¡Perfecto para gamers que necesitan cartas y accesorios 3D!
                            </p>
                            <div class="mt-2 flex items-center gap-2">
                              <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-green-600" />
                              <span class="text-xs text-blue-600 font-medium">Ahorra en costos de envío</span>
                            </div>
                          </div>
                        </div>
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
                      class="w-full cursor-pointer mb-3"
                    >
                      <LucideIcon name="Instagram" :size="16" class="mr-2" />
                      Consultar este producto
                    </UButton>

                    <!-- Enlace a métodos de pago -->
                    <UButton 
                      to="/como-pagar"
                      color="green" 
                      variant="outline" 
                      size="md"
                      class="w-full"
                      icon="i-heroicons-credit-card"
                    >
                      Ver métodos de pago
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- Compartir en Redes Sociales -->
              <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-share" class="w-6 h-6 text-emerald-600 mt-1" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-emerald-900 mb-3">Compartir este Producto</h4>
                    <p class="text-sm text-emerald-700 mb-4">¡Comparte este increíble producto con tus amigos!</p>
                    
                    <!-- Botones de redes sociales -->
                    <div class="flex flex-wrap gap-3">
                      <!-- WhatsApp -->
                      <UButton 
                        @click="shareOnWhatsApp"
                        color="primary" 
                        variant="solid" 
                        size="sm"
                        class="cursor-pointer !bg-green-500 hover:!bg-green-600 !text-white !border-green-500"
                      >
                        <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-4 h-4 mr-2" />
                        WhatsApp
                      </UButton>
                      
                      <!-- Facebook -->
                      <UButton 
                        @click="shareOnFacebook"
                        color="primary" 
                        variant="solid" 
                        size="sm"
                        class="cursor-pointer !bg-blue-600 hover:!bg-blue-700 !text-white !border-blue-600"
                      >
                        <UIcon name="i-heroicons-globe-alt" class="w-4 h-4 mr-2" />
                        Facebook
                      </UButton>
                      
                      <!-- Twitter/X -->
                      <UButton 
                        @click="shareOnTwitter"
                        color="primary" 
                        variant="solid" 
                        size="sm"
                        class="cursor-pointer !bg-slate-800 hover:!bg-slate-900 !text-white !border-slate-800"
                      >
                        <UIcon name="i-heroicons-at-symbol" class="w-4 h-4 mr-2" />
                        Twitter
                      </UButton>
                      
                      <!-- Copiar enlace -->
                      <UButton 
                        @click="copyProductLink"
                        color="primary" 
                        variant="outline" 
                        size="sm"
                        class="cursor-pointer"
                      >
                        <UIcon name="i-heroicons-link" class="w-4 h-4 mr-2" />
                        Copiar enlace
                      </UButton>
                    </div>
                    
                    <!-- Mensaje de confirmación -->
                    <div v-if="showCopyMessage" class="mt-3 p-2 bg-emerald-100 text-emerald-700 text-xs rounded-md">
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline mr-1" />
                      ¡Enlace copiado al portapapeles!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Combina Bien Con (Selección Manual) -->
        <div v-if="combinaBienCon && combinaBienCon.length > 0" class="mt-12">
          <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
            <UIcon name="i-heroicons-heart" class="w-8 h-8 text-pink-500" />
            Combina bien con
          </h2>
          <p class="text-muted mb-6">Productos perfectamente elegidos que van muy bien junto con este artículo</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <UCard 
              v-for="combinaProduct in combinaBienCon" 
              :key="combinaProduct.slug"
              class="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              @click="navigateTo(`/products/${combinaProduct.slug}`)"
            >
              <!-- Imagen del producto -->
              <div class="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 mb-4">
                <img
                  v-if="combinaProduct.images?.[0]"
                  :src="combinaProduct.images[0]"
                  :alt="combinaProduct.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="w-12 h-12 text-pink-400" />
                </div>
              </div>
              
              <!-- Información del producto -->
              <div class="p-4">
                <h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {{ combinaProduct.name }}
                </h3>
                <p class="text-sm text-muted mb-3 line-clamp-2">
                  {{ combinaProduct.description }}
                </p>
                
                <!-- Precio -->
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold text-pink-600">
                    ${{ combinaProduct.price }}
                  </span>
                  <UBadge color="secondary" variant="soft" size="sm">
                    {{ combinaProduct.category }}
                  </UBadge>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Productos Relacionados (Aleatorios por Categoría) -->
        <div v-if="relatedProducts && relatedProducts.length > 0" class="mt-12">
          <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-primary" />
            Productos Relacionados
          </h2>
          <p class="text-muted mb-6">Otros productos de la categoría <span class="font-medium text-primary">{{ product.category }}</span> que podrían interesarte</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <UCard 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.slug"
              class="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              @click="navigateTo(`/products/${relatedProduct.slug}`)"
            >
              <!-- Imagen del producto -->
              <div class="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
                <img
                  v-if="relatedProduct.images?.[0]"
                  :src="relatedProduct.images[0]"
                  :alt="relatedProduct.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="w-12 h-12 text-purple-400" />
                </div>
              </div>
              
              <!-- Información del producto -->
              <div class="p-4">
                <h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {{ relatedProduct.name }}
                </h3>
                <p class="text-sm text-muted mb-3 line-clamp-2">
                  {{ relatedProduct.description }}
                </p>
                
                <!-- Precio -->
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold text-primary">
                    ${{ relatedProduct.price }}
                  </span>
                  <UBadge color="primary" variant="soft" size="sm">
                    {{ relatedProduct.category }}
                  </UBadge>
                </div>
              </div>
            </UCard>
          </div>
          
          <!-- Botón para ver más productos -->
          <div class="text-center mt-8">
            <UButton 
              to="/" 
              variant="outline" 
              size="lg"
              icon="i-heroicons-squares-2x2"
            >
              Ver todo el catálogo
            </UButton>
          </div>
        </div>
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
