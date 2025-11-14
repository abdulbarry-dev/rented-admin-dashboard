<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { defaultChartOptions } from '@/services/chartConfig'
import type { ChartData } from 'chart.js'

// Example usage of Chart.js with vue-chartjs
const chartData: ChartData<'line'> = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
}
</script>

<template>
  <div class="chart-container">
    <Line :data="chartData" :options="defaultChartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
