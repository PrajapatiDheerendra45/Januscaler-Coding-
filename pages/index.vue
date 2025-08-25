<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Janus WebRTC Demo
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          A mini WebRTC demo app built with Nuxt4 and Janus Gateway
        </p>
      </div>

      <!-- Feature Cards -->
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        <!-- Publisher Card -->
        <UCard class="text-center">
          <template #header>
            <div class="flex items-center justify-center gap-3">
              <UIcon name="i-heroicons-video-camera" class="w-8 h-8 text-blue-500" />
              <h3 class="text-xl font-semibold">Publisher</h3>
            </div>
          </template>
          
          <div class="space-y-4">
            <p class="text-gray-600">
              Publish your webcam stream to a Janus videoroom and automatically register it as a mountpoint.
            </p>
            
            <div class="space-y-2 text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Join videoroom as publisher</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Stream webcam and microphone</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Auto-register mountpoint</span>
              </div>
            </div>
            
            <UButton
              to="/videoroom"
              color="blue"
              size="lg"
              class="w-full"
            >
              Start Publishing
            </UButton>
          </div>
        </UCard>

        <!-- Viewer Card -->
        <UCard class="text-center">
          <template #header>
            <div class="flex items-center justify-center gap-3">
              <UIcon name="i-heroicons-play" class="w-8 h-8 text-green-500" />
              <h3 class="text-xl font-semibold">Viewer</h3>
            </div>
          </template>
          
          <div class="space-y-4">
            <p class="text-gray-600">
              Watch live streams from available mountpoints using the Janus streaming plugin.
            </p>
            
            <div class="space-y-2 text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Browse available mountpoints</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Watch live streams</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span>Real-time playback</span>
              </div>
            </div>
            
            <UButton
              to="/streaming"
              color="green"
              size="lg"
              class="w-full"
            >
              Start Watching
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Tech Stack -->
      <UCard class="max-w-4xl mx-auto">
        <template #header>
          <h3 class="text-xl font-semibold">Technology Stack</h3>
        </template>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <UIcon name="i-simple-icons-nuxtdotjs" class="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 class="font-semibold mb-2">Nuxt 4</h4>
            <p class="text-sm text-gray-600">Full-stack Vue.js framework</p>
          </div>
          
          <div class="text-center">
            <UIcon name="i-simple-icons-tailwindcss" class="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h4 class="font-semibold mb-2">TailwindCSS</h4>
            <p class="text-sm text-gray-600">Utility-first CSS framework</p>
          </div>
          
          <div class="text-center">
            <UIcon name="i-heroicons-cpu-chip" class="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h4 class="font-semibold mb-2">Janus Gateway</h4>
            <p class="text-sm text-gray-600">WebRTC server</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page title
useHead({
  title: 'Janus WebRTC Demo - Home'
})
</script>
