<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-gray-500">{{ label }}</span>
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <div class="flex items-end gap-2">
      <span class="text-2xl font-bold text-gray-900">{{ value }}</span>
      <span
        :class="[
          'text-sm font-medium',
          isPositive ? 'text-green-600' : 'text-red-600',
        ]"
      >
        {{ change }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: string;
  change: string;
  icon: string;
}>();

const isPositive = computed(() => props.change.startsWith('+'));
</script>
