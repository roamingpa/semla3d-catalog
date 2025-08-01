<template>
  <component :is="iconComponent" :size="size" />
</template>

<script setup>
import { 
  CreditCard, 
  Dice6, 
  ChefHat, 
  Briefcase, 
  Smartphone, 
  Folder,
  Instagram
} from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 16
  }
})

const iconMap = {
  CreditCard,
  Dice6,
  ChefHat,
  Briefcase,
  Smartphone,
  Folder,
  Instagram
}

const iconComponent = computed(() => {
  return iconMap[props.name] || Folder
})
</script>
