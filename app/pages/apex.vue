<template>
  <div class="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Nombre d’utilisateurs actifs</h2>
    <ApexChart type="line" :options="chartOptions" :series="series" height="300" />
    <ApexChart type="bar" :options="chartOptions" :series="series" height="300" />
    <div>
      <h2>Line Chart</h2>
      <ApexChart type="line" :options="lineOptions" :series="lineSeries" height="300" />
    </div>

    <div>
      <h2>Area Chart</h2>
      <ApexChart type="area" :options="areaOptions" :series="areaSeries" height="300" />
    </div>

    <div>
      <h2>Bar Chart</h2>
      <ApexChart type="bar" :options="barOptions" :series="barSeries" height="300" />
    </div>

    <div>
      <h2>Pie Chart</h2>
      <ApexChart type="pie" :options="pieOptions" :series="pieSeries" height="300" />
    </div>

    <div>
      <h2>Donut Chart</h2>
      <ApexChart type="donut" :options="donutOptions" :series="donutSeries" height="300" />
    </div>

    <div>
      <h2>Radar Chart</h2>
      <ApexChart type="radar" :options="radarOptions" :series="radarSeries" height="300" />
    </div>

    <div>
      <h2>Polar Area Chart</h2>
      <ApexChart type="polarArea" :options="polarOptions" :series="polarSeries" height="300" />
    </div>

    <div>
      <h2>Heatmap Chart</h2>
      <ApexChart type="heatmap" :options="heatmapOptions" :series="heatmapSeries" height="300" />
    </div>

    <div>
      <h2>Treemap Chart</h2>
      <ApexChart type="treemap" :options="treemapOptions" :series="treemapSeries" height="300" />
    </div>

    <div>
      <h2>Radial Bar Chart</h2>
      <ApexChart type="radialBar" :options="radialOptions" :series="radialSeries" height="300" />
    </div>

    <div>
      <h2>Range Bar Chart</h2>
      <ApexChart type="rangeBar" :options="rangeBarOptions" :series="rangeBarSeries" height="300" />
    </div>

    <div>
      <h2>BoxPlot Chart</h2>
      <ApexChart type="boxPlot" :options="boxPlotOptions" :series="boxPlotSeries" height="300" />
    </div>

    <div>
      <h2>Candlestick Chart</h2>
      <ApexChart type="candlestick" :options="candlestickOptions" :series="candlestickSeries" height="300" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const series = ref([
  {
    name: 'Utilisateurs actifs',
    data: [30, 45, 32, 60, 50, 70, 80]
  }
])

const chartOptions = ref({
  chart: {
    id: 'active-users',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 5 },
  colors: ['#10b481'],
  grid: { borderColor: '#e0e0e0' },
  tooltip: { theme: 'light' },
})

// Options et séries génériques pour différents types
const lineOptions = ref({
  chart: { id: 'line-chart' },
  xaxis: { categories: [1, 2, 3, 4, 5, 6, 7] }
})
const lineSeries = ref([{ name: 'Series 1', data: [10, 41, 35, 51, 49, 62, 69] }])

const areaOptions = ref({ ...lineOptions.value })
const areaSeries = ref([{ name: 'Area', data: [10, 41, 35, 51, 49, 62, 69] }])

const barOptions = ref({
  chart: { id: 'bar-chart' },
  xaxis: { categories: ['A', 'B', 'C', 'D', 'E'] }
})
const barSeries = ref([{ name: 'Bar', data: [20, 30, 40, 50, 60] }])

const pieOptions = ref({ labels: ['Red', 'Blue', 'Green'] })
const pieSeries = ref([44, 55, 41])

const donutOptions = ref({ labels: ['Apple', 'Mango', 'Orange'] })
const donutSeries = ref([30, 40, 30])

const radarOptions = ref({
  chart: { id: 'radar-chart' },
  xaxis: { categories: ['January', 'February', 'March', 'April', 'May', 'June'] }
})
const radarSeries = ref([{ name: 'Radar', data: [20, 30, 40, 50, 60, 70] }])

const polarOptions = ref({ labels: ['A', 'B', 'C', 'D'] })
const polarSeries = ref([14, 23, 21, 17])

const heatmapOptions = ref({
  chart: { id: 'heatmap-chart' },
  dataLabels: { enabled: false }
})
const heatmapSeries = ref([
  { name: 'Series 1', data: [30, 40, 45, 50] },
  { name: 'Series 2', data: [20, 30, 25, 40] }
])

const treemapOptions = ref({ chart: { id: 'treemap' } })
const treemapSeries = ref([{ name: 'A', data: 30 }, { name: 'B', data: 40 }, { name: 'C', data: 25 }])

const radialOptions = ref({ chart: { id: 'radial-chart' } })
const radialSeries = ref([70])

const rangeBarOptions = ref({
  chart: { id: 'range-bar' },
  plotOptions: { bar: { horizontal: true } },
  xaxis: { type: 'numeric' }
})
const rangeBarSeries = ref([
  { name: 'Range', data: [{ x: 'Task 1', y: [1, 5] }, { x: 'Task 2', y: [2, 7] }] }
])

const boxPlotOptions = ref({ chart: { id: 'box-plot' } })
const boxPlotSeries = ref([
  { type: 'boxPlot', data: [{ x: 'A', y: [10, 20, 30, 40, 50] }, { x: 'B', y: [15, 25, 35, 45, 55] }] }
])

const candlestickOptions = ref({ chart: { id: 'candlestick' } })
const candlestickSeries = ref([
  {
    data: [
      { x: '2023-01-01', y: [10, 15, 5, 12] },
      { x: '2023-01-02', y: [12, 18, 10, 15] }
    ]
  }
])
</script>
