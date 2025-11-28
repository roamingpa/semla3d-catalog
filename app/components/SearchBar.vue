<template>
  <div class="relative w-full" style="z-index: 10000;">
    <!-- Input de búsqueda -->
    <div class="relative">
      <UInput
        v-model="searchQuery"
        placeholder="Buscar productos..."
        icon="i-heroicons-magnifying-glass"
        size="md"
        :loading="isSearching"
        @input="handleSearch"
        @focus="showResults = true"
        class="w-full"
      />
      
      <!-- Botón para limpiar -->
      <UButton
        v-if="searchQuery"
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        class="absolute right-2 top-1/2 transform -translate-y-1/2"
        @click="clearSearch"
      />
    </div>

    <!-- Resultados de búsqueda -->
    <div
      v-if="showResults && (searchResults.length > 0 || (searchQuery && !isSearching))"
      class="absolute top-full left-0 right-0 mt-2 bg-default rounded-lg shadow-lg border max-h-80 md:max-h-96 overflow-y-auto"
      style="z-index: 10001;"
    >
      <!-- Resultados encontrados -->
      <div v-if="searchResults.length > 0" class="p-2">
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
          @click="goToProduct(result)"
        >
          <div class="flex items-center gap-3">
            <!-- Imagen/Video del producto -->
            <div class="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
              <!-- Priorizar imagen, si no hay usar video -->
              <img
                v-if="result.images?.[0]"
                :src="getMediaUrl(result.images[0])"
                :alt="result.name"
                class="w-full h-full object-cover"
              />
              <video
                v-else-if="result.videos?.[0]"
                :src="getMediaUrl(result.videos[0])"
                class="w-full h-full object-cover"
                muted
                loop
                autoplay
                playsinline
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="w-4 h-4 md:w-5 md:h-5 text-dimmed" />
              </div>
            </div>
            
            <!-- Información del producto -->
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm md:text-base truncate">{{ result.name }}</h4>
              <p class="text-xs md:text-sm text-muted truncate">{{ result.description }}</p>
              <div class="flex items-center gap-2 mt-1">
                <UBadge color="primary" variant="soft" size="md">
                  {{ formatPrice(result.price) }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No hay resultados -->
      <div v-else-if="searchQuery && !isSearching" class="p-4 text-center text-muted">
        <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2 text-dimmed" />
        <p class="text-sm">No se encontraron productos para "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- Overlay para cerrar resultados -->
    <div
      v-if="showResults"
      class="fixed inset-0"
      style="z-index: 9999;"
      @click="showResults = false"
    />
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/currency'

const { search, searchResults, isSearching, clearSearch: clearSearchResults } = useSearch()
const { getMediaUrl } = useMedia()

const searchQuery = ref('')
const showResults = ref(false)
let searchTimeout = null

// Manejar búsqueda con debounce
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length >= 2) {
      await search(searchQuery.value)
      showResults.value = true
    } else {
      clearSearchResults()
      showResults.value = false
    }
  }, 300)
}

// Limpiar búsqueda
const clearSearch = () => {
  searchQuery.value = ''
  clearSearchResults()
  showResults.value = false
}

// Navegar a producto
const goToProduct = (result) => {
  navigateTo(`/products/${result.slug}`)
  showResults.value = false
  searchQuery.value = ''
  clearSearchResults()
}

// Cerrar resultados al hacer clic fuera
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      showResults.value = false
    }
  })
})
</script>
