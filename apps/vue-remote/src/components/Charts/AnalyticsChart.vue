<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="h-48 flex items-end gap-2">
      <div
        v-for="(value, index) in normalizedData"
        :key="index"
        :class="[
          'flex-1 rounded-t transition-all duration-300 hover:opacity-80',
          colorClass,
        ]"
        :style="{ height: `${value}%` }"
        :title="`${months[index]}: ${data[index]}`"
      ></div>
    </div>
    <div class="flex justify-between mt-2 text-xs text-gray-500">
      <span v-for="(month, index) in months" :key="index">{{ month }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    data: number[];
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }>(),
  {
    color: 'blue',
  }
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const normalizedData = computed((): number[] => {
  const max = Math.max(...props.data);
  return props.data.map((value: number): number => (value / max) * 100);
});

type ColorKey = 'blue' | 'green' | 'purple' | 'orange';

const colorClass = computed((): string => {
  const colors: Record<ColorKey, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return colors[props.color as ColorKey];
});
</script>
