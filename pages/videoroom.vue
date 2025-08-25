<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Janus VideoRoom Publisher
        </h1>
        <p class="text-gray-600">
          Publish your webcam stream to a Janus videoroom
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-center mb-8">
        <UNavigationMenu>
          <UNavigationMenuList>
            <UNavigationMenuItem>
              <UNavigationMenuLink
                to="/videoroom"
                :active="true"
                class="font-medium"
              >
                Publisher
              </UNavigationMenuLink>
            </UNavigationMenuItem>
            <UNavigationMenuItem>
              <UNavigationMenuLink
                to="/streaming"
                class="font-medium"
              >
                Viewer
              </UNavigationMenuLink>
            </UNavigationMenuItem>
          </UNavigationMenuList>
        </UNavigationMenu>
      </div>

      <!-- Publisher Card -->
      <PublisherCard
        :is-connected="isConnected"
        :is-publishing="isPublishing"
        :local-stream="localStream"
        :error="error"
        @connect="handleConnect"
        @join-room="handleJoinRoom"
        @publish="handlePublish"
        @leave-room="handleLeaveRoom"
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
            <p>Enter a Room ID and click "Join Room" to enter the videoroom</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-3-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Click "Publish" to start streaming your webcam and microphone</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-4-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Your stream will be automatically registered as a mountpoint</p>
          </div>
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-5-circle" class="w-5 h-5 mt-0.5 text-blue-500" />
            <p>Switch to the Viewer page to watch your stream</p>
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
  title: 'Janus VideoRoom Publisher'
})

// Use Janus composable
const {
  isConnected,
  isPublishing,
  localStream,
  error,
  connect,
  joinRoom,
  publish,
  leaveRoom,
  disconnect
} = useJanus()

// Event handlers
const handleConnect = async (config: { url: string }) => {
  await connect(config)
}

const handleJoinRoom = async (roomId: number) => {
  await joinRoom(roomId)
}

const handlePublish = async () => {
  await publish()
}

const handleLeaveRoom = () => {
  leaveRoom()
}

const handleDisconnect = () => {
  disconnect()
}

// Cleanup on unmount
onUnmounted(() => {
  disconnect()
})
</script>
