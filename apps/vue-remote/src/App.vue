<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Vue Remote</h1>
        <p class="text-gray-600">Standalone mode - Running on port 3102</p>
      </header>
      <Dashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import Dashboard from './components/Dashboard/Dashboard.vue';
</script>
