<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Load Janus JavaScript library
useHead({
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/janus-gateway@1.0.0/html/janus.js',
      defer: true
    }
  ]
})
</script>
