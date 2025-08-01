<template>
  <div class="bg-elevated rounded-lg p-4 border shadow-sm">
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-cube" class="w-5 h-5 text-primary" />
        <span class="font-medium">Dimensiones</span>
      </div>

        <!-- Diagrama visual -->
        <div class="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
          <!-- Diagrama 3D simplificado -->
          <div class="relative flex-shrink-0 mx-auto lg:mx-0">
            <svg width="220" height="170" viewBox="0 0 220 170" class="border border-gray-200 rounded-lg bg-gray-50">
              <!-- Cara frontal del cubo -->
              <rect :x="baseX" y="60" :width="width" :height="height" 
                    fill="#e5e7eb" stroke="#6b7280" stroke-width="1.5"/>
              
              <!-- Cara superior (perspectiva) -->
              <polygon :points="`${baseX},60 ${baseX + depth * 0.5},${60 - depth * 0.3} ${baseX + width + depth * 0.5},${60 - depth * 0.3} ${baseX + width},60`"
                       fill="#f3f4f6" stroke="#6b7280" stroke-width="1.5"/>
              
              <!-- Cara lateral derecha -->
              <polygon :points="`${baseX + width},60 ${baseX + width + depth * 0.5},${60 - depth * 0.3} ${baseX + width + depth * 0.5},${60 + height - depth * 0.3} ${baseX + width},${60 + height}`"
                       fill="#d1d5db" stroke="#6b7280" stroke-width="1.5"/>

              <!-- Líneas de medida -->
              <!-- Ancho (width) -->
              <g>
                <line :x1="baseX" :y1="height + 80" :x2="baseX + width" :y2="height + 80" 
                      stroke="#a855f7" stroke-width="2" marker-end="url(#arrowpurple)"/>
                
                <!-- Líneas de referencia para width -->
                <line :x1="baseX" :y1="60 + height" :x2="baseX" :y2="height + 80" 
                      stroke="#a855f7" stroke-width="1" stroke-dasharray="2,2"/>
                <line :x1="baseX + width" :y1="60 + height" :x2="baseX + width" :y2="height + 80" 
                      stroke="#a855f7" stroke-width="1" stroke-dasharray="2,2"/>
                
                <text :x="baseX + width / 2" :y="height + 95" 
                      text-anchor="middle" fill="#a855f7" font-size="12" font-weight="bold">
                  {{ size.width }}mm
                </text>
              </g>

              <!-- Alto (height) -->
              <g>
                <line :x1="baseX - 20" y1="60" :x2="baseX - 20" :y2="60 + height" 
                      stroke="#ec4899" stroke-width="2" marker-end="url(#arrowpink)"/>
                
                <!-- Líneas de referencia para height -->
                <line :x1="baseX" y1="60" :x2="baseX - 20" y2="60" 
                      stroke="#ec4899" stroke-width="1" stroke-dasharray="2,2"/>
                <line :x1="baseX" :y1="60 + height" :x2="baseX - 20" :y2="60 + height" 
                      stroke="#ec4899" stroke-width="1" stroke-dasharray="2,2"/>
                
                <text :x="baseX - 27" :y="60 + height / 2" 
                      text-anchor="middle" fill="#ec4899" font-size="12" font-weight="bold" 
                      :transform="`rotate(-90, ${baseX - 27}, ${60 + height / 2})`">
                  {{ size.height }}mm
                </text>
              </g>

              <!-- Profundidad (depth) - línea más visible -->
              <g>
                <!-- Línea principal de profundidad -->
                <line :x1="baseX" :y1="60 - 15" :x2="baseX + depth * 0.5" :y2="60 - depth * 0.3 - 15" 
                      stroke="#d946ef" stroke-width="2" marker-end="url(#arrowfuchsia)"/>
                
                <!-- Líneas de referencia para mostrar la profundidad -->
                <line :x1="baseX" y1="60" :x2="baseX" :y2="60 - 15" 
                      stroke="#d946ef" stroke-width="1" stroke-dasharray="2,2"/>
                <line :x1="baseX + depth * 0.5" :y1="60 - depth * 0.3" :x2="baseX + depth * 0.5" :y2="60 - depth * 0.3 - 15" 
                      stroke="#d946ef" stroke-width="1" stroke-dasharray="2,2"/>
                
                <text :x="baseX - 10 + (depth * 0.5) / 2" :y="50 - depth * 0.15 - 20" 
                      text-anchor="middle" fill="#d946ef" font-size="12" font-weight="bold"
                      :transform="`rotate(-30, ${baseX + (depth * 0.5) / 2 + 8}, ${50 - depth * 0.15 - 18})`">
                  {{ size.depth }}mm
                </text>
              </g>

              <!-- Definir puntas de flecha más pequeñas -->
              <defs>
                <marker id="arrowpurple" markerWidth="6" markerHeight="4" 
                        refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#a855f7" />
                </marker>
                <marker id="arrowpink" markerWidth="6" markerHeight="4" 
                        refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#ec4899" />
                </marker>
                <marker id="arrowfuchsia" markerWidth="6" markerHeight="4" 
                        refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#d946ef" />
                </marker>
              </defs>
            </svg>
          </div>
          
          <!-- Información de medidas -->
        <div class="space-y-2 flex-1 min-w-0 w-full lg:w-auto">
          <div class="flex items-center gap-3 p-2 rounded-lg bg-purple-50">
            <div class="w-4 h-4 bg-purple-500 rounded"></div>
            <div>
              <span class="font-medium text-purple-700">Ancho:</span>
              <span class="ml-2 text-purple-900 font-bold">{{ size.width }}mm</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-2 rounded-lg bg-pink-50">
            <div class="w-4 h-4 bg-pink-500 rounded"></div>
            <div>
              <span class="font-medium text-pink-700">Alto:</span>
              <span class="ml-2 text-pink-900 font-bold">{{ size.height }}mm</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-2 rounded-lg bg-fuchsia-50">
            <div class="w-4 h-4 bg-fuchsia-500 rounded"></div>
            <div>
              <span class="font-medium text-fuchsia-700">Profundidad:</span>
              <span class="ml-2 text-fuchsia-900 font-bold">{{ size.depth }}mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.width === 'number' && typeof value.height === 'number' && typeof value.depth === 'number'
    }
  }
})

// Calcular proporciones para el diagrama (escalado para que se vea bien)
const maxDimension = Math.max(props.size.width, props.size.height, props.size.depth)

// Espacio disponible en el SVG (considerando márgenes y espacio para texto)
const availableWidth = 110  // Menos espacio para dar margen a las flechas
const availableHeight = 60  // Menos espacio para el texto del width abajo

// Calcular escala para que siempre quepa en el contenedor incluyendo flechas y texto
const scaleForWidth = availableWidth / Math.max(props.size.width + props.size.depth * 0.5, 30)
const scaleForHeight = availableHeight / Math.max(props.size.height, 30)
const scale = Math.min(scaleForWidth, scaleForHeight, 80 / maxDimension) // Reducido de 100 a 80

const width = computed(() => Math.max(props.size.width * scale, 20))
const height = computed(() => Math.max(props.size.height * scale, 20))
const depth = computed(() => Math.max(props.size.depth * scale, 15))

// Calcular centrado dinámico
const totalWidth = computed(() => width.value + depth.value * 0.5)
const centerX = computed(() => 110) // Centro del SVG (220px / 2)
const baseX = computed(() => Math.max(centerX.value - totalWidth.value / 2, 40)) // Centrar pero con mínimo 40px para el texto
</script>
