<script setup>
import { formatPrice } from '@/utils/currency'

const { getMediaUrl } = useMedia()

// Productos en stock - agregar/editar aquí manualmente
const stockProducts = ref([
  {
    id: 1,
    name: 'Caja de dados One Piece - Jolly Roger',
    image: 'https://axtfh7lpburz.objectstorage.sa-santiago-1.oci.customer-oci.com/n/axtfh7lpburz/b/bucket-semla3d/o/catalogo/caja-dados-onepiece/jolly-roger/2.jpg',
    price: 5000,
    description: 'Caja de dados temática de One Piece con el emblemático Jolly Roger.',
    quantity: 2
  },
])

// Estado del modal
const selectedProduct = ref(null)
const showModal = ref(false)

// Abrir modal con producto
const openModal = (product) => {
  selectedProduct.value = product
  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

// Cerrar modal con tecla Escape
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showModal.value) {
      closeModal()
    }
  })
})

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <UContainer class="py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <h1 class="text-3xl md:text-4xl font-black text-highlighted">LISTOS PARA ENTREGA</h1>
        </div>
        <p class="text-lg md:text-xl text-muted max-w-2xl mx-auto">
          Piezas ya impresas – disponibles inmediatamente
        </p>
      </div>

      <!-- Grid estilo Instagram -->
      <div class="grid grid-cols-3 gap-1 md:gap-2 max-w-4xl mx-auto">
        <div
          v-for="product in stockProducts"
          :key="product.id"
          class="aspect-square cursor-pointer overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity relative group"
          @click="openModal(product)"
        >
          <img
            :src="getMediaUrl(product.image)"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <!-- Overlay al hover (solo visible en desktop) -->
          <div class="hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
            <UIcon name="i-heroicons-eye" class="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay productos -->
      <div v-if="stockProducts.length === 0" class="text-center py-16">
        <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-xl text-muted">No hay productos en stock en este momento</p>
        <p class="text-sm text-dimmed mt-2">Vuelve pronto para ver nuevas piezas disponibles</p>
      </div>
    </UContainer>

    <!-- Modal estilo Instagram -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal && selectedProduct"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          @click.self="closeModal"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <!-- Botón cerrar -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-white" />
            </button>

            <!-- Imagen -->
            <div class="aspect-square w-full overflow-hidden bg-gray-100">
              <img
                :src="getMediaUrl(selectedProduct.image)"
                :alt="selectedProduct.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Información -->
            <div class="p-4 space-y-3">
              <!-- Nombre -->
              <div>
                <h2 class="text-2xl font-black text-white">
                  {{ selectedProduct.name }}
                </h2>
              </div>

              <!-- Precio y Stock -->
              <div class="flex items-center justify-between gap-4">
                <div class="text-3xl font-black text-primary">
                  {{ formatPrice(selectedProduct.price) }}
                </div>
                <div class="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full border-2 border-green-500">
                  <span class="text-base font-bold text-green-700 dark:text-green-300">
                    {{ selectedProduct.quantity }} {{ selectedProduct.quantity === 1 ? 'unidad' : 'unidades' }}
                  </span>
                </div>
              </div>

              <!-- Descripción -->
              <p v-if="selectedProduct.description" class="text-base text-muted leading-relaxed">
                {{ selectedProduct.description }}
              </p>

              <!-- Nota -->
              <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p class="text-sm text-center text-muted font-semibold">
                  ✓ Producto listo para entrega inmediata
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
