<template>
  <div class="flex items-center gap-2">
    <UIcon name="i-heroicons-cube" class="w-4 h-4 text-dimmed" />
    <span class="text-xs text-muted">
      {{ size.width }}×{{ size.height }}×{{ size.depth }}mm
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
</script>
