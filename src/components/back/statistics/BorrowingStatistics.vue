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
        // metrics: ['yesterdayApply', 'yesterdayHandle', 'yesterdayReturn'],
        // dimension: ['period'],
       labelMap: {
         
        'status': '申请借阅',
        'numbers': '处理借阅'
      },
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
