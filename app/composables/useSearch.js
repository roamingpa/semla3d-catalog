import MiniSearch from 'minisearch'

export const useSearch = () => {
  const searchIndex = ref(null)
  const searchResults = ref([])
  const isSearching = ref(false)

  // Inicializar el índice de búsqueda
  const initializeSearch = async () => {
    if (searchIndex.value) return

    try {
      // Obtener todos los productos usando queryCollection
      const products = await queryCollection('products').all()

      // Configurar MiniSearch
      const miniSearch = new MiniSearch({
        fields: ['name', 'description', 'tags'], // campos a indexar (removimos colors)
        storeFields: ['name', 'description', 'price', 'slug', 'path', 'images'], // campos a almacenar
        searchOptions: {
          boost: { name: 2 }, // dar más peso al nombre
          fuzzy: 0.2,
          prefix: true
        }
      })

      // Preparar documentos para indexar
      const documents = products.map(product => ({
        id: product.slug || product.path,
        name: product.name,
        description: product.description,
        price: product.price,
        slug: product.slug,
        path: product.path,
        tags: Array.isArray(product.tags) ? product.tags.join(' ') : '',
        images: product.images || []
      }))

      // Agregar documentos al índice
      miniSearch.addAll(documents)
      searchIndex.value = miniSearch

    } catch (error) {
      console.error('Error initializing search:', error)
    }
  }

  // Función de búsqueda
  const search = async (query) => {
    if (!query || query.trim().length < 2) {
      searchResults.value = []
      return []
    }

    isSearching.value = true

    try {
      // Asegurar que el índice esté inicializado
      await initializeSearch()

      if (searchIndex.value) {
        const results = searchIndex.value.search(query.trim(), {
          limit: 10
        })
        searchResults.value = results
        return results
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      isSearching.value = false
    }

    return []
  }

  // Limpiar resultados
  const clearSearch = () => {
    searchResults.value = []
  }

  return {
    searchResults: readonly(searchResults),
    isSearching: readonly(isSearching),
    search,
    clearSearch,
    initializeSearch
  }
}
