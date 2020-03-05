<template>
  <div class="content">
      <ve-pie :data="chartData" :settings="chartSettings" ></ve-pie>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    this.chartSettings = {
    }
    return {
      chartData: {
        columns: ['status', 'numbers'],
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
      axios.get('/statistics/bookBorrowingRatio').then(res => {
        this.chartData.rows = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
