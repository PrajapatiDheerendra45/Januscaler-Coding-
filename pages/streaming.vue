<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Janus Streaming Viewer
        </h1>
        <p class="text-gray-600">
          Watch live streams from Janus mountpoints
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-center mb-8">
        <UNavigationMenu>
          <UNavigationMenuList>
            <UNavigationMenuItem>
              <UNavigationMenuLink
                to="/videoroom"
                class="font-medium"
              >
                Publisher
              </UNavigationMenuLink>
            </UNavigationMenuItem>
            <UNavigationMenuItem>
              <UNavigationMenuLink
                to="/streaming"
                :active="true"
                class="font-medium"
              >
                Viewer
              </UNavigationMenuLink>
            </UNavigationMenuItem>
          </UNavigationMenuList>
        </UNavigationMenu>
      </div>

      <!-- Viewer Card -->
      <ViewerCard
        :is-connected="isConnected"
        :is-playing="isPlaying"
        :remote-stream="remoteStream"
        :error="error"
        @connect="handleConnect"
        @play-stream="handlePlayStream"
        @stop-stream="handleStopStream"
        @disconnect="handleDisconnect"
      />

      <!-- Instructions -->
      <UCard class="mt-8 max-w-2xl mx-auto">
        <template #header>
          <h3 class="text-lg font-semibold">How to Use</h3>
        </template>
        
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-1-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Click "Connect" to establish connection to Janus server</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-2-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Select a mountpoint from the dropdown (published streams)</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-3-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Click "Play Stream" to start watching the selected stream</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-4-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Use "Stop Stream" to stop watching the current stream</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-5-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Mountpoints are automatically refreshed every 5 seconds</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// Set page title
useHead({
  title: 'Janus Streaming Viewer'
})

// Use Janus composable
const {
  isConnected,
  isPlaying,
  remoteStream,
  error,
  connect,
  playStream,
  stopStream,
  disconnect
} = useJanus()

// Event handlers
const handleConnect = async (config: { url: string }) => {
  await connect(config)
}

const handlePlayStream = async (mountpointId: number) => {
  await playStream(mountpointId)
}

const handleStopStream = () => {
  stopStream()
}

const handleDisconnect = () => {
  disconnect()
}

// Cleanup on unmount
onUnmounted(() => {
  disconnect()
})
</script>
