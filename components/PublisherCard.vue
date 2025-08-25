<template>
  <UCard class="w-full max-w-2xl mx-auto">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Publisher</h3>
        <UBadge 
          :color="statusColor" 
          :variant="statusVariant"
          size="sm"
        >
          {{ statusText }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Video Preview -->
      <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <video
          v-if="localStream"
          ref="localVideo"
          :srcObject="localStream"
          autoplay
          muted
          playsinline
          class="w-full h-full object-cover"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          <UIcon name="i-heroicons-video-camera" class="w-16 h-16" />
        </div>
      </div>

      <!-- Room ID Input -->
      <UFormGroup label="Room ID" name="roomId">
        <UInput
          v-model="roomId"
          type="number"
          placeholder="Enter room ID"
          :disabled="isConnected"
        />
      </UFormGroup>

      <!-- Control Buttons -->
      <div class="flex flex-wrap gap-2">
        <UButton
          v-if="!isConnected"
          @click="connectToJanus"
          :loading="connecting"
          color="blue"
        >
          <UIcon name="i-heroicons-link" class="w-4 h-4 mr-2" />
          Connect
        </UButton>

        <UButton
          v-if="isConnected && !isPublishing"
          @click="joinRoom"
          :loading="joining"
          :disabled="!roomId"
          color="green"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
          Join Room
        </UButton>

        <UButton
          v-if="isConnected && !isPublishing"
          @click="publish"
          :loading="publishing"
          color="purple"
        >
          <UIcon name="i-heroicons-play" class="w-4 h-4 mr-2" />
          Publish
        </UButton>

        <UButton
          v-if="isPublishing"
          @click="leaveRoom"
          color="red"
          variant="soft"
        >
          <UIcon name="i-heroicons-stop" class="w-4 h-4 mr-2" />
          Stop Publishing
        </UButton>

        <UButton
          v-if="isConnected"
          @click="disconnect"
          color="gray"
          variant="soft"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
          Disconnect
        </UButton>
      </div>

      <!-- Error Display -->
      <UAlert
        v-if="error"
        :title="error"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isConnected: boolean
  isPublishing: boolean
  localStream: MediaStream | null
  error: string | null
}>()

const emit = defineEmits<{
  connect: [config: { url: string }]
  joinRoom: [roomId: number]
  publish: []
  leaveRoom: []
  disconnect: []
}>()

const roomId = ref('1234')
const connecting = ref(false)
const joining = ref(false)
const publishing = ref(false)
const localVideo = ref<HTMLVideoElement>()

const statusText = computed(() => {
  if (props.isPublishing) return 'Publishing'
  if (props.isConnected) return 'Connected'
  return 'Disconnected'
})

const statusColor = computed(() => {
  if (props.isPublishing) return 'green'
  if (props.isConnected) return 'blue'
  return 'gray'
})

const statusVariant = computed(() => {
  if (props.isPublishing) return 'solid'
  if (props.isConnected) return 'soft'
  return 'soft'
})

const connectToJanus = async () => {
  connecting.value = true
  try {
    const config = useRuntimeConfig()
    emit('connect', { url: config.public.janusUrl })
  } finally {
    connecting.value = false
  }
}

const joinRoom = async () => {
  if (!roomId.value) return
  joining.value = true
  try {
    emit('joinRoom', parseInt(roomId.value))
  } finally {
    joining.value = false
  }
}

const publish = async () => {
  publishing.value = true
  try {
    emit('publish')
  } finally {
    publishing.value = false
  }
}

const leaveRoom = () => {
  emit('leaveRoom')
}

const disconnect = () => {
  emit('disconnect')
}

onMounted(() => {
  // Auto-connect on mount
  connectToJanus()
})

onUnmounted(() => {
  disconnect()
})
</script>
