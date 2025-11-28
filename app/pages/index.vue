<script setup>
import { availableColors } from '@/utils/colors'
import { getAllCategories, getCategoryInfo } from '@/utils/categories'
import { formatPrice } from '@/utils/currency'

const { data: products } = await useAsyncData('products', () =>
  queryCollection('products').all()
)

// Composable para manejar URLs de media
const { getMediaUrl } = useMedia()

// Obtener categorías
const categories = getAllCategories()

// Estado reactivo para filtro por categoría
const selectedCategory = ref(null)

// Productos filtrados
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter(product => product.category === selectedCategory.value)
})

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

// Función para formatear descripción con saltos de línea
const formatDescription = (description) => {
  if (!description) return ''
  return description.replace(/\\n/g, '<br>')
}

// Definir el layout para esta página
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <!-- Categories Filter -->
    <UContainer class="py-6">
      <div class="flex flex-wrap gap-3 justify-center category-buttons">
        <UButton 
          @click="selectedCategory = null"
          :variant="selectedCategory === null ? 'solid' : 'outline'"
          color="primary"
          size="sm"
          class="cursor-pointer"
        >
          Todas las Categorías
        </UButton>
        <UButton 
          v-for="category in categories"
          :key="category.slug"
          @click="selectedCategory = category.slug"
          :variant="selectedCategory === category.slug ? 'solid' : 'outline'"
          color="primary"
          size="sm"
          class="cursor-pointer"
        >
          <LucideIcon :name="category.icon" :size="16" class="mr-2" />
          {{ category.name }}
        </UButton>
      </div>
    </UContainer>

    <!-- Products Grid -->
    <UContainer class="py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-highlighted mb-4">
          <span v-if="selectedCategory">
            Productos de {{ getCategoryInfo(selectedCategory).name }}
          </span>
          <span v-else>Nuestros Productos</span>
        </h2>
        <p class="text-lg text-muted max-w-2xl mx-auto">
          <span v-if="selectedCategory">
            {{ getCategoryInfo(selectedCategory).description }}
          </span>
          <span v-else>
            Explora nuestra colección de artículos impresos en 3D de alta calidad
          </span>
        </p>
      </div>

      <div v-if="filteredProducts && filteredProducts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <UCard 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          :ui="{ 
            base: 'overflow-hidden',
            body: { padding: 'p-4' },
            header: { padding: 'p-0' }
          }"
        >
          <template #header>
            <div class="aspect-square bg-gradient-to-br from-violet-200 to-purple-200 relative overflow-hidden group">
              <!-- Priorizar imagen, si no hay usar video -->
              <img
                v-if="product.images?.[0]"
                :src="getMediaUrl(product.images[0])"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <video
                v-else-if="product.videos?.[0]"
                :src="getMediaUrl(product.videos[0])"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                autoplay
                playsinline
                @mouseenter="$event.target.play()"
                @mouseleave="$event.target.pause()"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-primary" />
              </div>
              
              <!-- Price Badge -->
              <div class="absolute top-3 right-3">
                <UBadge color="primary" variant="solid" size="lg">
                  {{ formatPrice(product.price) }}
                </UBadge>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <div class="bg-white bg-opacity-80 rounded-full px-2 py-1 backdrop-blur-sm shadow-lg">
                  <UBadge 
                    :color="getCategoryInfo(product.category).color" 
                    variant="solid" 
                    size="lg"
                  >
                    {{ getCategoryInfo(product.category).name }}
                  </UBadge>
                </div>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div>
              <h3 class="font-bold text-xl truncate">
                {{ product.name }}
              </h3>
              <p v-html="formatDescription(product.description)" class="text-sm mt-1">
              </p>
            </div>

            <!-- Dimensions -->
            <DimensionsBadge 
              v-if="hasValidDimensions(product.size)" 
              :size="product.size" 
            />

            <!-- View Details Button -->
            <UButton 
              :to="product.path"
              variant="outline" 
              color="primary"
              size="sm"
              class="w-full"
              icon="i-heroicons-eye"
            >
              Ver Detalles
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <UIcon name="i-heroicons-cube" class="w-20 h-20 text-dimmed mx-auto mb-6" />
        <h2 class="text-2xl font-semibold mb-2">No hay productos disponibles</h2>
        <p class="text-muted">¡Vuelve pronto para ver nuevas incorporaciones a nuestro catálogo!</p>
      </div>
    </UContainer>
  </div>
</template>
