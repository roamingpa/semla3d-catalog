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

// Estado reactivo para ordenamiento
const sortBy = ref('name') // 'name' | 'price-asc' | 'price-desc'

// Productos filtrados y ordenados
const filteredProducts = computed(() => {
  let result = products.value
  
  // Filtrar por categoría
  if (selectedCategory.value) {
    result = result.filter(product => product.category === selectedCategory.value)
  }
  
  // Ordenar
  const sorted = [...result]
  if (sortBy.value === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price)
  }
  
  return sorted
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
    <UContainer class="py-6 relative z-0">
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
          <UIcon :name="category.icon" class="w-4 h-4 mr-2" />
          {{ category.name }}
        </UButton>
      </div>
      
      <!-- Sort Options -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <span class="text-xs uppercase tracking-wide font-semibold text-gray-500">Ordenar por:</span>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <UButton 
              @click="sortBy = 'name'"
              :variant="sortBy === 'name' ? 'solid' : 'outline'"
              color="primary"
              size="xs"
              class="cursor-pointer border"
            >
              <UIcon name="i-heroicons-bars-3-bottom-left" class="w-3 h-3 mr-1" />
              Nombre
            </UButton>
            <UButton 
              @click="sortBy = 'price-asc'"
              :variant="sortBy === 'price-asc' ? 'solid' : 'outline'"
              color="primary"
              size="xs"
              class="cursor-pointer border"
            >
              <UIcon name="i-heroicons-arrow-up" class="w-3 h-3 mr-1" />
              Precio
            </UButton>
            <UButton 
              @click="sortBy = 'price-desc'"
              :variant="sortBy === 'price-desc' ? 'solid' : 'outline'"
              color="primary"
              size="xs"
              class="cursor-pointer border"
            >
              <UIcon name="i-heroicons-arrow-down" class="w-3 h-3 mr-1" />
              Precio
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Products Grid -->
    <UContainer class="py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-highlighted mb-4">
          <span v-if="selectedCategory">
            PRODUCTOS DE {{ getCategoryInfo(selectedCategory).name.toUpperCase() }}
          </span>
          <span v-else>NUESTROS PRODUCTOS</span>
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

      <!-- Grid estilo Instagram -->
      <div v-if="filteredProducts && filteredProducts.length" class="grid grid-cols-3 gap-1 md:gap-2 max-w-4xl mx-auto">
        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="product.path"
          class="aspect-square cursor-pointer overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity relative group"
        >
          <!-- Imagen principal -->
          <img
            v-if="product.images?.[0]"
            :src="getMediaUrl(product.images[0])"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <video
            v-else-if="product.videos?.[0]"
            :src="getMediaUrl(product.videos[0])"
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
              {{ product.name }}
            </h3>
            <p class="text-2xl font-black">
              {{ formatPrice(product.price) }}
            </p>
          </div>

          <!-- Badge de precio (solo mobile) -->
          <div class="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p class="text-white text-xs font-bold truncate">
              {{ product.name }}
            </p>
            <p class="text-white text-sm font-black">
              {{ formatPrice(product.price) }}
            </p>
          </div>
        </NuxtLink>
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
