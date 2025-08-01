<script setup>
// Estado para el mensaje de copia
const copiedMessage = ref('')

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
      email: 'Email copiado',
      todos: 'Todos los datos copiados'
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

// Función para copiar todos los datos en formato chileno
const copyAllData = () => {
  const allData = `Nombre: Nombre del Titular
RUT: 12.345.678-9
Banco: Banco Santander
Tipo de cuenta: Cuenta Corriente
Número de cuenta: 12345678901
Correo: semla3d@ejemplo.com`
  
  copyToClipboard(allData, 'todos')
}

// Meta tags
useSeoMeta({
  title: '¿Cómo pagar? - Métodos de Pago - Semla3D',
  description: 'Conoce todos los métodos de pago disponibles para realizar tu compra en Semla3D. Transferencia bancaria, información de contacto y más.',
  ogTitle: '¿Cómo pagar? - Métodos de Pago - Semla3D',
  ogDescription: 'Conoce todos los métodos de pago disponibles para realizar tu compra en Semla3D. Transferencia bancaria, información de contacto y más.',
})

// Definir el layout para esta página
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <UContainer class="py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="mb-6">
          <UIcon name="i-heroicons-credit-card" class="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 class="text-4xl font-bold text-highlighted mb-4">¿Cómo pagar?</h1>
          <p class="text-xl text-muted max-w-3xl mx-auto">
            Te mostramos todas las opciones disponibles para realizar tu pago de manera segura y fácil
          </p>
        </div>
        
        <!-- Botón de regreso -->
        <div class="mb-8">
          <UButton 
            to="/" 
            variant="ghost" 
            icon="i-heroicons-arrow-left"
            size="sm"
          >
            Volver al catálogo
          </UButton>
        </div>
      </div>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Proceso de Compra -->
        <UCard class="p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-highlighted mb-4">Proceso de Compra</h2>
            <p class="text-muted">Sigue estos simples pasos para realizar tu pedido</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Paso 1 -->
            <div class="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 class="font-semibold text-blue-900 mb-2">Contacta por Instagram</h3>
              <p class="text-sm text-blue-700">Envía un mensaje con los productos que te interesan</p>
            </div>
            
            <!-- Paso 2 -->
            <div class="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 class="font-semibold text-green-900 mb-2">Confirma tu pedido</h3>
              <p class="text-sm text-green-700">Te enviamos el detalle y monto total a pagar</p>
            </div>
            
            <!-- Paso 3 -->
            <div class="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 class="font-semibold text-purple-900 mb-2">Realiza el pago</h3>
              <p class="text-sm text-purple-700">Transfiere y envía tu comprobante</p>
            </div>
          </div>
        </UCard>

        <!-- Métodos de Pago -->
        <UCard class="p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-highlighted mb-4">Métodos de Pago</h2>
            <p class="text-muted">Elige la opción que más te convenga</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Transferencia Bancaria -->
            <div class="space-y-6">
              <div class="text-center">
                <UIcon name="i-heroicons-building-library" class="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 class="text-xl font-bold text-green-900 mb-2">Transferencia Bancaria</h3>
                <p class="text-sm text-green-700">Método preferido - Sin comisiones adicionales</p>
              </div>

              <!-- Datos de Transferencia -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-green-900">Datos para Transferencia</h4>
                  <!-- Botón para copiar todos los datos -->
                  <UButton 
                    @click="copyAllData"
                    variant="solid" 
                    size="sm" 
                    color="green"
                    icon="i-heroicons-clipboard-document"
                    class="cursor-pointer"
                  >
                    Copiar todos
                  </UButton>
                </div>
                
                <div class="space-y-3">
                  <!-- Banco -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-building-library" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">Banco</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('Banco Santander', 'banco')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">Banco Santander</p>
                  </div>

                  <!-- Tipo de cuenta -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-banknotes" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">Tipo de Cuenta</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('Cuenta Corriente', 'tipoCuenta')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">Cuenta Corriente</p>
                  </div>

                  <!-- Número de cuenta -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-hashtag" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">Número de Cuenta</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('12345678901', 'numeroCuenta')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">12345678901</p>
                  </div>

                  <!-- RUT -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-identification" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">RUT</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('12.345.678-9', 'rut')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">12.345.678-9</p>
                  </div>

                  <!-- Titular -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-user" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">Titular</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('Nombre del Titular', 'titular')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">Nombre del Titular</p>
                  </div>

                  <!-- Email -->
                  <div class="bg-white/70 rounded-lg p-3 border border-green-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-green-600" />
                        <span class="text-sm font-medium text-green-900">Email</span>
                      </div>
                      <UButton 
                        @click="copyToClipboard('semla3d@ejemplo.com', 'email')"
                        variant="ghost" 
                        size="xs" 
                        color="green"
                        icon="i-heroicons-clipboard"
                        class="cursor-pointer"
                      >
                        Copiar
                      </UButton>
                    </div>
                    <p class="text-green-800 font-mono text-sm mt-1">semla3d@ejemplo.com</p>
                  </div>
                </div>

                <!-- Estado de copiado -->
                <div v-if="copiedMessage" class="mt-4 text-center">
                  <UBadge color="green" variant="soft" size="sm">
                    {{ copiedMessage }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Otros Métodos -->
            <div class="space-y-6">
              <div class="text-center">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 class="text-xl font-bold text-blue-900 mb-2">Otros Métodos</h3>
                <p class="text-sm text-blue-700">Opciones adicionales de pago disponibles</p>
              </div>

              <!-- Métodos adicionales -->
              <div class="space-y-4">
                <!-- Tarjetas de crédito/débito presencial -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-green-600" />
                    <div class="flex-1">
                      <h4 class="font-medium text-green-900">Tarjetas de Crédito/Débito</h4>
                      <p class="text-sm text-green-700">Solo en entregas presenciales</p>
                    </div>
                    <UBadge color="green" variant="soft" size="sm">Disponible</UBadge>
                  </div>
                </div>

                <!-- Efectivo -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-green-600" />
                    <div class="flex-1">
                      <h4 class="font-medium text-green-900">Efectivo</h4>
                      <p class="text-sm text-green-700">Solo en entregas presenciales</p>
                    </div>
                    <UBadge color="green" variant="soft" size="sm">Disponible</UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Instrucciones Importantes -->
        <UCard class="p-8">
          <div class="text-center mb-6">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 class="text-2xl font-bold text-highlighted mb-2">Instrucciones Importantes</h2>
            <p class="text-muted">Información importante para completar tu compra</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Después del pago -->
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 class="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-camera" class="w-5 h-5" />
                Después del Pago
              </h3>
              <ul class="space-y-2 text-sm text-amber-800">
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Toma una foto del comprobante de transferencia</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Envíalo por Instagram junto con los productos solicitados</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Te confirmaremos la recepción del pago</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Iniciamos la producción de tu pedido</span>
                </li>
              </ul>
            </div>

            <!-- Datos importantes -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
                Datos Importantes
              </h3>
              <ul class="space-y-2 text-sm text-blue-800">
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Confirma tu pago dentro de 24 horas</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Todos los pagos son verificados antes de producir</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-truck" class="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Envíos a todo Chile a través de Starken</span>
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-heroicons-gift" class="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Envíos combinados disponibles con @aso.tcg</span>
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <!-- Contacto -->
        <UCard class="p-8 text-center">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-highlighted mb-4">¿Tienes dudas?</h2>
          <p class="text-muted mb-6">Contáctanos por Instagram para resolver cualquier consulta sobre pagos o productos</p>
          
          <UButton 
            to="https://instagram.com/semla3d"
            target="_blank"
            color="primary"
            size="lg"
            icon="i-simple-icons-instagram"
            external
          >
            Contactar por Instagram
          </UButton>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
