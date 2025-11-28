<template>
  <div v-if="hasValidDimensions" class="flex items-center gap-2">
    <UIcon name="i-heroicons-cube" class="w-4 h-4 text-dimmed" />
    <span class="text-xs text-muted">
      {{ size.width }}×{{ size.height }}×{{ size.depth || size.length }}mm
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Object,
    required: true
  }
})

// Función para verificar si hay dimensiones válidas
const hasValidDimensions = computed(() => {
  if (!props.size) return false
  
  const { width, height, depth, length } = props.size
  
  // Verificar que al menos width y height tengan valores no vacíos
  return (
    width && width.toString().trim() !== '' &&
    height && height.toString().trim() !== '' &&
    (
      (depth && depth.toString().trim() !== '') ||
      (length && length.toString().trim() !== '')
    )
  )
})
</script>
