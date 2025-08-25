<template>
  <UCard class="w-full max-w-2xl mx-auto">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Viewer</h3>
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
      <!-- Mountpoint Selection -->
      <UFormGroup label="Select Mountpoint" name="mountpoint">
        <USelect
          v-model="selectedMountpoint"
          :options="mountpointOptions"
          option-attribute="description"
          value-attribute="id"
          placeholder="Choose a mountpoint to watch"
          :disabled="isPlaying"
        />
      </UFormGroup>

      <!-- Video Player -->
      <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        <video
          v-if="remoteStream"
          ref="remoteVideo"
          :srcObject="remoteStream"
          autoplay
          playsinline
          class="w-full h-full object-cover"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          <UIcon name="i-heroicons-play" class="w-16 h-16" />
        </div>
      </div>

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
          v-if="isConnected && !isPlaying && selectedMountpoint"
          @click="playStream"
          :loading="playing"
          color="green"
        >
          <UIcon name="i-heroicons-play" class="w-4 h-4 mr-2" />
          Play Stream
        </UButton>

        <UButton
          v-if="isPlaying"
          @click="stopStream"
          color="red"
          variant="soft"
        >
          <UIcon name="i-heroicons-stop" class="w-4 h-4 mr-2" />
          Stop Stream
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Mountpoint {
  id: number
  description: string
  roomId: number | null
  createdAt: string
}

const props = defineProps<{
  isConnected: boolean
  isPlaying: boolean
  remoteStream: MediaStream | null
  error: string | null
}>()

const emit = defineEmits<{
  connect: [config: { url: string }]
  playStream: [mountpointId: number]
  stopStream: []
  disconnect: []
}>()

const selectedMountpoint = ref<number | null>(null)
const mountpoints = ref<Mountpoint[]>([])
const connecting = ref(false)
const playing = ref(false)
const remoteVideo = ref<HTMLVideoElement>()

const statusText = computed(() => {
  if (props.isPlaying) return 'Playing'
  if (props.isConnected) return 'Connected'
  return 'Disconnected'
})

const statusColor = computed(() => {
  if (props.isPlaying) return 'green'
  if (props.isConnected) return 'blue'
  return 'gray'
})

const statusVariant = computed(() => {
  if (props.isPlaying) return 'solid'
  if (props.isConnected) return 'soft'
  return 'soft'
})

const mountpointOptions = computed(() => {
  return mountpoints.value.map(mp => ({
    id: mp.id,
    description: `${mp.description} (ID: ${mp.id})`,
    createdAt: mp.createdAt
  }))
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

const playStream = async () => {
  if (!selectedMountpoint.value) return
  playing.value = true
  try {
    emit('playStream', selectedMountpoint.value)
  } finally {
    playing.value = false
  }
}

const stopStream = () => {
  emit('stopStream')
}

const disconnect = () => {
  emit('disconnect')
}

const fetchMountpoints = async () => {
  try {
    const data = await $fetch<Mountpoint[]>('/api/mountpoints')
    mountpoints.value = data
  } catch (err) {
    console.error('Failed to fetch mountpoints:', err)
  }
}

// Auto-refresh mountpoints when connected
watch(() => props.isConnected, (connected) => {
  if (connected) {
    fetchMountpoints()
    // Refresh every 5 seconds
    const interval = setInterval(fetchMountpoints, 5000)
    return () => clearInterval(interval)
  }
})

onMounted(() => {
  // Auto-connect on mount
  connectToJanus()
  // Initial fetch
  fetchMountpoints()
})

onUnmounted(() => {
  disconnect()
})
</script>
