<script setup>
import { useRoute } from 'vue-router'
import { queryCollection } from '#imports'
import { availableColors, getColorClass } from '@/utils/colors'
import { formatPrice } from '@/utils/currency'

const route = useRoute()
const { getMediaUrl } = useMedia()

const { data: product, refresh: refreshProduct } = await useAsyncData(`product-${route.params.slug}`, () =>
  queryCollection('products').where( 'slug', '=', route.params.slug ).first()
)

// Función helper para verificar si las dimensiones son válidas
const hasValidDimensions = (size) => {
  if (!size) return false
  
  const { width, height, depth, length } = size
  
  // Verificar que al menos width y height tengan valores no vacíos
  return (
    width && width.toString().trim() !== '' &&
    height && height.toString().trim() !== '' &&
    (
      (depth && depth.toString().trim() !== '') ||
      (length && length.toString().trim() !== '')
    )
  )
}

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

// Combinar imágenes y videos en una sola galería
const mediaGallery = computed(() => {
  if (!product.value) return []
  
  const gallery = []
  
  // Agregar imágenes
  if (product.value.images && product.value.images.length > 0) {
    product.value.images.forEach(img => {
      gallery.push({ type: 'image', src: img })
    })
  }
  
  // Agregar videos
  if (product.value.videos && product.value.videos.length > 0) {
    product.value.videos.forEach(video => {
      gallery.push({ type: 'video', src: video })
    })
  }
  
  return gallery
})

// Estado para el mensaje de copia
const showCopyMessage = ref(false)
const copiedMessage = ref('')

// Función para cambiar la imagen principal
const selectImage = (index) => {
  selectedImageIndex.value = index
}

// Formatear descripción con saltos de línea
const formattedDescription = computed(() => {
  if (!product.value?.description) return ''
  return product.value.description.replace(/\\n/g, '<br>')
})

// Ordenar bulk pricing por cantidad mínima
const sortedBulkPricing = computed(() => {
  if (!product.value?.bulk_pricing || !Array.isArray(product.value.bulk_pricing)) return []
  return [...product.value.bulk_pricing].sort((a, b) => a.min_quantity - b.min_quantity)
})

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
  ogImage: () => product.value?.images?.[0] ? getMediaUrl(product.value.images[0]) : '',
  ogUrl: () => process.client ? window.location.href : `https://semla3d.com/products/${route.params.slug}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => product.value ? `${product.value.name} - Semla3D` : 'Producto - Semla3D',
  twitterDescription: () => product.value?.description || 'Producto impreso en 3D de alta calidad',
  twitterImage: () => product.value?.images?.[0] ? getMediaUrl(product.value.images[0]) : '',
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
            <!-- Columna de imágenes y videos -->
            <div class="space-y-4">
              <div v-if="mediaGallery.length > 0" class="space-y-4">
                <!-- Media principal (imagen o video) -->
                <div class="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg">
                  <!-- Mostrar imagen -->
                  <img
                    v-if="mediaGallery[selectedImageIndex].type === 'image'"
                    :src="getMediaUrl(mediaGallery[selectedImageIndex].src)"
                    :alt="product.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <!-- Mostrar video -->
                  <video
                    v-else-if="mediaGallery[selectedImageIndex].type === 'video'"
                    :src="getMediaUrl(mediaGallery[selectedImageIndex].src)"
                    class="w-full h-full object-cover"
                    muted
                    loop
                    autoplay
                    playsinline
                  />
                </div>
                
                <!-- Galería de miniaturas (imágenes y videos) -->
                <div v-if="mediaGallery.length > 1" class="grid grid-cols-4 gap-2">
                  <div 
                    v-for="(media, index) in mediaGallery" 
                    :key="`thumb-${index}`"
                    class="aspect-square overflow-hidden rounded-lg bg-purple-100 cursor-pointer hover:opacity-80 transition-all duration-200 border-2 relative"
                    :class="{
                      'border-primary ring-2 ring-primary/30': selectedImageIndex === index,
                      'border-transparent hover:border-primary/50': selectedImageIndex !== index
                    }"
                    @click="selectImage(index)"
                  >
                    <!-- Thumbnail de imagen -->
                    <img
                      v-if="media.type === 'image'"
                      :src="getMediaUrl(media.src)"
                      :alt="`${product.name} - ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                    <!-- Thumbnail de video -->
                    <video
                      v-else-if="media.type === 'video'"
                      :src="getMediaUrl(media.src)"
                      class="w-full h-full object-cover"
                      muted
                    />
                    <!-- Icono de play para videos -->
                    <div
                      v-if="media.type === 'video'"
                      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none"
                    >
                      <UIcon name="i-heroicons-play-circle" class="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-lg">
                <div class="text-center">
                  <UIcon name="i-heroicons-photo" class="w-20 h-20 text-purple-400 mx-auto mb-2" />
                  <p class="text-purple-500">No hay imágenes o videos disponibles</p>
                </div>
              </div>
            </div>

            <!-- Columna de información -->
            <div class="space-y-4">
              <!-- Header del producto -->
              <div>
                <h1 class="text-3xl font-black mb-2">{{ product.name }}</h1>
                <p v-html="formattedDescription" class="text-base leading-relaxed text-muted"></p>
              </div>

              <!-- Compartir (estilo Instagram) -->
              <div class="flex items-center gap-2 py-2 border-y">
                <span class="text-sm text-muted">Compartir:</span>
                <div class="flex gap-2">
                  <button 
                    @click="shareOnWhatsApp"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Compartir en WhatsApp"
                  >
                    <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5 text-green-600" />
                  </button>
                  <button 
                    @click="shareOnTwitter"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Compartir en Twitter"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                  </button>
                  <button 
                    @click="copyProductLink"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Copiar enlace"
                  >
                    <UIcon name="i-heroicons-link" class="w-5 h-5" />
                  </button>
                </div>
                <div v-if="showCopyMessage" class="text-xs text-green-600 ml-2">
                  ✓ {{ copiedMessage }}
                </div>
              </div>

              <!-- Precio destacado -->
              <div class="bg-elevated rounded-lg p-4 border">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-3xl font-black text-primary">{{ formatPrice(product.price) }}</span>
                  </div>
                  <UBadge color="primary" variant="soft" size="md">
                    A pedido
                  </UBadge>
                </div>

                <!-- Bulk Pricing Tiers -->
                <div v-if="sortedBulkPricing.length > 0" class="border-t pt-3 mt-3">
                  <p class="text-xs font-medium text-muted mb-2 flex items-center gap-1">
                    <UIcon name="i-heroicons-tag" class="w-3 h-3" />
                    Precios por volumen
                  </p>
                  <div class="space-y-1.5">
                    <div 
                      v-for="(tier, index) in sortedBulkPricing" 
                      :key="index"
                      class="flex items-center justify-between bg-primary-50 dark:bg-primary-950 rounded-lg px-3 py-2"
                    >
                      <span class="text-xs font-medium">
                        Desde {{ tier.min_quantity }} unidades
                      </span>
                      <span class="text-base font-bold text-primary">
                        {{ formatPrice(tier.unit_price) }} c/u
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Especificaciones -->
              <div class="space-y-3">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
                  Especificaciones
                </h3>
                
                <!-- Dimensiones con diagrama visual -->
                <DimensionsDisplay 
                  v-if="hasValidDimensions(product.size)" 
                  :size="product.size" 
                />

                <!-- Opciones de personalización -->
                <div v-if="product.customizable_options && product.customizable_options.length > 0" class="bg-elevated border rounded-lg p-4">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
                      <span class="font-medium">Opciones de Personalización</span>
                    </div>
                    
                    <!-- Lista de opciones -->
                    <div class="space-y-2">
                      <div 
                        v-for="option in product.customizable_options" 
                        :key="option"
                        class="flex items-center gap-2 text-sm"
                      >
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 flex-shrink-0" />
                        <span>{{ option }}</span>
                      </div>
                    </div>
                    
                    <!-- Nota informativa -->
                    <div class="bg-muted/50 rounded-md p-3 mt-3">
                      <p class="text-xs text-muted">
                        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
                        Las personalizaciones pueden afectar el tiempo de producción y precio.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Tiempo de producción -->
                <div v-if="product.print_time" class="bg-elevated rounded-lg p-4 border">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                    <div class="flex-1">
                      <span class="font-medium">Tiempo mínimo de Producción</span>
                      <p class="text-sm text-muted mt-1">{{ product.print_time }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información de entrega -->
              <div class="bg-elevated border rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-truck" class="w-5 h-5 mt-0.5" />
                  <div class="flex-1">
                    <h4 class="font-semibold mb-2 text-sm">Entrega y Envíos</h4>
                    
                    <div class="space-y-2 text-xs text-muted">
                      <p>• {{ product.print_time ? `${product.print_time} de producción + 1-3 días de envío` : '3-7 días hábiles' }}</p>
                      <p>• Envíos a todo Chile vía Starken</p>
                      <p>• Entrega presencial en Santiago (metros)</p>
                      <p>• Envíos combinados con <a href="https://www.instagram.com/aso.tcg/" target="_blank" class="underline hover:opacity-80">
                        @aso.tcg
                      </a></p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de consulta -->
              <UButton 
                @click="contactForProduct"
                color="primary" 
                variant="solid" 
                size="lg"
                class="w-full cursor-pointer"
              >
                <LucideIcon name="Instagram" :size="20" class="mr-2" />
                Consultar por Instagram
              </UButton>

              <!-- Información compacta -->
              <div class="text-xs text-center text-muted">
                <p>Consulta disponibilidad, precios personalizados y tiempos de entrega</p>
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
              <!-- Imagen/Video del producto -->
              <div class="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 mb-4">
                <img
                  v-if="combinaProduct.images?.[0]"
                  :src="getMediaUrl(combinaProduct.images[0])"
                  :alt="combinaProduct.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <video
                  v-else-if="combinaProduct.videos?.[0]"
                  :src="getMediaUrl(combinaProduct.videos[0])"
                  class="w-full h-full object-cover"
                  muted
                  loop
                  autoplay
                  playsinline
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
                    {{ formatPrice(combinaProduct.price) }}
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
          
          <!-- Grid estilo Instagram -->
          <div class="grid grid-cols-3 gap-1 md:gap-2 max-w-4xl mx-auto mb-8">
            <NuxtLink
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.slug"
              :to="`/products/${relatedProduct.slug}`"
              class="aspect-square cursor-pointer overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity relative group"
            >
              <!-- Imagen principal -->
              <img
                v-if="relatedProduct.images?.[0]"
                :src="getMediaUrl(relatedProduct.images[0])"
                :alt="relatedProduct.name"
                class="w-full h-full object-cover"
              />
              <video
                v-else-if="relatedProduct.videos?.[0]"
                :src="getMediaUrl(relatedProduct.videos[0])"
                class="w-full h-full object-cover"
                muted
                loop
                playsinline
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-200 to-purple-200">
                <UIcon name="i-heroicons-photo" class="w-8 h-8 md:w-12 md:h-12 text-primary" />
              </div>

              <!-- Overlay con información (solo visible en hover desktop) -->
              <div class="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center p-4 text-white text-center">
                <h3 class="font-bold text-lg mb-2 line-clamp-2">
                  {{ relatedProduct.name }}
                </h3>
                <p class="text-2xl font-black">
                  {{ formatPrice(relatedProduct.price) }}
                </p>
              </div>

              <!-- Badge de precio (solo mobile) -->
              <div class="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p class="text-white text-xs font-bold truncate">
                  {{ relatedProduct.name }}
                </p>
                <p class="text-white text-sm font-black">
                  {{ formatPrice(relatedProduct.price) }}
                </p>
              </div>
            </NuxtLink>
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
