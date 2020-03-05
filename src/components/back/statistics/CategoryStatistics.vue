<template>
  <div class="content">
      <ve-pie :data="chartData" ></ve-pie>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
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
