<template>
  <div class="content">
      <ve-pie :data="chartData" :extend="extend"></ve-pie>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    this.extend = {
        series: {
          label: { show: true, position: "top" }
        }
    }
    return {
      chartData: {
        columns: ['title', 'numbers'],
        rows: [
        ]
      }
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      axios.get('/statistics/bookStorageByCategory').then(res => {
        this.chartData.rows = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
