<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-4 gap-4">
      <StatsWidget
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :change="stat.change"
        :icon="stat.icon"
      />
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <AnalyticsChart title="Revenue Overview" :data="revenueData" />
      <AnalyticsChart title="User Growth" :data="userData" color="green" />
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
        >
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-white',
              activity.color,
            ]"
          >
            {{ activity.icon }}
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatsWidget from '../Stats/StatsWidget.vue';
import AnalyticsChart from '../Charts/AnalyticsChart.vue';

const stats = ref([
  { label: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: '$' },
  { label: 'Active Users', value: '2,350', change: '+15.3%', icon: '👥' },
  { label: 'Conversion Rate', value: '3.2%', change: '+4.5%', icon: '📈' },
  { label: 'Avg. Order Value', value: '$125', change: '-2.4%', icon: '🛒' },
]);

const revenueData = ref([30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90]);
const userData = ref([100, 150, 200, 180, 250, 300, 280, 350, 400, 380, 450, 500]);

const activities = ref([
  {
    id: 1,
    icon: '🛒',
    title: 'New order #1234',
    time: '2 minutes ago',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    icon: '👤',
    title: 'New user registration',
    time: '15 minutes ago',
    color: 'bg-green-500',
  },
  {
    id: 3,
    icon: '💬',
    title: 'Support ticket resolved',
    time: '1 hour ago',
    color: 'bg-purple-500',
  },
  {
    id: 4,
    icon: '📦',
    title: 'Order shipped #1230',
    time: '2 hours ago',
    color: 'bg-orange-500',
  },
]);
</script>
